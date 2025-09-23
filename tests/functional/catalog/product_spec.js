var assert = require('assert'),
	request = require('supertest'),
	cheerio = require('cheerio'),
	app = require('../../../server');

describe('The product page', function() {

	var pages = [{
		url: '/2014-acura-ilx-base/p20?fabric=TS',
		val: 'a-4032^=SS=C17516TS^Taupe Dustop Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^222.32^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=nh',
		val: 'a-4032^=SS=C17516NH^Gray Noah Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^239.75^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=rs',
		val: 'a-4032^=SS=C17516RS^Gray Reflectect Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^176.43^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=D1',
		val: 'a-4032^=SS=C17516D1^Pacific Blue Sunbrella Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=D4',
		val: 'a-4032^=SS=C17516D4^Cadet Gray Sunbrella Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=D6',
		val: 'a-4032^=SS=C17516D6^Toast Sunbrella Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^453.44^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=GK',
		val: 'a-4032^=SS=C17516GK^Gray Technalon Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^206.63^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=TK',
		val: 'a-4032^=SS=C17516TK^Tan Technalon Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^206.63^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=UB',
		val: 'a-4032^=SS=C17516UB^Black Ultratect Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=UG',
		val: 'a-4032^=SS=C17516UG^Gray Ultratect Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=UL',
		val: 'a-4032^=SS=C17516UL^Blue Ultratect Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=UT',
		val: 'a-4032^=SS=C17516UT^Tan Ultratect Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^264.66^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=HG',
		val: 'a-4032^=SS=C17516HG^Gray WeatherShield HD Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^447.39^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PG',
		val: 'a-4032^=SS=C17516PG^Gray WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^327.49^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PT',
		val: 'a-4032^=SS=C17516PT^Taupe WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^327.49^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PY',
		val: 'a-4032^=SS=C17516PY^Yellow WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PA',
		val: 'a-4032^=SS=C17516PA^Bright Blue WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PL',
		val: 'a-4032^=SS=C17516PL^Light Blue WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PN',
		val: 'a-4032^=SS=C17516PN^Green WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PR',
		val: 'a-4032^=SS=C17516PR^Red WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PB',
		val: 'a-4032^=SS=C17516PB^Black WeatherShield HP Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets^366.29^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=Red',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Red)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=Yellow',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Yellow)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=Green',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Green)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=BrightBlue',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: BrightBlue)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=SkyBlue',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: SkyBlue)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=Gray',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Gray)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Taupe&SideColor=Black',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Taupe / Sides: Black)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Red&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Red / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Yellow&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Yellow / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Green&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Green / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=BrightBlue&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: BrightBlue / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=SkyBlue&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: SkyBlue / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Gray&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Gray / Sides: Taupe)^409.23^1^0'
	}, {
		url: '/2014-acura-ilx-base/p20?fabric=PX&multicolor=1&TopColor=Black&SideColor=Taupe',
		val: 'a-4032^=SS=C17516PX^MultiColor WeatherShield MultiColor Custom-fit car cover for 2014 Acura ILX  Base - With antenna pocket with 2 mirror pockets (Top: Black / Sides: Taupe)^409.23^1^0'
	}];

	pages.forEach(function(page) {
		it('should contain the correct form information at: ' + page.url, function(done) {
			this.timeout(6000);
			request(app)
				.get(page.url)
				.end(function(err, res) {
					var $ = cheerio.load(res.text),
						val = $('input[name=item1]').attr('value');
					assert.equal(val, page.val);
					done();
				});
		});
	});

});
