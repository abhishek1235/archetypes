/*global b$, gadgets, lp, bd, window, console $*/
(function (b$, gadgets, lp, bd, window, $) {

    "use strict";

    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');
    Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;

    }, {
        localName: 'WrapContainer',

        /**
         * Sets up the container
         * @constructor
         */
        DOMReady: function() {
            //Possible bug, DOMReady is fired twice and second time htmlNode is undefined
            if(this.htmlNode) {
                var $container = $(this.htmlNode);
	            var $chrome = $container.children(".lp-mobilewrap-chrome");

                //listen to the built in back button
                $container.on("click", ".lp-mobilewrap-back", function() {
                    window.history.back();
                });

                //listen for the logout button
	            $container.on("click", ".lp-mobilewrap-logout", function() {
		            var reallyLogout = window.confirm("Are you sure you want to logout?");
		            if(reallyLogout) {
			            var logoutUrl = lp.util.getServicesPath() + "/j_spring_security_logout";
			            $.get(logoutUrl).done(function () {
				            var home =
					            window.location.pathname.split("//")[0] + window.location.search + window.location.hash;
				            window.location.replace(home);
			            });
		            }
	            });

                //Design Mode special cases
                if(lp.util.isDesignMode()) {
                    //fix for wierd position: fixed behavior of chrome in design mode
                    $chrome.css("position", "relative");
                    $container.find(".lp-mobilewrap-chrome-spacer").hide();
                }
            }
        }
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window.launchpad.WrapContainer(data);
            return sTemplate;
        }
    });
})(b$, gadgets, lp, bd, window, $);
