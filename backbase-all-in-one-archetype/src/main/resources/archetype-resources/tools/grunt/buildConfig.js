var bundlesDir =  '../../src/main/webapp/static',
    themesDir = '../../src/main/webapp/static/themes',
    themesPath = '/src/main/webapp/static/themes',
    lessFiles = {};

    // Watch by default find all base.less withing themesDir and matching themesPath
    //Less Compilation you must add all you desired themes for less compilation here, target : src
    lessFiles[themesDir + '/launchpad-default' + themesPath + '/default/base.css'] = themesDir + '/launchpad-default' + themesPath + 'default/base.less';
    lessFiles[themesDir + '/launchpad-example' + themesPath + '/example/base.css'] = themesDir + '/launchpad-example' + themesPath + 'example/base.less';

// export the config object
module.exports = {
    projectName: 'mycomp',
    servers: {
        proxyServer: {
            port: 8000,
            debug: true
        },
        portalServer: {
            url: '/portalserver',
            port: '7777'
        }
    },
    bundles: {
        bundlesDir: bundlesDir,
        bundleSearch: 'bundles/***/src/main/webapp/static/samples**' //TODO:replace with own project name space
    },
    themes : {
        themesDir: themesDir,
        themesPath: themesPath,
        lessFiles: lessFiles
    }
};


