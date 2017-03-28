'use strict';

/**
 * Eventlistener to apply click-functions and load content at init ...
 */
document.addEventListener('DOMContentLoaded', function (event) {
	document.getElementById('carButton').addEventListener('click', function () {
		Model.getTrafficMessagesFromAPI();
		// Load dropdown totals 
		Model.getTotalTrafficMessages();
		Model.getTotalRoadworks();
		Model.getTotalAccidents();
	});

	// Load dropdown totals 
	Model.getTotalTrafficMessages();
	Model.getTotalRoadworks();
	Model.getTotalAccidents();

	//Init map and load traffic information
	View.initEmptyMap();
	Model.getTrafficMessagesFromAPI();

	// This event listener will call get__FromAPI() when the dropdown option is changed 
	document.getElementById('menu-select').addEventListener('change', function () {
		var e = document.getElementById("menu-select");
		if (e.selectedIndex >= 0) {
			if ("Trafikmeddelanden" === e.options[e.selectedIndex].value) {
				Model.getTrafficMessagesFromAPI();
			} else if ("Vägarbeten" === e.options[e.selectedIndex].value) {
				Model.getRoadworksFromAPI();
			} else if ("Olyckor" === e.options[e.selectedIndex].value) {
				Model.getRoadAccidentsFromAPI();
			}
		}
	});
});