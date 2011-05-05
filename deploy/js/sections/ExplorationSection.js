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
		scene   = world.scene;
		soup    = shared.soups[ worldId ];
		camera  = cameras[ worldId ];
		camera.resetCamera();
		
		fadeInTime = 0;
		
		if( worldId == "city" ) {
			
			postEffect = paintEffect;
		
		} else if ( worldId == "prairie" ) {

			postEffect = paintEffectPrairie;
			
		} else {

			postEffect = paintEffectDunes;
			
		}

		updateViewportSize();
		
		// hide soup (if it wasn't yet activated)

/*		if ( !shared.started[ worldId ] ) {

			THREE.SceneUtils.traverseHierarchy( world.scene, function( node ) { 

				if ( ! ( node instanceof THREE.Mesh  || node instanceof THREE.Scene ) 
					|| ( node.geometry && node.geometry.morphTargets.length > 0 ) ) {

					var name = node.name.toLowerCase();

					if ( ! ( name && name.indexOf( "portal" ) >= 0 ) ) {

						node.visible = false;

					}

				}

			} );

		}
*/
		start = lastTime = new Date().getTime();

	};


	//--- stop ---

	function stop() {

	};


	//--- update viewport size ---

	function updateViewportSize() {

		var scale = window.innerWidth / shared.baseWidth;

		shared.viewportWidth = shared.baseWidth * scale;
		shared.viewportHeight = shared.baseHeight * scale

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		// TODO: Hacky...

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

	};

	this.hide = function () {

		domElement.style.display = 'none';

	};

	this.resize = function ( width, height ) {

		console.log( "Exploration Resize" );

	};

	this.update = function () {

		// just flying around worlds using new RollCamera
		
		if( world && world.scene ) {

			time = new Date().getTime() - start;
			delta = time - lastTime;
			lastTime = time;
			delta = 33;


			THREE.AnimationHandler.update( delta );

			camera.updateCamera( progress, delta, time );
			world.update( delta, camera.camera, true );
			
			if( soup ) soup.update( delta, camera.camera );

			clearEffect.update( progress, delta, time );

			renderer.setClearColor( world.scene.fog ? world.scene.fog.color : 0xffffff );
			renderer.render( world.scene, camera.camera, renderTarget );

			if( fadeInTime < 1000 ) {
				
				fadeInTime += delta;
				fadeOutEffect.update( 1.0 - fadeInTime / 1000 );

			}

			for( var i = 0; i < portals.length; i++ ) {
				
				if( portals[ i ].currentDistance < portals[ i ].radius * 1.5 ) {
					
				//	fadeOutEffect.update( 1.0 - ( portals[ i ].currentDistance - portals[ i ].radius ) / ( portals[ i ].radius * 0.5 ));
					
				}
				
			}

			postEffect.update( progress, delta, time );

		}

	};

};

ExplorationSection.prototype = new Section();
ExplorationSection.prototype.constructor = ExplorationSection;
