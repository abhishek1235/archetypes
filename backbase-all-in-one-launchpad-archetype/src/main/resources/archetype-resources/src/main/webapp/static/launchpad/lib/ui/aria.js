define("launchpad/lib/ui/aria", [
    'angular',
    "launchpad/lib/ui/ui-module"], function(angular, uiModule) {

    'use strict';

    uiModule.directive('lpAriaNumber', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var number = scope.$eval(attrs.lpAriaNumber);
                element.attr('aria-hidden', true);
                element.text(number);

                var srOnly = angular.element('<span class="sr-only">' + (number ? number.split('').join(' ') : '') + '</span>');
                element.after(srOnly);
            }
        };
    });

    uiModule.filter('lpAriaNumber', function() {
      return function(input) {
        return input ? input.split('').join(' ') : '';
      };
    });
});
