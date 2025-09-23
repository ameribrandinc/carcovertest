var api = require('../api'),
	util = require('util'),
	url = require('url'),
	newrelic = require('newrelic'),
	logger = require('../lib/logger'),
	utils = require('../lib/utils'),
	_ = require('underscore');

function getBreadcrumbs() {
	return [{
		page: 'Home',
		url: '/'
	}, {
		page: 'Catalog & Prices',
		url: '/catalog/'
	}, {
		page: 'Car Covers'
	}];
}

function getColorExtension(color) {
	var extension;
	// grab color extensions
	switch (color) {
		case 'SkyBlue':
			extension = 'pl';
			break;
		case 'BrightBlue':
			extension = 'pa';
			break;
		case 'Gray':
			extension = 'pg';
			break;
		case 'Green':
			extension = 'pn';
			break;
		case 'Red':
			extension = 'pr';
			break;
		case 'Taupe':
			extension = 'pt';
			break;
		case 'Yellow':
			extension = 'py';
			break;
		case 'Black':
			extension = 'pb';
			break;
	}
	return extension;
}

module.exports = {

	index: function(req, res) {
		newrelic.setControllerName('catalog.index');
		res.render('catalog/index', {
			meta: {
				title: 'Car Cover, Limo Cover and Seat Cover Prices',
				description: 'See available patterns and prices for Covercraft Car Covers and Seat Covers. Find a seat cover or custom-fit car cover to fit your car, truck, or SUV.',
				canonical: '/catalog/'
			},
			breadcrumbs: [{
				page: 'Home',
				url: '/'
			}, {
				page: 'Prices'
			}]
		});
	},

	cfcc: function(req, res) {
		newrelic.setControllerName('catalog.cfcc');
		api.customCovers.getAllMakes(function(err, data) {
			if (err) {
				logger.error(err, req);
				throw err;
			}

			var options = [];
			data.forEach(function(row) {
				options.push({
					value: row.make,
					text: row.make,
					url: util.format('/catalog/cfccYear.php?make=%s', encodeURIComponent(row.make))
				});
			});

			res.render('catalog/cfcc', {
				meta: {
					title: 'Covercraft Car Covers Catalog - Select Vehicle Make',
					description: 'All available makes/brands for Covercraft custom-fit car covers.',
					canonical: '/catalog/cfcc.php' // TODO: change this after full conversion
				},
				breadcrumbs: [{
					page: 'Home',
					url: '/'
				}, {
					page: 'Catalog & Prices',
					url: '/catalog/'
				}, {
					page: 'Car Covers'
				}],
				model: {
					options: options,
					pageType: 'Make',
					type: 'make',
					showP1: true,
					nextPage: 'cfccYear.php'
				}
			});
		});
	},

	cfccSub: function(req, res) {
		newrelic.setControllerName('catalog.cfccSub');
		var model = req.query.model,
			year = req.query.year,
			make = req.query.make;

		api.customCovers.getSubs({
			model: model,
			make: make,
			year: year
		}, function(err, rows) {
			// check for errors from API
			if (err) {
				logger.error(err, req);
				throw err;
			}

			// check for returned options
			if (rows.length < 1) {
				// TODO: log error and redirect to select a make page
			}


			var options = [];
			rows.forEach(function(option) {
				options.push({
					value: option.id,
					text: option.details,
					url: util.format('/catalog/cfccFabs.php?year=%d&autoID=%s', year, option.id)
				});
			});

			res.render('catalog/cfcc', {
				meta: {
					title: util.format('%d %s %s car covers made by Covercraft - Select a Submodel', year, make, model),
					description: util.format('All available submodels for %s %d %s custom-fit car covers made by Covercraft', make, year, model),
					canonical: util.format('/catalog/cfccSub.php?make=%s&year=%d&model=%s', make, year, model),
					robots: 'noindex,follow'
				},
				breadcrumbs: getBreadcrumbs(),
				model: {
					pageType: 'Sub-Model',
					type: 'submodel',
					options: options,
					values: [{
						key: 'make',
						val: make
					}, {
						key: 'year',
						val: year
					}, {
						key: 'model',
						val: model
					}]
				}
			});
		});
	},

	cfccModel: function(req, res) {
		newrelic.setControllerName('catalog.cfccModel');

		var year = req.query.year,
			make = req.query.make,
			options = [];

		api.customCovers.getModels({
			make: make,
			year: year
		}, function(err, rows) {
			if (err) {
				logger.error(err, req);
				throw err;
			}

			rows.forEach(function(option) {
				options.push({
					value: option.model,
					text: option.model,
					url: util.format('/catalog/cfccSub.php?make=%s&year=%d&model=%s', encodeURIComponent(req.query.make), year, option.model)
				});
			});

			res.render('catalog/cfcc', {
				meta: {
					title: util.format('%d %s make by Covercraft - Select a Model', year, make),
					description: util.format('All available models for %s %d custom-fit car covers made by Covercraft.', make, year),
					canonical: util.format('/catalog/cfccModel.php?make=%s&year=%d', make, year),
					robots: 'noindex,follow'
				},
				breadcrumbs: getBreadcrumbs(),
				model: {
					options: options,
					pageType: 'Model',
					type: 'model',
					showP1: true,
					nextPage: 'cfccSub.php',
					values: [{
						key: 'make',
						val: make
					}, {
						key: 'year',
						val: year
					}]
				}
			});
		});

	},

	cfccYear: function(req, res) {
		newrelic.setControllerName('catalog.cfccYear');
		api.customCovers.getModelsForMake({
			make: req.query.make
		}, function(err, yearArray) {
			if (err) {
				logger.error(err, req);
				throw err;
			}

			var options = [];

			yearArray.forEach(function(option) {
				options.push({
					value: option,
					text: option,
					url: util.format('/catalog/cfccModel.php?make=%s&year=%s', encodeURIComponent(req.query.make), option)
				});
			});

			res.render('catalog/cfcc', {
				meta: {
					title: util.format('%s Car Covers made by Covercraft - Select a Year', req.query.make),
					description: util.format('All available years for %s custom-fit car covers made by Covercraft.', req.query.make),
					canonical: util.format('/catalog/cfccYear.php?make=%s', req.query.make),
					robots: 'noindex,follow'
				},
				breadcrumbs: [{
					page: 'Home',
					url: '/'
				}, {
					page: 'Catalog & Prices',
					url: '/catalog/'
				}, {
					page: 'Car Covers'
				}],
				model: {
					options: options,
					pageType: 'Year',
					type: 'year',
					make: req.query.make,
					showP1: true,
					nextPage: 'cfccModel.php',
					values: [{
						key: 'make',
						val: req.query.make
					}]
				}
			});
		});
	},

	/**
	 * Product page controller
	 * @param  {Object}   req  Browser request
	 * @param  {Object}   res  Browser response
	 * @param  {Function} next Callback
	 */
	product: function(req, res) {

		newrelic.setControllerName('catalog.product');

		// Change this line to use the new method
    api.customCovers.getCoversByAutoIdWithPricing({
			autoId: req.params.id,
			fabric: req.query.fabric
		}, function(err, data) {

			if (err) {
				logger.error(err, req);
				res.status(500);
				return res.redirect('/page-not-covered');
			} else if (data.length === 0) {
				return res.redirect(301, '/');
			} else if (req.params.slug !== data[0].slug) {
				return res.redirect(301, util.format('/%s/p%d?%s', data[0].slug, req.params.id, url.parse(req.url).query));
			}

			// pull some info out of the query string
			var autoId = req.params.id,
				fabric = req.query.fabric,
				slug = data[0].slug,
				canonical = util.format('/%s/p%d?fabric=%s', slug, autoId, fabric),
				p1Available = false,
				extLower,
				multiColor,
				make,
				part,
				size,
				topColor,
				sideColor,
				isMultiColor = false,
				topColorExt,
				sideColorExt;

			// figure out which page we are coming from
			// more specifically which fabric the user chose
			if (req.query.multicolor !== undefined) {
				isMultiColor = true;
				multiColor = parseInt(req.query.multicolor, 10);
				topColor = req.query.topcolor;
				sideColor = req.query.sidecolor;
				canonical = util.format('%s&multicolor=%s&TopColor=%s&SideColor=%s', canonical, multiColor, topColor, sideColor);

				topColorExt = getColorExtension(topColor);
				sideColorExt = getColorExtension(sideColor);

			}

			// grab the row
			var cover = data[0],
				model = cover.model,
				year = cover.year;

			if (!cover.selectedFabric) {
				return res.redirect(301, `/catalog/cfccFabs.php?year=${year}&autoID=${autoId}`);
			}

			p1Available = cover.selectedFabric.rushManufacture;
			extLower = cover.selectedFabric.ext.toLowerCase();

			part = cover.part;
			make = cover.make;
			model = cover.model;
			var details = cover.details;
			// even though we get size in the query string for some searches we don't for WeatherShield HP
			size = cover.size;

			var title = util.format('%d %s %s %s Cover by Covercraft', year, make, model, cover.selectedFabric.name);

			// add product url for swatches

			var indoors = [];
			var hybrid = [];
			cover.fabrics.forEach(function(fabric) {
				if (!fabric.isMultiColor) {
					fabric.productUrl = '/' + slug + '/p' + cover.id + '?fabric=' + fabric.ext;
				} else {
					fabric.productUrl = '/catalog/multicolor-wsHP.php?autoID=' + autoId + '&year=' + year + '&part=' + part + '&size=' + size + '&abrv=wsMC';
				}

				if (fabric.type === 'Indoor') {
					indoors.push(fabric);
				} else if (fabric.type === 'Outdoor/Indoor') {
					hybrid.push(fabric);
				}

			});



			var viewData = {
				meta: {
					title: title,
					description: util.format('Covercraft cover for %d %s %s %s.', year, make, model, details),
					canonical: canonical
				},
				breadcrumbs: [{
					page: 'Home',
					url: '/'
				}, {
					page: 'Catalog & Prices',
					url: '/catalog/'
				}, {
					page: 'Car Covers'
				}],
				indoor: indoors,
				hybrid: hybrid,
				model: {
					showP1: true,
					name: cover.selectedFabric.name,
					pageTitle: title,
					description: cover.selectedFabric.description,
					details: details,
					abrv: cover.selectedFabric.abrv,
					section: cover.selectedFabric.section,
					colors: cover.selectedFabric.colors,
					p1Available: p1Available,
					ext: cover.selectedFabric.ext,
					extLower: extLower,
					part: part,
					partNumber: part + cover.selectedFabric.ext,
					price: cover.selectedFabric.jobber,
					productName: 'car cover',
					retail: cover.selectedFabric.retail,
					isMultiColor: isMultiColor,
					multiColor: multiColor,
					multiColorUnselected: cover.selectedFabric.colors === 'Multi-Color' && multiColor !== 1 ? true : false,
					make: make,
					year: year,
					model: model,
					sideColor: sideColor,
					topColor: topColor,
					sideColorExt: sideColorExt,
					topColorExt: topColorExt,
					fabrics: cover.fabrics,
					swatch: {
						url: util.format('swatch-%s-%s.jpg', cover.selectedFabric.abrv, extLower),
						description: util.format('%s - %s', cover.selectedFabric.name, cover.selectedFabric.colors)
					},
					warranty: cover.selectedFabric.warranty
				}
			};

			res.render('catalog/product', viewData);

// COVERCRAFT SOAP API IS DOWN!!!
// (/1) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

			/* api.covercraft.getStock(part + cover.selectedFabric.ext, function(error, quantityInStock) {
				if (error !== null) {
					logger.error(error, req);
					throw error;
				}
				// a null here means that there was a problem with how we called the Covercraft API
				// an error should be logged in newrelic for this.
				viewData.model.stock = {
					haveStockInformation: quantityInStock !== null,
				};

				// if we truly have accurate in stock information
				if (viewData.model.stock.haveStockInformation) {
					// convert stringed number to actual number
					quantityInStock = parseInt(quantityInStock, 10);
					viewData.model.stock.quantityInStock = quantityInStock;
					viewData.model.stock.isInStock = quantityInStock > 0;
				}

				// finally render the view
				res.render('catalog/product', viewData);
			}); */

// (/1) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

		});
	},

	multiColor: function(req, res) {
		var q = req.query,
			autoId = q.autoid,
			year = q.year,
			size = q.size,
			data,
			options = [],
			nextAction,
			fabricValue;

		if (autoId) {
			nextAction = '/vehicle/p' + autoId;
			fabricValue = 'fabric';
		} else {
			nextAction = '/catalog/limoResults.php';
			options = [{
				key: 'year',
				value: year
			}, {
				key: 'size',
				value: size
			}, {
				key: 'make',
				value: q.make
			}, {
				key: 'model',
				value: q.model
			}, {
				key: 'length',
				value: q.length
			}, {
				key: 'antenna',
				value: q.antenna
			}, {
				key: 'part',
				value: q.part
			}];
			fabricValue = 'ext';
		}

		data = {
			meta: {
				title: 'Select colors for your WeatherShield HP cover.',
				description: 'Select colors for your WeatherShield HP cover.',
				canonical: '/catalog/multicolor-wsHP.php',
				robots: 'noindex,follow'
			},
			breadcrumbs: getBreadcrumbs(),
			nextAction: nextAction,
			options: options,
			fabricValue: fabricValue
		};
		res.render('catalog/cfccMulticolor', data);
	},

	cfccColors: function(req, res) {
    newrelic.setControllerName('catalog.cfccColors');
    var q = req.query,
        autoId = q.autoid,
        year = q.year,
        abrv = q.abrv,
        size = q.size,
        part = q.part;

    api.customCovers.getIndividualFabricPricing({
        autoId: autoId,
        abrv: abrv,
        part: part
    }, function(err, fabrics) {
        if (err) {
            logger.error(err, req);
            throw err;
        }
        
        if (fabrics.length < 1) {
            res.redirect(301, '/catalog/cfcc.php');
            return;
        }

        // Get client IP for logging
        var clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        var myIP = '98.224.102.35';
        var isMyIP = (clientIP === myIP || clientIP === '::ffff:' + myIP);

        // Add URLs and formatting to fabrics
        fabrics.forEach(function(fabric) {
            fabric.nextAction = util.format('/vehicle/p%d?fabric=%s', autoId, fabric.ext);
            fabric.image = util.format('swatch-%s-%s.jpg', abrv, fabric.ext.toLowerCase());
            fabric.colorSlug = require('../lib/utils').slugify(fabric.color);
        });

        var fabric = Object.assign({}, fabrics[0], {
            year: year,
            autoId: autoId
        });

        if (isMyIP) {
            console.log('[MY IP] Color page fabrics for part', part + ':');
            fabrics.forEach(function(f, i) {
                console.log('[MY IP]   Color', i + 1 + ':', f.color, '- Part:', part + f.ext, '- Price:', f.jobber, '- Source:', f.pricing_source);
            });
        }

        var viewData = {
            meta: {
                title: 'Choose a fabric color.',
                description: 'Select a cover color.',
                canonical: util.format('/catalog/cfccColors.php?autoID=%d&year=%d&abrv=%s&size=%s', autoId, year, abrv, size),
                robots: 'noindex,follow'
            },
            breadcrumbs: getBreadcrumbs(),
            fabrics: fabrics,
            fabric: fabric
        };
        
        res.render('catalog/cover_colors', viewData);
    });
},

	cfccFabs: function(req, res) {
    var autoId = req.query.autoid;
    
    // Get client IP address for logging
    var clientIP = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
    var myIP = '98.224.102.35';
    var isMyIP = (clientIP === myIP || clientIP === '::ffff:' + myIP);
    
    api.customCovers.getCoversByAutoIdWithPricing({
        autoId: autoId
    }, function(err, row) {
        if (err) {
            logger.error(err, req);
            res.status(500);
            return res.redirect('/page-not-covered');
        }

        if (row.length === 0) {
            logger.warn(util.format('Could not find fabric for autoId (%d)', autoId), req);
            res.status(404);
            return res.redirect('/page-not-covered');
        }

        var cover = row[0],
            model = cover.model,
            details = cover.details,
            size = cover.size,
            part = cover.part;

        // Group fabrics by abrv to avoid duplicates and reconstruct colors
        var groupedFabrics = {};
        var fabricsArray = [];

        // First pass: group all fabrics by abrv
        cover.fabrics.forEach(function(fabric) {
            if (!groupedFabrics[fabric.abrv]) {
                groupedFabrics[fabric.abrv] = {
                    base: fabric,
                    extensions: [],
                    colors: [],
                    jobbers: [],
                    retails: []
                };
            }
            
            groupedFabrics[fabric.abrv].extensions.push(fabric.ext);
            groupedFabrics[fabric.abrv].colors.push(fabric.colors);
            groupedFabrics[fabric.abrv].jobbers.push(fabric.jobber);
            groupedFabrics[fabric.abrv].retails.push(fabric.retail);
        });

        // Second pass: create final fabric objects
        Object.keys(groupedFabrics).forEach(function(abrv) {
            var group = groupedFabrics[abrv];
            var fabric = group.base;
            
            var groupedFabric = {
                name: fabric.name,
                abrv: fabric.abrv,
                description: fabric.description,
                warranty: fabric.warranty,
                type: fabric.type,
                section: fabric.section,
                year: cover.year,
                autoId: autoId,
                size: size,
                part: part,
                pricing_source: fabric.pricing_source
            };

            // Reconstruct the grouped extension and colors
            if (group.extensions.length > 1) {
                // Multiple extensions - group them
                groupedFabric.ext = group.extensions.join('.');
                groupedFabric.colors = group.colors.join('.');
                // Use the first jobber price (they should be the same for grouped fabrics)
                groupedFabric.jobber = group.jobbers[0];
                groupedFabric.retail = group.retails[0];
            } else {
                // Single extension
                groupedFabric.ext = fabric.ext;
                groupedFabric.colors = fabric.colors;
                groupedFabric.jobber = fabric.jobber;
                groupedFabric.retail = fabric.retail;
            }

            groupedFabric.map = fabric.map;
            groupedFabric.upc = fabric.upc;

            var nextActionQueryString = util.format('?autoID=%d&year=%d&part=%s&size=%s&abrv=%s', 
                autoId, cover.year, part, size, fabric.abrv);

            if (fabric.isMultiColor) {
                groupedFabric.nextAction = '/catalog/multicolor-wsHP.php' + nextActionQueryString;
            } else if (groupedFabric.ext.includes('.')) {
                // Multiple colors - go to color selection page
                groupedFabric.nextAction = '/catalog/cfccColors.php' + nextActionQueryString;
            } else {
                // Single color - go directly to product page
                groupedFabric.nextAction = util.format('/%s/p%d?fabric=%s', cover.slug, cover.id, groupedFabric.ext);
            }

            fabricsArray.push(groupedFabric);
        });

        // Logging
        if (isMyIP) {
            console.log('[MY IP] Grouped fabrics for autoId', autoId + ':');
            fabricsArray.forEach(function(fabric, index) {
                console.log('[MY IP]   Fabric', index + 1 + ':', fabric.abrv, '-', fabric.ext, '- Colors:', fabric.colors, '- $' + fabric.jobber, '(' + fabric.pricing_source + ')');
            });
        }

        // Check for multiple results
        if (row.length > 2) {
            res.render('catalog/cfccNot', {
                make: cover.make,
                year: cover.year,
                model: model,
                details: details
            });
        } else {
            res.render('catalog/fabrics', {
                meta: {
                    title: util.format('%d %s %s %s car cover made by Covercraft', cover.year, cover.make, model, details),
                    description: util.format('All available car cover fabrics for %s %d %s %s custom-fit car covers made by Covercraft.', cover.make, cover.year, model, details),
                    canonical: util.format('/catalog/cfccFabs.php?year=%d&autoID=%d', cover.year, autoId),
                    robots: 'noindex,follow'
                },
                breadcrumbs: getBreadcrumbs(),
                page: {
                    vehicleType: 'Car'
                },
                fabrics: fabricsArray
            });
        }
    });
},

	cfccWindow: function(req, res) {
		res.render('catalog/cfccWindow', {
			
		});
	}
};
