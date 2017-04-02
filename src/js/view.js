
/**
 * View (Presentation Layer) - This part of the app has access to the DOM.
 */
const View  = (function() {

	/**
	 * Show Loading indicator
	 */
	function loadingIndicatorOn() {
		document.getElementById("loadingIndicator").style.display = "block";
		document.getElementById("content").style.display = "none";
	}

	/**
	 * Hide Loading indicator
	 */
	function loadingIndicatorOff(){
		document.getElementById("loadingIndicator").style.display = "none";
		document.getElementById("content").style.display = "block";
	}

	/**
	 * Show message when there is zero deviations found
	 */
	function showNoResultMessage(){
		var situationsList = document.getElementById('situationsList');	
		situationsList.innerHTML = `<div class="situation">Inget resultat finns att visa.</div>`;	
	}

	/**
	 * Append total number per situation to dropdown in menu
	 * @param  {String} type    Type of situation
	 * @param  {Number} total   Number of situations
	 */
	function appendTotalToDropdown(type, total){
		var menuSelect = document.getElementById("menu-select");
		for(var option of menuSelect){
			if (option.value == type){
				option.innerHTML = type + " (" + total + ")";
			}
		}
	}

	/**
	 * Show traffic messages in index.html
	 * @param  {Array} deviations 	Array of deviations objects
	 */
	function showDeviations(deviations){
		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';

		// Create piece of html for every deviation
		for(var deviation of deviations){
			var type = deviation.MessageType;
			var id = deviation.Id;
			var message = deviation.Message || ' ';
			var code = deviation.MessageCode;
			var road = deviation.RoadNumber || ' ';
			var location = deviation.LocationDescriptor || ' ';
			var start = Model.changeTimeFormat(deviation.StartTime);
			var end = Model.changeTimeFormat(deviation.EndTime);
			var icon = `<img src="dist/images/icons/svg/${deviation.IconId}.svg" class="situation-icon">`;
			var number = deviation.Number;

			htmlChunk += `<div class="situation card-shadow">
											${icon}
											<h4>${code} ${number}</h4>
											<span class="small">${start} - ${end}</span><br>
											${location} ${road} ${message}
											<div class="deviation-number">${number}</div>
										</div>`;
			}

			// View "Visa alla", not so pretty code
			if(deviations.length == 1){
				htmlChunk += `<div class="situation card-shadow">
											<a href="" onclick="Model.View.showDeviations()">Visa alla trafikmeddelanden</a>
										</div>`;
			}

		// Append to index.html
		situationsList.innerHTML = htmlChunk;
	}


	/*********
	 *  MAP
	 *********/

	var map;
	var markers = [];

	/**
	 * Adds marker for each deviation to the map
	 * @param {Array} deviations    Array of deviation objects
	 */
	function addMarkers(deviations){

		// Clears the map from old markers
		View.clearMarkers();

		for(var deviation of deviations){
			var icon = deviation.IconId;
			var type = deviation.MessageType;
			var id = deviation.Id;
			var code = deviation.MessageCode;
			var coordinate = deviation.Geometry.WGS84;
			var coords = Model.splitWGS84coordinates(coordinate);
			var latLng = new google.maps.LatLng(coords[1],coords[0]);
			var number = deviation.Number;

			// Adds a marker at the specified coordinates in latLang and push to the array
			var marker = new google.maps.Marker({
	      position: latLng,
	      icon: `dist/images/icons/png/${icon}.png`,
	      map: map, 
	      clickable: true, 
		    });
			markers.push(marker);
		  
		  // Adds an infowindow to the markers
	  	View.addInfowindow(marker, code, id, number);
		}		
	}

	/**
	 * Attach infowindow to marker
	 * @param  {Object} marker      
	 * @param  {String} type 	
	 * @param  {String} id 		            
	 */
	function addInfowindow(marker, code, id, number) {
		var content = `<div class="deviation-number deviation-number-inline">${number}</div> ${code} <br><span onclick="Model.getOneDeviationFromAPI('${id}',${number})">Visa info</span>`;
	  var infowindow = new google.maps.InfoWindow({
	    content: content,
	    maxWidth: "200",
	    id: id,
	  });
	  // This event listener will open the infowindow when the marker is clicked.
	  marker.addListener('click', function() {
	    infowindow.open(marker.get('map'), marker);
	  });
	}

	/**
	 * Clear the map from markers, to be used before adding new markers
	 */
  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

	// Init empty map
	function initEmptyMap(){
		var stockholm = {lat: 59.326792, lng: 18.065131};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: stockholm
  	});
  }


	return {
		loadingIndicatorOn: loadingIndicatorOn,
		loadingIndicatorOff: loadingIndicatorOff,
		appendTotalToDropdown: appendTotalToDropdown,
		showNoResultMessage: showNoResultMessage,
		showDeviations: showDeviations,
		initEmptyMap: initEmptyMap,
		addMarkers: addMarkers,
		addInfowindow: addInfowindow,
		clearMarkers: clearMarkers,

	}; // end of return

})(); // end of View





