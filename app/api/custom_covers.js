var env = require('../../config/env'),
	mysql = require('mysql'),
	util = require('util'),
	_ = require('lodash');

function createConnection() {
	return mysql.createConnection({
		host: env.db.host,
		user: env.db.user,
		password: env.db.password,
		database: env.db.name
	});
}

function flattenYears(rows) {
	var yearArray = [];

	_.each(rows, function(row) {
		yearArray.push(row.year);
	});

	yearArray.reverse();

	return yearArray;
}

function createSwatchUrl(abrv, ext) {
	return util.format('/catalog/pics/carcovers/swatch-%s-%s.jpg', abrv, ext.toLowerCase());
}

function formatFabricsArray(fabrics) {
	var formattedFabrics = [];
	_.each(fabrics, function(currentFabric) {
		var fabric = _.clone(currentFabric);

		if (_.contains(fabric.ext, '.')) {
			var fabricsInRow = fabric.ext.split('.');

			_.each(fabricsInRow, function(ext, index) {
				formattedFabrics.push(_.extend(_.clone(currentFabric), {
					swatchUrl: createSwatchUrl(fabric.abrv, ext),
					ext: ext,
					colors: fabric.colors.split('.')[index],
					retail: _.contains(fabric.retail, ';') ? fabric.retail.split(';')[index] : fabric.retail,
					jobber: _.contains(fabric.jobber, ';') ? fabric.jobber.split(';')[index] : fabric.jobber,
					rushManufacture: fabric.rushManufacture === 1
				}));
			});
		} else {
			fabric.swatchUrl = createSwatchUrl(fabric.abrv, fabric.ext);
			formattedFabrics.push(fabric);
		}
	});
	return formattedFabrics;
}

var responseFormatter = {

	makes: function(makes) {
		var makesArray = [];
		_.each(makes, function(make) {
			makesArray.push(make.make);
		});
		return makesArray.sort();
	},

	format: function(dataModel, data) {
		return responseFormatter[dataModel](data);
	}
};

