/*global lp,bd */
define("launchpad/widgets/advanced-content-template/draggable-ice", ['jquery'], function ($) {

    "use strict";

    /**
     * Draggable behavior for copyright text on the promo carousel
     *
     * An element called "Grippy" appears above the draggable area and dragging grippy,
     * causes the draggable area to move
     *
     * @param $
     * @param widget
     * @param options
     * @returns {{init: Function, position: Function, grippy: {show: Function, hide: Function}}}
     * @constructor
     */
    var DraggableICEBehavior = function (widget, options) {

        /**
         * Configuration object
         * @type {Object}
         */
        var _config = $.extend({
            draggableAreaSelector:   ".lp-content-text-area",
            containersSelector:      ".lp-promo-slide",
            grippyContents:          "Drag",
            draggableClass:          "draggable",
            preferenceName:          "content-position",
            defaultCoordinates:      {
                top:  '50px',
                left: '50px'
            }
        }, options);

        /**
         * List of elements to drag
         */
        var _containers;

        /**
         * Widget DOM element
         */
        var $body = $(widget.body);

        /**
         * "Constants" for code maintainability
         */
        var GRIPPY_CLASS = 'lp-grippy';
        var ANIMATION_DURATION = 400;

        /**
         * Object holding coordinates of contents
         */
        var _coordinates;

        /**
         * Where we are in portal manager, or public site
         */
        var _designMode = true;

        /**
         * Initialization of draggables and droppables
         *
         * @return undefined
         */
         var init = function(designMode) {
            _designMode = !!designMode;
            _setupContainers();

            try {
                _coordinates = JSON.parse(widget.getPreference(_config.preferenceName));
            } catch (e) {
                _coordinates = _config.defaultCoordinates;
            }

            _positionContent();
        };

        /**
         * Setup containers for the draggable ICE elemenents.
         *
         * NOTE: A number of CSS properties (like absolute position) are needed for the dragging to work.
         * Best thing is to set them in the CSS files, but as a last resort, we set them inline with JS, if they are not set
         *
         * @return undefined
         */
        var _setupContainers = function() {
            _containers = $(_config.containersSelector, $body);

            _containers.each(function (index, value) {
                var el = $(value).find(_config.draggableAreaSelector);

                if (_designMode) {
                    attachGrippy(el);
                }

                if (el.css('position') !== 'absolute') {
                    el.css('position', 'absolute');
                }
            });
        };


        /**
         * Create & attach grippy to the element we want to drag.
         *
         * @return undefined
         */
        var attachGrippy = function(el) {
            var grippy = $('<div>' + _config.grippyContents + '</div>')
            .addClass('lp-grippy');
            grippy.appendTo(el);

            // Track grippy's hover state
            grippy.hover(function() {
                grippy.data('is:hover', true);
            }, function() {
                grippy.data('is:hover', false);
            });

            el.hover(function () {
                grippy.show();

                // Cancel hiding if reused here
                if (grippy.data('timeout')) {
                    clearTimeout(grippy.data('timeout'));
                }
            }, function () {
                var timeoutId = setTimeout(function() {
                    if ( !grippy.data('is:hover') ) {
                        grippy.hide();
                    }
                }, 500);
                grippy.data('timeout',  timeoutId);
            });

            makeDraggable(el, grippy, {
                onStop: function(element) {
                    _refreshCoordinates(element.attr('id'), element);
                }
            });
        };


        /**
         * Make element draggable.
         *
         * @return undefined
         */
        var makeDraggable = function(element, $handle, opt) {
            opt = $.extend({onStop: function() {}, prevent: true}, opt);

            var mouseMoveFn;

            // Called when mouseup for this grippy is fired
            var mouseUpFn = function() {
                // Cleanup
                element.removeClass(_config.draggableClass);
                element.parents().unbind("mousemove", mouseMoveFn);
                $(document).unbind("mouseup", mouseUpFn);

                // Call appropriate handler
                opt.onStop(element);
            };

            $handle.on("mousedown", function(e) {
                if (opt.prevent) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                element.addClass(_config.draggableClass);

                var drg_h = element.outerHeight(),
                    drg_w = element.outerWidth(),
                    pos_y = element.offset().top + drg_h - e.pageY,
                    pos_x = element.offset().left + drg_w - e.pageX;

                mouseMoveFn = function(e) {
                    var top  = e.pageY + pos_y - drg_h,
                        left = e.pageX + pos_x - drg_w;

                    // Constraintment inside widget body
                    var minTop = $body.offset().top,
                        maxTop = minTop + $body.outerHeight(),
                        minLeft = $body.offset().left,
                        maxLeft = minLeft + $body.outerWidth();

                    if ((top < minTop || top > maxTop - 20) || (left < minLeft || left > maxLeft - 20)) {
                        return;
                    }

                    // Update position
                    element.offset({
                        top: top,
                        left: left
                    });
                };
                element.parents().on("mousemove", mouseMoveFn);
                $(document).on("mouseup", mouseUpFn);
            });
        };

        /**
         * Update the coordinates for the content of a specific element
         *
         * @param  {Object} element jQuery object of the element
         * @return undefined
         */
        var _refreshCoordinates = function(id, element) {
            _coordinates[id] = {
                top:  element.css('top'),
                left: element.css('left')
            };

            widget.setPreference(_config.preferenceName, JSON.stringify(_coordinates));
            widget.model.save();
        };


        /**
         * Position the ICE content on the screen, based on the preferences
         *
         * @return undefined
         */
        var _positionContent = function() {
            var text = _containers.find(_config.draggableAreaSelector);

            var _coords = _coordinates[_containers.attr('id')];

            if (_coords === 'undefined' || !_coords) {
                _coords = {
                    top:  _config.defaultCoordinates.top,
                    left: _config.defaultCoordinates.left
                };
            }

            text.css({
                top:  _coords.top,
                left: _coords.left
            });

            text.animate({opacity: 1}, ANIMATION_DURATION);
        };

        return {
            init: init
        };
    };

    return DraggableICEBehavior;
});
