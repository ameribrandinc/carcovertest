var _ = require('underscore'),
	url = require('url'),
	querystring = require('querystring');

module.exports = {
	normalizeQueryString: function(req, res, next) {
		var hasChanges = false,
			parsedUrl;

		if (req.url.indexOf('&amp;') !== -1) {
			// Change '&amp;' query string separators to just '&'
			_.each(req.query, function(value, key) {
				if (key.indexOf('amp;') === 0) {
					delete req.query[key];
					req.query[key.replace('amp;', '')] = value;
					hasChanges = true;
				}
			});

			if (hasChanges) {
				parsedUrl = url.parse(req.url);
				res.redirect(301, parsedUrl.pathname + '?' + querystring.stringify(req.query));
				return;
			}
		}
		next();
	},

	lowercaseQueryProperties: function(req, res, next) {
		if (req.query) {
			var query = {},
				parsedUrl;
			_.each(req.query, function(value, key) {
				query[key.toLowerCase()] = value;
			});
			req.query = query;
			parsedUrl = url.parse(req.url);
			req.url = parsedUrl.pathname + '?' + querystring.stringify(query);
		}
		next();
	},

	setNotifierState: function(req, res, next) {
		res.locals.siteNotifierStatus = req.cookies['siteNotifier-freeShipping'];
		next();
	}
};
