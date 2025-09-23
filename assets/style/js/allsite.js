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

// Lightbox script
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
// end Lightbox script
