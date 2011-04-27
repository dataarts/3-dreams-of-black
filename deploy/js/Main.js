( function () {

	var logger, stats, shared,
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

	// init

	shared = {

		logger : logger,

		mouse : { x: 0, y: 0 },

		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,

		signals : {

			mousemoved : new Signal(),
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

			startexploration: new Signal()

		},

		worlds: {},
		started: { "city": false, "prairie": false, "dunes" : false }

	};

	launcher = new Launcher( shared );
	document.body.appendChild( launcher.getDomElement() );

	shared.signals.load.add( function () {

		film = new Film( shared );
		document.body.appendChild( film.getDomElement() );

		relauncher = new Relauncher( shared );
		document.body.appendChild( relauncher.getDomElement() );

		exploration = new Exploration( shared );
		document.body.appendChild( exploration.getDomElement() );

		ugc = new Ugc( shared );
		document.body.appendChild( ugc.getDomElement() );

		shortcuts = new Shortcuts( shared );
		document.body.appendChild( shortcuts.getDomElement() );

		// signals

		shared.signals.showlauncher.add( function () { setSection( launcher ); } );
		shared.signals.showfilm.add( function () { setSection( film ); } );
		shared.signals.showrelauncher.add( function () { setSection( relauncher ); } );
		shared.signals.showexploration.add( function () { setSection( exploration ); } );
		shared.signals.showugc.add( function () { setSection( ugc ); } );

	} );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	//

	shared.signals.loadBegin.dispatch();

	// shared.signals.showlauncher.dispatch();
	setSection( launcher );
	animate();

	//

	function setSection( section ) {

		if ( currentSection ) {

			if ( currentSection == film ) shared.signals.stopfilm.dispatch();
			currentSection.getDomElement().style.display = 'none';

		}

		currentSection = section;
		currentSection.getDomElement().style.display = 'block';

	};

	function onDocumentMouseMove( event ) {

		shared.mouse.x = event.clientX;
		shared.mouse.y = event.clientY;

		shared.signals.mousemoved.dispatch();

	};

	function onWindowResize( event ) {

		shared.screenWidth = window.innerWidth;
		shared.screenHeight = window.innerHeight;

		shared.signals.windowresized.dispatch();

	};

	function animate() {

		requestAnimationFrame( animate );

		logger.clear();
		currentSection.update();
		stats.update();

	};

} )();
