var bundlesDir =  '../../statics';

var buildConfig = {
    bundlesDir: bundlesDir,
    projectName: 'samples',
    bundleSearch: '/bundles/**/src/main/webapp/static/samples**',//TODO:replace with own project name space
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
    watch: {
        less: {
            files: [bundlesDir + '/**/*.less'],
            tasks: ['less:dev']
        },
        js: {
            files: [bundlesDir + '/**/*.js'],
            tasks: ['jshint']
        }
   },
    less: {
        dev: {files: [
            {
                expand: true,
                cwd: bundlesDir + '/themes/*/src/main/webapp/static/themes',
                src: '**/base.less',
                dest: '**/base.css'
            }
        ]}
    }
};

module.exports = buildConfig;
