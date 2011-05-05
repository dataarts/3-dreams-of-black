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

  function sendBinary(url, data, filename) {
    try {
      var xhr = new XMLHttpRequest(),
          boundary = 'AJAX------------------------AJAX',
          contentType = "multipart/form-data; boundary=" + boundary,
          postHead = '--' + boundary + '\r\n' +
              'Content-Disposition: form-data; name="file"; filename="' + filename + '"\r\n' +
              'Content-Type: application/octet-stream\r\n\r\n',
          postTail = '\r\n--' + boundary + '--',
          tmp = '',
          abView,
          i; // please pay attention to the hyphens
      if (data instanceof ArrayBuffer) {
        console.log('ArrayBuffer, need View, assume Uint8Array');
        abView = new Uint8Array(data);
        if (abView.length < 100) {
          return null;
        } // ArrayBuffer needs to use ArrayBufferView to read
        console.log(abView.length);
        for (i = 0; i < abView.length; i += 1) {
          tmp += String.fromCharCode(abView[i] & 0xff);
        }
        data = postHead + tmp + postTail;
      } else { // if not ArrayBuffer, assume responseText
        data = postHead + tmp + postTail;
      }
      if (typeof XMLHttpRequest.prototype.sendAsBinary === 'function') { // fx 3+ built-in
        console.log('built-in support sendAsBinary');
      } else {
        console.log('define sendAsBinary'); // chrome, they say not work in safari
        XMLHttpRequest.prototype.sendAsBinary = function (datastr) {
          function byteValue(x) {
            return x.charCodeAt(0) & 0xff;
          }
          var ords = Array.prototype.map.call(datastr, byteValue);
          var ui8a = new Uint8Array(ords);
          this.send(ui8a.buffer);
        };
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.sendAsBinary(data);
      return xhr.responseText;
    } catch (err) {
      return null;
    }
  }

  /**
   * Submit an image
   * @param id
   * @param secret
   * @param name
   * @param {Uint8Array} image MUST BE Uint8Array
   * @param callback
   */
  submitImage = function(id, upload_url, name, image) {
//    var xhr = new XMLHttpRequest();
//    xhr.open('POST', '/ugc/object/'+id+'/image');
//    console.log(image.length);
//    xhr.send(image.buffer);
      function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
      }
      var xhr = new XMLHttpRequest(),
          boundary = 'AJAX------------------------AJAX',
          contentType = "multipart/form-data; boundary=" + boundary,
          postHead = '--' + boundary + '\r\n' +
              'Content-Disposition: form-data; name="file"; filename="' + name + '"\r\n' +
              'Content-Type: application/octet-stream\r\n\r\n',
          postTail = '\r\n--' + boundary + '--';
      var head = Array.prototype.map.call(postHead, byteValue);
      var tail = Array.prototype.map.call(postTail, byteValue);
      xhr.open('POST', upload_url);
      xhr.setRequestHeader('Content-Type', contentType);
      var lh = head.length;
      var li = image.length;
      var lt = tail.length;
      var byteArray = new Uint8Array(lh+li+lt);
      byteArray.set(head, 0);
      byteArray.set(image,lh);
      byteArray.set(tail,lh+li);
      xhr.send(byteArray.buffer);
  };

	this.submitUGO = function ( submission, images, callback ) {

		var url = base_url;

		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', url );
//    xhr.onload = function() {
//      var obj = JSON.parse(xhr.responseText);
//      console.log(obj);
//      for(var i=0;i<images.length;i++) {
//        submitImage(obj.id, obj.secret, 'perspective', images[i]);
//      }
//    };
//    xhr.send(JSON.stringify(submission));
    window.images = images

//    xhr.setRequestHeader( 'Content-type', 'multipart/form-data' );
    xhr.onreadystatechange = function () {
      if ( xhr.readyState == 4 ) {
        if ( xhr.status == 200 ) {
          var obj = JSON.parse(xhr.responseText);
          console.log(obj);
          for(var i=0;i<images.length;i++) {
            submitImage(obj.id, obj.upload_url, 'perspective', images[i]);
          }
        } else {
          console.log( 'Submission of model failed' );
        }
      }
    };
    xhr.send( JSON.stringify(submission) );
  };

};
