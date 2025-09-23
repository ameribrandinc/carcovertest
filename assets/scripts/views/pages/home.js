(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global Backbone, _ */

var VehicleSelectorModel = Backbone.Model.extend({

	_getUrl: function() {
		var url = '/api/vehicle-selector.php?';
		_.each(this.toJSON(), function(value, key) {
			if (value !== undefined) {
				url += key + '=' + value + '&';
			}
		});
		return url;
	},

	_request: function(callback) {
		$.ajax({
			type: 'get',
			success: callback,
			url: this._getUrl()
		});
	},

	_triggerChangeState: function(state, response) {
		var data = {
			state: state,
			response: response
		};
		this.trigger('change:state', data);
	},

	_getModelResets: function(properties) {
		_.each(properties, function(property) {
			// TODO: simplify code in _handleModelChange
		});
	},

	_handleModelChange: function(model) {
		var self = this,
			changed = model.changed,
			resets;
		if (_.has(changed, 'model')) {
			resets = {
				autoId: undefined
			};
		}
		if (_.has(changed, 'make')) {
			resets = {
				model: undefined,
				autoId: undefined
			};
		}
		if (_.has(changed, 'year')) {
			resets = {
				make: undefined,
				model: undefined,
				autoId: undefined
			};
		}
		self.set(resets, {
			silent: true
		});
		self._triggerChangeState('loading');
		self._request(function(response) {
			self._triggerChangeState('default', response);
		});
	},

	initialize: function() {
		var self = this;
		self.listenTo(self, 'change', self._handleModelChange, self);
	},

	defaults: {
		year: undefined,
		make: undefined,
		model: undefined,
		autoId: undefined
	}

});

module.exports = VehicleSelectorModel;

},{}],2:[function(require,module,exports){
/* global Backbone */

var VehicleSelectorModel = require('../../models/modules/vehicle-selector');

var VehicleSelector = Backbone.View.extend({

	_navigateToFabric: function() {
		var autoId = this.model.get('autoId'),
			year = this.model.get('year');
		window.location.href = '/catalog/cfccFabs.php?year=' + year + '&autoID=' + autoId;
		window.ga('send', 'event', 'vehicle selector', 'navigate to fabric', autoId + ':' + year);
	},

	_updateView: function(event) {
		var target = event.target;
		this.model.set(target.name, target.value);
	},

	initialize: function() {
		var self = this;
		self.model = new VehicleSelectorModel();
		self.listenTo(self.model, 'change:state', self.render, self);
	},

	events: {
		'change select': '_updateView',
		'click #navigate-to-fabric': '_navigateToFabric'
	},

	render: function(event) {
		if (event.state === 'default') {
			this.$el.html(event.response.markup);
		} else if (event.state === 'loading') {
			this.$('select, button').blur().attr('disabled', true);
		}
	}

});

module.exports = VehicleSelector;

},{"../../models/modules/vehicle-selector":1}],3:[function(require,module,exports){
/* global Backbone */

var VehicleSelector = require('../modules/vehicle-selector');

var HomeView = Backbone.View.extend({

	initialize: function() {
		this.children = {
			vehicleSelector: new VehicleSelector({
				el: '#vehicle-selector'
			})
		};
	}

});

new HomeView();

},{"../modules/vehicle-selector":2}]},{},[3])