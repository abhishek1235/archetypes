/*global gadgets */
define("launchpad/lib/accounts/accounts-model", [
	"jquery",
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/accounts/accounts-module"], function($, angular, util, accountsModule) {

    "use strict";

    accountsModule.factory("AccountsModel", [ '$rootScope', 'customerId', 'accountsTimeout', 'groupsTimeout', 'httpService', '$q',
	    function($rootScope, customerId, accountsTimeout, groupsTimeout, httpService, $q){

        /**
         * Accounts service constructor
         * @param config
         * @constructor
         */
        var AccountsModel = function(config) {

            var self = this;

            this.accountsModel = httpService.getInstance({
                endpoint: config.accountsEndpoint,
                cacheTimeout: accountsTimeout,
                urlVars: {
                    partyId: customerId
                }
            });
            this.groupsEnabled = !!config.groupsEndpoint;
            if (this.groupsEnabled) {
                this.groupsService = httpService.getInstance({
                    endpoint: config.groupsEndpoint,
                    cacheTimeout: groupsTimeout
                });
            }
            this.accounts = null;
            this.error = false;

            gadgets.pubsub.subscribe("launchpad-retail:ACCOUNT_BALANCE_CHANGED", function(response) {

                if(self.accounts !== null) {
                    self.load();
                }
            });
        };

        /**
         * Load data from server
         */
        AccountsModel.prototype.load = function() {
            var self = this,
                $xhr;

            var errorFn = function(data){
                if(data.errors) {
                    self.error = data.errors[0].code;
                }
            };

            if (this.groupsEnabled) {
                $xhr = $q.all([self.accountsModel.read(null, true), self.groupsService.read(null, true)]).then(function(response){
                    self.refreshAccounts(response[0].data);
                    self.fixAccounts();
                    self.groups = response[1].data;
                }, errorFn);
            } else {
                $xhr = self.accountsModel.read().success(function(response){
                    self.refreshAccounts(response);
                    self.fixAccounts();
                }).error(errorFn);
            }

            return $xhr;
        };


        /**
         * Find account by Id
         * @param id
         * @returns {Array}
         */
        AccountsModel.prototype.findById = function(id) {
            return this.accounts.filter(function(account){ return account.id === id; })[0];
        };

        /**
         * Find account by Account Number
         * @param id
         * @returns {Array}
         */
        AccountsModel.prototype.findByAccountNumber = function(bban) {
            return this.accounts.filter(function(account){ return account.bban === bban; })[0];
        };

        /**
         * Calculate pending
         * @param account
         * @returns {number}
         */
        AccountsModel.prototype.getPending = function(account) {
            return account.balance - account.availableBalance;
        };

        /**
         * Calculate size of the group
         * @param group
         * @returns {number}
         */
        AccountsModel.prototype.getGroupSize = function(group) {
            var size = 0;
            for (var i = 0; i < this.accounts.length; i++) {
                if (this.accounts[i].groupCode === group.code) {
                    size++;
                }
            }
            return size;
        };

        /**
         * Sets up a delta on individual account
         * @param listOfAccounts a list of the new accounts to load
         */
        AccountsModel.prototype.configurePreviousBalanceDeltas = function(listOfAccounts) {

            var self = this;

            if(!self.previousBalances) {
                //instantiate previous balances
                self.previousBalances = [];

                //initial load - all balances have a delta of 0
                angular.forEach(listOfAccounts, function(value) {
                    value.delta = 0;
                });
            } else {

                angular.forEach(listOfAccounts, function(value) {

                    if(self.previousBalances[value.id] > value.availableBalance) {
                        //new balance has decreased
                        value.delta = -1;
                    } else if (self.previousBalances[value.id] < value.availableBalance) {
                        //new balance has increased
                        value.delta = 1;
                    } else {
                        value.delta = 0;
                    }
                });
            }

            angular.forEach(listOfAccounts, function(value) {
                //apply the new balances as previous balances
                self.previousBalances[value.id] = value.availableBalance;
            });

            return listOfAccounts;
        };

        /**
         * Refresh accountsModel with new accounts
         * @param newAccounts the new accounts to set to the accountsModel
         */
         AccountsModel.prototype.refreshAccounts = function(newAccounts) {
             var self = this;

             newAccounts = self.configurePreviousBalanceDeltas(newAccounts);
             self.accounts = newAccounts;
         };

        /**
         * Calculate group total balance
         * @param group
         * @returns {{totalBalance: number, currency: *}}
         */
        AccountsModel.prototype.getGroupTotal = function(group) {
            var account,
                totalBalance = 0,
                currency;

            for (var j = 0; j < this.accounts.length; j++) {
                account = this.accounts[j];
                if (account.groupCode === group.code) {
                    totalBalance += account.balance;
                    currency = account.currency;
                }
            }

            return { totalBalance : totalBalance, currency : currency};
        };

        /**
         * TODO: remove after formatting is in place
         */
        AccountsModel.prototype.fixAccounts = function() {
            var account;
            for (var i = 0; i < this.accounts.length; i++) {
                account = this.accounts[i];
                account.balance = parseFloat(account.balance);
                account.availableBalance = parseFloat(account.availableBalance);
            }
        };



        return {
	        getInstance: function(config) {
		        return new AccountsModel(config);
	        }
        };
    }]);
});
