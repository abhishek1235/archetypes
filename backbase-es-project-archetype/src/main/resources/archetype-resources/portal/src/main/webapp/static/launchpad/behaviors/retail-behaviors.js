/*global gadgets, window, console, jQuery */
(function($) {

	"use strict";

	//maps pubsub events to widget behavior tags
	// [pubsub event] : [widget's behavior tag]
	var showWidgetByEventMap = {
		"launchpad-retail.viewAccounts" : "accounts",
		"launchpad-retail.accountSelected" : "transactions",
		"launchpad-retail.requestMoneyTransfer" :  "new-transfer",
		"launchpad-retail.transactions.applyFilter" :  "transactions" ,
		"launchpad-retail.paymentOrderInitiated" :  "review-transfers"
	};

	var showWidgetByHotKeyMap = {
		"a" : "accounts",
		"t" : "transactions" ,
		"n" : "new-transfer",
		"c" : "address-book",
		"r" : "review-transfers",
        "l" : "places"
	};

	var showWidget = function(container, tag) {
		container.loadByBehavior(tag, function() {
			container.showByBehavior(tag);
		});
	};

	//wires up the map above, the containe will ask the container to display widgets
	var _assignEvent = function(container, event) {
		var tag = showWidgetByEventMap[event];
		gadgets.pubsub.subscribe(event, function(params) {
			// Explicitly forbid behavior from
			// processing a specific event.
			if (params && params._noBehavior) {
				return;
			}

			showWidget(container, tag);
		});
	};

	var initMappings = function(event) {

		//ignore propagated events
		if(this !== event.target) {
			return;
		}

		var container = this;
		var behaviorsInterfaceImplemented =
			typeof container.loadByBehavior === "function" && typeof container.showByBehavior === "function";

		//map retail specific events to container specific actions
		if(behaviorsInterfaceImplemented) {
			for(var pubsubEvent in showWidgetByEventMap) {
				if(showWidgetByEventMap.hasOwnProperty(pubsubEvent)) {
					_assignEvent(container, pubsubEvent);
				}
			}

            // bind keypress events
			$(document).on('keypress.retail', function(e) {
				//Please don't use e.keycode. It is not cross browser. jquery e.which is more reliable.
				var key = String.fromCharCode(e.which).toLowerCase();
				var behaviorTag = showWidgetByHotKeyMap[key];
				var targetElementTagName = e.target.tagName.toLowerCase();
				var validTarget = targetElementTagName !== 'input' && targetElementTagName !== 'textarea';

				// matching behavior tag, target is not an input
				if(behaviorTag && validTarget) {
					showWidget(container, behaviorTag);
				}
			});

		} else {
			console.warn("Attempting to map behaviors to an item which does implement the behaviors interface");
		}
	};

	/**
	 * Export
	 */
	window.lp = window.lp || {};
	window.lp.retail = window.lp.retail || {};
	window.lp.retail.RetailBehaviors = {
		behaviors: {
			"DOMNodeInsertedIntoDocument": initMappings
		}
	};
})(jQuery);
