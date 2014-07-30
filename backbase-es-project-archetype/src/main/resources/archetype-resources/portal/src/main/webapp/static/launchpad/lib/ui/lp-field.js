define("launchpad/lib/ui/lp-field", [
    'angular',
    'launchpad/lib/common/util',
    'launchpad/lib/ui/ui-module'], function(angular, util, uiModule) {

    'use strict';

    var TEMPLATE_PATH = util.getContextPath() + '/static/launchpad/lib/ui/templates/';

    uiModule.value('defaultErrorMessages', {
        'required': 'This field is required.'
    });

    uiModule.controller('FieldController', ['$scope', '$attrs', '$parse', 'defaultErrorMessages', function ($scope, $attrs, $parse, defaultErrorMessages) {

        var self = this, getErrors, setErrors;

        $scope.errors = [];

        var errorMessages = angular.isDefined($attrs.errorMessages) ? angular.copy($scope.$parent.$eval($attrs.errorMessages)) : {};
        errorMessages = angular.extend({}, defaultErrorMessages, errorMessages);

        if ( $attrs.errors ) {
            getErrors = $parse($attrs.errors);
            setErrors = getErrors.assign;

            $scope.$parent.$watch(getErrors, function(errors) {
                $scope.errors = errors;
                $scope.setErrorMessages();
            }, true);

            $scope.$watch('errors', function(errors) {
                if ( setErrors ) {
                  setErrors($scope.$parent, errors);
                }
            });
        }

        $scope.setErrorMessages = function() {
            var messages = [];
            if ($scope.errors) {
                for (var i = 0, n = $scope.errors.length; i < n; i++) {
                    var error = $scope.errors[i];
                    messages.push(self.getErrorMessage(error));
                }
            }
            $scope.errorMessages = messages;
        };

        this.getErrorMessage = function(error) {
            return (errorMessages && errorMessages[error]) ? errorMessages[error] : error;
        };

        this.addError = function(error) {
            $scope.errors.push(error);
        };

        this.clearErrors = function() {
            $scope.errors.length = 0;
        };
    }]);

    uiModule.directive('lpField', function () {
        return {
            restrict:'EA',
            replace: true,
            transclude: true,
            templateUrl: TEMPLATE_PATH + 'lp-field.html',
            scope: {
                label: '@',
                tip: '@',
                help: '@',
                actionLabel: '@',
                action: '@'
            },
            controller: 'FieldController'
        };
    });

    uiModule.directive('lpEnterPressed', function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, elem, attrs) {
                elem.on('keydown', function(e){
                    //checks to see if ENTER was pressed
                    if(e.which === 13) {
                        e.preventDefault();
                        scope.$apply(function() {
                            scope.save(scope.model.value);
                        });
                    }
                });
            }
        };
    });

    uiModule.directive('lpControl', ['$http', '$timeout', '$sce', 'newlinesFilter', function ($http, $timeout, $sce, newlinesFilter) {
        return {
            restrict:'EA',
            replace: true,
            transclude: true,
            templateUrl: TEMPLATE_PATH + 'lp-control.html',
            scope: {
                label: '@',
                tip: '@',
                validate: '&',
                loading: '='
            },
            require: ['^lpField', '?ngModel'],
            link: function(scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[1],
                    fieldCtrl = ctrls[0];

                scope.keepEdittingOpen = false;

                scope.readonly = angular.isDefined(attrs.readonly) ? scope.$parent.$eval(attrs.readonly) : false;

                if (!ngModelCtrl) {
                    scope.readonly = true;
                    return;
                }

                var required = angular.isDefined(attrs.required) ? scope.$parent.$eval(attrs.required) : true;

                attrs.$observe('type', function(value) {
                    scope.type = value || 'text';

                    if (scope.type === 'select' || scope.type === 'checkbox' || scope.type === 'select-multiple' || scope.type === 'radio') {
                        scope.options = scope.$parent.$eval(attrs.options);
                    }
                });

                scope.model = {};

                var focusEl;
                var getFocusEl = function() {
                    if (!focusEl) {
                        focusEl = (scope.type === 'select' || scope.type === 'select-multiple') ? element.find('select') : 
                            (scope.type === 'textarea' ?  element.find('textarea') : element.find('input'));
                    }
                    return focusEl;
                };

                scope.edditing = false;
                scope.setEditMode = function(isEditting) {
                    scope.editting = isEditting;

                    if (scope.editting) {
                        scope.model.value = angular.copy(ngModelCtrl.$modelValue);

                        //small screen? don't auto focus
                        if(!scope.keepEdittingOpen){
                            $timeout(function() {
                                getFocusEl().focus();
                            });
                        }
                    } else {
                        fieldCtrl.clearErrors();
                    }
                };

                var setLoading = function(isLoading) {
                    if ( attrs.loading ) {
                        scope.loading = isLoading;
                    }
                };

                //auto-opens edit controls when on smaller screen
                if(element.width() <= 240) {
                    scope.keepEdittingOpen = true;
                    scope.setEditMode(true);
                }

                scope.save = function(value) {
                    fieldCtrl.clearErrors();

                    value = util.escapeHtml(value);

                    var isValid = true, inputLength = value.length;

                    // Check required
                    if ( required && inputLength < 1) {
                        fieldCtrl.addError('required');
                        return false;
                    }

                    // Custom validation
                    if ( isValid && attrs.validate ) {
                        isValid = scope.validate({value: value});
                        if (typeof isValid === 'string') {
                            fieldCtrl.addError(isValid);
                            isValid = false;
                        }
                    }

                    if ( isValid ) {
                        //is the viewport less than 200px? Don't close edit more
                        if(!scope.keepEdittingOpen) {
                            scope.setEditMode(false);
                        }
                        ngModelCtrl.$setViewValue(value);
                        scope.model.text = $sce.trustAsHtml(scope.getText(value));
                    }
                };

                scope.isChecked = function(value) {
                    return ngModelCtrl.$modelValue.indexOf(value) > -1;
                };

                scope.toggleCheck = function(value) {
                    var idx = scope.model.value.indexOf(value);
                    if ( idx > -1 ) {
                      scope.model.value.splice(idx, 1);
                    } else {
                      scope.model.value.push(value);
                    }
                };

                scope.getText = function(value) {
                    var options = scope.options, i, n;

                    if (scope.type === 'textarea') {
                        value = newlinesFilter(value);
                    } else if (scope.type === 'select' || scope.type === 'radio') {
                        for (i = 0, n = options.length; i < n; i++) {
                            if (options[i].value.toString() === value.toString()) {
                                return options[i].text;
                            }
                        }
                    } else if (scope.type === 'checkbox' || scope.type === 'select-multiple') {
                        var text = [];
                        for (i = 0, n = options.length; i < n; i++) {
                            if (value.indexOf(options[i].value) > -1) {
                                text.push( options[i].text );
                            }
                        }
                        return text.join(', ');
                    }

                    return value.toString().replace("<br/>", "\n"); //fix to remove <br /> tag from textarea when editing is open
                };

                ngModelCtrl.$render = function() {
                    scope.model.text = $sce.trustAsHtml(scope.getText(ngModelCtrl.$modelValue));
                    scope.model.value = scope.getText(ngModelCtrl.$modelValue);
                };
            }
        };
    }]);

    uiModule.filter('newlines', function () {
        return function(text) {
            if (angular.isString(text)) {
                return text.replace(/\n/g, '<br/>');
            }
            return text;
        };
    });
});
