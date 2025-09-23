var consoleApi = require('../api/console'),
	newrelic = require('newrelic'),
	logger = require('../lib/logger');


module.exports = {
	grommet: function(req, res) {
		newrelic.setControllerName('checkout.grommet');
		consoleApi.getP1Status(function(error, status) {
			if (error) {
				logger.error(error, req);
				res.status(500);
				res.redirect('/page-not-covered');
				return;
			}

			var forwardURL;

			if (status.length === 1 && status[0].value === '1') {
				forwardURL = 'https://carcovers.org/headers/cart/cart-p1.htm';
			} else {
				forwardURL = 'https://carcovers.org/headers/cart/cart-ship-christmas.htm';
			}

			res.render('checkout/grommet', {
				meta: {
					title: 'Antenna Grommet Cover Option'
				},
				page: {
					hideNav: true
				},
				forwardURL: forwardURL,
				breadcrumbs: [{
					page: 'Antenna Grommet'
				}]
			});
		});
	},

	ship: function(req, res) {
		newrelic.setControllerName('checkout.ship');
		res.render('checkout/ship', {
			meta: {
				title: 'Shipping'
			},
			page: {
				hideNav: true
			},
			breadcrumbs: [{
				page: 'Shipping'
			}]
		});
	},

	sales: function(req, res) {
		res.render('checkout/sales', {
			meta: {
				title: 'Sales'
			},
			page: {
				hideNav: true
			},
			breadcrumbs: [{
				page: 'Sales'
			}]
		});
	},

	shipP1: function(req, res) {
		newrelic.setControllerName('checkout.shipP1');
		consoleApi.getP1Status(function(error, status) {

			res.render('checkout/ship_p1', {
				meta: {
					title: 'P1 Rush Manufacturing'
				},
				page: {
					hideNav: true
				},
				price: status[0].price,
				breadcrumbs: [{
					page: 'P1 Rush Manufacturing'
				}]
			});
		});

	},

	standardShipping: function(req, res) {
		newrelic.setControllerName('checkout.standardShipping');
		res.render('checkout/ship_christmas', {
			meta: {
				title: 'Standard Shipping'
			},
			page: {
				hideNav: true
			},
			breadcrumbs: [{
				page: 'Standard Shipping'
			}]
		});
	}
};
