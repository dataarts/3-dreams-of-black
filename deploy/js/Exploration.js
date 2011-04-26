var Exploration = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var renderer = shared.renderer;
	renderTarget = shared.renderTarget;

	var camera, cameras = {};

	cameras.dunes = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.dunes.movementSpeed = 200;
	cameras.dunes.lookSpeed = 3;
	cameras.dunes.constrainVertical = [ -0.4, 0.4 ];
	cameras.dunes.autoForward = false;
	cameras.dunes.position.set( 0, 0, 0 );

	cameras.prairie = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.prairie.movementSpeed = 50;
	cameras.prairie.lookSpeed = 3;
	cameras.prairie.constrainVertical = [ -0.4, 0.4 ];
	cameras.prairie.autoForward = false;
	cameras.prairie.position.set( 0, 0, 0 );

	cameras.city = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.city.movementSpeed = 100;
	cameras.city.lookSpeed = 3;
	cameras.city.constrainVertical = [ -0.4, 0.4 ];
	cameras.city.autoForward = false;
	cameras.city.position.set( 0, 0, 0 );

	var world, scene,
	clearEffect, heatEffect, paintEffect, noiseEffect, renderEffect, overlayEffect;

	clearEffect = new ClearEffect( shared );
	clearEffect.init();

	heatEffect = new HeatEffect( shared );
	heatEffect.init();

	paintEffect = new PaintEffect( shared );
	paintEffect.init();

	noiseEffect = new NoiseEffect( shared, 0.15, 0.0, 4096 );
	noiseEffect.init();

	overlayEffect = new OverlayEffect( shared, THREE.ImageUtils.loadTexture( "files/textures/fingerprints.png" ) );
	overlayEffect.init();

	renderEffect = new RenderEffect( shared );
	renderEffect.init();

	var progress = 0, start = 0, lastTime = 0;

	// signals

	shared.signals.startexploration.add( startExplore );
	shared.signals.windowresized.add( updateViewportSize );


	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

		if ( world ) {

			time = new Date().getTime() - start;
			delta = time - lastTime;
			lastTime = time;

			world.update( delta, camera, true );

			clearEffect.update( progress, delta, time );

			renderer.setClearColor( world.scene.fog.color );
			renderer.render( world.scene, camera, renderTarget );

			shared.logger.log( "vertices: " + renderer.data.vertices );
			shared.logger.log( 'faces: ' + renderer.data.faces );

			//paintEffect.update( progress, delta, time );
			//heatEffect.update( progress, delta, time );
			//noiseEffect.update( progress, delta, time );
			//overlayEffect.update( progress, delta, time );
			renderEffect.update( progress, delta, time );

		}

	};

	function startExplore( worldId ) {

		domElement.appendChild( renderer.domElement );

		// updateViewportSize();

		world = shared.worlds[ worldId ];
		scene = world.scene;
		camera = cameras[ worldId ];

		scene.addChild( camera );

		camera.position.set( 0, 0, 0 );

		// hide soup (if it wasn't yet activated)

		if ( !shared.started[ worldId ] ) {

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

		start = lastTime = new Date().getTime();

	};

	function stop() {

	};

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

};
