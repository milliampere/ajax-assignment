/**
 * Eventlistener to apply click-functions and load content at init ...
 */
document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById('carButton').addEventListener('click', Model.getSituationsFromAPI);
	document.getElementById('trainButton').addEventListener('click', Model.getTrainMessagesFromAPI);
	Model.getSituationsFromAPI();
});


/**
 * Model
 */
const Model  = (function(){

	const apikey = 'da45c275bf724721b1a706182adcff1b';
	const url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';

	var getTrainStationsFromAPI = function(){ 
		View.loadingIndicatorOn();
		var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';
	  var question = `<REQUEST> 
			                <LOGIN authenticationkey="${apikey}" /> 
			                <QUERY objecttype="TrainStation"> 
			                  <FILTER>
                  				<WITHIN name="Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="10000" />
            						</FILTER> 
		                    <INCLUDE>Prognosticated</INCLUDE> 
		                    <INCLUDE>AdvertisedLocationName</INCLUDE> 
		                    <INCLUDE>LocationSignature</INCLUDE> 
		                    <INCLUDE>Geometry.SWEREF99TM</INCLUDE>  
			                </QUERY>
			             </REQUEST>`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(end => {
			setTimeout(View.loadingIndicatorOff, 1000);   // Timeout for show off
			var stations = end.RESPONSE.RESULT[0].TrainStation;
			View.showTrainStations(stations);
		});
	};

	var getSituationsFromAPI = function(){ 

		View.loadingIndicatorOn();

		var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';

		// SWEREF99TM-koordinater för Stockholm: 674130 6579686, 10000 = 1 mil
		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation">
        <FILTER>
        			<WITHIN name="Deviation.Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="30000" />
              <EQ name="Deviation.MessageType" value="Vägarbete" />
        </FILTER>
        <INCLUDE>Deviation.Id</INCLUDE>
        <INCLUDE>Deviation.MessageType</INCLUDE>
        <INCLUDE>Deviation.Message</INCLUDE>
        <INCLUDE>Deviation.IconId</INCLUDE>
        <INCLUDE>Deviation.CreationTime</INCLUDE>
        <INCLUDE>Deviation.Geometry.SWEREF99TM</INCLUDE>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			setTimeout(View.loadingIndicatorOff, 1000);   // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;
			View.showSituations(situations);
		});
	};

	var getTrainMessagesFromAPI = function(){ 

		View.loadingIndicatorOn();
		
		var question = `
		<REQUEST>
	    <LOGIN authenticationkey="${apikey}" />
	    <QUERY objecttype="TrainMessage">
	      <FILTER>
	      			<WITHIN name="Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="30000" />
	      </FILTER>
	    </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			setTimeout(View.loadingIndicatorOff, 1000);   // Timeout for show off
			var trainMessages = data.RESPONSE.RESULT[0].TrainMessage;
			View.showTrainMessages(trainMessages);
		});
	};

	return {
		getTrainStationsFromAPI: getTrainStationsFromAPI,
		getSituationsFromAPI: getSituationsFromAPI,
		getTrainMessagesFromAPI: getTrainMessagesFromAPI
	}; // end of return
})(); // end of Model



/**
 * View
 */
const View  = (function(){

	function loadingIndicatorOn() {
		document.getElementById("loadingIndicator").style.display = "block";
		document.getElementById("content").style.display = "none";
	}

	function loadingIndicatorOff(){
		document.getElementById("loadingIndicator").style.display = "none";
		document.getElementById("content").style.display = "block";
	}

	/**
	 * Show all train stations
	 * @param  {Array} stations   Array of all stations
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

	function showTrainMessages(messages){
		var trainMessageList = document.getElementById('trainMessageList');
		var htmlChunk = '';
		for(var message of messages){
			htmlChunk += `<div class="train-messages">
											<h5>${message.AffectedLocation}</h5> 
											<p>(${message.ExternalDescription}): ${message.ReasonCodeText}</p></div> `;
		}
		trainMessageList.innerHTML = htmlChunk;
	}

	function showSituations(situations){

		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';
		for(var situation of situations){

			for(let i = 0; i < situation.Deviation.length; i++){
				var messageType = situation.Deviation[i].MessageType;
				var iconId = situation.Deviation[i].IconId;
				var message = situation.Deviation[i].Message;
				var creationTime = situation.Deviation[i].CreationTime.substring(0,10);
				
				var icon = `<img src="http://api.trafikinfo.trafikverket.se/v1/icons/${iconId}?type=svg" class="situation-icon">`;

				htmlChunk += `<div class="situation">
												${icon}
												<h5>${messageType}</h5>
												${message}<br>
												Publicerat: ${creationTime}
											</div>`;
			}	
		}
		situationsList.innerHTML = htmlChunk;
	}

	return {
		loadingIndicatorOn: loadingIndicatorOn,
		loadingIndicatorOff: loadingIndicatorOff,
		showTrainStations: showTrainStations,
		showTrainMessages: showTrainMessages,
		showSituations: showSituations
	}; // end of return
})(); // end of View

