define(["jquery",
		"angular",
        "launchpad/lib/common/util",
        "launchpad/lib/i18n",
        "launchpad/lib/user",
		"launchpad/support/jquery/placeholder"], function($, angular, util) {

        "use strict";

    var module = angular.module("launchpad-login", [ "user", "i18n" ]);

    module.controller("loginController", [ "$scope", "widget", "i18nUtils", "LoginService",
    function($scope, widget, i18nUtils, LoginService) {

        $scope.locale = "en-US";
        i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
            $scope.messages = bundle.messages;
        });

        $scope.user = {};

        var stored = LoginService.getStoredData();
        if ( stored ) {
            angular.extend($scope.user, {
                id: stored,
                remember: true
            });
        }

        $scope.allowSubmit = function() {
            return $scope.user.id;
        };

        $scope.doLogin = function() {
            $scope.$broadcast("autofill:update");

            LoginService.doLogin($scope.user.id, $scope.user.password, $scope.user.remember).then(function() {
                // Always assign error from service to our scope, so it can be visible
                $scope.error = LoginService.error;
            });
        };

        widget.addEventListener("preferencesSaved", function () {
            widget.refreshHTML();
        });

    }]);

	module.directive('placeholder', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var placeholder = attrs.placeholder;
				if (placeholder && $.fn.placeholder) {
					$(element).placeholder();
				}
			}
		};
	});

    module.directive("autofill", function () {
        return {
            require: "ngModel",
            restrict: "A",
            link: function (scope, element, attrs, ngModel) {
                scope.$on("autofill:update", function() {
                    ngModel.$setViewValue(element.val());
                });
            }
        };
    });

    return function(widget) {
        module.value("widget", widget);
        angular.bootstrap(widget.body, ["launchpad-login"]);
    };
});