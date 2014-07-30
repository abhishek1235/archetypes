
define("launchpad/lib/payments/scheduled-transfer", [
    "angular",
    "jquery",
    "launchpad/lib/payments/payments-module",
    "launchpad/lib/common/util",
    "launchpad/lib/payments/currency-input",
    "launchpad/support/angular/angular-ui-bootstrap"], function(angular, $, paymentsModule, util) {

    "use strict";

    var TEMPLATE_PATH = util.getContextPath() + '/static/launchpad/lib/ui/templates/';

    paymentsModule.directive("nonZero", [function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {

                ngModelCtrl.$parsers.unshift(function(value) {
                    ngModelCtrl.$setValidity("nonZero", parseInt(value, 10) !== 0);

                    return value;
                });
            }
        };
    }]);

    paymentsModule.controller("scheduledTransferController", ["$scope", function($scope) {

        var initialize = function() {

            $scope.frequenciesEnum = {
                START_OF_THE_MONTH: "START_OF_THE_MONTH",
                END_OF_THE_MONTH: "END_OF_THE_MONTH",
                LAST_FRIDAY_OF_MONTH: "LAST_FRIDAY_OF_MONTH",
                WEEKLY: "WEEKLY",
                MONTHLY: "MONTHLY",
                YEARLY: "YEARLY"
            };

            //MENU OPTIONS
            //groups prepended with letter to order list
            $scope.frequencies = [
                {
                    id: $scope.frequenciesEnum.START_OF_THE_MONTH,
                    value: "First of the month",
                    group: "apreset"
                },
                {
                    id: $scope.frequenciesEnum.END_OF_THE_MONTH,
                    value: "End of the month",
                    group: "apreset"
                },
                {
                    id: $scope.frequenciesEnum.LAST_FRIDAY_OF_THE_MONTH,
                    value: "Last Friday of the month",
                    group: "apreset"
                },
                {
                    id: $scope.frequenciesEnum.WEEKLY,
                    value: "Weekly",
                    group: "bcustom"
                },
                {
                    id: $scope.frequenciesEnum.MONTHLY,
                    value: "Monthly",
                    group: "bcustom"
                },
                {
                    id: $scope.frequenciesEnum.YEARLY,
                    value: "Yearly",
                    group: "bcustom"
                }
            ];

            $scope.days = [
                {
                   id: 1,
                   value: "M",
                   label: "Monday"
                },
                {
                    id: 2,
                    value: "T",
                    label: "Tuesday"
                },
                {
                    id: 3,
                    value: "W",
                    label: "Wednesday"
                },
                {
                    id: 4,
                    value: "T",
                    label: "Thursday"
                },
                {
                    id: 5,
                    value: "F",
                    label: "Friday"
                },
                {
                    id: 6,
                    value: "S",
                    label: "Saturday"
                },
                {
                    id: 7,
                    value: "S",
                    label: "Sunday"
                }
            ];

            $scope.months = [
                {
                    id: 1,
                    value: "Jan",
                    label: "January"
                },
                {
                    id: 2,
                    value: "Feb",
                    label: "February"
                },
                {
                    id: 3,
                    value: "Mar",
                    label: "March"
                },
                {
                    id: 4,
                    value: "Apr",
                    label: "April"
                },
                {
                    id: 5,
                    value: "May",
                    label: "May"
                },
                {
                    id: 6,
                    value: "Jun",
                    label: "June"
                },
                {
                    id: 7,
                    value: "Jul",
                    label: "July"
                },
                {
                    id: 8,
                    value: "Aug",
                    label: "August"
                },
                {
                    id: 9,
                    value: "Sep",
                    label: "September"
                },
                {
                    id: 10,
                    value: "Oct",
                    label: "October"
                },
                {
                    id: 11,
                    value: "Nov",
                    label: "November"
                },
                {
                    id: 12,
                    value: "Dec",
                    label: "December"
                }
            ];

            $scope.dates = [];

            for(var i = 1; i < 32; i++) {
                $scope.dates.push({
                    id: i,
                    value: i,
                    label: i
                });
            }

            $scope.endOptions = [
                {
                    id: "after",
                    value: "After"
                },
                {
                    id: "onDate",
                    value: "On date"
                }
            ];

            $scope.endOn = $scope.endOptions[0].id;
            $scope.customOrder = false;

            $scope.dateWarning = false;

            $scope.calendar = {
                startCalendarOpen: false,
                endCalendarOpen: false
            };

            $scope.timesEndDate = $scope.paymentOrder.scheduledTransfer.endDate;

            $scope.setEndDate = function() {

                var timeToAdd = ($scope.paymentOrder.scheduledTransfer.timesToRepeat * $scope.paymentOrder.scheduledTransfer.every);

                if(timeToAdd > 0) {
                    $scope.paymentOrder.scheduledTransfer.endDate = $scope.paymentOrder.scheduledTransfer.startDate.clone();

                    switch($scope.paymentOrder.scheduledTransfer.frequency) {
                        case $scope.frequenciesEnum.WEEKLY:
                            $scope.paymentOrder.scheduledTransfer.endDate.addWeeks(timeToAdd);
                            break;
                        case $scope.frequenciesEnum.MONTHLY:
                            $scope.paymentOrder.scheduledTransfer.endDate.addMonths(timeToAdd);
                            break;
                        case $scope.frequenciesEnum.YEARLY:
                            $scope.paymentOrder.scheduledTransfer.endDate.addYears(timeToAdd).moveToLastDayOfMonth();
                            break;
                        case $scope.frequenciesEnum.START_OF_THE_MONTH:
                            $scope.paymentOrder.scheduledTransfer.endDate.addMonths(timeToAdd).moveToFirstDayOfMonth();
                            break;
                        case $scope.frequenciesEnum.LAST_FRIDAY_OF_MONTH:
                            $scope.paymentOrder.scheduledTransfer.endDate.addMonths(timeToAdd).moveToLastDayOfMonth();
                            var day = $scope.paymentOrder.scheduledTransfer.endDate.getDay();

                            //if this day is not a friday, move to the previous friday
                            if(day !== 5) {
                                $scope.paymentOrder.scheduledTransfer.endDate.moveToDayOfWeek(5, -1);
                            }
                            break;
                        default:
                            $scope.paymentOrder.scheduledTransfer.endDate.addMonths(timeToAdd).moveToLastDayOfMonth();
                            break;
                    }

                    $scope.timesEndDate = $scope.paymentOrder.scheduledTransfer.endDate.clone();
                    $scope.timesEndDate = $scope.timesEndDate.toString("dd/MM/yyyy");
                } else {
                    $scope.timesEndDate = "";
                }

            };
        };

        initialize();

    }]);

    paymentsModule.directive("scheduledTransfer", [function () {

        return {
            restrict : "AE",
            replace: true,
            require: ["ngModel", "^form"],
            controller: "scheduledTransferController",
            templateUrl: TEMPLATE_PATH + "scheduled-transfer.html",
            link: function (scope, element, attrs, ctrls) {

                var modelCtrl = ctrls[0];
                var formCtrl = ctrls[1];

                //add intervals control to form to cater for validation
                modelCtrl.$name = "intervals";
                formCtrl.$addControl(modelCtrl);

                //array to hold list of selected warning dates
                var warningDates = [];

                scope.paymentOrder.scheduledTransfer.frequency = scope.frequencies[0].id;
                scope.setEndDate();


                //checks and handles the provided date
                var handleWarningDate = function(date) {

                    //if the warning date is not in the array and is 29, 30 or 31
                    if(warningDates.indexOf(date) === -1 && date >= 29) {

                        warningDates.push(date);

                        //this is a warning date, show the warning
                        scope.dateWarning = true;
                    } else if(warningDates.indexOf(date) > -1) {
                        //if the date is already in the list, remove it
                        var index = warningDates.indexOf(date);
                        warningDates.splice(index, 1);

                        if(warningDates.length === 0) {
                            //disable the date warning
                            scope.dateWarning = false;
                        }
                    }
                };

                var handleIntervalValidation = function() {

                    var validIntervals = true;

                    validIntervals = scope.paymentOrder.scheduledTransfer.intervals.length > 0 ? true : false;

                    //validate requirement from frequency
                    validIntervals = scope.customOrder ? validIntervals : true;

                    //validate whether the order is scheduled or not
                    validIntervals = scope.paymentOrder.isScheduledTransfer ? validIntervals : true;

                    modelCtrl.$setValidity("intervalsRequired", validIntervals);
                };

                //reset the interval list and set whether the standing order is custom or not
                scope.frequencyChanged = function() {

                    scope.paymentOrder.scheduledTransfer.intervals = [];
                    scope.setEndDate();

                    if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.WEEKLY || scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY || scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.YEARLY) {
                        scope.customOrder = true;
                        handleIntervalValidation();
                        scope.paymentOrder.scheduledTransfer.customOrder = true;
                    } else {
                        scope.customOrder = false;
                        modelCtrl.$setValidity("intervalsRequired", true);
                        handleIntervalValidation();
                        scope.paymentOrder.scheduledTransfer.customOrder = false;
                    }
                };

                //add a selected interval to the interval list
                scope.toggleInterval = function($event, $index) {

                    var src = $($event.target), list, search;

                    //set list to whichever frequency is currenctly selected
                    if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.WEEKLY) {
                        list = scope.days;
                    } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY) {
                        list = scope.dates;
                    } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.YEARLY) {
                        list = scope.months;
                    }

                    //if the interval has already been selected
                    if(src.hasClass("active")) {
                        src.removeClass("active");

                        search = list[$index].id;

                        if(search) {
                            handleWarningDate(search);
                            //remove from list
                            var index = scope.paymentOrder.scheduledTransfer.intervals.indexOf(search);
                            scope.paymentOrder.scheduledTransfer.intervals.splice(index, 1);
                        }
                    } else {
                        //add class
                        src.addClass("active");

                        search = list[$index].id;

                        if(search) {
                            handleWarningDate(search);
                            //add to intervals list
                            scope.paymentOrder.scheduledTransfer.intervals.push(search);
                        }
                    }

                    //set interval control validity
                    handleIntervalValidation();

                    scope.setEndDate();
                };

                scope.openStartCalendar = function($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.calendar.endCalendarOpen = false;
                    //open start date calendar
                    scope.calendar.startCalendarOpen = !scope.calendar.startCalendarOpen;
                };

                scope.openEndCalendar = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.calendar.startCalendarOpen = false;
                    //open end date calendar
                    scope.calendar.endCalendarOpen = !scope.calendar.endCalendarOpen;
                };

                scope.$watch("paymentOrder.scheduledTransfer.timesToRepeat", function (newValue) {

                    //set the end date according to the number of times the transfer repeats
                    if(newValue) {
                        scope.setEndDate();
                    }
                });

                scope.$watch("paymentOrder.scheduledTransfer.every", function(newValue) {

                    if(newValue) {
                        scope.setEndDate();
                    }
                });

                scope.$watch("paymentOrder.isScheduledTransfer", function(newValue) {
                    handleIntervalValidation();
                });

                scope.endDateOptions = {
                    datepickerMode: 'year',
                    'show-weeks': false
                };

                scope.startDateOptions = {
                    'show-weeks': false
                };

                //reset scope on succesful form submission
                scope.$on("reset", function() {
                    scope.paymentOrder.scheduledTransfer.frequency = scope.frequencies[0].id;
                    scope.customOrder = false;
                    scope.paymentOrder.scheduledTransfer.customOrder = false;
                });
            }
        };
    }]);
});
