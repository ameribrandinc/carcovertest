function get_cookie(cookie_name) {
	var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

	if (results)
		return (unescape(results[2]));
	else
		return null;
}

function delete_cookie(cookie_name) {
	var cookie_date = new Date(); // current date & time
	cookie_date.setTime(cookie_date.getTime() - 1);
	document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

function decode(str) {
	try {
		return unescape(str.replace(/\+/g, " "));
	} catch (err) {
		// not quite sure what to do if it fails...
	}
}

var DN = "https://carcovers.org/";
var vehicleInfo = "<span>(no vehicle selected)</span>";
var showtab = "<img src='" + DN + "pics/headers/infotab-show.gif' alt='Show Vehicle Info tab' />";
var hidetab = "<img src='" + DN + "pics/headers/infotab-hide.gif' alt='Hide Vehicle Info tab' />";
var autoMake = decode(get_cookie("TJCmake"));
var autoYear = get_cookie("TJCyear");
var autoModel = decode(get_cookie("TJCmodel"));
var autoSubmodel = decode(get_cookie("TJCsubmodel"));

var action = get_cookie("actionSH");


function vehicleSelection(step) {
	if (step == 'premakestep') {
		if (action == 1) {
			window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
			window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
		} else {
			window.document.getElementById('vehicleInfo').innerHTML = "";
			window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
		}
	} else if (step == 'makestep') {
		vehicleInfo = "<span><b>Make:</b> " + decode(autoMake) + " &nbsp; (<a href='" + DN + "catalog/cfcc.php'>start over</a>)</span>";
		if (action == 1) {
			window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
			window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
		} else {
			window.document.getElementById('vehicleInfo').innerHTML = "";
			window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
		}
	} else if (step == 'yearstep') {
		vehicleInfo = "<span><b>Make:</b> " + autoMake + ",  <b>Year:</b> " + autoYear + " &nbsp; (<a href='" + DN + "catalog/cfcc.php'>start over</a>)</span>";
		if (action == 1) {
			window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
			window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
		} else {
			window.document.getElementById('vehicleInfo').innerHTML = "";
			window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
		}
	} else if (step == 'modelstep') {
		vehicleInfo = "<span><b>Make:</b> " + autoMake + ",  <b>Year:</b> " + autoYear + ",  <b>Model:</b> " + autoModel + " &nbsp; (<a href='" + DN + "catalog/cfcc.php'>start over</a>)</span>";
		if (action == 1) {
			window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
			window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
		} else {
			window.document.getElementById('vehicleInfo').innerHTML = "";
			window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
		}
	} else if (step == 'submodelstep') {
		vehicleInfo = "<span><b>Make:</b> " + autoMake + ",  <b>Year:</b> " + autoYear + ",  <b>Model:</b> " + autoModel + ",  <b>Submodel:</b> " + autoSubmodel + " &nbsp; (<a href='" + DN + "catalog/cfcc.php'>start over</a>)</span>";
		if (action == 1) {
			window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
			window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
		} else {
			window.document.getElementById('vehicleInfo').innerHTML = "";
			window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
		}
	}
}

function showhide() {

	if (action == 0) {
		delete_cookie("actionSH");
		document.cookie = "actionSH=1";
		action = 1;
	} else {
		delete_cookie("actionSH");
		document.cookie = "actionSH=0";
		action = 0;
	}

	if (action == 1) {
		window.document.getElementById('vehicleInfo').innerHTML = vehicleInfo;
		window.document.getElementById('vehicleInfoTab').innerHTML = hidetab;
	} else {
		window.document.getElementById('vehicleInfo').innerHTML = "";
		window.document.getElementById('vehicleInfoTab').innerHTML = showtab;
	}


}
