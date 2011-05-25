var ExplorationSection = function ( shared ) {

	Section.call( this );

	// init dom

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var exitButton, resumeButton;

	var svgCss = [
	'#rome-explore-hex-audio:hover polygon,',
		'	#rome-explore-hex-poly-top:hover polygon,',
		'	#rome-explore-hex-poly-bottom:hover polygon {',
		'		opacity: 1.0;',
		'	}',
		'#rome-explore-hex-poly-middle,',
		'#rome-explore-hex-audio,',
		'	#rome-explore-hex-poly-top,',
		'	#rome-explore-hex-poly-bottom {',
		'		cursor: pointer;',
'	}'].join("\n");

	var rule = document.createTextNode( svgCss );
	var head = document.getElementsByTagName( 'head' )[ 0 ];
	var style = document.createElement('style');

	if ( style.stylesheet ) {

		style.styleSheet.cssText = rule.nodeValue;

	} else {

		style.appendChild( rule );

	}

	head.appendChild( style );

	var svgHex = [
		'<g id = "svgHex-container">',
		'<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="-184px" y="-159px" width="368px" height="318px" viewBox="0 0.972 368 318" overflow="visible" enable-background="new 0 0.972 368 318" xml:space="preserve">',
		'	<polygon opacity="0.5" points="298.816,133.629 353.291,133.629 276.7,0.972 249.464,48.149 "/>',
		'	<polygon opacity="0.5" points="119.064,47.554 91.827,0.377 14.897,133.629 69.37,133.629 "/>',
		'	<g id="rome-explore-hex-poly-top" onClick="ExplorationSection.handleHexClick(1)">',
		'		<polygon opacity="0.5" points="120.01,47.177 248.861,47.177 276.098,0 92.773,0 92.825,0.089 "/>',
		'		<text x="168" y="28" font-size="14" font-family="Futura, sans-serif" fill="#fff" letter-spacing="1">EXIT</text>',
		'	</g>',
		'	<polygon opacity="0.5" points="353.868,134.629 299.394,134.629 313.714,159.433 298.996,184.925 353.471,184.925 368.188,159.433 "/>',
		'	<polygon opacity="0.5" points="298.419,185.925 249.267,271.062 276.503,318.239 352.894,185.925 "/>',
		'	<g id="rome-explore-hex-poly-bottom" onClick="ExplorationSection.handleHexClick(0)">',
		'		<polygon opacity="0.5" points="120.405,271.692 93.168,318.869 275.702,318.869 248.466,271.692 "/>',
		'		<text x="156" y="300" font-size="14" font-family="Futura, sans-serif" fill="#fff" letter-spacing="1">RESUME</text>',
		'	</g>',
		'	<polygon opacity="0.5" points="69.767,185.925 15.294,185.925 92.024,318.833 119.262,271.656 "/>',
		'	<polygon opacity="0.5" points="54.473,159.433 68.793,134.629 14.728,134.629 14.728,133.922 0,159.433 14.728,184.944 14.728,184.925 69.19,184.925 "/>',
		'	<g id="rome-explore-hex-poly-middle" onClick="ExplorationSection.handleHexClick(3)">',
		'		<polygon opacity="0.5" fill="#F6F4EC" points="119.282,271.692 54.473,159.433 119.282,47.177 248.902,47.177 313.714,159.433 248.902,271.692 "/>',
		'	</g>',
		'</svg>',
		'</g>'
	].join('\n');

	var svgHexAudio = [
		'<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="184px" height="47px" viewBox="0 0 184 47" overflow="visible" enable-background="new 0 0 184 47" xml:space="preserve">',
		'	<g id = "rome-explore-hex-audio" onClick="ExplorationSection.handleHexClick(2)">',
		'		<polygon opacity="0.5" points="0,0 27.237,47.176 156.857,47.176 184.095,0 "/>',
		'		<path id="rome-explore-hex-audio-play" display="none" fill="#FFFFFF" d="M118.749,14.089c-5.246,0-9.499,4.253-9.499,9.499s4.253,9.499,9.499,9.499s9.499-4.253,9.499-9.499 S123.995,14.089,118.749,14.089z M116.27,27.811v-7.75l6.875,3.527L116.27,27.811z"/>',
		'		<path id="rome-explore-hex-audio-pause" fill="#FFFFFF" d="M118.75,14.089c-5.246,0-9.5,4.253-9.5,9.499s4.254,9.499,9.5,9.499s9.498-4.253,9.498-9.499 S123.996,14.089,118.75,14.089z M118.031,27.463h-2v-7.75h2V27.463z M121.469,27.463h-2v-7.75h2V27.463z"/>',
		'		<text x="50" y="28" font-size="12" font-family="Futura, sans-serif" fill="#fff" letter-spacing="1">AUDIO</text>',
		'	</g>',
		'</svg>'
	].join('\n');

	var pauseMenu = document.createElement( 'div' );
	var audioMenu = document.createElement( 'div' );

	// renderer and post effects

	var progress = 0, start = 0, lastTime = 0;
	var renderer = shared.renderer;
	var renderTarget = shared.renderTarget;
	var world, scene, soup, portals;
	var postEffect, clearEffect, paintEffect, paintEffectPrairie, paintEffectDunes, fadeOutEffect;
	var fadeInTime = 0;
	var lastWorldId = "";
	var paused = false;
	var scale;

	var normalExploration = true;
	var playedOnce = false;

	var environmentSound, songSound;

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

	var ENV_SOUND_ENABLED = true;

	if ( ENV_SOUND_ENABLED ) {

		environmentSound = document.createElement( "audio" );
		environmentSound.volume = 0;
		environmentSound.loop = true;
		environmentSound.src = "/files/nature.mp3";
		environmentSound.autoplay = false;

		document.body.appendChild( environmentSound );

		songSound = document.createElement( "audio" );
		songSound.volume = 0;
		songSound.loop = false;
		songSound.src = "/files/Black.ogg";
		songSound.autoplay = false;

		document.body.appendChild( songSound );

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

	function startExplore( worldId, useSong ) {

		// UI

		audioMenu.style.position = "absolute";
		audioMenu.style.zIndex = 1000;
		audioMenu.innerHTML = svgHexAudio;
		audioMenu.style.display = "none";
		domElement.appendChild( audioMenu );

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

			if ( useSong || !playedOnce ) {

				if ( songSound.volume == 0 ) {

					if ( useSong ) {

						songSound.currentTime = shared.currentTime;

					} else {

						songSound.currentTime = 0;
						playedOnce = true;

					}

					songSound.play();
					songSound.volume = 1;

					normalExploration = !useSong;

				} else {

					environmentSound.play();
					environmentSound.volume = 1;

				}

			} else {

				environmentSound.play();
				environmentSound.volume = 1;

			}

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

	function stop( e ) {

		if( e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 27 ) {

			toggleDisplay();

		}

	};

	function toggleDisplay() {

		paused = !paused;

	 	if( paused ) {

			pauseMenu.style.display = "block";
			audioMenu.style.display = "block";

	 	} else {

			pauseMenu.style.display = "none";
			audioMenu.style.display = "none";

	 	}

	};

	//--- update viewport size ---

	function updateViewportSize() {

		scale = window.innerWidth / shared.baseWidth;

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

			// TODO: Make sure to that routing is correct for this

			shared.hasExplored = true;

		}

		domElement.style.display = 'block';
		domElement.appendChild( renderer.domElement );
		shared.signals.keyup.add( stop );

		pauseMenu.style.display = "none";
		pauseMenu.style.top = (window.innerHeight / 2.0 - 184) + "px";
		pauseMenu.style.left = (window.innerWidth / 2.0 - 159) + "px";
		audioMenu.style.display = "none";
		audioMenu.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';
		audioMenu.style.left = (window.innerWidth / 2.0 - 66) + "px";

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
		audioMenu.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';
		audioMenu.style.left = (window.innerWidth / 2.0 - 66) + "px";

		// TODO: scale the svg to the viewport ratio
		// var svgTransform = document.getElementById( 'svgHex-container' );
		// if( svgTransform ) {
		// 	svgTransform.setAttribute("transform", "scale("+scale+", "+scale+")");
		// }

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

				} else {

					for( var i = 0; i < portals.length; i++ ) {

						if( portals[ i ].currentDistance < portals[ i ].radius * 1.25 ) {

							fadeOutEffect.update( 1.0 - ( portals[ i ].currentDistance - portals[ i ].radius ) / ( portals[ i ].radius * 0.25 ) );

						}

					}

				}


				postEffect.update( progress, delta, time );

			}


			if ( songSound.volume > 0 && songSound.currentTime > 209 ) {

				songSound.pause();
				songSound.volume = 0;

				if ( ! normalExploration ) {

					shared.signals.showrelauncher.dispatch();

					return;

				}

			}

		}

	};

	ExplorationSection.handleHexClick = function( args ) {

		switch( args ) {

			case 0:

				toggleDisplay();
				break;

			case 1:

				if ( songSound.volume > 0 ) {

					songSound.pause();
					songSound.volume = 0;

				}

				shared.signals.showrelauncher.dispatch();
				break;

			case 2:

				if ( ENV_SOUND_ENABLED ) {

					if ( songSound.volume > 0 ) {

						songSound.pause();

					}

					if ( environmentSound.volume > 0 ) {

						environmentSound.pause();

					}


					document.getElementById( 'rome-explore-hex-audio-pause' ).setAttribute( "display", "none" );
					document.getElementById( 'rome-explore-hex-audio-play' ).setAttribute( "display", "svg-path" );
					ENV_SOUND_ENABLED = false;

				} else {

					if ( songSound.volume > 0 && songSound.currentTime < 208 ) {

						songSound.play();

					}

					if ( environmentSound.volume > 0 ) {

						environmentSound.play();

					}

					document.getElementById( 'rome-explore-hex-audio-play' ).setAttribute( "display", "none" );
					document.getElementById( 'rome-explore-hex-audio-pause' ).setAttribute( "display", "svg-path" );
					ENV_SOUND_ENABLED = true;

				}
				break;

			case 3:

				var d = renderer.domElement;
				window.open( d.toDataURL("image/png"), "Make ro.me your wallpaper!" );
				break;

			default:

				toggleDisplay();

		}

	};

};

ExplorationSection.prototype = new Section();
ExplorationSection.prototype.constructor = ExplorationSection;
