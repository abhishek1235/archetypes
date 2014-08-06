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
                //When you just want to host you directory without proxy or friendly urls
                'static': {
                    options: {
                        debug: buildConfig.servers.static.debug,
                        hostname: 'localhost',
                        port: buildConfig.servers.static.port,
                        base: [buildConfig.bundlesDir],
                        directory: buildConfig.bundlesDir,
                        middleware: function (connect, options) {
                            return [
                                require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
                                connect.static(options.base[0])
                            ];
                        }
                    }
                },
				//When you have a complex folder structure that need to be proxy-ed into friendly url.
				// i.e. /portalserver/static/config-info/import/mosaic-media-catalog-widgets.xml to static/import/mosaic-media-catalog-widgets.xml
                proxyServer: {
                    options: {
                        debug: buildConfig.servers.static.debug,
                        hostname: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
						base: [buildConfig.bundlesDir],
                        directory: buildConfig.bundlesDir,
                        middleware: function (connect, options) {
                            return [
								require('grunt-connect-proxy/lib/utils').proxyRequest,
                                require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
                                connect.static(options.base[0])
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
        regarde: {
            all: {
                files: buildConfig.watch,
                // This buildConfigures the task that will run when the file change
                tasks: ['livereload']
            }
        }
    });

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-livereload');

    grunt.registerTask('server', [
        'livereload-start',
        'connect:static',
        'regarde'
    ]);

    grunt.registerTask('go', function (buildConfig) {
        var done = this.async();
        console.log('search folders');

        setProxyForFolders(function () {
            console.log('folder searched');

            grunt.task.run('configureProxies:proxyServer');
            console.log('start server');

			grunt.task.run('connect:proxyServer:keepalive');
			done();
        });
    });

    grunt.registerTask('default', ['go']);
};
