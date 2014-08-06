# Grunt proxy and bundle static file server

This is a tool for FE developers that will expose the developers static resources and proxy them to the same path as you portal.

## Why?

If you can proxy you statics as if they exist in the same location as it would be in a live environment you are half way there.
But.. more import than this, you don't have to configure/change anything on the portal server so you can treat it as a black box and
develop your radical widgets in relative isolation.

## Setup

Using node and the the grunt configured in the gruntfile.js you need to install the required modules as in any node app.

Run:  `npm install`
Run:  `npm install -g grunt`
Run:  `npm install -g grunt-cli`

Then you able to start the static server to host you widgets/css/templates and the
proxy to redirect the portal and your static under the same port

Run the server: `grunt go`
Goto: http://localhost:8000/portalserver

Extras: to host the static server only (8001) without proxying the directory to a friendly url: `grunt server`

## Appendix

With grunt you get all sort of goodies to help QA of you widgets so late we will introduce some pre prod steps.

    npm install grunt-contrib-watch --save-dev; \
      npm install grunt-contrib-jshint --save-dev; \
      npm install grunt-contrib-uglify --save-dev; \
      npm install grunt-contrib-requirejs --save-dev; \
      npm install grunt-contrib-sass --save-dev; \
      npm install grunt-contrib-imagemin --save-dev; \
      npm install grunt-contrib-htmlmin --save-dev; \
      npm install grunt-contrib-jasmine --save-dev; \
      npm install grunt-template-jasmine-requirejs --save-dev; \
      npm install grunt-contrib-copy --save-dev; \
      npm install load-grunt-tasks --save-dev; \
      npm install grunt-contrib-clean --save-dev; \
      npm install q --save-dev; \
      npm install glob --save-dev
