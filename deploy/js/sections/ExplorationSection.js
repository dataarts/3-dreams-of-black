var ExplorationSection = function ( shared ) {

	Section.call( this );

	// init dom

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var exitButton, resumeButton;

	var svgCss = ['	#rome-explore-hex-poly-top:hover polygon,',
		'	#rome-explore-hex-poly-bottom:hover polygon {',
		'		opacity: 1.0;',
		'	}',
		'	#rome-explore-hex-poly-top,',
		'	#rome-explore-hex-poly-bottom {',
		'		cursor: pointer;',
'	}'].join("\n");

	var rule = document.createTextNode(svgCss);
  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  if (style.stylesheet) {

      style.styleSheet.cssText = rule.nodeValue;

  } else {

      style.appendChild(rule);

  }

  head.appendChild(style);

	var svgHex = [
		'<svg id="rome-explore-hex" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="368px" height="318px" viewBox="0 0.972 368 318" overflow="visible" enable-background="new 0 0.972 368 318" xml:space="preserve">',
		'	<polygon opacity="0.5" points="15.294,185.925 92.024,318.833 168.757,185.925 "/>',
		'	<polygon opacity="0.5" points="200.114,185.925 276.503,318.239 352.894,185.925 "/>',
		'	<g id="rome-explore-hex-poly-bottom" onClick="ExplorationSection.handleHexClick(0)">',
		'		<polygon opacity="0.5" points="198.95,185.925 169.921,185.925 93.168,318.869 275.702,318.869 "/>',
		'		<text x="156" y="300" font-size="14" font-family="Futura-Std-Bold, Futura, sans-serif" fill="#fff">RESUME</text>',
		'	</g>',
		'	<polygon opacity="0.5" points="353.868,134.629 199.535,134.629 185.017,159.776 199.536,184.925 353.471,184.925 368.188,159.433 "/>',
		'	<polygon opacity="0.5" points="14.728,184.925 169.334,184.925 183.854,159.776 169.335,134.629 14.728,134.629 14.728,133.922 0,159.433 14.728,184.944 "/>',
		'	<polygon opacity="0.5" points="168.758,133.629 91.827,0.377 14.897,133.629 "/>',
		'	<g id="rome-explore-hex-poly-top" onClick="ExplorationSection.handleHexClick(1)">',
		'		<polygon opacity="0.5" points="276.098,0 92.773,0 92.825,0.089 169.922,133.629 198.949,133.629 "/>',
		'		<text x="168" y="28" font-size="14" font-family="Futura-Std-Bold, Futura, sans-serif" fill="#fff">EXIT</text>',
		'	</g>',
		'	<polygon opacity="0.5" points="353.291,133.629 276.7,0.972 200.113,133.629 "/>',
		'	<polygon fill="#F6F4EC" points="119.282,271.692 54.473,159.433 119.282,47.177 248.902,47.177 313.714,159.433 248.902,271.692 "/>',
		'</svg>'
	].join('\n');

	var pauseMenu = document.createElement( 'div' );

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
	
	var ENV_SOUND_ENABLED = false;

	if ( ENV_SOUND_ENABLED ) {

		var environmentSound = document.createElement( "audio" );
		environmentSound.volume = 0;
		environmentSound.loop = true;
		environmentSound.src = "files/nature.mp3";
		environmentSound.autoplay = false;

		document.body.appendChild( environmentSound );
		
	}
	

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

		// UI
		pauseMenu.style.position = "absolute";
		pauseMenu.style.zIndex = 1000;
		pauseMenu.innerHTML = svgHex;
		pauseMenu.style.display = "none";
		domElement.appendChild( pauseMenu );

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
		
		if ( ENV_SOUND_ENABLED ) {
		
			environmentSound.play();
			environmentSound.volume = 0;
			
		}
		
		
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
		start = lastTime = new Date().getTime();

	};


	//--- stop ---

	function stop(e) {

		if(e.keyCode == 13) {

			toggleDisplay();
		 
		}

	};

	function toggleDisplay() {
		paused = !paused;
	
	 	if( paused ) {

			pauseMenu.style.display = "block";

	 	} else {
	 		
			pauseMenu.style.display = "none";
	 		
	 	}
	}

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

		if( !shared.hasExplored ) {

			shared.hasExplored = true;

		}

		domElement.style.display = 'block';
		domElement.appendChild( renderer.domElement );
		shared.signals.keyup.add( stop );

		pauseMenu.style.display = "none";
		pauseMenu.style.top = (window.innerHeight / 2.0 - 184) + "px";
		pauseMenu.style.left = (window.innerWidth / 2.0 - 159) + "px";

		paused = false;
	};

	this.hide = function () {

		domElement.style.display = 'none';
		shared.signals.keyup.remove( stop );
		
		if ( ENV_SOUND_ENABLED ) {
		
			environmentSound.pause();
			
		}
	};

	this.resize = function ( width, height ) {

		// console.log( "Exploration Resize" );
		pauseMenu.style.top = (window.innerHeight / 2.0 - 184) + "px";
		pauseMenu.style.left = (window.innerWidth / 2.0 - 159) + "px";

	};

	this.update = function () {

		// update time

		time = new Date().getTime() - start;
		delta = time - lastTime;
		lastTime = time;

		delta = Math.min( 1000, Math.max( 0, delta ));

		
		
		// update world
		if( !paused ) {

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
					
					if ( ENV_SOUND_ENABLED ) {
					
						environmentSound.volume = Math.max( 0, Math.min( 1, fadeInTime / 1000 ) );
						
					}

				} else {

					if ( ENV_SOUND_ENABLED ) {

						for( var i = 0; i < portals.length; i++ ) {

							if( portals[ i ].currentDistance < portals[ i ].radius * 1.5 ) {

								environmentSound.volume = fadeOutEffect.update( 1.0 - ( portals[ i ].currentDistance - portals[ i ].radius ) / ( portals[ i ].radius * 0.5 ) );

							}

						}

					}

				}


				postEffect.update( progress, delta, time );

			}

		}

	};

	ExplorationSection.handleHexClick = function(args) {

		switch(args) {
			case 0:
				toggleDisplay();
				break;
			case 1:
				shared.signals.showrelauncher.dispatch();
				break;
			case 2:
				if ( ENV_SOUND_ENABLED ) {

					environmentSound.pause();
					ENV_SOUND_ENABLED = false;

				} else {

					environmentSound.play();
					ENV_SOUND_ENABLED = true;

				}
				break;
			default:
				toggleDisplay();
		}

	};

};

ExplorationSection.prototype = new Section();
ExplorationSection.prototype.constructor = ExplorationSection;
