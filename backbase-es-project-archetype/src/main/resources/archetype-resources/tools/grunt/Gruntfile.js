module.exports = function (grunt) {
    //For logging how long each process takes
    require('time-grunt')(grunt);

    var glob = require("glob"),
        async = require('async'),
        buildConfig = require('./buildConfig'),

        bundlesDir          = buildConfig.bundles.bundlesDir,
        bundleSearch        = buildConfig.bundles.bundleSearch,
        themesDir           = buildConfig.themes.themesDir,
        themesPath          = buildConfig.themes.themesPath,
        portalServerUrl     = buildConfig.servers.portalServer.url,
        portalServerPort    = buildConfig.servers.portalServer.port,
        proxyServerPort     = buildConfig.servers.proxyServer.port,

        connectConfig = function () {
            return {
                proxyServer: {
                    options: {
                        debug: buildConfig.servers.proxyServer.debug,
                        hostname: 'localhost',
                        port: proxyServerPort,
                        base: bundlesDir,
                        directory: bundlesDir,
                        middleware: function (connect, options) {
                            return [
                                require('grunt-connect-proxy/lib/utils').proxyRequest,
                                // Serve static files.
                                connect.static(bundlesDir),
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
        proxyingTasks = require('./proxyingTasks')(buildConfig, grunt),
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
            watch: {
                less: {
                    files: themesDir + '/**' + themesPath + '/**/*.less',
                    tasks: ['less:dev']
                }
            },
            less: {
                dev: {
                    files: buildConfig.themes.lessFiles
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
