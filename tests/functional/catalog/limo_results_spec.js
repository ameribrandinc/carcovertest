var assert = require('assert'),
	request = require('supertest'),
	cheerio = require('cheerio'),
	app = require('../../../server');

describe('The limoResults pages', function() {

	var pages = [{
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=D1',
		value: 'a-4032^=SS=C16131D1^Pacific Blue Sunbrella Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^505.39^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=D4',
		value: 'a-4032^=SS=C16131D4^Cadet Gray Sunbrella Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^505.39^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=D6',
		value: 'a-4032^=SS=C16131D6^Toast Sunbrella Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^505.39^1^0'
	}, {
		url: '/catalog/limoResults.php?size=G4&abrv=dust&year=2008&make=CADILLAC&model=DEVILLE,%20CONCOURS,%20DTS&part=C16131&antenna=NO&length=207',
		value: 'a-4032^=SS=C16131TS^Taupe Dustop Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^266.56^1^0'
	}, {
		url: '/catalog/limoResults.php?size=G4&abrv=nh&year=2008&make=CADILLAC&model=DEVILLE,%20CONCOURS,%20DTS&part=C16131&antenna=NO&length=207',
		value: 'a-4032^=SS=C16131NH^Gray Noah Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^283.63^1^0'
	}, {
		url: '/catalog/limoResults.php?size=G4&abrv=rs&year=2008&make=CADILLAC&model=DEVILLE,%20CONCOURS,%20DTS&part=C16131&antenna=NO&length=207',
		value: 'a-4032^=SS=C16131RS^Gray Reflectect Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^210.45^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=GK&abrv=evo',
		value: 'a-4032^=SS=C16131GK^Gray Technalon Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^250.20^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=TK&abrv=evo',
		value: 'a-4032^=SS=C16131TK^Tan Technalon Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^250.20^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=UB&abrv=ut',
		value: 'a-4032^=SS=C16131UB^Black Ultratect Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^316.61^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=UG&abrv=ut',
		value: 'a-4032^=SS=C16131UG^Gray Ultratect Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^316.61^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=UL&abrv=ut',
		value: 'a-4032^=SS=C16131UL^Blue Ultratect Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^316.61^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=UT&abrv=ut',
		value: 'a-4032^=SS=C16131UT^Tan Ultratect Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^316.61^1^0'
	}, {
		url: '/catalog/limoResults.php?size=G4&abrv=wsHD&year=2008&make=CADILLAC&model=DEVILLE,%20CONCOURS,%20DTS&part=C16131&antenna=NO&length=207',
		value: 'a-4032^=SS=C16131HG^Gray WeatherShield HD Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^543.72^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PG&abrv=wsHP',
		value: 'a-4032^=SS=C16131PG^Gray WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^395.71^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PT&abrv=wsHP',
		value: 'a-4032^=SS=C16131PT^Taupe WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^395.71^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PY&abrv=wsHP',
		value: 'a-4032^=SS=C16131PY^Yellow WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PA&abrv=wsHP',
		value: 'a-4032^=SS=C16131PA^Bright Blue WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PL&abrv=wsHP',
		value: 'a-4032^=SS=C16131PL^Light Blue WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PN&abrv=wsHP',
		value: 'a-4032^=SS=C16131PN^Green WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PR&abrv=wsHP',
		value: 'a-4032^=SS=C16131PR^Red WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?make=CADILLAC&year=2008&model=DEVILLE,%20CONCOURS,%20DTS&length=207&antenna=NO&size=G4&part=C16131&ext=PB&abrv=wsHP',
		value: 'a-4032^=SS=C16131PB^Black WeatherShield HP Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO.^444.86^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=Red',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: Red)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=Yellow',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: Yellow)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=Green',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: Green)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=BrightBlue',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: BrightBlue)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=SkyBlue',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: SkyBlue)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=Gray',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: Gray)^496.99^1^0'
	}, {
		url: '/catalog/limoResults.php?ext=PX&year=2008&size=G4&make=CADILLAC&model=DEVILLE%2C+CONCOURS%2C+DTS&length=207&antenna=NO&part=C16131&multicolor=1&TopColor=Taupe&SideColor=Black',
		value: 'a-4032^=SS=C16131PX^MultiColor WeatherShield MultiColor Custom-fit limo cover for 2008 CADILLAC DEVILLE, CONCOURS, DTS with overall length of 207 inches. Boomerang antenna = NO. (Top: Taupe / Sides: Black)^496.99^1^0'
	}];

	pages.forEach(function(page) {
		it('should contain the correct form information at: ' + page.url, function(done) {
			this.timeout(6000);
			request(app)
				.get(page.url)
				.end(function(err, res) {
					var $ = cheerio.load(res.text),
						val = $('input[name=item_1]').attr('value');
					assert.equal(val, page.value);
					done();
				});
		});
	});

});
