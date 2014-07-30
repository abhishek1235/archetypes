define("launchpad/lib/common/rest-services", [
    "jquery",
    "angular",
    "launchpad/lib/common/util",
    "launchpad/lib/common/common-module"
], function($, angular, util, commonModule) {

    "use strict";

    commonModule.constant('httpServicesConfig', {
        defaultConfig: {
            cacheTimeout: 1000,
            xhrTimeout: 5000
        }
    });

	commonModule.factory('httpService', ['$http', '$q', '$timeout', 'httpServicesConfig',
		function($http, $q, $timeout, httpServicesConfig) {

        /**
         * Creates a new Service instance
         * @param config
         * @constructor
         */
        var HttpService = function(config) {
            angular.extend(this, httpServicesConfig.defaultConfig, config);
        };

        /**
         * Read operation for this service,
         * Will send an asynchronous GET request to this service's endpoint
         * @param {Object} params Add get parameters
         * @param {Boolean} force bypass cache
         * @returns {Object} an xhr promise
         */
        HttpService.prototype.read = function(params, force) {

	        var self = this;

            var cacheId = getCacheKey(this.endpoint, params),
                promise;

            if (!force) {
                promise = getCacheItem(cacheId);
            }

            if (!promise) {
                promise = makeXhrRequest(this.endpoint, 'GET', {}, params)
                .success(function(response) {
                    setCacheItem(cacheId, response, self.cacheTimeout);
                });
            }

            return promise;
        };

        /**
         *
         * @returns {string}
         * @private
         */
        var getCacheKey = function(url, params) {
	        params = params ? "." + JSON.stringify(params) : "";
            return "launchpad.services/" + url + params;
        };

        /**
         *
         * @returns {null}
         * @private
         */
        var getCacheItem = function(cacheId) {
            var cacheData = sessionStorage.getItem(cacheId);
	        var promise = null;

            if (cacheData && cacheData.timestamp > -1) {
                cacheData = JSON.parse(cacheData);
                promise = resolvePromise(cacheData.data);
            }
	        return promise;
        };

        /**
         *
         * @param data
         * @private
         */
        var setCacheItem = function(cacheId, data, timeout) {
            sessionStorage.setItem(cacheId, JSON.stringify({
                timestamp: new Date().getTime(),
                data: data
            }));
	        $timeout(function() {
		        clearCacheItem(cacheId);
	        }, timeout);
        };

        /**
         *
         * @returns {string}
         * @private
         */
        var clearCacheItem = function(cacheId) {
            sessionStorage.removeItem(cacheId);
        };

        /**
         * Create operation for this service
         * Will send a POST request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.create = function(config) {
             config = angular.extend({}, { method: 'POST' },  config);
            return makeXhrRequest(this.endpoint, config.method, config.data);
        };

        /**
         * Update operation for this service
         * Will send a PUT request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.update = function(config) {
            config = angular.extend({}, { method: 'PUT' },  config);
            return makeXhrRequest(this.endpoint, config.method, config.data);
        };

        /**
         * Delete operation for this service
         * Will send a DELETE request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.del = function(config) {
            config = angular.extend({}, { method: 'DELETE' },  config);
            return makeXhrRequest(this.endpoint, config.method, config.data);
        };

        /**
         *
         * @param conf
         * @returns {*}
         * @private
         */
         // Known issue with null: https://github.com/angular/angular.js/issues/2191
        var makeXhrRequest = function(url, method, data, params, timeout) {
            // Prevent caching in IE8
            if (method === 'GET' && $.browser.msie && parseFloat($.browser.version) <= 9 ) {
                params = angular.extend(params || {}, { dt: new Date().getTime() });
            }

            var config = {
                method: method,
                url: url,
                params: params,
                data: $.param(data || {}),
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                },
                timeout: timeout
            };

            var promise = $http(config);
            return promise;
        };

        var resolvePromise = function(data) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            // Defining `success` and `always` method for callbacks. 
            // `error` should never be called since the promise is resolved
            promise.success = function(fn){
                promise.then(function(response){
                    fn(response);
                }, null);
                return promise;
            };

            promise.error = function(fn){
               promise.then(null, function(response){
                    fn(response);
               });
               return promise;
            };

            promise.always = function(fn){
               promise.then(null, null, function(response){
                    fn(response);
               });
               return promise;
            };

            $timeout(function() {
                deferred.resolve(data);
            });

            return promise;
        };

        // Service pool
        var services = {};

        var getServiceInstance = function(config) {
            // Validate
            if(!config.endpoint || typeof config.endpoint !== "string") {
                throw new Error("You must specify an endpoint in your service config");
            }

	        if (!services[config.endpoint]) {
	            // Fix paramaterized context path (and backwards compatible with contextRoot)
		        // Update variables in endpoint url [ /transactions/$(transactiondId) ]
		        config.urlVars = config.urlVars || {};
		        config.urlVars.contextRoot = config.urlVars.contextRoot || util.getContextPath();
		        config.urlVars.contextPath = config.urlVars.contextPath || util.getServicesPath();
		        config.urlVars.servicesPath = config.urlVars.servicesPath || util.getServicesPath();
		        config.endpoint = util.replaceUrlVars(config.endpoint, config.urlVars);

                services[config.endpoint] = new HttpService(config);
            }

            return services[config.endpoint];
        };

        return {
            getInstance: getServiceInstance,
            resolvePromise: resolvePromise
        };
    }]);
});
