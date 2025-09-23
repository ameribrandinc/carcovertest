var request = require('request'),
	cheerio = require('cheerio'),
	compulsive = require('compulsive'),
	dust = require('dustjs-linkedin'),
	fs = require('fs'),
	rootUrl = 'http://localhost:3000',
	productionRootUrl = 'https://carcovers.org',
	date = require('moment')().format('YYYY-MM-DD'),
	pagesToBeCrawled = [],
	crawledPages = [],
	finalPages = [],
	workers = 1,
	once = true;

function log(message) {
	console.log(message);
}

function generateXML() {
	var xml,
		data = {
			urls: finalPages
		};

	// the path to the template assumes a CWD of the carcovers repo
	fs.readFile('./sitemap-generator/template.dust', function(err, file) {
		var name = 'template';
		var fn = dust.compileFn(file.toString(), name);
		fn(data, function(err, out) {

			// the path to the template assumes a CWD of the carcovers repo
			fs.writeFile('./public/sitemap.xml', out, function(err) {
				if (err) throw err;
				log('File saved: sitemap.xml');
				end();
			});
		});
	});
}

function checkDone() {
	if (workers === 1 && pagesToBeCrawled.length === 0) {
		generateXML();
	} else if (pagesToBeCrawled.length === 0) {
		workers--;
	} else {
		process.nextTick(scrape);
	}
}

function end() {
	log('\nCrawling complete. Ending process.');
	process.kill();
}

function scrape(path) {

	if (once) {
		once = false;
		crawledPages.push(path);
	} else {
		path = pagesToBeCrawled.pop();
		crawledPages.push(path);
	}

	var reqUrl = rootUrl + path;

	if (reqUrl != 'undefined') {

		request({
			url: reqUrl,
			timeout: 5000
		}, function(err, res, body) {
			log('Fetched URL: ' + res.request.path + ' ' + res.statusCode);

			// if everything is OK
			if (res.statusCode === 200) {

				finalPages.push({
					url: productionRootUrl + path,
					date: date
				});

				var $ = cheerio.load(body);
				$('a').each(function(index) {
					var href = $(this).attr('href');

					// check to make sure this url hasn't been cataloged yet
					if (crawledPages.indexOf(href) === -1 && pagesToBeCrawled.indexOf(href) === -1) {

						// if it is based on the current site root and it's not a protocol ambiguous URL
						if (href.charAt(0) === '/' && href.charAt(1) !== '/') {
							pagesToBeCrawled.push(href);
						}
					}
				});

				// if there are pages left
				if (pagesToBeCrawled.length > 0) {
					process.nextTick(scrape);
					while (workers < 2) {
						workers++;
						process.nextTick(scrape);
					}
				} else {
					checkDone();
				}
			} else if (pagesToBeCrawled.length > 0) {
				process.nextTick(scrape);
			} else {
				checkDone();
			}
		});
	}
}

scrape('/');
