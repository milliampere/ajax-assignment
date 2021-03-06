"use strict";

/**
 * View (Presentation Layer) - This part of the app has access to the DOM.
 */
var View = function () {

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
	function loadingIndicatorOff() {
		document.getElementById("loadingIndicator").style.display = "none";
		document.getElementById("content").style.display = "block";
	}

	/**
  * Show message when there is zero deviations found
  */
	function showNoResultMessage() {
		var situationsList = document.getElementById('situationsList');
		situationsList.innerHTML = "<div class=\"situation\">Inget resultat finns att visa.</div>";
	}

	/**
  * Append total number per situation to dropdown in menu
  * @param  {String} type    Type of situation
  * @param  {Number} total   Number of situations
  */
	function appendTotalToDropdown(type, total) {
		var menuSelect = document.getElementById("menu-select");
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = menuSelect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var option = _step.value;

				if (option.value == type) {
					option.innerHTML = type + " (" + total + ")";
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
	}

	/**
  * Show traffic messages in index.html
  * @param  {Array} deviations 	Array of deviations objects
  */
	function showDeviations(deviations) {
		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';

		// Create piece of html for every deviation
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = deviations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var deviation = _step2.value;

				var type = deviation.MessageType;
				var id = deviation.Id;
				var message = deviation.Message || ' ';
				var code = deviation.MessageCode;
				var road = deviation.RoadNumber || ' ';
				var location = deviation.LocationDescriptor || ' ';
				var start = Model.changeTimeFormat(deviation.StartTime);
				var end = Model.changeTimeFormat(deviation.EndTime);
				var icon = "<img src=\"dist/images/icons/svg/" + deviation.IconId + ".svg\" class=\"situation-icon\">";
				var number = deviation.Number;

				htmlChunk += "<div class=\"situation card-shadow\">\n\t\t\t\t\t\t\t\t\t\t\t" + icon + "\n\t\t\t\t\t\t\t\t\t\t\t<h4>" + code + "</h4>\n\t\t\t\t\t\t\t\t\t\t\t<span class=\"small\">" + start + " - " + end + "</span><br>\n\t\t\t\t\t\t\t\t\t\t\t" + location + " " + message + "\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"deviation-number\">" + number + "</div>\n\t\t\t\t\t\t\t\t\t\t</div>";
			}

			// View "Visa alla", not so pretty code
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

		if (deviations.length == 1) {
			var allDeviations = [];

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = markers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var marker = _step3.value;

					allDeviations.push(marker.dev);
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

			htmlChunk += "<div class=\"situation card-shadow\">\n\t\t\t\t\t\t\t\t\t\t\t<span id=\"show-all-deviations\">Visa alla</span><br>\n\t\t\t\t\t\t\t\t\t\t</div>";
		}

		// Append to index.html
		situationsList.innerHTML = htmlChunk;

		// View "Visa alla", not so pretty code
		if (deviations.length == 1) {
			document.getElementById('show-all-deviations').addEventListener('click', function () {
				View.showDeviations(allDeviations);
			});
		}
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
	function addMarkers(deviations) {

		// Clears the map from old markers
		View.clearMarkers();

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = deviations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var deviation = _step4.value;

				var icon = deviation.IconId;
				var type = deviation.MessageType;
				var id = deviation.Id;
				var code = deviation.MessageCode;
				var coordinate = deviation.Geometry.WGS84;
				var coords = Model.splitWGS84coordinates(coordinate);
				var latLng = new google.maps.LatLng(coords[1], coords[0]);
				var number = deviation.Number;

				// Adds a marker at the specified coordinates in latLang and push to the array
				var marker = new google.maps.Marker({
					position: latLng,
					icon: "dist/images/icons/png/" + icon + ".png",
					map: map,
					clickable: true,
					dev: deviation
				});
				markers.push(marker);

				// Adds an infowindow to the markers
				View.addInfowindow(marker, code, id, number);
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
  * Attach infowindow to marker
  * @param  {Object} marker      
  * @param  {String} type 	
  * @param  {String} id 		            
  */
	function addInfowindow(marker, code, id, number) {
		var content = "<div class=\"deviation-number deviation-number-inline\">" + number + "</div> " + code + " <br><span onclick=\"Model.getOneDeviationFromAPI('" + id + "'," + number + ")\">Visa info</span>";
		var infowindow = new google.maps.InfoWindow({
			content: content,
			maxWidth: "200",
			id: id
		});
		// This event listener will open the infowindow when the marker is clicked.
		marker.addListener('click', function () {
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
	function initEmptyMap() {
		var stockholm = { lat: 59.326792, lng: 18.065131 };
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
		clearMarkers: clearMarkers

	}; // end of return
}(); // end of View