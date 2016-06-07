# Description

This is a stand-alone module for running end-to-end (e2e) Protractor tests through Maven.


#Rationale

These tests are not a part of the Portal module as they are not intended to be run as a part of the build, but independently.
It is done this way to make running on Jenkins easier. Protractor tests require Selenium webdriver manager running
and actual browsers to perform tests, none of which are not normally present on Jenkins, so testing the current build is difficult.
For that reason, this module is meant to be run in its own life-cycle, executing tests on a remote Selenium grid and browsers.

This is also in line with the way Launchpad tests are done.

#Content

In the selected folder, two additional subfolders will be generated: _e2e_ - containing smaple test and _Pages_ - containing sample page object.
In the protractor configuration file, _protractor.conf.js_, basic test configuration is set - Selenium webdriver address, framework, browser and reports.

#Test results reporting

The reports will be generated in the _target_ folder, in HTML and JUnit XML format. Test results are organised per test suite and they contain screenshots.