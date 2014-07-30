define("launchpad/lib/ui/responsive-directive", [
    'angular',
    'launchpad/lib/ui/ui-module',
    'launchpad/lib/ui/responsive'], function(angular, uiModule, responsive) {

    'use strict';

    uiModule.constant('responsiveConfig', {
        classPattern: 'lp-{{size}}-size',
        rules: [
            { max: 200, size: 'tile' },
            { min: 201, max: 350, size: 'small' },
            { min: 351, size: 'large' }
        ]
    });

    uiModule.controller('ResponsiveCtrl', ['$scope', '$attrs', '$parse', '$timeout', 'responsiveConfig', function($scope, $attrs, $parse, $timeout, responsiveConfig) {
        var self = this,
            setSize = angular.isDefined($attrs.lpSize) ? $parse($attrs.lpSize).assign : null,
            resizeFn = angular.noop;

        this.init = function(element) {
            this.element = element;
            this.responsive = responsive.enable(element);

            var rules = angular.isDefined($attrs.sizeRules) ? $scope.$eval($attrs.sizeRules) : responsiveConfig.rules;
            this.addRules(rules);

            if ( $attrs.lpOnResize ) {
                resizeFn = $parse( $attrs.lpOnResize );
                this.setResizeWatcher();
            }
        };

        this.addRules = function(rules) {
            angular.forEach(rules, function(rule) {
                self.addRule(rule.min, rule.max, rule.size);
            });
        };

        var expressionHandler;
        if ($attrs.onSizeChange) {
            expressionHandler = $parse($attrs.onSizeChange);
        }

        this.addRule = function(min, max, size) {
            var rule = {};
            if (min) {
                rule['min-width'] = min;
            }
            if (max) {
                rule['max-width'] = max;
            }

            angular.extend(rule, {
                then: function() {
                    var oldSize = self.size;

                    $timeout(function() {
                        self.toggleClass(size, oldSize);
                        self.size = size;
                        if (expressionHandler) {
                            expressionHandler($scope, { size: size });
                        }
                    });
                }
            });

            this.responsive.rule(rule);
        };

        this.toggleClass = function(newSize, oldSize) {
            self.element.addClass(responsiveConfig.classPattern.replace('{{size}}', newSize));
            if (oldSize) {
                self.element.removeClass(responsiveConfig.classPattern.replace('{{size}}', oldSize));
            }

            if ( setSize ) {
                setSize($scope, newSize);
            }
        };

        var width = null;

        this.setResizeWatcher = function() {
            this.responsive.resize = function( object ) {
                if ( object.width !== width ) {
                    width = object.width;
                    $scope.$apply( function() {
                        resizeFn( $scope, {width: width} );
                    });
                }
            };
        };
    }]);

    uiModule.directive('lpResponsive', function() {
        return {
            replace: false,
            controller: 'ResponsiveCtrl',
            link: function(scope, element, attrs, ctrl) {
                ctrl.init(element);
            }
        };
    });
});
