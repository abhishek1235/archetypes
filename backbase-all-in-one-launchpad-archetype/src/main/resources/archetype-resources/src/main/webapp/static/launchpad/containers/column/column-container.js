/*global b$, bd, jQuery, Mustache*/

(function (window, b$, bd, $, Mustache) {

    "use strict";

    var NS = b$.bdom.getNamespace('http://backbase.com/2012/portalView'),
        Container = NS.classes.container,

        PREFERENCES = {
            COLUMNS: "columns",
            GUTTER_WIDTH: "gutterWidth",
            SPAN_WIDTH: "spanWidth",
            GRID_SIZE: "gridSize"
        },

        CLASSES = {
            ROW: "row",
            CONTAINER: "container",
            SELECTED: "lp-columns-selected"
        },

        SELECTORS = {
            AREA: ".bp-area",
            CONTROLS_ADD: ".lp-columns-add",
            CONTROLS_REMOVE: ".lp-columns-remove"
        },

        SPAN_CLASS_PREFIX = "col-sm-",

        SPAN_CLASS_REGEX = /col-sm-(\d{1,2})/,

        TEMPLATES = {
            CONTROLS: '<div class="lp-columns-controls">' +
                '<a class="lp-columns-remove"></a>' +
                '<a class="lp-columns-add"></a>' +
                '</div>',
            AREA: '<div class="bp-area"></div>',
            COLUMNS: '<div class="bp-container lp-columns row">{{#columns}}<div class="bp-area col-sm-{{.}}"></div>{{/columns}}</div>'
        };

    NS.registerElement("ColumnContainer", Container.extend(function (bbDocument, namespaceURI, localName, node) {
        Container.call(this, bbDocument, namespaceURI, localName, node);
        this.isPossibleDragTarget = true;
    }, {

        /**
         * If no areas exist in DOM
         *
         * For new container - create 2 empty areas
         * For client-side rendering use Mustache
         */
        buildDisplay: function () {
            var $areas = $(this.htmlNode).children(SELECTORS.AREA),
                preference;

            if ($areas.length === 0) {
                preference = this.getPreference(PREFERENCES.COLUMNS);

                if (!preference) {
                    $(this.htmlNode).prepend(TEMPLATES.AREA + TEMPLATES.AREA);
                } else {
                    this.htmlNode = $(Mustache.to_html(TEMPLATES.COLUMNS, { columns: preference.split(",") }))[0];
                }

                this.htmlAreas = $(this.htmlNode).children(SELECTORS.AREA).toArray();
            }
            return Container.prototype.buildDisplay.call(this, this.htmlNode);
        },

        /**
         * Sets column sizes when container is ready
         */
        readyHTML: function () {
            var self = this;
            if (bd.designMode) {
                this._buildControls();

                // TODO: Bug in PortalClient, container isn't in DOM yet
                window.setTimeout(function () {
                    self._reflow();
                    self._bindEvents(self.htmlAreas);
                }, 0);
            }
        },

        /**
         * Creates controls & binds events for them
         */
        _buildControls: function () {
            var self = this,
                $controls = $(TEMPLATES.CONTROLS);

            $(this.htmlNode)
                .append($controls)
                .on("mouseenter",function () {
                    $controls.fadeIn();
                }).on("mouseleave", function () {
                    $controls.fadeOut();
                });

            $controls
                .on("click", SELECTORS.CONTROLS_ADD,function () {
                    self._addColumn();
                }).on("click", SELECTORS.CONTROLS_REMOVE, function () {
                    self._removeColumn();
                });
        },

        /**
         * Adding column
         *
         * 1. Checks if there is enough space
         * 2. Resizes columns to equal ones
         */
        _addColumn: function () {
            var parentSpan = this._getParentSpan(),
                $area,
                index = this._getSelectedIndex();

            if (parentSpan > this.htmlAreas.length) {
                $area = $(TEMPLATES.AREA);

                $(this.htmlAreas).eq(index).after($area);
                this.htmlAreas.splice(index + 1, 0, $area[0]);

                this._synchronize(this._calculateSizes());
                this._bindEvents($area[0]);
            }

        },

        /**
         * Removing column
         *
         * 1. Checks if there is more than one column left
         * 2. Resizes columns to equal ones
         * 3. Deletes widgets in the removed areas from the portal model
         */
        _removeColumn: function () {
            var index = this._getSelectedIndex(), self = this;

            if (this.htmlAreas.length > 1) {
                this._destroyWidgets(index, function () {
                    $(self.htmlAreas).eq(index).remove();
                    self.htmlAreas.splice(index, 1);
                    self._synchronize(self._calculateSizes());
                });
            }
        },

        /**
         * Delete all widgets of a specific area, from the portal model
         * @param  {int}   area     The area from which all widgets will be deleted
         * @param  {Function} callback function to execute when all ajax calls to the server have returned
         */
        _destroyWidgets: function (area, callback) {
            var i, widgetsDeleted = 0, widgets = [], child;
            for (i in this.model.get_childElements()) {
                if (this.model.get_childElements().hasOwnProperty(i)) {
                    child = this.model.get_childElements()[i];
                    if (parseInt(child.getPreference("area"), 10)===parseInt(area, 10)) {
                        widgets.push(child);
                    }
                }
            }
            if (widgets.length===0) {
                callback();
                return;
            }

            function cb(deleted) {
                return function () {
                    if (deleted === widgets.length) {
                        callback();
                    }
                };
            }
            // only way to know when all ajax calls have executed successfully
            // is to keep a counter
            for (i=0; i<widgets.length; i++) {
                widgets[i].destroyAndSave(cb(++widgetsDeleted));
            }
        },

        /**
         * Gets the index(starting 0) of selected area
         * Returns last one if no areas selected
         */
        _getSelectedIndex : function(){
            var result;

            $(this.htmlAreas).each(function(index, element) {
                if ($(element).hasClass(CLASSES.SELECTED)) {
                    result = index;
                }
            });

            return result || this.htmlAreas.length - 1;
        },

        /**
         * Reflows the columns if no preferences exists or columns' size bigger then parent
         */
        _reflow: function () {
            var columnPreference = this.getPreference(PREFERENCES.COLUMNS),
                areasSpan = this._getAreasSpan(),
                parentSpan = this._getParentSpan();

            if (!columnPreference || areasSpan > parentSpan) {
                this._synchronize(this._calculateSizes());
            }
        },

        /**
         * Bind resize & add/remove events
         */
        _bindEvents: function (areas) {
            var self = this,
                gutterWidth = this.getPreference(PREFERENCES.GUTTER_WIDTH),
                spanWidth = this._getSpanWidth();

            $(areas).each(function (index, area) {

                var $area = $(area),
                    startWidth,
                    $sibling,
                    siblingWidth;

                $area.resizable({

                    handles: "e,w",

                    grid: [spanWidth, 0],

                    minWidth: spanWidth,

                    /**
                     * Table resize
                     * Required: e-axis & free space in parent container
                     * MaxWidth: free space in parent container
                     *
                     * Column resize
                     * Required: sibling exists, can't be smaller than span1
                     * MaxWidth: sibling container size - 1
                     */
                    start: function (e, ui) {
                        var axis = $(this).data('resizable').axis,
                            maxWidth = $area.outerWidth(),
                            parentSpan,
                            areasSpan,
                            rowWidth = 0;

                        $(self.htmlAreas).each(function (index, element) {
                            var width = $(this).outerWidth();

                            rowWidth += width;
                            $(this).css("width", width);
                        });

                        startWidth = $(area).outerWidth();
                        $sibling = (axis === "e") ? $area.next(SELECTORS.AREA) : $area.prev(SELECTORS.AREA);

                        if ($sibling.length === 0) {
                            parentSpan = self._getParentSpan();
                            areasSpan = self._getAreasSpan();

                            if (axis === "e" && parentSpan > areasSpan) {
                                maxWidth += self._spanToPx(parentSpan - areasSpan);
                            }
                        } else {
                            siblingWidth = $sibling.outerWidth();
                            maxWidth += self._spanToPx(self._getSpanByClass($sibling) - 1);
                        }
                        $(this).resizable({ maxWidth: maxWidth - gutterWidth / 2 });
                    },

                    /**
                     * While resizing inverse sibling size if resizing columns
                     */
                    resize: function (e, ui) {
                        var gutterWidth = self.getPreference(PREFERENCES.GUTTER_WIDTH);

                        ui.element
                            .css("left", "0")
                            .css("width", ui.element.outerWidth() + gutterWidth);

                        if ($sibling.length !== 0) {
                            $sibling.css("width", siblingWidth - (ui.element.outerWidth() - startWidth));
                        }
                    },

                    /**
                     * When resize done: sync classes, save preferences & propagate event to child containers
                     */
                    stop: function (e, ui) {
                        self._synchronize();
                    }

                });

            });

            $(areas).on("click", function(){
                $(self.htmlAreas).removeClass(CLASSES.SELECTED);
                $(this).addClass(CLASSES.SELECTED);
            });
        },


        /**
         *  Calculate sizes:
         *  1. Columns should be equal
         *  2. If any space left - add it to last column
         */
        _calculateSizes: function () {
            var parentSpan = this._getParentSpan(),
                areasNumber = this.htmlAreas.length,
                areaSize = Math.floor(parentSpan / areasNumber),
                delta = parentSpan - areaSize * areasNumber;

            return $.map(new Array(areasNumber), function(element, index){
                if (index === areasNumber - 1) {
                    return areaSize + delta;
                }
                return areaSize;
            });
        },

        /**
         * Synchronize DOM & model
         *
         * 1. Remove jQuery UI Resize styles
         * 2. Use size from arguments or calculate the width
         * 3. Remove old and set new width class
         * 4. Update and save the preferences
         */
        _synchronize: function (sizes) {
            var self = this,
                columnPreference = [];

            $(this.htmlAreas).each(function (index, element) {
                var areaSize = sizes ? sizes[index] : self._pxToSpan($(this).outerWidth());

                columnPreference.push(areaSize);

                $(this)
                    .removeAttr("style")
                    .removeClass(function (index, css) {
                        var matches = css.match(SPAN_CLASS_REGEX);

                        return (matches) ? matches[0] : "";
                    }).addClass(SPAN_CLASS_PREFIX + areaSize);

            });

            this.setPreference(PREFERENCES.COLUMNS, columnPreference.join(","));
            this.model.save();
        },

        /**
         * Calculates span width based on element width
         * @returns {number}
         * @private
         */
        _getSpanWidth: function() {
            var gridSize = this.getPreference(PREFERENCES.GRID_SIZE);
            return Math.floor($(this.htmlNode).width() / gridSize);
        },

        /**
         * Gets the width of parent area calculated in grid metric system
         *
         * 1. Looks for the parent area with "spanX" class
         * 2. Returns X if found, GRID_SIZE otherwise
         */
        _getParentSpan: function () {
            return parseInt(this.getPreference(PREFERENCES.GRID_SIZE), 10);
        },

        /**
         * Gets areas' total size based on preferences
         */
        _getAreasSpan: function () {
            var columnPreference = this.getPreference(PREFERENCES.COLUMNS),
                columns,
                total = 0;

            if (columnPreference) {
                columns = columnPreference.split(",");
                for (var i = 0; i < columns.length; i++) {
                    total += parseInt(columns[i], 10);
                }
            }
            return total;
        },

        /**
         * Gets size by className
         */
        _getSpanByClass: function ($element) {
            return parseInt($element.attr("class").match(SPAN_CLASS_REGEX)[1], 10);
        },

        /**
         * Span <-> Pixel conversions
         */

        _pxToSpan: function (width) {
            return Math.round(width / this._getSpanWidth());
        },

        _spanToPx: function (size) {
            return size * this._getSpanWidth();
        }

    }));

})(window, b$, bd, jQuery, Mustache);
