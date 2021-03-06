"use strict";

/**
 * Controller handling user interaction (such as key-presses and actions e.g. clicks), making decisions for the View.
 */
var Controller = function () {

	function loadSituationsInterface() {

		var allTypes = "";
		var roadwork = "<EQ name='Deviation.MessageType' value='Vägarbete' />";
		var accident = "<EQ name='Deviation.MessageType' value='Olycka' />";
		var trafficmessage = "<EQ name='Deviation.MessageType' value='Trafikmeddelande' />";
		var stockholm = "<WITHIN name='Deviation.Geometry.SWEREF99TM' shape='center' value='674130 6579686' radius='30000' />";

		Model.getSituationsFromAPI(allTypes, stockholm, 'Alla');

		document.getElementById('menu-select').addEventListener('change', function () {
			var e = document.getElementById("menu-select");
			if (e.selectedIndex > 0) {
				if ("Alla" === e.options[e.selectedIndex].value) {
					Model.getSituationsFromAPI(allTypes, stockholm, "Alla");
				}
				if ("Trafikmeddelanden" === e.options[e.selectedIndex].value) {
					Model.getSituationsFromAPI(trafficmessage, stockholm, "Trafikmeddelande");
				} else if ("Vägarbeten" === e.options[e.selectedIndex].value) {
					Model.getRoadworksFromAPI();
				} else if ("Olyckor" === e.options[e.selectedIndex].value) {
					Model.getSituationsFromAPI(accident, stockholm, "Olycka");
				}
			}
		});
	}

	return {
		loadSituationsInterface: loadSituationsInterface

	}; // end of return
}(); // end of Controller