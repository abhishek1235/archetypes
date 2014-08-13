module.exports = function (grunt) {
    //For logging how long each process takes
    require('time-grunt')(grunt);

    var glob = require("glob"),
        async = require('async'),
        path = require('path'),
        buildConfig = require('./buildConfig'),
        proxyingTasks = require('./proxyingTasks')(buildConfig, grunt),
        connectConfig = function () {
            return {
                //When you have a complex folder structure that need to be proxy-ed into friendly url.
                // i.e. /portalserver/static/config-info/import/mosaic-media-catalog-widgets.xml to static/import/mosaic-media-catalog-widgets.xml
                proxyServer: {
                    options: {
                        debug: buildConfig.servers.proxyServer.debug,
                        hostname: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        base: [buildConfig.bundlesDir],
                        directory: buildConfig.bundlesDir,
                        middleware: function (connect, options) {
                            return [
                                require('grunt-connect-proxy/lib/utils').proxyRequest,
                                // Serve static files.
                                connect.static(options.base),
                                // Make empty directories browsable.
                                connect.directory(options.base)
                            ];
                        }
                    },
                    //All proxies are generated as part of function = setProxyForFolders()
                    proxies: []
                }
            };
        },
        setProxyForFolders = function (fnCallback) {
            async.series(proxyingTasks, function (err, results) {
                console.log('done with things');
                fnCallback();
            });
        };

    // Project configuration.
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            connect: connectConfig(buildConfig),
            watch: buildConfig.watch,
            less: buildConfig.less,
            jshint: {
                options: {
                    // options here to override JSHint defaults
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true,
                        document: true
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('go', function (buildConfig) {
        var done = this.async();
        console.log('search folders');

        setProxyForFolders(function () {
            console.log('folder searched');

            grunt.task.run('configureProxies:proxyServer');
            console.log('start server');

            grunt.task.run('connect:proxyServer');

            grunt.task.run('watch');
            done();
        });
    });

    grunt.registerTask('default', ['go']);

};
