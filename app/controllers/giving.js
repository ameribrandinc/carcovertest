var newrelic = require('newrelic');

function getbreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Giving'
	}];
	return breadcrumbs;
}

module.exports = {

	index: function(req, res) {
		newrelic.setControllerName('giving.index');
		res.render('giving/index', {
			meta: {
				title: 'A Company for Giving',
				description: '',
				canonical: '/giving/index.php'
			},
			breadcrumbs: getbreadcrumbs()
		});
	}

};
