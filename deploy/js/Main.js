var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer,
container, events;

var screenWidth, screenHeight,
screenWidthHalf, screenHeightHalf;

var tune, time, stats, gui;

var MAX_PROGRESS = 0, 
	
PARTS_SCHEDULE = {
"1a" : 0,	// city  2d
"1b" : 16,	// city  3d
"2a" : 24,	// train 2d
"2b" : 32,	// train 3d
"3a" : 40,	// dunes 2d
"3b" : 48	// dunes 3d
};

function $( id ) { return document.getElementById( id ); }

var playback = {
	
	p1a: function() { skip_to_pattern( PARTS_SCHEDULE[ "1a" ] ) },
	p1b: function() { skip_to_pattern( PARTS_SCHEDULE[ "1b" ] ) },
	
	p2a: function() { skip_to_pattern( PARTS_SCHEDULE[ "2a" ] ) },
	p2b: function() { skip_to_pattern( PARTS_SCHEDULE[ "2b" ] ) },
	
	p3a: function() { skip_to_pattern( PARTS_SCHEDULE[ "3a" ] ) },
	p3b: function() { skip_to_pattern( PARTS_SCHEDULE[ "3b" ] ) }
	
}

function init() {

	audio = $( 'audio' );

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

	events = {

		mousemove : new Signal()

	};

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

	MAX_PROGRESS = $( "progress" ).offsetWidth;
	
	callback_final();
	
}

function callback_final() {
	
	$( "buttons_parts" ).className = "";
	$( "bar" ).style.width = MAX_PROGRESS + "px";
	
	function create_start( i ) { return function() { start( PARTS_SCHEDULE[ buttons[i] ] ) } }
	
	var i, buttons = [ "1a", "1b", "2a", "2b", "3a", "3b" ];
	for( i = 0; i < buttons.length; i++ )
		$( "b_" + buttons[ i ] ).addEventListener( "click", create_start( i ) );
	
}

function skip_to_pattern( pattern ) {
	
	audio.currentTime = tune.getBeatMS( pattern * tune.getRows() ) / 1000;
	
}

function start( pattern ) {
	
	document.body.removeChild( $( 'launcher' ) );

	container = document.createElement( 'div' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	gui = new GUI();
	document.body.appendChild( gui.domElement );

	gui.add( audio, 'currentTime', 0, 210, 10 ).name( 'Time' ).listen();
	gui.add( camera.position, 'y', - 1000, 1000, 10 ).name( 'Camera Y' );
	
	var p1a, p1b, p2a, p2b, p3a, p3b;
	
	p1a = gui.add( playback, 'p1a' ).name( '2D City' ).domElement.style;
	p1b = gui.add( playback, 'p1b' ).name( '3D City' ).domElement.style;
	p2a = gui.add( playback, 'p2a' ).name( '2D Train' ).domElement.style;
	p2b = gui.add( playback, 'p2b' ).name( '3D Train' ).domElement.style;
	p3a = gui.add( playback, 'p3a' ).name( '2D Dunes' ).domElement.style;
	p3b = gui.add( playback, 'p3b' ).name( '3D Dunes' ).domElement.style;
	
	p1a.backgroundColor = p1b.backgroundColor = "hsl(200,25%,50%)";
	p2a.backgroundColor = p2b.backgroundColor = "hsl(120,65%,40%)";
	p3a.backgroundColor = p3b.backgroundColor = "hsl(40,65%,50%)";
	
	p1a.borderLeft = p1b.borderLeft = "solid 5px hsl(200,95%,50%)";
	p2a.borderLeft = p2b.borderLeft = "solid 5px hsl(120,95%,40%)";
	p3a.borderLeft = p3b.borderLeft = "solid 5px hsl(40,95%,50%)";

	audio.play();
	skip_to_pattern( pattern );

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
	/*
	s = s - m*60;
	info.time = ( Math.floor( ms / tune.getMS() ) % tune.getRows() ) + " / " + ( Math.floor( ( ms / tune.getRows() ) / tune.getMS() ) ) + " — " + m + ":" + ( (s < 10) ? "0" : "" ) + s.toFixed(1);
	*/

	sequencer.update( ms );
	stats.update();

}
