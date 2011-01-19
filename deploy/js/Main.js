var audio, sequencer,
camera, camera2, scene, renderer,
container;

var TUNE, QUALITY = 1;

var screenWidth, screenHeight,
screenWidthHalf, screenHeightHalf;

var time;

init();

function init() {

	audio = document.getElementById( 'audio' );

	camera = new THREE.Camera( 60, 800 / 600, 1, 20000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer2();
	renderer.setSize( 800, 600 );

	TUNE = new Tune( audio );
	TUNE.setBPM( 85 );
	TUNE.setRows( 4 );

	sequencer = new Sequencer();

	// Parts

	sequencer.add( new Part1( camera, scene, renderer ), TUNE.getPatternMS( 0 ), TUNE.getPatternMS( 24 ) );
	sequencer.add( new Part2( camera, scene, renderer ), TUNE.getPatternMS( 24 ), TUNE.getPatternMS( 40 ) );
	sequencer.add( new Part3( camera, scene, renderer ), TUNE.getPatternMS( 40 ), TUNE.getPatternMS( 75 ) );

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
	audio.currentTime = TUNE.getBeatMS( pattern * TUNE.getRows() ) / 1000;

	onWindowResize();
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

	SharedObject.mouse.x = event.clientX - screenWidthHalf;
	SharedObject.mouse.y = event.clientY - screenHeightHalf;

}

function onWindowResize( event ) {

	screenWidth = window.innerWidth / QUALITY;
	screenHeight = window.innerHeight / QUALITY;

	screenWidthHalf = screenWidth / 2;
	screenHeightHalf = screenHeight / 2;

	camera.aspect = screenWidth / screenHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( screenWidth, screenHeight );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';

}

function loop() {

	var ms = audio.currentTime * 1000;

	time.innerHTML = ( Math.floor( ms / TUNE.getMS() ) % TUNE.getRows() ) + " / " + ( Math.floor( ( ms / TUNE.getRows() ) / TUNE.getMS() ) ) + " — " + Math.floor( ms );

	sequencer.update( ms );

}
