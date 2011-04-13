//V3.01.A - http://www.openjs.com/scripts/jx/
jx = {	
	getHTTPObject : function() {
		var http = false;
		if (window.XMLHttpRequest) {
			try {http = new XMLHttpRequest();}
			catch (e) {http = false;}
		}
		return http;
	},	
	load : function (url,callback,error,format,method, opt) {
		var http = this.init();
		if(!http||!url) return;		
		if (http.overrideMimeType) http.overrideMimeType('text/xml');
		if(!method) method = "GET";
		if(!format) format = "text";
		if(!opt) opt = {};
		format = format.toLowerCase();
		method = method.toUpperCase();
		var parameters = null;

		if(method=="POST") {
			var parts = url.split("\?");
			url = parts[0];
			parameters = (parts[1] === undefined) ? "" : parts[1];
		}
		http.open(method, url, true);

		if(method=="POST") {			
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", parameters.length);
			http.setRequestHeader("Connection", "close");
		}

		var ths = this;
		http.onreadystatechange = function () {
			if (http.readyState == 4) {
				if(http.status == 200) {
					var result = "";
					if(http.responseText) result = http.responseText;						
					if(format.charAt(0) == "j") {
						result = result.replace(/[\n\r]/g,"");
						result = eval('('+result+')');
					} else if(format.charAt(0) == "x") {
						result = http.responseXML;
					}						
					if(callback) callback(result);
				} 
				else {					
					if(error) error(http.status);
				}
			}
		}		
		http.send(parameters);
	},
	bind : function(user_options) {
		var opt = {		
			'onSuccess':false,'onError':false,'format':"text",'method':"GET"			
		}
		for(var key in opt) {
			if(user_options[key]) {
				opt[key] = user_options[key];
			}
		}		
		return;		
	},
	init : function() {return this.getHTTPObject();}
}