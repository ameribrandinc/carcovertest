require('newrelic');

var express = require('express'),
	cluster = require('cluster'),
	dust = require('dustjs-linkedin'),
	cons = require('consolidate'),
	request = require('./app/lib/request'),
	compression = require('compression'),
	path = require('path'),
	env = require('./config/env'),
	routes = require('./app/routes'),
	controllers = require('./app/controllers'),
	logger = require('./app/lib/logger'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	middleware = require('./app/lib/middleware'),
	app = express(),

	http = require('http'),
	https = require('https'),
	fs = require('fs');
	privateKey = fs.readFileSync( '/etc/letsencrypt/live/carcovers.org/privkey.pem' ),
	certificate = fs.readFileSync( '/etc/letsencrypt/live/carcovers.org/fullchain.pem' );

require('dustjs-helpers');
require('./app/lib/helpers')(dust);

if (cluster.isMaster && env.name !== 'development') {
	var cpuCount = require('os').cpus().length;

	cluster.on('fork', function(worker) {
		console.log('Forked worker ' + worker.process.pid + ' up and running!');
	});

	cluster.on('exit', function(worker) {
		console.log('Worker ' + worker.process.pid + ' died :(');
		cluster.fork();
	});

	for (var i = 0; i < cpuCount; i += 1) {
		cluster.fork();
	}

} else {

	app.use(compression());
	app.use(request);
	app.use(cookieParser('2354ib34ag9a8ydga8uh4tqnc4q83ynt98c7e'));
	app.use(bodyParser.json());

	app.engine('dust', cons.dust);

	app.set('template_engine', 'dust');
	app.set('http-port', env.port[0]);
	app.set('https-port', env.port[1]);
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'dust');
	app.set('view options', {
		layout: true
	});
	
	// Serve static files from the public directory
	app.use(express['static'](path.join(__dirname, 'public')));
	// Serve the .well-known/acme-challenge directory
	app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, '.well-known/acme-challenge')));

	app.use(middleware.normalizeQueryString);
	app.use(middleware.lowercaseQueryProperties);
	app.use(middleware.setNotifierState);

/**
 * Register routes with app
 */
	routes.register(app);

/**
 * Not found handler
 */
	app.use(function(req, res) {
		logger.warn('General 404 handler', req);
		res.status(404);
		controllers.errors.notfound(req, res);
	});

	if(env.name === 'development') {
		console.log('--- DEVELOP ---')
		app.listen(app.get('http-port'));
	} else {
/**
 * Implement https server
 */
		http.createServer((req, res) => {
			res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
			res.end();
		}, app).listen(app.get('http-port'));

		https.createServer({
			key: privateKey,
			cert: certificate
		}, app).listen(app.get('https-port'));
	}


	if (env.name === 'production') {
		console.log('--- DEPLOY ---');
	}
}

module.exports = app;