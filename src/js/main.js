/**
 * Model
 */
const Model  = (function(){

	var sendPostRequestToAPI= function(){ 

		const url = 'http://api.trafikinfo.trafikverket.se/v1.1/data.json';
	  var question = "<REQUEST>" +
			                "<LOGIN authenticationkey='da45c275bf724721b1a706182adcff1b' />" +
			                "<QUERY objecttype='TrainStation'>" +
			                    "<FILTER/>" +
			                    "<INCLUDE>Prognosticated</INCLUDE>" +
			                    "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
			                    "<INCLUDE>LocationSignature</INCLUDE>" +
			                "</QUERY>" +
			             "</REQUEST>";

	  fetch(url,
	  {
	    method: 'post',
	    mode: 'cors', 
	    body: question,
	    headers: {
	      'Content-Type': 'text/xml'
	    }
	  })
	  .then((response) => {
	    console.log(response.json());
	  })
		.catch(error => {
	  	console.log(error);
	  });

	};

	sendPostRequestToAPI();

	return {

	
	}; // end of return


})(); // end of Model



/**
 * View
 */
const View  = (function(){


	return {

	
	}; // end of return


})(); // end of View





