define("launchpad/lib/payments/payment-orders-model", [
	"jquery",
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/payments/payments-module"], function($, angular, util, paymentsModule) {

    "use strict";

    paymentsModule.factory("PaymentOrdersModel", [ '$rootScope', 'customerId', 'pendingPaymentOrdersTimeout', 'httpService',
	    function($rootScope, customerId, pendingPaymentOrdersTimeout, httpService) {

        /**
         * Transactions service constructor
         * @param config
         * @constructor
         */
        var PaymentOrdersModel = function(config) {
            if (config.paymentOrdersEndpoint) {
                this.paymentOrdersEndpoint = config.paymentOrdersEndpoint;
            }
            if (config.pendingPaymentOrdersEndpoint) {
                this.pendingPaymentOrdersService = httpService.getInstance({
                    endpoint: config.pendingPaymentOrdersEndpoint,
                    urlVars: {
                        partyId: customerId
                    },
                    cacheTimeout: pendingPaymentOrdersTimeout
                });
            }
            if (config.paymentOrdersSubmitPoint) {
                this.paymentOrdersSubmitPoint = config.paymentOrdersSubmitPoint;
            }

            this.locale = config.locale;
            this.pendingOrdersGroups = null;
            this.createError = null;
            this.loadError = null;
            this.submitError = null;
        };

        /**
         * Create new order
         *
         * @param paymentOrder
         * @param uuid
         * @returns {*}
         */
        PaymentOrdersModel.prototype.create = function (paymentOrder, orderId) {
            var self = this,
                service = httpService.getInstance({
                    endpoint: this.paymentOrdersEndpoint,
                    urlVars: {
                        orderId: orderId
                    }
                }),
                xhr = service.create({
                    data: paymentOrder
                });

            xhr.error(function(data){
	            if(data.errors) {
		            self.createError = data.errors[0].code;
	            }
            });

            return xhr;
        };

        /**
         * Load pending orders
         * @returns {*}
         */
        PaymentOrdersModel.prototype.load = function (force) {
            var self = this,
                xhr = this.pendingPaymentOrdersService.read({}, force);

            xhr.success(function(data){
                if(data && data !== 'null') {
                    self.pendingOrdersGroups = data;
                } else {
                    // TODO: should return empty array
                    self.pendingOrdersGroups = [];
                }
            });
            xhr.error(function(data){
                self.submitError = data.errorCode || 500;
            });

            return xhr;
        };

        /**
         * Submit pending order.
         *
         * @param uuid
         * @returns {*}
         */
        PaymentOrdersModel.prototype.submit = function (orderId, authorization) {
            var self = this,
                service = httpService.getInstance({
                    endpoint: this.paymentOrdersSubmitPoint,
                    urlVars: {
                        orderId: orderId
                    }
                }),
                data = {};

            if (authorization) {
                data.auth_password = authorization;
            }

            var xhr = service.update({
                data: data
            });

            xhr.error(function(data){
                self.submitError = data.errorCode || 500;
            });

            return xhr;
        };

        return PaymentOrdersModel;
    }]);
});
