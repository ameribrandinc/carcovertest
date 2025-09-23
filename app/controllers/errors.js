module.exports = {
	notfound: function(req, res) {
		res.render('errors/notfound', {
			meta: {
				title: 'We Could Not Find That Page'
			},
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Page Not Covered'
			}]
		});
	}
};
