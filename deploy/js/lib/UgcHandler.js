var UgcHandler = function () {

	var base_url = '/ugc/objects';

	this.getLatestUGOs = function ( callback ) {

		var url = base_url + '/latest';

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.onreadystatechange = function () {

			if ( request.readyState == 4 ) {

				if ( request.status == 200 ) {

					callback( JSON.parse( request.responseText ) );

				} else {

					console.log( 'Unable to load latest User Generated Content' );

				}

			}

		}

		request.send( null );

	};

	this.submitUGO = function ( title, email, type, data, image, callback ) {

		var url = base_url;

		var params = 'title=' + title + '&email=' + email + '&type=' + type + '&data=' + data + '&image=' + image;

		console.log( data );

		var request = new XMLHttpRequest();
		request.open( 'POST', url, true );
		request.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
//		request.setRequestHeader( 'Content-length', params.length );
//		request.setRequestHeader( 'Connection', 'close' );

		request.onreadystatechange = function () {

			if ( request.readyState == 4 ) {

				if ( request.status == 200 ) {

					callback( request.responseText );

				} else {

					console.log( 'Submission of model failed' );

				}

			}

		}

		request.send( params );

	};

};
