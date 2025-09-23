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
