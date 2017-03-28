/**
 * Model (Data Layer)- This is where the data is stored for the app. 
 */
const Model  = (function() {

	const apikey = 'da45c275bf724721b1a706182adcff1b';
	const url = 'https://api.trafikinfo.trafikverket.se/v1.1/data.json';
	var stockholm = "<WITHIN name='Deviation.Geometry.SWEREF99TM' shape='center' value='674130 6579686' radius='30000' />";

	/**
	 * Get traffic situation information from API
	 */
	function getSituationsFromAPI(filter, area, type){

		// If no filter is applied, then change filter to an empty string
		filter = (typeof filter != "undefined") ? filter : '';
		area = (typeof area != "undefined") ? area : '';
		type = (typeof type != "undefined") ? type : 'Alla';

		View.loadingIndicatorOn();

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">
        <FILTER>
        			${area}
        			${filter}
        </FILTER>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			setTimeout(View.loadingIndicatorOff, 700);   // Timeout for show off
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

		var question = `
			<REQUEST>
			      <LOGIN authenticationkey="${apikey}" />
			      <QUERY objecttype="Situation">
			            <FILTER>
					        	${stockholm}
					        		<OR>
					              <ELEMENTMATCH>
					                <EQ name="Deviation.MessageType" value="Trafikmeddelande" />
					                <GTE name="Deviation.SeverityCode" value="4" />
					              </ELEMENTMATCH>
					            </OR>
			            </FILTER>
			            <INCLUDE>Deviation.MessageType</INCLUDE>
			            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
			            <INCLUDE>Deviation.MessageTypeValue</INCLUDE>
			      </QUERY>
			</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			var situations = data.RESPONSE.RESULT[0].Situation;

			var deviations = [];
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType != "Trafikmeddelande"){
						//console.log("Borta");
					}
					else if (dev.Geometry === undefined || dev.MessageTypeValue == "SpeedManagement"){
						//console.log("Exkluderad");
					}
					else {
						deviations.push(dev);
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

		var question = `
			<REQUEST>
			      <LOGIN authenticationkey="${apikey}" />
			      <QUERY objecttype="Situation">
			            <FILTER>
					        	${stockholm}
				        		<OR>
				              <ELEMENTMATCH>
				                <EQ name="Deviation.MessageType" value="Vägarbete" />
				                <EQ name="Deviation.SeverityCode" value="5" />
				              </ELEMENTMATCH>
				            </OR>
			            </FILTER>
			            <INCLUDE>Deviation.MessageType</INCLUDE>
			            <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
			      </QUERY>
			</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			var situations = data.RESPONSE.RESULT[0].Situation;

			var deviations = [];
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType != "Vägarbete"){
						//console.log("Borta");
					}
					else if (dev.Geometry === undefined){
						//console.log("Exkluderad");
					}
					else {
						deviations.push(dev);
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

		var question = `
			<REQUEST>
			      <LOGIN authenticationkey="${apikey}" />
			      <QUERY objecttype="Situation">
			            <FILTER>
			                  <WITHIN name='Deviation.Geometry.SWEREF99TM' shape='center' value='674130 6579686' radius='30000' />
			                  <EQ name='Deviation.MessageType' value='Olycka' />
			            </FILTER>
			            <INCLUDE>Deviation.MessageType</INCLUDE>
			      </QUERY>
			</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
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
	function situationCounter(situations){
		var totalSituations = 0;
			for(let i = 1; i<= situations.length; i++){
				totalSituations++;
			}
		return totalSituations;	
	}

	/**
	 * Change time format into YYYY-MM-DD hh:mm
	 * @param  {String} time  	Time in any format
	 * @return {String}        	Time in format YYYY-MM-DD hh:mm
	 */
  function changeTimeFormat(time){
  	if(typeof time == "undefined"){
  		return "";
  	}
  	else {
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
	function splitWGS84coordinates(coordinates){
		// Remove POINT and paranteses, then split into an array of substrings
		var coordinatesSplit = coordinates.replace('POINT (','').replace(')','').split(/[\s,]+/);
		// Convert to number
		var lng = Number(coordinatesSplit[0]);
		var lat = Number(coordinatesSplit[1]);
		return [lng,lat];
	}

	/**
	 * Get traffic messages from API
	 */
	var getTrafficMessagesFromAPI = function(){

		View.loadingIndicatorOn();

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">
        <FILTER>
        	${stockholm}
        		<OR>
              <ELEMENTMATCH>
                <EQ name="Deviation.MessageType" value="Trafikmeddelande" />
                <GTE name="Deviation.SeverityCode" value="4" />
              </ELEMENTMATCH>
            </OR>
        </FILTER>
        <INCLUDE>Deviation.CreationTime</INCLUDE>
        <INCLUDE>Deviation.EndTime</INCLUDE>
        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
        <INCLUDE>Deviation.IconId</INCLUDE>
        <INCLUDE>Deviation.Id</INCLUDE>
        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
        <INCLUDE>Deviation.MessageCode</INCLUDE>
        <INCLUDE>Deviation.MessageCodeValue</INCLUDE>
        <INCLUDE>Deviation.MessageTypeValue</INCLUDE>
        <INCLUDE>Deviation.MessageType</INCLUDE>
        <INCLUDE>Deviation.RoadNumber</INCLUDE>
        <INCLUDE>Deviation.SeverityText</INCLUDE>
        <INCLUDE>Deviation.StartTime</INCLUDE>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			console.log("-- getTrafficMessagesFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400);   // Timeout for show off
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
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType != "Trafikmeddelande"){
						//console.log("Borta");
					}
					else if (dev.Geometry === undefined || dev.MessageTypeValue == "SpeedManagement"){
						//console.log("Exkluderad");
					}
					else {
						deviations.push(dev);
					}
				}
			}
			//console.log(deviations);  // Array of only traffic message objects

			// Show situations in text
			View.showDeviations(deviations);

			// Init map and markers
			View.addMarkers(deviations);

		});
	};

	/**
	 * Get roadwork information from API
	 */
	var getRoadworksFromAPI = function(){

		View.loadingIndicatorOn();

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">
        <FILTER>
        	${stockholm}
        		<OR>
              <ELEMENTMATCH>
                <EQ name="Deviation.MessageType" value="Vägarbete" />
                <EQ name="Deviation.SeverityCode" value="5" />
              </ELEMENTMATCH>
            </OR>
        </FILTER>
        <INCLUDE>Deviation.CreationTime</INCLUDE>
        <INCLUDE>Deviation.EndTime</INCLUDE>
        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
        <INCLUDE>Deviation.IconId</INCLUDE>
        <INCLUDE>Deviation.Id</INCLUDE>
        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
        <INCLUDE>Deviation.MessageCode</INCLUDE>
        <INCLUDE>Deviation.MessageType</INCLUDE>
        <INCLUDE>Deviation.RoadNumber</INCLUDE>
        <INCLUDE>Deviation.SeverityText</INCLUDE>
        <INCLUDE>Deviation.StartTime</INCLUDE>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			console.log("-- getRoadworksFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400);   // Timeout for show off
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
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType != "Vägarbete"){
						//console.log("Borta");
					}
					else if (dev.Geometry === undefined){
						//console.log("Exkluderad");
					}
					else {
						deviations.push(dev);
					}
				}
			}
			//console.log(deviations);  // Array of only roadwork objects

			// Show situations in text
			View.showDeviations(deviations);

			// Init map and markers
			View.addMarkers(deviations);

		});
	};

	/**
	 * Get road accident information from API
	 */
	var getRoadAccidentsFromAPI = function(){

		View.loadingIndicatorOn();

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation" orderby="Deviation.CreationTime desc">
        <FILTER>
        	${stockholm}
        		<OR>
              <ELEMENTMATCH>
                <EQ name="Deviation.MessageType" value="Olycka" />
              </ELEMENTMATCH>
            </OR>
        </FILTER>
        <INCLUDE>Deviation.CreationTime</INCLUDE>
        <INCLUDE>Deviation.EndTime</INCLUDE>
        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
        <INCLUDE>Deviation.IconId</INCLUDE>
        <INCLUDE>Deviation.Id</INCLUDE>
        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
        <INCLUDE>Deviation.MessageCode</INCLUDE>
        <INCLUDE>Deviation.MessageType</INCLUDE>
        <INCLUDE>Deviation.RoadNumber</INCLUDE>
        <INCLUDE>Deviation.SeverityText</INCLUDE>
        <INCLUDE>Deviation.StartTime</INCLUDE>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			console.log("-- getRoadAccidentsFromAPI ");
			setTimeout(View.loadingIndicatorOff, 400);   // Timeout for show off
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
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.MessageType != "Olycka"){
						//console.log("Borta");
					}
					else if (dev.Geometry === undefined){
						//console.log("Exkluderad");
					}
					else {
						deviations.push(dev);
					}
				}
			}
			//console.log(deviations);  // Array of only road accident objects

			// Show situations in text
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

		var question = `
		<REQUEST>
      <LOGIN authenticationkey="${apikey}" />
      <QUERY objecttype="Situation">
      	<FILTER>
				<EQ name="Deviation.Id" value="${id}" />
				</FILTER>
      </QUERY>
		</REQUEST>
		`;

	  var fetchRequest = fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	 		}
	  })
	  .then((response) => {
	    return response.json();
	  })
		.catch(error => {
	  	console.log(error);
	  });

		fetchRequest.then(data => {
			var situations = data.RESPONSE.RESULT[0].Situation;

			// All situations have an array of deviations which hold traffic information of several MessageTypes, 
			// not just the ones we request. Therefore I make a new array and only include the deviation with the requested Id. 
			var deviations = [];
			for(var situation of situations){
				for(var i = 0; i < situation.Deviation.length; i++){
					var dev = situation.Deviation[i];
					if (dev.Id != id){
						//console.log("Borta");
					}
					else {
						deviations.push(dev);
					}
				}
			}
			// Show situation in text
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
		getOneDeviationFromAPI: getOneDeviationFromAPI,
	}; // end of return
})(); // end of Model




