var cookies = require('../../libs/js.cookie');

module.exports = function() {

	var bannerId = 'freeShipping',
		isNotHidden = cookies.get('siteNotifier-' + bannerId) !== 'hidden';

	if (!$('body').hasClass('banner-notifier-offset') && isNotHidden) {
		setTimeout(function() {
			$('body').addClass('banner-notifier-offset');
			cookies.set('siteNotifier-' + bannerId, 'visible', {
				expires: 31
			});
		}, 1000);
	}

	if (isNotHidden) {
		$('.js-site-notifier-close').on('click', function() {
			$('body').removeClass('banner-notifier-offset');
			cookies.set('siteNotifier-' + bannerId, 'hidden', {
				expires: 31
			});
		});
	}

};
