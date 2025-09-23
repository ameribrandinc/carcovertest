var env = require('../../config/env');

var request = function(req, res, next) {
	res.locals.rootUrl = '';
	/* if (env.name !== 'development') {
		res.locals.rootUrl = '//www.carcovers.org';
	} else {
		res.locals.rootUrl = '';
	} */
	next();
};

module.exports = request;
