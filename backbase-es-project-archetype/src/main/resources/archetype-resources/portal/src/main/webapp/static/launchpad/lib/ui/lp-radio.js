define("launchpad/lib/ui/lp-radio", [
    'angular',
    'launchpad/lib/common/util',
    'launchpad/lib/ui/ui-module'], function(angular, util, uiModule) {

    'use strict';

    var TEMPLATE_PATH = util.getContextPath() + '/static/launchpad/lib/ui/templates/';

    uiModule


    /**
     * A helper service that can parse dropdown's syntax (string provided by users)
     */
    .factory('optionsParser', ['$parse', function ($parse) {

        var DROPDOWN_REGEXP   = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
        return {
            parse:function (input) {

                var match = input.match(DROPDOWN_REGEXP);
                if (!match) {
                    throw new Error(
                        "Expected dropdown specification in form of '_modelValue_ (as _label_)? (group by _groupname_)? for _item_ in _collection_'" +
                            " but got '" + input + "'.");
                }

                var valueName = match[4] || match[6];
                
                return {
                    displayFn: $parse(match[2] || match[1]),
                    valueName: valueName,
                    keyName: match[5],
                    groupByFn: $parse(match[3] || ''),
                    valueFn: $parse(match[2] ? match[1] : valueName),
                    valuesFn: $parse(match[5])
                };

            }
        };
    }])


   .controller('RadioController', ['$scope', '$attrs', 'optionsParser', function($scope, $attrs, optionsParser) {

        var self = this,
            parserResult = optionsParser.parse($attrs.ngOptions);

        $scope.model = {};
        $scope.inline = angular.isDefined($attrs.inline) ? $scope.$parent.$eval($attrs.inline) : false;
        $scope.templateUrl = $attrs.templateUrl;

        this.onOptionsChange = function(sourceValues) {
            var locals = {}, options = [];

            angular.forEach(sourceValues, function(value) {

                locals[parserResult.valueName] = value;

                var option = {
                    label: parserResult.displayFn($scope, locals),
                    value: parserResult.valueFn($scope, locals),
                    icon: value.icon || undefined,
                    example: value.example || undefined
                };

                options.push(option);
            });

            $scope.options = options;

            this.render();
        };

        this.render = function() {
            $scope.model.value = ngModel.$modelValue;
        };

        this.selectSingle = function(option) {
            ngModel.$setViewValue(option.value);
        };

        $scope.select = function(e, option) {
            if (option.disabled) {
                $scope.prevent(e);
                return;
            }

            self.selectSingle(option);
        };

        $scope.prevent = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var ngModel;
        this.init = function(_ngModel) {
            ngModel = _ngModel;

            ngModel.$render = function() {
                self.render();
            };

            $scope.model.value = ngModel.$modelValue;
        };

        $scope.$parent.$watch(parserResult.valuesFn, function(sourceValues) {
            self.onOptionsChange(sourceValues);
        }, true);
    }])

    .directive('lpRadio', function () {

      return {
        require: ['lpRadio', '^ngModel'],
        restrict:'EA',
        replace:true,
        scope: {},
        templateUrl: TEMPLATE_PATH + 'radio/radio.html',
        controller: 'RadioController',
        link: function(scope, element, attrs, ctrls) {
            var ngModelCtrl = ctrls[1];
            if (ngModelCtrl) {
                ctrls[0].init( ngModelCtrl );
            }
        }
      };
    });

});
