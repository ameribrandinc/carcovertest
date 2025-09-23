var newrelic = require('newrelic');

function getbreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Car Covers',
		url: '/covers/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	definitions: function(req, res) {
		newrelic.setControllerName('main.definitions');
		res.render('main/definitions', {
			meta: {
				title: '',
				description: '',
				canonical: '/main/definitions.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Definitions'
			})
		});
	}
};
