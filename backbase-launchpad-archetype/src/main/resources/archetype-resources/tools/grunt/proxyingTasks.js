module.exports = function (buildConfig, grunt) {
    'use strict';

    var glob = require("glob");

    //expose folders and build friendly urls into statics
    var proxyMultipleBundles = function (callback) {
            glob(buildConfig.bundlesDir + '/' + buildConfig.bundleSearch , function (er, files) {

                var pxys = [];

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = buildConfig.portalServer.url + '/static' + bundleName,
                        myEndpoint = f.replace(buildConfig.bundlesDir, ''),
                        object = {};

                    console.log('bundles: ',bundleName, myContext, myEndpoint);

                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        rewrite: object
                    });
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
        proxyThemes = function (callback) {
            glob(buildConfig.bundlesDir + '/themes/**/src/main/webapp/static/themes/*', function (er, files) {

                var pxys = [];

                files.forEach(function (f) {

                    var themeName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = buildConfig.portalServer.url + '/static/themes' + themeName,
                        myEndpoint = f.replace(buildConfig.bundlesDir, ''),
                        object = {};

                    console.log('themes: ', myContext, myEndpoint);

                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        rewrite: object
                    });
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
        //Traverse config-info folders and build friendly urls
        proxyConfigInfo = function (callback) {
            glob(buildConfig.bundlesDir + '/**/config-info*', function (er, files) {

                var pxys = grunt.config('connect.proxyServer.proxies');

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = buildConfig.portalServer.url + '/static' + bundleName,
                        myEndpoint = f.replace(buildConfig.bundlesDir, '');

                    var object = {};
                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        rewrite: object
                    });
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
        //Traverse import folders and build friendly urls
        proxyXmlImport = function (callback) {
            glob(buildConfig.bundlesDir + '/**/' + buildConfig.projectName + '*.xml', function (er, files) {

                var pxys = grunt.config('connect.proxyServer.proxies'),
                    myContext = buildConfig.portalServer.url + '/static/config-info/import',
                    object = {};

                files.forEach(function (f) {
                    var myEndpoint = f.replace(buildConfig.bundlesDir, ''),
                        myStartPoint = myContext + f.substring(f.lastIndexOf('/'), f.length);

                    object[myStartPoint] = myEndpoint;
                    console.log('Imports: ', myStartPoint,', ', myEndpoint);
                });

                pxys.push({
                    context: myContext,
                    host: 'localhost',
                    port: buildConfig.servers.proxyServer.port,
                    rewrite: object
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
        //Proxy the portal sever
        proxyPortalServer = function (callback) {

            var pxys = grunt.config('connect.proxyServer.proxies');

            pxys.push({
                context: buildConfig.portalServer.url,
                host: 'localhost',
                port: buildConfig.portalServer.port
            });

            grunt.config('connect.proxyServer.proxies', pxys);

            callback();
        };


    //CONFIG: You must add any of the functions above to be returned in the array else it will be ignored
    return [
        proxyMultipleBundles,
        proxyThemes,
        proxyPortalServer,
        proxyConfigInfo,
        proxyXmlImport
    ];
};

//        proxyYapiFromMosaic = function (callback) {
//
//            var pxys = grunt.config('connect.proxyServer.proxies'),
//                rewrite = {};
//
//            rewrite[buildConfig.portalServer.url + '/static/mosaic-tools/yapi-2.0/'] = buildConfig.portalServer.url + '/static/mosaic-tools/yapi-2.0/';
//
//
//            pxys.push({
//                context: buildConfig.portalServer.url + '/static/mosaic-tools/',
//                host: 'mosaiced.backbase.com',
//                port: 8888,
//                rewrite: rewrite
//            });
//
//            grunt.config('connect.proxyServer.proxies', pxys);
//
//            callback();
//        };