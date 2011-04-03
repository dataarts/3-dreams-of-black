/**
 * @author Mikael Emtinger
 */

if( ROME === undefined ) ROME = {};

ROME.Backend = ( function() {
	
	// private vars
	
	that = {};

	var myPrivateVar = 10;
	var baseURL;
	
	
	// private functions
	
	var myPrivateFunction = function() {
		
		// do something
		
	}

	var onSaveUGO = function( response ) {
		
		if( response.success === "true" ) {
			
			lastCallbackSuccess( repsonse );
		
		} else {
			
			lastCallbackError( response );
			
		}
		
	}
	
	
	// public functions
	
	// save single UGO
	// parameters = { data:JSONObject, success:callback, error:callback }
	
	that.saveUGO = function( parameters ) {
		
		var url = baseURL + ObjectToJSONString( parameters.data ); 
		
		lastCallbackSuccess = parameters.success;
		lastCallbackError = parameters.error;
		isRequestion = true;

		request.send( POST, url, onSaveUGO );
		
	}
	
	
	// add point
	// parameters = { id:UGOid, type:"", amount:1, success:callback, error:callback }
	
	that.addPoint = function( parameters ) {
		
		
	}
	
	
	// load single UGO
	// parameters = { id:UGOid, success:callback, error:callback }
	
	that.loadUGO = function( parameters ) {
		
		
	}
	
	
	// load toplist UGOs
	// parameters = { page:0, success:callback, error:callback }
	
	that.loadTopListUGO = function( parameters ) {
		
		
	}
	
	
	// return public
	
	return that;
	
}());
