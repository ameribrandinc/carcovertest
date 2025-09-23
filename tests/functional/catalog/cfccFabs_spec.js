var assert = require('assert'),
	request = require('supertest'),
	cheerio = require('cheerio'),
	app = require('../../../server');

describe('The cfccFabs pages', function() {

	var pages = [{
		id: '#row-dust',
		href: '/2017-acura-ilx-base/p24?fabric=TS'
	}, {
		id: '#row-nh',
		href: '/2017-acura-ilx-base/p24?fabric=NH'
	}, {
		id: '#row-rs',
		href: '/2017-acura-ilx-base/p24?fabric=RS'
	}, {
		id: '#row-sun',
		href: '/catalog/cfccColors.php?autoID=24&year=2017&part=C17825&size=G3&abrv=sun'
	}, {
		id: '#row-evo',
		href: '/catalog/cfccColors.php?autoID=24&year=2017&part=C17825&size=G3&abrv=evo'
	}, {
		id: '#row-ut',
		href: '/catalog/cfccColors.php?autoID=24&year=2017&part=C17825&size=G3&abrv=ut'
	}, {
		id: '#row-wsHD',
		href: '/2017-acura-ilx-base/p24?fabric=HG'
	}, {
		id: '#row-wsHP',
		href: '/catalog/cfccColors.php?autoID=24&year=2017&part=C17825&size=G3&abrv=wsHP'
	}, {
		id: '#row-wsMC',
		href: '/catalog/multicolor-wsHP.php?autoID=24&year=2017&part=C17825&size=G3&abrv=wsMC'
	}];

	pages.forEach(function(page) {
		it('should contain the correct link href at: ' + '/catalog/cfccFabs.php?year=2017&autoID=24', function(done) {
			request(app)
				.get('/catalog/cfccFabs.php?year=2017&autoID=24')
				.end(function(err, res) {
					var $ = cheerio.load(res.text),
						href = $(page.id).find('.js-next-action').attr('href');
					assert.equal(href, page.href);
					done();
				});
		});
	});

});
