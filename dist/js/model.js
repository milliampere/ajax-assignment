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
	var getSituationsFromAPI = function getSituationsFromAPI() {
		View.loadingIndicatorOn();

		// SWEREF99TM-koordinater för Stockholm: 674130 6579686, 10000 = 1 mil
		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation">\n        <FILTER>\n        \t\t\t<WITHIN name="Deviation.Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="30000" />\n              <EQ name="Deviation.MessageType" value="V\xE4garbete" />\n        </FILTER>\n        <INCLUDE>Deviation.Id</INCLUDE>\n        <INCLUDE>Deviation.MessageType</INCLUDE>\n        <INCLUDE>Deviation.Message</INCLUDE>\n        <INCLUDE>Deviation.IconId</INCLUDE>\n        <INCLUDE>Deviation.CreationTime</INCLUDE>\n        <INCLUDE>Deviation.Geometry.SWEREF99TM</INCLUDE>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

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
			setTimeout(View.loadingIndicatorOff, 500); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			View.showSituations(situations);
		});
	};

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

	function splitWGS84coordinates(coordinates) {
		var coordinatesSplit = coordinates.replace('(', ' ').replace(')', ' ').split(/[\s,]+/);
		var lng = Number(coordinatesSplit[1]);
		var lat = Number(coordinatesSplit[2]);
		return [lng, lat];
	}

	return {
		getTrainStationsFromAPI: getTrainStationsFromAPI,
		getSituationsFromAPI: getSituationsFromAPI,
		getTrainMessagesFromAPI: getTrainMessagesFromAPI,
		initMap: initMap
	}; // end of return
}(); // end of Model