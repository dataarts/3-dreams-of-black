var Film = function ( shared ) {

	var WIDTH = 1024, HEIGHT = 436,
	domElement, audio, tune, playing = false,
	sequencer, renderer, renderTarget;

	// init

	domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	audio = document.createElement( 'audio' );
	audio.preload = true;
	domElement.appendChild( audio );

	source = document.createElement( 'source' );
	source.src = "files/Black.ogg";
	audio.appendChild( source );

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( WIDTH, HEIGHT );
	renderer.autoClear = false;
	renderer.sortObjects = false;
	renderer.domElement.style.position = 'absolute';

	renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT );

	// shared adds

	shared.baseWidth = WIDTH;
	shared.baseHeight = HEIGHT;
	shared.viewportWidth = WIDTH;
	shared.viewportHeight = HEIGHT;

	shared.film = { domElement : domElement };

	shared.renderer = renderer;
	shared.renderTarget = renderTarget;

	// signals

	shared.signals.startfilm.add( start );
	shared.signals.stopfilm.add( stop );
	shared.signals.windowresized.add( updateViewportSize );

	// effects

	//var overlayTexture = THREE.ImageUtils.loadTexture( "files/textures/VignetteWithDirt_alpha.png" );
	var overlayTexture = THREE.ImageUtils.loadTexture( 'files/textures/fingerprints.png' );

	// sequence

	sequencer = new Sequencer();

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 0 );

	sequencer.add( new VideoEffect( shared, 'files/videos/intro.webm' ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	sequencer.add( new PointerEffect( shared, false ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );

	sequencer.add( new VideoEffect( shared, 'files/videos/transition_city.webm' ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ), 1 );
	sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ), 1 );

	sequencer.add( new City( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 1 );
	//sequencer.add( new NoiseEffect( shared, 0.16, 0.0, 4096 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );
	//sequencer.add( new OverlayEffect( shared, overlayTexture ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );

	sequencer.add( new VideoEffect( shared, 'files/videos/transition_prairie.webm' ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ), 1 );

	sequencer.add( new Prairie( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 1 );
	//sequencer.add( new NoiseEffect( shared, 0.18, 0.0, 4096 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 4 );

	sequencer.add( new VideoEffect( shared, 'files/videos/transition_dunes.webm' ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ), 1 );

	sequencer.add( new Dunes( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 1 );
	//sequencer.add( new NoiseEffect( shared, 0.094, 0.0, 4096 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 4 );

	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 23.5 ), tune.getPatternMS( 24 ), 5 );
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 39.5 ), tune.getPatternMS( 40 ), 5 );

	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 72 ), tune.getPatternMS( 73.25 ), 5 );

	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 6 );

	//

	function start( pattern ) {

		/*
		if ( renderer.domElement.parentElement ) {

			renderer.domElement.parentElement.removeChild( renderer.domElement );

		}
		*/

		domElement.appendChild( renderer.domElement );

		updateViewportSize();

		playing = true;

		audio.currentTime = tune.getPatternMS( pattern ) / 1000;
		audio.play();

		document.addEventListener( 'keydown', onDocumentKeyDown, false );

	};

	function stop() {

		playing = false;

		audio.pause();

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );

	};

	function onDocumentKeyDown( event ) {

		switch ( event.keyCode ) {

			case 32:

				audio.paused ? audio.play() : audio.pause();
				break;

			case 37:

				audio.currentTime --;
				sequencer.clear();
				break;

			case 39:

				audio.currentTime ++;
				sequencer.clear();
				break;

			case 38:

				audio.playbackRate += 0.1;
				break;

			case 40:

				audio.playbackRate -= 0.1;
				break;

		}

	};

	function updateViewportSize() {

		var scale = window.innerWidth / WIDTH;

		shared.viewportWidth = WIDTH * scale;
		shared.viewportHeight = HEIGHT * scale

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		// TODO: Hacky...

		renderTarget.width = nextPowerOf2( shared.viewportWidth );
		renderTarget.height = nextPowerOf2( shared.viewportHeight );
		delete renderTarget.__webglFramebuffer;

		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';

	};

	function nextPowerOf2( n ) {

		n--;
		n |= n >> 1;
		n |= n >> 2;
		n |= n >> 4;
		n |= n >> 8;
		n |= n >> 16;
		n++;

		return n;

	}

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

		if ( audio.currentTime == audio.duration ) {

			shared.signals.showrelauncher.dispatch();
			stop();

			return;

		}

		playing && sequencer.update( audio.currentTime * 1000 );

	};

};
