/*global b$ */
define("launchpad/lib/user/user-module", [
    "angular",
    "jquery",
    "launchpad/lib/common/util"], function(angular, $, util) {

    "use strict";

    var module = angular.module("user", []);

    // Constant configuration
    module.constant("loginStorageConfig", {
        userId: "launchpad.userId",
        userData: "launchpad.userData"
    });

    // Congiguration that user can override
    module.constant("loginConfig", {
        loginUrl: util.getServicesPath() + "/j_spring_security_check",
        logoutUrl: util.getServicesPath() + "/j_spring_security_logout?portalName=" + window.b$.portal.portalName,
        successPage: null
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Login model
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Login service
    module.service("LoginService", ["$http", "$window", "loginConfig", "loginStorageConfig", function($http, $window, loginConfig, storageConfig) {

        var self = this,
            config = angular.copy(loginConfig);

        // Allow user to configure some attributes
        this.configure = function(_config) {
            angular.extend(config, _config);
        };

        /**
         * Login
         */
        this.doLogin = function(userId, password) {
            var promise = this.getLoginPromise(userId, password).success(function( response ) {
                self.error = null;
                self.handleSuccessfulLogin(response);
            }).error(function(response) {
                self.error = response.errors[0].code;
            });

            return promise;
        };

        this.getLoginPromise = function(userId, password) {
            var data = {
                j_username: userId,
                j_password: password,
                portal_name: window.b$.portal.getCurrentPortal().name,
                page_name: window.b$.portal.getCurrentPage().name
            };

            return $http.post(config.loginUrl + "?rd=" + new Date().getTime(), $.param(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                }
            });
        };


        /**
         * Handle succesful authentication attempt.
         */
        this.handleSuccessfulLogin = function( response ) {

	        //TODO: why do i get a success view? how can i force a reload?
	        if($window.location.protocol.indexOf("file:") === 0) {
		        response.successView = null;
	        }

            if ( response.successView ) {
                // Redirect
	            //TODO: paramaterize the context path
	            $window.location.replace(util.getContextPath() + response.successView);
            } else {
	            var currentLocation;
                // Refresh
	            if($window.location.protocol.indexOf("file:") === 0) {
		            //need to strip out url to state when running on the files system
		            currentLocation =
			            $window.location.pathname.split("//")[0] + $window.location.search + $window.location.hash;
	            } else {
		            currentLocation = $window.location.href;
	            }
                $window.location.replace(currentLocation);
            }
        };

        /**
         * Logout
         */
        this.doLogout = function() {

            $window.sessionStorage.clear();
            $window.location.href = config.logoutUrl;
        };

        // Retrieve stored user data
        this.getStoredData = function() {
            return $window.sessionStorage.getItem( storageConfig.userData );
        };

    }]);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Profile image
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    module.directive('profileImage', function () {
        return {
            restrict:'EA',
            replace: true,
            template: '<img height="{{size}}" width="{{size}}" ng-src="{{dataUrl}}"" />',
            scope: {
                fullname: '@',
                color: '@',
                size: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('size + fullname + color', function() {
                    var width = scope.size || 100;
                    var height = scope.size || 100;
                    updateSrc(width, height);
                });

                var updateSrc = function(width, height) {
                    scope.dataUrl=  util.getDefaultProfileImage(scope.fullname, width, height, scope.color);
                };
            }
        };
    });
});
