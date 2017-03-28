# Ajax-assigment

Camilla Tranberg, Javascript 2, Nackademin

## Description/assignment
Create an application that fetch data from open API's and display it as a html site. See full description [here](assignment_ajax.md).

### Tools and dependencies
* [Frow CSS Grid System](http://frowcss.com/)
* [Gulp boilerplate using Sass, Babel, Browserify and live update with Browser-sync](https://github.com/milliampere/gulp-boilerplate)

### API
* [Trafikverket API](https://api.trafikinfo.trafikverket.se/) The Swedish Transport Administration (Trafikverket) open API for traffic data (road, train, ferry) in Sweden.
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

## Link to live page
* [Live page](https://milliampere.github.io/ajax-assignment)

## Process
* To get the data I use vanilla JavaScript with fetch(). To display the data I use Frow CSS Grid System. 
* Design pattern: Revealing Module Pattern
* To write subsequent script tags I load the Google Map API sync instead of async.
* Added a loading indicator to show when the information is loaded. The loading indicator is created with only CSS.
* The menu icon (svg) have hover effects. 
* Added the total number per situation in the dropdown menu.
* "Mixed Content: The page at was loaded over HTTPS, but requested an insecure image": had to save the icons instead of requesting them. 

### TODO for improvements
* Close previous infowindows when a new marker is clicked. 
* Add pagination for the results 
* Add traffic information for trains and ferries as well