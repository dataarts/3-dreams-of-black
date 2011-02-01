var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer,
container, events;

var screenWidth, screenHeight,
screenWidthHalf, screenHeightHalf;

var tune, time, stats, gui;

var MAX_PROGRESS = 0, 

TIMER = -1,
	
SCHEDULE = {
"intro" : 0, 	// driving 2d
"1a" 	: 8,	// city  2d
"1b" 	: 16,	// city  3d
"2a" 	: 24,	// train 2d
"2b" 	: 32,	// train 3d
"3a" 	: 40,	// dunes 2d
"3b" 	: 48,	// dunes 3d
"end"	: 75
};

function $( id ) { return document.getElementById( id ); }
function show( element ) { element.style.display = "block"; }
function hide( element ) { element.style.display = "none"; }
	
var playback = {
	
	pi:  function() { skip_to_pattern( SCHEDULE[ "intro" ] ) },
	
	p1a: function() { skip_to_pattern( SCHEDULE[ "1a" ] ) },
	p1b: function() { skip_to_pattern( SCHEDULE[ "1b" ] ) },
	
	p2a: function() { skip_to_pattern( SCHEDULE[ "2a" ] ) },
	p2b: function() { skip_to_pattern( SCHEDULE[ "2b" ] ) },
	
	p3a: function() { skip_to_pattern( SCHEDULE[ "3a" ] ) },
	p3b: function() { skip_to_pattern( SCHEDULE[ "3b" ] ) }
	
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

	container = document.createElement( 'div' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	events = {

		mousemove : new Signal()

	};

	sequencer = new Sequencer();

	// Parts

	var ms_intro = tune.getPatternMS( SCHEDULE[ "intro" ] ),
		ms_1a = tune.getPatternMS( SCHEDULE[ "1a" ] ),
		ms_1b = tune.getPatternMS( SCHEDULE[ "1b" ] )
		ms_2a = tune.getPatternMS( SCHEDULE[ "2a" ] ),
		ms_2b = tune.getPatternMS( SCHEDULE[ "2b" ] ),
		ms_3a = tune.getPatternMS( SCHEDULE[ "3a" ] ),
		ms_3b = tune.getPatternMS( SCHEDULE[ "3b" ] ),
		ms_end= tune.getPatternMS( SCHEDULE[ "end" ] ),
		fs = -850, fe = 400;
	
	sequencer.add( new ClearEffect( renderer ), ms_intro, ms_end, 0 );

	sequencer.add( new Part1( camera, scene, renderer, events ), ms_1b, ms_2a, 1 );
	sequencer.add( new Part2( camera, scene, renderer, events ), ms_2b, ms_3a, 1 );
	sequencer.add( new Part3( camera, scene, renderer, events ), ms_3b, ms_end, 1 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ),  ms_1a + fs, ms_1a, 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), ms_1a,      ms_1a + fe, 2 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ),  ms_2a + fs, ms_2a, 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), ms_2a,      ms_2a + fe, 2 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ),  ms_3a + fs, ms_3a, 2 );
	sequencer.add( new FadeOutEffect( 0x000000, renderer ), ms_3a,      ms_3a + fe, 2 );
	
	// Stats
	
	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
		
	hide( stats.domElement );
	document.body.appendChild( stats.domElement );

	// GUI
	
	gui = new GUI();

	gui.add( audio, 'currentTime', 0, 210, 10 ).name( 'Time' ).listen();
	gui.add( camera.position, 'y', - 1000, 1000, 10 ).name( 'Camera Y' );
	
	var pi, p1a, p1b, p2a, p2b, p3a, p3b;
	
	pi  = gui.add( playback, 'pi' ).name( 'Intro' ).domElement.style;
	p1a = gui.add( playback, 'p1a' ).name( '2D City' ).domElement.style;
	p1b = gui.add( playback, 'p1b' ).name( '3D City' ).domElement.style;
	p2a = gui.add( playback, 'p2a' ).name( '2D Train' ).domElement.style;
	p2b = gui.add( playback, 'p2b' ).name( '3D Train' ).domElement.style;
	p3a = gui.add( playback, 'p3a' ).name( '2D Dunes' ).domElement.style;
	p3b = gui.add( playback, 'p3b' ).name( '3D Dunes' ).domElement.style;
	
	pi.backgroundColor = "hsl(200,5%,50%)";
	
	p1a.backgroundColor = p1b.backgroundColor = "hsl(200,25%,50%)";
	p2a.backgroundColor = p2b.backgroundColor = "hsl(120,65%,40%)";
	p3a.backgroundColor = p3b.backgroundColor = "hsl(40,65%,50%)";
	
	pi.borderLeft = "solid 5px hsl(200,95%,50%)";
	
	p1a.borderLeft = p1b.borderLeft = "solid 5px hsl(200,95%,50%)";
	p2a.borderLeft = p2b.borderLeft = "solid 5px hsl(120,95%,40%)";
	p3a.borderLeft = p3b.borderLeft = "solid 5px hsl(40,95%,50%)";
	
	gui.domElement.style.backgroundColor = "#222";
	
	hide( gui.domElement );
	document.body.appendChild( gui.domElement );

	// Global event handlers
	
	window.addEventListener( 'resize', onWindowResize, false );

	// Global parameters
	
	MAX_PROGRESS = $( "progress" ).offsetWidth;

	// Fake callback (for now)
	
	callback_final();
	
}

function callback_final() {
	
	$( "buttons_parts" ).className = "";
	$( "bar" ).style.width = MAX_PROGRESS + "px";
	
	function create_start( i ) { return function() { start( SCHEDULE[ buttons[i] ] ) } }
	
	var i, buttons = [ "i", "1a", "1b", "2a", "2b", "3a", "3b" ];
	for( i = 0; i < buttons.length; i++ )
		$( "b_" + buttons[ i ] ).addEventListener( "click", create_start( i ) );
	
}

function skip_to_pattern( pattern ) {
	
	audio.currentTime = tune.getBeatMS( pattern * tune.getRows() ) / 1000;
	
}

function start( pattern ) {
	
	hide( $( 'launcher' ) );
	show( stats.domElement );
	show( gui.domElement );

	audio.play();
	skip_to_pattern( pattern );


	if( TIMER == -1 ) {

		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		
		TIMER = setInterval( loop, 1000 / 120 );
		
	}
	
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
