ROME = {};

ROME.Backend = ( function() {
	
	// private vars	
	
	that = {};
	var topListIndex = 1;
	var baseURL = "services/";
	
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
	
	// add single UGO
	// parameters = { data:JSONObject, success:callback, error:callback }
	
	that.addUGO = function( parameters ) {
		
		if(parameters.data !== undefined)
		{		
			var url = baseURL + "add/?object=" + parameters.data;			
	
			jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'text','post');
		}
		
	}
	
	
	// add points
	// parameters = { id:UGOid, amount:1, success:callback, error:callback }
	
	that.addPoints = function( parameters ) {
		
		if(parameters.id !== undefined)
		{		
			var amount = getValueOrDefault( parameters.amount, 1 )				
			
			var url = baseURL + "add/points/" + parameters.id + "/" + amount;			
	
			jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'text','post');
		}
		
	}
		
	// add stars - will be removed after testing (only for administrators)
	// parameters = { id:UGOid, amount:1, success:callback, error:callback }
	
	that.addStars = function( parameters ) {
		
		if(parameters.id !== undefined)
		{		
			var amount = getValueOrDefault( parameters.amount, 1 );				
			
			var url = baseURL + "add/stars/" + parameters.id + "/" + amount;			
	
			jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'text','post');
		}
		
	}	
	
	// disabled or enable UGO - will be removed after testing (only for administrators)
	// parameters = { id:UGOid, bool:true/false, success:callback, error:callback }
	
	that.disableUGO = function( parameters ) {
		
		if(parameters.id !== undefined)
		{		
			var bool = getValueOrDefault( parameters.bool, "false" );				
			
			var url = baseURL + "update/disable/" + parameters.id + "/" + bool;			
	
			jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'json','post');
		}
		
	}	
	
	// get single UGO
	// parameters = { id:UGOid, success:callback, error:callback }	
	
	that.getUGO = function( parameters ) {
		
		if(parameters.id !== undefined)
		{				
			var url = baseURL + "get/" + parameters.id;			
	
			jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'json','get');
		}		
	}	
	
	// get toplist for UGOs
	// parameters = { index:0, success:callback, error:callback }	
	
	that.getTopListForIndex = function( parameters ) {
		
		var index = (parameters.index === undefined) 
			? topListIndex 
			: parameters.index;				
		
		var url = baseURL + "toplist/" + index;		
		topListIndex = index + 1;
		
		jx.load(url, getCallback(parameters.success), getCallback(parameters.error), 'json','get');
		
	}
	
	// get next toplist for UGOs	
	// parameters = { success:callback, error:callback }
	
	that.getNextTopList = function( parameters ) {
		
		parameters.index = topListIndex;
		that.getTopListForIndex( parameters );
		
	}
	
	
	// return public	
	
	return that;
	
}());
