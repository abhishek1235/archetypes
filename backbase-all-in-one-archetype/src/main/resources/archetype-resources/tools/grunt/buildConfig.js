var bundlesDir =  '../../statics';

var buildConfig = {
    bundlesDir: bundlesDir,
    companyNameSpace: 'gulfbank',
    portalServer: {
        url: '/portalserver',
        port: '7777'
    },
    servers: {
        static: {
            port: 8001,
            debug: true
        },
        proxyServer: {
            port: 8000,
            debug: true
        }
    },
    watch: [
            bundlesDir + '/**/*.js',
            bundlesDir + '/**/*.less',
            bundlesDir + '/**/*.css'
    ]
};

module.exports = buildConfig;
