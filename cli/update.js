var fs = require('fs'),
	utils = require('../app/lib/utils'),
	util = require('util'),
	mysql = require('mysql'),
	csv = require('csv'),
	async = require('async'),
	_ = require('underscore'),
	chalk = require('chalk'),
	// requiredFields = ['Part Number', 'Year', 'Make', 'Model', 'Submodel', 'Notes', 'A/E/D', 'Size Code'],
	requiredFields = ['Part Number', 'Year', 'Make', 'Model', 'Submodel', 'Notes', 'Size Code'],
	queries = [],
	shouldBeVerbose = false;

function mysqlConnectionManager() {
	var connection = mysql.createConnection({
		host: '127.0.0.1',
		// using root here so that we can run the updates
		user: 'root',
		password: '3E10Pwu8j6480995',
		database: 'tjcars_production'
	});

	return connection;
}

function handleError(message) {
	console.error(chalk.red(message));
	process.exit(1);
}

function verboseLog(message, data) {
	if (shouldBeVerbose) {
		console.log(chalk.magenta(message));
		console.log(util.inspect(data, {
			depth: null,
			colors: true
		}));
	}
}

function getSlugFromRecord(record) {
	return utils.slugify([record.year, record.make, record.model, record.submodel].join('-'));
}

function getDetailsFromRecord(record) {
	return record.submodel + ' - ' + record.notes;
}

function getAdditionSql(record) {
	var columns = [],
		values = [];

	for (var field in record) {
		let value = record[field]
		if(field === 'submodel' || field === 'details' && value.includes("'")) {
			value = value.replace(/'/g, " ");
		}
		columns.push(field);
		values.push(value);
	}
	return 'INSERT INTO `custom_covers_dark` (`' + columns.join('`, `') + '`) VALUES (\'' + values.join('\', \'') + '\')';
}

/* 
function getUpdateSql(record) {
	var qualifiers = [],
		fields = _.pick(record, 'part', 'year', 'make', 'model', 'submodel');
	for (var field in fields) {
		qualifiers.push(field + ' = "' + fields[field] + '"');
	}
	return 'UPDATE `custom_covers_dark` SET notes = "' + record.notes + '", details = "' + getDetailsFromRecord(record) + '" WHERE ' + qualifiers.join(' AND ');
}

function getDeletionSql(record) {
	var qualifiers = [];
	record = _.pick(record, 'part', 'year', 'make', 'model', 'submodel');
	for (var field in record) {
		qualifiers.push(field + ' = "' + record[field] + '"');
	}
	return 'DELETE FROM `custom_covers_dark` WHERE ' + qualifiers.join(' AND ');
}
*/

function normalizeData(data) {
	return data.map(function(record) {
		var newRecord = {};
		for (var field in record) {
			let value = record[field];
			// if (field !== 'A/E/D') {
			switch (field) {
				case 'Part Number':
					newRecord.part = value;
					break;
				case 'Size Code':
					newRecord.size = value;
					break;
				default:
					newRecord[field.toLowerCase()] = value;
			}
			// }
		}
		// newRecord.typeOfChange = record['A/E/D'];
		newRecord.details = getDetailsFromRecord(newRecord);
		newRecord.slug = getSlugFromRecord(newRecord);
		return newRecord;
	});
} 

module.exports = function(cmd) {
	if (!cmd.file) {
		handleError('\n  error: missing option `-f, --file <file>\'\n');
	}
	if (cmd.verbose) {
		shouldBeVerbose = true;
	}

	console.log('Starting the update, this may take a few seconds...');

	var file = fs.readFileSync(cmd.file, {
		encoding: 'utf-8'
	});

	csv.parse(file, {
		columns: true,
		delimiter:'\t'
	}, function(error, data) {
		if (error) {
			handleError(error);
		}

		requiredFields.forEach(function(key) {
			// console.log(key);
			if (data[0][key] === undefined) {
				handleError('Error: column structures do not match expected structure (missing column: ' + key + ').');
			}
		});

		data = normalizeData(data);

		data.forEach(function(row) {
/* 
			var typeOfChange = row.typeOfChange;
			row = _.omit(row, 'typeOfChange');
			switch (typeOfChange) {
				case 'A': 
*/
			queries.push(function(callback) {
				var manager = mysqlConnectionManager();
				manager.connect();
				verboseLog('ADD', row);
				manager.query(getAdditionSql(row), function(error, result) {
					if (error) {
						handleError(error);
					}
					if (result.affectedRows !== 1) {
						handleError('Error: Number of added rows returned was ' + result.affectedRows + ' (expected 1).');
					}
					callback(null);
				});
				manager.end();
			});
/* 
					break;
				case 'E':
					queries.push(function(callback) {
						var manager = mysqlConnectionManager();
						manager.connect();
						verboseLog('UPDATE', row);
						manager.query(getUpdateSql(row), function(error, result) {
							if (error) {
								handleError(error);
							}
							if (result.affectedRows !== 1) {
								handleError('Error: Number of updated rows returned was ' + result.affectedRows + ' (expected 1).');
							}
							callback(null);
						});
						manager.end();
					});
					break;
				case 'D':
					queries.push(function(callback) {
						var manager = mysqlConnectionManager();
						manager.connect();
						verboseLog('DELETE', row);
						manager.query(getDeletionSql(row), function(error, result) {
							if (error) {
								handleError(error);
							}
							if (result.affectedRows !== 1) {
								handleError('Error: Number of deleted rows returned was ' + result.affectedRows + ' (expected 1).');
							}
							callback(null);
						});
						manager.end();
					});
					break;
				default:
					handleError('Missing type of change (addition, edit, or deletion). Contact Brett at Covercraft.');
			} 
*/
		});

		async.series(queries, function(error) {
			if (error) {
				handleError(error);
			}
			console.log(chalk.green('Congratulations, the update was successful. Go have yourself a drink. :)'));
		});

	});

};