module.exports = {

	getModels: function(options, fn) {
		if (options.make === undefined || options.year === undefined) {
			fn({
				error: 'Error: missing required options: make, model'
			}, null);
		}

		var connection = createConnection();
		connection.connect();
		connection.query(util.format('SELECT DISTINCT model FROM custom_covers WHERE make = "%s" AND year = "%d" ORDER BY model', options.make, options.year), function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	/**
	 * Get the subs for the current make, model, and year
	 * @param  {Object}   options The query options
	 * @param  {Function} fn      Callback
	 */
	getSubs: function(options, fn) {
		if (options.make === undefined || options.model === undefined || options.year === undefined) {
			fn({
				error: 'Error: missing required options: make | model | year'
			}, null);
			return;
		}
		var connection = createConnection();
		connection.connect();

		connection.query(util.format('select distinct details, id from custom_covers where make = "%s" AND year = %d AND model = "%s" ORDER BY details', options.make, options.year, options.model), function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	/**
	 * Get all distinct makes from the car cover db
	 * @param  {Function} fn Callback
	 */
	getAllMakes: function(fn) {
		var connection = createConnection();
		connection.connect();

		connection.query('SELECT DISTINCT make FROM custom_covers ORDER BY make', function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	getMakesByYear: function(options, fn) {
		if (options.year === undefined) {
			fn({
				error: 'Error: missing required option: year'
			}, null);
			return;
		}
		var connection = createConnection();
		connection.connect();

		connection.query(util.format('select distinct make from custom_covers where year = "%d"', options.year), function(err, rows) {
			fn(err, responseFormatter.format('makes', rows));
		});
		connection.end();
	},

	getAllYears: function(fn) {
		var connection = createConnection();
		connection.connect();

		connection.query('select distinct year from custom_covers order by year', function(err, rows) {
			fn(err, flattenYears(rows));
		});
		connection.end();
	},

	/**
	 * Get distinct models of car for the given make
	 * @param  {Object}   data An object containing a make attribute
	 * @param  {Function} fn   Callback
	 */
	getModelsForMake: function(data, fn) {
		var connection = createConnection(),
			sql;
		connection.connect();

		sql = mysql.format('SELECT DISTINCT ?? FROM ?? WHERE make = ? ORDER BY year ASC', ['year', 'custom_covers', data.make]);

		connection.query(sql, function(err, rows) {
			fn(err, flattenYears(rows));
		});
		connection.end();
	},

	getCoversByAutoId: function(data, fn) {
		if (data.autoId === undefined) {
			fn({
				error: 'Missing needed value for query: autoId'
			}, null);
		}
		var connection = createConnection(),
			sql;
		connection.connect();


		sql = mysql.format('SELECT * FROM ?? WHERE ?? = ? ORDER BY ??', ['custom_covers', 'id', data.autoId, 'part']);



		connection.query(sql, function(err, covers) {
			if (err) {
				return fn(err);
			} else if (covers.length !== 1) {
				return fn(null, []);
			}

			sql = mysql.format('SELECT * FROM ?? WHERE size = ? AND abrv != ?', ['cfccprices', covers[0].size, 'ff']);

			connection.query(sql, function(error, fabrics) {
				if (error) {
					fn(error);
					return;
				}

				fabrics = formatFabricsArray(fabrics);

				_.each(covers, function(cover) {
					cover.fabrics = fabrics;

					// set selected fabric
					if (data.fabric) {
						cover.selectedFabric = _.findWhere(fabrics, {
							ext: data.fabric.toUpperCase()
						});
					}
				});

				fn(null, covers);
			});

			connection.end();
		});
	},

	getCoversByAutoIdWithPricing: function(data, fn) {
		if (data.autoId === undefined) {
			fn({
				error: 'Missing needed value for query: autoId'
			}, null);
			return;
		}
		
		var connection = createConnection();
		connection.connect();

		// Modified query to get the original grouped extensions
		var sql = mysql.format(`
			SELECT 
				cc.*,
				f.name,
				f.abrv,
				f.ext,
				f.colors,
				f.description,
				f.warranty,
				f.type,
				f.section,
				f.retail as original_retail,
				f.jobber as original_jobber,
				f.rushManufacture,
				-- Check if we have exact match pricing
				cp_exact.jobber as exact_jobber,
				cp_exact.retail as exact_retail,
				cp_exact.map as exact_map,
				cp_exact.upc as exact_upc,
				-- Check if we have grouped pricing (using first extension)
				cp_grouped.jobber as grouped_jobber,
				cp_grouped.retail as grouped_retail,
				cp_grouped.map as grouped_map,
				cp_grouped.upc as grouped_upc,
				CASE 
					WHEN cp_exact.part_number IS NOT NULL THEN 'covercraft_pricing_exact'
					WHEN cp_grouped.part_number IS NOT NULL THEN 'covercraft_pricing_grouped'
					ELSE 'cfccprices'
				END as pricing_source
			FROM custom_covers cc
			JOIN cfccprices f ON f.size = cc.size AND f.abrv != 'ff'
			LEFT JOIN covercraft_pricing cp_exact ON cp_exact.part_number = CONCAT(cc.part, f.ext)
			LEFT JOIN covercraft_pricing cp_grouped ON cp_grouped.part_number = CONCAT(cc.part, SUBSTRING_INDEX(f.ext, '.', 1))
			WHERE cc.id = ?
			ORDER BY f.name
		`, [data.autoId]);

		connection.query(sql, function(err, rows) {
			connection.end();
			
			if (err) {
				return fn(err);
			}
			
			if (rows.length === 0) {
				return fn(null, []);
			}

			// Group the results
			var cover = {
				id: rows[0].id,
				part: rows[0].part,
				year: rows[0].year,
				make: rows[0].make,
				model: rows[0].model,
				submodel: rows[0].submodel,
				notes: rows[0].notes,
				size: rows[0].size,
				details: rows[0].details,
				slug: rows[0].slug,
				fabrics: []
			};

			// Process fabrics - keep original grouped structure
			rows.forEach(function(row) {
				var fabric = {
					name: row.name,
					abrv: row.abrv,
					ext: row.ext, // Keep original grouped extension like "D1.D4.D6"
					colors: row.colors,
					description: row.description,
					warranty: row.warranty,
					type: row.type,
					section: row.section,
					rushManufacture: row.rushManufacture === 1,
					pricing_source: row.pricing_source
				};

				// Determine which pricing to use
				if (row.pricing_source === 'covercraft_pricing_exact') {
					fabric.jobber = row.exact_jobber;
					fabric.retail = row.exact_retail;
					fabric.map = row.exact_map;
					fabric.upc = row.exact_upc;
				} else if (row.pricing_source === 'covercraft_pricing_grouped') {
					fabric.jobber = row.grouped_jobber;
					fabric.retail = row.grouped_retail;
					fabric.map = row.grouped_map;
					fabric.upc = row.grouped_upc;
				} else {
					fabric.jobber = row.original_jobber;
					fabric.retail = row.original_retail;
					fabric.map = null;
					fabric.upc = null;
				}

				cover.fabrics.push(fabric);
			});

			// Now format fabrics array (this will split grouped extensions properly)
			cover.fabrics = formatFabricsArray(cover.fabrics);

			// Set selected fabric
			if (data.fabric) {
				cover.selectedFabric = _.findWhere(cover.fabrics, {
					ext: data.fabric.toUpperCase()
				});
			}

			fn(null, [cover]);
		});
	},

	getFabricsInfo: function(data, fn) {

		var connection = createConnection(),
			sql;
		connection.connect();

		if (data.isFormFit) {
			sql = util.format('SELECT name, abrv, colors, ext, description, warranty, type, jobber FROM cfccprices WHERE size = "%s" ORDER BY name', data.size);
		} else {
			sql = util.format('SELECT name, abrv, colors, ext, description, warranty, type, jobber FROM cfccprices WHERE size = "%s" AND abrv != "ff" ORDER BY name', data.size);
		}
		connection.query(sql, function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	/**
	 * Get information for a given cover based on size and abrv
	 * @param {Object}   data The options for this call
	 * @param {Function} fn   The callback
	 */
	getCoverInfo: function(data, fn) {
		if (data.size === undefined || (data.abrv === undefined && data.ext === undefined)) {
			fn({
				type: 'error',
				message: 'Missing needed value for query: size, ext, or abrv'
			});
		}

		var sql;
		if (data.ext === undefined) {
			sql = util.format('SELECT name, colors, ext, abrv, description, warranty, type, section, jobber, retail FROM cfccprices WHERE size = "%s" AND abrv = "%s"', data.size, data.abrv);
		} else {
			sql = util.format('SELECT name, colors, ext, abrv, description, warranty, type, section, jobber, retail FROM cfccprices WHERE size = "%s" AND ext LIKE "%%%s%"', data.size, data.ext);
		}

		var connection = createConnection();
		connection.connect();

		connection.query(sql, function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	/**
	 * Get the subs for the current make, model, and year
	 * @param  {Object}   options The query options
	 * @param  {Function} fn      Callback
	 */
	findMatch: function(options, fn) {
		if (options.make === undefined || options.model === undefined || options.year === undefined || options.details === undefined) {
			return fn(null, []);
		}
		var connection = createConnection(),
			sql;
		connection.connect();

		sql = mysql.format(
			'SELECT * FROM ?? WHERE make = ? AND year = ? AND model = ? AND details = ? ORDER BY details', ['custom_covers', options.make, options.year, options.model, options.details]
		);
		connection.query(sql, function(err, rows) {
			fn(err, rows);
		});
		connection.end();
	},

	/**
	 * Find a cover by its part number
	 * @param  {string}   partNum The part number to return
	 * @param  {Function} fn      Callback
	 */
	findByPartNum: function(partNum, fn) {
		if (partNum === undefined) {
			return fn(null, []);
		}
		var connection = createConnection(),
			sql;
		connection.connect();
		sql = mysql.format('SELECT * FROM  `cfcc` JOIN cfccprices ON cfccprices.size = cfcc.size JOIN custom_covers on custom_covers.size = cfcc.size WHERE cfcc.part = ? group by ext', [partNum]);
		connection.query(sql, function(err, rows) {
			connection.end();
			fn(err, rows);
		});
	},

	/**
	 * Get auto IDs by Cover's part number
	 * @param  {string}   partNum The part number to return
	 * @param  {Function} fn      Callback
	 */
	getAutoIdByCoverId: function(coverId, fn) {
		if (coverId === undefined) {
			return fn(null, []);
		}
		var connection = createConnection(),
			sql;
		connection.connect();
		sql = mysql.format('select * from custom_covers where part = ?', [coverId]);
		connection.query(sql, function(err, rows) {
			connection.end();
			fn(err, rows);
		});

	},

	/**
	 * Get individual fabric pricing for color selection pages
	 * @param  {Object}   data Contains autoId, abrv, part
	 * @param  {Function} fn   Callback
	 */
	getIndividualFabricPricing: function(data, fn) {
		if (!data.autoId || !data.abrv || !data.part) {
			return fn(new Error('Missing required parameters'), null);
		}

		var connection = createConnection();
		connection.connect();

		// Single optimized query
		var sql = mysql.format(`
			SELECT 
				f.*,
				COALESCE(cp.jobber, f.jobber) as final_jobber,
				COALESCE(cp.retail, f.retail) as final_retail,
				cp.map as final_map,
				cp.upc as final_upc,
				CASE 
					WHEN cp.part_number IS NOT NULL THEN 'covercraft_pricing'
					ELSE 'cfccprices'
				END as pricing_source
			FROM cfccprices f
			LEFT JOIN covercraft_pricing cp ON cp.part_number = CONCAT(?, SUBSTRING_INDEX(f.ext, '.', 1))
			WHERE f.abrv = ?
		`, [data.part, data.abrv]);
		
		connection.query(sql, function(err, rows) {
			connection.end();
			
			if (err) {
				return fn(err, null);
			}

			if (rows.length === 0) {
				return fn(null, []);
			}

			var baseFabric = rows[0];
			var extensions = baseFabric.ext.split('.');
			var colors = baseFabric.colors.split('.');
			var fabrics = [];

			extensions.forEach(function(ext, index) {
				fabrics.push({
					name: baseFabric.name,
					abrv: baseFabric.abrv,
					description: baseFabric.description,
					warranty: baseFabric.warranty,
					type: baseFabric.type,
					section: baseFabric.section,
					color: colors[index] || colors[0],
					ext: ext,
					jobber: baseFabric.final_jobber,
					retail: baseFabric.final_retail,
					map: baseFabric.final_map,
					upc: baseFabric.final_upc,
					pricing_source: baseFabric.pricing_source
				});
			});

			fn(null, fabrics);
		});
	},

};
