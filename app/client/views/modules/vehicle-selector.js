/* global Backbone */

var VehicleSelectorModel = require('../../models/modules/vehicle-selector');

var VehicleSelector = Backbone.View.extend({

	_navigateToFabric: function() {
		var autoId = this.model.get('autoId'),
			year = this.model.get('year');
		window.ga('send', 'event', 'vehicle selector', 'navigate to fabric', autoId + ':' + year);
		window.location.href = '/catalog/cfccFabs.php?year=' + year + '&autoID=' + autoId;
	},

	_updateView: function(event) {
		var target = event.target;
		window.ga('send', 'event', 'vehicle selector', 'selection made', target.name, target.value);
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
