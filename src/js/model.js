/**
 * Model (Data Layer)- This is where the data is stored for the app. 
 */
const Model  = (function() {

	const apikey = 'da45c275bf724721b1a706182adcff1b';
	const url = 'https://api.trafikinfo.trafikverket.se/v1.1/data.json';

	/**
	 * Get train stations from API
	 */
	function getTrainStationsFromAPI(sorting) { 
		
	  var question = `<REQUEST> 
			                <LOGIN authenticationkey="${apikey}" /> 
			                <QUERY objecttype="TrainStation"> 
			                  <FILTER/>
		                    <INCLUDE>AdvertisedLocationName</INCLUDE> 
		                    <INCLUDE>LocationSignature</INCLUDE> 
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

		fetchRequest.then(data => {
			var stations = data.RESPONSE.RESULT[0].TrainStation;



		var items = stations.map((station) => {
			return [station.AdvertisedLocationName, station.LocationSignature];
		});

		//var sorting = [ 'Sst', 'Fas' ];
		var result = []


		sorting.forEach((key) => {
		    var found = false;
		    items = items.filter(function(item) {
		        if(!found && item[1] == key) {
		            result.push(item);
		            found = true;
		            return false;
		        } else 
		            return true;
		    })
		});

		var stationNames = '';
		result.forEach((item) => {
		    stationNames += item[0] + " "; 
		})

		console.log(stationNames);


		});
	}

	/**
	 * Get traffic situation information from API
	 */
	var getSituationsFromAPI = function(){ 
		View.loadingIndicatorOn();

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
			setTimeout(View.loadingIndicatorOff, 500);   // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			View.showSituations(situations);
		});
	};

	/**
	 * Get train messages from API
	 */
	var getTrainMessagesFromAPI = function(){ 
		
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
			var trainMessages = data.RESPONSE.RESULT[0].TrainMessage;
			//View.showTrainMessages(trainMessages);
			//Model.showTrainMessagesOnMap(trainMessages);
		});
	};

  function initMap() {
    var stockholm = {lat: 59.3118766, lng: 18.0819522};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: stockholm
    });

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
			var messages = data.RESPONSE.RESULT[0].TrainMessage;
			
			// Put markers on the map
			for(var message of messages){
				var coordinates = message.Geometry.WGS84;
				var coords = splitWGS84coordinates(coordinates);
	      var latLng = new google.maps.LatLng(coords[1],coords[0]);
	      var marker = new google.maps.Marker({
	        position: latLng,
	        icon: 'dist/images/warning.png',
	        map: map
	      });
	      var station = Model.getTrainStationsFromAPI(messages.AffectedLocation);
	      console.log(station);
	   //    var infowindow = new google.maps.InfoWindow({
  		// 		content: station
  		// 	});
				// infowindow.open(map,marker);
			}

		});
  }


	function splitWGS84coordinates(coordinates){
		var coordinatesSplit = coordinates.replace('(',' ').replace(')',' ').split(/[\s,]+/);
		var lng = Number(coordinatesSplit[1]);
		var lat = Number(coordinatesSplit[2]);
		return [lng,lat];
	}

	return {
		getTrainStationsFromAPI: getTrainStationsFromAPI,
		getSituationsFromAPI: getSituationsFromAPI,
		getTrainMessagesFromAPI: getTrainMessagesFromAPI,
		initMap: initMap,
	}; // end of return
})(); // end of Model




