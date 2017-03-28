"use strict";

/**
 * View (Presentation Layer) - This part of the app has access to the DOM.
 */
var View = function () {

	function loadingIndicatorOn() {
		document.getElementById("loadingIndicator").style.display = "block";
		document.getElementById("content").style.display = "none";
	}

	function loadingIndicatorOff() {
		document.getElementById("loadingIndicator").style.display = "none";
		document.getElementById("content").style.display = "block";
	}

	/**
  * Show all train stations in index.html
  * @param  {Array} stations   Array of station objects
  */
	function showTrainStations(stations) {
		var trainStationList = document.getElementById('trainStationList');
		console.log(stations);
		var htmlChunk = '';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = stations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var station = _step.value;

				htmlChunk += "<div class=\"train-stations\"><h5>" + station.AdvertisedLocationName + "</h5> (" + station.LocationSignature + "): " + station.Geometry.SWEREF99TM + "</div> ";
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

		trainStationList.innerHTML = htmlChunk;
	}

	/**
  * Show train messages in index.html
  * @param  {Array} messages 	Array of message objects
  */
	function showTrainMessages() {
		View.loadingIndicatorOn();
		setTimeout(View.loadingIndicatorOff, 500); // Timeout for show off

		var messages = Model.getTrainMessagesFromAPI();

		var trainMessageList = document.getElementById('trainMessageList');
		var htmlChunk = '';
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var message = _step2.value;

				htmlChunk += "<div class=\"train-messages\">\n\t\t\t\t\t\t\t\t\t\t\t<h5>" + message.AffectedLocation + "</h5> \n\t\t\t\t\t\t\t\t\t\t\t<p>(" + message.ExternalDescription + "): " + message.ReasonCodeText + "</p></div> ";
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

		trainMessageList.innerHTML = htmlChunk;
	}

	/**
  * Show traffic situations in index.html
  * @param  {Array} situations 	Array of situation objects
  */
	function showSituations(situations, type) {

		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = situations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var situation = _step3.value;


				for (var i = 0; i < situation.Deviation.length; i++) {
					if (situation.Deviation[i].MessageType == type || type == "Alla") {
						var messageType = situation.Deviation[i].MessageType;
						var locationDescriptor = situation.Deviation[i].LocationDescriptor || ' ';
						var iconId = situation.Deviation[i].IconId;
						var message = situation.Deviation[i].Message || ' ';
						var startTime = Model.changeTimeFormat(situation.Deviation[i].StartTime);
						var endTime = Model.changeTimeFormat(situation.Deviation[i].EndTime);
						var icon = "<img src=\"dist/images/icons/svg/" + iconId + ".svg\" class=\"situation-icon\">";

						htmlChunk += "<div class=\"situation card-shadow\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t" + icon + "\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h5>" + messageType + "</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"small\">" + startTime + " - " + endTime + "</span><br>  \n\t\t\t\t\t\t\t\t\t\t\t\t\t" + locationDescriptor + "\n\t\t\t\t\t\t\t\t\t\t\t\t\t" + message + "\n\t\t\t\t\t\t\t\t\t\t\t\t</div>";
					}
				}
				situationsList.innerHTML = htmlChunk;
			}
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
	}

	// Show no result message
	function showNoResultMessage() {
		var situationsList = document.getElementById('situationsList');
		situationsList.innerHTML = "<div class=\"situation\">Inget resultat finns att visa.</div>";
	}

	// Init empty map
	function initEmptyMap() {
		var stockholm = { lat: 59.326792, lng: 18.065131 };
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
	function appendTotalToDropdown(type, total) {
		var menuSelect = document.getElementById("menu-select");
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = menuSelect[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var option = _step4.value;

				if (option.value == type) {
					option.innerHTML = type + " (" + total + ")";
				}
			}
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
	}

	/**
  * Init map with markers 
  * @param  {Array} situations 
  * @param  {String} type       Type of situation
  */
	function initMap(situations, type) {
		// Init map
		var stockholm = { lat: 59.326792, lng: 18.065131 };
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: stockholm
		});

		// Put markers on the map
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = situations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var situation = _step5.value;

				for (var i = 0; i < situation.Deviation.length; i++) {
					var dev = situation.Deviation[i];
					if (dev.MessageType == type || type == "Alla") {
						var iconId = dev.IconId;
						var type = dev.MessageType;
						var location = dev.LocationDescriptor;
						var coordinates = dev.Geometry.WGS84;
						var id = dev.Id;
						var coords = Model.splitWGS84coordinates(coordinates);
						var latLng = new google.maps.LatLng(coords[1], coords[0]);
						var marker = new google.maps.Marker({
							position: latLng,
							icon: "dist/images/icons/png/" + iconId + ".png",
							map: map,
							clickable: true
						});
						// Attach infowindow to marker
						var content = type + ": <br>" + location + "<br><span onclick=\"Model.getOneSituationFromAPI('" + id + "', '" + type + "')\">L\xE4s mer</span>";
						View.attachInfoWindow(marker, content, id);
					}
				}
			}
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
			id: id
		});
		marker.addListener('click', function () {
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
		attachInfoWindow: attachInfoWindow
	}; // end of return
}(); // end of View