# Grunt proxy and bundle static file server

This is a tool for FE developers that will expose the developers static resources and proxy them to the same path as you portal.

## why?

If you can proxy you statics as if they exist in the same location as it would be in a live environment you are half way there.
But.. more import than this, you don't have to configure/change anything on the portal server so you can treat it as a black box and
develop your radical widgets in relative isolation.

## Setup

Using node and the the grunt configured in the gruntfile.js you need to install the required modules as in any node app.

Run:  npm install
Run*:  npm install -g grunt
Run*:  npm install -g grunt-cli

*Only do this if you have never installed grunt before

Then you able to start the static server to host you widgets/css/templates and the
proxy to redirect the portal and your static under the same port

Run the server: grunt go
with default settings goto: http://localhost:8000/portalserver



extras: 
 - buildConfig.js is where you can configure some project specifics directories
 - proxyingTasks.js is where you can make proxies to external resources, i.e. use mosaic tool from web or 
    proxy in a portalserver from DTAP.
 - there is a watch task that can be cinfguraed to compile less and apply junit validation
 - all static are browsable by directory from the root of the server