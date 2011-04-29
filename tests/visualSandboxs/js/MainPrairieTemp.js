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
	renderTarget.minFilter = THREE.NearestFilter;
	renderTarget.magFilter = THREE.NearestFilter;

	shared = {

		logger: logger = new Logger(), // hack

		baseWidth: WIDTH,
		baseHeight: HEIGHT,

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


	var prairie = new Prairie( shared );
	painterEffect = new PaintEffectPrairie( shared );

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 0 );
	sequencer.add( prairie, tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 1 );
	sequencer.add( painterEffect, tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 4 );

	setSlider( "colorFactor", "", painterEffect.uniforms.colorFactor.value );
	setSlider( "colorOffset", "", painterEffect.uniforms.colorOffset.value );
	setSlider( "colorBrightness", "", painterEffect.uniforms.colorBrightness.value );
	setSlider( "vingenettingOffset", "", painterEffect.uniforms.vingenettingOffset.value );
	setSlider( "vingenettingDarkening", "", painterEffect.uniforms.vingenettingDarkening.value );
	setSlider( "sampleDistance", "", painterEffect.uniforms.sampleDistance.value );
	setSlider( "waveFactor", "", painterEffect.uniforms.waveFactor.value );

	setSlider( "ambient", "r", shared.worlds.prairie.ambient.color.r );
	setSlider( "ambient", "g", shared.worlds.prairie.ambient.color.g );
	setSlider( "ambient", "b", shared.worlds.prairie.ambient.color.b );

	setSlider( "directionalLight1", "r", shared.worlds.prairie.directionalLight1.color.r );
	setSlider( "directionalLight1", "g", shared.worlds.prairie.directionalLight1.color.g );
	setSlider( "directionalLight1", "b", shared.worlds.prairie.directionalLight1.color.b );

	setSlider( "directionalLight1", "x", shared.worlds.prairie.directionalLight1.position.x );
	setSlider( "directionalLight1", "y", shared.worlds.prairie.directionalLight1.position.y );
	setSlider( "directionalLight1", "z", shared.worlds.prairie.directionalLight1.position.z );
	
	setSlider( "directionalLight2", "r", shared.worlds.prairie.directionalLight2.color.r );
	setSlider( "directionalLight2", "g", shared.worlds.prairie.directionalLight2.color.g );
	setSlider( "directionalLight2", "b", shared.worlds.prairie.directionalLight2.color.b );

	setSlider( "directionalLight2", "x", shared.worlds.prairie.directionalLight2.position.x );
	setSlider( "directionalLight2", "y", shared.worlds.prairie.directionalLight2.position.y );
	setSlider( "directionalLight2", "z", shared.worlds.prairie.directionalLight2.position.z );
	
	shared.signals.loadItemCompleted.add( doStart )
	
}


function doStart() {

	shared.signals.loadItemCompleted.remove( doStart );
	start( 16 );
		
}


function start( pattern ) {

	container = document.getElementById( 'experience' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );

	stats = new Stats();
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
//	document.body.appendChild( stats.domElement );

	//if( audio ) {
		
		audio.play();
		audio.volume = 0//.2;	
		
	//}



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
