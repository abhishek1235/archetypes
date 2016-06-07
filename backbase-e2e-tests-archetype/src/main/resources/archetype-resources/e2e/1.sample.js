var SamplePage = require ('../Pages/Sample.js');
var sample = new SamplePage();

describe ('Sample e2e test', function(){

	beforeEach(function() { //Necessary if the application does not use Angular or uses timers (or anything that prevents synchronization)

		browser.ignoreSynchronization = true;
		browser.sleep(2000);
	});


	it ('Should have the correct header', function(){

		sample.get();
		expect(sample.header.getText()).toEqual("Example Domain");
	});

	it ('Should go to iana.org for more info', function(){

		sample.moreInfo();

		browser.sleep(500);
		expect(browser.getCurrentUrl()).toBe("http://www.iana.org/domains/reserved");
	});

});