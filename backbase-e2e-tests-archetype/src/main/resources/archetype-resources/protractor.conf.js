var JasmineReporters = require('jasmine-reporters');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',

	specs: ['e2e/1.sample.js'],

	capabilities: {
		'browserName': 'chrome'
	},

	onPrepare: function() {
		return browser.getCapabilities().then(function(caps){
			var browserName = caps.get('browserName').toUpperCase();
			var browserVersion = caps.get('version');
			var prefix = browserName + '-' + browserVersion + '-';
			
			var junitReporter = new JasmineReporters.JUnitXmlReporter({
				savePath: 'target/reports/junit',
				filePrefix: prefix,
				consolidateAll:false});

			var htmlReporter = new HtmlScreenshotReporter({
				dest: 'target/reports/html',
				filename: 'report.html',
				reportTitle: "E2E test report",
				pathBuilder: function(currentSpec, suites, browserCapabilities) {
					// will return chrome/your-spec-name.png
					return browserCapabilities.get('browserName') + '/' + currentSpec.id;
				}
			})
			
			jasmine.getEnv().addReporter(junitReporter);
			jasmine.getEnv().addReporter(htmlReporter);
		});
	}
}