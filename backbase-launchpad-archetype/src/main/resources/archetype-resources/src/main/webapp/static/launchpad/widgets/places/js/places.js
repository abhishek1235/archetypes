/*global b$, gadgets, google, Modernizr */
define([
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/i18n",
    'launchpad/lib/ui',
    "launchpad/lib/common",
    "launchpad/support/angular/angular-ui-bootstrap",
    "launchpad/support/angular/angular-gm"
], function(angular, util, i18nUtil) {

    "use strict";

    var module = angular.module("launchpad-foundation.places", ["ui.bootstrap", "AngularGM", "common", 'ui']);


    // Configuration
    module.constant("placesConfig", {
        maxLengthLabel: 3, // Marker"s label maximum size
        markerColorPool: ["#FF8355", "#6FADD4", "#E69215", "#74AED3", "#C73935", "#443647", "#38706D", "#1D415B"],
        markerWidth: 25,
        markerHeight: 35,
        markerFontFamily: "Arial",
        titleField: "name", // Field used as title on the marker
        alertTimeout: 5000 // Milliseconds until an alert will auto-close
    });


    // Common functionallity shared between all widget instances.
    module.service("PlacesService", ["placesConfig", function(placesConfig) {

        // Get list of distinct types form locations
        this.getUniqueTypeOptions = function(locations) {
          var types = [], foundId = [];
          angular.forEach(locations, function(location) {
            if (foundId.indexOf(location.type.id) === -1) {
              types.push(angular.copy(location.type));
              foundId.push(location.type.id);
            }
          });
          return types;
        };

        // Get url for a google pin with custom letter and color
        this.googleIcon = function(label, color) {
            if (color.charAt(0) === "#") {
                color = color.substring(1);
            }
            return "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + label.charAt(0) + "|" + (color || "FF0000");
        };

        // Darw a canvas pin
        var drawPin = function(context, width, height) {
            var radius = width / 2;
            context.beginPath();
            context.moveTo(radius, height);
            context.arc(radius, radius, radius, 0, Math.PI, true);
            context.closePath();
            context.fill();
            context.stroke();
        };

        // Create a data url for a canvas pin with custom label and color
        this.canvasIcon = function(label, color, width, height) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            width = width || placesConfig.markerWidth;
            height = height || placesConfig.markerHeight;

            canvas.width = width;
            canvas.height = height;

            context.clearRect(0, 0, width, height);

            context.fillStyle = color;
            context.strokeStyle = color;

            drawPin(context, width, height);

            context.fillStyle = "white";
            context.strokeStyle = "black";

            // Render Label
            var fontSize = 10 - label.length; // Decide font size based on label's length
            context.font = "normal " + fontSize + "pt " + placesConfig.markerFontFamily;
            context.textBaseline  = "top";

            // Centre text
            var textWidth = context.measureText(label);
            context.fillText(label, Math.floor((width / 2) - (textWidth.width / 2)), 4);

            return canvas.toDataURL();
        };
    }]);


    // Google maps autocomplete address directive
    module.directive("placesAutocomplete", [function() {
      return {
        restrict: "A",
        require: "ngModel",
        scope: {
            onPlaceChange: "&placesAutocomplete"
        },
        replace: false,
        link: function(scope, element, attrs, ngModelCtrl) {
            var autocomplete = new google.maps.places.Autocomplete(element[0]);

            google.maps.event.addListener(autocomplete, "place_changed", function() {
                var place = autocomplete.getPlace(),
                    isValid = !!place.geometry;

                var args = {
                    place: place
                };

                if ( isValid ) {
                    var location = place.geometry.location;
                    angular.extend(args, {
                        lat: location.lat(),
                        lng: location.lng()
                    });
                }

                scope.$apply(function() {
                    ngModelCtrl.$setValidity("place", isValid);
                    ngModelCtrl.$setViewValue(element.val());       
                    scope.onPlaceChange(args);
                });
            });

            // Prevent IE from closing widget on enter
            element.bind('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
        }
      };
    }]);


    // The controller to dipslay & filter a list of locations in map
    module.controller("PlacesCtrl", ["$scope", "$filter", "$timeout", "widget", "PlacesService", "placesConfig", 'httpService',
    function($scope, $filter, $timeout, widget, PlacesService, placesConfig, httpService) {

        var service,                                // http service
            bodyEl = angular.element(widget.body),  // Root element
            assignedColors = {},                    // Colors assigned to types
            markerColorPool = angular.copy(placesConfig.markerColorPool); // Color polor for instance

        $scope.mapId = widget.id;
        $scope.data  = [];
        $scope.title = widget.getPreference("title");

        // Initial options
        $scope.options = {
          map: {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: util.parseBoolean(widget.getPreference("panControl")),
            styles: [{
                featureType: "poi",
                elementType: "labels",
                stylers:[{
                    visibility: util.parseBoolean(widget.getPreference("showPOI")) ? "on" : "off"
                }]
            }]
          },
          typeOrder: "name",  // Order type dropdown by this field
          emptyTypeLabel: "All"
        };

        // Filters
        $scope.filters = {
          name: null,
          type: null
        };

        function centerUserPosition(position) {
            $scope.$apply(function() {
                $scope.map.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            });
        }

        /**
         * Setup map & service options.
         */
        function initialize() {
            // Setup data service
            service = httpService.getInstance({
                endpoint: widget.getPreference("placesDataSrc")
            });

            // Get initial data
            readData();

            $scope.map = {};
            $scope.map.zoom = parseInt(widget.getPreference("zoom"), 10);
            $scope.map.center = new google.maps.LatLng(widget.getPreference("latitude"), widget.getPreference("longitude"));

            if (Modernizr.geolocation && widget.getPreference("currentPosition")) {
                navigator.geolocation.getCurrentPosition(centerUserPosition);
            }

            angular.extend($scope.options.map, $scope.map);
        }

        // Start application
        initialize();

        /**
         * Fetch data from source.
         */
        function readData() {
            service.read({}, true)
            .success(function(data) {
                $scope.data = data;
            })
            .error(function() {
            });
        }


        // Check if given id is already assigned a color, otherwise return one from the pool
        function getColor(id) {
            if ( !assignedColors[id] ) {
                assignedColors[id] = markerColorPool.shift();
            }
            return assignedColors[id];
        }

        /**
         * Define marker's properties and visibility.
         * Called every time map is redraw.
         */
        $scope.getMarkerOptions = function(object) {
            var type  = object.type,
                label = object.abbr || type.abbr || type.name,
                icon  = object.icon || type.icon,
                title = object[placesConfig.titleField];

            // Shorten label to fit inside the marker
            if (label.length > placesConfig.maxLengthLabel) {
                label = label.charAt(0);
            }

            // Create custom icon
            if ( !icon ) {
                var color = object.color || type.color || getColor(type.id);
                icon = Modernizr.canvas ? PlacesService.canvasIcon(label, color) : PlacesService.googleIcon(label, color);
            }

            return {
                title: title ? title + '' : '', // Make sure this is a string
                icon: icon,
                visible: isMarkerVisible(object)
            };
        };

        /**
         * Check filters to define marker's visibility
         */
        function isMarkerVisible(location) {
          if ($scope.filters.type && $scope.filters.type.id !== location.type.id) {
            return false;
          }
          return true;
        }

        /**
         * Search places based on lat/lng coordinates.
         */
        $scope.search = function(lat, lng) {
            if (!lat || !lng) {
                $scope.addAlert('The location you provided is not valid!', 'error', placesConfig.alertTimeout);
                return;
            }

            $scope.map.center = new google.maps.LatLng(lat, lng);
            $scope.map.zoom = 13;
        };

        // Refresh map
        $scope.redraw = function() {
            $scope.$broadcast("gmMarkersRedraw", "places");
        };

        $scope.$watch("data", function() {
            // Redraw locations
            $scope.places = $scope.data.locations;
            $scope.redraw();

            // Redraw type"s dropdown
            $scope.options.type = $filter("orderBy")(PlacesService.getUniqueTypeOptions($scope.places), $scope.options.typeOrder);
        }, true);

        $scope.$watch("filters.type", function() {
            $scope.redraw();
        });


        /**
         * Alert messages.
         */
        $scope.alerts = [];

        $scope.addAlert = function(msg, type, timeout) {
            var alert = { msg: msg, type: type || 'error' };
            $scope.alerts.push(alert);

            if (timeout) {
                $timeout(function() {
                    $scope.closeAlert($scope.alerts.indexOf(alert));
                }, timeout);
            }
        };

        $scope.closeAlert = function(index) {
            if ( index > -1 ){
                $scope.alerts.splice(index, 1);
            }
        };

        /**
         * Open info window for specific marker
         */
        $scope.openInfoWindow = function(object, marker) {
            $scope.place = object;
            $scope.infoWindow.open(marker.getMap(), marker);
        };

        /**
         * Responsive logic to handle size changes.
         */

        $scope.sizeRules = [
             { max: 200, size: 'tile' },
             { min: 201, max: 450, size: 'small' },
             { min: 451, size: 'normal' }
        ];

        $scope.resized = function( width ) {
            $scope.$broadcast("gmMapResize", $scope.mapId);
        };

        // Re-initialize on preferences change
        widget.addEventListener("preferencesSaved", function () {
            widget.refreshHTML();
            $timeout(function() {
                initialize();
            });
        });
    }]);


    return function(widget) {
        module.value("widget", widget);
        angular.bootstrap(widget.body, ["launchpad-foundation.places"]);
    };
});