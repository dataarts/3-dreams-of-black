var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer,
container, events;

var screenWidth, screenHeight,
screenWidthHalf, screenHeightHalf;

var tune, time, stats;

init();

function init() {

	audio = document.getElementById( 'audio' );

	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	screenWidthHalf = screenWidth / 2;
	screenHeightHalf = screenHeight / 2;

	camera = new THREE.Camera( 60, screenWidth / screenHeight, 1, 10000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer2();
	renderer.setSize( screenWidth, screenHeight );
	renderer.sortObjects = false;
	renderer.autoClear = false;

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	time = "";

	events = {

		mousemove : new Signal()

	};

	GUI.start();
	GUI.add( camera.position, 'y', - 1000, 1000, 10 ).setName('Camera Y');

	sequencer = new Sequencer();

	// Parts

	sequencer.add( new ClearEffect( renderer ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 0 );

	sequencer.add( new Part1( camera, scene, renderer, events ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 1 );
	sequencer.add( new Part2( camera, scene, renderer, events ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 1 );
	sequencer.add( new Part3( camera, scene, renderer, events ), tune.getPatternMS( 48 ), tune.getPatternMS( 75 ), 1 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ), tune.getPatternMS( 8 ) - 850, tune.getPatternMS( 8 ), 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), tune.getPatternMS( 8 ), tune.getPatternMS( 8 ) + 400, 2 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ), tune.getPatternMS( 24 ) - 850, tune.getPatternMS( 24 ), 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), tune.getPatternMS( 24 ), tune.getPatternMS( 24 ) + 400, 2 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ), tune.getPatternMS( 40 ) - 850, tune.getPatternMS( 40 ), 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), tune.getPatternMS( 40 ), tune.getPatternMS( 40 ) + 400, 2 );

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

	audio.play();
	audio.currentTime = tune.getBeatMS( pattern * tune.getRows() ) / 1000;

	window.addEventListener( 'resize', onWindowResize, false );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	setInterval( loop, 1000 / 120 );
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

	events.mousemove.dispatch( event.clientX - screenWidthHalf, event.clientY - screenHeightHalf );

}

function onWindowResize( event ) {

	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	screenWidthHalf = screenWidth / 2;
	screenHeightHalf = screenHeight / 2;

	camera.aspect = screenWidth / screenHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( screenWidth, screenHeight );

}

function loop() {

	var ms = audio.currentTime * 1000,
		s = Math.floor( ms ) / 1000,
		m = Math.floor( s / 60 );

	s = s - m*60;
	time = ( Math.floor( ms / tune.getMS() ) % tune.getRows() ) + " / " + ( Math.floor( ( ms / tune.getRows() ) / tune.getMS() ) ) + " — " + m + ":" + ( (s < 10) ? "0" : "" ) + s.toFixed(1);

	sequencer.update( ms );
	stats.update();

}
