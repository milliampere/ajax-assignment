/**
 * Eventlistener to apply click-functions and load content at init ...
 */
document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById('carButton').addEventListener('click', function(){
		Controller.loadSituationsInterface;
		document.getElementById('menu-sub').style.display = "flex";  // Add car submenu
	});
	document.getElementById('trainButton').addEventListener('click', function(){
		View.showTrainMessages;
		document.getElementById('menu-sub').style.display = "none"; // Remove car submenu
	});
	document.getElementById('mapButton').addEventListener('click', Model.initMap);

	Controller.loadSituationsInterface();
	
	// Load dropdown totals 
	Model.getTotalTrafficMessages();
	Model.getTotalRoadworks();
	Model.getTotalAccidents();
	
});

