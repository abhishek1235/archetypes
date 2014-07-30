/**
 * Created by david on 3/5/14.
 */
define("launchpad/lib/payments/payment-mode-tabs", [
    "angular",
    "launchpad/lib/payments/payments-module",
    "launchpad/lib/common/util",
    "launchpad/support/angular/angular-ui-bootstrap"], function(angular, paymentsModule, util) {

    "use strict";


    paymentsModule.directive("paymentModeTabs", ["$templateCache", function ($templateCache) {
        $templateCache.put("paymentModeTabs.html", '<div class="lp-payment-mode-tabs">' +
                '<div>' +
                    '<ul tabset="tabset" class="payment-mode-tab-area">' +
                        '<li tab="tab">' +
                            '<span tab-heading="tab-heading" class="tab-heading" ng-click="setScheduledTransfer(false)">One Time</span>' +
                            '<div class="one-time clearfix">' +
                                '<div class="pull-left text">' +
                                    'Sending date' +
                                '</div>' +
                                '<div class="pull-left date-picker">' +
                                    '<input ng-click="openCalendar($event)" required="required" type="text" name="scheduleDate" ng-model="paymentOrder.scheduleDate" datepicker-popup="dd/MM/yyyy" is-open="paymentOrder.isOpenDate" class="form-control" lp-future-time=""' +
                                    'datepicker-options="dateOptions" show-button-bar="false" tabindex="0" placeholder="select date" aria-label="select date" />' +
                                    '<span ng-click="openCalendar($event)" class="lp-icon lp-icon-calendar calendar-icon"></span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="urgent-transfer clearfix">' +
                                '<div class="urgent-checkbox pull-left"><input aria-label="urgent transfer" ng-model="paymentOrder.urgentTransfer" type="checkbox" /></div><div class="urgent-message pull-left"><span class="text-muted">Make transfer urgent<i class="lp-icon lp-icon-xxl lp-icon-info-sign open-popup" ng-click="toggleUrgentTransferModal()"></i></span></div>' +
                            '</div>' +
                            '<p ng-show="paymentOrder.urgentTransfer" class="urgent-transfer-message"><span lp-message="\'urgentTransferMessage\'" lp-bundle="messages"></span></p>' +
                        '</li>' +
                        '<li tab="tab">' +
                            '<span tab-heading="tab-heading" class="tab-heading" ng-click="setScheduledTransfer(true)">Scheduled</span>' +
                                '<scheduled-transfer ng-model="paymentOrder.scheduledTransfer.intervals"></scheduled-transfer>' +
                        '</li>' +
                '</div>' +
            '</div>');

        return {
            restrict : "AE",
            replace: true,
            template: $templateCache.get("paymentModeTabs.html"),
            link: function (scope, element, attrs, ngModelCtrls) {

                scope.toggleUrgentTransferModal = function() {
                    scope.urgentTransferModalShown = !scope.urgentTransferModalShown;
                };

                scope.setScheduledTransfer = function(value) {
                    scope.paymentOrder.isScheduledTransfer = value;
                };

                scope.urgentTranfer = false;
            }
        };
    }]);
});
