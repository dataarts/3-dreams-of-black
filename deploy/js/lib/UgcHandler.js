var UgcHandler = function () {

  var base_url = '/ugc/objects';
  var per_page = 10;
  var that = this;

  function getParameterByName( name )
  {
    var s = window.location.search;
    if (s === '') {
      return undefined;
    }
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( s );
    if( results == null )
      return undefined;
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  this.getLatestUGOs = function ( callback, index ) {
    getUGOs(function(ugos) {
      if (index === 0) {
        var id = getParameterByName('id');
        if (id !== undefined) {
          that.getUGO(id, function(ugo) {
            callback([ugo].concat(ugos))
          });
        } else {
          callback(ugos);
        }
      } else {
        callback(ugos);
      }
    }, index)
  };

  var getUGOs = function ( callback, index ) {
    var url = base_url + '?category=favorite&offset='+(index*per_page)+'&limit='+per_page+'&property=data&property=category';
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url, true);
    xhr.onreadystatechange = function () {
      if ( xhr.readyState == 4 ) {
        if ( xhr.status == 200 ) {
          if( xhr.responseText !== "" ) {
            callback( JSON.parse( xhr.responseText ) );
          } else {
            console.warn( 'UGC response empty' );
            callback( {} );
          }
        } else {
          console.log( 'Unable to load latest User Generated Content' );
        }
      }
    };
    xhr.send( null );
  };

  this.getUGO = function( id, callback ) {
    var url = base_url+"/"+id+'?property=data&property=category';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
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

  var base64DecodeChars = new Array(
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);


  function b642ui8a(str) {
    var c1, c2, c3, c4;
    var i, j, len, out;

    len = str.length;
    i = 0;
    j = 0;
    out = new Uint8Array(len/4 * 3);
    while(i < len) {
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c1 == -1);
      if(c1 == -1)
        break;

      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c2 == -1);
      if(c2 == -1)
        break;

      out[j++] = (c1 << 2) | ((c2 & 0x30) >> 4);

      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while(i < len && c3 == -1);
      if(c3 == -1)
        break;

      out[j++] = ((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2);

      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while(i < len && c4 == -1);
      if(c4 == -1)
        break;
      out[j++] = ((c3 & 0x03) << 6) | c4;
    }
    return out;
  }

  function uploadImage(upload_url, dataURI, opts) {
    opts = opts || {};
    opts.type = opts.type || 'image/png'; // image/jpeg, application/octet-stream
    opts.filename = opts.filename || 'file';
    function byteValue(x) {
      return x.charCodeAt(0) & 0xff;
    }
    var xhr = new XMLHttpRequest(),
        boundary = 'BEAUTIFUL----------------BOUNDRY',
        contentType = "multipart/form-data; boundary=" + boundary,
        postHead = '--' + boundary + '\r\n' +
            'Content-Disposition: form-data; name="file"; filename="' + opts.filename + '"\r\n' +
            'Content-Type: ' + opts.type +'\r\n\r\n',
        postTail = '\r\n--' + boundary + '--',
        data,
        arr;
    data = b642ui8a(dataURI.slice(opts.type.length + 13));
//    data = b642ui8a(dataURI.slice(22));
    head = Array.prototype.map.call(postHead, byteValue);
    tail = Array.prototype.map.call(postTail, byteValue);
    var hl = head.length,
        dl = data.length,
        tl = tail.length;
    arr = new Uint8Array(hl+dl+tl);
    arr.set(head);
    arr.set(data,hl);
    arr.set(tail,hl+dl);
    xhr.open('POST', upload_url, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (opts.callback) {
          var response = xhr.responseText;
          opts.callback(response);
        }
      }
    };
    if (xhr.sendAsBinary) {
      xhr.sendAsBinary(arr.buffer);
    } else {
      xhr.send(arr.buffer);
    }
    return xhr.responseText;
  }

  this.submitUGO = function( submission, image, callback ) {
    var url = base_url;
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', url );
    function fail() {
      callback({"success": false})
    }
    xhr.onreadystatechange = function () {
      if ( xhr.readyState == 4 ) {
        if ( xhr.status == 200 ) {
          try {
            var obj = JSON.parse(xhr.responseText);
            if (obj.success) {
              var upload_url = obj.upload_url;
              delete obj.upload_url;
              uploadImage(upload_url, image, {
                    filename: submission.title,
                    callback : function() {
                      callback( obj );
                    }
                  });
            } else {
              fail();
            }
          } catch (err) {
            console.log(err);
            fail();
          }
        } else {
          fail();
        }
      }
    };
    xhr.send( JSON.stringify(submission) );

  }

};
