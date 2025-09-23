var util = require('util');
var api = require('../api');
var logger = require('../lib/logger');
var catalogController = require('../controllers/catalog');
var redirectsApi = require('../api/redirects');

function redirect(req, res) {
	return res.redirect(301, this);
}

module.exports.register = function(app) {

	app.get('/:badParamOne/:badParamTwo/p:id([0-9]+)', catalogController.product);

	app.get('/carcover/:make/:year', function(req, res) {
		res.redirect(301, util.format('/catalog/cfccModel.php?make=%s&year=%d', req.params.make, req.params.year));
	});

	app.get('/catalog/cfccResults.php', function(req, res) {
		api.cfcc.getCoversByAutoId({
			autoId: req.query.autoid
		}, function(error, covers) {
			if (error) {
				logger.error(error, req);
				return res.redirect(500, '/page-not-covered');
			}
			if (covers.length !== 1) {
				return res.redirect(301, '/');
			}
			var cover = covers[0];
			api.customCovers.findMatch({
				make: cover.make,
				model: cover.model,
				year: req.query.year,
				details: cover.details
			}, function(error, data) {
				if (error) {
					logger.error(error, req);
					return res.redirect(500, '/page-not-covered');
				}
				if (data.length !== 1) {
					return res.redirect(301, '/');
				}
				var newCover = data[0],
					fabric = req.query.ext ? req.query.ext : req.query.abrv,
					url = util.format('/%s/p%d?fabric=%s', newCover.slug, newCover.id, fabric);

				if (req.query.multicolor === '1' && req.query.topcolor && req.query.sidecolor) {
					url += util.format('&multicolor=1&topcolor=%s&sidecolor=%s', req.query.topcolor, req.query.sidecolor);
				}

				return res.redirect(301, url);
			});
		});
	});

	app.get('/company/webrings/:make', redirect.bind('/company'));
	app.get('/company/contact/contactform/contactform.php', redirect.bind('/company/contact'));
	app.get('/fabricguide.php', redirect.bind('/fabric/guide'));

	app.get('/catalog/cfccResult.php', function(req, res) {
		res.redirect(301, req.url.replace('cfccResult.php', 'cfccResults.php'));
	});

	var redirects = redirectsApi.get();
	redirects.map((redirect) => {
		app.get(redirect.old, (req, res) => {
			res.redirect(redirect.status || 301, redirect.new);
		});
	});

};
