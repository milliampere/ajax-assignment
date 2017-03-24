'use strict';

/**
 * Eventlistener to apply click-functions and load content at init ...
 */
document.addEventListener('DOMContentLoaded', function (event) {
	document.getElementById('carButton').addEventListener('click', Model.getSituationsFromAPI);
	document.getElementById('trainButton').addEventListener('click', View.showTrainMessages);
	document.getElementById('mapButton').addEventListener('click', Model.initMap);

	//Model.getTrainMessagesFromAPI();

	View.loadingIndicatorOff();
	Model.getSituationsFromAPI();
});