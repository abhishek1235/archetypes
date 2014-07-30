/*global define bd*/

define(["jquery",
    "launchpad/widgets/advanced-content-template/draggable-ice",
    "launchpad/lib/common/util"], function($, DraggableICEBehavior, util) {

    "use strict";

    /**
     *
     * @param widget
     * @constructor
     */
    var ContentFactory = function (widget) {
        this.widget = widget;
    };

    /**
     * Initialize
     *
     */
    ContentFactory.prototype.init = function () {
        var isAccordion = /ContentAccordion/.test(this.widget.model.getPreference("templateUrl")),
            widgetWrapper;

        widgetWrapper = isAccordion ?
            new ContentAccordion(this.widget) :
            new AdvancedContentTemplate(this.widget);

        widgetWrapper.init();

        return widgetWrapper;
    };

    var initIce = function(widget) {

        if(bd && bd.iceCommon) {
            bd.iceCommon.onLoad(widget);
            //example of the local event
            widget.addEventListener('bdDrop.drop', function(e) {
                var items = e.detail.info.helper.bdDragData.fileDataArray;
                if(items.length && items[0].type.indexOf('folder')>-1){
                    e.stopPropagation();
                }
            });
        }
    };

    /**
     *
     * @param widget
     * @constructor
     */
    var AdvancedContentTemplate = function (widget) {

        var self = this;

        self.widget = widget;

        widget.updateBackground = function() {
            self.setBackground();
        };

        self.$widget = $(widget.body);
    };

    /**
     * Initialize
     *
     */
    AdvancedContentTemplate.prototype.init = function () {

        var self = this;

        initIce(this.widget);

        this.DraggableICEBehavior = new DraggableICEBehavior(this.widget, {});
        this.DraggableICEBehavior.init(bd.designMode);

        this.setHeight();

        //fix for wigets not being visible during initialization in PM
        if(this.$widget.is(":visible")) {
            this.setBackground();
        }


        this.widget.model.addEventListener("PrefModified", function(evt) {
            if (evt.attrName === "ImageOne") {
                self.setHeight();
                self.setBackground();
            }
        });

        $(this.widget.htmlNode).on("launchpad:show", function(e) {
            self.setBackground();
        });
    };

    AdvancedContentTemplate.prototype.setHeight = function () {

        //height of the widget can be optionally controlled by a preference
        var height = this.widget.getPreference("height");
        if(height) {
            this.$widget.height(height);
        }
    };

    AdvancedContentTemplate.prototype.setBackground = function () {

        //if the template has a background image
        var backgroundImage = this.$widget.find(".lp-background-image").find("img").prop("src");
        if(backgroundImage && backgroundImage.indexOf("blank.gif") === -1) {
            var setPageBackground = this.widget.getPreference("setPageBackground");
            if(setPageBackground) {
                util.setPageBackground(backgroundImage);
            } else {
                this.$widget.css({
                    "background-image" : "url(" + backgroundImage + ")",
                    "background-repeat" : "no-repeat",
                    "background-size" : "100% 100%"
                });
            }
        }
    };

    /**
     *
     * @param widget
     * @constructor
     */
    var ContentAccordion = function(widget) {
        this.widget = widget;
        this.$widget = $(widget.body);
    };

    /**
     * Init method of the LP advanced template
     *
     */
    ContentAccordion.prototype.init = function() {

        initIce(this.widget);

        var $collapsible = $('.lp-faq-content', this.$widget);

        $('.lp-faq-title', this.$widget).click(function() {
            var $target = $(this);
            if($target.hasClass('collapsed')) {
                $target.removeClass('collapsed');
                $target.find('span').addClass('rotate');
                $collapsible.slideDown(300);
            } else {
                $target.addClass('collapsed');
                $target.find('span').removeClass('rotate');
                $collapsible.slideUp(300);
            }
        });
    };

    return function(widget) {
        var widgetWrapper = new ContentFactory(widget);
        return widgetWrapper.init();
    };
});
