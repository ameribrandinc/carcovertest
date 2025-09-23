// COVERCRAFT SOAP API IS DOWN!!! 08/21/2024
//-> (1) !!!!!!! Commented out 08/21/2024 !!!!!!!<-

/* var soap = require('soap'), 
	logger = require('../lib/logger'),
	env = require('../../config/env'); */

//-> (/1) !!!!!!! Commented out 08/21/2024 !!!!!!!<-

/**
 * Create the connection to the SOAP web service and pass in the next (callback) function
 * @param {Function} next The next function to call (callback)
 */

// COVERCRAFT SOAP API IS DOWN!!!
// (2) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

/* function connect(next) {
	var url = env.covercraft.rootUrl + 'ccws1.asmx?wsdl';
	soap.createClient(url, function(err, client) {

		// set up the web service security
		// TODO: move this header to a dust template
		client.addSoapHeader(
			'<Authentication xmlns="http://216.60.144.111/ccws/">' +
			'<Username>' + env.covercraft.username + '</Username>' +
			'<Password>' + env.covercraft.password + '</Password>' +
			'</Authentication>'
		);

		next(err, client);

	});
} */

// (/2) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

/**
 * The Covercraft service definition
 */


var covercraft = {

	/**
	 * Get Covercraft's stock for the given part number
	 * @param {String} partNumber The part number to check
	 */

// COVERCRAFT SOAP API IS DOWN!!!
// (3) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

	/* getStock: function(partNumber, next) {
		connect(function(err, client) {

			// TODO: validate partNumber to be sure it's a string

			// setup check inventory method
			// TODO: move this check inventory to a dust template
			var envelopeBody = '<CheckInventory xmlns="http://216.60.144.111/ccws/"><ir><PartList><Part><PartId>' + partNumber + '</PartId></Part></PartList></ir></CheckInventory>';

			client.CheckInventory(envelopeBody, function(err, result) {
				var quantity,
					error = null;
				// TODO: find more efficient way to do this than a try catch
				try {
					if (result.CheckInventoryResult.diffgram.GetInventory.Inventory.Status !== 'Success') {
						logger.noticeError('Unsuccessful status for Covercraft API call', {
							custom: result.CheckInventoryResult
						});
						quantity = null;
					} else {
						quantity = result.CheckInventoryResult.diffgram.GetInventory.Inventory.Qty;
					}
				} catch (quantityError) {
					// log the error
					logger.noticeError(quantityError, {
						custom: result.CheckInventoryResult
					});
					error = quantityError;
				}
				next(error, quantity);
			});
		});
	} */

// (/3) ->!!!!!!! Commented out 08/21/2024 !!!!!!!<-

};

/**
 * Expose the Covercraft service
 */
module.exports = covercraft;
