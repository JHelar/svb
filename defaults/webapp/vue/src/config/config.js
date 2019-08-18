window.getValues = function(){
	// This will retrive all values as if siteVision would do
	var values = window._getValues();
	return values;
}

window.setValues = function(values){

	// Set the values as if siteVision would do. This is recommended to correctly put pagepickers etc.
	window._setValues(values);
}