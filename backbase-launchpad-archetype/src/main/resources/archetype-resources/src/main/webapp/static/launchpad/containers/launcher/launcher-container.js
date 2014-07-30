/*global b$, gadgets, lp, bd, window, console, Hammer, $*/
(function(b$, gadgets, lp, bd, window, $) {

    "use strict";

    var prefs = {
        SCROLL_UP: "scrollUp",
        AREA: "area",
        NO_FORCE_CHROME: "noForceChrome",
        CHROME: "widgetChrome",
        BEHAVIORS: "behaviors"
    };

    var chromes = {
        TAB: "$(contextRoot)/static/launchpad/chromes/launcher/chrome-tab.html",
        SLIDE: "$(contextRoot)/static/launchpad/chromes/launcher/chrome-slide.html",
        BLANK: "$(contextRoot)/static/launchpad/chromes/blank/chrome-blank.html"
    };

    var selectors = {
        CHROME_TAB:         ".lp-launcher-tab",
        CHROME_TAB_LINK:          ".lp-launcher-sidebar .lp-chrome-launcher-tab .lp-launcher-tab",
        CHROME_SLIDE_TAB_LINK:    ".lp-launcher-sidebar .lp-chrome-launcher-slide .lp-launcher-tab",
        CHROME_CONTENT:      ".lp-launcher-tab-widget",

        TOGGLE:      ".lp-launcher-toggle",
        SIDEBAR:     ".lp-launcher-sidebar",
        SIDEBAR_CONTROLLER: ".lp-launcher-sidebar-controller",
        SIDEBAR_BUTTON: ".lp-launcher-sidebar-button a",
        LEFT_SIDEBAR: ".lp-launcher-left-sidebar",
        RIGHT_SIDEBAR: ".lp-launcher-right-sidebar",
        LAUNCHER_CONTENT: ".lp-launcher-main",
        NOTIFICATIONS:     ".lp-launcher-notifications",
        CONTENT:     ".lp-launcher-content",
        NAVBAR:      ".lp-launcher-navigation .navbar",
        EDIT_BUTTON: ".lp-launcher-sidebar-footer .lp-button",
        CHECKBOX:    ".bp-checkbox",
        PAGE_CONTAINER:    ".lp-page-layout-container",

        OVERLAY: "#lp-launcher-overlay"
    };

    var states = {
        // should go on the container root (body) element
        COLLAPSED:"lp-launcher-collapsed",

        // should go on the widget chrome root element (SELECTORS.CHROME_ROOT)
        ACTIVE:"active",

        // should go on the EDIT_BUTTON
        BUTTON_ACTIVE:"lp-button-active",

        // should go on the sidebar/launcher element (SELECTORS.SIDEBAR)
        EDIT_MODE:"lp-launcher-edit-mode",

        // should go on the widget chrome root element (SELECTORS.CHROME_ROOT)
        HIDDEN:"lp-launcher-hidden-widget",

        // should go on the checkbox (SELECTORS.CHECKBOX)
        CHECKED:"bp-checked",

        // detect IE
        IE_BROWSER: (window.ActiveXObject || "ActiveXObject" in window)
    };

    var TRANSITION_DURATION = 250;

    var Container = b$.bdom.getNamespace("http://backbase.com/2013/portalView").getClass("container");
    Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;
    },{
        localName: 'LauncherContainer',
        /**
         * When the container is ready!
         * @returns {*}
         */
        DOMReady: function () {

            var self = this;
            this.$container = $(this.htmlNode);

            //configuration
            this.scrollUp = lp.util.parseBoolean(this.getPreference(prefs.SCROLL_UP));

            //ensure footer or other items below are cleared by initial size of launcher
            this.$notifications = this.$container.children(selectors.NOTIFICATIONS);
            this.$sideBarCont = this.$container.find(selectors.SIDEBAR_CONTROLLER);
            this.$leftSideBar = this.$container.find(selectors.LEFT_SIDEBAR);
            this.$rightSideBar = this.$container.find(selectors.RIGHT_SIDEBAR);
            this.$launcherContent = this.$container.find(selectors.LAUNCHER_CONTENT);
            this.$navBar = this.$container.find(selectors.NAVBAR);
            this.$pageContainer = $(document).find(selectors.PAGE_CONTAINER);

            //cache for commonly accessed values on scroll
            this.containerTop = this.$launcherContent.offset().top;
            this.sideBarHeight = this.$leftSideBar.height();
            window.setInterval(function() {

                self.containerTop = self.$launcherContent.offset().top;
                self.containerHeight = self.$launcherContent.height();
                self.sideBarHeight = self.$leftSideBar.height();
            }, 1000);

            // setup chrome for widgets dropped in the sidebar (areas "0" and "1") of the container
            this.addEventListener("DOMNodeInsertedIntoDocument", function(ev) {

                if (ev.target &&
	                ev.target.model &&
                    ev.target.model.tag === "widget") {

                    var area = parseInt(ev.target.model.getPreference("area"), 10); // Shifted by 1 from notifications
                    var $area = $(self.htmlNode).find(".bp-area").eq(area);
                    if( $area.data("behavior") === "force-chrome") {
                        self._setupChrome(ev.target);
                    }

                    window.setTimeout(function() {
                        self._fixContainerHeight();
                    }, 0);
                }
            });

            //listen for events fired from child notification widgets, so the scroll into view
            //when the overlay is visible
            this.addEventListener("notification-added", function() {
                var $overlay = $(selectors.OVERLAY);
                if($overlay.is(":visible")) {
                    self._animateScrollToTop();
                }
            });

            $(this.htmlNode).on("click", "button[data-action=lp-tab-hide]", function () {
                self._hideTabWidgets();
            });

            this._fixContainerHeight();

            // functionality for clicking on a tab
            this.$container.on("click", selectors.CHROME_TAB_LINK, function (event) {
                var targetId = $('a', this).attr("href").split("#")[1];
                var $target = $("#" + targetId);
                var widgetView = $target.closest(".bp-widget")[0].viewController;

                if($target.is(":visible")) {
                    //tab is visible, hide it
                    self._hideTabWidgets();
                } else {
                    // Keep refernece of the trigger element,
                    // so we can reset focus in widget closes
                    var $trigger = $(this);
                    self.load(widgetView, function() {
                        self._showTabWidget($target, $trigger);
                    });

                    $target.siblings(selectors.CHROME_TAB).addClass(states.ACTIVE);
                }
                event.preventDefault();
            });

            // functionality for a sliding tab
            this.$container.on("click", selectors.CHROME_SLIDE_TAB_LINK, function (e) {

                var target = $('a', this).attr("href").split("#")[1];
                var $target = $("#" + target);

                //height is animated with js for older browsers (width is only when minimized so not as important)
                var toOpen = !$target.is(":visible");
                $target.closest(".bp-widget")
                    .toggleClass("lp-launcher-open", toOpen)
                    .toggleClass("lp-launcher-close", !toOpen);

                $target.closest(".bp-widget-body")
                    .attr("aria-hidden", !toOpen);

                if (self.$openWidget) {
                    $target.slideToggle({
                        duration: TRANSITION_DURATION,
                        step: function () {
                            $(window).trigger('reposition.widget.' + self.$openWidget.prop('id'));
                        },
                        done: function() {
                            $(window).trigger('reposition.widget.' + self.$openWidget.prop('id'));
                        }
                    });
                } else {
                    $target.slideToggle(TRANSITION_DURATION);
                }
                e.preventDefault();
            });

            if(typeof Hammer !== "undefined") {

                var launcherSwipe = new Hammer(window, {
                    swipe_velocity:0.4
                }).on("dragleft dragright swipeleft swiperight", function(ev) {

                    var eventType = ev.type;

                    // prevent left/right swipes from scrolling page
                    ev.gesture.preventDefault();
                    if(eventType === 'dragleft' || eventType === 'dragright') { return; }

                    // slide content left/right
                    if (eventType === 'swipeleft') {
                        self._slideSideBar('right', true);
                    } else if (eventType === 'swiperight') {
                        self._slideSideBar('left', true);
                    }
                });
            }

            this.$sideBarCont.find(selectors.SIDEBAR_BUTTON).bind("click", function (e) {
                var action = $(this).data('action');
                self._slideSideBar(action);
            });

            // Prevent sidebar to get focus, other than programmatically
            this.$leftSideBar.bind("blur", function() {
                $(this).removeAttr('tabindex');
            });

            $('.lp-chrome-launcher-slide-open', this.container).addClass('lp-launcher-open');
            this.$container.find('.lp-launcher-headbar').text(document.title);
        },

        /**
         * Lazy loading widget children
         * @param widgetView
         * @param callback
         */
        load: function(widgetView, callback) {
            if(!widgetView._displayed) {
                widgetView.createDisplay(true);
            }
            if(typeof callback === "function") {
                callback();
            }
        },

        /**
         * Lazy load widgets matching the given 'behavior' tag and invoke a callback on complete
         * @param childBehaviorTag
         * @param callback
         */
        loadByBehavior: function(childBehaviorTag, callback) {

            var matchingChildren = lp.util.findMatchingChildrenByTag(this, childBehaviorTag);

            if(matchingChildren.length > 0) {
                var widgetView = matchingChildren[0];

                //launcher tab widgets buildDisplay calls are postponed until the tab is clicked (see portal-setup.js)
                this.load(widgetView, callback);
            } else {
                console.warn("Couldn't load widget, no children with the behavior tag [" + childBehaviorTag + "] were found.");
            }
        },

        /**
         * Shows the first widget matching the given 'behavior' tag
         * @param childBehaviorTag
         */
        showByBehavior: function(childBehaviorTag) {

            var matchingChildren = lp.util.findMatchingChildrenByTag(this, childBehaviorTag);
            var $trigger = false;

            if(matchingChildren.length === 0) {
                console.warn("Couldn't show widget, no children with the behavior tag [" + childBehaviorTag + "] were found.");
            } else {
                //warn, but still proceed to show the first matching child
                if(matchingChildren.length > 1) {
                    console.warn("More than one widget with the behavior tag [" + childBehaviorTag + "] was  found. Selecting the first.");
                }

                var $widgetNode = $(matchingChildren[0].htmlNode);
                var $target = $widgetNode.find(".lp-launcher-tab-widget");

                if (childBehaviorTag === 'transactions') {
                    $trigger = true;
                }

                // Check if this is tab widget
                if ( $target.length ) {
                    this._showTabWidget($target, $trigger);
                } else {
                    // ...otherwise focus the whole widget
                    $widgetNode.attr('tabindex', -1);
                    $widgetNode.on('blur', function() {
                        $widgetNode.removeAttr('tabindex');
                        $widgetNode.off('blur');
                    });
                    $widgetNode.focus();
                }
            }
        },

        /**
         * Forcing a chrome on the widget dropped
         *
         * @param widget
         * @private
         */
        _setupChrome: function (widget) {

            //Decide whether to force a chrome
            // 1) widget must be dropped in one of the sidebar areas and not in the main content
            // 2) widget must not have one of the chromes related to this container (tab, slide, blank)
            var chrome = widget.getPreference("widgetChrome"),
                area = widget.getPreference("area"),
                $area = $(this.htmlAreas[area]);
            var noForceChrome = lp.util.parseBoolean(widget.getPreference(prefs.NO_FORCE_CHROME));
            if(!noForceChrome && $area.data("behavior") === "force-chrome") {
                widget.setPreference(prefs.CHROME, chromes.TAB);
                widget.setPreference(prefs.NO_FORCE_CHROME, true);
                widget.model.save(function() {
                    widget.refreshHTML(function() {
                    });
                });
            }
        },

        /**
         * the side bar is fixed, which means it will flow out of the container
         * the container must be set to be the height of the sidebar
         */
        _fixContainerHeight: function() {

            var additionalPadding = bd.designMode ? 100 : 10;

            if(parseInt(this.sideBarHeight, 10) > 0) {
                this.$container.css("min-height", this.sideBarHeight  + additionalPadding);
            }
        },

        _keydownHandler: function(evt) {
            // need to use keyCode for ie8
            if (evt.keyCode === 27) {
                this._hideTabWidgets();
            }
        },

        _keyupHandler: function(evt) {
            // Check if user is tabbing, and reset focus to the widget
            // if he tries to move behind the overlay
            // need to include .keyCode for ie8
            if (evt.keyCode === 9 && !this._isElementAboveOverlay( $(document.activeElement) )) {
                this.$openWidget.focus();
            }
        },

        /**
         * Check if element is a child of one the always visible containers.
         *
         * @param element The element to check
         * @private
         */
        _isElementAboveOverlay: function(element) {
            return this.$openWidget.find(element).length ||
                this.$leftSideBar.find(element).length ||
                this.$notifications.find(element).length;
        },

        /**
         *
         * @param $target
         * @private
         */
        _showTabWidget: function ($target, $trigger) {

            var self = this;
            var $content = this.$container.find(selectors.CONTENT);

            var setTargetPos = function() {
                var widgetTop = $target.closest(".bp-widget").offset().top;
                var targetTop = (widgetTop - self.containerTop) * -1;
                var widthAdjust = 2;
                var contentWidth = $content.find(".--area").width();

                if($(window).width() < 769) {
                    widthAdjust = 0;
                    contentWidth = $(window).width();
                }

                self.$pageContainer.css({'padding-bottom':targetTop * -1 +'px'});
                self.$container.css({'padding-bottom':targetTop * -1 +'px'});

                $target.css({
                    top: targetTop,
                    width: contentWidth + widthAdjust
                });
            };

            setTimeout(function() {
                self.$trigger = $trigger;
                $target.attr('tabindex', -1);
                $target.focus();
            }, 50);

            //add resize handler for current target
            $(window).on("resize.launcher."  + $target.prop("id") + " reposition.widget." + $target.prop("id"), function() {
                setTargetPos();
            });

            this._hideTabWidgets($target, true);

            //position target
            setTargetPos();
            this._showOverlay();
            this.$openWidget = $target;
            $target.show();

            if (this.$openWidget) {
                var widget = this.$openWidget.closest(".bp-widget")[0];
                if (widget.viewController.perspective) {
                    widget.viewController.setPerspective("Widget");
                }
            }


            gadgets.pubsub.publish("Launcher:onOpen", $target.closest("bp-widget").viewController);

            // Attach keyboard listeners - use document for ie8
            $(document).bind('keydown', $.proxy( self, "_keydownHandler" ));
            $(document).bind('keyup', $.proxy( self, "_keyupHandler" ));

            if ($(document).width() < 769 && $trigger) {
                self._slideSideBar('left');
            }
        },

        /**
         *
         * @param $target
         * @param keepOverlay
         * @private
         */
        _hideTabWidgets: function ($target, keepOverlay) {
            var self = this;

            // Try to reset focus on the trigger element,
            // if the focus is still inside the open widget
            var activeElement = $(document.activeElement);

            self.$pageContainer.css({'padding-bottom':0});

            if (!keepOverlay && this.$openWidget &&
                (this.$openWidget[0] === activeElement[0] || this.$openWidget.find(activeElement).length)
                ) {
                setTimeout(function() {
                    var $link;
                    if (self.$trigger) {
                        $link = $(self.$trigger.find('a'));
                    } else {
                        $link = self.$leftSideBar;

                        // Allow sidebar to be programmatically focused
                        $link.attr("tabindex", -1);
                    }
                    $link.focus();
                    self.$trigger = null;
                });
            }

            if (this.$openWidget) {
                var widget = this.$openWidget.closest(".bp-widget")[0];
                widget.viewController.setPerspective("Minimized");
            }

            $target = $target || $([]);
            this.$container.find(selectors.CHROME_TAB).removeClass(states.ACTIVE);
            this.$container.find(selectors.CHROME_CONTENT).not($target).hide();
            this.$openWidget = null;
            if(!keepOverlay) {
                this._hideOverlay();
            }

            // Remove keyboard listeners when widget closes
            $(document).unbind( "keydown", this._keydownHandler );
            $(document).unbind( "keyup", this._keyupHandler );
        },

        /**
         * Scroll to specific element in page.
         * @param element
         * @private
         */
        _animateScrollToElement: function(element) {
            $("html, body").animate({
                scrollTop: $(element).offset().top
            }, 200);
        },

        /**
         *
         * @private
         */
        _showOverlay:function () {

            var $overlay = $(selectors.OVERLAY);
            if ($overlay.length === 0) {
                $overlay = $("<div id='lp-launcher-overlay' class='lp-launcher-overlay lp-overlay' />");
                //this.$container.before($overlay);
                $('#main .lp-page-children').prepend($overlay);
            }

            if($overlay.is(":hidden")) {
                $overlay.fadeIn(TRANSITION_DURATION);

                this._animateScrollToTop();
            }
        },

        _animateScrollToTop: function() {
            $("html, body").animate({
                scrollTop: this.scrollUp ? this.containerTop - 10 : 0
            }, 200);
        },

        /**
         *
         * @private
         */
        _hideOverlay:function () {

            $(selectors.OVERLAY).fadeOut(TRANSITION_DURATION);
            $(window).off("resize.launcher");

            $("html, body").animate({ scrollTop: 0 }, 200);
            // allow scrolling again
            $("html,body").css("overflow", "");
            $("body").css("padding-right", 0);
        },
        /**
         * Handle side bar both on the desktop and mobile view.
         * @private
         *
         */
        _slideSideBar: function(action, isSwipe){

            var container = this.$container;
            var leftOpen = container.hasClass('lp-launcher-left');
            var rightOpen = container.hasClass('lp-launcher-right');

            if (!states.IE_BROWSER){
                lp.anim._transition({
                    element:this.$launcherContent[0],
                    duration:'.3s'
                });
                lp.anim._transition({
                    element:this.$navBar[0],
                    duration:'.3s'
                });
            }

            if (action === 'left') {
                if (rightOpen) {
                    container.removeClass('lp-launcher-right');
                }
            } else if (action === 'right') {
                if (leftOpen) {
                    container.removeClass('lp-launcher-left');
                }
            }
            if(isSwipe && (rightOpen || leftOpen)) {
                return;
            }
            container.toggleClass('lp-launcher-' + action);
        }
    });

})(b$, gadgets, lp, bd, window, jQuery);