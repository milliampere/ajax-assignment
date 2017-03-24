"use strict";

/**
 * View (Presentation Layer) - This part of the app has access to the DOM and is responsible for 
 * setting up Event handlers. The view is also responsible for the presentation of the HTML.
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
	function showSituations(situations) {

		var situationsList = document.getElementById('situationsList');
		var htmlChunk = '';
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = situations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var situation = _step3.value;


				for (var i = 0; i < situation.Deviation.length; i++) {
					var messageType = situation.Deviation[i].MessageType;
					var iconId = situation.Deviation[i].IconId;
					var message = situation.Deviation[i].Message;
					var creationTime = situation.Deviation[i].CreationTime.substring(0, 10);

					var icon = "<img src=\"http://api.trafikinfo.trafikverket.se/v1/icons/" + iconId + "?type=svg\" class=\"situation-icon\">";

					htmlChunk += "<div class=\"situation\">\n\t\t\t\t\t\t\t\t\t\t\t\t" + icon + "\n\t\t\t\t\t\t\t\t\t\t\t\t<h5>" + messageType + "</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t" + message + "<br>\n\t\t\t\t\t\t\t\t\t\t\t\tPublicerat: " + creationTime + "\n\t\t\t\t\t\t\t\t\t\t\t</div>";
				}
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

		situationsList.innerHTML = htmlChunk;
	}

	return {
		loadingIndicatorOn: loadingIndicatorOn,
		loadingIndicatorOff: loadingIndicatorOff,
		showTrainStations: showTrainStations,
		showTrainMessages: showTrainMessages,
		showSituations: showSituations
	}; // end of return
}(); // end of View