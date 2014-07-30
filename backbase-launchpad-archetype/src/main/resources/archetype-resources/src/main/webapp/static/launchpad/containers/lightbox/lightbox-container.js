/*globals window jQuery b$ bd lp gadgets*/
(function (b$, bd, lp, $, gadgets, window) {
    "use strict";

    var FADE_IN = 0;
    var FADE_OUT = 0;

	var NS = b$.bdom.getNamespace("http://backbase.com/2012/portalView");
	var Container = NS.classes.container;
	NS.registerElement("LightboxContainer", Container.extend(function(bbDocument, namespaceURI, localName, node) {

		Container.call(this, bbDocument, namespaceURI, localName, node);
		this.isPossibleDragTarget = true;
	}, {
        readyHTML: function () {

            var title = this.getPreference("title"), self = this;

            var $body = $("body");
            var $lightbox = $(this.htmlNode);

            //lightbox positioning
            var lightboxWidth = parseInt(this.getPreference("width"), 10);
            var lightboxHeight = parseInt(this.getPreference("height"), 10);

            var setLightboxPos = function () {

                var lightboxOffset = $lightbox.offsetParent().offset();
                var lightboxPaddingX = 30; //$lightbox.outerWidth() - lightboxWidth;
                var lightboxPaddingY = 30; //$lightbox.outerHeight() - lightboxHeight;

                var $window = $(window);
                var windowWidth = $window.width();
                var windowHeight = $window.height();

                var left, top, width, height;
                if (windowWidth - lightboxPaddingX < lightboxWidth) {
                    left = 15;

                    //move the lightbox up on smaller screens
                    top = (windowHeight - lightboxHeight) / 4;
                    width = windowWidth - lightboxPaddingX;
                } else {
                    left = (windowWidth - lightboxWidth) / 2;
                    width = lightboxWidth;
                }
                if (windowHeight - lightboxPaddingY < lightboxHeight) {
                    top = 0;
                    height = windowHeight - lightboxPaddingY;
                } else {
                    //if top has not already been set
                    if(!top) {
                        top = (windowHeight - lightboxHeight) / 2;
                    }
                    height = lightboxHeight;
                }

                $lightbox.css({
                    width:  width,
                    left: left - lightboxOffset.left + $window.scrollLeft(),
                    top: top - lightboxOffset.top + $window.scrollTop()
                });

                $(".lp-lightbox-inner", $lightbox).css({
                    height: height
                });
            };

            $(window).on("resize", function () {
                if ($lightbox.hasClass("lp-lightbox-on")) {
                    setLightboxPos();
                }
            });

            //lightbox launching
            var showLightbox = function () {

                $lightbox.addClass("lp-lightbox-on");
                lp.util.showBackdrop();
                $lightbox.show();
                setLightboxPos();
                $body.css("overflow", "hidden");
                $lightbox.find(".lp-springboard-widget-body").show();
            };

            var openTriggers = this.getPreference("open-trigger").split(" ");
            openTriggers.push(this.model.name + "_open");
            var i, len = openTriggers.length;
            for (i = 0; i < len; i++) {
                var openTrigger = openTriggers[i];
                if (openTrigger.toLowerCase() === "onload") {
                    //special triggers
                    $(window).ready(showLightbox);
                } else {
                    //user triggers
                    gadgets.pubsub.subscribe(openTriggers[i], showLightbox);
                }
            }

            //lightbox closing
            var hideLightbox = function () {
                lp.util.hideBackdrop();
                $lightbox.fadeOut(FADE_OUT, function () {
                    $lightbox.css({
                        width:  "",
                        height: "",
                        left:   "",
                        top:    ""
                    });
                    $lightbox.removeClass("lp-lightbox-on");
                    $body.css("overflow", "");

                    if (bd.designMode) {
                        $lightbox.show();
                    }
                });
            };

            var closeTriggers = this.getPreference("close-trigger").split(" ");
            closeTriggers.push(this.model.name + "_close");
            len = openTriggers.length;
            for (i = 0; i < len; i++) {
                gadgets.pubsub.subscribe(closeTriggers[i], hideLightbox);
            }

            $lightbox.on("click", ".lp-lightbox-close", hideLightbox);
            $("#lp-page-backdrop").on("click", hideLightbox);

            //design mode tools
            if (bd.designMode) {
                var previewHtml =
                    "<div class='lp-lightbox-preview lp-nonfunc-item'>" +
                        "<button class='lp-lightbox-open pull-right btn'>Open</button>" +
                        "<p>Lightbox: " + title + "</p>" +
                    "</div>";
                $lightbox.prepend(previewHtml);
                $lightbox.on("click", ".lp-lightbox-open", function () {
                    showLightbox();
                });
            }
            var showClose = this.getPreference("show-close");
            if (!bd.designMode && showClose === false || showClose === "false") {
                $lightbox.find(".lp-lightbox-close").hide();
            }

            // set the lightbox chrome title
            $lightbox.find('.lp-widget-title').html(title);

            this.model.addEventListener("PrefModified", function (evt) {
                var newTitle = self.getPreference("title");
                $lightbox.find('.lp-widget-title').html(newTitle);
                if (bd.designMode) {
                    $lightbox.find(".lp-lightbox-preview p").html("Lightbox: "+newTitle);
                }
            });

            return Container.prototype.readyHTML.call(this);
        },
        buildDisplay: function () {
            return Container.prototype.buildDisplay.call(this, this.htmlNode);
        }
    }));
})(b$, bd, lp, jQuery, gadgets, window);
