var assert = require('assert'),
	request = require('supertest'),
	cheerio = require('cheerio'),
	app = require('../../../server');

describe('The cfccColors pages', function() {

	var pages = [{
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=sun&part=C17516&size=G3',
		id: '#row-sun-pacific-blue',
		href: '/vehicle/p24?fabric=D1'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=sun&part=C17516&size=G3',
		id: '#row-sun-cadet-gray',
		href: '/vehicle/p24?fabric=D4'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=sun&part=C17516&size=G3',
		id: '#row-sun-toast',
		href: '/vehicle/p24?fabric=D6'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=evo&part=C17516&size=G3',
		id: '#row-evo-gray',
		href: '/vehicle/p24?fabric=GK'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=evo&part=C17516&size=G3',
		id: '#row-evo-tan',
		href: '/vehicle/p24?fabric=TK'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=ut&part=C17516&size=G3',
		id: '#row-ut-black',
		href: '/vehicle/p24?fabric=UB'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=ut&part=C17516&size=G3',
		id: '#row-ut-gray',
		href: '/vehicle/p24?fabric=UG'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=ut&part=C17516&size=G3',
		id: '#row-ut-blue',
		href: '/vehicle/p24?fabric=UL'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=ut&part=C17516&size=G3',
		id: '#row-ut-tan',
		href: '/vehicle/p24?fabric=UT'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-gray',
		href: '/vehicle/p24?fabric=PG'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-taupe',
		href: '/vehicle/p24?fabric=PT'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-yellow',
		href: '/vehicle/p24?fabric=PY'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-bright-blue',
		href: '/vehicle/p24?fabric=PA'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-light-blue',
		href: '/vehicle/p24?fabric=PL'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-green',
		href: '/vehicle/p24?fabric=PN'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-red',
		href: '/vehicle/p24?fabric=PR'
	}, {
		url: '/catalog/cfccColors.php?autoID=24&year=2014&abrv=wsHP&part=C17516&size=G3',
		id: '#row-wsHP-black',
		href: '/vehicle/p24?fabric=PB'
	}];

	pages.forEach(function(page) {
		it('should contain the correct link href at: ' + page.url, function(done) {
			request(app)
				.get(page.url)
				.end(function(err, res) {
					var $ = cheerio.load(res.text),
						href = $(page.id).find('.js-next-action').attr('href');
					assert.equal(href, page.href);
					done();
				});
		});
	});

});
