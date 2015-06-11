var SamplePage = require ('../Pages/Sample.js');

var sample = new SamplePage();

describe ('Sample e2e test', function(){

	beforeEach(function() {
		sample.get();
		//Necessary if the application does not use Angular or uses timers (or anything that prevents synchronization)
		browser.ignoreSynchronization = true;
		browser.sleep(2000);
	});

	it ('Should have the correct header', function(){

		expect(sample.header.getText()).toBe("Example Domain");
	});

	it ('Should go to iana.org for more info', function(){

		//Click the "more info" link
		sample.moreInfo();
		
		browser.sleep(2000);
		expect(browser.getCurrentUrl()).toBe("http://www.iana.org/domains/reserved");
	});

});