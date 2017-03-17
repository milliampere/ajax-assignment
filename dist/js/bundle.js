(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Model
 */
var Model = function () {

	var sendPostRequestToAPI = function sendPostRequestToAPI() {

		var url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';
		var question = "<REQUEST>" + "<LOGIN authenticationkey='da45c275bf724721b1a706182adcff1b' />" + "<QUERY objecttype='TrainStation'>" + "<FILTER/>" + "<INCLUDE>Prognosticated</INCLUDE>" + "<INCLUDE>AdvertisedLocationName</INCLUDE>" + "<INCLUDE>LocationSignature</INCLUDE>" + "</QUERY>" + "</REQUEST>";

		fetch(url, {
			method: 'post',
			mode: 'cors',
			body: question,
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(function (response) {
			console.log(response.json());
		}).catch(function (error) {
			console.log(error);
		});
	};

	sendPostRequestToAPI();

	return {}; // end of return

}(); // end of Model


/**
 * View
 */
var View = function () {

	return {}; // end of return

}(); // end of View

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7OztBQUdBLElBQU0sUUFBVSxZQUFVOztBQUV6QixLQUFJLHVCQUFzQixTQUF0QixvQkFBc0IsR0FBVTs7QUFFbkMsTUFBTSxNQUFNLHNEQUFaO0FBQ0MsTUFBSSxXQUFXLGNBQ0MsZ0VBREQsR0FFQyxtQ0FGRCxHQUdLLFdBSEwsR0FJSyxtQ0FKTCxHQUtLLDJDQUxMLEdBTUssc0NBTkwsR0FPQyxVQVBELEdBUUYsWUFSYjs7QUFVQSxRQUFNLEdBQU4sRUFDQTtBQUNFLFdBQVEsTUFEVjtBQUVFLFNBQU0sTUFGUjtBQUdFLFNBQU0sUUFIUjtBQUlFLFlBQVM7QUFDUCxvQkFBZ0I7QUFEVDtBQUpYLEdBREEsRUFTQyxJQVRELENBU00sVUFBQyxRQUFELEVBQWM7QUFDbEIsV0FBUSxHQUFSLENBQVksU0FBUyxJQUFULEVBQVo7QUFDRCxHQVhELEVBWUEsS0FaQSxDQVlNLGlCQUFTO0FBQ2QsV0FBUSxHQUFSLENBQVksS0FBWjtBQUNBLEdBZEQ7QUFnQkQsRUE3QkQ7O0FBK0JBOztBQUVBLFFBQU8sRUFBUCxDQW5DeUIsQ0FzQ3RCOztBQUdILENBekNjLEVBQWYsQyxDQXlDTTs7O0FBSU47OztBQUdBLElBQU0sT0FBUyxZQUFVOztBQUd4QixRQUFPLEVBQVAsQ0FId0IsQ0FNckI7O0FBR0gsQ0FUYSxFQUFkLEMsQ0FTTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIE1vZGVsXG4gKi9cbmNvbnN0IE1vZGVsICA9IChmdW5jdGlvbigpe1xuXG5cdHZhciBzZW5kUG9zdFJlcXVlc3RUb0FQST0gZnVuY3Rpb24oKXsgXG5cblx0XHRjb25zdCB1cmwgPSAnaHR0cDovL2FwaS50cmFmaWtpbmZvLnRyYWZpa3ZlcmtldC5zZS92MS4xL2RhdGEuanNvbic7XG5cdCAgdmFyIHF1ZXN0aW9uID0gXCI8UkVRVUVTVD5cIiArXG5cdFx0XHQgICAgICAgICAgICAgICAgXCI8TE9HSU4gYXV0aGVudGljYXRpb25rZXk9J2RhNDVjMjc1YmY3MjQ3MjFiMWE3MDYxODJhZGNmZjFiJyAvPlwiICtcblx0XHRcdCAgICAgICAgICAgICAgICBcIjxRVUVSWSBvYmplY3R0eXBlPSdUcmFpblN0YXRpb24nPlwiICtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgXCI8RklMVEVSLz5cIiArXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIFwiPElOQ0xVREU+UHJvZ25vc3RpY2F0ZWQ8L0lOQ0xVREU+XCIgK1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICBcIjxJTkNMVURFPkFkdmVydGlzZWRMb2NhdGlvbk5hbWU8L0lOQ0xVREU+XCIgK1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICBcIjxJTkNMVURFPkxvY2F0aW9uU2lnbmF0dXJlPC9JTkNMVURFPlwiICtcblx0XHRcdCAgICAgICAgICAgICAgICBcIjwvUVVFUlk+XCIgK1xuXHRcdFx0ICAgICAgICAgICAgIFwiPC9SRVFVRVNUPlwiO1xuXG5cdCAgZmV0Y2godXJsLFxuXHQgIHtcblx0ICAgIG1ldGhvZDogJ3Bvc3QnLFxuXHQgICAgbW9kZTogJ2NvcnMnLCBcblx0ICAgIGJvZHk6IHF1ZXN0aW9uLFxuXHQgICAgaGVhZGVyczoge1xuXHQgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sJ1xuXHQgICAgfVxuXHQgIH0pXG5cdCAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdCAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5qc29uKCkpO1xuXHQgIH0pXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcblx0ICBcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0ICB9KTtcblxuXHR9O1xuXG5cdHNlbmRQb3N0UmVxdWVzdFRvQVBJKCk7XG5cblx0cmV0dXJuIHtcblxuXHRcblx0fTsgLy8gZW5kIG9mIHJldHVyblxuXG5cbn0pKCk7IC8vIGVuZCBvZiBNb2RlbFxuXG5cblxuLyoqXG4gKiBWaWV3XG4gKi9cbmNvbnN0IFZpZXcgID0gKGZ1bmN0aW9uKCl7XG5cblxuXHRyZXR1cm4ge1xuXG5cdFxuXHR9OyAvLyBlbmQgb2YgcmV0dXJuXG5cblxufSkoKTsgLy8gZW5kIG9mIFZpZXdcblxuXG5cblxuXG4iXX0=
