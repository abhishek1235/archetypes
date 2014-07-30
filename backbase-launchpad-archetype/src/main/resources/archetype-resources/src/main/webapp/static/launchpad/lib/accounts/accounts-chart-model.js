define("launchpad/lib/accounts/accounts-chart-model", [
	"jquery",
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/accounts/accounts-module"], function($, angular, util, accountsModule) {

    "use strict";

    function applyScope(scope) {
        if(!scope.$$phase) {
            scope.$apply();
        }
    }

    accountsModule.factory("AccountsChartModel", [ '$rootScope', 'httpService', function($rootScope, httpService) {

        /**
         * Accounts Chart service constructor
         * @param config
         * @constructor
         */
        var AccountsChartModel = function(config) {
            this.accountsChartModel = httpService.getInstance({
                endpoint: config.accountsChartEndpoint,
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
        AccountsChartModel.prototype.load = function(queryParams) {
            var self = this,
                $xhr;

            $xhr = self.accountsChartModel.read(queryParams).success(function(data){
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
                return new AccountsChartModel(config);
            }
        };
    }]);

});
