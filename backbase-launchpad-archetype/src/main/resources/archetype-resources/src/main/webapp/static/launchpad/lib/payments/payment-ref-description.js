/**
 * Created by david on 3/5/14.
 */
define("launchpad/lib/payments/payment-ref-description", [
    "jquery",
    "angular",
    "launchpad/lib/payments/payments-module",
    "launchpad/lib/common/util",
    "launchpad/support/angular/angular-ui-bootstrap"], function($, angular, paymentsModule, util) {

    "use strict";

    /**
     * Angular filter to put visual indicator between every set of 4 characters
     */
    paymentsModule.filter("addSeperator", function() {

        var visualIndicator = " ";

        //add spaces function
        var addVisualIndicator = function(input) {
            if(input.length === 4) {
                input += visualIndicator;
            }

            return input;
        };

        return function(input) {
            if(input) {

                //remove all spaces from input
                input = input.split(visualIndicator).join("");
                input = input.toUpperCase();

                //split every 4 characters and remainder
                var tempArray = input.match(/.{1,4}/g);
                var newInput = "";

                for(var i = 0; i < tempArray.length; i++) {
                    if(i !== tempArray.length - 1) {
                        tempArray[i] = addVisualIndicator(tempArray[i]);
                    }

                    //append new value to newInput
                    newInput += tempArray[i];
                }

                return newInput;
            }
        };
    });

    /**
     * Angular directive to hook filter into ng-model
     */
    paymentsModule.directive("lpFormatPaymentReference", ['$filter', function($filter) {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                var addSeperatorAndRF = function(input) {
                    //automatically add RF to start of reference if not present
                    if(input && input.length > 2) {
                        var sub = input.substring(0, 2);

                        if(sub !== "RF") {
                            input = "RF" + input;
                        }
                    }

                    //filter input with spaces
                    var filtered = $filter('addSeperator')(input);

                    if(filtered !== input) {

                        ctrl.$setViewValue(filtered);
                        ctrl.$render();
                    }

                    return filtered;
                };

                ctrl.$parsers.push(addSeperatorAndRF);
            }
        };
    }]);

    paymentsModule.controller("lpPaymentRefDescController", ["$scope", function($scope) {

        var initialize = function() {
            $scope.paymentReference = "";
            $scope.paymentDescription = "";

            $scope.showInfoMessage = false;

            $scope.paymentRefDisabled = false;
            $scope.paymentDescDisabled = false;
        };

        initialize();

    }]);

    paymentsModule.directive("lpPaymentRefDescription", ["$templateCache", '$timeout', function ($templateCache, $timeout) {
        $templateCache.put("$paymentRefDescription.html", '<div class="lp-payment-ref-description">' +
            '<div class="lp-payment-reference" ng-class="{\'has-success\': isValid && paymentReference.length > 0, \'has-error\': !isValid && paymentReference.length > 0,  \'has-feedback\': paymentReference.length}">' +
            '<input class="form-control" aria-label="payment reference" lp-payment-reference-field" type="text" placeholder="Payment reference (optional)" maxlength="31" ng-model="paymentReference" ng-disabled="paymentRefDisabled" ' +
            'lp-input-overflow="lp-input-overflow" ' +
            'ng-keydown="getSelection($event)" ng-keypress="getSelection($event)" ' +
            'ng-mousedown="getSelection($event)" ng-mouseup="getSelection($event)" ' +
            'lp-format-payment-reference="lp-format-payment-reference"/>' +
            '<span ng-if="isValid && paymentReference.length" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
            '<span ng-click="clearRef()" ng-if="!isValid && paymentReference.length" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
            '<div class="lp-payment-reference-dividers clearfix">' +
            '<div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div>' +
            '</div>' +
            '</div>' +
            '<div class="lp-payment-description">' +
            '<textarea aria-label="payment description" class="form-control lp-payment-description-area" placeholder="Description (optional) Maximum number of characters is 140" maxlength="140" ng-model="paymentDescription" ng-disabled="paymentDescDisabled"></textarea>' +
            '</div>' +
            '<div class="hover-catcher" ng-class="{refDisabled: paymentRefDisabled, descDisabled: paymentDescDisabled}" ng-mouseover="toggleInfoMessage()" ng-mouseleave="toggleInfoMessage()"></div>' +
            '<p class="text-muted info-message" ng-if="showInfoMessage">You can only provide a Payment Reference or a Payment Description, not both.</p>' +
            '</div>');

        return {
            restrict : "AE",
            replace: true,
            require: ["ngModel", "^form"],
            template: $templateCache.get("$paymentRefDescription.html"),
            link: function (scope, element, attrs, ctrls) {

                var ngModelCtrl = ctrls[0],
                    formCtrl = ctrls[1];
                var $paymentReference = element.find("input");
                var $hoverCatcher = element.find(".hover-catcher");
                var $paymentDescription = element.find("textarea");
                var input = $paymentReference[0],
                    textSelection = [],
                    isBackspace = false,
                    lengthDiff = 0;

                // add control using the name attribute to the form controller to track validity
                ngModelCtrl.$name = attrs.name;
                // formCtrl.$addControl(ngModelCtrl);

                var $partialText = $(document.createElement('span'));
                $partialText.addClass('lp-input-cursor-position-offset');
                $partialText.css('font-size', element.css('font-size'));
                $(input).after($partialText);

                //normalizes payment ref input
                var normalize = function(input) {
                    return input.split(" ").join("");
                };

                //validates the payment ref based on length and ISO 7064
                var validatePaymentRef = function(input) {

                    var valid = true;

                    //validates length
                    if(input.length > 25) {
                        valid = false;
                    }

                    if(!input.match(/^RF\d{2}/)) {
                        valid = false;
                    }

                    //validates input based on checksum
                    if(!util.validateISO7064Checksum(input)) {
                        valid = false;
                    }

                    return valid;
                };

                scope.toggleInfoMessage = function() {
                    scope.showInfoMessage = !scope.showInfoMessage;
                };


                /**
                 * Set the correct cursor position after adding the separator
                 */
                scope.setCursorPosition = function() {

                    var cursorPosition = util.getNewCaretPosition(input, textSelection, lengthDiff, isBackspace);

                    isBackspace = false;

                    // add the separators to the cursor position
                    if (cursorPosition > 4) {
                        var temp = cursorPosition / 4;
                        if (parseInt(temp, 10) === temp) {
                            cursorPosition--;
                        }
                        cursorPosition += parseInt(temp, 10);
                    }

                    $timeout(function() {
                        util.setCaretPositionOfInput(input, cursorPosition, scope.paymentReference, $partialText);
                    }, 0, false);
                };

                /**
                 * Function that stores the selection start and end values
                 * @param  {event} event Either the Keyboard or the Mouse Event
                 */
                scope.getSelection = function(event) {

                    var noSeparatorSelection = function(select) {
                        var selectionDiff = 0;

                        selectionDiff += parseInt(select / 5, 10);

                        return select - selectionDiff;
                    };

                    textSelection = util.getSelectionPositionOfInput(input, noSeparatorSelection);

                    if (event.originalEvent.toString() === '[object KeyboardEvent]') {
                        // handle backspace
                        if (event.originalEvent.which === 8 && input.value.length) {
                            isBackspace = true;
                        }
                    }
                };

                scope.clearRef = function() {
                    scope.paymentReference = "";
                    input.focus();
                };

                scope.$watch('paymentReference', function(newValue, oldValue) {

                    if(oldValue === newValue) {
                        return;
                    }

                    if (!oldValue) {
                        oldValue = '';
                    }

                    //if this field is empty, reactivate other field
                    if(!newValue) {
                        ngModelCtrl.$modelValue.paymentReference = "";
                        scope.paymentDescDisabled = false;
                        formCtrl.$removeControl(ngModelCtrl);
                    } else if(newValue.length > 0) {

                        if (!formCtrl[ngModelCtrl.$name]) {
                            formCtrl.$addControl(ngModelCtrl);
                        }

                        //validation performed here
                        var normalizedPaymentRef = normalize(newValue);
                        scope.isValid = validatePaymentRef(normalizedPaymentRef);
                        ngModelCtrl.$setValidity('validRef', scope.isValid);

                        if (oldValue) {
                            lengthDiff = normalizedPaymentRef.length - normalize(oldValue).length;
                        } else {
                            lengthDiff = normalizedPaymentRef.length;
                        }

                        scope.paymentDescDisabled = true;
                        ngModelCtrl.$modelValue.paymentReference = normalizedPaymentRef;

                        // scope.setCursorPosition();
                    }
                    scope.setCursorPosition();
                }, true);

                scope.$watch('paymentDescription', function(newValue, oldValue) {

                    if(oldValue === newValue) {
                        return;
                    }

                    //if this field is empty, reactivate other field
                    if(!newValue) {
                        scope.paymentRefDisabled = false;
                        ngModelCtrl.$modelValue.paymentDescription = "";
                    } else if(newValue.length > 0) {
                        scope.paymentRefDisabled = true;
                        ngModelCtrl.$modelValue.paymentDescription = newValue;
                    }
                }, true);

                scope.$on("reset", function() {

                    scope.paymentReference = "";
                    scope.paymentDescription = "";

                    scope.showInfoMessage = false;

                    scope.paymentRefDisabled = false;
                    scope.paymentDescDisabled = false;
                });
            }
        };
    }]);
});
