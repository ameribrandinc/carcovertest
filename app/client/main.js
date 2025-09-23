var jquery = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone');

module.exports = {
	'$': jquery,
	'_': _,
	Backbone: Backbone
};

require('./views/modules/site-notifier')();
