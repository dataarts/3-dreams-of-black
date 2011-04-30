var UgcHandler = function () {

	var base_url = 'http://2.radicalvid.appspot.com/services/';

	this.getLatestUGOs = function ( callback ) {

		var url = base_url + 'latest';

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.onreadystatechange = function () {

			if ( request.readyState == 4 ) {

				if ( request.status == 200 ) {

					callback( eval( request.responseText ) );

				} else {

					console.log( 'UGCHandler::getLatestUGOs: An error has occured making the request' );

				}

			}

		}

		request.send( null );

	};

	this.submitUGO = function ( title, email, type, data, image, callback ) {

		var url = base_url + 'add';

		var data = 'title=' + title + '&email=' + email + '&type=' + type + '&object=' + data + '&image=' + image;

		console.log( data );

		var request = new XMLHttpRequest();
		request.open( 'POST', url );
		request.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		request.setRequestHeader( 'Content-length', data.length );
		request.setRequestHeader( 'Connection', 'close' );

		request.onreadystatechange = function () {

			if ( request.readyState == 4 ) {

				if ( request.status == 200 ) {

					callback( request.responseText /*eval( request.responseText )*/ );

				} else {

					console.log( 'UGCHandler::submitUGO: An error has occured making the request' );

				}

			}

		}

		request.send( data );

	};

};
