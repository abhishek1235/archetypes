define("launchpad/lib/ui/focus", [
    'angular',
    'launchpad/lib/ui/ui-module'
    ], function(angular, uiModule) {

    'use strict';

    uiModule.directive('lpFocusOn', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var value = $interpolate(attrs.lpFocusOn)(scope);
                scope.$on(value, function() {
                    setTimeout(function() {
                        element[0].focus();

                        if (element[0].tagName === 'INPUT') {
                            element[0].select();
                        }
                    }, 50);
                });
            }
        };
    }]);

    if ( !('autofocus' in document.createElement('input')) ) {
        uiModule.directive('autofocus', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    // IE8: Use timeout
                    setTimeout(function() {
                        element[0].focus();
                    }, 100);
                }
            };
        });
    }
});
