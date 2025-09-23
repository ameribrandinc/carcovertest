var env = require('../../config/env'),
	mysql = require('mysql'),
	logger = require('../lib/logger');

function createConnection() {
	return mysql.createConnection({
		host: env.db.host,
		user: env.db.user,
		password: env.db.password,
		database: env.db.name
	});
}

module.exports = {

	getP1Status: function(fn) {
		var connection = createConnection();
		connection.connect();
		connection.query('SELECT value, description, price FROM console WHERE name = "p1_status"', function(error, rows) {
			connection.end();
			if (error) {
				logger.error(error);
				return fn(error);
			}
			fn(null, rows);
		});
	}
};
