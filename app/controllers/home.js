var newrelic = require('newrelic'),
	api = require('../api');

module.exports = {
	index: function(req, res) {
		newrelic.setControllerName('home.index');
		api.customCovers.getAllYears(function(error, years) {
			res.render('home/index', {
				meta: {
					title: 'Covercraft Car Covers',
					description: 'Find a Covercraft car cover for any vehicle. Truck covers, and SUV covers for all brands and models. Online car covers, seat covers and auto accessory sales since 1998.',
					keywords: 'car cover, custom car cover',
					canonical: '/'
				},
				vehicleOptions: {
					years: years,
					selections: {},
					status: 'incomplete'
				},
				breadcrumbs: [{
					page: 'Home'
				}]
			});
		});
	}
};
