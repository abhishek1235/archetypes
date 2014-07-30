define("launchpad/lib/accounts/accounts-module",[
	"angular",
	"launchpad/lib/common"
	], function(angular) {
		"use strict";

		var module = angular.module("accounts", ["common", "i18n", "ui.bootstrap", "ui"]);

		module.value("groupsTimeout", 600 * 1000);
		module.value("accountsTimeout", 10 * 1000);
		// TODO: move to server
		module.value("customerId", "3");

		return module;
});
