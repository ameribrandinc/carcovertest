function changeColors() {
	FirstColor = document.DuoToneForm.TopColor.value
	SecondColor = document.DuoToneForm.SideColor.value
	document.DuoTonePic.src = 'pics/carcovers/multicolor-wsHP/CarCover_' + FirstColor + '_' + SecondColor + '.gif'
}

function setDropDownLists() {
	document.DuoToneForm.TopColor.value = 'White'
	document.DuoToneForm.SideColor.value = 'White'
}

function CheckColors() {
	Item = document.DuoToneForm.TopColor.selectedIndex;
	IdVar = document.DuoToneForm.TopColor.options[Item].value;
	Item2 = document.DuoToneForm.SideColor.selectedIndex;
	IdVar2 = document.DuoToneForm.SideColor.options[Item2].value;

	if (IdVar == 'White') {
		alert('Center Color Not Selected');
		return false;
	} else if (IdVar2 == 'White') {
		alert('Side Color Not Selected');
		return false;
	} else if (IdVar2 == IdVar) {
		alert('Top and Side Colors Are The Same. Please Select 2 Different Colors or Hit "Back" And Select Regular WeatherShield HP');
		return false;
	}
}
