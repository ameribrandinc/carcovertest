var newrelic = require('newrelic'),
	api = require('../api'),
	consoleApi = require('../api/console'),
	logger = require('../lib/logger');

function getBreadcrumbs(page) {
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
	index: function(req, res) {
		newrelic.setControllerName('covers.index');
		res.render('covers/index', {
			meta: {
				title: 'Car Covers, Truck Covers &amp; SUV Covers by Covercraft  | T.J. Cars',
				description: 'We carry a full line of custom-fit Covercraft car covers, truck covers, and SUV covers for all vehicles. Covercraft covers and accessories at the best prices.',
				canonical: '/covers/'
			},
			abButtonTest: req.query.abbuttontest ? true : undefined,
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Car Covers'
			}]
		});
	},

	accessories: function(req, res) {
		newrelic.setControllerName('covers.accessories');
		res.render('covers/accessories', {
			meta: {
				title: 'Car Cover Accessories',
				description: 'Car cover accessories, such as the storage bag and lock and cable, aid in quality storage and guards against premature wear.',
				canonical: '/covers/accessories.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Accessories'
			})
		});
	},

	carModifications: function(req, res) {
		newrelic.setControllerName('covers.carModifications');
		res.render('covers/car_modifications', {
			meta: {
				title: 'Custom Car Dimension Sheets',
				description: 'T.J. Cars can make a cover to fit any vehicle. If you have a modified car, truck, or SUV, we can build you a custom Covercraft cover using dimension sheet.',
				canonical: '/covers/carmodifications.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Dimension Sheets'
			})
		});
	},

	coversearch: function(req, res) {
		newrelic.setControllerName('covers.coversearch');
		res.render('covers/coversearch', {
			meta: {
				title: 'Car Cover Prices | Custom Covercraft Car Covers',
				description: 'Use our cover search to find prices on Covercraft custom car covers.',
				canonical: '/covers/coversearch.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Cover Search'
			})
		});
	},

	searchbypart: function(req, res) {
		newrelic.setControllerName('covers.searchbypart');
		var coverId = req.query.part;
		api.customCovers.getAutoIdByCoverId(coverId, function(err, rows) {
			if (rows.length === 0) {
				return res.redirect(301, "/" + coverId);
			}
			if (err) {
				logger.error(err, req);
				throw err;
			}
			res.render('covers/searchbypart', {
				meta: {
					title: 'Search By Part | Custom Covercraft Car Covers',
					description: 'Replace your old cover by searching for it\'s unique ID',
					canonical: '/covers/searchbypart'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Search By Part'
				}),
				models: rows
			});

		});
	},

	bonusItem: function(req, res) {
		newrelic.setControllerName('covers.bonusItem');
		res.render('covers/bonus_item', {
			meta: {
				title: 'Bonus Item!',
				description: 'Receive a free car cover window with the purchase of your car cover for a limited time.',
				canonical: '/covers/bonus_item/'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Bonus Item'
			})
		});
	},

	coverCare: function(req, res) {
		newrelic.setControllerName('covers.coverCare');
		res.render('covers/cover_care', {
			meta: {
				title: 'Car Cover Care and Maintainance',
				description: 'Instruction for careful maintainance and care of Covercraft car covers in Sunbrella, Noah, Weathershield, Weathershield HD, and Dustop fabrics.',
				canonical: '/covers/cover_care/'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Cover Care'
			})
		});
	},

	faq: function(req, res) {
		newrelic.setControllerName('covers.faq');
		res.render('covers/faq', {
			meta: {
				title: 'Car Cover Frequently Asked Questions',
				description: 'Frequently Asked Questions about car covers. Learn the basics about Covercraft custom-fit covers for cars, trucks, and SUVs.',
				canonical: '/covers/FAQ.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'FAQ'
			})
		});
	},

	grommet: function(req, res) {
		newrelic.setControllerName('covers.grommet');
		res.render('covers/grommet', {
			meta: {
				title: 'Car Cover Antenna Grommet',
				description: 'An antenna grommet will allow car covers to fit over a vehicle\'s antenna. This FREE accessory is the perfect complement to any Covercraft car covers.',
				canonical: '/covers/acc-grommet.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Antenna Grommet'
			})
		});
	},

	bag: function(req, res) {
		newrelic.setControllerName('covers.bag');
		res.render('covers/bag', {
			meta: {
				title: 'Car Cover Storage Bag',
				description: 'A storage bag for your car cover protects your cover while it\'s not protecting your car. Keep your cover in great condition with a car cover storage bag.',
				canonical: '/covers/acc-bag.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Storage Bag'
			})
		});
	},

	lockAndCable: function(req, res) {
		newrelic.setControllerName('covers.lockAndCable');
		res.render('covers/lock_and_cable', {
			meta: {
				title: '',
				description: '',
				canonical: '/covers/acc-lockandcable.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Lock & Cable'
			})
		});
	},

	howToOrder: function(req, res) {
		newrelic.setControllerName('covers.howToOrder');
		res.render('covers/how_to_order', {
			meta: {
				title: 'How To Order | Ordering Car Covers',
				description: 'T.J. Cars shipping schedule and pricing. In stock car covers ship in 2-3 business days.  See production schedules for out-of-stock items.',
				canonical: '/covers/how-to-order.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'How to Order'
			})
		});
	},

	indoorFabrics: function(req, res) {
		newrelic.setControllerName('covers.indoorFabrics');
		res.render('covers/indoor_fabrics', {
			meta: {
				title: 'Indoor Fabric | Car Cover Fabric',
				description: 'Indoor fabrics used in Covercraft custom-fit car covers from T.J. Cars. Compare and contrast our available fabrics to find the best cover for your application.',
				canonical: '/covers/indoor_fabrics.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Indoor Fabrics'
			})
		});
	},

	outdoorFabrics: function(req, res) {
		newrelic.setControllerName('covers.outdoorFabrics');
		res.render('covers/outdoor_fabrics', {
			meta: {
				title: 'Outdoor Car Cover Fabrics',
				description: 'Oudoor fabrics used in Covercraft custom-fit car covers from T.J. Cars. Compare and contrast our available fabrics to find the best cover for your appliaction.',
				canonical: '/covers/outdoor_fabrics.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Outdoor Fabrics'
			})
		});
	},

	p1Covers: function(req, res) {
		newrelic.setControllerName('covers.p1Covers');
		consoleApi.getP1Status(function(error, status) {
			if (error) {
				logger.error(error, req);
				res.status(500);
				return res.redirect('/page-not-covered');
			}
			res.render('covers/p1_covers', {
				meta: {
					title: '',
					description: '',
					canonical: '/covers/p1_covers.php'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'P1 Rush Manufacture'
				}),
				price: status[0].price,
				isP1Active: status[0].value === '1',
				p1Description: status[0].description
			});
		});
	},

	sales: function(req, res) {
		newrelic.setControllerName('covers.sales');
		res.render('covers/sales', {
			meta: {
				title: 'Car Cover Sales, Discounts, &amp; Specials',
				description: 'Current car cover sale: Recieve a free UPS ground shipping on all car cover orders. Rush shipping orders receive $12 off original shipping cost.',
				canonical: '/covers/sales.php',
				referer: req.headers.referer,
				//|| (meta.referer).includes("results")
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Current Sale'
			}),
			showBackTo: req.headers.referer.includes("fabric=") || req.headers.referer.includes("length=") ? true : false
		});
	},

	specialProjects: function(req, res) {
		newrelic.setControllerName('covers.specialProjects');
		res.render('covers/special_projects', {
			meta: {
				title: 'Special Projects, Photos, and Stories - 2 Fast 2 Furious',
				description: 'We can make a custom car cover for any modified car. We made and sold the covers for the custom cars in the motion picture 2 Fast 2 Furious.',
				canonical: '/covers/specialprojects.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Special Projects'
			})
		});
	},

	warranty: function(req, res) {
		newrelic.setControllerName('covers.warranty');
		res.render('covers/warranty', {
			meta: {
				title: 'Cover Warranty | Covercraft Manufacturer Warranty',
				description: 'Car cover warranties are backed by the world\'s largest manufacturer of car covers, Covercraft Industries.',
				canonical: '/covers/warranty.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Warranty'
			})
		});
	}

};
