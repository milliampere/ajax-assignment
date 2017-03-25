
/**
 * View (Presentation Layer) - This part of the app has access to the DOM and is responsible for 
 * setting up Event handlers. The view is also responsible for the presentation of the HTML.
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
					var locationDescriptor = situation.Deviation[i].LocationDescriptor;
					var iconId = situation.Deviation[i].IconId;
					var message = situation.Deviation[i].Message;
					var startTime = situation.Deviation[i].StartTime.substring(0,10);
					var endTime = situation.Deviation[i].EndTime.substring(0,10);
					
					var icon = `<img src="http://api.trafikinfo.trafikverket.se/v1/icons/${iconId}?type=svg" class="situation-icon">`;

					htmlChunk += `<div class="situation card-shadow">
													${icon}
													<h5>${messageType}</h5>
													<span style="color: #bad0b8">${locationDescriptor}</span><br>
													${message}<br>
													Gäller: ${startTime} - ${endTime}
												</div>`;
				}
			}
		situationsList.innerHTML = htmlChunk;
		}
	}

	function showNoResultMessage(){
		var situationsList = document.getElementById('situationsList');	
		situationsList.innerHTML = `<div class="situation">Inget resultat finns att visa.</div>`;	
	}

	return {
		loadingIndicatorOn: loadingIndicatorOn,
		loadingIndicatorOff: loadingIndicatorOff,
		showTrainStations: showTrainStations,
		showTrainMessages: showTrainMessages,
		showSituations: showSituations,
		showNoResultMessage: showNoResultMessage,
	}; // end of return

})(); // end of View





