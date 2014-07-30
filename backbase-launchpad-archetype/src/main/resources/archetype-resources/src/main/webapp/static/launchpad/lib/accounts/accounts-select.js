define('launchpad/lib/accounts/accounts-select', [
    'jquery',
    'angular',
    'launchpad/lib/accounts/accounts-module',
    'launchpad/support/angular/angular-ui-bootstrap',
    'launchpad/lib/ui',
    'launchpad/lib/i18n',
    'launchpad/lib/transactions'], function($, angular, accountsModule) {

    'use strict';


    accountsModule.directive('lpFormatAmount', ['$parse', 'i18nUtils', 'widget', function($parse, i18nUtils, widget) {
        return {
            restrict : 'A',
            scope: {
                account: '=lpFormatAmount'
            },
            link : function(scope, element, attrs) {
                scope.$watch('account', function(account) {
                    var balanceList = [];
                    balanceList.available = account.availableBalance;
                    balanceList.current = account.balance;

                    var preferredBalance = widget.getPreferenceFromParents("preferredBalanceView") || "current";
                    var formattedAmount = i18nUtils.formatAmount(scope.locale, balanceList[preferredBalance], account.currency);

                    element.html(formattedAmount);
                });
            }
        };
    }]);

    accountsModule.directive('lpAccountsSelect', ['i18nUtils', 'widget', '$templateCache', function(i18nUtils, widget, $templateCache){
        $templateCache.put('$accountSelectTemplate.html',
            '<div class="clearfix">' +
                '<div class="pull-left lp-acct-detail">' +
                    '<div class="clearfix">' +
                        '<div class="pull-left lp-acct-from">' +
                            '<span>From</span>' +
                        '</div>' +
                        '<div class="pull-left">' +
                            '<div class="lp-acct-name"><span>{{option.name}}</span></div>' +
                            '<div class="lp-acct-num"><small>IBAN:</small> <span lp-aria-number="option.iban"></span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="pull-right text-right">' +
                    '<div class="h4 lp-account-amount"><span class="sr-only">Account balance</span><span lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span></div>' +
                    '<div class="h6 lp-account-bal" ng-if="preferredBalance === \'current\'"><small>Current:</small> <span lp-amount="option.balance" lp-amount-currency="option.currency"/></div>' +
                    '<div class="h6 lp-account-bal" ng-if="preferredBalance !== \'current\'"><small>Available:</small> <span lp-amount="option.availableBalance" lp-amount-currency="option.currency"/>' +
                '</div>' +
            '</div>'
        );

        return {
            restrict : 'EA',
            replace: true,
            require: 'ngModel',
            scope: {
                lpAccounts : '='
            },
            template : '<div class="lp-account-select">' +
                            '<dropdown-select ng-model="model" ng-options="account as account for account in accounts"' +
                                'option-template-url="$accountSelectTemplate.html" ng-change="changed()" lp-responsive="lp-responsive" size-rules="responsiveRules" empty-placeholder-text="Select an account...">' +
                            '</dropdown-select>' +
                        '</div>',
            link : function(scope, element, attrs, ngModelCtrl){
                scope.preferredBalance = widget.getPreferenceFromParents("preferredBalanceView") || "current";

                ngModelCtrl.$render = function() {
                    var selected = ngModelCtrl.$modelValue,
                        accounts = scope.accounts;

                    if (selected && accounts && accounts.length > 0) {
                        angular.forEach(accounts, function(account) {
                            if (selected.id === account.id) {
                                scope.model = account;
                            }
                        });
                    } else {
                        scope.model = null;
                    }
                };

                scope.changed = function() {
                    ngModelCtrl.$setViewValue(scope.model);
                };

                scope.formatDefaultText = function(text) {
                    return '<div class="something">' + text + '</div>';
                };

                scope.$watch('lpAccounts', function(accounts) {
                    scope.accounts = accounts || [];
                    ngModelCtrl.$render();
                });

                scope.responsiveRules = [
                    { max: 300, size: 'small-account-select' },
                    { min: 301, max: 400, size: 'normal-account-select' },
                    { min: 401, size: 'large-account-select'}
                ];
            }
        };
    }]);
});
