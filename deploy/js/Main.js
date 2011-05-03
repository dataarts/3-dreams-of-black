( function () {

	var logger, stats, renderer, renderTarget, shared,
	Signal = signals.Signal, currentSection,
	launcher, film, relauncher, exploration, ugc,
	shortcuts;

	// debug

	logger = new Logger();
	logger.domElement.style.position = 'fixed';
	logger.domElement.style.right = '100px';
	logger.domElement.style.top = '0px';
	document.body.appendChild( logger.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.right = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	shared = {

		logger : logger,

		mouse : { x: 0, y: 0 },

		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,

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
		sequences: {},
		started: { "city": false, "prairie": false, "dunes" : false }

	};

	launcher = new LauncherSection( shared );
	document.body.appendChild( launcher.getDomElement() );

	relauncher = new RelauncherSection( shared );
	document.body.appendChild( relauncher.getDomElement() );

	ugc = new UgcSection( shared );
	document.body.appendChild( ugc.getDomElement() );

	shortcuts = new Shortcuts( shared );
	document.body.appendChild( shortcuts.getDomElement() );

	shared.signals.load.add( function () {

		shared.signals.loadBegin.dispatch();

		film = new FilmSection( shared );
		document.body.appendChild( film.getDomElement() );

		exploration = new ExplorationSection( shared );
		document.body.appendChild( exploration.getDomElement() );

		shared.signals.showfilm.add( function () { setSection( film ); } );
		shared.signals.showexploration.add( function () { setSection( exploration ); } );

	} );

	shared.signals.showlauncher.add( function () { setSection( launcher ); } );
	shared.signals.showrelauncher.add( function () { setSection( relauncher ); } );
	shared.signals.showugc.add( function () { setSection( ugc ); } );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

	setSection( launcher );
	animate();

	//

	function setSection( section ) {

		if ( currentSection ) currentSection.hide();

		if ( ! section.__loaded ) {

			section.load();
			section.__loaded = true;

		}

		section.resize( window.innerWidth, window.innerHeight );
		section.show();

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

		logger.clear();
		currentSection.update();
		stats.update();

	}

} )();
