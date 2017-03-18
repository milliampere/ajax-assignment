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
	var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';

	var getTrainStationsFromAPI = function getTrainStationsFromAPI() {
		View.loadingIndicatorOn();
		var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';
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

	var getSituationsFromAPI = function getSituationsFromAPI() {

		View.loadingIndicatorOn();

		var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';

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
  * Show all train stations
  * @param  {Array} stations   Array of all stations
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7OztBQUdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFVBQVMsS0FBVCxFQUFnQjtBQUM3RCxVQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsZ0JBQXJDLENBQXNELE9BQXRELEVBQStELE1BQU0sb0JBQXJFO0FBQ0EsVUFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLGdCQUF2QyxDQUF3RCxPQUF4RCxFQUFpRSxNQUFNLHVCQUF2RTtBQUNBLE9BQU0sb0JBQU47QUFDQSxDQUpEOztBQU9BOzs7QUFHQSxJQUFNLFFBQVUsWUFBVTs7QUFFekIsS0FBTSxTQUFTLGtDQUFmO0FBQ0EsS0FBTSxNQUFNLHNEQUFaOztBQUVBLEtBQUksMEJBQTBCLFNBQTFCLHVCQUEwQixHQUFVO0FBQ3ZDLE9BQUssa0JBQUw7QUFDQSxNQUFJLE1BQU0sc0RBQVY7QUFDQyxNQUFJLDRFQUN3QyxNQUR4Qyxna0JBQUo7O0FBYUEsTUFBSSxlQUFlLE1BQU0sR0FBTixFQUNuQjtBQUNFLFdBQVEsTUFEVjtBQUVFLFNBQU0sTUFGUjtBQUdFLFNBQU0sUUFIUjtBQUlFLFlBQVM7QUFDUCxvQkFBZ0I7QUFEVDtBQUpYLEdBRG1CLEVBU2xCLElBVGtCLENBU2IsVUFBQyxRQUFELEVBQWM7QUFDbEIsVUFBTyxTQUFTLElBQVQsRUFBUDtBQUNELEdBWGtCLEVBWW5CLEtBWm1CLENBWWIsaUJBQVM7QUFDZCxXQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsR0Fka0IsQ0FBbkI7O0FBZ0JELGVBQWEsSUFBYixDQUFrQixlQUFPO0FBQ3hCLGNBQVcsS0FBSyxtQkFBaEIsRUFBcUMsSUFBckMsRUFEd0IsQ0FDc0I7QUFDOUMsT0FBSSxXQUFXLElBQUksUUFBSixDQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsWUFBdEM7QUFDQSxRQUFLLGlCQUFMLENBQXVCLFFBQXZCO0FBQ0EsR0FKRDtBQUtBLEVBckNEOztBQXVDQSxLQUFJLHVCQUF1QixTQUF2QixvQkFBdUIsR0FBVTs7QUFFcEMsT0FBSyxrQkFBTDs7QUFFQSxNQUFJLE1BQU0sc0RBQVY7O0FBRUE7QUFDQSxNQUFJLGlFQUU0QixNQUY1Qix5bEJBQUo7O0FBa0JDLE1BQUksZUFBZSxNQUFNLEdBQU4sRUFDbkI7QUFDRSxXQUFRLE1BRFY7QUFFRSxTQUFNLE1BRlI7QUFHRSxTQUFNLFFBSFI7QUFJRSxZQUFTO0FBQ1Asb0JBQWdCO0FBRFQ7QUFKWCxHQURtQixFQVNsQixJQVRrQixDQVNiLFVBQUMsUUFBRCxFQUFjO0FBQ2xCLFVBQU8sU0FBUyxJQUFULEVBQVA7QUFDRCxHQVhrQixFQVluQixLQVptQixDQVliLGlCQUFTO0FBQ2QsV0FBUSxHQUFSLENBQVksS0FBWjtBQUNBLEdBZGtCLENBQW5COztBQWdCRCxlQUFhLElBQWIsQ0FBa0IsZ0JBQVE7QUFDekIsY0FBVyxLQUFLLG1CQUFoQixFQUFxQyxJQUFyQyxFQUR5QixDQUNxQjtBQUM5QyxPQUFJLGFBQWEsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixDQUFyQixFQUF3QixTQUF6QztBQUNBLFFBQUssY0FBTCxDQUFvQixVQUFwQjtBQUNBLEdBSkQ7QUFLQSxFQTlDRDs7QUFnREEsS0FBSSwwQkFBMEIsU0FBMUIsdUJBQTBCLEdBQVU7O0FBRXZDLE9BQUssa0JBQUw7O0FBRUEsTUFBSSxpRUFFMkIsTUFGM0IsdU9BQUo7O0FBV0MsTUFBSSxlQUFlLE1BQU0sR0FBTixFQUNuQjtBQUNFLFdBQVEsTUFEVjtBQUVFLFNBQU0sTUFGUjtBQUdFLFNBQU0sUUFIUjtBQUlFLFlBQVM7QUFDUCxvQkFBZ0I7QUFEVDtBQUpYLEdBRG1CLEVBU2xCLElBVGtCLENBU2IsVUFBQyxRQUFELEVBQWM7QUFDbEIsVUFBTyxTQUFTLElBQVQsRUFBUDtBQUNELEdBWGtCLEVBWW5CLEtBWm1CLENBWWIsaUJBQVM7QUFDZCxXQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsR0Fka0IsQ0FBbkI7O0FBZ0JELGVBQWEsSUFBYixDQUFrQixnQkFBUTtBQUN6QixjQUFXLEtBQUssbUJBQWhCLEVBQXFDLElBQXJDLEVBRHlCLENBQ3FCO0FBQzlDLE9BQUksZ0JBQWdCLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0IsWUFBNUM7QUFDQSxRQUFLLGlCQUFMLENBQXVCLGFBQXZCO0FBQ0EsR0FKRDtBQUtBLEVBcENEOztBQXNDQSxRQUFPO0FBQ04sMkJBQXlCLHVCQURuQjtBQUVOLHdCQUFzQixvQkFGaEI7QUFHTiwyQkFBeUI7QUFIbkIsRUFBUCxDQWxJeUIsQ0FzSXRCO0FBQ0gsQ0F2SWMsRUFBZixDLENBdUlNOzs7QUFJTjs7O0FBR0EsSUFBTSxPQUFTLFlBQVU7O0FBRXhCLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsV0FBUyxjQUFULENBQXdCLGtCQUF4QixFQUE0QyxLQUE1QyxDQUFrRCxPQUFsRCxHQUE0RCxPQUE1RDtBQUNBLFdBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQyxLQUFuQyxDQUF5QyxPQUF6QyxHQUFtRCxNQUFuRDtBQUNBOztBQUVELFVBQVMsbUJBQVQsR0FBOEI7QUFDN0IsV0FBUyxjQUFULENBQXdCLGtCQUF4QixFQUE0QyxLQUE1QyxDQUFrRCxPQUFsRCxHQUE0RCxNQUE1RDtBQUNBLFdBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQyxLQUFuQyxDQUF5QyxPQUF6QyxHQUFtRCxPQUFuRDtBQUNBOztBQUVEOzs7O0FBSUEsVUFBUyxpQkFBVCxDQUEyQixRQUEzQixFQUFvQztBQUNuQyxNQUFJLG1CQUFtQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCO0FBQ0EsVUFBUSxHQUFSLENBQVksUUFBWjtBQUNBLE1BQUksWUFBWSxFQUFoQjtBQUhtQztBQUFBO0FBQUE7O0FBQUE7QUFJbkMsd0JBQW1CLFFBQW5CLDhIQUE0QjtBQUFBLFFBQXBCLE9BQW9COztBQUMzQixzREFBZ0QsUUFBUSxzQkFBeEQsZUFBd0YsUUFBUSxpQkFBaEcsV0FBdUgsUUFBUSxRQUFSLENBQWlCLFVBQXhJO0FBQ0E7QUFOa0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPbkMsbUJBQWlCLFNBQWpCLEdBQTZCLFNBQTdCO0FBQ0E7O0FBRUQsVUFBUyxpQkFBVCxDQUEyQixRQUEzQixFQUFvQztBQUNuQyxNQUFJLG1CQUFtQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCO0FBQ0EsTUFBSSxZQUFZLEVBQWhCO0FBRm1DO0FBQUE7QUFBQTs7QUFBQTtBQUduQyx5QkFBbUIsUUFBbkIsbUlBQTRCO0FBQUEsUUFBcEIsT0FBb0I7O0FBQzNCLDhFQUNjLFFBQVEsZ0JBRHRCLDBDQUVjLFFBQVEsbUJBRnRCLFdBRStDLFFBQVEsY0FGdkQ7QUFHQTtBQVBrQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFuQyxtQkFBaUIsU0FBakIsR0FBNkIsU0FBN0I7QUFDQTs7QUFFRCxVQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBbUM7O0FBRWxDLE1BQUksaUJBQWlCLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FBckI7QUFDQSxNQUFJLFlBQVksRUFBaEI7QUFIa0M7QUFBQTtBQUFBOztBQUFBO0FBSWxDLHlCQUFxQixVQUFyQixtSUFBZ0M7QUFBQSxRQUF4QixTQUF3Qjs7O0FBRS9CLFNBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLFVBQVUsU0FBVixDQUFvQixNQUF2QyxFQUErQyxHQUEvQyxFQUFtRDtBQUNsRCxTQUFJLGNBQWMsVUFBVSxTQUFWLENBQW9CLENBQXBCLEVBQXVCLFdBQXpDO0FBQ0EsU0FBSSxTQUFTLFVBQVUsU0FBVixDQUFvQixDQUFwQixFQUF1QixNQUFwQztBQUNBLFNBQUksVUFBVSxVQUFVLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUIsT0FBckM7QUFDQSxTQUFJLGVBQWUsVUFBVSxTQUFWLENBQW9CLENBQXBCLEVBQXVCLFlBQXZCLENBQW9DLFNBQXBDLENBQThDLENBQTlDLEVBQWdELEVBQWhELENBQW5COztBQUVBLFNBQUkscUVBQW1FLE1BQW5FLHVDQUFKOztBQUVBLHdFQUNVLElBRFYsc0NBRWMsV0FGZCx1Q0FHVSxPQUhWLGtEQUlzQixZQUp0QjtBQU1BO0FBQ0Q7QUFyQmlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBc0JsQyxpQkFBZSxTQUFmLEdBQTJCLFNBQTNCO0FBQ0E7O0FBRUQsUUFBTztBQUNOLHNCQUFvQixrQkFEZDtBQUVOLHVCQUFxQixtQkFGZjtBQUdOLHFCQUFtQixpQkFIYjtBQUlOLHFCQUFtQixpQkFKYjtBQUtOLGtCQUFnQjtBQUxWLEVBQVAsQ0E5RHdCLENBb0VyQjtBQUNILENBckVhLEVBQWQsQyxDQXFFTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEV2ZW50bGlzdGVuZXIgdG8gYXBwbHkgY2xpY2stZnVuY3Rpb25zIGFuZCBsb2FkIGNvbnRlbnQgYXQgaW5pdCAuLi5cbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIE1vZGVsLmdldFNpdHVhdGlvbnNGcm9tQVBJKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWluQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBNb2RlbC5nZXRUcmFpbk1lc3NhZ2VzRnJvbUFQSSk7XG5cdE1vZGVsLmdldFNpdHVhdGlvbnNGcm9tQVBJKCk7XG59KTtcblxuXG4vKipcbiAqIE1vZGVsXG4gKi9cbmNvbnN0IE1vZGVsICA9IChmdW5jdGlvbigpe1xuXG5cdGNvbnN0IGFwaWtleSA9ICdkYTQ1YzI3NWJmNzI0NzIxYjFhNzA2MTgyYWRjZmYxYic7XG5cdGNvbnN0IHVybCA9ICdodHRwOi8vYXBpLnRyYWZpa2luZm8udHJhZmlrdmVya2V0LnNlL3YxLjEvZGF0YS5qc29uJztcblxuXHR2YXIgZ2V0VHJhaW5TdGF0aW9uc0Zyb21BUEkgPSBmdW5jdGlvbigpeyBcblx0XHRWaWV3LmxvYWRpbmdJbmRpY2F0b3JPbigpO1xuXHRcdHZhciB1cmwgPSAnaHR0cDovL2FwaS50cmFmaWtpbmZvLnRyYWZpa3ZlcmtldC5zZS92MS4xL2RhdGEuanNvbic7XG5cdCAgdmFyIHF1ZXN0aW9uID0gYDxSRVFVRVNUPiBcblx0XHRcdCAgICAgICAgICAgICAgICA8TE9HSU4gYXV0aGVudGljYXRpb25rZXk9XCIke2FwaWtleX1cIiAvPiBcblx0XHRcdCAgICAgICAgICAgICAgICA8UVVFUlkgb2JqZWN0dHlwZT1cIlRyYWluU3RhdGlvblwiPiBcblx0XHRcdCAgICAgICAgICAgICAgICAgIDxGSUxURVI+XG4gICAgICAgICAgICAgICAgICBcdFx0XHRcdDxXSVRISU4gbmFtZT1cIkdlb21ldHJ5LlNXRVJFRjk5VE1cIiBzaGFwZT1cImNlbnRlclwiIHZhbHVlPVwiNjc0MTMwIDY1Nzk2ODZcIiByYWRpdXM9XCIxMDAwMFwiIC8+XG4gICAgICAgICAgICBcdFx0XHRcdFx0XHQ8L0ZJTFRFUj4gXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8SU5DTFVERT5Qcm9nbm9zdGljYXRlZDwvSU5DTFVERT4gXG5cdFx0ICAgICAgICAgICAgICAgICAgICA8SU5DTFVERT5BZHZlcnRpc2VkTG9jYXRpb25OYW1lPC9JTkNMVURFPiBcblx0XHQgICAgICAgICAgICAgICAgICAgIDxJTkNMVURFPkxvY2F0aW9uU2lnbmF0dXJlPC9JTkNMVURFPiBcblx0XHQgICAgICAgICAgICAgICAgICAgIDxJTkNMVURFPkdlb21ldHJ5LlNXRVJFRjk5VE08L0lOQ0xVREU+ICBcblx0XHRcdCAgICAgICAgICAgICAgICA8L1FVRVJZPlxuXHRcdFx0ICAgICAgICAgICAgIDwvUkVRVUVTVD5gO1xuXG5cdCAgdmFyIGZldGNoUmVxdWVzdCA9IGZldGNoKHVybCxcblx0ICB7XG5cdCAgICBtZXRob2Q6ICdwb3N0Jyxcblx0ICAgIG1vZGU6ICdjb3JzJywgXG5cdCAgICBib2R5OiBxdWVzdGlvbixcblx0ICAgIGhlYWRlcnM6IHtcblx0ICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCdcblx0IFx0XHR9XG5cdCAgfSlcblx0ICAudGhlbigocmVzcG9uc2UpID0+IHtcblx0ICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdCAgfSlcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xuXHQgIFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHQgIH0pO1xuXG5cdFx0ZmV0Y2hSZXF1ZXN0LnRoZW4oZW5kID0+IHtcblx0XHRcdHNldFRpbWVvdXQoVmlldy5sb2FkaW5nSW5kaWNhdG9yT2ZmLCAxMDAwKTsgICAvLyBUaW1lb3V0IGZvciBzaG93IG9mZlxuXHRcdFx0dmFyIHN0YXRpb25zID0gZW5kLlJFU1BPTlNFLlJFU1VMVFswXS5UcmFpblN0YXRpb247XG5cdFx0XHRWaWV3LnNob3dUcmFpblN0YXRpb25zKHN0YXRpb25zKTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZ2V0U2l0dWF0aW9uc0Zyb21BUEkgPSBmdW5jdGlvbigpeyBcblxuXHRcdFZpZXcubG9hZGluZ0luZGljYXRvck9uKCk7XG5cblx0XHR2YXIgdXJsID0gJ2h0dHA6Ly9hcGkudHJhZmlraW5mby50cmFmaWt2ZXJrZXQuc2UvdjEuMS9kYXRhLmpzb24nO1xuXG5cdFx0Ly8gU1dFUkVGOTlUTS1rb29yZGluYXRlciBmw7ZyIFN0b2NraG9sbTogNjc0MTMwIDY1Nzk2ODYsIDEwMDAwID0gMSBtaWxcblx0XHR2YXIgcXVlc3Rpb24gPSBgXG5cdFx0PFJFUVVFU1Q+XG4gICAgICA8TE9HSU4gYXV0aGVudGljYXRpb25rZXk9XCIke2FwaWtleX1cIiAvPlxuICAgICAgPFFVRVJZIG9iamVjdHR5cGU9XCJTaXR1YXRpb25cIj5cbiAgICAgICAgPEZJTFRFUj5cbiAgICAgICAgXHRcdFx0PFdJVEhJTiBuYW1lPVwiRGV2aWF0aW9uLkdlb21ldHJ5LlNXRVJFRjk5VE1cIiBzaGFwZT1cImNlbnRlclwiIHZhbHVlPVwiNjc0MTMwIDY1Nzk2ODZcIiByYWRpdXM9XCIzMDAwMFwiIC8+XG4gICAgICAgICAgICAgIDxFUSBuYW1lPVwiRGV2aWF0aW9uLk1lc3NhZ2VUeXBlXCIgdmFsdWU9XCJWw6RnYXJiZXRlXCIgLz5cbiAgICAgICAgPC9GSUxURVI+XG4gICAgICAgIDxJTkNMVURFPkRldmlhdGlvbi5JZDwvSU5DTFVERT5cbiAgICAgICAgPElOQ0xVREU+RGV2aWF0aW9uLk1lc3NhZ2VUeXBlPC9JTkNMVURFPlxuICAgICAgICA8SU5DTFVERT5EZXZpYXRpb24uTWVzc2FnZTwvSU5DTFVERT5cbiAgICAgICAgPElOQ0xVREU+RGV2aWF0aW9uLkljb25JZDwvSU5DTFVERT5cbiAgICAgICAgPElOQ0xVREU+RGV2aWF0aW9uLkNyZWF0aW9uVGltZTwvSU5DTFVERT5cbiAgICAgICAgPElOQ0xVREU+RGV2aWF0aW9uLkdlb21ldHJ5LlNXRVJFRjk5VE08L0lOQ0xVREU+XG4gICAgICA8L1FVRVJZPlxuXHRcdDwvUkVRVUVTVD5cblx0XHRgO1xuXG5cdCAgdmFyIGZldGNoUmVxdWVzdCA9IGZldGNoKHVybCxcblx0ICB7XG5cdCAgICBtZXRob2Q6ICdwb3N0Jyxcblx0ICAgIG1vZGU6ICdjb3JzJywgXG5cdCAgICBib2R5OiBxdWVzdGlvbixcblx0ICAgIGhlYWRlcnM6IHtcblx0ICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCdcblx0IFx0XHR9XG5cdCAgfSlcblx0ICAudGhlbigocmVzcG9uc2UpID0+IHtcblx0ICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdCAgfSlcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xuXHQgIFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHQgIH0pO1xuXG5cdFx0ZmV0Y2hSZXF1ZXN0LnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KFZpZXcubG9hZGluZ0luZGljYXRvck9mZiwgMTAwMCk7ICAgLy8gVGltZW91dCBmb3Igc2hvdyBvZmZcblx0XHRcdHZhciBzaXR1YXRpb25zID0gZGF0YS5SRVNQT05TRS5SRVNVTFRbMF0uU2l0dWF0aW9uO1xuXHRcdFx0Vmlldy5zaG93U2l0dWF0aW9ucyhzaXR1YXRpb25zKTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZ2V0VHJhaW5NZXNzYWdlc0Zyb21BUEkgPSBmdW5jdGlvbigpeyBcblxuXHRcdFZpZXcubG9hZGluZ0luZGljYXRvck9uKCk7XG5cdFx0XG5cdFx0dmFyIHF1ZXN0aW9uID0gYFxuXHRcdDxSRVFVRVNUPlxuXHQgICAgPExPR0lOIGF1dGhlbnRpY2F0aW9ua2V5PVwiJHthcGlrZXl9XCIgLz5cblx0ICAgIDxRVUVSWSBvYmplY3R0eXBlPVwiVHJhaW5NZXNzYWdlXCI+XG5cdCAgICAgIDxGSUxURVI+XG5cdCAgICAgIFx0XHRcdDxXSVRISU4gbmFtZT1cIkdlb21ldHJ5LlNXRVJFRjk5VE1cIiBzaGFwZT1cImNlbnRlclwiIHZhbHVlPVwiNjc0MTMwIDY1Nzk2ODZcIiByYWRpdXM9XCIzMDAwMFwiIC8+XG5cdCAgICAgIDwvRklMVEVSPlxuXHQgICAgPC9RVUVSWT5cblx0XHQ8L1JFUVVFU1Q+XG5cdFx0YDtcblxuXHQgIHZhciBmZXRjaFJlcXVlc3QgPSBmZXRjaCh1cmwsXG5cdCAge1xuXHQgICAgbWV0aG9kOiAncG9zdCcsXG5cdCAgICBtb2RlOiAnY29ycycsIFxuXHQgICAgYm9keTogcXVlc3Rpb24sXG5cdCAgICBoZWFkZXJzOiB7XG5cdCAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnXG5cdCBcdFx0fVxuXHQgIH0pXG5cdCAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdCAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHQgIH0pXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcblx0ICBcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0ICB9KTtcblxuXHRcdGZldGNoUmVxdWVzdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0c2V0VGltZW91dChWaWV3LmxvYWRpbmdJbmRpY2F0b3JPZmYsIDEwMDApOyAgIC8vIFRpbWVvdXQgZm9yIHNob3cgb2ZmXG5cdFx0XHR2YXIgdHJhaW5NZXNzYWdlcyA9IGRhdGEuUkVTUE9OU0UuUkVTVUxUWzBdLlRyYWluTWVzc2FnZTtcblx0XHRcdFZpZXcuc2hvd1RyYWluTWVzc2FnZXModHJhaW5NZXNzYWdlcyk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRUcmFpblN0YXRpb25zRnJvbUFQSTogZ2V0VHJhaW5TdGF0aW9uc0Zyb21BUEksXG5cdFx0Z2V0U2l0dWF0aW9uc0Zyb21BUEk6IGdldFNpdHVhdGlvbnNGcm9tQVBJLFxuXHRcdGdldFRyYWluTWVzc2FnZXNGcm9tQVBJOiBnZXRUcmFpbk1lc3NhZ2VzRnJvbUFQSVxuXHR9OyAvLyBlbmQgb2YgcmV0dXJuXG59KSgpOyAvLyBlbmQgb2YgTW9kZWxcblxuXG5cbi8qKlxuICogVmlld1xuICovXG5jb25zdCBWaWV3ICA9IChmdW5jdGlvbigpe1xuXG5cdGZ1bmN0aW9uIGxvYWRpbmdJbmRpY2F0b3JPbigpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmdJbmRpY2F0b3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gbG9hZGluZ0luZGljYXRvck9mZigpe1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZ0luZGljYXRvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdH1cblxuXHQvKipcblx0ICogU2hvdyBhbGwgdHJhaW4gc3RhdGlvbnNcblx0ICogQHBhcmFtICB7QXJyYXl9IHN0YXRpb25zICAgQXJyYXkgb2YgYWxsIHN0YXRpb25zXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93VHJhaW5TdGF0aW9ucyhzdGF0aW9ucyl7XG5cdFx0dmFyIHRyYWluU3RhdGlvbkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhaW5TdGF0aW9uTGlzdCcpO1xuXHRcdGNvbnNvbGUubG9nKHN0YXRpb25zKTtcblx0XHR2YXIgaHRtbENodW5rID0gJyc7XG5cdFx0Zm9yKHZhciBzdGF0aW9uIG9mIHN0YXRpb25zKXtcblx0XHRcdGh0bWxDaHVuayArPSBgPGRpdiBjbGFzcz1cInRyYWluLXN0YXRpb25zXCI+PGg1PiR7c3RhdGlvbi5BZHZlcnRpc2VkTG9jYXRpb25OYW1lfTwvaDU+ICgke3N0YXRpb24uTG9jYXRpb25TaWduYXR1cmV9KTogJHtzdGF0aW9uLkdlb21ldHJ5LlNXRVJFRjk5VE19PC9kaXY+IGA7XG5cdFx0fVxuXHRcdHRyYWluU3RhdGlvbkxpc3QuaW5uZXJIVE1MID0gaHRtbENodW5rO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd1RyYWluTWVzc2FnZXMobWVzc2FnZXMpe1xuXHRcdHZhciB0cmFpbk1lc3NhZ2VMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWluTWVzc2FnZUxpc3QnKTtcblx0XHR2YXIgaHRtbENodW5rID0gJyc7XG5cdFx0Zm9yKHZhciBtZXNzYWdlIG9mIG1lc3NhZ2VzKXtcblx0XHRcdGh0bWxDaHVuayArPSBgPGRpdiBjbGFzcz1cInRyYWluLW1lc3NhZ2VzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGg1PiR7bWVzc2FnZS5BZmZlY3RlZExvY2F0aW9ufTwvaDU+IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPigke21lc3NhZ2UuRXh0ZXJuYWxEZXNjcmlwdGlvbn0pOiAke21lc3NhZ2UuUmVhc29uQ29kZVRleHR9PC9wPjwvZGl2PiBgO1xuXHRcdH1cblx0XHR0cmFpbk1lc3NhZ2VMaXN0LmlubmVySFRNTCA9IGh0bWxDaHVuaztcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dTaXR1YXRpb25zKHNpdHVhdGlvbnMpe1xuXG5cdFx0dmFyIHNpdHVhdGlvbnNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpdHVhdGlvbnNMaXN0Jyk7XG5cdFx0dmFyIGh0bWxDaHVuayA9ICcnO1xuXHRcdGZvcih2YXIgc2l0dWF0aW9uIG9mIHNpdHVhdGlvbnMpe1xuXG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgc2l0dWF0aW9uLkRldmlhdGlvbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciBtZXNzYWdlVHlwZSA9IHNpdHVhdGlvbi5EZXZpYXRpb25baV0uTWVzc2FnZVR5cGU7XG5cdFx0XHRcdHZhciBpY29uSWQgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLkljb25JZDtcblx0XHRcdFx0dmFyIG1lc3NhZ2UgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLk1lc3NhZ2U7XG5cdFx0XHRcdHZhciBjcmVhdGlvblRpbWUgPSBzaXR1YXRpb24uRGV2aWF0aW9uW2ldLkNyZWF0aW9uVGltZS5zdWJzdHJpbmcoMCwxMCk7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgaWNvbiA9IGA8aW1nIHNyYz1cImh0dHA6Ly9hcGkudHJhZmlraW5mby50cmFmaWt2ZXJrZXQuc2UvdjEvaWNvbnMvJHtpY29uSWR9P3R5cGU9c3ZnXCIgY2xhc3M9XCJzaXR1YXRpb24taWNvblwiPmA7XG5cblx0XHRcdFx0aHRtbENodW5rICs9IGA8ZGl2IGNsYXNzPVwic2l0dWF0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQke2ljb259XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aDU+JHttZXNzYWdlVHlwZX08L2g1PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHttZXNzYWdlfTxicj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFB1YmxpY2VyYXQ6ICR7Y3JlYXRpb25UaW1lfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PmA7XG5cdFx0XHR9XHRcblx0XHR9XG5cdFx0c2l0dWF0aW9uc0xpc3QuaW5uZXJIVE1MID0gaHRtbENodW5rO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsb2FkaW5nSW5kaWNhdG9yT246IGxvYWRpbmdJbmRpY2F0b3JPbixcblx0XHRsb2FkaW5nSW5kaWNhdG9yT2ZmOiBsb2FkaW5nSW5kaWNhdG9yT2ZmLFxuXHRcdHNob3dUcmFpblN0YXRpb25zOiBzaG93VHJhaW5TdGF0aW9ucyxcblx0XHRzaG93VHJhaW5NZXNzYWdlczogc2hvd1RyYWluTWVzc2FnZXMsXG5cdFx0c2hvd1NpdHVhdGlvbnM6IHNob3dTaXR1YXRpb25zXG5cdH07IC8vIGVuZCBvZiByZXR1cm5cbn0pKCk7IC8vIGVuZCBvZiBWaWV3XG5cbiJdfQ==
