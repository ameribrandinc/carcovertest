var newrelic = require('newrelic');

function getBreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Car Covers',
		url: '/covers/'
	}, {
		page: 'Accessories',
		url: '/covers/accessories.php'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	index: function(req, res) {
		newrelic.setControllerName('window.index');
		res.render('window/index', {
			meta: {
				title: 'Car Cover Window Installation Video | T.J. Cars',
				description: 'Car cover license plate window for displaying license plates, parking stickers, and decals.',
				keywords: 'car cover window, car cover parking sticker window, car cover license plate window',
				canonical: '/window/'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Car Covers'
			})
		});
	}
};
