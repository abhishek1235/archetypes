/*global bd */

/**
 * Google Analytics widget
 * @author marco@backbase.com, philip@backbse.com
 */
define(["jquery"], function ($) {

    "use strict";

    /**
     * Module Constructor
     * @constructor
     */
    var Analytics = function (widget) {

        var ref,
            tag;
        this.widget = widget;

        if (!bd.designMode) {
            //	add Google Analytics script
            ref = document.getElementsByTagName("script")[0];
            tag = document.createElement("script");
            tag.type = "text/javascript";
            tag.async = true;
            tag.src = ("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
            ref.parentNode.insertBefore(tag, ref);
        }
    };

    /**
     * Init method for widget initialization and preferences change
     * @param  {Object} widget widget instance
     * @return void
     */
    Analytics.prototype.init = function () {

        var self = this;

        var widget = this.widget;
        var $widget = $(this.widget.body),
            code = this.widget.getPreference("trackingCode");

        // (tracking code might have the string value 'undefined' if it is blank
        if(!code || code === "undefined") {
            code =  null;
        }

        if (!bd.designMode) {
            if(code) {
                // start tracking
                window._gaq = window._gaq || [];
                window._gaq.push(["_setAccount", code]);
                window._gaq.push(["_trackPageview"]);
            }
        } else {
            code = code || "<a>Please set a tracking code in this widget's preferences</a>";
            var previewHtml =
                "<div class='lp-google-analytics-info lp-nonfunc-bar'>" +
                    "<p>Google Analytics [ " + code + " ]</p>" +
                "</div>";
            $widget.html(previewHtml);
            $widget.on("click", "a", function() {
                self.widget.fireEvent("preferences-form", true, true, {
                    context: self.widget
                });
            });
        }
    };

    return function(widget) {
        var widgetWrapper = new Analytics(widget);
        widgetWrapper.init();
        widget.addEventListener("preferencesSaved", function () {
            widgetWrapper.init();
        });
        return widgetWrapper;
    };
});