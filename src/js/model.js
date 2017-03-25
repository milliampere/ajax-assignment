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
	var getSituationsFromAPI = function(filter, area, type){
		// If no filter is applied, then change filter to an empty string
		filter = (typeof filter != "undefined") ? filter : '';
		area = (typeof area != "undefined") ? area : '';
		type = (typeof type != "undefined") ? type : 'Alla';

		View.loadingIndicatorOn();

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation">
        <FILTER>
        			${area}
        			${filter}
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
			var situations = data.RESPONSE.RESULT[0].Situation;

			// Init map
			var stockholm = {lat: 59.326792, lng: 18.065131};
	    var situationMap = new google.maps.Map(document.getElementById('map'), {
	      zoom: 12,
	      center: stockholm
	    });

	    // If situations is empty stop execution
			if (typeof situations != "undefined") {
				situations = situations; 
			} else {
				View.showNoResultMessage();
				return false;
			}

			// Put markers on the map
			for(var situation of situations){

				for(var i = 0; i < situation.Deviation.length; i++){
					if (situation.Deviation[i].MessageType == type || type == "Alla" ){
						console.log(situation.Deviation[i]);
						var iconId = situation.Deviation[i].IconId;
						var messageType = situation.Deviation[i].MessageType;
						var coordinates = situation.Deviation[i].Geometry.WGS84;
						var coords = splitWGS84coordinates(coordinates);
			      var latLng = new google.maps.LatLng(coords[1],coords[0]);
			      var marker = new google.maps.Marker({
			        position: latLng,
			        icon: `http://api.trafikinfo.trafikverket.se/v1/icons/${iconId}?type=png32x32`,
			        map: situationMap, 
			        clickable: true,
			      });
			    //   var infowindow = new google.maps.InfoWindow({
		  			// 	content: messageType
		  			// });
		  			// marker.addListener('click', function() {
       //    		infowindow.open(situationMap, marker);
       //  		});
       //  		
       			attachSecretMessage(marker, messageType);
					}

				}


	    }

			View.showSituations(situations, type);
		});
	};

     function attachSecretMessage(marker, messageType) {
        var infowindow = new google.maps.InfoWindow({
          content: messageType
        });

        marker.addListener('click', function() {
          infowindow.open(marker.get('situationMap'), marker);
        });
     }

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




