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
		_.each(properties, function() {
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
			var subModels = response.data.vehicleOptions.subModels;
			if (self.changed.model && subModels && subModels.length === 1) {
				self.set('autoId', subModels[0].id.toString());
			}
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
