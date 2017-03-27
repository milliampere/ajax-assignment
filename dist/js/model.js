'use strict';

/**
 * Model (Data Layer)- This is where the data is stored for the app. 
 */
var Model = function () {

	var apikey = 'da45c275bf724721b1a706182adcff1b';
	var url = 'https://api.trafikinfo.trafikverket.se/v1.1/data.json';

	/**
  * Get train stations from API
  */
	function getTrainStationsFromAPI(sorting) {

		var question = '<REQUEST> \n\t\t\t                <LOGIN authenticationkey="' + apikey + '" /> \n\t\t\t                <QUERY objecttype="TrainStation"> \n\t\t\t                  <FILTER/>\n\t\t                    <INCLUDE>AdvertisedLocationName</INCLUDE> \n\t\t                    <INCLUDE>LocationSignature</INCLUDE> \n\t\t\t                </QUERY>\n\t\t\t             </REQUEST>';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var stations = data.RESPONSE.RESULT[0].TrainStation;

			var items = stations.map(function (station) {
				return [station.AdvertisedLocationName, station.LocationSignature];
			});

			//var sorting = [ 'Sst', 'Fas' ];
			var result = [];

			sorting.forEach(function (key) {
				var found = false;
				items = items.filter(function (item) {
					if (!found && item[1] == key) {
						result.push(item);
						found = true;
						return false;
					} else return true;
				});
			});

			var stationNames = '';
			result.forEach(function (item) {
				stationNames += item[0] + " ";
			});

			console.log(stationNames);
		});
	}

	/**
  * Get traffic situation information from API
  */
	var getSituationsFromAPI = function getSituationsFromAPI(filter, area, type) {

		// If no filter is applied, then change filter to an empty string
		filter = typeof filter != "undefined" ? filter : '';
		area = typeof area != "undefined" ? area : '';
		type = typeof type != "undefined" ? type : 'Alla';

		View.loadingIndicatorOn();

		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">\n        <FILTER>\n        \t\t\t' + area + '\n        \t\t\t' + filter + '\n        </FILTER>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			setTimeout(View.loadingIndicatorOff, 700); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			// If situations is empty stop execution
			if (typeof situations != "undefined") {
				situations = situations;
			} else {
				View.showNoResultMessage();
				View.initEmptyMap();
				return false;
			}

			// Show situations in text
			View.showSituations(situations, type);

			// Init map and markers
			View.initMap(situations, type);
		});
	};

	/**
  * Get one traffic situation information from API
  * @param {String} id  		Id of the situation
  * @param {String} type 	Type of situation ('Alla', 'Trafikmeddelande', 'Vägarbete', 'Olycka'..) 
  */
	function getOneSituationFromAPI(id, type) {

		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation">\n      \t<FILTER>\n\t\t\t\t<EQ name="Deviation.Id" value="' + id + '" />\n\t\t\t\t</FILTER>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var situations = data.RESPONSE.RESULT[0].Situation;

			// Show situation in text
			View.showSituations(situations, type);
		});
	}

	function getTotalTrafficMessages() {

		var question = '\n\t\t\t<REQUEST>\n\t\t\t      <LOGIN authenticationkey="' + apikey + '" />\n\t\t\t      <QUERY objecttype="Situation">\n\t\t\t            <FILTER>\n\t\t\t                  <WITHIN name=\'Deviation.Geometry.SWEREF99TM\' shape=\'center\' value=\'674130 6579686\' radius=\'30000\' />\n\t\t\t                  <EQ name=\'Deviation.MessageType\' value=\'Trafikmeddelande\' />\n\t\t\t            </FILTER>\n\t\t\t            <INCLUDE>Deviation.MessageType</INCLUDE>\n\t\t\t      </QUERY>\n\t\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var situations = data.RESPONSE.RESULT[0].Situation;
			var total = situationCounter(situations);
			View.appendTotalToDropdown("Trafikmeddelanden", total);
		});
	}

	function getTotalRoadworks() {

		var question = '\n\t\t\t<REQUEST>\n\t\t\t      <LOGIN authenticationkey="' + apikey + '" />\n\t\t\t      <QUERY objecttype="Situation">\n\t\t\t            <FILTER>\n\t\t\t                  <WITHIN name=\'Deviation.Geometry.SWEREF99TM\' shape=\'center\' value=\'674130 6579686\' radius=\'30000\' />\n\t\t\t                  <EQ name=\'Deviation.MessageType\' value=\'V\xE4garbete\' />\n\t\t\t            </FILTER>\n\t\t\t            <INCLUDE>Deviation.MessageType</INCLUDE>\n\t\t\t      </QUERY>\n\t\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var situations = data.RESPONSE.RESULT[0].Situation;
			var total = situationCounter(situations);
			View.appendTotalToDropdown("Vägarbeten", total);
		});
	}

	/**
  * Get total number of accidents. Include only MessageType for minimum request size.
  */
	function getTotalAccidents() {

		var question = '\n\t\t\t<REQUEST>\n\t\t\t      <LOGIN authenticationkey="' + apikey + '" />\n\t\t\t      <QUERY objecttype="Situation">\n\t\t\t            <FILTER>\n\t\t\t                  <WITHIN name=\'Deviation.Geometry.SWEREF99TM\' shape=\'center\' value=\'674130 6579686\' radius=\'30000\' />\n\t\t\t                  <EQ name=\'Deviation.MessageType\' value=\'Olycka\' />\n\t\t\t            </FILTER>\n\t\t\t            <INCLUDE>Deviation.MessageType</INCLUDE>\n\t\t\t      </QUERY>\n\t\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var situations = data.RESPONSE.RESULT[0].Situation;
			var total;
			// If situations is empty stop execution
			if (typeof situations != "undefined") {
				total = situationCounter(situations);
			} else {
				total = 0;
			}
			View.appendTotalToDropdown("Olyckor", total);
		});
	}

	/**
  * Count number of situations
  * @param  {Object} situations 
  * @return {Number}             	Number of situations
  */
	function situationCounter(situations) {
		var totalSituations = 0;
		for (var i = 1; i <= situations.length; i++) {
			totalSituations++;
		}
		return totalSituations;
	}

	/**
  * Get train messages from API
  */
	var getTrainMessagesFromAPI = function getTrainMessagesFromAPI() {

		var question = '\n\t\t<REQUEST>\n\t    <LOGIN authenticationkey="' + apikey + '" />\n\t    <QUERY objecttype="TrainMessage">\n\t      <FILTER>\n\t      \t\t\t<WITHIN name="Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="30000" />\n\t      </FILTER>\n\t    </QUERY>\n\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var trainMessages = data.RESPONSE.RESULT[0].TrainMessage;
			//View.showTrainMessages(trainMessages);
			//Model.showTrainMessagesOnMap(trainMessages);
		});
	};

	function initMap() {
		var stockholm = { lat: 59.3118766, lng: 18.0819522 };
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: stockholm
		});

		var question = '\n\t\t<REQUEST>\n\t    <LOGIN authenticationkey="' + apikey + '" />\n\t    <QUERY objecttype="TrainMessage">\n\t      <FILTER>\n\t      \t\t\t<WITHIN name="Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="30000" />\n\t      </FILTER>\n\t    </QUERY>\n\t\t</REQUEST>\n\t\t';

		var fetchRequest = fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			console.log(error);
		});

		fetchRequest.then(function (data) {
			var messages = data.RESPONSE.RESULT[0].TrainMessage;

			// Put markers on the map
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var message = _step.value;

					var coordinates = message.Geometry.WGS84;
					var coords = splitWGS84coordinates(coordinates);
					var latLng = new google.maps.LatLng(coords[1], coords[0]);
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
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		});
	}

	/**
  * Change time format into YYYY-MM-DD hh:mm
  * @param  {String} time  	Time in any format
  * @return {String}        	Time in format YYYY-MM-DD hh:mm
  */
	function changeTimeFormat(time) {
		if (typeof time == "undefined") {
			return "";
		} else {
			// Get the time in milliseconds since January 1, 1970
			var msec = Date.parse(time);
			// Get the time in ISO format, remove seconds and replace T
			var formattedTime = new Date(msec).toISOString().substr(0, 16).replace('T', ' ');
			return formattedTime;
		}
	}

	/**
  * Split WGS84 coordinates 
  * @param  {String} coordinates  	"POINT (xx.xxx xx.xxx)"
  * @return {Array}   							[xx.xxx, xx.xxx]        		
  */
	function splitWGS84coordinates(coordinates) {
		// Remove POINT and paranteses, then split into an array of substrings
		var coordinatesSplit = coordinates.replace('POINT (', '').replace(')', '').split(/[\s,]+/);
		// Convert to number
		var lng = Number(coordinatesSplit[0]);
		var lat = Number(coordinatesSplit[1]);
		return [lng, lat];
	}

	return {
		getTrainStationsFromAPI: getTrainStationsFromAPI,
		getSituationsFromAPI: getSituationsFromAPI,
		getTotalTrafficMessages: getTotalTrafficMessages,
		getTotalRoadworks: getTotalRoadworks,
		getTotalAccidents: getTotalAccidents,
		getTrainMessagesFromAPI: getTrainMessagesFromAPI,
		initMap: initMap,
		changeTimeFormat: changeTimeFormat,
		splitWGS84coordinates: splitWGS84coordinates,
		getOneSituationFromAPI: getOneSituationFromAPI
	}; // end of return
}(); // end of Model