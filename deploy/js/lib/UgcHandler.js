var UgcHandler = function () {

	var base_url = '/ugc/objects';

	this.getLatestUGOs = function ( callback ) {

		var url = base_url + '/latest';

		var xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );

		xhr.onreadystatechange = function () {

			if ( xhr.readyState == 4 ) {

				if ( xhr.status == 200 ) {

					callback( JSON.parse( xhr.responseText ) );

				} else {

					console.log( 'Unable to load latest User Generated Content' );

				}

			}

		};

		xhr.send( null );

	};

	this.getUGO = function( id, callback ) {
		var url = '/ugc/object/'+id;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {
				if ( xhr.status == 200 ) {
					var obj = JSON.parse(xhr.responseText);
					callback( obj );
				} else {
					console.log( 'Could not fetch '+id );
				}
			}
		};
		xhr.send( null );
	};

	this.submitUGO = function ( submission, callback ) {

		var url = base_url;

		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', url );
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {
				if ( xhr.status == 200 ) {
					var obj = JSON.parse(xhr.responseText);
					callback( obj );
				} else {
					console.log( 'Submission of model failed' );
				}
			}
		};
		xhr.send( JSON.stringify(submission) );
	};

};
