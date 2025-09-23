var assert = require('assert'),
	request = require('supertest'),
	cheerio = require('cheerio'),
	app = require('../../../server');

describe('The cfccResults pages', function() {

	var pages = [{
		url: '/catalog/cfccResults.php?autoID=88254&year=2014&cover=785e4b292d2e890b0906000ba502c6&abrv=dust&size=G3',
		val: 's-2854^=SS=C17516TS^Taupe Dustop Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^222.32^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&year=2014&cover=785ecbcb88f3f3000005c901cb&abrv=nh&size=G3',
		val: 's-2854^=SS=C17516NH^Gray Noah Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^239.75^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&year=2014&cover=785e2b2a8e0b0a0600061c01e9&abrv=rs&size=G3',
		val: 's-2854^=SS=C17516RS^Gray Reflectect Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^176.43^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=D1',
		val: 's-2854^=SS=C17516D1^Pacific Blue Sunbrella Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=D4',
		val: 's-2854^=SS=C17516D4^Cadet Gray Sunbrella Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=D6',
		val: 's-2854^=SS=C17516D6^Toast Sunbrella Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=GK',
		val: 's-2854^=SS=C17516GK^Gray Technalon Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^206.63^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=TK',
		val: 's-2854^=SS=C17516TK^Tan Technalon Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^206.63^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=UB',
		val: 's-2854^=SS=C17516UB^Black Ultratect Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=UG',
		val: 's-2854^=SS=C17516UG^Gray Ultratect Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=UL',
		val: 's-2854^=SS=C17516UL^Blue Ultratect Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=UT',
		val: 's-2854^=SS=C17516UT^Tan Ultratect Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&year=2014&cover=785e2b2ff67089f37007000a630264&abrv=wsHD&size=G3',
		val: 's-2854^=SS=C17516HG^Gray WeatherShield HD Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^447.39^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PG',
		val: 's-2854^=SS=C17516PG^Gray WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^327.49^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PT',
		val: 's-2854^=SS=C17516PT^Taupe WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^327.49^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PY',
		val: 's-2854^=SS=C17516PY^Yellow WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PA',
		val: 's-2854^=SS=C17516PA^Bright Blue WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PL',
		val: 's-2854^=SS=C17516PL^Light Blue WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PN',
		val: 's-2854^=SS=C17516PN^Green WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PR',
		val: 's-2854^=SS=C17516PR^Red WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?year=2014&autoID=88254&ext=PB',
		val: 's-2854^=SS=C17516PB^Black WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=Red',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Red)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=Yellow',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Yellow)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=Green',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Green)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=BrightBlue',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: BrightBlue)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=SkyBlue',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: SkyBlue)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=Gray',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Gray)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Taupe&SideColor=Black',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Black)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Red&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Red / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Yellow&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Yellow / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Green&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Green / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=BrightBlue&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: BrightBlue / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=SkyBlue&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: SkyBlue / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Gray&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Gray / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/catalog/cfccResults.php?autoID=88254&ext=PX&year=2014&size=G3&multicolor=1&TopColor=Black&SideColor=Taupe',
		val: 's-2854^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base model - Sedan with antenna pocket with 2 mirror pockets (Top: Black / Sides: Taupe)^409.23^1^0'
	}];

	pages.forEach(function(page) {
		it('should contain the correct form information at: ' + page.url, function(done) {
			this.timeout(6000);
			request(app)
				.get(page.url)
				.end(function(err, res) {
					var $ = cheerio.load(res.text),
						val = $('input[name=item_1]').attr('value');
					assert.equal(val, page.val);
					done();
				});
		});
	});

});
