define("launchpad/lib/i18n/i18n-module",[
		"angular",
		"jquery",
		"launchpad/support/globalize.launchpad",
		"launchpad/lib/common"], function(angular, $, Globalize) {

	"use strict";

	//TOOD: move to default culture info
	var currencyMap = {
		"ALL" : "Lek",
		"AFN" : "؋",
		"ARS" : "$",
		"AWG" : "ƒ",
		"AUD" : "$",
		"AZN" : "ман",
		"BSD" : "$",
		"BBD" : "$",
		"BYR" : "p.",
		"BZD" : "BZ$",
		"BMD" : "$",
		"BOB" : "$b",
		"BAM" : "KM",
		"BWP" : "P",
		"BGN" : "лв",
		"BRL" : "R$",
		"BND" : "$",
		"KHR" : "៛",
		"CAD" : "$",
		"KYD" : "$",
		"CLP" : "$",
		"CNY" : "¥",
		"COP" : "$",
		"CRC" : "₡",
		"HRK" : "kn",
		"CUP" : "₱",
		"CZK" : "Kč",
		"DKK" : "kr",
		"DOP" : "RD$",
		"XCD" : "$",
		"EGP" : "£",
		"SVC" : "$",
		"EEK" : "kr",
		"EUR" : "€",
		"FKP" : "£",
		"FJD" : "$",
		"GHC" : "¢",
		"GIP" : "£",
		"GTQ" : "Q",
		"GGP" : "£",
		"GYD" : "",
		"HNL" : "L",
		"HKD" : "$",
		"HUF" : "Ft",
		"ISK" : "kr",
		"IDR" : "Rp",
		"IRR" : "﷼",
		"IMP" : "£",
		"ILS" : "₪",
		"JMD" : "J$",
		"JPY" : "¥",
		"JEP" : "£",
		"KZT" : "лв",
		"KGS" : "лв",
		"LAK" : "₭",
		"LVL" : "Ls",
		"LBP" : "£",
		"LRD" : "$",
		"LTL" : "Lt",
		"MKD" : "ден",
		"MYR" : "RM",
		"MUR" : "₨",
		"MXN" : "$",
		"MNT" : "₮",
		"MZN" : "MT",
		"NAD" : "$",
		"NPR" : "₨",
		"ANG" : "ƒ",
		"NZD" : "$",
		"NIO" : "C$",
		"NGN" : "₦",
		"KPW" : "₩",
		"NOK" : "kr",
		"OMR" : "﷼",
		"PKR" : "₨",
		"PAB" : "B/.",
		"PYG" : "Gs",
		"PEN" : "S/.",
		"PHP" : "₱",
		"PLN" : "zł",
		"QAR" : "﷼",
		"RON" : "lei",
		"RUB" : "руб",
		"SHP" : "£",
		"SAR" : "﷼",
		"RSD" : "Дин.",
		"SCR" : "₨",
		"SGD" : "$",
		"SBD" : "$",
		"SOS" : "S",
		"ZAR" : "R",
		"KRW" : "₩",
		"LKR" : "₨",
		"SEK" : "kr",
		"CHF" : "CHF",
		"SRD" : "$",
		"SYP" : "£",
		"TWD" : "NT$",
		"THB" : "฿",
		"TTD" : "TT$",
		"TRL" : "₤",
		"TVD" : "$",
		"UAH" : "₴",
		"GBP" : "£",
		"USD" : "$",
		"UYU" : "$U",
		"UZS" : "лв",
		"VEF" : "Bs",
		"VND" : "₫",
		"YER" : "﷼",
		"ZWD" : "Z$"
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Standalone functions
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var findOnScopeAndParents = function(scope, name) {

		if(scope[name]) {
			return scope[name];
		} else if(scope.$parent) {
			return findOnScopeAndParents(scope.$parent, name);
		}
		return null;
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Angular module + directives
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var module  = angular.module("i18n", ["common"]);

	module.factory("i18nUtils", ['httpService', function(httpService) {

		var i18nUtils = {};

		i18nUtils.loadMessages = function(widget, locale, messageSrcPref) {

			var response;
			messageSrcPref = messageSrcPref || "messageSrc";
			var messageSrc = widget.getPreference(messageSrcPref);
			if(messageSrc) {
				var messagesService = httpService.getInstance({
					endpoint: messageSrc
				});
				response = messagesService.read();
			} else {
				response = httpService.resolvePromise({});
			}
			return response;
		};

		i18nUtils.formatAmount = function(locale, value, currency) {

			if(locale) {
				Globalize.culture(locale);
			}
			Globalize.culture().numberFormat.currency.symbol = currencyMap[currency] || "";

			var formattedAmount =  Globalize.format( value, "c" );
			return formattedAmount;
		};

		i18nUtils.formatDate = function(locale, value, options) {

			options = options || {};

			if(locale) {
				Globalize.culture(locale);
			}

			var formattedDate =  Globalize.format( value, options.format || null );
			return formattedDate;
		};
		return i18nUtils;
	}]);

	module.directive("lpAmount", [ "i18nUtils", function(i18nUtils) {
		return {
			replace: false,
			restrict: "A",
			scope: {
				"amount": "=lpAmount",
				"currency": "=lpAmountCurrency",
				"locale" : "@"
			},
			template: "<span class='{{signClass}}'>{{formattedAmount}}</span>",
			link: function(scope, element, attrs) {

				scope.$watch("amount", function(amount) {

					amount = parseFloat(amount);
					scope.signClass = amount < 0 ? "lp-amount-negative" : "lp-amount-positive";
					var currency = scope.currency;
					//Q: must be a better way to achieve this with angular???
					var locale = findOnScopeAndParents(scope, "locale");
					scope.formattedAmount = i18nUtils.formatAmount(locale, amount, currency);
				});
			}
		};
	}]);

	module.directive("lpMessage", function() {
		return {
			replace: false,
			restrict: "A",
			scope: {
				"key": "=lpMessage",
				"messages": "=lpBundle"
			},
			template: "{{value}}",
			link: function(scope, element, attrs) {

				var insertMessage = function(key, messages) {

					var value;
					if(messages && messages.hasOwnProperty(key)) {
						value = messages[key];
					} else {
						value = "[" + key + "]";
					}
					scope.value = value;
				};

				scope.$watch("key", function(key) {
					insertMessage(key, scope.messages);
				});
				scope.$watch("messages", function(messages) {
					insertMessage(scope.key, messages);
				});
			}
		};
	});
});
