( function () {

	var logger, stats, renderer, renderTarget, shared,
	Signal = signals.Signal, currentSection,
	launcher, film, relauncher, exploration, ugc,
	shortcuts, lastBeta = 0, lastGamma = 0;

	var historySections = [
		"film",
		"explore",
		"relauncher",
		"tool"
	];

	var stickyHistory = [
		'/',
		'/film',
		'/explore'
	];
	var historyDispatches = [];

	shared = {

		mouse : { x: 0, y: 0 },

		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		loadedContent: false,
		hasExplored: false,
		originLink: window.location.pathname.toString(),
		shouldSkip: false,

		signals : {

			mousedown : new Signal(),
			mouseup : new Signal(),
			mousemoved : new Signal(),
			mousewheel : new Signal(),

			keydown : new Signal(),
			keyup : new Signal(),

			windowresized : new Signal(),

			load : new Signal(),

			showlauncher : new Signal(),
			showfilm : new Signal(),
			showrelauncher : new Signal(),
			showexploration : new Signal(),
			showugc : new Signal(),

			loadBegin : new Signal(),
			loadItemAdded : new Signal(),
			loadItemCompleted : new Signal(),

			startfilm : new Signal(),
			stopfilm : new Signal(),

			startexploration: new Signal(),

			initscenes: new Signal()

		},

		worlds: {},
		soups: {},
		sequences: {},
		started: { "city": false, "prairie": false, "dunes" : false },

		currentTime: 0,
		isExperience: false

	};

	launcher = new LauncherSection( shared );
	document.body.appendChild( launcher.getDomElement() );

	relauncher = new RelauncherSection( shared );
	document.body.appendChild( relauncher.getDomElement() );

	ugc = new UgcSection( shared );
	document.body.appendChild( ugc.getDomElement() );

	shortcuts = new Shortcuts( shared );
	var sEl = shortcuts.getDomElement();
	sEl.style.display = "none";
	sEl.id = "shortcuts";
	document.body.appendChild( sEl );

	shared.signals.load.add( function () {

		shared.signals.loadBegin.dispatch();

		film = new FilmSection( shared );
		document.body.appendChild( film.getDomElement() );

		exploration = new ExplorationSection( shared );
		document.body.appendChild( exploration.getDomElement() );

		shared.signals.showfilm.add( function () { setSection( film, historySections[0], "/" + historySections[0] ); } );
		shared.signals.showexploration.add( function () { setSection( exploration, historySections[1], "/" + historySections[1] ); } );

	} );
	shared.signals.showfilm.add( loadBuffer );
	shared.signals.showexploration.add( loadBuffer );

	shared.signals.showlauncher.add( function () { setSection( launcher, "/", "/" ); } );
	shared.signals.showlauncher.add( loadExploreOnLoad );
	shared.signals.showrelauncher.add( function () { setSection( relauncher, historySections[2], "/" + historySections[2] ); } );
	shared.signals.showugc.add( function () { setSection( ugc, historySections[3], "/" + historySections[3] ); } );

	historyDispatches.push( shared.signals.showfilm );
	historyDispatches.push( shared.signals.showexploration );
	historyDispatches.push( shared.signals.showrelauncher );
	historyDispatches.push( shared.signals.showugc );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );
	window.addEventListener( 'MozOrientation', onWindowDeviceOrientation, false);

	window.addEventListener( 'resize', onWindowResize, false );

	handleHistory();
	animate();

	//

	function loadExploreOnLoad() {

		if( shared.originLink.match("/explore") && !shared.loadedContent ) {

			// set some special load logic
			shared.shouldSkip = true;

		}
	}

	// Main listener for History API
	window.onpopstate = function(e) {

		handleHistory();

	};

	function loadBuffer() {

		if(!shared.loadedContent) {

			shared.signals.showlauncher.dispatch();

		}

	}

	function handleHistory() {

		// Handle History API stuff

		var folder = window.location.pathname.toString();

		if (folder === "\/" || folder === "/index.html" ) {

			shared.signals.showlauncher.dispatch();

		} else {

			for(var i = 0; i < historySections.length; i++) {

				if(folder.match(historySections[i])) {

					historyDispatches[i].dispatch();
					if(i == 0) {

						shared.signals.startfilm.dispatch( 0, 1 );

					} else if(i == 1) {

						shared.signals.startexploration.dispatch( 'dunes' );

					}
					break;

				}

			}

		}

	}

	function setSection( section, title, path ) {

		if ( currentSection ) currentSection.hide();

		if ( ! section.__loaded ) {

			section.load();
			section.__loaded = true;

		}

		section.resize( window.innerWidth, window.innerHeight );
		section.show();


		if ( title && path ) {

			var i = stickyHistory.length;

			while ( i-- ) {

				if ( stickyHistory[i] === path ) {

					path += window.location.search;
					break;

				}
			}

			if ( history ) {

				var pState = window.location.pathname.toString();
				history.pushState( { "pState": pState }, title, path );

			}

		}

		currentSection = section;

	}

	function onDocumentMouseDown( event ) {

		shared.signals.mousedown.dispatch( event );

		event.preventDefault();
		event.stopPropagation();

	}

	function onDocumentMouseUp( event ) {

		shared.signals.mouseup.dispatch( event );

		event.preventDefault();
		event.stopPropagation();

	}

	function onDocumentMouseMove( event ) {

		shared.mouse.x = event.clientX;
		shared.mouse.y = event.clientY;

		shared.signals.mousemoved.dispatch( event );

	}

	// Accelerometer data in question
	function onWindowDeviceOrientation( event ) {

		if ( currentSection == ugc ) return;

		if ( ! event.gamma && !event.beta ) {

			event.gamma = -(event.x * (180 / Math.PI));
			event.beta = -(event.y * (180 / Math.PI));

		} else if( event.alpha == null && event.beta == null && event.gamma == null ) {

			window.removeEventListener( "deviceorientation", onWindowDeviceOrientation, false );
			window.removeEventListener( "MozOrientation", onWindowDeviceOrientation, false );

		}

		var overThreshold = Math.abs(event.gamma) > 4 || Math.abs(event.beta) > 4;
		var gamma = overThreshold ? event.gamma : 0;
		var beta = overThreshold ? event.beta : 0;

		if ( lastGamma != gamma || lastBeta != beta) {

			var x = Math.round( 1.5 * gamma ) + shared.mouse.x;
			var y = ( - Math.round( 1.5 * beta ) ) + shared.mouse.y;

			if( Math.abs( x ) > window.innerWidth ) {

				if( x < 0 ) {

					x = -window.innerWidth;

				} else {

					x = window.innerWidth;

				}

			}

			if( Math.abs( y ) > window.innerHeight ) {

				if( y < 0 ) {

					y = -window.innerHeight;

				} else {

					y = window.innerHeight;

				}

			}

			shared.mouse.x = x;
			shared.mouse.y = y;

			lastGamma = gamma;
			lastBeta = beta;

			shared.signals.mousemoved.dispatch( event );

		}

	}

	function onDocumentMouseWheel( event ) {

		shared.signals.mousewheel.dispatch( event );

	}

	function onDocumentKeyDown( event ) {

		shared.signals.keydown.dispatch( event );

	}

	function onDocumentKeyUp( event ) {

		shared.signals.keyup.dispatch( event );

	}

	function onWindowResize( event ) {

		currentSection.resize( window.innerWidth, window.innerHeight );

		shared.screenWidth = window.innerWidth;
		shared.screenHeight = window.innerHeight;

		shared.signals.windowresized.dispatch();

	}

	function animate() {

		requestAnimationFrame( animate );

		if ( currentSection ) {

			currentSection.update();

		}

	}

} )();
