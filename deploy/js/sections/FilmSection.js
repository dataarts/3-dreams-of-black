var FilmSection = function ( shared ) {

	Section.call( this );

	var domElement, audio, tune, playing = false,
	sequencer, renderer, renderTarget;

	// init

	domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	// audio

	audio = document.createElement( 'audio' );
	audio.preload = 'auto';
	domElement.appendChild( audio );

	source = document.createElement( 'source' );
	source.src = "/files/Black.ogg";
	audio.appendChild( source );

	tune = new Tune( audio );
	tune.setBPM( 85 );
	tune.setRows( 4 );

	// renderer

	shared.baseWidth = 1024;
	shared.baseHeight = 436;
	shared.viewportWidth = shared.baseWidth * ( window.innerWidth / shared.baseWidth );
	shared.viewportHeight = shared.baseHeight * ( window.innerWidth / shared.baseWidth );

	renderer = new THREE.WebGLRenderer( { stencil: false } );
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( shared.viewportWidth, shared.baseHeight );
	renderer.sortObjects = false;
	renderer.autoClear = false;

	renderTarget = new THREE.WebGLRenderTarget( shared.viewportWidth, shared.baseHeight, { stencilBuffer: false } );
	renderTarget.minFilter = THREE.LinearFilter;
	renderTarget.magFilter = THREE.LinearFilter;

	shared.renderer = renderer;
	shared.renderTarget = renderTarget;

	// signals

	shared.signals.startfilm.add( start );
	shared.signals.stopfilm.add( stop );

	// Sequence

	var s01_01 = new VideoPlayer( shared, VideoShots.s01_01 );
	var s01_03 = new VideoPlayer( shared, VideoShots.s01_03 );
	var s01_06 = new VideoPlayer( shared, VideoShots.s01_06 );
	var s01_09 = new VideoPlayer( shared, VideoShots.s01_09 );
	
	var s02_01 = new VideoPlayer( shared, VideoShots.s02_01 );
	var s02_02 = new VideoPlayer( shared, VideoShots.s02_02 );
	var s02_03 = new VideoPlayer( shared, VideoShots.s02_03 );
	var s02_04 = new VideoPlayer( shared, VideoShots.s02_04 );
	var s02_06 = new VideoPlayer( shared, VideoShots.s02_06 );
	
	var s03_01 = new VideoPlayer( shared, VideoShots.s03_01 );
	var s03_02 = new VideoPlayer( shared, VideoShots.s03_02 );
	var s03_03 = new VideoPlayer( shared, VideoShots.s03_03 );
	
	var cityTransitionTime = 2000;
	var prairieTransitionTime = 3000;
	var dunesTransitionTime = 11000;
	
	sequencer = new Sequencer();

	sequencer.add( new ClearEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 73.25 ), 0 );
	
	// intro
	
	sequencer.add( new VideoPlayer( shared, VideoShots.introLayers ), tune.getPatternMS( 0 ), tune.getPatternMS( 7.9 ), 1 );

	// city animation

	var s01start = tune.getPatternMS( 7.9 );
	var s01end = tune.getPatternMS( 16 );
	
	sequencer.add( s01_01, s01start, s01start + s01_01.duration, 1 );
	s01start += s01_01.duration;
	
	sequencer.add( s01_03, s01start, s01start + s01_03.duration, 1 );
	s01start += s01_03.duration;
	
	sequencer.add( s01_06, s01start, s01start + s01_06.duration, 1 );
	s01start += s01_06.duration;
	
	sequencer.add( s01_09, s01start, s01end, 4 ); // must be rendered after city
	
	// city 3d
	
	var cityStart = tune.getPatternMS( 16 ) - cityTransitionTime; // 1 sec is enough for this transition
	
	sequencer.add( new City( shared ),        cityStart, tune.getPatternMS( 23.9 ), 1 );
	sequencer.add( new PaintEffect( shared ), cityStart, tune.getPatternMS( 23.9 ), 5 );

	// prairie animation

	var s02start = tune.getPatternMS( 23.9 );
	var s02end = tune.getPatternMS( 32 );
	
	sequencer.add( s02_01, s02start, s02start + s02_01.duration, 1 );
	s02start += s02_01.duration;
	
	sequencer.add( s02_02, s02start, s02start + s02_02.duration, 1 );
	s02start += s02_02.duration;
	
	sequencer.add( s02_03, s02start, s02start + s02_03.duration, 1 );
	s02start += s02_03.duration;
	
	sequencer.add( s02_04, s02start, s02start + s02_04.duration, 1 );
	s02start += s02_04.duration;
	
	sequencer.add( s02_06, s02start, s02start + s02_06.duration, 4 );
	
	// prairie 3d

	var prairieStart = tune.getPatternMS( 32 ) - prairieTransitionTime; // <- s02_06.duration
	
	sequencer.add( new Prairie( shared ),            prairieStart, tune.getPatternMS( 40 ), 1 );
	sequencer.add( new PaintEffectPrairie( shared ), prairieStart, tune.getPatternMS( 40 ), 5 );
	
	// dunes animation

	var s03start = tune.getPatternMS( 40 );
	var s03end = tune.getPatternMS( 48 );

	sequencer.add( s03_01, s03start, s03start + s03_01.duration, 1 );
	s03start += s03_01.duration;
	
	sequencer.add( s03_02, s03start, s03start + s03_02.duration, 1 );
	s03start += s03_02.duration;
	
	sequencer.add( s03_03, s03start, s03start + s03_03.duration, 4 );
	s03start += s03_03.duration;
	
	// dunes 3d
	
	var dunesStart = tune.getPatternMS( 48 ) - dunesTransitionTime;// <- s03_03.duration;

	sequencer.add( new Dunes( shared ), 		   dunesStart, tune.getPatternMS( 73.25 ), 1 );
	sequencer.add( new PaintEffectDunes( shared ), dunesStart, tune.getPatternMS( 73.25 ), 5 );

	// fades

	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 23.5 ), tune.getPatternMS( 24 ), 3 );  // Below painter effect which renders directly to screen
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 39.5 ), tune.getPatternMS( 40 ), 3 );  // Below painter effect which renders directly to screen
	sequencer.add( new FadeOutEffect( 0x000000, shared ), tune.getPatternMS( 72.2 ), tune.getPatternMS( 73.25 ), 3 ); // Below painter effect which renders directly to screen

	// pointers
	// sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ) - 1000, 1000 );
	sequencer.add( new PointerEffect( shared, true ),  tune.getPatternMS( 8 ), tune.getPatternMS( 73.25 ), 1000 );

	/*
	sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ) - cityTransitionTime, 1000 ); // city animation
	sequencer.add( new PointerEffect( shared, false ), tune.getPatternMS( 16 ) - cityTransitionTime, tune.getPatternMS( 24 ), 1000 ); // city
	
	sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ) - prairieTransitionTime, 1000 ); // prairie animation
	sequencer.add( new PointerEffect( shared, false ), tune.getPatternMS( 32 ) - prairieTransitionTime, tune.getPatternMS( 40 ), 1000 ); // prairie
	
	sequencer.add( new PointerEffect( shared, true ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ) - dunesTransitionTime, 1000 ); // dunes animation
	sequencer.add( new PointerEffect( shared, false ), tune.getPatternMS( 48 ) - dunesTransitionTime, tune.getPatternMS( 73.25 ), 1000 ); // dunes
	*/

	// final render

	//sequencer.add( new SharpenEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 6 ); 		// intro
	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 0 ), tune.getPatternMS( 8 ), 6 ); 		// intro
	
	//sequencer.add( new NoiseEffect( shared, 0.35, 0.0, 1024 ), 	tune.getPatternMS( 8 ), tune.getPatternMS( 16 ) - cityTransitionTime, 5 ); // city animation
	sequencer.add( new PaintEffect( shared ), tune.getPatternMS( 8 ), tune.getPatternMS( 16 ) - cityTransitionTime, 6 ); // city animation

	// PaintEffectVideo

	//sequencer.add( new SharpenEffect( shared ), 	tune.getPatternMS( 24 ), tune.getPatternMS( 32 ) - prairieTransitionTime, 5 ); // prairie animation
	//sequencer.add( new NoiseEffect( shared, 0.35, 0.0, 1024 ), 	tune.getPatternMS( 24 ), tune.getPatternMS( 32 ) - prairieTransitionTime, 5 ); // prairie animation
	sequencer.add( new PaintEffectPrairie( shared ), tune.getPatternMS( 24 ), tune.getPatternMS( 32 ) - prairieTransitionTime, 6 ); // prairie animation

	//sequencer.add( new PaintEffectDunes( shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ) - dunesTransitionTime, 6 ); // dunes animation
	sequencer.add( new RenderEffect( shared ), tune.getPatternMS( 40 ), tune.getPatternMS( 48 ) - dunesTransitionTime, 6 ); // dunes animation

	//

	function start( pattern, volume ) {

		domElement.appendChild( renderer.domElement );

		playing = true;

		try {

			audio.currentTime = tune.getPatternMS( pattern ) / 1000;

		} catch ( error ) {

			console.error( error );

		}

		audio.play();
		audio.volume = volume;
		
		shared.isExperience = true;

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

				try {

					audio.currentTime --;

				} catch ( error ) {

					console.error( error );

				}

				sequencer.clear();
				break;

			case 39:

				try {

					audio.currentTime ++;

				} catch ( error ) {

					console.error( error );

				}

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

		if ( audio.currentTime > 209 ) {

			shared.signals.showrelauncher.dispatch();
			stop();

			return;

		}

		sequencer.update( audio.currentTime * 1000 );
		
		shared.currentTime = audio.currentTime;

	};

};

FilmSection.prototype = new Section();
FilmSection.prototype.constructor = FilmSection;
