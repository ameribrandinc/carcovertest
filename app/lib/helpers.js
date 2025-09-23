var utils = require('./utils');

module.exports = function(dust) {

	dust.helpers.currentYear = function(chunk) {
		var date = new Date();
		return chunk.write(date.getFullYear());
	};

	dust.helpers.capitalize = function(chunk, context, bodies, params) {
		return chunk.write(utils.string.capitalize(params.value));
	};
};
