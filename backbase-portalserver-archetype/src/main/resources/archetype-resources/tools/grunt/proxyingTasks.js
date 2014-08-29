module.exports = function (buildConfig, grunt) {
    'use strict';

    var glob = require("glob"),
        GRUNT_CONNECT_PROXY = 'connect.proxyServer.proxies';

    var bundlesDir          = buildConfig.bundles.bundlesDir,
        bundleSearch        = buildConfig.bundles.bundleSearch,
        themesDir           = buildConfig.themes.themesDir,
        themesPath          = buildConfig.themes.themesPath,
        portalServerUrl     = buildConfig.servers.portalServer.url,
        portalServerPort    = buildConfig.servers.portalServer.port,
        proxyServerPort     = buildConfig.servers.proxyServer.port;


    //expose folders and build friendly urls into statics
    var proxyMultipleBundles = function (callback) {
            glob(bundlesDir + '/' + bundleSearch, function (er, files) {

                var pxys = [];

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = portalServerUrl + '/static' + bundleName,
                        myEndpoint = f.replace(bundlesDir, ''),
                        object = {};

                    console.log('bundles: ', bundleName, myContext, myEndpoint);

                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: proxyServerPort,
                        rewrite: object
                    });
                });

                grunt.config(GRUNT_CONNECT_PROXY, pxys);

                callback();

            });
        },
        proxyThemes = function (callback) {
            glob(themesDir + '/**' + themesPath + '/*', function (er, files) {
                var pxys = grunt.config(GRUNT_CONNECT_PROXY);

                files.forEach(function (f) {

                    var themeName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = portalServerUrl + '/static/themes' + themeName,
                        myEndpoint = f.replace(bundlesDir, ''),
                        object = {};

                    console.log('themes: ', myContext, myEndpoint);

                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: proxyServerPort,
                        rewrite: object
                    });
                });

                grunt.config(GRUNT_CONNECT_PROXY, pxys);

                callback();

            });
        },
    //Traverse config-info folders and build friendly urls
        proxyConfigInfo = function (callback) {
            glob(bundlesDir + '/**/config-info*', function (er, files) {

                var pxys = grunt.config(GRUNT_CONNECT_PROXY);

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = portalServerUrl + '/static' + bundleName,
                        myEndpoint = f.replace(bundlesDir, '');

                    var object = {};
                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: proxyServerPort,
                        rewrite: object
                    });
                });

                grunt.config(GRUNT_CONNECT_PROXY, pxys);

                callback();

            });
        },
    //Traverse import folders and build friendly urls
        proxyXmlImport = function (callback) {
            glob(bundlesDir + '/**/' + buildConfig.projectName + '*.xml', function (er, files) {

                var pxys = grunt.config(GRUNT_CONNECT_PROXY),
                    myContext = portalServerUrl + '/static/config-info/import',
                    object = {};

                files.forEach(function (f) {
                    var myEndpoint = f.replace(bundlesDir, ''),
                        myStartPoint = myContext + f.substring(f.lastIndexOf('/'), f.length);

                    object[myStartPoint] = myEndpoint;
                    console.log('Imports: ', myStartPoint, ', ', myEndpoint);
                });

                pxys.push({
                    context: myContext,
                    host: 'localhost',
                    port: proxyServerPort,
                    rewrite: object
                });

                grunt.config(GRUNT_CONNECT_PROXY, pxys);

                callback();

            });
        },
    //Proxy the portal sever
        proxyPortalServer = function (callback) {

            var pxys = grunt.config(GRUNT_CONNECT_PROXY);

            pxys.push({
                context: portalServerUrl,
                host: 'localhost',
                port: portalServerPort
            });

            grunt.config(GRUNT_CONNECT_PROXY, pxys);

            callback();
        };


    //CONFIG: You must add any of the functions above to be returned in the array else it will be ignored
    return [
        proxyMultipleBundles,
        proxyThemes,
        //proxyConfigInfo,
        //proxyXmlImport,
        proxyPortalServer
    ];
};


//Example for proxying resources from other servers
//        proxyYapiFromMosaic = function (callback) {
//
//            var pxys = grunt.config(GRUNT_CONNECT_PROXY),
//                rewrite = {};
//
//            rewrite[portalServerUrl + '/static/mosaic-tools/yapi-2.0/'] = portalServerUrl + '/static/mosaic-tools/yapi-2.0/';
//
//
//            pxys.push({
//                context: portalServerUrl + '/static/mosaic-tools/',
//                host: 'mosaiced.backbase.com',
//                port: 8888,
//                rewrite: rewrite
//            });
//
//            grunt.config(GRUNT_CONNECT_PROXY, pxys);
//
//            callback();
//        };