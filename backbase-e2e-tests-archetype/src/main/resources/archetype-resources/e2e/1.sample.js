var SamplePage = require ('../Pages/Sample.js');
var sample = new SamplePage();

describe ('Sample e2e test'+browser.screenType, function(){

	beforeEach(function() { //Necessary if the application does not use Angular or uses timers (or anything that prevents synchronization)

		browser.ignoreSynchronization = true; //not needed for an angular app
		browser.manage().timeouts().implicitlyWait(10000);
        browser.driver.manage().window().maximize();
        browser.get(testParams.serverUrl);
        allure.feature('Epic name');//If we use the same feature name in several describes they will be grouped in Allure
	});

	afterEach(function() {
        browser.driver.manage().deleteAllCookies(); //This way we can log in again
    });

	it ('Should have the correct header'+browser.screenType, function(){

        allure.story('User story name ');
		sample.get();
		expect(sample.header.getText()).toEqual("Example Domain");
	});

	it ('Should go to iana.org for more info', function(){

        allure.story('User story name ');
		sample.moreInfo();
		browser.sleep(500);
		expect(browser.getCurrentUrl()).toBe("http://www.iana.org/domains/reserved");
	});

});