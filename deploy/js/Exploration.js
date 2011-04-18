var Exploration = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var renderer = shared.renderer,
	renderTarget = shared.renderTarget;

	var camera = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
	camera.movementSpeed = 200;
	camera.lookSpeed = 3;
	camera.constrainVertical = [ -0.4, 0.4 ];
	camera.autoForward = true;

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

	var progress = 0, time = 0;

	// signals

	shared.signals.startexploration.add( startExplore );
	shared.signals.windowresized.add( updateViewportSize );


	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

		if ( world ) {

			world.update( 0, camera );

			clearEffect.update( progress, time );
			//console.log( world.scene );

			//renderer.clear();
			renderer.setClearColor( world.scene.fog.color );
			renderer.render( world.scene, camera, renderTarget );

			shared.logger.log( "vertices: " + renderer.data.vertices );
			shared.logger.log( 'faces: ' + renderer.data.faces );

			heatEffect.update( progress, time );
			noiseEffect.update( progress, time );
			renderEffect.update( progress, time );

		}

	};

	function startExplore ( worldId ) {

		domElement.appendChild( renderer.domElement );

		updateViewportSize();

		world = shared.worlds[ worldId ];
		scene = world.scene;

		scene.addChild( camera );

		THREE.SceneUtils.traverseHierarchy( world.scene, function( node ) { 

			if ( ! ( node instanceof THREE.Mesh  || node instanceof THREE.Scene ) 
				|| ( node.geometry && node.geometry.morphTargets.length > 0 ) ) {

				node.visible = false; 

			}

		} );

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
