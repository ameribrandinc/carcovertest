var controllers = require('../controllers');
var fabricController = require('../controllers/fabric');
var companyController = require('../controllers/company');
var coversController = require('../controllers/covers');
var mainController = require('../controllers/main');
var checkoutController = require('../controllers/checkout');
var legacyRoutes = require('./legacy');

module.exports.register = function(app) {

	/**
	 * Home
	 */
	app.get('/', controllers.home.index);

	/**
	 * Checkout
	 */
	app.get('/headers/cart/grommet.php', checkoutController.grommet);
	app.get('/headers/cart/cart-ship-christmas.htm', checkoutController.standardShipping);
	app.get('/headers/cart/cart-p1.htm', checkoutController.shipP1);
	app.get('/headers/cart/sales.htm', checkoutController.sales);
	app.get('/headers/cart/cart-ship.htm', checkoutController.ship);

	/**
	 * Limo
	 */
	app.get('/catalog/limoFabs.php', controllers.limo.fabrics);
	app.get('/catalog/limoAntenna.php', controllers.limo.antenna);
	app.get('/catalog/limoLength.php', controllers.limo['length']);
	app.get('/catalog/limoModel.php', controllers.limo.model);
	app.get('/catalog/limoYear.php', controllers.limo.year);
	app.get('/catalog/limoColors.php', controllers.limo.colors);
	app.get('/catalog/limoResults.php', controllers.limo.results);
	app.get('/limo/make.php', controllers.limo.make);
	// these last four are the same
	// didn't have time to figure out optional index.php in route
	// TODO: remove this once the whole site has been moved over to node
	app.get('/limo', controllers.limo.index);
	app.get('/limo/index.php', controllers.limo.index);
	app.get('/limo/measuring', controllers.limo.measuring);
	app.get('/limo/measuring/index.php', controllers.limo.measuring);

	/**
	 * Company
	 */
	app.get('/company/crew.php', companyController.crew);
	app.get('/company/FAQs.php', companyController.faqs);
	app.get('/company/history.php', companyController.history);
	app.get('/company/policy.php', companyController.policy);
	app.get('/company/leadtimes.php', companyController.leadtimes);
	app.get('/company/made-in-usa.php', companyController.madeInUSA);
	// these last two are the same
	// didn't have time to figure out optional index.php in route
	// TODO: remove this once the whole site has been moved over to node
	app.get('/company/index.php', companyController.index);
	app.get('/company', companyController.index);
	app.get('/company/shipping.php', companyController.shipping);
	app.get('/company/giving.php', companyController.giving);
	app.get('/company/contact', companyController.contact);
	app.get('/company/contact/index.php', companyController.contact);
	app.get('/company/sitemap.php', companyController.sitemap);

	/**
	 * Catalog
	 */
	app.get('/catalog/cfccColors.php', controllers.catalog.cfccColors);
	app.get('/catalog/cfccFabs.php', controllers.catalog.cfccFabs);
	app.get('/catalog/cfccSub.php', controllers.catalog.cfccSub);
	app.get('/catalog/cfccModel.php', controllers.catalog.cfccModel);
	app.get('/catalog/cfccYear.php', controllers.catalog.cfccYear);
	app.get('/catalog/cfcc.php', controllers.catalog.cfcc);
	app.get('/catalog/multicolor-wsHP.php', controllers.catalog.multiColor);
	app.get('/catalog/cfccWindow.php', controllers.catalog.cfccWindow);
	app.get('/:slug/p:id([0-9]+)', controllers.catalog.product);
	app.get('/catalog', controllers.catalog.index);

	/**
	 * Covers
	 */
	app.get('/covers/coversearch.php', coversController.coversearch);
	// these last two are the same
	// didn't have time to figure out optional index.php in route
	// TODO: remove this once the whole site has been moved over to node
	app.get('/covers', coversController.index);
	app.get('/covers/index.php', coversController.index);
	app.get('/covers/cover_care', coversController.coverCare);
	app.get('/covers/cover_care/index.php', coversController.coverCare);
	app.get('/covers/FAQ.php', coversController.faq);
	app.get('/covers/sales.php', coversController.sales);
	app.get('/covers/specialprojects.php', coversController.specialProjects);
	app.get('/covers/p1_covers.php', coversController.p1Covers);
	app.get('/covers/carmodifications.php', coversController.carModifications);
	app.get('/covers/accessories.php', coversController.accessories);
	app.get('/covers/acc-grommet.php', coversController.grommet);
	app.get('/covers/acc-bag.php', coversController.bag);
	app.get('/covers/acc-lockandcable.php', coversController.lockAndCable);
	app.get('/covers/how-to-order.php', coversController.howToOrder);
	app.get('/covers/indoor_fabrics.php', coversController.indoorFabrics);
	app.get('/covers/outdoor_fabrics.php', coversController.outdoorFabrics);
	app.get('/covers/warranty.php', coversController.warranty);
	app.get('/covers/bonus_item', coversController.bonusItem);
	app.get('/covers/searchbypart', coversController.searchbypart);

	/**
	 * Covercraft
	 */
	app.get('/covercraft/policy.php', controllers.covercraft.policy);

	/**
	 * Fabrics
	 */
	app.get('/fabric/guide', fabricController.guide);
	app.get('/covers/fabric/reflectect.php', fabricController.reflectect);
	app.get('/covers/fabric/ultratect.php', fabricController.ultratect);
	app.get('/covers/fabric/sunbrella.php', fabricController.sunbrella);
	app.get('/covers/fabric/weathershield.php', fabricController.weathershield);
	app.get('/covers/fabric/weathershieldHD.php', fabricController.weathershieldHD);
	app.get('/covers/fabric/ourfabrics.php', fabricController.ourFabrics);
	app.get('/covers/fabric', fabricController.index);
	app.get('/covers/fabric/index.php', fabricController.index);

	app.get('/window', controllers.window.index);
	app.get('/window/index.php', controllers.window.index);

	/**
	 * Main
	 */
	app.get('/main/definitions.php', mainController.definitions);

	/**
	 * API Endpoints
	 */
	app.get('/api/vehicle-selector.php', controllers.api.vehicleSelector);

	/**
	 * Error page
	 */
	app.get('/page-not-covered', controllers.errors.notfound);

	legacyRoutes.register(app);

};
