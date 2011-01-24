var audio, sequencer,
camera, camera2, scene, renderer,
container, events;

var screenWidth, screenHeight,
screenWidthHalf, screenHeightHalf;

var tune, time;

init();

function init() {

	audio = document.getElementById( 'audio' );

	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	screenWidthHalf = screenWidth / 2;
	screenHeightHalf = screenHeight / 2;

	camera = new THREE.Camera( 60, screenWidth / screenHeight, 1, 20000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer2();
	renderer.setSize( screenWidth, screenHeight );

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	events = {

		mousemoved : new signals.Signal()

	};

	sequencer = new Sequencer();

	// Parts

	sequencer.add( new Part1( camera, scene, renderer, events ), tune.getPatternMS( 16 /*0*/ ), tune.getPatternMS( 24 ) );
	sequencer.add( new Part2( camera, scene, renderer, events ), tune.getPatternMS( 32 /*24*/ ), tune.getPatternMS( 40 ) );
	sequencer.add( new Part3( camera, scene, renderer, events ), tune.getPatternMS( 75 /*40*/ ), tune.getPatternMS( 75 ) );

}

function start( pattern ) {

	document.body.removeChild( document.getElementById( 'launcher' ) );

	container = document.createElement( 'div' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );

	time = document.createElement( 'div' );
	time.style.position = 'fixed';
	time.style.left = '0px';
	time.style.top = '0px';
	time.style.backgroundColor = '#ffffff';
	time.style.padding = '5px 10px';
	document.body.appendChild( time );

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

	events.mousemoved.dispatch( event.clientX - screenWidthHalf, event.clientY - screenHeightHalf );

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

	var ms = audio.currentTime * 1000;

	time.innerHTML = ( Math.floor( ms / tune.getMS() ) % tune.getRows() ) + " / " + ( Math.floor( ( ms / tune.getRows() ) / tune.getMS() ) ) + " — " + Math.floor( ms );

	sequencer.update( ms );

}
