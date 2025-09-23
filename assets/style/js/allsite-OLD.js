// AllSite Variables //
var url = window.location.href;
var title = window.document.title;
var desc = "";

// Dropdown Menu - Enhance CSS Layout
function dropdown(dropdownId, hoverClass, mouseOffDelay) {
	if (dropdown = window.document.getElementById(dropdownId)) {
		var listItems = dropdown.getElementsByTagName('li');
		var links = dropdown.getElementsByTagName('a');

		for (var i = 0; i < listItems.length; i++) {
			listItems[i].onmouseover = function() {
				this.className = addClass(this);
			};
			listItems[i].onmouseout = function() {
				var that = this;
				setTimeout(function() {
					that.className = removeClass(that);
				}, mouseOffDelay);
				this.className = that.className;
			};
			listItems[i].onclick = function() {
				this.className = removeClass(this);
			};

			if (links[i] == url) {
				listItems[i].className += ' thisPage';
				listItems[i].parentNode.parentNode.className += ' thisPage';
				listItems[i].parentNode.parentNode.parentNode.parentNode.className += ' thisPage';
			}
		}
	}

	function addClass(li) {
		return li.className + ' ' + hoverClass;
	}

	function removeClass(li) {
		return li.className.replace(hoverClass, "");
	}
}
dropdown('nav', 'sfhover', 250);

