var newrelic = require('newrelic');

function getBreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Fabric',
		url: '/covers/fabric/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	guide: function(req, res) {
		newrelic.setControllerName('fabric.guide');
		res.render('fabric/guide', {
			meta: {
				title: 'Covercraft Fabric Guide',
				description: 'Learn more about our car cover fabrics with the Covercraft fabric guide. Find the best fabric for where you store your vehicle.',
				canonical: '/fabric/guide'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Guide'
			})
		});
	},

	ourFabrics: function(req, res) {
		newrelic.setControllerName('fabric.ourFabrics');
		res.render('fabric/our_fabrics', {
			meta: {
				title: 'Fabric Material Quality | Car, Truck, & SUV Covers | T.J. Cars',
				description: 'We offer covers in WeatherShield, WeatherShield HD, Sunbrella, Reflectect, and Ultratect fabrics.',
				canonical: '/covers/fabric/ourfabrics.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Our Fabrics'
			})
		});
	},

	index: function(req, res) {
		newrelic.setControllerName('fabric.index');
		res.render('fabric/index', {
			meta: {
				title: 'Available Car Cover Fabrics',
				description: 'See all the Covercraft fabrics available for T.J. Cars custom-fit car covers. Material options include WeatherShield HP, WeatherShield HD, and Sunbrella. With so many fabric choices, it\'s easy to find the right cover for your car, truck, or SUV.',
				canonical: '/covers/fabric'
			},
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Fabric'
			}]
		});
	},

	weathershieldHD: function(req, res) {
		newrelic.setControllerName('fabric.weathershieldHD');
		res.render('fabric/weathershield_hd', {
			meta: {
				title: 'WeatherShield HD Car Cover Fabric by Covercraft',
				description: 'Detailed information on Weathershield HD fabric. Covercraft Weathershield HD fabric prices, warranty, and installation instructions.',
				keywords: 'weathershield hd, weathershield hd fabric',
				canonical: '/covers/fabric/weathershieldHD.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'WeatherShield HD'
			})
		});
	},

	weathershield: function(req, res) {
		newrelic.setControllerName('fabric.weathershield');
		res.render('fabric/weathershield', {
			meta: {
				title: 'WeatherShield HP Car Covers by Covercraft | T.J.Cars',
				description: 'Detailed information on Weathershield HP fabric and Weathershield HP car covers.',
				canonical: '/covers/fabric/weathershield.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'WeatherShield HP'
			})
		});
	},

	sunbrella: function(req, res) {
		newrelic.setControllerName('fabric.sunbrella');
		res.render('fabric/sunbrella', {
			meta: {
				title: 'Sunbrella Car Cover Fabrics by Covercraft | T.J. Cars',
				description: 'Information on Sunbrella production, Sunbrella&reg; construction, and Sunbrella&reg; fabric.  Covercraft, Sunbrella&reg; custom-fit car covers from T.J. Cars.',
				canonical: '/covers/fabric/sunbrella.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Sunbrella'
			})
		});
	},

	ultratect: function(req, res) {
		newrelic.setControllerName('fabric.ultratect');
		res.render('fabric/ultratect', {
			meta: {
				title: 'Ultratect Car Cover Fabric | Covercraft Fabrics | T.J. Cars',
				description: 'Information on Ultratect cover production, Ultratect cover construction, and Ultratect fabric.',
				canonical: '/covers/fabric/ultratect.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Ultratect'
			})
		});
	},

	reflectect: function(req, res) {
		newrelic.setControllerName('fabric.reflectect');
		res.render('fabric/reflectect', {
			meta: {
				title: 'Reflectect Fabric | Covercraft Car Covers | T.J. Cars',
				description: 'Information on Reflectect cover production, Reflectect cover construction, and Reflectect fabric.',
				canonical: '/covers/fabric/reflectect.php'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Reflectect'
			})
		});
	},

};
