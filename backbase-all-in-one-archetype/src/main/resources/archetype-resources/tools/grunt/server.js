var express = require('express');
var httpProxy = require('http-proxy');
var glob = require('glob');

var config = require('./config');
var app = express();

var staticFolder = '/src/main/webapp';

var proxy = new httpProxy.createProxyServer({
	target: {
		host: 'localhost',
		port: config.port
	}
});

glob(config.paths, function (err, files) {
	files.forEach(function(file) {
		var path = '/portalserver' + file.substr(file.indexOf(staticFolder) + staticFolder.length)
		app.use(path, express.static(file));
	});

	app.use(function(req, res) {
		proxy.web(req, res);
	});
});

if (require.main === module) {
	var server = app.listen(8000, function() {
		console.log('Listening on port %d', server.address().port);
	});
} else {
	exports = module.exports = app;
}
