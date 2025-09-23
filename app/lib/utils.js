var utils = {

	slugify: function(str) {
		return str
			.toLowerCase()
			.replace(/ +/g, '-')
			.replace('/', '-')
			.replace(/[^-\w]/g, '');
	},

	string: {

		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		}

	},

	getColorCodeByColor: function(color) {
		var code;
		switch (color.replace(' ', '')) {
			case 'SkyBlue':
				code = 'pl';
				break;
			case 'BrightBlue':
				code = 'pa';
				break;
			case 'Gray':
				code = 'pg';
				break;
			case 'Green':
				code = 'pn';
				break;
			case 'Red':
				code = 'pr';
				break;
			case 'Taupe':
				code = 'pt';
				break;
			case 'Yellow':
				code = 'py';
				break;
			case 'Black':
				code = 'pb';
				break;
		}
		return code;
	}
};

module.exports = utils;
