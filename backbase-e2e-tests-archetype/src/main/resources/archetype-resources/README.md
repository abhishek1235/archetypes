#Description

This is a stand-alone module for running end-to-end (e2e) Protractor tests through Maven.

#Rationale

These tests are not a part of the Portal module as they are not intended to be run as a part of the build, but independently.
It is done this way to make running on Jenkins easier. Protractor tests require Selenium webdriver manager running
and actual browsers to perform tests, none of which are not normally present on Jenkins, so testing the current build is difficult.
For that reason, this module is meant to be run in its own life-cycle, executing tests on a remote Selenium grid and browsers.

#Usage

##Using local node and npm installation

[Frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) is configured to download and install node and npm locally
ensuring repeatable builds without dependencies on external environment. Using these, it will install the required dependencies and run
the test script which triggers protractor.

To run, use the following command:

	$ mvn clean test

**Note:** This approach may generate paths too long for Windows. In that case, use the global node and npm installation.
Alternatively, consider enabling path flattening:

    <execution>
        <id>npm flatten</id>
        <phase>generate-resources</phase>
        <goals>
            <goal>npm</goal>
        </goals>
        <configuration>
            <arguments>run flatten</arguments>
        </configuration>
    </execution>


###Npm proxies

The local npm installation can optionally be configured to use maven
proxies (as specified in ~/.m2/settings.xml) by setting _npmInheritsProxyConfigFromMaven_ to _true_. 


##Using global (existing) node and npm installation

An option to use globally installed node and npm is provided and can be triggered by:

    $ mvn clean test -Dglobal
    
**Note:** node v4+ is required to run protractor v3.3

#Content
 _e2e_ - containing specs (test suites)
 _Pages_ - containing page objects
 _protractor.conf.js_ - containing main configurations like Selenium webdriver address, framework, browser and reports.

#Test results reporting

The reports will be generated in the _target_ folder, in HTML and JUnit XML format. Test results are organised per test suite and they contain screenshots.