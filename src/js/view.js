
/**
 * View (Presentation Layer) - This part of the app has access to the DOM.
 */
const View  = (function() {

	function loadingIndicatorOn() {
		document.getElementById("loadingIndicator").style.display = "block";
		document.getElementById("content").style.display = "none";
	}

	function loadingIndicatorOff(){
		document.getElementById("loadingIndicator").style.display = "none";
		document.getElementById("content").style.display = "block";
	}

	/**
	 * Show all train stations in index.html
	 * @param  {Array} stations   Array of station objects
	 */
	function showTrainStations(stations){
		var trainStationList = document.getElementById('trainStationList');
		console.log(stations);
		var htmlChunk = '';
		for(var station of stations){
			htmlChunk += `<div class="train-stations"><h5>${station.AdvertisedLocationName}</h5> (${station.LocationSignature}): ${station.Geometry.SWEREF99TM}</div> `;
		}
		trainStationList.innerHTML = htmlChunk;
	}

	/**
	 * Show train messages in index.html
	 * @param  {Array} messages 	Array of message objects
	 */
	function showTrainMessages(){
		View.loadingIndicatorOn();
		setTimeout(View.loadingIndicatorOff, 500);   // Timeout for show off

		var messages = Model.getTrainMessagesFromAPI();

		var trainMessageList = document.getElementById('trainMessageList');
		var htmlChunk = '';
		for(var message of messages){
			htmlChunk += `<div class="train-messages">
											<h5>${message.AffectedLocation}</h5> 
											<p>(${message.ExternalDescription}): ${message.ReasonCodeText}</p></div> `;
		}
		trainMessageList.innerHTML = htmlChunk;
	}

	/**
	 * Show traffic situations in index.html
	 * @param  {Array} situations 	Array of situation objects
	 */
	function showSituations(situations, type){

		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';
		for(var situation of situations){

			for(var i = 0; i < situation.Deviation.length; i++){
				if (situation.Deviation[i].MessageType == type || type == "Alla"){
					var messageType = situation.Deviation[i].MessageType;
					var locationDescriptor = situation.Deviation[i].LocationDescriptor || ' ';
					var iconId = situation.Deviation[i].IconId;
					var message = situation.Deviation[i].Message || ' ';
					var startTime = Model.changeTimeFormat(situation.Deviation[i].StartTime);
					var endTime = Model.changeTimeFormat(situation.Deviation[i].EndTime);
					var icon = `<img src="http://api.trafikinfo.trafikverket.se/v1/icons/${iconId}?type=svg" class="situation-icon">`;

					htmlChunk += `<div class="situation card-shadow">
													${icon}
													<h5>${messageType}</h5>
													<span class="small">${startTime} - ${endTime}</span><br>  
													${locationDescriptor}
													${message}
												</div>`;
				}
			}
		situationsList.innerHTML = htmlChunk;
		}
	}

	// Show no result message
	function showNoResultMessage(){
		var situationsList = document.getElementById('situationsList');	
		situationsList.innerHTML = `<div class="situation">Inget resultat finns att visa.</div>`;	
	}

	// Init empty map
	function initEmptyMap(){
		var stockholm = {lat: 59.326792, lng: 18.065131};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: stockholm
  	});
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
	 * Init map with markers 
	 * @param  {Array} situations 
	 * @param  {String} type       Type of situation
	 */
	function initMap(situations, type){
			// Init map
			var stockholm = {lat: 59.326792, lng: 18.065131};
	    var map = new google.maps.Map(document.getElementById('map'), {
	      zoom: 10,
	      center: stockholm
	    });

			// Put markers on the map
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType == type || type == "Alla" ){
						var iconId = dev.IconId;
						var type = dev.MessageType;
						var location = dev.LocationDescriptor;
						var coordinates = dev.Geometry.WGS84;
						var id = dev.Id;
						var coords = Model.splitWGS84coordinates(coordinates);
			      var latLng = new google.maps.LatLng(coords[1],coords[0]);
			      var marker = new google.maps.Marker({
			        position: latLng,
			        icon: `http://api.trafikinfo.trafikverket.se/v1/icons/${iconId}?type=png32x32`,
			        map: map, 
			        clickable: true, 
			      });
			    	// Attach infowindow to marker
			      var content = `${type}: <br>${location}<br><span onclick="Model.getOneSituationFromAPI('${id}', '${type}')">Läs mer</span>`;
       			View.attachInfoWindow(marker, content, id);
					}
				}
	    }
	}

	/**
	 * Attach info window to marker
	 * @param  {Object} marker      
	 * @param  {String} content 	
	 * @param  {String} id 		            
	 */
	function attachInfoWindow(marker, content, id) {
	  var infowindow = new google.maps.InfoWindow({
	    content: content,
	    maxWidth: "200",
	    id: id,
	  });
	  marker.addListener('click', function() {
	    infowindow.open(marker.get('map'), marker);
	  });
	}

	return {
		loadingIndicatorOn: loadingIndicatorOn,
		loadingIndicatorOff: loadingIndicatorOff,
		showTrainStations: showTrainStations,
		showTrainMessages: showTrainMessages,
		appendTotalToDropdown: appendTotalToDropdown,
		initMap: initMap,
		showSituations: showSituations,
		showNoResultMessage: showNoResultMessage,
		initEmptyMap: initEmptyMap,
		attachInfoWindow: attachInfoWindow,
	}; // end of return

})(); // end of View





