/*global b$, gadgets, lp, bd, window, console $*/
(function (b$, gadgets, lp, bd, window, $) {
    "use strict";

    //maps behavior tags to container details
    var containerTagsMap = null;

    /**
     * Loads all container in the portal and stores those with a behavior tag in the containerTagMap
     * This can be shared amongst all container instances
     *
     * @returns {*}
     */
    function loadContainersWithBehaviors() {

        var xhr;

        if(!containerTagsMap) {
	        var remote = window.b$.portal.config.remoteRoot ?
		        window.b$.portal.config.remoteRoot : b$.portal.config.serverRoot;

            xhr = $.ajax({
                url: remote + '/portals/' + b$.portal.portalName + '/containers.xml',
                data: {
                    ps: 100,
                    pc: false,
                    f: 'tag.type(eq)behavior'
                },
                dataType: 'xml',
                type: 'GET'
            });
            xhr.done(function(response) {
                containerTagsMap = {};
                var containers = response.getElementsByTagName('container');

                var checkTagsAndAddToMap = function(tag) {

                    if(tag.type === "behavior") {
                        containerTagsMap[tag.value] = container;
                    }
                };

                for (var i = 0; i < containers.length; i++) {
                    var container = b$.portal.portalServer.itemXML2JSON(containers[i]);
                    if(container.tags) {
                        container.tags.forEach(checkTagsAndAddToMap);
                    }
                }
            });
            xhr.fail(function(e){
                console.log("Couldn't load containers", e);
            });
        } else {
            xhr = $.Deferred();
            xhr.resolve({}, 200);
        }

        return xhr;
    }

    /**
     * How this container works:
     * 1. All containers in this portal are loaded and parsed. We keep a reference to those containers
     *    with a tag of type 'behavior'
     * 2. When a widget fires a pubsub event, the RetailBehaviors maps that pubsub event to a behavior tag and
     *    calls loadByBehavior on this container.
     * 3. Using the behavior tag, loadByBehavior remotely fetches the relevant container
     *    and inserts into the DOM as a direct child
     * 4. showByBehavior actually shows the container and hides other direct children
     * 5. The behavior is pushed onto the url state, so the back button and page refreshes work.
     *
     * On first load the url2state mechanism kicks in with a default state. Therefore, the state property
     * of this container should contain the default behavior tag. e.g: [$1:home]
     *
     * This container uses the title of the last displayed child container to update its own title
     */
    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');
    Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;

        this.loadContainersPromise = loadContainersWithBehaviors();
    }, {
        localName: 'MobileDeckContainer',

        /**
         * Sets up the container
         * @constructor
         */
        DOMReady: function() {
            //attach FastClick to body of page to remove 300ms delay on WebKit mobile browsers
            b$.mobile.gestures.FastClick.attach(document.body);

            var self = this;
            //only once the containers have loaded
            this.loadContainersPromise.done(function() {

                //the container should be configured to have a default state, such as 'home'
                var state = self.getPreference("state");
                self.loadByBehavior(state, function() {
                    self.showByBehavior(state);
                });
                //update display on back
                window.addEventListener("popstate", function() {
                    var state = window.location.pathname.split("//")[1];
                    self.showByBehavior(state);
                });
            });
        },

        /**
         * Loads children given th behavior tag
         * @param childTag
         * @param callback
         */
        loadByBehavior: function(childTag, callback) {
            var container = containerTagsMap[childTag];
            if(container) {
                var containerName = container.name;
                var containerEl = document.getElementById(containerName);
                if(containerEl) {
                    //alread loaded
                    if(typeof callback === "function") {
                        callback();
                    }
                } else {
                    var bdocModel = b$.portal.portalModel;
                    var bdom = b$.portal._buildModelFromJSON(bdocModel, container);

                    b$.portal.controllers.portal.connectToModel(bdom, b$.portal.portalView);
                    this.model.appendChild(bdom);

                    if(typeof callback === "function") {
                        callback();
                    }
                }
            } else {
                console.warn("No container found that matches the behavior [" + childTag + "]");
            }
        },

        /**
         * Shows that child that matches the given behavior tag and updates the url state
         * @param childTag
         */
        showByBehavior: function(childTag) {

            //emulate tabs
	        if(!lp.util.isDesignMode()) {
		        $(this.htmlNode).children(".lp-mobiledeck-mainarea").children().hide();
	        }
	        var el = document.getElementById(containerTagsMap[childTag].name);
	        $(el).show();

            //url 2 state
            var path = window.location.pathname;
            var currentState = path.split("//")[1];
            if(currentState !== childTag) {
                var baseUri = path.split("//")[0];
                var stateUri = baseUri + "//" + childTag;
                window.history.pushState({
                    tag: childTag
                }, null, stateUri);
            }
            window.scrollTo(0, 0);
        }
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window.launchpad.MobileDeckContainer(data);
            return sTemplate;
        }
    });
})(b$, gadgets, lp, bd, window, $);
