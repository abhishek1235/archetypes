# Description

This is a stand-alone module for running end-to-end (e2e) Protractor tests through Maven.
The tests are executed on a remote machine and target Aldermore Dev environment.


#Rationale

These tests are not a part of the Portal module as they are not intended to be run as a part of the build, but independently.
It is done this way to make running on Jenkins easier. Protractor tests require Selenium webdriver manager running
and actual browsers to perform tests, none of which are not normally present on Jenkins, so testing the current build is difficult.
For that reason, this module is meant to be run in its own life-cycle, executing tests on a remote Selenium grid and browsers.

This is also in line with the way Launchpad tests are done.

#Future improvements

It might be possible to run these tests inside the Portal build lifecycle on Jenkins in a headless browser (e.g. Phantom.js),
and with actual browsers in an independent lifecycle, like it is done now. The type of testing could then be controlled using Maven profiles.