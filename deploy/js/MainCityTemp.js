var WIDTH = 1024, HEIGHT = 436;

var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer,
container, shared;

var tune, time, stats, gui;

init();

function init() {

	audio = document.getElementById( 'audio' );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.autoClear = false;

	shared = {

		renderer: renderer,

		screenWidth: WIDTH,
		screenHeight: HEIGHT,

		screenWidthHalf: WIDTH / 2,
		screenHeightHalf: HEIGHT / 2,

		mouseX: 0,
		mouseY: 0,

		signals: {

			cameraFov : new Signal(),

			loadItemAdded : new Signal(),
			loadItemCompleted : new Signal(),

			mousemoved : new Signal(),
			windowresized : new Signal()

		}

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

	sequencer.add( new ClearEffect( renderer ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 0 );
	sequencer.add( new City( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 75 ), 1 );

}

function start( pattern ) {

	document.body.removeChild( document.getElementById( 'launcher' ) );

	container = document.createElement( 'div' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	//document.body.appendChild( gui.domElement );

	//gui.add(GUI, "showSaveString");
	//gui.add( audio, 'currentTime', 0, 210, 10 ).name( 'Time' ).listen();

	//gui.add( this, 'jumpToCity').name( 'City' );
	//gui.add( this, 'jumpToPrairie').name( 'Prairie' );
	//gui.add( this, 'jumpToDunes').name( 'Dunes' );

	audio.play();
	audio.currentTime = tune.getPatternMS( pattern ) / 1000;
	audio.volume = 0//.2;	

	//gui.add( audio, 'volume', 0, 1).name( 'Volume' );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	animate();

}

// Hack for gui-dat :/

this.jumpToCity = function () {

	audio.currentTime = tune.getPatternMS( 16 ) / 1000;

}

this.jumpToPrairie = function () {

	audio.currentTime = tune.getPatternMS( 32 ) / 1000;

}

this.jumpToDunes = function () {

	audio.currentTime = tune.getPatternMS( 48 ) / 1000;

}

function onDocumentKeyDown( event ) {

	switch( event.keyCode ) {

		case 32:

			audio.paused ? audio.play() : audio.pause();
			break;

		case 37:

			audio.currentTime -= 1;
			break;

		case 39:

			audio.currentTime += 1;
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

	shared.screenWidth = WIDTH * scale;
	shared.screenHeight = HEIGHT * scale;

	renderer.setSize( shared.screenWidth, shared.screenHeight );

	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = ( ( window.innerHeight - shared.screenHeight  ) / 2 ) + 'px';

	shared.signals.windowresized.dispatch();

}

function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function render() {

	sequencer.update( audio.currentTime * 1000 );

}
