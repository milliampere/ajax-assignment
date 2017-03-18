(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Eventlistener to apply click-functions and load content at init ...
 */
document.addEventListener('DOMContentLoaded', function (event) {
	document.getElementById('carButton').addEventListener('click', Model.getSituationsFromAPI);
	document.getElementById('trainButton').addEventListener('click', Model.getTrainMessagesFromAPI);
	Model.getSituationsFromAPI();
});

/**
 * Model
 */
var Model = function () {

	var apikey = 'da45c275bf724721b1a706182adcff1b';
	var url = 'https://api.trafikinfo.trafikverket.se/v1.1/data.json';

	/**
  * Get train stations from API
  */
	var getTrainStationsFromAPI = function getTrainStationsFromAPI() {
		View.loadingIndicatorOn();
		var question = '<REQUEST> \n\t\t\t                <LOGIN authenticationkey="' + apikey + '" /> \n\t\t\t                <QUERY objecttype="TrainStation"> \n\t\t\t                  <FILTER>\n                  \t\t\t\t<WITHIN name="Geometry.SWEREF99TM" shape="center" value="674130 6579686" radius="10000" />\n            \t\t\t\t\t\t</FILTER> \n\t\t                    <INCLUDE>Prognosticated</INCLUDE> \n\t\t                    <INCLUDE>AdvertisedLocationName</INCLUDE> \n\t\t                    <INCLUDE>LocationSignature</INCLUDE> \n\t\t                    <INCLUDE>Geometry.SWEREF99TM</INCLUDE>  \n\t\t\t                </QUERY>\n\t\t\t             </REQUEST>';

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

		fetchRequest.then(function (end) {
			setTimeout(View.loadingIndicatorOff, 1000); // Timeout for show off
			var stations = end.RESPONSE.RESULT[0].TrainStation;
			View.showTrainStations(stations);
		});
	};

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
			setTimeout(View.loadingIndicatorOff, 1000); // Timeout for show off
			var situations = data.RESPONSE.RESULT[0].Situation;
			View.showSituations(situations);
		});
	};

	/**
  * Get train messages from API
  */
	var getTrainMessagesFromAPI = function getTrainMessagesFromAPI() {
		View.loadingIndicatorOn();

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
			setTimeout(View.loadingIndicatorOff, 1000); // Timeout for show off
			var trainMessages = data.RESPONSE.RESULT[0].TrainMessage;
			View.showTrainMessages(trainMessages);
		});
	};

	return {
		getTrainStationsFromAPI: getTrainStationsFromAPI,
		getSituationsFromAPI: getSituationsFromAPI,
		getTrainMessagesFromAPI: getTrainMessagesFromAPI
	}; // end of return
}(); // end of Model


