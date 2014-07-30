/*global requirejs b$ Modernizr */
requirejs.config({

    baseUrl : b$.portal.config.serverRoot + "/static/",
    waitSeconds: 60,
    paths: {

        // RequireJS plugins
        "propertyParser": "launchpad/support/requirejs/propertyParser",
        "async": "launchpad/support/requirejs/async",
        "goog": "launchpad/support/requirejs/goog",
        "portal": "launchpad/lib/common/noDup",
        "lp": "launchpad/lib/common/noDup",
        "noConflict": "launchpad/lib/common/noDup",

        // Core support
        "jquery" : "launchpad/support/requirejs/require-jquery",
        "jquery-ui": "launchpad/support/jquery/jquery-ui.custom.min",
        "angular": "launchpad/support/angular/angular.min",
        "d3" : "launchpad/support/d3/d3",
        "r2d3" : "launchpad/support/d3/r2d3",
        "aight" : "launchpad/support/d3/aight"
    },

    shim: {
        "b$" : { exports : "b$" },
        "jquery" : { exports : "jQuery" },
        "d3" : { exports : "d3" },
        "r2d3" : { deps: ["aight"], exports : "d3" },

        // jquery

        "jquery-ui": ["jquery"],

        // libs
        "launchpad/lib/common/util" : { deps: ["jquery"], exports: "lp.util" },
        "launchpad/lib/ui/responsive" : { deps: ["jquery"], exports: "lp.responsive" },
        "launchpad/lib/common/rest-client" : { deps: ["jquery"], exports: "lp.restClient" },

        // angularjs related stuff
        "angular": { exports: "angular" },
        "launchpad/support/angular/angular-ui-bootstrap" : [ "angular" ],
        "launchpad/support/angular/angular-cache" : [ "angular" ],
        "launchpad/support/angular/angular-ui-validate" : [ "angular" ],
        "launchpad/support/angular/angular-gm" : [ "angular", "launchpad/support/requirejs/gmaps" ],
        "launchpad/support/globalize.launchpad" : { exports: "Globalize" }
    },

    map: {
        '*': {
            'd3': ( function svgTest(d3, r2d3) {
                "use strict";

                return Modernizr.svg ? d3 : r2d3;
            })('d3', 'r2d3')
        }
    }
});
