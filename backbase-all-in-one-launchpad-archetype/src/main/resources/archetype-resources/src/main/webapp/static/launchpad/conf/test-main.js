/**
 * Launchpad Foundation Test Start
 */

function isKarmaEnv() {
	return window.__karma__;
}

require.config({
	//use karma relative base or run via jasmin spec runner
	baseUrl : isKarmaEnv() ? "/base/static" : "../../",
	paths: {
		"angular" : "launchpad/support/angular/angular.min",
		"angular-mocks" : "launchpad/test/support/angular-mocks",
		"jquery" : "launchpad/test/support/jquery",
		"jquery.mockjax" : "launchpad/test/support/jquery.mockjax",
		"lp" : "launchpad/test/support/test-require-plugin",
		"domReady" : "launchpad/test/support/dom-ready",
        "atmosphere" : "launchpad/test/support/atmosphere"
	},
	shim: {
		// libs
		"angular" : { exports: "angular" },
        "atmosphere" : { exports: "atmosphere"},
		"angular-mocks" : { deps : ["angular"] },
		"launchpad/lib/common/util" : { deps: ["jquery", "launchpad/test/mock/mock-portal-client"], exports: "lp.util" },
		"launchpad/behaviors/retail-behaviors" : { exports : "lp.retail.RetailBehaviors" },
		"launchpad/lib/ui/responsive" : { deps: ["jquery"], exports: "lp.responsive" },
		"launchpad/lib/common/rest-client" : { deps: ["jquery"] },
		"jquery.mockjax": { deps: ["jquery"] },
		"launchpad/support/date" : {},
		"launchpad/support/globalize.launchpad" : { exports: "Globalize" },
		"launchpad/test/mock/mock-portal-client": { deps: [ "jquery"], exports: "b$" },
		"launchpad/page/portal-setup" : { deps: [ "jquery", "launchpad/test/mock/mock-portal-client"], exports: "lp.portalExtensions"},
		"launchpad/support/angular/angular-ui-bootstrap" :  { deps : ["angular"] }

	}
});

//QUESTION: is it better to manually define test specs here for running via spec runner and karma
//or to include spec files automatically for karam?
//karma setup
/*
var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		if (/spec\.js$/.test(file)) {
			tests.push(file);
		}
	}
}*/
require([
	//add specs here:
	"launchpad/test/page/session-timeout-spec",
	"launchpad/test/lib/util-spec",
	"launchpad/test/widgets/notifications-spec",
	"launchpad/test/widgets/loginmfa-spec",
	"launchpad/test/widgets/profile-details-spec",
	"launchpad/test/lib/payments/currency-input-spec",
    "launchpad/test/page/server-client-push-spec",
	"launchpad/test/lib/angular/transactions-model-spec",
	"launchpad/test/lib/accounts/account-model-spec",
    "launchpad/test/lib/angular/currency-model-spec",
	"launchpad/test/lib/angular/contacts-model-spec",
	"launchpad/test/lib/angular/payment-orders-spec",
    "launchpad/test/lib/angular/balance-update-spec",
    "launchpad/test/lib/payments/currency-amount-input-spec",
    "launchpad/test/lib/payments/iban-input-spec",
    "launchpad/test/lib/payments/payment-ref-desc-spec",
	"launchpad/test/lib/angular/transactions-chart-model-spec",
	"launchpad/test/lib/accounts/accounts-chart-model-spec"
	//"launchpad/test/behaviors/retail-behaviors"
], function () {

	if(isKarmaEnv()) {
		window.__karma__.start();
	} else {
		var jasmineEnv = jasmine.getEnv();
		jasmineEnv.updateInterval = 1000;

		var htmlReporter = new jasmine.HtmlReporter();
		jasmineEnv.addReporter(htmlReporter);

		jasmineEnv.specFilter = function(spec) {
			return htmlReporter.specFilter(spec);
		};
		jasmineEnv.execute();
	}

});
