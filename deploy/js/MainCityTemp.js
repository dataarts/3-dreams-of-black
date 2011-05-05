var WIDTH = 1024, HEIGHT = 436;

var Signal = signals.Signal;

var audio, sequencer,
camera, camera2, scene, renderer, renderTarget,
container, shared;

var tune, time, stats, gui;

init();

function init() {

	audio = document.getElementById( 'audio' );

	//gui = new GUI();

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.autoClear = false;
	renderer.sortObjects = false;

	renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT );
	renderTarget.minFilter = THREE.LinearFilter;
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

		signals : {

			mousedown : new Signal(),
			mouseup : new Signal(),
			mousemoved : new Signal(),
			mousewheel : new Signal(),

			keydown : new Signal(),
			keyup : new Signal(),

			windowresized : new Signal(),

			load : new Signal(),

			showlauncher : new Signal(),
			showfilm : new Signal(),
			showrelauncher : new Signal(),
			showexploration : new Signal(),
			showugc : new Signal(),

			loadBegin : new Signal(),
			loadItemAdded : new Signal(),
			loadItemCompleted : new Signal(),

			startfilm : new Signal(),
			stopfilm : new Signal(),

			startexploration: new Signal(),
			
			initscenes: new Signal()

		},

		worlds: {},
		soups: {},
		sequences: {},
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

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 0 );
	sequencer.add( new City( shared ), tune.getPatternMS( 0), tune.getPatternMS( 75 ), 1 );
	//sequencer.add( new BloomEffect( shared, 0.7 ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 2 );
	//sequencer.add( new NoiseEffect( shared, 0.15, 0.0, 4096 ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 4 );
	sequencer.add( new PaintEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 4 );
	//sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 75 ), 5 );

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
	//audio.currentTime = tune.getPatternMS( pattern ) / 1000;
	audio.volume = 0//.2;	

	//gui.add( audio, 'volume', 0, 1).name( 'Volume' );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	animate();

	//setInterval(animate, 1000/20);
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
