/*global window be b$ bd lp*/

/**
 * Copy of out of the box navigation, with a few tweaks
 *
 * Copyright 2011 Backbase B.V.
 * \@author DI (FH) Johannes Neugschwentner \[johannes@backbase.com]
 */
define(["jquery",
		"launchpad/lib/common/util"], function ($, util) {
    "use strict";

    /**
     * @param widget
     * @constructor
     */
    var NavShortcuts = function (widget) {
        this.widget = widget;
        this.$widget = $(widget.body);
    };

    NavShortcuts.prototype.init = function () {
        var self = this,
            url = window.location.href;

        if (util.isDesignMode) {
            /*
             * If this is the first initialization we need to
             */
            if (!this.widget.model.getPreference("navShow")) {
                var navRoot = this.widget.model.getPreference('navRoot');
	            if(navRoot) {
	                be.utils.ajax({
	                    url: b$.portal.config.serverRoot + "/portals/" + b$.portal.portalName + "/links/" + navRoot + ".xml",
	                    dataType: "xml",
	                    cache: false,
	                    success: function (responseData) {
	                        var json = bd.xmlToJson({xml: responseData});
	                        var defaultUid = json.link.uuid;

	                        self.widget.model.setPreference("navShow", defaultUid);
	                        self.widget.model.save();
	                        self.widget.refreshHTML();
	                    }
	                });
	            }
            }
        }

        /*
         * decoupling the obtrusive event handler from the template
         * activate the current navigation item by comparing the URL with the anchors href and setting a bootstrap class
         */
        self.$widget
            .find("li > a")
            .off()
            .on("click", function (ev) {
                return be.Nav.URLHandler(this);
            })
            .filter(function (i) {
		        var href = $(this).attr("href");
		        var lastUrlPart = url.substr(url.lastIndexOf("/"));
		        var isActive = href.indexOf(lastUrlPart) > -1;
		        return isActive;
            })
            .parent()
            .addClass("active");
    };

    return function(widget) {
        var widgetWrapper = new NavShortcuts(widget);
        widgetWrapper.init();
        return widgetWrapper;
    };
});
