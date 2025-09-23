var newrelic = require('newrelic');

function getBreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Covercraft',
		url: '/covercraft/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	policy: function(req, res) {
		newrelic.setControllerName('catalog.policy');
		res.render('covercraft/policy', {
			meta: {
				title: 'Ordering Policies | Order Car Cover | T.J. Cars',
				description: 'Company information and information on our manufacturers Covercraft and Wings West.',
				canonical: '/covercraft/policy.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Ordering Policy'
			})
		});
	}
};
