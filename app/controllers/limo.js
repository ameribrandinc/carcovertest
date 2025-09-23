var newrelic = require('newrelic'),
	api = require('../api'),
	_ = require('underscore'),
	logger = require('../lib/logger'),
	utils = require('../lib/utils'),
	logger = require('../lib/logger'),
	util = require('util');

function getBreadcrumbs(page) {
	var breadcrumbs = [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Limo Covers',
		url: '/limo/'
	}];
	breadcrumbs.push(page);
	return breadcrumbs;
}

module.exports = {
	index: function(req, res) {
		newrelic.setControllerName('limo.index');
		res.render('limo/index', {
			meta: {
				title: 'Limousine Covers for Lincoln and Cadillac Limos | T.J.Cars',
				description: 'We offer an entire line of custom fit limousine covers. Find a custom cover to fit your Cadillac or Lincoln limousine.',
				canonical: '/limo/'
			},
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Limo Covers'
			}],
			model: {
				isLimoSection: true
			}
		});
	},

	measuring: function(req, res) {
		newrelic.setControllerName('limo.measuring');
		res.render('limo/measuring', {
			meta: {
				title: 'Measuring for a Limo Cover',
				description: 'Measuring for a custom fit Cadillac or Lincoln limousine cover. Simple length measurement needed to find limo cover prices.',
				canonical: '/limo/measuring/'
			},
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Measuring'
			}],
			model: {
				isLimoSection: true
			}
		});
	},

	antenna: function(req, res) {

		newrelic.setControllerName('limo.antenna');

		var year = req.query.year,
			make = req.query.make,
			model = req.query.model,
			length = req.query.length,
			canonical = util.format('/catalog/limoLength.php?make=%s&year=%d&model=%s&length=%d', make, year, model, length),
			nextPageUrlString = '/catalog/limoFabs.php?make=%s&year=%d&model=%s&length=%d&antenna=%s',
			options = [],
			antenna,
			redirectUrl;

		api.limoCovers.getAntennaOptions({
			make: make,
			year: year,
			model: model,
			length: length
		}, function(error, antennaOptions) {

			if (error !== null) {
				logger.noticeError(error, req);
				throw error;
			}

			// TODO: redo this when we have all the pages running through the node app completely
			if ( /*antennaOptions.length === 1*/ false) {
				antenna = antennaOptions[0].antenna;
				redirectUrl = util.format(nextPageUrlString, make, year, model, length, antenna);
				// TODO: go back and make sure we are sending the right status code here
				res.redirect(redirectUrl);
			} else {

				_.each(antennaOptions, function(option) {
					options.push({
						value: option.antenna,
						text: option.antenna,
						url: util.format(nextPageUrlString, make, year, model, length, option.antenna)
					});
				});

				// TODO: rename limo/year dust file to be more generic to handle all result selections.
				res.render('limo/year', {
					meta: {
						title: util.format('%d %s %s Limousine Covers w/ %d" Length - Boomerang Antenna?', year, make, model, length),
						description: util.format('Select whether or not your %s %s limousine has a boomerang antenna to continue finding limo cover prices.', make, model),
						canonical: canonical,
						robots: 'noindex'
					},
					breadcrumbs: getBreadcrumbs({
						page: 'Antenna'
					}),
					navigation: {
						nextPage: 'limoFabs.php'
					},
					vehicle: {
						values: [{
							name: 'make',
							value: make
						}, {
							name: 'year',
							value: year
						}, {
							name: 'model',
							value: model
						}, {
							name: 'length',
							value: length
						}],
						selectionType: 'antenna',
						pageType: 'antenna option',
						options: options,
						make: utils.string.capitalize(make),
						year: year,
						model: utils.string.capitalize(model),
						length: length
					},
					page: {
						subHeading: 'Does Limousine Have A Boomerang Antenna?',
						defaultSelectOption: 'Select an antenna option',
						columns: 2
					},
					model: {
						isLimoSection: true
					}
				});
			}
		});
	},

	fabrics: function(req, res) {

		newrelic.setControllerName('limo.fabrics');

		var year = req.query.year,
			make = req.query.make,
			model = req.query.model,
			length = req.query.length,
			antenna = req.query.antenna,
			canonical = util.format('/catalog/limoFabs.php?make=%s&year=%d&model=%s&length=%d&antenna=%s', make, year, model, length, antenna),
			options = [],
			coverNotFound = false;

		api.limoCovers.getLimoFabs({
			make: make,
			model: model,
			year: year,
			length: length,
			antenna: antenna
		}, function(error, covers) {

			if (error) {
				coverNotFound = true;
				logger.error(error, req);
				res.status(500);
				return res.render('errors/notfound');
			} else {

				// TODO: move some of this logic into the API layer
				// because currently it is being replicated in this action and the
				// cfccFabs action
				covers.forEach(function(fabric) {
					// set default next action to limoResults.php
					fabric.nextAction = '/catalog/limoResults.php';
					fabric.year = year;

					// check for dot separated color list
					fabric.colors = fabric.colors.indexOf('.') > -1 ?
						fabric.colors.split('.') : [fabric.colors];
					if (fabric.ext.indexOf('.') > -1) {
						fabric.ext = fabric.ext.split('.');
					}
					// if there's only one price
					if (fabric.jobber.indexOf(';') === -1) {
						// check for next step in selection flow
						// if there's more than one color
						if (fabric.colors.length > 1) {
							fabric.nextAction = util.format('/catalog/limoColors.php?size=%s&abrv=%s&year=%d&make=%s&model=%s&length=%d&antenna=%s&part=%s', fabric.size, fabric.abrv, year, make, model, length, antenna, fabric.part);
						} else {
							if (fabric.abrv === 'wsMC') {
								fabric.nextAction = '/catalog/multicolor-wsHP.php';
							}
						}
					} else {
						fabric.jobber = fabric.jobber.split(';');
						fabric.lowestPrice = _.min(fabric.jobber);
						fabric.nextAction = '/catalog/limoColors.php';
					}
					if (fabric.nextAction.indexOf('?') === -1) {
						fabric.nextAction += util.format('?size=%s&abrv=%s&year=%d&make=%s&model=%s&part=%s&antenna=%s&length=%d', fabric.size, fabric.abrv, fabric.year, make, model, fabric.part, antenna, length);
					}
				});

				res.render('catalog/fabrics', {
					meta: {
						title: 'Limo Covers - Prices - Select A Fabric',
						description: util.format('Available limo cover fabrics and prices for your %d %s %s (%d" long).', year, make, model, length),
						canonical: canonical,
						robots: 'noindex'
					},
					breadcrumbs: getBreadcrumbs({
						page: 'Select Length'
					}),
					navigation: {
						nextPage: 'limoAntenna.php'
					},
					vehicle: {
						values: [{
							name: 'make',
							value: make
						}, {
							name: 'year',
							value: year
						}, {
							name: 'model',
							value: model
						}],
						selectionType: 'length',
						pageType: 'Length/Stretch',
						options: options,
						make: utils.string.capitalize(make),
						year: year,
						model: utils.string.capitalize(model)
					},
					fabrics: covers,
					page: {
						showQuoteText: true,
						columns: 2,
						coverNotFound: coverNotFound,
						vehicleType: 'Limo'
					},
					model: {
						isLimoSection: true
					}
				});

			}

		});
	},

	colors: function(req, res) {

		newrelic.setControllerName('limo.colors');

		var size = req.query.size,
			year = req.query.year,
			abrv = req.query.abrv,
			make = req.query.make,
			model = req.query.model,
			antenna = req.query.antenna,
			length = req.query.length,
			part = req.query.part;

		api.limoCovers.getLimoColors({
			size: size,
			abrv: abrv
		}, function(error, rows) {
			if (error) {
				logger.error(error, req);
				res.status(500);
				return res.render('errors/notfound');
			}

			// if there are no results this page shouldn't exist
			// 301 redirect the user
			if (rows.length < 1) {
				res.redirect(301, '/catalog/cfcc.php');
			}
			var fabric = rows[0],
				fabrics = [];

			// split out fabric colors, ext and jobber into arrays
			fabric.colors = fabric.colors.split('.');
			fabric.ext = fabric.ext.split('.');
			fabric.jobber = fabric.jobber.indexOf(';') ?
				fabric.jobber.split(';') : [fabric.jobber];

			fabric.colors.forEach(function(color, index) {
				var fabricData = {
					name: fabric.name,
					abrv: fabric.abrv,
					description: fabric.description,
					warranty: fabric.warranty,
					type: fabric.type,
					section: fabric.section,
					retail: fabric.retail,
					color: color
				};
				fabricData.ext = fabric.ext[index];
				fabricData.nextAction = util.format('/catalog/limoResults.php?make=%s&year=%d&model=%s&length=%d&antenna=%s&size=%s&part=%s&ext=%s&abrv=%s', make, year, model, length, antenna, fabric.size, part, fabricData.ext, fabric.abrv);
				fabricData.image = util.format('swatch-%s-%s.jpg', abrv, fabricData.ext.toLowerCase());
				fabricData.colorSlug = utils.slugify(color);
				if (fabric.jobber.length > 1) {
					fabricData.jobber = fabric.jobber[index];
				} else {
					fabricData.jobber = fabric.jobber[0];
				}
				fabrics.push(fabricData);
			});

			fabric.year = year;

			// compile view data object
			var viewData = {
				meta: {
					title: 'Chose a fabric color.',
					description: 'Select a cover color.',
					canonical: '', //util.format('/catalog/cfccColors.php?autoID=%d&year=%d&abrv=%s&size=%s', autoId, year, abrv, size)
					robots: 'noindex'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Colors'
				}),
				fabrics: fabrics,
				fabric: fabric
			};
			res.render('catalog/cover_colors', viewData);
		});

	},

	length: function(req, res) {

		newrelic.setControllerName('limo.length');

		var year = req.query.year,
			make = req.query.make,
			model = req.query.model,
			canonical = util.format('/catalog/limoLength.php?make=%s&year=%d&model=%s', make, year, model),
			options = [];

		api.limoCovers.getLengthOptions({
			make: make,
			model: model,
			year: year
		}, function(error, lengthOptions) {

			if (error !== null) {
				logger.noticeError(error, req);
				throw error;
			}

			_.each(lengthOptions, function(option) {
				options.push({
					value: option.length,
					text: util.format('%d" Overall Length / %d" Stretch', option.length, option.stretch),
					url: util.format('/catalog/limoAntenna.php?make=%s&year=%d&model=%s&length=%d', make, year, model, option.length)
				});
			});

			// TODO: rename limo/year dust file to be more generic to handle all result selections.
			res.render('limo/year', {
				meta: {
					title: util.format('%d %s %s Limousine Covers - Select Limo Length/Stretch', year, make, model),
					description: util.format('Select your %s limousine\'s length to continue finding limo cover prices.', make),
					canonical: canonical,
					robots: 'noindex'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Select Length'
				}),
				navigation: {
					nextPage: 'limoAntenna.php'
				},
				vehicle: {
					values: [{
						name: 'make',
						value: make
					}, {
						name: 'year',
						value: year
					}, {
						name: 'model',
						value: model
					}],
					selectionType: 'length',
					pageType: 'Length/Stretch',
					options: options,
					make: utils.string.capitalize(make),
					year: year,
					model: utils.string.capitalize(model)
				},
				page: {
					showQuoteText: true,
					columns: 2
				},
				model: {
					isLimoSection: true
				}
			});
		});
	},

	model: function(req, res) {
		newrelic.setControllerName('limo.model');

		var year = req.query.year,
			make = req.query.make,
			canonical = util.format('/catalog/limoModel.php?make=%s&year=%d', make, year),
			options = [];

		api.limoCovers.getLimoModelsByYearAndMake({
			make: make,
			year: year
		}, function(error, models) {

			if (error !== null) {
				logger.noticeError(error, req);
				throw error;
			}

			_.each(models, function(row) {
				options.push({
					value: row.model,
					text: row.model,
					url: util.format('/catalog/limoLength.php?make=%s&year=%d&model=%s', make, year, row.model)
				});
			});

			// TODO: rename limo/year dust file to be more generic to handle all result selections.
			res.render('limo/year', {
				meta: {
					title: util.format('%d %s Limousine Covers - Select Limo Model', year, utils.string.capitalize(make)),
					description: util.format('Select a model for your %d %s limousine to continue finding limo cover prices.', year, make),
					canonical: canonical,
					robots: 'noindex'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Select Model'
				}),
				navigation: {
					nextPage: 'limoLength.php'
				},
				vehicle: {
					values: [{
						name: 'make',
						value: make
					}, {
						name: 'year',
						value: year
					}],
					selectionType: 'model',
					pageType: 'Model',
					options: options,
					make: utils.string.capitalize(make),
					year: year
				},
				page: {
					columns: 2
				},
				model: {
					isLimoSection: true
				}
			});
		});
	},


	year: function(req, res) {
		newrelic.setControllerName('limo.year');
		var make = req.query.make,
			canonical = util.format('/catalog/limoYear.php?make=%s', make);
		api.limoCovers.getLimoYearsByMake({
			make: make,
		}, function(error, years) {

			if (error !== null) {
				logger.noticeError(error, req);
				throw error;
			}

			var ranges = [],
				options = [];
			_.each(years, function(years) {
				ranges.push(_.range(years.year1, years.year2 + 1));
			});
			ranges = _.uniq(_.flatten(ranges));
			ranges.reverse();

			_.each(ranges, function(year) {
				options.push({
					value: year,
					text: year,
					url: util.format('/catalog/limoModel.php?make=%s&year=%d', make, year)
				});
			});

			res.render('limo/year', {
				meta: {
					title: util.format('%s Limousine Covers - Select Limo\'s Year', utils.string.capitalize(make)),
					description: util.format('Select your %s limousine\'s year to continue finding limo cover prices.', utils.string.capitalize(make)),
					keywords: util.format('%s limo, %s limousine, limo cover, limo covers, year, select year, limosine cover, limo cover, car cover, car covers, prices, price, quote, covercraft, Weathershield HD, Sunbrella, custom cover, car accessories, accessories', make, make),
					canonical: canonical,
					robots: 'noindex'
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Select Year'
				}),
				navigation: {
					nextPage: 'limoModel.php'
				},
				vehicle: {
					values: [{
						name: 'make',
						value: make
					}],
					selectionType: 'year',
					pageType: 'Year',
					options: options,
					make: utils.string.capitalize(make)
				},
				page: {
					columns: 3
				},
				model: {
					isLimoSection: true
				}
			});
		});
	},

	make: function(req, res) {
		newrelic.setControllerName('limo.make');
		res.render('limo/make', {
			meta: {
				title: 'Prices for Covercraft Limousine Covers - T.J.Cars',
				description: 'Select your limousine\'s make to continue finding limo cover prices. Available options are Lincoln and Cadillac.',
				keywords: 'prices, price, quote, cadillac, lincoln, make, select make, limosine cover, limo cover, car cover, car covers, lincoln, cadilliac, covercraft, Weathershield HD, Sunbrella, custom cover, car accessories, accessories, t.j. cars',
				canonical: '/limo/make.php',
				robots: 'noindex'
			},
			breadcrumbs: getBreadcrumbs({
				page: 'Prices'
			}),
			model: {
				isLimoSection: true
			}
		});
	},

	results: function(req, res) {
		newrelic.setControllerName('limo.results');

		var limoFn,
			limoParams = {
				size: req.query.size
			};

		if (req.query.abrv) {
			limoFn = 'getLimoBySizeAndAbbreviation';
			limoParams.abrv = req.query.abrv;
		} else {
			limoFn = 'getLimoBySizeAndExt';
			limoParams.ext = req.query.ext;
		}

		api.limoCovers[limoFn](limoParams, function(error, limos) {
			if (error) {
				logger.error(error, req);
				res.status(500);
				return res.render('errors/notfound');
			}

			var limo = limos[0],
				index;

			if (limo.ext.indexOf('.') !== -1) {
				limo.ext = limo.ext.split('.');
				index = limo.ext.indexOf(req.query.ext);
				limo.ext = limo.ext[index];
			}

			if (limo.colors.indexOf('.') !== -1) {
				limo.colors = limo.colors.split('.');
				limo.colors = limo.colors[index];
			}

			if (limo.jobber.indexOf(';') !== -1) {
				limo.jobber = limo.jobber.split(';')[index];
				limo.retail = limo.retail.split(';')[index];
			}

			var data = {
				meta: {
					title: util.format('Custom-Fit Limo Cover for %d %s %s', req.query.year, req.query.make.charAt(0).toUpperCase() + req.query.make.slice(1).toLowerCase(), req.query.model.charAt(0).toUpperCase() + req.query.model.slice(1).toLowerCase())
				},
				submodel: util.format('with overall length of %d inches.', req.query.length),
				model: {
					pageTitle:  util.format('%d %s %s Cover by Covercraft', req.query.year, req.query.make.charAt(0).toUpperCase() + req.query.make.slice(1).toLowerCase(), req.query.model.charAt(0).toUpperCase() + req.query.model.slice(1).toLowerCase()),
					description: limo.description,
					details: util.format('Boomerang antenna = %s.', req.query.antenna),
					make: req.query.make,
					model: req.query.model,
					year: req.query.year,
					length: req.query.length,
					antenna: req.query.antenna,
					fabric: req.query.abrv,
					partNumber: req.query.part + limo.ext,
					price: limo.jobber,
					productName: 'limo cover',
					retail: limo.retail,
					abrv: limo.abrv,
					colors: limo.colors,
					section: limo.section,
					name: limo.name,
					hideSubmodel: true,
					isMultiColor: req.query.multicolor === '1',
					multiColor: req.query.multicolor,
					topColor: req.query.topcolor,
					sideColor: req.query.sidecolor,
					swatch: {
						url: util.format('swatch-%s-%s.jpg', limo.abrv, limo.ext.toLowerCase()),
						description: util.format('%s - %s', limo.name, limo.colors)
					},
					warranty: limo.warranty
				},
				breadcrumbs: getBreadcrumbs({
					page: 'Results'
				})

			};
			res.render('catalog/results', data);
		});
	}



};
