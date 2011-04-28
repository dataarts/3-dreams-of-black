var Prairie = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	cameraPath, waypoints = [];

	this.init = function () {
/*
		waypoints = [
			[ 0, 0, 0 ],
			[ 104, -1, -44 ],
			[ 167, -4, -69 ],
			[ 250, -9, -95 ],
			[ 336, -12, -111 ],
			[ 364, -12, -115 ],
			[ 402, -14, -120 ],
			[ 467, -14, -122 ],
			[ 532, -14, -116 ],
			[ 616, -15, -94 ],
			[ 696, -15, -60 ],
			[ 754, -14, -21 ],
			[ 805, -14, 16 ],
			[ 883, -13, 80 ],
			[ 970, -14, 146 ],
			[ 1028, -13, 182 ],
			[ 1080, -47, 228 ],
			[ 1142, -138, 288 ]
		];
*/

		waypoints = [
		[ 302.182, 105.662, -15.045 ],
		[ 352.207, 114.403, -16.674 ],
		[ 402.111, 120.122, -17.990 ],
		[ 452.904, 122.699, -19.151 ],
		[ 504.217, 120.952, -20.024 ],
		[ 553.975, 113.019, -20.361 ],
		[ 602.272, 99.086, -20.384 ],
		[ 649.469, 80.302, -20.309 ],
		[ 693.666, 56.337, -19.920 ],
		[ 736.849, 28.213, -19.488 ],
		[ 778.636, -1.415, -19.337 ],
		[ 819.084, -33.658, -19.508 ],
		[ 856.894, -66.605, -19.823 ],
		[ 895.344, -100.750, -20.237 ],
		[ 934.572, -133.462, -20.619 ],
		[ 974.512, -164.171, -20.174 ],
		[ 1014.980, -193.612, -21.554 ],
		[ 1055.660, -220.791, -32.133 ],
		[ 1085.890, -240.610, -66.939 ],
		[ 1094.090, -246.713, -99.358 ]
		];

		var i, x, y, z, t, d = 6;

		for( var i = 0; i < waypoints.length; i++ ) {

			t = waypoints[ i ][ 1 ];
			waypoints[ i ][ 1 ] = waypoints[ i ][ 2 ] + d;
			waypoints[ i ][ 2 ] = -t;

		}

		/*camera = new THREE.QuakeCamera( {
		fov: 60, aspect: WIDTH / HEIGHT, near: 1, far: 100000,
		movementSpeed: 100, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );*/

		cameraPath = new THREE.PathCamera( {

			fov: 60, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 1000000,
			waypoints: waypoints, duration: 25,
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.003, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.00, 6.28 ], dstRange: [ 1.7, 3.0 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.3, Math.PI-0.3 ] }

		 } );

		cameraPath.position.set( 0, 0, 0 );
		cameraPath.lon = 360;

		camera = cameraPath;

		world = new PrairieWorld( shared, camera );
		soup = new PrairieSoup( camera, world.scene, shared );

		shared.worlds.prairie = world;

		//world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );

		/*gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

	};

	this.show = function ( progress ) {

		cameraPath.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

		shared.started.prairie = true;

	};

	this.hide = function () {

	};

	this.update = function ( progress, delta, time ) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		THREE.AnimationHandler.update( delta );

		// slight camera roll

		if ( camera.animationParent ) {

			camera.animationParent.rotation.z = camera.target.position.x / 600;

		}

		// slightly bumpy camera, since we're on a train // this feels like a horse or something...
		// camera.animationParent.position.y += Math.sin( time / 100 ) * 0.2;


		// make it darker towards the end
		/*var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		world.scene.lights[1].color.setRGB(a,a,a);
		world.scene.lights[2].color.setRGB(a,a,a);*/

		world.update( delta, camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );
		shared.logger.log( 'draw calls: ' + renderer.data.drawCalls );

	};

};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
