process.stdout.write("Requiring dependencies!\n");
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
	helmet = require('helmet'),
	app = express();

require('dustjs-helpers');
require('./app/lib/helpers')(dust);

process.stdout.write("Making fork decision!\n");
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
	process.stdout.write("Setting app parameters!\n");

	app.use(compression());

	app.use(request);

	app.use(helmet());

	app.use(cookieParser('2354ib34ag9a8ydga8uh4tqnc4q83ynt98c7e'));
	app.use(bodyParser.json());

	app.engine('dust', cons.dust);

	app.set('template_engine', 'dust');
	app.set('port', env.port);
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'dust');
	app.set('view options', {
		layout: true
	});

	app.use(express['static'](path.join(__dirname, 'public')));

	app.use(middleware.normalizeQueryString);
	app.use(middleware.lowercaseQueryProperties);
	app.use(middleware.setNotifierState);

	/**
	 * Register routes with app
	 */
	process.stdout.write("Registering routes!\n");
	routes.register(app);


	/**
	 * Not found handler
	 */
	process.stdout.write("Specifying not-found handler!\n");
	app.use(function(req, res) {
		logger.warn('General 404 handler', req);
		res.status(404);
		controllers.errors.notfound(req, res);
	});

	process.stdout.write(`Listening on port ${app.get('port')}!\n`);
	app.listen(app.get('port'));

	if (env.name === 'production') {
		console.log('--- DEPLOY ---');
	}
}

module.exports = app;
