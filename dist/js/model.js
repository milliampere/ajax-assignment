'use strict';

/**
 * Model (Data Layer)- This is where the data is stored for the app. 
 */
var Model = function () {

	var apikey = 'da45c275bf724721b1a706182adcff1b';
	var url = 'https://api.trafikinfo.trafikverket.se/v1.1/data.json';
	var stockholm = "<WITHIN name='Deviation.Geometry.SWEREF99TM' shape='center' value='674130 6579686' radius='30000' />";

	/**
  * Get traffic situation information from API
  */
	function getSituationsFromAPI(filter, area, type) {

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
  * Get total number of traffic messages for display in dropdown. <INCLUDE> only MessageType, Geometry and MessageTypeValue for minimum request size.
  */
	function getTotalTrafficMessages() {

		var question = '\n\t\t\t<REQUEST>\n\t\t\t      <LOGIN authenticationkey="' + apikey + '" />\n\t\t\t      <QUERY objecttype="Situation">\n\t\t\t            <FILTER>\n\t\t\t\t\t        \t' + stockholm + '\n\t\t\t\t\t        \t\t<OR>\n\t\t\t\t\t              <ELEMENTMATCH>\n\t\t\t\t\t                <EQ name="Deviation.MessageType" value="Trafikmeddelande" />\n\t\t\t\t\t                <GTE name="Deviation.SeverityCode" value="4" />\n\t\t\t\t\t              </ELEMENTMATCH>\n\t\t\t\t\t            </OR>\n\t\t\t            </FILTER>\n\t\t\t            <INCLUDE>Deviation.MessageType</INCLUDE>\n\t\t\t            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>\n\t\t\t            <INCLUDE>Deviation.MessageTypeValue</INCLUDE>\n\t\t\t      </QUERY>\n\t\t\t</REQUEST>\n\t\t';

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

			var deviations = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = situations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var situation = _step.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.MessageType != "Trafikmeddelande") {
							//console.log("Borta");
						} else if (dev.Geometry === undefined || dev.MessageTypeValue == "SpeedManagement") {
							//console.log("Exkluderad");
						} else {
							deviations.push(dev);
						}
					}
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

			var total = situationCounter(deviations);
			View.appendTotalToDropdown("Trafikmeddelanden", total);
		});
	}

	/**
  * Get total number of roadworks for display in dropdown. <INCLUDE> only MessageType and Geometry for minimum request size.
  */
	function getTotalRoadworks() {

		var question = '\n\t\t\t<REQUEST>\n\t\t\t      <LOGIN authenticationkey="' + apikey + '" />\n\t\t\t      <QUERY objecttype="Situation">\n\t\t\t            <FILTER>\n\t\t\t\t\t        \t' + stockholm + '\n\t\t\t\t        \t\t<OR>\n\t\t\t\t              <ELEMENTMATCH>\n\t\t\t\t                <EQ name="Deviation.MessageType" value="V\xE4garbete" />\n\t\t\t\t                <EQ name="Deviation.SeverityCode" value="5" />\n\t\t\t\t              </ELEMENTMATCH>\n\t\t\t\t            </OR>\n\t\t\t            </FILTER>\n\t\t\t            <INCLUDE>Deviation.MessageType</INCLUDE>\n\t\t\t            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>\n\t\t\t      </QUERY>\n\t\t\t</REQUEST>\n\t\t';

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

			var deviations = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = situations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var situation = _step2.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.MessageType != "Vägarbete") {
							//console.log("Borta");
						} else if (dev.Geometry === undefined) {
							//console.log("Exkluderad");
						} else {
							deviations.push(dev);
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var total = situationCounter(deviations);
			View.appendTotalToDropdown("Vägarbeten", total);
		});
	}

	/**
  * Get total number of accidents for display in dropdown. <INCLUDE> only MessageType for minimum request size.
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

	/**
  * Get traffic messages from API
  */
	var getTrafficMessagesFromAPI = function getTrafficMessagesFromAPI() {

		View.loadingIndicatorOn();

		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">\n        <FILTER>\n        \t' + stockholm + '\n        \t\t<OR>\n              <ELEMENTMATCH>\n                <EQ name="Deviation.MessageType" value="Trafikmeddelande" />\n                <GTE name="Deviation.SeverityCode" value="4" />\n              </ELEMENTMATCH>\n            </OR>\n        </FILTER>\n        <INCLUDE>Deviation.CreationTime</INCLUDE>\n        <INCLUDE>Deviation.EndTime</INCLUDE>\n        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>\n        <INCLUDE>Deviation.IconId</INCLUDE>\n        <INCLUDE>Deviation.Id</INCLUDE>\n        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>\n        <INCLUDE>Deviation.MessageCode</INCLUDE>\n        <INCLUDE>Deviation.MessageCodeValue</INCLUDE>\n        <INCLUDE>Deviation.MessageTypeValue</INCLUDE>\n        <INCLUDE>Deviation.MessageType</INCLUDE>\n        <INCLUDE>Deviation.RoadNumber</INCLUDE>\n        <INCLUDE>Deviation.SeverityText</INCLUDE>\n        <INCLUDE>Deviation.StartTime</INCLUDE>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

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
			console.log("-- getTrafficMessagesFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			// If situations is empty stop execution
			if (typeof situations != "undefined") {
				situations = situations;
			} else {
				View.showNoResultMessage();
				return false;
			}

			// All situations have an array of deviations which hold traffic information of several MessageTypes, 
			// not just the ones we request. Therefore I make a new array and remove those before doing anything else. 
			// Furthermore, the deviations do not always return all properties (almost empty deviations..), and I have to exclude 
			// those without geolocation. 
			var deviations = [];
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = situations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var situation = _step3.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.MessageType != "Trafikmeddelande") {
							//console.log("Borta");
						} else if (dev.Geometry === undefined || dev.MessageTypeValue == "SpeedManagement") {
							//console.log("Exkluderad");
						} else {
							deviations.push(dev);
						}
					}
				}
				//console.log(deviations);  // Array of only traffic message objects

				// Show situations in text
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			View.showDeviations(deviations);

			// Init map and markers
			View.addMarkers(deviations);
		});
	};

	/**
  * Get roadwork information from API
  */
	var getRoadworksFromAPI = function getRoadworksFromAPI() {

		View.loadingIndicatorOn();

		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">\n        <FILTER>\n        \t' + stockholm + '\n        \t\t<OR>\n              <ELEMENTMATCH>\n                <EQ name="Deviation.MessageType" value="V\xE4garbete" />\n                <EQ name="Deviation.SeverityCode" value="5" />\n              </ELEMENTMATCH>\n            </OR>\n        </FILTER>\n        <INCLUDE>Deviation.CreationTime</INCLUDE>\n        <INCLUDE>Deviation.EndTime</INCLUDE>\n        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>\n        <INCLUDE>Deviation.IconId</INCLUDE>\n        <INCLUDE>Deviation.Id</INCLUDE>\n        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>\n        <INCLUDE>Deviation.MessageCode</INCLUDE>\n        <INCLUDE>Deviation.MessageType</INCLUDE>\n        <INCLUDE>Deviation.RoadNumber</INCLUDE>\n        <INCLUDE>Deviation.SeverityText</INCLUDE>\n        <INCLUDE>Deviation.StartTime</INCLUDE>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

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
			console.log("-- getRoadworksFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			// If situations is empty stop execution
			if (typeof situations != "undefined") {
				situations = situations;
			} else {
				View.showNoResultMessage();
				return false;
			}

			// All situations have an array of deviations which hold traffic information of several MessageTypes, 
			// not just the ones we request. Therefore I make a new array and remove those before doing anything else. 
			// Furthermore, the deviations do not always return all properties (almost empty deviations..), and I have to exclude 
			// those without geolocation. 
			var deviations = [];
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = situations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var situation = _step4.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.MessageType != "Vägarbete") {
							//console.log("Borta");
						} else if (dev.Geometry === undefined) {
							//console.log("Exkluderad");
						} else {
							deviations.push(dev);
						}
					}
				}
				//console.log(deviations);  // Array of only roadwork objects

				// Show situations in text
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			View.showDeviations(deviations);

			// Init map and markers
			View.addMarkers(deviations);
		});
	};

	/**
  * Get road accident information from API
  */
	var getRoadAccidentsFromAPI = function getRoadAccidentsFromAPI() {

		View.loadingIndicatorOn();

		var question = '\n\t\t<REQUEST>\n      <LOGIN authenticationkey="' + apikey + '" />\n      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">\n        <FILTER>\n        \t' + stockholm + '\n        \t\t<OR>\n              <ELEMENTMATCH>\n                <EQ name="Deviation.MessageType" value="Olycka" />\n              </ELEMENTMATCH>\n            </OR>\n        </FILTER>\n        <INCLUDE>Deviation.CreationTime</INCLUDE>\n        <INCLUDE>Deviation.EndTime</INCLUDE>\n        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>\n        <INCLUDE>Deviation.IconId</INCLUDE>\n        <INCLUDE>Deviation.Id</INCLUDE>\n        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>\n        <INCLUDE>Deviation.MessageCode</INCLUDE>\n        <INCLUDE>Deviation.MessageType</INCLUDE>\n        <INCLUDE>Deviation.RoadNumber</INCLUDE>\n        <INCLUDE>Deviation.SeverityText</INCLUDE>\n        <INCLUDE>Deviation.StartTime</INCLUDE>\n      </QUERY>\n\t\t</REQUEST>\n\t\t';

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
			console.log("-- getRoadAccidentsFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;

			// If situations is empty stop execution
			if (typeof situations != "undefined") {
				situations = situations;
			} else {
				View.showNoResultMessage();
				return false;
			}

			// All situations have an array of deviations which hold traffic information of several MessageTypes, 
			// not just the ones we request. Therefore I make a new array and remove those before doing anything else. 
			// Furthermore, the deviations do not always return all properties (almost empty deviations..), and I have to exclude 
			// those without geolocation. 
			var deviations = [];
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = situations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var situation = _step5.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.MessageType != "Olycka") {
							//console.log("Borta");
						} else if (dev.Geometry === undefined) {
							//console.log("Exkluderad");
						} else {
							deviations.push(dev);
						}
					}
				}
				//console.log(deviations);  // Array of only road accident objects

				// Show situations in text
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			View.showDeviations(deviations);

			// Init map and markers
			View.addMarkers(deviations);
		});
	};

	/**
  * Get one traffic situation information from API
  * @param {String} id  		Id of the deviation
  */
	function getOneDeviationFromAPI(id) {

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

			// All situations have an array of deviations which hold traffic information of several MessageTypes, 
			// not just the ones we request. Therefore I make a new array and only include the deviation with the requested Id. 
			var deviations = [];
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = situations[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var situation = _step6.value;

					for (var i = 0; i < situation.Deviation.length; i++) {
						var dev = situation.Deviation[i];
						if (dev.Id != id) {
							//console.log("Borta");
						} else {
							deviations.push(dev);
						}
					}
				}
				// Show situation in text
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			View.showDeviations(deviations);
		});
	}

	return {
		getSituationsFromAPI: getSituationsFromAPI,
		getTotalTrafficMessages: getTotalTrafficMessages,
		getTotalRoadworks: getTotalRoadworks,
		getTotalAccidents: getTotalAccidents,
		changeTimeFormat: changeTimeFormat,
		splitWGS84coordinates: splitWGS84coordinates,
		getTrafficMessagesFromAPI: getTrafficMessagesFromAPI,
		getRoadworksFromAPI: getRoadworksFromAPI,
		getRoadAccidentsFromAPI: getRoadAccidentsFromAPI,
		getOneDeviationFromAPI: getOneDeviationFromAPI
	}; // end of return
}(); // end of Model