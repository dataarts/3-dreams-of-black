var Backend = ( function() {
	
	// private vars	
	
	that = {};
	var topListIndex = 1;
	var latestIndex = 1;
	var baseURL = "services/";
	var localhostProxySufix  = window.location.host !== "localhost" ? "" : ".php"; 
	var localhostIndexPrefix = window.location.host !== "localhost" ? "" : "?index=";
	
	// private functions
	
	// return value or default value
	
	var getValueOrDefault = function( value, defaultValue ) {
		return ( value === undefined ) ? defaultValue : value;
	}
	
	// return callback if it exist, else false
	
	var getCallback = function( callback ) {
		return getValueOrDefault( callback, false );
	}	
	
	
	// public functions
	
	// add single UGC
	// parameters = { data:JSONObject, type:string, title:string, email:string, image:string }, successCallback, errorCallback 
	
	that.addUGC = function( parameters, successCallback, failCallback ) {
		
		if(parameters.data !== undefined) {		
			var data = (typeof(parameters.data) === 'object')
				? JSON.stringify(parameters.data) 
				: parameters.data; 
				
			var url = baseURL + "add" + localhostProxySufix + "/" + (localhostIndexPrefix.length !== 0 ? "?" : "" ) + "object=" + data  + "&type=" + parameters.type + "&title=" + parameters.title + "&email=" + parameters.email + "&image=" + parameters.image;			
	
			jx.load( url, getCallback( successCallback ), getCallback( failCallback ), 'text', 'post' );
		}
		
	}
	
	
	// get single UGC
	// parameters = id, successCallback, errorCallback	
	
	that.getUGC = function( id, successCallback, failCallback ) {
		
		if( id !== undefined) {				
			var url = baseURL + "get" + localhostProxySufix + "/" + localhostIndexPrefix + id;			
	
			jx.load( url, getCallback( successCallback ), getCallback( failCallback ), 'json', 'get' );
		}		
	}	
	
	// get toplist for UGCs
	// parameters = index, successCallback, errorCallback 
	
	that.getTopListForIndex = function( _index, successCallback, failCallback ) {
		
		var index = ( _index === undefined) 
			? topListIndex 
			: _index;				
		
		var url = baseURL + "toplist" + localhostProxySufix + "/" + localhostIndexPrefix + index;		
		topListIndex = index + 1;
		
		jx.load( url, getCallback( successCallback ), getCallback( failCallback ), 'json', 'get' );
		
	}
	
	// get next toplist for UGCs	
	// parameters = successCallback, errorCallback
	
	that.getTopList = function( successCallback, failCallback ) {
		
		that.getTopListForIndex( topListIndex, successCallback, failCallback );
		
	}
	
	
	// reset toplist index
	
	that.resetTopListIndex = function() {
		
		topListIndex = 1;
		
	}
	
	// get latest UGCs
	// parameters = index, successCallback, errorCallback }	
	
	that.getLatestForIndex = function( _index, successCallback, failCallback ) {
		
		var index = (_index === undefined) 
			? latestIndex 
			: _index;				
		
		var url = baseURL + "latest" + localhostProxySufix + "/" + localhostIndexPrefix + index;
		latestIndex = index + 1;
		
		jx.load( url, getCallback( successCallback ), getCallback( failCallback ), 'json', 'get' );
		
	}
	
	// get next toplist for UGCs	
	// parameters = successCallback, errorCallback }
	
	that.getLatest = function( successCallback, failCallback ) {
		
		that.getLatestForIndex( latestIndex, successCallback, failCallback );
		
	}
	
	// reset latest index
	
	that.resetLatestIndex = function() {
		
		latestIndex = 1;
		
	}
	
	
	// return public	
	
	return that;
	
}());