/**
 * View
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

				htmlChunk += '<div class="train-stations"><h5>' + station.AdvertisedLocationName + '</h5> (' + station.LocationSignature + '): ' + station.Geometry.SWEREF99TM + '</div> ';
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
	function showTrainMessages(messages) {
		var trainMessageList = document.getElementById('trainMessageList');
		var htmlChunk = '';
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var message = _step2.value;

				htmlChunk += '<div class="train-messages">\n\t\t\t\t\t\t\t\t\t\t\t<h5>' + message.AffectedLocation + '</h5> \n\t\t\t\t\t\t\t\t\t\t\t<p>(' + message.ExternalDescription + '): ' + message.ReasonCodeText + '</p></div> ';
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

					var icon = '<img src="http://api.trafikinfo.trafikverket.se/v1/icons/' + iconId + '?type=svg" class="situation-icon">';

					htmlChunk += '<div class="situation">\n\t\t\t\t\t\t\t\t\t\t\t\t' + icon + '\n\t\t\t\t\t\t\t\t\t\t\t\t<h5>' + messageType + '</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t' + message + '<br>\n\t\t\t\t\t\t\t\t\t\t\t\tPublicerat: ' + creationTime + '\n\t\t\t\t\t\t\t\t\t\t\t</div>';
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7OztBQUdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFVBQVMsS0FBVCxFQUFnQjtBQUM3RCxVQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsZ0JBQXJDLENBQXNELE9BQXRELEVBQStELE1BQU0sb0JBQXJFO0FBQ0EsVUFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLGdCQUF2QyxDQUF3RCxPQUF4RCxFQUFpRSxNQUFNLHVCQUF2RTtBQUNBLE9BQU0sb0JBQU47QUFDQSxDQUpEOztBQU9BOzs7QUFHQSxJQUFNLFFBQVUsWUFBVzs7QUFFMUIsS0FBTSxTQUFTLGtDQUFmO0FBQ0EsS0FBTSxNQUFNLHVEQUFaOztBQUVBOzs7QUFHQSxLQUFJLDBCQUEwQixTQUExQix1QkFBMEIsR0FBVTtBQUN2QyxPQUFLLGtCQUFMO0FBQ0MsTUFBSSw0RUFDd0MsTUFEeEMsZ2tCQUFKOztBQWFBLE1BQUksZUFBZSxNQUFNLEdBQU4sRUFDbkI7QUFDRSxXQUFRLE1BRFY7QUFFRSxTQUFNLE1BRlI7QUFHRSxTQUFNLFFBSFI7QUFJRSxZQUFTO0FBQ1Asb0JBQWdCO0FBRFQ7QUFKWCxHQURtQixFQVNsQixJQVRrQixDQVNiLFVBQUMsUUFBRCxFQUFjO0FBQ2xCLFVBQU8sU0FBUyxJQUFULEVBQVA7QUFDRCxHQVhrQixFQVluQixLQVptQixDQVliLGlCQUFTO0FBQ2QsV0FBUSxHQUFSLENBQVksS0FBWjtBQUNBLEdBZGtCLENBQW5COztBQWdCRCxlQUFhLElBQWIsQ0FBa0IsZUFBTztBQUN4QixjQUFXLEtBQUssbUJBQWhCLEVBQXFDLElBQXJDLEVBRHdCLENBQ3NCO0FBQzlDLE9BQUksV0FBVyxJQUFJLFFBQUosQ0FBYSxNQUFiLENBQW9CLENBQXBCLEVBQXVCLFlBQXRDO0FBQ0EsUUFBSyxpQkFBTCxD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U0FBVixDQUFvQixDQUFwQixFQUF1QixZQUF2QixDQUFvQyxTQUFwQyxDQUE4QyxDQUE5QyxFQUFnRCxFQUFoRCxDQUFuQjs7QUFFQSxTQUFJLHFFQUFtRSxNQUFuRSx1Q0FBSjs7QUFFQSx3RUFDVSxJQURWLHNDQUVjLFdBRmQsdUNBR1UsT0FIVixrREFJc0IsWUFKdEI7QUFNQTtBQUNEO0FBckJpQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNCbEMsaUJBQWUsU0FBZixHQUEyQixTQUEzQjtBQUNBOztBQUVELFFBQU87QUFDTixzQkFBb0Isa0JBRGQ7QUFFTix1QkFBcUIsbUJBRmY7QUFHTixxQkFBbUIsaUJBSGI7QUFJTixxQkFBbUIsaUJBSmI7QUFLTixrQkFBZ0I7QUFMVixFQUFQLENBdEV5QixDQTRFdEI7QUFDSCxDQTdFYSxFQUFkLEMsQ0E2RU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBFdmVudGxpc3RlbmVyIHRvIGFwcGx5IGNsaWNrLWZ1bmN0aW9ucyBhbmQgbG9hZCBjb250ZW50IGF0IGluaXQgLi4uXG4gKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBNb2RlbC5nZXRTaXR1YXRpb25zRnJvbUFQSSk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFpbkJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgTW9kZWwuZ2V0VHJhaW5NZXNzYWdlc0Zyb21BUEkpO1xuXHRNb2RlbC5nZXRTaXR1YXRpb25zRnJvbUFQSSgpO1xufSk7XG5cblxuLyoqXG4gKiBNb2RlbFxuICovXG5jb25zdCBNb2RlbCAgPSAoZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgYXBpa2V5ID0gJ2RhNDVjMjc1YmY3MjQ3MjFiMWE3MDYxODJhZGNmZjFiJztcblx0Y29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLnRyYWZpa2luZm8udHJhZmlrdmVya2V0LnNlL3YxLjEvZGF0YS5qc29uJztcblxuXHQvKipcblx0ICogR2V0IHRyYWluIHN0YXRpb25zIGZyb20gQVBJXG5cdCAqL1xuXHR2YXIgZ2V0VHJhaW5TdGF0aW9uc0Zyb21BUEkgPSBmdW5jdGlvbigpeyBcblx0XHRWaWV3LmxvYWRpbmdJbmRpY2F0b3JPbigpO1xuXHQgIHZhciBxdWVzdGlvbiA9IGA8UkVRVUVTVD4gXG5cdFx0XHQgICAgICAgICAgICAgICAgPExPR0lOIGF1dGhlbnRpY2F0aW9ua2V5PVwiJHthcGlrZXl9XCIgLz4gXG5cdFx0XHQgICAgICAgICAgICAgICAgPFFVRVJZIG9iamVjdHR5cGU9XCJUcmFpblN0YXRpb25cIj4gXG5cdFx0XHQgICAgICAgICAgICAgICAgICA8RklMVEVSPlxuICAgICAgICAgICAgICAgICAgXHRcdFx0XHQ8V0lUSElOIG5hbWU9XCJHZW9tZXRyeS5TV0VSRUY5OVRNXCIgc2hhcGU9XCJjZW50ZXJcIiB2YWx1ZT1cIjY3NDEzMCA2NTc5Njg2XCIgcmFkaXVzPVwiMTAwMDBcIiAvPlxuICAgICAgICAgICAgXHRcdFx0XHRcdFx0PC9GSUxURVI+IFxuXHRcdCAgICAgICAgICAgICAgICAgICAgPElOQ0xVREU+UHJvZ25vc3RpY2F0ZWQ8L0lOQ0xVREU+IFxuXHRcdCAgICAgICAgICAgICAgICAgICAgPElOQ0xVREU+QWR2ZXJ0aXNlZExvY2F0aW9uTmFtZTwvSU5DTFVERT4gXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8SU5DTFVERT5Mb2NhdGlvblNpZ25hdHVyZTwvSU5DTFVERT4gXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8SU5DTFVERT5HZW9tZXRyeS5TV0VSRUY5OVRNPC9JTkNMVURFPiAgXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9RVUVSWT5cblx0XHRcdCAgICAgICAgICAgICA8L1JFUVVFU1Q+YDtcblxuXHQgIHZhciBmZXRjaFJlcXVlc3QgPSBmZXRjaCh1cmwsXG5cdCAge1xuXHQgICAgbWV0aG9kOiAncG9zdCcsXG5cdCAgICBtb2RlOiAnY29ycycsIFxuXHQgICAgYm9keTogcXVlc3Rpb24sXG5cdCAgICBoZWFkZXJzOiB7XG5cdCAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnXG5cdCBcdFx0fVxuXHQgIH0pXG5cdCAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdCAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHQgIH0pXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcblx0ICBcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0ICB9KTtcblxuXHRcdGZldGNoUmVxdWVzdC50aGVuKGVuZCA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KFZpZXcubG9hZGluZ0luZGljYXRvck9mZiwgMTAwMCk7ICAgLy8gVGltZW91dCBmb3Igc2hvdyBvZmZcblx0XHRcdHZhciBzdGF0aW9ucyA9IGVuZC5SRVNQT05TRS5SRVNVTFRbMF0uVHJhaW5TdGF0aW9uO1xuXHRcdFx0Vmlldy5zaG93VHJhaW5TdGF0aW9ucyhzdGF0aW9ucyk7XG5cdFx0fSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldCB0cmFmZmljIHNpdHVhdGlvbiBpbmZvcm1hdGlvbiBmcm9tIEFQSVxuXHQgKi9cblx0dmFyIGdldFNpdHVhdGlvbnNGcm9tQVBJID0gZnVuY3Rpb24oKXsgXG5cdFx0Vmlldy5sb2FkaW5nSW5kaWNhdG9yT24oKTtcblxuXHRcdC8vIFNXRVJFRjk5VE0ta29vcmRpbmF0ZXIgZsO2ciBTdG9ja2hvbG06IDY3NDEzMCA2NTc5Njg2LCAxMDAwMCA9IDEgbWlsXG5cdFx0dmFyIHF1ZXN0aW9uID0gYFxuXHRcdDxSRVFVRVNUPlxuICAgICAgPExPR0lOIGF1dGhlbnRpY2F0aW9ua2V5PVwiJHthcGlrZXl9XCIgLz5cbiAgICAgIDxRVUVSWSBvYmplY3R0eXBlPVwiU2l0dWF0aW9uXCI+XG4gICAgICAgIDxGSUxURVI+XG4gICAgICAgIFx0XHRcdDxXSVRISU4gbmFtZT1cIkRldmlhdGlvbi5HZW9tZXRyeS5TV0VSRUY5OVRNXCIgc2hhcGU9XCJjZW50ZXJcIiB2YWx1ZT1cIjY3NDEzMCA2NTc5Njg2XCIgcmFkaXVzPVwiMzAwMDBcIiAvPlxuICAgICAgICAgICAgICA8RVEgbmFtZT1cIkRldmlhdGlvbi5NZXNzYWdlVHlwZVwiIHZhbHVlPVwiVsOkZ2FyYmV0ZVwiIC8+XG4gICAgICAgIDwvRklMVEVSPlxuICAgICAgICA8SU5DTFVERT5EZXZpYXRpb24uSWQ8L0lOQ0xVREU+XG4gICAgICAgIDxJTkNMVURFPkRldmlhdGlvbi5NZXNzYWdlVHlwZTwvSU5DTFVERT5cbiAgICAgICAgPElOQ0xVREU+RGV2aWF0aW9uLk1lc3NhZ2U8L0lOQ0xVREU+XG4gICAgICAgIDxJTkNMVURFPkRldmlhdGlvbi5JY29uSWQ8L0lOQ0xVREU+XG4gICAgICAgIDxJTkNMVURFPkRldmlhdGlvbi5DcmVhdGlvblRpbWU8L0lOQ0xVREU+XG4gICAgICAgIDxJTkNMVURFPkRldmlhdGlvbi5HZW9tZXRyeS5TV0VSRUY5OVRNPC9JTkNMVURFPlxuICAgICAgPC9RVUVSWT5cblx0XHQ8L1JFUVVFU1Q+XG5cdFx0YDtcblxuXHQgIHZhciBmZXRjaFJlcXVlc3QgPSBmZXRjaCh1cmwsXG5cdCAge1xuXHQgICAgbWV0aG9kOiAncG9zdCcsXG5cdCAgICBtb2RlOiAnY29ycycsIFxuXHQgICAgYm9keTogcXVlc3Rpb24sXG5cdCAgICBoZWFkZXJzOiB7XG5cdCAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnXG5cdCBcdFx0fVxuXHQgIH0pXG5cdCAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdCAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHQgIH0pXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcblx0ICBcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0ICB9KTtcblxuXHRcdGZldGNoUmVxdWVzdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0c2V0VGltZW91dChWaWV3LmxvYWRpbmdJbmRpY2F0b3JPZmYsIDEwMDApOyAgIC8vIFRpbWVvdXQgZm9yIHNob3cgb2ZmXG5cdFx0XHR2YXIgc2l0dWF0aW9ucyA9IGRhdGEuUkVTUE9OU0UuUkVTVUxUWzBdLlNpdHVhdGlvbjtcblx0XHRcdFZpZXcuc2hvd1NpdHVhdGlvbnMoc2l0dWF0aW9ucyk7XG5cdFx0fSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldCB0cmFpbiBtZXNzYWdlcyBmcm9tIEFQSVxuXHQgKi9cblx0dmFyIGdldFRyYWluTWVzc2FnZXNGcm9tQVBJID0gZnVuY3Rpb24oKXsgXG5cdFx0Vmlldy5sb2FkaW5nSW5kaWNhdG9yT24oKTtcblx0XHRcblx0XHR2YXIgcXVlc3Rpb24gPSBgXG5cdFx0PFJFUVVFU1Q+XG5cdCAgICA8TE9HSU4gYXV0aGVudGljYXRpb25rZXk9XCIke2FwaWtleX1cIiAvPlxuXHQgICAgPFFVRVJZIG9iamVjdHR5cGU9XCJUcmFpbk1lc3NhZ2VcIj5cblx0ICAgICAgPEZJTFRFUj5cblx0ICAgICAgXHRcdFx0PFdJVEhJTiBuYW1lPVwiR2VvbWV0cnkuU1dFUkVGOTlUTVwiIHNoYXBlPVwiY2VudGVyXCIgdmFsdWU9XCI2NzQxMzAgNjU3OTY4NlwiIHJhZGl1cz1cIjMwMDAwXCIgLz5cblx0ICAgICAgPC9GSUxURVI+XG5cdCAgICA8L1FVRVJZPlxuXHRcdDwvUkVRVUVTVD5cblx0XHRgO1xuXG5cdCAgdmFyIGZldGNoUmVxdWVzdCA9IGZldGNoKHVybCxcblx0ICB7XG5cdCAgICBtZXRob2Q6ICdwb3N0Jyxcblx0ICAgIG1vZGU6ICdjb3JzJywgXG5cdCAgICBib2R5OiBxdWVzdGlvbixcblx0ICAgIGhlYWRlcnM6IHtcblx0ICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCdcblx0IFx0XHR9XG5cdCAgfSlcblx0ICAudGhlbigocmVzcG9uc2UpID0+IHtcblx0ICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdCAgfSlcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xuXHQgIFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHQgIH0pO1xuXG5cdFx0ZmV0Y2hSZXF1ZXN0LnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KFZpZXcubG9hZGluZ0luZGljYXRvck9mZiwgMTAwMCk7ICAgLy8gVGltZW91dCBmb3Igc2hvdyBvZmZcblx0XHRcdHZhciB0cmFpbk1lc3NhZ2VzID0gZGF0YS5SRVNQT05TRS5SRVNVTFRbMF0uVHJhaW5NZXNzYWdlO1xuXHRcdFx0Vmlldy5zaG93VHJhaW5NZXNzYWdlcyh0cmFpbk1lc3NhZ2VzKTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFRyYWluU3RhdGlvbnNGcm9tQVBJOiBnZXRUcmFpblN0YXRpb25zRnJvbUFQSSxcblx0XHRnZXRTaXR1YXRpb25zRnJvbUFQSTogZ2V0U2l0dWF0aW9uc0Zyb21BUEksXG5cdFx0Z2V0VHJhaW5NZXNzYWdlc0Zyb21BUEk6IGdldFRyYWluTWVzc2FnZXNGcm9tQVBJXG5cdH07IC8vIGVuZCBvZiByZXR1cm5cbn0pKCk7IC8vIGVuZCBvZiBNb2RlbFxuXG5cblxuLyoqXG4gKiBWaWV3XG4gKi9cbmNvbnN0IFZpZXcgID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGxvYWRpbmdJbmRpY2F0b3JPbigpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmdJbmRpY2F0b3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gbG9hZGluZ0luZGljYXRvck9mZigpe1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZ0luZGljYXRvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdH1cblxuXHQvKipcblx0ICogU2hvdyBhbGwgdHJhaW4gc3RhdGlvbnMgaW4gaW5kZXguaHRtbFxuXHQgKiBAcGFyYW0gIHtBcnJheX0gc3RhdGlvbnMgICBBcnJheSBvZiBzdGF0aW9uIG9iamVjdHNcblx0ICovXG5cdGZ1bmN0aW9uIHNob3dUcmFpblN0YXRpb25zKHN0YXRpb25zKXtcblx0XHR2YXIgdHJhaW5TdGF0aW9uTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFpblN0YXRpb25MaXN0Jyk7XG5cdFx0Y29uc29sZS5sb2coc3RhdGlvbnMpO1xuXHRcdHZhciBodG1sQ2h1bmsgPSAnJztcblx0XHRmb3IodmFyIHN0YXRpb24gb2Ygc3RhdGlvbnMpe1xuXHRcdFx0aHRtbENodW5rICs9IGA8ZGl2IGNsYXNzPVwidHJhaW4tc3RhdGlvbnNcIj48aDU+JHtzdGF0aW9uLkFkdmVydGlzZWRMb2NhdGlvbk5hbWV9PC9oNT4gKCR7c3RhdGlvbi5Mb2NhdGlvblNpZ25hdHVyZX0pOiAke3N0YXRpb24uR2VvbWV0cnkuU1dFUkVGOTlUTX08L2Rpdj4gYDtcblx0XHR9XG5cdFx0dHJhaW5TdGF0aW9uTGlzdC5pbm5lckhUTUwgPSBodG1sQ2h1bms7XG5cdH1cblxuXHQvKipcblx0ICogU2hvdyB0cmFpbiBtZXNzYWdlcyBpbiBpbmRleC5odG1sXG5cdCAqIEBwYXJhbSAge0FycmF5fSBtZXNzYWdlcyBcdEFycmF5IG9mIG1lc3NhZ2Ugb2JqZWN0c1xuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd1RyYWluTWVzc2FnZXMobWVzc2FnZXMpe1xuXHRcdHZhciB0cmFpbk1lc3NhZ2VMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWluTWVzc2FnZUxpc3QnKTtcblx0XHR2YXIgaHRtbENodW5rID0gJyc7XG5cdFx0Zm9yKHZhciBtZXNzYWdlIG9mIG1lc3NhZ2VzKXtcblx0XHRcdGh0bWxDaHVuayArPSBgPGRpdiBjbGFzcz1cInRyYWluLW1lc3NhZ2VzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGg1PiR7bWVzc2FnZS5BZmZlY3RlZExvY2F0aW9ufTwvaDU+IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPigke21lc3NhZ2UuRXh0ZXJuYWxEZXNjcmlwdGlvbn0pOiAke21lc3NhZ2UuUmVhc29uQ29kZVRleHR9PC9wPjwvZGl2PiBgO1xuXHRcdH1cblx0XHR0cmFpbk1lc3NhZ2VMaXN0LmlubmVySFRNTCA9IGh0bWxDaHVuaztcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93IHRyYWZmaWMgc2l0dWF0aW9ucyBpbiBpbmRleC5odG1sXG5cdCAqIEBwYXJhbSAge0FycmF5fSBzaXR1YXRpb25zIFx0QXJyYXkgb2Ygc2l0dWF0aW9uIG9iamVjdHNcblx0ICovXG5cdGZ1bmN0aW9uIHNob3dTaXR1YXRpb25zKHNpdHVhdGlvbnMpe1xuXG5cdFx0dmFyIHNpdHVhdGlvbnNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpdHVhdGlvbnNMaXN0Jyk7XG5cdFx0dmFyIGh0bWxDaHVuayA9ICcnO1xuXHRcdGZvcih2YXIgc2l0dWF0aW9uIG9mIHNpdHVhdGlvbnMpe1xuXG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgc2l0dWF0aW9uLkRldmlhdGlvbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciBtZXNzYWdlVHlwZSA9IHNpdHVhdGlvbi5EZXZpYXRpb25baV0uTWVzc2FnZVR5cGU7XG5cdFx0XHRcdHZhciBpY29uSWQgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLkljb25JZDtcblx0XHRcdFx0dmFyIG1lc3NhZ2UgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLk1lc3NhZ2U7XG5cdFx0XHRcdHZhciBjcmVhdGlvblRpbWUgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLkNyZWF0aW9uVGltZS5zdWJzdHJpbmcoMCwxMCk7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgaWNvbiA9IGA8aW1nIHNyYz1cImh0dHA6Ly9hcGkudHJhZmlraW5mby50cmFmaWt2ZXJrZXQuc2UvdjEvaWNvbnMvJHtpY29uSWR9P3R5cGU9c3ZnXCIgY2xhc3M9XCJzaXR1YXRpb24taWNvblwiPmA7XG5cblx0XHRcdFx0aHRtbENodW5rICs9IGA8ZGl2IGNsYXNzPVwic2l0dWF0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQke2ljb259XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aDU+JHttZXNzYWdlVHlwZX08L2g1PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHttZXNzYWdlfTxicj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFB1YmxpY2VyYXQ6ICR7Y3JlYXRpb25UaW1lfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PmA7XG5cdFx0XHR9XHRcblx0XHR9XG5cdFx0c2l0dWF0aW9uc0xpc3QuaW5uZXJIVE1MID0gaHRtbENodW5rO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsb2FkaW5nSW5kaWNhdG9yT246IGxvYWRpbmdJbmRpY2F0b3JPbixcblx0XHRsb2FkaW5nSW5kaWNhdG9yT2ZmOiBsb2FkaW5nSW5kaWNhdG9yT2ZmLFxuXHRcdHNob3dUcmFpblN0YXRpb25zOiBzaG93VHJhaW5TdGF0aW9ucyxcblx0XHRzaG93VHJhaW5NZXNzYWdlczogc2hvd1RyYWluTWVzc2FnZXMsXG5cdFx0c2hvd1NpdHVhdGlvbnM6IHNob3dTaXR1YXRpb25zXG5cdH07IC8vIGVuZCBvZiByZXR1cm5cbn0pKCk7IC8vIGVuZCBvZiBWaWV3XG5cbiJdfQ==
