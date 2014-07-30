/*global gadgets */
define(["angular",
	"launchpad/lib/common/util",
	"launchpad/lib/common",
	"launchpad/lib/i18n",
	"launchpad/lib/ui"], function(angular, util) {

	"use strict";

	//list of preferences stored on the widget
	var widgetPrefs = {
		NOTIFICATIONS_ENDPOINT: "notificationsEndpoint",
		CLOSE_NOTIFICATION_ENDPOINT: "closeNotificationEndpoint",
		POLL_INTERVAL: "pollInterval",
		ALLOW_PUBSUB: "allowPubsub"
	};

	var module = angular.module("launchpad-notifications", [ "i18n", "common", "ui" ]);

	/**
	 * Notifications Controller
	 */
	module.controller("NotificationsController", [ "$scope", "$rootElement", "widget", "NotificationsModel", "i18nUtils",
		function($scope, $rootElement, widget, NotificationsModel, i18nUtils) {

		//i18n
		$scope.locale = "en-US";
		i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
			$scope.messages = bundle.messages;
		});

		//get all the prefs
		var notificationsEndpoint = widget.getPreference(widgetPrefs.NOTIFICATIONS_ENDPOINT);
		var closeNotificationEndpoint = widget.getPreference(widgetPrefs.CLOSE_NOTIFICATION_ENDPOINT);
		var allowPubsub = util.parseBoolean(widget.getPreference(widgetPrefs.ALLOW_PUBSUB));
		var pollInterval = parseInt(widget.getPreference(widgetPrefs.POLL_INTERVAL), 10);

		//construct and initialize the model
		var model = NotificationsModel.getInstance({
			notificationsEndpoint: notificationsEndpoint,
			closeNotificationEndpoint: closeNotificationEndpoint,
			pollInterval: pollInterval || 0,
			onNotificationAdded: function(notification) {

				//this callback is fired when a new notification is added, which in turn fires
				//an event on the bdom, so parent containers are aware
				//For example the launcher container modifies its scroll position to accommodate the new message
				widget.model.fireEvent("notification-added", true, true, {
					notification: notification
				});
			}
		});
		$scope.model = model;

		// don't call loadNotifications or start polling if the user is not logged in
		if (window.b$.portal.loggedInUserId !== "null") {
			model.loadNotifications();

			//polling interval lower than 1 second is not supported
			if(!isNaN(pollInterval) && pollInterval > 999) {
				model.startPolling(pollInterval);
			}
		}

		//listen for notifcations from other 'on-page' sources, if enabled as a preference
		if(allowPubsub) {
			gadgets.pubsub.subscribe("launchpad.add-notification", function(data) {
				if(data.notification) {
					//text from a pubsub must be cleaned
					data.notification = util.escapeHtml(data.notification);
					model.addNotification(data.notification);
					util.applyScope($scope);
				}
			});
			gadgets.pubsub.subscribe("launchpad.remove-notification", function(data) {
				if(data.notification && data.notification.id) {
					//text from a pubsub must be cleaned
					model.removeNotification(data.notification.id);
					util.applyScope($scope);
				}
			});
		}

		//util view functions
		$scope.getAlertClass = function(notification) {

			var alertType = "alert-info";
			var level;
			if(notification.level) {
				level = notification.level.toLowerCase();
				if(level === "severe") {
					alertType = "alert-error";
				} else if(level === "warning") {
					alertType = "alert-warning";
				} else if(level === "success") {
					alertType = "alert-success";
				}
			}
			return alertType;
		};
		$scope.isValidLink = function(link) {
			return link.rel && link.uri;
		};
		$scope.isDesignMode = function() {
			return util.isDesignMode();
		};

		$scope.closeNotification = function(notification) {
			$scope.model.closeNotification(notification);

			if ($scope.model.notifications.length > 0) {
				$scope.$broadcast('lp.notifications.focus');
			}
		};
	}]);

	/**
	 * Notifications Model
	 */
	module.factory("NotificationsModel", [ "$rootScope", "$timeout", "httpService", function($rootScope, $timeout, httpService) {

		/**
		 * NotificationsModel constructor
		 * @param config
		 * @constructor
		 */
		var NotificationsModel = function(config) {

			config = config || {};
			this.notifications = [];
			this.notificationsEndpoint = config.notificationsEndpoint;
			this.closeNotificationEndpoint = config.closeNotificationEndpoint;
			this.updateReceivedEndpoint = config.updateReceivedEndpoint;
			this.polling = false;
			this.onNotificationAdded = config.onNotificationAdded;
			this.loading = false;
		};

		/**
		 * Initializes the model by loading notifications from the remote endpoint.
		 * If a pollInterval greater than 0 is also specified in the setup config, polling at that interval will also
		 * start.
		 */
		NotificationsModel.prototype.startPolling = function(pollInterval) {

			var self = this;

			//don't attempt to start polling if already polling
			if(this.polling) {
				return;
			}
			this.polling = true;

			//recursive timeout loading
			var load = function() {
				var xhr = self.loadNotifications();
				xhr.success(function() {
					self.pollingTimeout = $timeout(function() {
						load();
					}, pollInterval);
				});
			};

			//initial load after timeout
			this.pollingTimeout =  $timeout(function() {
				load();
			}, pollInterval);
		};

		/**
		 * Stops the notifications widget from polling
		 */
		NotificationsModel.prototype.stopPolling = function() {

			if(this.pollingTimeout) {
				$timeout.cancel(this.pollingTimeout);
				this.polling = false;
			}
		};

		/**
		 * Makes the request for notifications.
		 * Will also send a 'mark recieved' request once a list of messages have been received.
		 */
		NotificationsModel.prototype.loadNotifications = function() {

			var self = this;

			var getMessagesService = httpService.getInstance({
				endpoint: this.notificationsEndpoint,
				cacheTimeout: 0
			});

			this.loading = true;
			var xhr = getMessagesService.read();
			xhr.success(function(data) {
				if(data.messages) {
					data.messages.forEach(function(message) {
						self.addNotification(message);
					});
				}
			});
			xhr.error(function(data) {
				if(data.errors) {
					self.errorCode = data.errors[0];
				}
			});
			xhr['finally'](function() {
				self.loading = false;
			});
			return xhr;
		};

		/**
		 * Adds a new notification from the model
		 * @param notification
		 */
		NotificationsModel.prototype.addNotification = function(notification) {

			//messages must have an id, otherwise we cannot manage them
			if(typeof notification.id !== "string" && typeof notification.id !== "number") {
				return;
			}

			//ensures a notification with a 'type' field overrides any existing notifications of the same type
			var replaced = false;
			for(var i = 0; i < this.notifications.length && !replaced; i++) {
				if(notification.id && this.notifications[i].id === notification.id) {
					this.notifications[i] = notification;
					replaced = true;
				}
			}
			if(!replaced) {
				this.notifications.push(notification);

				if(typeof this.onNotificationAdded === "function") {
					this.onNotificationAdded.call(null, notification);
				}
			}
		};

		/**
		 * Removes a notification from the model. Does not update the server
		 * @param notification
		 */
		NotificationsModel.prototype.removeNotification = function(notification) {

			this.notifications.splice( this.notifications.indexOf(notification), 1 );
		};

		/**
		 * Removes a notification from the model
		 * @param notification
		 */
		NotificationsModel.prototype.closeNotification = function(notification) {

			var self = this;

			var closeOnServer = function() {
				self.removeNotification(notification);

				//sync with server
				var closeNotificationService = httpService.getInstance({
					endpoint: self.closeNotificationEndpoint,
					urlVars: {
						id: notification.id
					}
				});
				closeNotificationService.update();
			};

			//the timeout ensures that a close request waits for a current loading notifications request to
			//complete before attempting to close a notification. Otherwise an unlikely race condition could exist
			//where the notification is closed by the user, but the a load notifications response brings it back.
			var safeToClose = function() {
				$timeout(function() {
					if(!self.loading) {
						closeOnServer();
					} else {
						safeToClose();
					}
				}, 100);
			};
			safeToClose();
		};

		return {
			getInstance: function(config) {
				return new NotificationsModel(config);
			}
		};
	}]);

	return function(widget) {
		module.value("widget", widget);
		angular.bootstrap(widget.body, ["launchpad-notifications"]);
	};
});