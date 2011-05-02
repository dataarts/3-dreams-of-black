var WIDTH = 1024, HEIGHT = 436;

var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer, renderTarget,
container, shared;

var tune, time, stats, gui;

var painterEffect;

init();

function init() {

	audio = document.getElementById( 'audio' );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.autoClear = false;
	renderer.sortObjects = false;

	renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT, { depthBuffer: true, stencilBuffer: true } );
	renderTarget.minFilter = THREE.LinearFilter;
	renderTarget.magFilter = THREE.LinearFilter;

	shared = {

		logger: logger = new Logger(), // hack

		baseWidth: WIDTH,
		baseHeight: HEIGHT,

		sequences: {},

		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,

		viewportWidth: WIDTH,
		viewportHeight: HEIGHT,

		mouse : { x: 0, y : 0 },

		signals: {

			loadBegin : new Signal(),
			loadItemAdded : new Signal(),
			loadItemCompleted : new Signal(),

			mousemoved : new Signal(),
			windowresized : new Signal()

		},

		worlds: {},
		started: { "city": false, "prairie": false, "dunes" : false },

		renderer: renderer,
		renderTarget: renderTarget

	};

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();


	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	sequencer = new Sequencer();

	var dunes = new Dunes( shared );
	painterEffect = new PaintEffectDunes( shared );

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 0 );
	sequencer.add( dunes, tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 1 );
	sequencer.add( painterEffect, tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 4 );
/*
	setSlider( "colorFactor", "", painterEffect.uniforms.colorFactor.value );
	setSlider( "colorOffset", "", painterEffect.uniforms.colorOffset.value );
	setSlider( "colorBrightness", "", painterEffect.uniforms.colorBrightness.value );
	setSlider( "vingenettingOffset", "", painterEffect.uniforms.vingenettingOffset.value );
	setSlider( "vingenettingDarkening", "", painterEffect.uniforms.vingenettingDarkening.value );
	setSlider( "sampleDistance", "", painterEffect.uniforms.sampleDistance.value );
	setSlider( "waveFactor", "", painterEffect.uniforms.waveFactor.value );

	setSlider( "ambient", "r", shared.worlds.dunes.ambient.color.r );
	setSlider( "ambient", "g", shared.worlds.dunes.ambient.color.g );
	setSlider( "ambient", "b", shared.worlds.dunes.ambient.color.b );

	setSlider( "directionalLight1", "r", shared.worlds.dunes.directionalLight1.color.r );
	setSlider( "directionalLight1", "g", shared.worlds.dunes.directionalLight1.color.g );
	setSlider( "directionalLight1", "b", shared.worlds.dunes.directionalLight1.color.b );

	setSlider( "directionalLight1", "x", shared.worlds.dunes.directionalLight1.position.x );
	setSlider( "directionalLight1", "y", shared.worlds.dunes.directionalLight1.position.y );
	setSlider( "directionalLight1", "z", shared.worlds.dunes.directionalLight1.position.z );
	
	setSlider( "directionalLight2", "r", shared.worlds.dunes.directionalLight2.color.r );
	setSlider( "directionalLight2", "g", shared.worlds.dunes.directionalLight2.color.g );
	setSlider( "directionalLight2", "b", shared.worlds.dunes.directionalLight2.color.b );

	setSlider( "directionalLight2", "x", shared.worlds.dunes.directionalLight2.position.x );
	setSlider( "directionalLight2", "y", shared.worlds.dunes.directionalLight2.position.y );
	setSlider( "directionalLight2", "z", shared.worlds.dunes.directionalLight2.position.z );

	setSlider( "vectorA", "x", DunesShaderColors.vectorA.x );
	setSlider( "vectorA", "y", DunesShaderColors.vectorA.y );
	setSlider( "vectorA", "z", DunesShaderColors.vectorA.z );

	setSlider( "vectorB", "x", DunesShaderColors.vectorB.x );
	setSlider( "vectorB", "y", DunesShaderColors.vectorB.y );
	setSlider( "vectorB", "z", DunesShaderColors.vectorB.z );

	setSlider( "vectorC", "x", DunesShaderColors.vectorC.x );
	setSlider( "vectorC", "y", DunesShaderColors.vectorC.y );
	setSlider( "vectorC", "z", DunesShaderColors.vectorC.z );
*/
	shared.signals.loadItemCompleted.add( doStart )
	
}


function doStart() {

	shared.signals.loadItemCompleted.remove( doStart );
	start( 16 );
		
}


function start( pattern ) {

	container = document.getElementById( 'experience' );
	container.appendChild( renderer.domElement );
//	document.body.appendChild( container );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
//	document.body.appendChild( stats.domElement );

	//document.body.appendChild( gui.domElement );

	//gui.add(GUI, "showSaveString");
	//gui.add( audio, 'currentTime', 0, 210, 10 ).name( 'Time' ).listen();

	//gui.add( this, 'jumpToCity').name( 'City' );
	//gui.add( this, 'jumpToPrairie').name( 'Prairie' );
	//gui.add( this, 'jumpToDunes').name( 'Dunes' );

	audio.play();
	//audio.currentTime = tune.getPatternMS( pattern ) / 1000;
	audio.volume = 0.0;

	//gui.add( audio, 'volume', 0, 1).name( 'Volume' );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', function() { shared.forward = false; }, false );
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
			
		case 87:
		case 38:
			
			shared.forward = true;

	}

}

function onDocumentMouseMove( event ) {

	shared.mouse.x = event.clientX;
	shared.mouse.y = event.clientY;

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
	render();
	stats.update();

}

function render() {

	sequencer.update( audio.currentTime * 1000 );

}
