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

  var submitImage = function(upload_url, image, name, callback) {
      function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
      }
      var xhr = new XMLHttpRequest(),
          boundary = 'AJAX------------------------AJAX',
          contentType = "multipart/form-data; boundary=" + boundary,
          postHead = '--' + boundary + '\r\n' +
              'Content-Disposition: form-data; name="file"; filename="' + name + '"\r\n' +
              'Content-Type: image/png\r\n\r\n',
          postTail = '\r\n--' + boundary + '--';
      var head = Array.prototype.map.call(postHead, byteValue);
      var tail = Array.prototype.map.call(postTail, byteValue);
      xhr.open('POST', upload_url, true);
      xhr.setRequestHeader('Content-Type', contentType);
      var lh = head.length;
      var li = image.length;
      var lt = tail.length;
      var byteArray = new Uint8Array(lh+li+lt);
      byteArray.set(head, 0);
      byteArray.set(image,lh);
      byteArray.set(tail,lh+li);
      xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
          if ( xhr.status == 200 ) {
            callback();
          } else {
            console.log('Error uploading image.');
          }
        }
      };
      xhr.send(byteArray.buffer);
  };

	this.submitUGO = function ( submission, image, callback ) {

		var url = base_url;

		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', url );
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {
				if ( xhr.status == 200 ) {
					var obj = JSON.parse(xhr.responseText);
          var upload_url = obj.upload_url;
          submitImage(upload_url, image, 'perspective', function() {
            delete obj.upload_url;
            callback( obj );
          });
				} else {
					console.log( 'Submission of model failed' );
				}
			}
		};
		xhr.send( JSON.stringify(submission) );
	};

};
