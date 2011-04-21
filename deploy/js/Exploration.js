var Exploration = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var renderer = shared.renderer,
	renderTarget = shared.renderTarget;

	var camera, cameras = {};

	cameras.dunes = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.dunes.movementSpeed = 200;
	cameras.dunes.lookSpeed = 3;
	cameras.dunes.constrainVertical = [ -0.4, 0.4 ];
	cameras.dunes.autoForward = true;
	cameras.dunes.position.set( 0, 0, 0 );

	cameras.prairie = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.prairie.movementSpeed = 50;
	cameras.prairie.lookSpeed = 3;
	cameras.prairie.constrainVertical = [ -0.4, 0.4 ];
	cameras.prairie.autoForward = true;
	cameras.prairie.position.set( 0, 0, 0 );

	cameras.city = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	cameras.city.movementSpeed = 100;
	cameras.city.lookSpeed = 3;
	cameras.city.constrainVertical = [ -0.4, 0.4 ];
	cameras.city.autoForward = true;
	cameras.city.position.set( 0, 0, 0 );

	var world, scene,
	clearEffect, heatEffect, noiseEffect, renderEffect;

	clearEffect = new ClearEffect( shared );
	clearEffect.init();

	heatEffect = new HeatEffect( shared );
	heatEffect.init();

	noiseEffect = new NoiseEffect( shared, 0.15, 0.0, 4096 );
	noiseEffect.init();

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

			world.update( delta, camera );

			clearEffect.update( progress, time );

			renderer.setClearColor( world.scene.fog.color );
			renderer.render( world.scene, camera, renderTarget );

			shared.logger.log( "vertices: " + renderer.data.vertices );
			shared.logger.log( 'faces: ' + renderer.data.faces );

			noiseEffect.update( progress, null, time );
			heatEffect.update( progress, null, time );
			renderEffect.update( progress, null, time );

		}

	};

	function startExplore ( worldId ) {

		/*
		if ( renderer.domElement.parentElement ) {

			renderer.domElement.parentElement.removeChild( renderer.domElement );

		}
		*/

		domElement.appendChild( renderer.domElement );

		updateViewportSize();

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

	function stop () {

	};

	function updateViewportSize () {

		var scale = window.innerWidth / shared.viewportWidth;

		shared.viewportWidth = shared.viewportWidth * scale;
		shared.viewportHeight = shared.viewportHeight * scale

		renderer.setSize( shared.viewportWidth, shared.viewportHeight );

		// TODO: Hacky...

		renderTarget.width = shared.viewportWidth;
		renderTarget.height = shared.viewportHeight;
		delete renderTarget.__webglFramebuffer;

		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = ( ( window.innerHeight - shared.viewportHeight  ) / 2 ) + 'px';

	};

};
