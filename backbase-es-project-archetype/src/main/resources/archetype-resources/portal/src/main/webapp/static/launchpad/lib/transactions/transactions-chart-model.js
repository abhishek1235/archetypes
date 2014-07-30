define("launchpad/lib/transactions/transactions-chart-model", [
	"jquery",
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/transactions/transactions-module"], function($, angular, util, transactionsModule) {

    "use strict";

    function applyScope(scope) {
        if(!scope.$$phase) {
            scope.$apply();
        }
    }

    transactionsModule.factory("TransactionsChartModel", [ '$rootScope', 'httpService', function($rootScope, httpService){

        /**
         * Transactions Chart service constructor
         * @param config
         * @constructor
         */
        var TransactionsChartModel = function(config) {
            this.transactionsChartModel = httpService.getInstance({
                endpoint: config.transactionsChartEndpoint,
                urlVars: {
                    accountId: config.accountId
                }
            });
            this.chartData = null;
            this.error = false;
        };

        /**
         * Load data from server
         * @param queryParams {}
         */
        TransactionsChartModel.prototype.load = function(queryParams) {
            var self = this,
                $xhr;

            $xhr = self.transactionsChartModel.read(queryParams).success(function(data){
                self.chartData = data;
            });

            $xhr.error(function(data){
                if(data.errors) {
                    self.error = data.errors[0].code;
                }
            });

            return $xhr;
        };

        return {
            getInstance: function(config) {
                return new TransactionsChartModel(config);
            }
        };
    }]);
});
