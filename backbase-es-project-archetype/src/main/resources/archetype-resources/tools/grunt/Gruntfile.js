module.exports = function (grunt) {
    //For logging how long each process takes
    require('time-grunt')(grunt);

    var glob = require("glob"),
        async = require('async'),
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
                        base: buildConfig.bundlesDir,
                        directory: buildConfig.bundlesDir,
                        middleware: function (connect, options) {
                            return [
                                require('grunt-connect-proxy/lib/utils').proxyRequest,
                                // Serve static files.
                                connect.static(buildConfig.bundlesDir),
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
        dir: {
            less: buildConfig.lessFiles
        },
        pkg: grunt.file.readJSON('package.json'),
        connect: connectConfig(buildConfig),
        watch: {
            less: {
                files: buildConfig.bundlesDir + '/themes/**/src/main/webapp/static/themes/**/base.less',
                tasks: ['less:dev', 'testing']
            }
        },
        less: {
            dev: {
                files: {
                    '<%= dir.less.desktop %>/base.css': '<%= dir.less.desktop %>/base.less',
                    '<%= dir.less.mobile %>/base.css': '<%= dir.less.mobile %>/base.less'
                }
            }
        },
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
    });

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

    grunt.registerTask('testing', function () {
        console.log('after less');
    });

    grunt.registerTask('default', ['go']);
};
