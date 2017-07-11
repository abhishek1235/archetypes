var JasmineReporters = require('jasmine-reporters');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var AllureReporter = require('jasmine-allure-reporter');
var JasmineSpecReporter = require('jasmine-spec-reporter'); //to have verbose report on the console


exports.config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/1.sample.js'],

	multiCapabilities: [
            {
                browserName: 'firefox',
               // specs: ['./tests/smokeTests.js' ] //this way we can select specific tests for an specific capability
            },

            {
                browserName: 'chrome'
            },

            {
                browserName: 'chrome',
                chromeOptions: {
                    args: ['--lang=en',
                        '--window-size=500,500']
                }
            },

            {
                browserName: 'chrome',
                chromeOptions: {
                    mobileEmulation: {
                        deviceName: 'Nexus 5'
                    }
                },
                //specs: ['./tests/mobile.js' ]
            },

            {
                browserName: 'chrome',
                chromeOptions: {
                    mobileEmulation: {
                        deviceName: 'iPad Mini'
                    }
                },
               // specs: ['./tests/overview.js' ]
            }
    ],

    params:{//Here we can add all the necessary parameters coming from the command line
            environment: "", //Default value
    },

	onPrepare: function() {

            return browser.getCapabilities().then(function(caps){
                browser.browserName = caps.get('browserName').toUpperCase();
                browser.browserVersion = caps.get('version');
                browser.prefix = browser.browserName + '-' + browser.browserVersion + '-';
                browser.manage().timeouts().implicitlyWait(15000);
                //Broser Type and ScreenType
                //browser.deviceType -> will be used if we need to define different behaviours between mobile and desktop
                //browser.screenType -> will be used to print the size of screen or if it is mobile or not
                browser.getProcessedConfig().then(function (config){
                    if ("undefined" === typeof config.capabilities.chromeOptions) {
                        browser.screenType = caps.get('browserName').toUpperCase()+' desktop';
                        browser.deviceType = 'DESKTOP';
                    }else if ("undefined" === typeof config.capabilities.chromeOptions.mobileEmulation) {
                        browser.screenType = caps.get('browserName').toUpperCase()+' desktop '+config.capabilities.chromeOptions.args[1];
                        browser.deviceType = 'DESKTOP';
                    } else {
                        browser.screenType = caps.get('browserName').toUpperCase()+' '+config.capabilities.chromeOptions.mobileEmulation.deviceName.toString();
                        browser.deviceType = 'MOBILE';
                    }
                });
                switch (browser.params.environment) {
                    case "LOCAL":
                        console.log("Local deployment Selected");
                        testParams = require('./configuration/testdata/local.js');
                        break;
                    case "EDIT":
                        console.log("Edit deployment Selected");
                        testParams = require('./configuration/testdata/edit.js');
                        break;
                    case "STAGING":
                        console.log("Staging deployment Selected");
                        testParams = require('./configuration/testdata/staging.js');
                    case "TEST":
                        console.log("Test deployment Selected");
                    default:
                        console.log("default Selected");
                        testParams = require('./configuration/testdata/test.js');
                }
                browser.baseUrl = testParams.serverUrl;

                var junitReporter = new JasmineReporters.JUnitXmlReporter({
                    savePath: 'target/reports/junit',
                    consolidateAll:false});

                var htmlReporter = new HtmlScreenshotReporter({
                    dest: 'target/reports/html',
                    filename: 'report.html',
                    reportTitle: "E2E test report",
                    pathBuilder: function(currentSpec, suites, browserCapabilities) {
                        // will return chrome/your-spec-name.png
                        return browserCapabilities.get('browserName') + '/' + currentSpec.id;
                    }
                });

                var allureReporter = new AllureReporter({
                    resultsDir: 'target/allure-results'
                });

                var jasmineReporter = new JasmineSpecReporter({
                       // displayStacktrace: 'all'
                });

                jasmine.getEnv().afterEach(function(done){

                    browser.takeScreenshot().then(function(png){
                        allure.createAttachment('Screenshot', function(){
                            return new Buffer(png, 'base64')
                        }, 'image/png')();
                        done();
                    })

                });


                jasmine.getEnv().addReporter(junitReporter);
                jasmine.getEnv().addReporter(htmlReporter);
                jasmine.getEnv().addReporter(allureReporter);
                jasmine.getEnv().addReporter(jasmineReporter);

            });
            console.log("End of on prepare!");
    }

}