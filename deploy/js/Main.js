var WIDTH = 1024, HEIGHT = 436;

var Signal = signals.Signal;

var launcher, experience;

var shared, audio, sequencer,
camera, camera2, scene, renderer, renderTarget;

var loadProgress, tune, time, logger, stats, gui;

initLauncher();
initExperience();

function initLauncher() {

	launcher = document.getElementById( 'launcher' );
	launcher.style.height = window.innerHeight + 'px';

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = window.innerHeight;

	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop(0, "#1e4877");
	gradient.addColorStop(0.5, "#4584b4");

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	launcher.style.background = 'url(' + canvas.toDataURL('image/png') + ')';

}

function initExperience() {

	experience = document.createElement( 'div' );

	logger = new Logger();
	logger.domElement.style.position = 'fixed';
	logger.domElement.style.left = '100px';
	logger.domElement.style.top = '0px';
	experience.appendChild( logger.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	experience.appendChild( stats.domElement );

	audio = document.getElementById( 'audio' );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.autoClear = false;
	renderer.sortObjects = false;
	experience.appendChild( renderer.domElement );

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

			cameraFov : new Signal(),

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
	// sequencer.add( new NoiseEffect( shared, 0.79, 0.19, 2385 ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 3 );

	sequencer.add( new Intro( shared ), tune.getPatternMS( 0 ) - 1500, tune.getPatternMS( 8 ), 1 );

	sequencer.add( new TransitionToCity( shared ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ), 1 );

	sequencer.add( new City( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 1 );
	sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.16, 0.0005, 2096 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 3 );

	sequencer.add( new TransitionToPrairie( shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ), 1 );

	sequencer.add( new Prairie( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.1647, 0.005, 2096 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 3 );

	sequencer.add( new TransitionToDunes( shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ), 1 );

	sequencer.add( new Dunes( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 3 );
	sequencer.add( new NoiseEffect( shared, 0.094, 0.0005, 2096 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 3 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 8 ) - 850, tune.getPatternMS( 8 ), 3 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 8 ), tune.getPatternMS( 8 ) + 400, 3 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 24 ) - 850, tune.getPatternMS( 24 ), 3 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 24 ) + 400, 3 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 40 ) - 850, tune.getPatternMS( 40 ), 3 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 40 ) + 400, 3 );

	sequencer.add( new FadeInEffect( 0x000000, shared ), tune.getPatternMS( 72 ), tune.getPatternMS( 73.25 ), 3 );

	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 4 );

}

function start( pattern ) {

	document.body.removeChild( launcher );
	document.body.appendChild( experience );

	/*
	var camera = { fov: 50 }

	gui = new GUI();
	gui.add( audio, 'currentTime', 0, 210, 10 ).name( 'Time' ).listen();
	gui.add( audio, 'volume', 0, 1 ).name( 'Volume' );
	gui.add( camera, 'fov', 0, 100 ).name( 'Camera.fov' ).onChange( function ( value ) {

		shared.signals.cameraFov.dispatch( value );

	});

	gui.add( this, 'jumpToCity' ).name( 'City' );
	gui.add( this, 'jumpToPrairie' ).name( 'Prairie' );
	gui.add( this, 'jumpToDunes' ).name( 'Dunes' );
	*/

	audio.currentTime = tune.getPatternMS( pattern ) / 1000;
	audio.play();

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	animate();

}

/*
this.jumpToCity = function () {

	audio.currentTime = tune.getPatternMS( 16 ) / 1000;

}

this.jumpToPrairie = function () {

	audio.currentTime = tune.getPatternMS( 32 ) / 1000;

}

this.jumpToDunes = function () {

	audio.currentTime = tune.getPatternMS( 48 ) / 1000;

}
*/

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

function animate() {

	requestAnimationFrame( animate, renderer.domElement );

	logger.clear();
	render();
	stats.update();

}

function render() {

	sequencer.update( audio.currentTime * 1000 );

}
