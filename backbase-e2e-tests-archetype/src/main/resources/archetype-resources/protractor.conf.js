var jasmineReporters = require('jasmine-reporters');

exports.config = {
  framework: 'jasmine2',
	seleniumAddress: 'http://panther:4444/wd/hub',

	specs: ['e2e/1.sample.js'],

	capabilities: {
		'browserName': 'chrome'
	},

	onPrepare: function() {
      browser.getCapabilities().then(function(caps){
        var browserName = caps.caps_.browserName.toUpperCase();
        var browserVersion = caps.caps_.version;
        var prefix = browserName + '-' + browserVersion + '-';
        var junitReporter = new jasmineReporters.JUnitXmlReporter({
          savePath: 'target/reports/junit',
          filePrefix: prefix,
          consolidateAll:false});
        jasmine.getEnv().addReporter(junitReporter);
      });
    }
}