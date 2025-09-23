var bunyan = require('bunyan'),
	log = bunyan.createLogger({
		name: 'carcovers.org'
	}),
	newrelic = require('newrelic');

var logger = {
	noticeError: function(error, req) {
		req = req || {};
		newrelic.addCustomParameter('url', req.url);
		newrelic.addCustomParameter('query', req.query);
		newrelic.addCustomParameter('params', req.params);
		newrelic.addCustomParameter('body', req.body);
		newrelic.addCustomParameter('custom', req.custom);
		if (req.headers && req.headers.referer) {
			newrelic.addCustomParameter('referrer', req.headers.referer);
		}
		newrelic.noticeError(error);
	},

	warn: function(warning, req) {
		var parameters = {};
		if (req) {
			parameters.url = req.url;
			parameters.query = req.query;
			parameters.params = req.params;
			parameters.body = req.body;
			if (req.headers && req.headers.referer) {
				parameters.referer = req.headers.referer;
			}
		}
		log.warn(warning, parameters);
	},

	/**
	 * Manages request data and logs an error
	 * @param  {String|Object}
	 * @param  {Object|undefined}
	 */
	error: function(error, req) {
		var parameters = {};
		if (req) {
			parameters.url = req.url;
			parameters.query = req.query;
			parameters.params = req.params;
			parameters.body = req.body;
			if (req.custom) {
				parameters.custom = req.custom;
			}
			if (req.headers && req.headers.referer) {
				parameters.referer = req.headers.referer;
			}
		}
		log.error(error, parameters);
		logger.noticeError('ERROR: ' + error, req);
	}
};

module.exports = logger;
