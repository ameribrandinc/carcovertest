var env = require('../../config/env'),
	newrelic = require('newrelic'),
	moment = require('moment'),
	mysql = require('mysql');

function getbreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Company',
		url: '/company/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

function createConnection() {
	return mysql.createConnection({
		host: env.db.host,
		user: env.db.user,
		password: env.db.password,
		database: env.db.name
	});
}

module.exports = {
	contact: function(req, res) {
		newrelic.setControllerName('company.contact');
		res.render('company/contact', {
			meta: {
				title: 'Contact Us | Company Contact Information',
				description: 'Request help finding a car cover, picking a fabric, or checking stock. If you have questions, we have answers.',
				canonical: '/company/contact/'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Contact Us'
			})
		});
	},

	crew: function(req, res) {
		newrelic.setControllerName('company.crew');
		res.render('company/crew', {
			meta: {
				title: 'Meet the crew | car cover crew | T.J. Cars',
				description: 'see who we are, where we come from, and why we sell car covers and seat covers online.',
				canonical: '/company/crew.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Crew'
			}),
			yearsInBusiness: moment('1998-01-01').from(moment(), true)
		});
	},

	faqs: function(req, res) {
		newrelic.setControllerName('company.faqs');
		res.render('company/FAQs', {
			meta: {
				title: 'Car Cover FAQ',
				description: 'Frequently Asked Questions about car covers and seat covers. Learn the basics about Covercraft custom-fit products.',
				canonical: '/company/FAQs.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'FAQs'
			})
		});
	},

	giving: function(req, res) {
		newrelic.setControllerName('company.giving');
		res.render('company/giving', {
			meta: {
				title: 'A Company for Giving',
				description: '',
				canonical: '/company/giving.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Giving'
			})
		});
	},

	history: function(req, res) {
		newrelic.setControllerName('company.history');
		res.render('company/history', {
			meta: {
				title: 'T.J. Cars and Covercraft Company History',
				description: 'Learn more about the history of T.J. Cars and Covercraft. Two companies with decades of experience making and selling custom-fit car accessories and covering products.',
				canonical: '/company/history.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'History'
			})
		});
	},

	index: function(req, res) {
		newrelic.setControllerName('company.index');
		res.render('company/index', {
			meta: {
				title: 'Company Information | Learn About T.J. Cars',
				description: 'Learn more about T.J. Cars Auto Accessories. Learn more about the owners, company policy, ordering, shipping, and return policies.',
				canonical: '/company/index.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'index'
			})
		});
	},

	leadtimes: function(req, res) {
		// Create a connection to the database
		var connection = createConnection();

		// And query for the status of lead times
		connection.query("SELECT varvalue FROM variables WHERE varname = 'leadtime'", function(err, rows, fields) {

			// Assume a lead time of about two weeks to start
			var leadtime = '10-14 Business Days';

			// If there was no error retrieving the actual lead time from the database use that
			if (err === null) leadtime = rows[0].varvalue;

			// Then render the lead time page passing the value to the dust script for string substitution
			newrelic.setControllerName('company.leadtimes');
			res.render('company/leadtimes', {
				meta: {
					title: 'Car Cover Lead Times &amp; Production Schedule',
					description: 'Custom products take time to make. See current Covercraft lead times for producing car covers and seat covers. Many covers in stock - ship out in 2 business days. Covers shipped from plant in Oklahoma.',
					canonical: '/company/leadtimes.php'
				},
				breadcrumbs: getbreadcrumbs({
					page: 'Lead Times'
				}),
				leadtime: leadtime
			});
		});
	},

	madeInUSA: function(req, res) {
		newrelic.setControllerName('company.madeInUSA');
		res.render('company/madeInUSA', {
			meta: {
				title: 'Car Covers Made In The USA By Covercraft',
				description: 'Our car covers are quality, American-made Covercraft products',
				canonical: '/company/made-in-usa.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Made in the USA'
			})
		});
	},

	policy: function(req, res) {
		newrelic.setControllerName('company.policy');
		res.render('company/policy', {
			meta: {
				title: 'General Policies and Return Policy',
				description: 'Company information, ordering, site security, shipping, privacy info, sales tax and more.',
				canonical: '/company/policy.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Policy'
			})
		});
	},

	shipping: function(req, res) {
		newrelic.setControllerName('company.faqs');
		res.render('company/shipping', {
			meta: {
				title: 'Cover Shipping Information | T.J. Cars',
				description: 'Shipping schedule and pricing.  In stock car covers, seat covers, and masks ship in 2-3 business days.  See production schedules for out-of-stock items.',
				canonical: '/company/shipping.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Shipping'
			})
		});
	},

	sitemap: function(req, res) {
		newrelic.setControllerName('company.sitemap');
		res.render('company/sitemap', {
			meta: {
				title: 'Sitemap | Car Cover Links',
				description: 'See all pages relating to car covers, seat covers, masks, company information, etc. The entire T.J. Cars website.',
				canonical: '/company/sitemap.php'
			},
			breadcrumbs: getbreadcrumbs({
				page: 'Sitemap'
			})
		});
	}

};
