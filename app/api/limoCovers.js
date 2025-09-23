var env = require('../../config/env'),
	mysql = require('mysql'),
	util = require('util');

function createConnection() {
	return mysql.createConnection({
		host: env.db.host,
		user: env.db.user,
		password: env.db.password,
		database: env.db.name
	});
}

module.exports = {

	getLimoYearsByMake: function(options, fn) {
		if (options.make === undefined) {
			fn({
				error: 'Error: missing required options: make'
			}, null);
		} else {

			var connection = createConnection();
			connection.connect();
			connection.query(util.format('SELECT DISTINCT year1, year2 FROM limo WHERE make = "%s"', options.make), function(err, rows) {
				connection.end();
				fn(err, rows);
			});
		}
	},

	getLimoModelsByYearAndMake: function(options, fn) {

		if (options.make === undefined || options.year === undefined) {
			fn({
				error: 'Error: missing required options: make or year'
			}, null);
		} else {

			var connection = createConnection();
			connection.connect();
			connection.query(util.format('SELECT DISTINCT model, notes FROM limo WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d"', options.make, options.year, options.year), function(err, rows) {
				connection.end();
				fn(err, rows);
			});
		}
	},

	getLengthOptions: function(data, fn) {

		if (data.make === undefined || data.year === undefined || data.model === undefined) {
			fn({
				type: 'error',
				message: 'Missing needed value for query: make, model, or year'
			});
		}
		var sql = util.format('SELECT DISTINCT stretch, length FROM limo WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d" AND model = "%s"', data.make, data.year, data.year, data.model);
		var connection = createConnection();
		connection.connect();

		connection.query(sql, function(err, rows) {
			connection.end();
			fn(err, rows);
		});
	},

	getAntennaOptions: function(data, fn) {
		if (data.make === undefined || data.year === undefined || data.model === undefined || data.length === undefined) {
			fn({
				type: 'error',
				message: 'Missing needed value for query: make, model, year or length'
			});
		}
		var sql = util.format('SELECT DISTINCT antenna FROM limo WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d" AND model = "%s" AND length = "%d"', data.make, data.year, data.year, data.model, data.length);
		var connection = createConnection();
		connection.connect();

		connection.query(sql, function(err, rows) {
			connection.end();
			fn(err, rows);
		});
	},

	getLimoLength: function(options, fn) {

		if (options.make === undefined || options.year === undefined || options.model === undefined) {
			fn({
				error: 'Error: missing required options: make or year or model'
			}, null);
		} else {

			var connection = createConnection();
			connection.connect();
			connection.query('', function(err, rows) {
				connection.end();
				fn(err, rows);
			});
		}
	},

	getLimoColors: function(options, callback) {

		if (!options.size || !options.abrv) {
			callback('Error: missing required options: size or abrv');
			return;
		}

		var sql = util.format('SELECT name, colors, ext, description, warranty, type, jobber, size, abrv FROM cfccprices WHERE size = "%s" AND abrv = "%s"', options.size, options.abrv);

		var connection = createConnection();
		connection.connect();
		connection.query(sql, function(error, rows) {
			if (error) {
				callback(error);
				return;
			}
			callback(null, rows);
		});
	},

	getLimoFabs: function(options, fn) {

		if (
			options.make === undefined ||
			options.year === undefined ||
			options.length === undefined ||
			options.antenna === undefined ||
			options.model === undefined
		) {
			fn({
				error: 'Error: missing required options: make or year or model or length or antenna'
			}, null);
		} else {

			var sql = util.format('SELECT DISTINCT size, part FROM limo WHERE make = "%s" AND year1 <= "%d" AND year2 >= "%d" AND model = "%s" AND length = "%d" AND antenna = "%s"', options.make, options.year, options.year, options.model, options.length, options.antenna);

			var connection = createConnection();
			connection.connect();
			connection.query(sql, function(err, covers) {
				if (err || covers.length === 0) {
					connection.end();
					fn(err, covers);
				} else {
					sql = util.format('SELECT name, abrv, colors, ext, description, warranty, type, section, size, jobber FROM cfccprices WHERE size = "%s" AND abrv != "ff"', covers[0].size);
					connection.query(sql, function(error, fabrics) {

						fabrics.forEach(function(fabric) {
							fabric.part = covers[0].part;
						});
						connection.end();
						fn(error, fabrics);
					});
				}
			});
		}
	},

	getLimoBySizeAndAbbreviation: function(options, next) {
		if (!options.size || !options.abrv) {
			return next('Error: missing required options: size or abrv');
		}

		var sql = util.format('SELECT * FROM cfccprices WHERE size = "%s" AND abrv = "%s"', options.size, options.abrv);

		var connection = createConnection();
		connection.connect();
		connection.query(sql, function(error, rows) {
			if (error) {
				return next(error);
			}
			next(undefined, rows);
		});
	},

	getLimoBySizeAndExt: function(options, next) {
		if (!options.size || !options.ext) {
			return next('Error: missing required options: size or ext');
		}

		var sql = util.format('SELECT * FROM cfccprices WHERE size = "%s" AND ext like "%%%s%%"', options.size, options.ext);

		var connection = createConnection();
		connection.connect();
		connection.query(sql, function(error, rows) {
			if (error) {
				return next(error);
			}
			next(undefined, rows);
		});
	},



};
