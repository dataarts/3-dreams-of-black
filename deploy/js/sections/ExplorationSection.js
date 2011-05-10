var ExplorationSection = function ( shared ) {

	Section.call( this );

	// init dom

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	// renderer and post effects

	var progress = 0, start = 0, lastTime = 0;
	var renderer = shared.renderer;
	var renderTarget = shared.renderTarget;
	var world, scene, soup, portals;
	var postEffect, clearEffect, paintEffect, paintEffectPrairie, paintEffectDunes, fadeOutEffect;
	var fadeInTime = 0;
	var lastWorldId = "";
	var paused = false;

	clearEffect = new ClearEffect( shared );
	clearEffect.init();

	fadeOutEffect = new FadeOutEffect( 0x000000, shared );
	fadeOutEffect.init();

	paintEffect = new PaintEffect( shared );
	paintEffect.init();

	paintEffectPrairie = new PaintEffectPrairie( shared );
	paintEffectPrairie.init();
	
	paintEffectDunes = new PaintEffectDunes( shared );
	paintEffectDunes.init();


	// audio
	
	var environmentSound = document.createElement( "audio" );
	environmentSound.volume = 0;
	environmentSound.loop = true;
	environmentSound.src = "files/nature.mp3";
	environmentSound.autoplay = false;

	document.body.appendChild( environmentSound );
	

	// init cameras

	var camera, cameras = {};

	cameras.dunes   = new DunesCameraFreeExplore( shared );
	cameras.prairie = new PrairieCameraFreeExplore( shared );
	cameras.city    = new CityCameraFreeExplore( shared );


	// signals

	shared.signals.startexploration.add( startExplore );
	shared.signals.windowresized.add( updateViewportSize );


	//--- start explore ---

	function startExplore( worldId ) {

		world   = shared.worlds[ worldId ];
		portals = world.portals;
		camera  = cameras[ worldId ];
		
		if( worldId === "dunes" && lastWorldId !== "" && lastWorldId !== "dunes" && portals ) {
			
			// find closest portal
			
			var closestDistance = 99999999999;
			var closestPortal;
			
			for( var p = 0; p < portals.length; p++ ) {
				
				if( portals[ p ].currentDistance < closestDistance ) {
					
					closestDistance = portals[ p ].currentDistance;
					closestPortal = portals[ p ];
				}
				
			}
			
			// switch camera direction
			
			camera.switchDirection( closestPortal );
			
		} else {
			
			camera.resetCamera();
			
		}
		
		lastWorldId = worldId;
		
		scene = world.scene;
		soup  = shared.soups[ worldId ];
		fadeInTime = 0;
		
		
		
		if( worldId == "city" ) {
			
			postEffect = paintEffect;
		
		} else if ( worldId == "prairie" ) {

			postEffect = paintEffectPrairie;
			
		} else {

			postEffect = paintEffectDunes;
			
			// set lights
			
			world.skyWhite = 1;
			world.ambient.color.setHSV( 0, 0, 0.1 );
			world.directionalLight1.color.setHSV( 0.08823529411764706, 0, 1 );
			world.directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 );
			world.lensFlare.position.y = 3500;
			
		}

		updateViewportSize();
		
		environmentSound.play();
		environmentSound.volume = 0;
		
		start = lastTime = new Date().getTime();

	};


	//--- stop ---

	function stop(e) {

		// Depracated for research on
		// History API in HTML5 spec.
		// Return + Enter
		// if(e.keyCode == 13) {
		// 
		// 	paused = !paused;
		// 	if(pause) {
		// 
		// 		// Show UI
		// 		
		// 
		// 	}
		// 
		// }


	};


	//--- update viewport size ---

	function updateViewportSize() {

		var scale = window.innerWidth / shared.baseWidth;

		shared.viewportWidth = shared.baseWidth * scale;
		shared.viewportHeight = shared.baseHeight * scale

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		renderTarget.width = shared.viewportWidth;
		renderTarget.height = shared.viewportHeight;
		delete renderTarget.__webglFramebuffer;

		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';

	};

	this.getDomElement = function () {

		return domElement;

	};

	this.show = function () {

		domElement.style.display = 'block';
		domElement.appendChild( renderer.domElement );
		shared.signals.keyup.add( stop );

	};

	this.hide = function () {

		domElement.style.display = 'z';
		shared.signals.keyup.remove( stop );
		environmentSound.pause();

	};

	this.resize = function ( width, height ) {

		// console.log( "Exploration Resize" );

	};

	this.update = function () {

		// update time

		time = new Date().getTime() - start;
		delta = time - lastTime;
		lastTime = time;

		delta = Math.min( 1000, Math.max( 0, delta ));

		
		
		// update world

		if(!paused) {

			if( world && world.scene ) {

				if( soup ) soup.update( delta, camera.camera );
				THREE.AnimationHandler.update( delta );

				camera.updateCamera( progress, delta, time );
				world.update( delta, camera.camera, true );


				clearEffect.update( progress, delta, time );

				renderer.setClearColor( world.scene.fog ? world.scene.fog.color : 0xffffff );
				renderer.render( world.scene, camera.camera, renderTarget );

				// fade in/out

				if( fadeInTime < 1000 ) {

					fadeInTime += delta;
					fadeOutEffect.update( 1.0 - fadeInTime / 1000 );
					environmentSound.volume = fadeInTime / 1000;

				} else {

					for( var i = 0; i < portals.length; i++ ) {

						if( portals[ i ].currentDistance < portals[ i ].radius * 1.5 ) {

							environmentSound.volume = fadeOutEffect.update( 1.0 - ( portals[ i ].currentDistance - portals[ i ].radius ) / ( portals[ i ].radius * 0.5 ));

						}

					}

				}


				postEffect.update( progress, delta, time );

			}

		}

	};

};

ExplorationSection.prototype = new Section();
ExplorationSection.prototype.constructor = ExplorationSection;
