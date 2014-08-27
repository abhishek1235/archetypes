var bundlesDir =  '../../statics';

var buildConfig = {
    bundlesDir: bundlesDir,
    projectName: 'sample',
    bundleSearch: '/bundles/**/src/main/webapp/static/samples**', //TODO:replace with own project name space
    portalServer: {
        url: '/portalserver',
        port: '7777'
    },
    servers: {
        proxyServer: {
            port: 8000,
            debug: true
        }
    },
    lessFiles: {
        "default": bundlesDir + '/themes/launchpad-default/src/main/webapp/static/themes/default',
        "example": bundlesDir + '/themes/launchpad-example/src/main/webapp/static/themes/example'
    }
};

module.exports = buildConfig;
