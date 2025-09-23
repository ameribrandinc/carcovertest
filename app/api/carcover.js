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

function getEveryPossibleYearFromRange(row) {
	var yearArray = [];
	// TODO: checkout the flattening that happens in the year controller action for this code.
	_.each(row, function(years) {
		if (years.year1 !== years.year2) {
			yearArray.push(_.range(years.year1, years.year2 + 1));
		} else {
			yearArray.push(years.year1);
		}
	});

	yearArray = _.uniq(_.flatten(yearArray)).sort().reverse();

	return yearArray;
}

function formatFabricsArray(fabrics) {
	var formattedFabrics = [];
	_.each(fabrics, function(currentFabric) {
		var fabric = _.clone(currentFabric);

		if (_.contains(fabric.ext, '.')) {
			var fabricsInRow = fabric.ext.split('.');

			_.each(fabricsInRow, function(ext, index) {
				formattedFabrics.push(_.extend(_.clone(currentFabric), {
					ext: ext,
					colors: fabric.colors.split('.')[index],
					retail: _.contains(fabric.retail, ';') ? fabric.retail.split(';')[index] : fabric.retail,
					jobber: _.contains(fabric.jobber, ';') ? fabric.jobber.split(';')[index] : fabric.jobber,
					rushManufacture: fabric.rushManufacture === 1
				}));
			});
		} else {
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
		return makesArray;
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
		connection.query(util.format('SELECT DISTINCT model FROM cfcc WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d" ORDER BY model', options.make, options.year, options.year), function(err, rows) {
			connection.end();
			fn(err, rows);
		});
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

		connection.query(util.format('SELECT DISTINCT details,id FROM cfcc WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d" AND model = "%s" ORDER BY details', options.make, options.year, options.year, options.model), function(err, rows) {
			connection.end();
			fn(err, rows);
		});
	},

	/**
	 * Get all distinct makes from the car cover db
	 * @param  {Function} fn Callback
	 */
	getAllMakes: function(fn) {
		var connection = createConnection();
		connection.connect();

		connection.query('SELECT DISTINCT make FROM cfcc ORDER BY make', function(err, rows) {
			connection.end();
			fn(err, rows);
		});
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

		connection.query(util.format('select distinct make from cfcc where year1 <= "%d" and year2 >= "%d"', options.year, options.year), function(err, rows) {
			connection.end();
			fn(err, responseFormatter.format('makes', rows));
		});
	},

	getAllYears: function(fn) {
		var connection = createConnection();
		connection.connect();

		connection.query('select distinct year1, year2 from cfcc order by year1', function(err, rows) {
			connection.end();
			rows = getEveryPossibleYearFromRange(rows);
			fn(err, rows);
		});
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

		sql = mysql.format('SELECT DISTINCT ??, ?? FROM ?? WHERE make = ? ORDER BY year1 ASC', ['year1', 'year2', 'cfcc', data.make]);

		connection.query(sql, function(err, rows) {
			connection.end();
			fn(err, rows);
		});
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


		sql = mysql.format('SELECT * FROM `cfcc` WHERE `id` = ? ORDER BY `part`', [data.autoId]);

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
				connection.end();

				fabrics = formatFabricsArray(fabrics);

				_.each(covers, function(cover) {
					cover.fabrics = fabrics;
				});

				fn(null, covers);
			});

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
			connection.end();
			fn(err, rows);
		});
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
			connection.end();
			fn(err, rows);
		});
	}

};
