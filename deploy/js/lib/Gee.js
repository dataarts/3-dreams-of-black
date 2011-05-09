/*
 * gee.js - http://georgealways.github.com/gee
 * 
 * George Michael Brower - http://georgemichaelbrower.com
 * Jono Brandel - http://jonobr1.com
 */
 // ==ClosureCompiler==
 // @output_file_name gee.min.js
 // @compilation_level ADVANCED_OPTIMIZATIONS
 // ==/ClosureCompiler==
 window['GEE'] = function(params) {

 	if ( !params ) {
 		params = {};
 	}

 	// Do we support canvas?
 	if ( !document.createElement('canvas').getContext ) {
 		if ( params.fallback ) { 
 			params.fallback();
 		}
 		return;
 	}	

 	var _this = this,
 		_keysDown = {},
 		_privateParts = 
 		 {
 			'ctx':		    undefined,
 			'domElement':   undefined,
 			'width':	    undefined,
 			'height':	    undefined,
 			'desiredFrameTime':    1E3/60,
 			'frameCount':   0,
 			'key':	        undefined,
 			'keyCode':      undefined,
 			'mouseX':       0,
 			'mouseY':       0,
 			'pmouseX':	    undefined,
 			'pmouseY':	    undefined,
 			'mousePressed': false
 		},
 		_actualFrameTime = undefined,
 		d; // shorthand for the dom element

 	var getOffset = function() {
 		var obj = d;
 		var x = 0, y = 0;
 		while (obj) {
 			y += obj.offsetTop;
 			x += obj.offsetLeft;
 			obj = obj.offsetParent;
 		}
 		offset = { x:x, y:y };
 	};

 	// Default parameters

 	if ( !params['context'] ) {
 		params['context'] = '2d';
 	}

 	if ( !params['width'] ) {
 		params['width'] = 500;
 	}

 	if ( !params['height'] ) {
 		params['height'] = 500;
 	}

 	// Create domElement, grab context

 	d = _privateParts['domElement'] = document.createElement('canvas');
 	_privateParts['ctx'] = d.getContext( params['context'] );

 	// Are we capable of this context?

 	if ( _privateParts['ctx'] == null) {
 		if ( params.fallback ) { 
 			params.fallback();
 		}
 		return;
 	}

 	// Set up width and height setters / listeners

 	if ( params['fullscreen'] ) {

 		var onResize = function() {
 			getOffset();
 			_privateParts['width'] = d['width'] = window.innerWidth;
 			_privateParts['height'] = d['height'] = window.innerHeight-4;
 		};
 		window.addEventListener( 'resize', onResize, false );
 		onResize();

 		if ( !params['container'] ) {
 			params['container'] = document['body'];
 		}
 		document.body.style.margin = '0px';
 		document.body.style.padding = '0px';

 	} else { 

 		getOffset();
 		_this.__defineSetter__('width', function(v) {
 			_privateParts['width'] = d['width'] = v;
 		});

 		_this.__defineSetter__('height', function(v) {
 			_privateParts['height'] = d['height'] = v;
 		});

 		_this['width'] = params['width'];
 		_this['height'] = params['height'];

 	}

 	// Put it where we talked about (if we talked about it).

 	if ( params['container'] ) {
 		params['container'].appendChild(d);
 		getOffset();
 	}	


 	var getter = function(n) {
 		_this.__defineGetter__(n, function() {
 			return _privateParts[n];
 		});
 	};

 	// Would love to reduce this to params.

 	getter('ctx');
 	getter('width');
 	getter('height');
 	getter('frameCount');
 	getter('key');
 	getter('keyCode');
 	getter('mouseX');
 	getter('mouseY');
 	getter('pmouseX');
 	getter('pmouseY');
 	getter('mousePressed');
	getter('domElement');

 	var n = function() {};

 	// TODO: Ensure data type
 	_this['loop'] = true;

 	// TODO: Ensure data type
 	_this['keyup'] = n;
 	_this['keydown'] = n;
 	_this['draw'] = n;
 	_this['mousedown'] = n;
 	_this['mouseup'] = n;
 	_this['mousemove'] = n;
 	_this['mousedrag'] = n;

 	// Custom Getters & Setters

 	_this.__defineGetter__('frameRate', function(v) {
 		return 1E3/_actualFrameTime;
 	});

 	_this.__defineGetter__('frameTime', function(v) {
 		return _actualFrameTime;
 	});

 	_this.__defineGetter__('keyPressed', function(v) {
 		for (var i in _keysDown) {
 			if (_keysDown[i]) {
 				return true;
 			}
 		}
 		return false;
 	});

 	_this.__defineSetter__('frameTime', function(v) {
 		_privateParts['desiredFrameTime'] = v;
 	});

 	_this.__defineSetter__('frameRate', function(v) {
 		_privateParts['desiredFrameTime'] = k/v;
 	});

 	// Listeners

 	d.addEventListener('mouseenter', function(e) {
 		getOffset();
 	}, false);

 	var fireMouseMove = function(e) {
 		_this['mousemove']();
 	};

 	var updateMousePosition = function(e) {
 		var x = e.pageX - offset.x;
 		var y = e.pageY - offset.y;
 		if (_privateParts['pmouseX'] == undefined) {
 			_privateParts['pmouseX'] = x;
 			_privateParts['pmouseY'] = y;
 		} else { 
 			_privateParts['pmouseX'] = _privateParts['mouseX'];
 			_privateParts['pmouseY'] = _privateParts['mouseY'];
 		}
 		_privateParts['mouseX'] = x;
 		_privateParts['mouseY'] = y;
 	}

 	window.addEventListener('mousemove', updateMousePosition, false);
 	window.addEventListener('mousemove', fireMouseMove, false);

 	// d.addEventListener('mousedown', function() {
 	// 	_privateParts['mousePressed'] = true;
 	// 	_this['mousedown']();
 	// 	d.addEventListener('mousemove', _this['mousedrag'], false);
 	// 	d.removeEventListener('mousemove', fireMouseMove, false);
 	// }, false);
 	// 
 	// d.addEventListener('mouseup', function() {
 	// 	_privateParts['mousePressed'] = false;
 	// 	_this['mouseup']();
 	// 	d['removeEventListener']('mousemove', _this['mousedrag'], false);
 	// 	d.addEventListener('mousemove', fireMouseMove, false);
 	// }, false);
 	// 
 	// window.addEventListener('keydown', function(e) {
 	// 	var kc = e.keyCode;
 	// 	_privateParts['key'] = String.fromCharCode(kc); // Kinda busted.
 	// 	_privateParts['keyCode'] = kc;
 	// 	_keysDown[kc] = true;
 	// 	_this['keydown']();
 	// }, false);
 	// 
 	// window.addEventListener('keyup', function(e) {
 	// 	var kc = e.keyCode;
 	// 	_privateParts['key'] = String.fromCharCode(kc); // Kinda busted.
 	// 	_privateParts['keyCode'] = kc;
 	// 	_keysDown[kc] = false;
 	// 	_this['keyup']();
 	// }, false);

	/*

 	// Internal loop.

 	var requestAnimationFrame = (function() {
       return  window.requestAnimationFrame       || 
               window.webkitRequestAnimationFrame || 
               window.mozRequestAnimationFrame    || 
               window.oRequestAnimationFrame      || 
               window.msRequestAnimationFrame     || 
               function (callback) {
                 window.setTimeout(callback, _actualFrameTime);
               };
     })();

 	_idraw = function() {

 		if ( _this['loop'] === true ) {
 			requestAnimationFrame( _idraw );
 		}

 		_privateParts['frameCount']++;
 		var prev = new Date().getTime();

 		_this['draw']();

 		var delta = new Date().getTime() - prev;

 		if (delta > _privateParts['desiredFrameTime']) { 
 			_actualFrameTime = delta;
 		} else {
 			_actualFrameTime = _privateParts['desiredFrameTime'];
 		}

 	};

 	_idraw();

 	*/

 }
