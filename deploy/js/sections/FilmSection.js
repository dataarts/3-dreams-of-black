var FilmSection = function ( shared ) {

	Section.call( this );

	var domElement, audio, tune, playing = false,
	sequencer, renderer, renderTarget;

	// init

	domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	// audio

	audio = document.createElement( 'audio' );
	audio.preload = true;
	domElement.appendChild( audio );

	source = document.createElement( 'source' );
	source.src = "files/Black.ogg";
	audio.appendChild( source );

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	// renderer

	shared.baseWidth = 1024;
	shared.baseHeight = 436;
	shared.viewportWidth = shared.baseWidth * ( window.innerWidth / shared.baseWidth );
	shared.viewportHeight = shared.baseHeight * ( window.innerWidth / shared.baseWidth );

	renderer = new THREE.WebGLRenderer();
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( shared.viewportWidth, shared.baseHeight );
	renderer.sortObjects = false;
	renderer.autoClear = false;

	renderTarget = new THREE.WebGLRenderTarget( shared.viewportWidth, shared.baseHeight );
	renderTarget.minFilter = THREE.LinearFilter;
	renderTarget.magFilter = THREE.LinearFilter;

	shared.renderer = renderer;
	shared.renderTarget = renderTarget;

	// signals

	shared.signals.startfilm.add( start );
	shared.signals.stopfilm.add( stop );

	// effects

	// var overlayTexture = THREE.ImageUtils.loadTexture( "files/textures/VignetteWithDirt_alpha.png" );
	var overlayTexture = THREE.ImageUtils.loadTexture( "files/textures/fingerprints.png" );

	// Sequence
	var conf = { paralaxHorizontal: 40, paralaxVertical: 10 };
	
    var introLayers = [{
        path: "files/videos/intro.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000
    }];
	
    var cityLayers = [{
        path: "files/videos/transition_city.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000
    }];
	
    var prairieLayers = [{
        path: "files/videos/transition_prairie.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000
    }];
	
    var dunesLayers = [{
        path: "files/videos/transition_dunes.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000
    }];
	
	var intro = new VideoPlayer( shared, introLayers, conf);
	var cityAnimation = new VideoPlayer(shared, cityLayers, conf);
	var prairieAnimation = new VideoPlayer(shared, prairieLayers, conf);
	var dunesAnimation = new VideoPlayer(shared, dunesLayers, conf);

	sequencer = new Sequencer();

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 0 );
	
	sequencer.add( intro, tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( intro2, tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( intro3, tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( intro3, tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( prairieParalax, tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( new PaintEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 4 );

	sequencer.add( cityAnimation, tune.getPatternMS( 8 ), tune.getPatternMS( 16 ), 1 );

	sequencer.add( new City( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 1 );
	sequencer.add( new PaintEffect( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );
	//sequencer.add( new PaintEffectDunes( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );

	//sequencer.add( new NoiseEffect( shared, 0.16, 0.0, 4096 ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );
	//sequencer.add( new PaintDarkEffect( shared ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );
	//sequencer.add( new OverlayEffect( shared, overlayTexture ), tune.getPatternMS( 16 ), tune.getPatternMS( 24 ), 4 );

	//sequencer.add( prairieAnimation, tune.getPatternMS( 24 ), tune.getPatternMS( 32 ), 1 );

	sequencer.add( new Prairie( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 1 );
	sequencer.add( new PaintEffectPrairie( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 5 );
	//sequencer.add( new PaintEffectDunes( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 5 );

	//sequencer.add( new NoiseEffect( shared, 0.18, 0.0, 4096 ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 32 ), tune.getPatternMS( 40 ), 4 );

	//sequencer.add( dunesAnimation, tune.getPatternMS( 40 ), tune.getPatternMS( 48 ), 1 );

	sequencer.add( new Dunes( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 1 );
	sequencer.add( new PaintEffectDunes( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 4 );
	
	//sequencer.add( new NoiseEffect( shared, 0.094, 0.0, 4096 ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 3 );
	//sequencer.add( new HeatEffect( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 4 );
	//sequencer.add( new PaintEffect( shared ), tune.getPatternMS( 48 ), tune.getPatternMS( 73.25 ), 4 );

	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 23.5 ), tune.getPatternMS( 24 ), 3 );  // Below painter effect which renders directly to screen
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 39.5 ), tune.getPatternMS( 40 ), 3 );  // Below painter effect which renders directly to screen

	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 72 ), tune.getPatternMS( 73.25 ), 5 );

	//sequencer.add( new PointerEffect( shared, false ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 1 );
	//sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 8 ), tune.getPatternMS( 73.25 ), 1 );

	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 16 ), 6 );
	
	// !!!!!!!!! Here PaintEffect draws directly to frame buffer !!!!!!!!!!!!
	
	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ), 6 );
	
	// !!!!!!!!! Here PaintEffectPrairie draws directly to frame buffer !!!!!!!!!!!!
	
	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ), 6 );
	
	// !!!!!!!!! Here PaintEffectDunes draws directly to frame buffer !!!!!!!!!!!!

	//

	function start( pattern, volume ) {

		//console.log( renderer.domElement );

		domElement.appendChild( renderer.domElement );

		playing = true;

		audio.currentTime = tune.getPatternMS( pattern ) / 1000;
		audio.play();
		audio.volume = volume;

	};

	function stop() {

		playing = false;

		audio.pause();

	};

	function onDocumentKeyDown( event ) {

		switch ( event.keyCode ) {

			/* space */
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

			/* m */
			case 77:

				audio.volume = audio.volume ? 0 : 1;
				break;

		}

	};

	this.getDomElement = function () {

		return domElement;

	};

	this.show = function () {

		domElement.style.display = 'block';

		shared.signals.keydown.add( onDocumentKeyDown );

	};

	this.hide = function () {

		domElement.style.display = 'none';

		shared.signals.keydown.remove( onDocumentKeyDown );

		stop();

	};

	this.resize = function ( width, height ) {

		shared.viewportWidth = shared.baseWidth * ( width / shared.baseWidth );
		shared.viewportHeight = shared.baseHeight * ( width / shared.baseWidth );

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		// TODO: Hacky...

		renderTarget.width = shared.viewportWidth;
		renderTarget.height = shared.viewportHeight;
		delete renderTarget.__webglFramebuffer;

		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = ( ( height - shared.viewportHeight  ) / 2 ) + 'px';

	};

	this.update = function () {

		if ( ! playing ) return;

		if ( audio.currentTime == audio.duration ) {

			shared.signals.showrelauncher.dispatch();
			stop();

			return;

		}

		sequencer.update( audio.currentTime * 1000 );

	};

};

FilmSection.prototype = new Section();
FilmSection.prototype.constructor = FilmSection;
