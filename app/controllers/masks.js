var newrelic = require('newrelic');

function getBreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Mask Search',
		url: '/catalog/masks/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	index: function(req, res) {
		newrelic.setControllerName('masks.index');
		res.render('masks/index', {
			meta: {
				title: 'T.J. Cars Prices on Covercraft Masks and Bras',
				description: 'See available patterns and prices for Covercraft Masks and Bras. Find a custom-fit mask/bra to fit your car, truck, or SUV. Huge catalog with 10,000\'s of unique patterns to fit your make, model, and year of vehicle.',
				canonical: '/catalog/masks/index.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Mask'
			})
		});
	}

};
