var Demo = function () {

	var WIDTH = 1024, HEIGHT = 436;

	var Signal = signals.Signal;

	var domElement;

	var shared, audio, sequencer,
	renderer, renderTarget;

	var loadProgress, tune, time, logger, stats, gui;

	// init

	domElement = document.createElement( 'div' );

	logger = new Logger();
	logger.domElement.style.position = 'fixed';
	logger.domElement.style.left = '100px';
	logger.domElement.style.top = '0px';
	domElement.appendChild( logger.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	domElement.appendChild( stats.domElement );

	// audio

	audio = document.createElement( 'audio' );
	audio.autobuffer = true;
	domElement.appendChild( audio );

	source = document.createElement( 'source' );
	source.src = "files/Black.ogg";
	audio.appendChild( source );
	

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.autoClear = false;
	renderer.sortObjects = false;
	domElement.appendChild( renderer.domElement );

	renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT );
	renderTarget.minFilter = THREE.LinearFilter;
	renderTarget.magFilter = THREE.LinearFilter;

	shared = {

		logger: logger,

		baseWidth: WIDTH,
		baseHeight: HEIGHT,

		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,

		viewportWidth: WIDTH,
		viewportHeight: HEIGHT,

		mouseX: 0,
		mouseY: 0,

		signals: {

			loadItemAdded : new Signal(),
			loadItemCompleted : new Signal(),

			mousemoved : new Signal(),
			windowresized : new Signal()

		},

		renderer: renderer,
		renderTarget: renderTarget

	};

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	loadProgress = new LoadProgress( document.getElementById( 'loadProgress' ) );

	shared.signals.loadItemAdded.add( loadProgress.addItem );
	shared.signals.loadItemCompleted.add( loadProgress.completeItem );

	sequencer = new Sequencer();

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 0 );
	// sequencer.add( new NoiseEffect( shared, 0.79, 0.19, 2385 ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 2 );

	sequencer.add( new Intro( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );

	sequencer.add( new TransitionToCity( shared ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ), 1 );

	sequencer.add( new City( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 2 );
	sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.15, 0.0, 4096 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );

	sequencer.add( new TransitionToPrairie( shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ), 1 );

	sequencer.add( new Prairie( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 2 );
	sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.18, 0.0, 4096 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 4 );

	sequencer.add( new TransitionToDunes( shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ), 1 );

	sequencer.add( new Dunes( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 2 );
	sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.094, 0.0, 4096 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 4 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 8 ) - 850, tune.getPatternMS( 8 ), 5 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 8 ), tune.getPatternMS( 8 ) + 400, 5 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 24 ) - 850, tune.getPatternMS( 24 ), 5 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 24 ) + 400, 5 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 40 ) - 850, tune.getPatternMS( 40 ), 5 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 40 ) + 400, 5 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 72 ), tune.getPatternMS( 73.25 ), 5 );

	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 6 );


	function start( pattern ) {

		audio.currentTime = tune.getPatternMS( pattern ) / 1000;
		audio.play();

		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		// animate();

	}

	function onDocumentKeyDown( event ) {

		switch( event.keyCode ) {

			case 32:

				audio.paused ? audio.play() : audio.pause();
				break;

			case 37:

				audio.currentTime -= 1;
				sequencer.clear();
				break;

			case 39:

				audio.currentTime += 1;
				sequencer.clear();
				break;

		}

	}

	function onDocumentMouseMove( event ) {

		shared.mouseX = event.clientX;
		shared.mouseY = event.clientY;

		shared.signals.mousemoved.dispatch();

	}

	function onWindowResize( event ) {

		var scale = window.innerWidth / WIDTH;

		shared.screenWidth = window.innerWidth;
		shared.screenHeight = window.innerHeight;

		shared.viewportWidth = WIDTH * scale;
		shared.viewportHeight = HEIGHT * scale

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		// TODO: Hacky...

		renderTarget.width = shared.viewportWidth;
		renderTarget.height = shared.viewportHeight;
		delete renderTarget.__webglFramebuffer;

		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';

		shared.signals.windowresized.dispatch();

	}

	this.update = function () {

		logger.clear();
		sequencer.update( audio.currentTime * 1000 );
		stats.update();

	}

	function animate() {

		/*
		if ( audio.currentTime == audio.duration ) {

			document.body.appendChild( launcher );
			document.body.removeChild( experience );
			return;
		}
		*/

	}

}
