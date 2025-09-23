var newrelic = require('newrelic'),
	_ = require('underscore'),
	api = require('../api');

function renderVehicleSelector(res, data) {
	res.render('partials/vehicle_selector', data, function(error, markup) {
		res.json({
			data: data,
			markup: markup
		});
	});

}

module.exports = {

	vehicleSelector: function(req, res) {
		newrelic.setControllerName('api.vehicle-selector');

		var query = req.query,
			year = query.year,
			make = query.make,
			model = query.model,
			autoId = query.autoid,
			data = {
				vehicleOptions: {
					selections: {},
					status: 'incomplete'
				}
			};

		api.customCovers.getAllYears(function(error, years) {
			data.vehicleOptions.years = years;

			if (!year) {
				renderVehicleSelector(res, data);
			} else {

				data.vehicleOptions.selections.year = year;

				api.customCovers.getMakesByYear({
					year: year
				}, function(error, makes) {

					data.vehicleOptions.makes = makes;

					if (!make) {
						renderVehicleSelector(res, data);
					} else {

						data.vehicleOptions.selections.make = make;
						api.customCovers.getModels({
							year: year,
							make: make
						}, function(error, models) {
							var modelsArray = [];
							_.each(models, function(singleModel) {
								modelsArray.push(singleModel.model);
							});
							data.vehicleOptions.models = modelsArray;

							if (!model) {
								renderVehicleSelector(res, data);
							} else {
								data.vehicleOptions.selections.model = model;
								api.customCovers.getSubs({
									year: year,
									make: make,
									model: model
								}, function(error, subModels) {

									data.vehicleOptions.subModels = subModels;
									// if there's only one submodel make the selection for them
									if (autoId || subModels.length === 1) {
										if (!autoId) {
											autoId = subModels[0].id.toString();
										}
										data.vehicleOptions.selections.autoId = autoId;
										data.vehicleOptions.status = 'complete';
									}
									renderVehicleSelector(res, data);
								});
							}
						});
					}
				});
			}
		});
	}
};
