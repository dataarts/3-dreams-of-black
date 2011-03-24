var Part1 = function ( renderer, events ) {

	SequencerItem.call( this );

	var camera, world, soup;
	var waypoints = [];
	var delta, time, oldTime;

	this.init = function ( callback ) {

		/*waypoints = [ [ 0, -465, 1800 ],
					  [ 0, -465, -1200 ]
					  ];*/

		waypoints = [ [ 0, 20, 0 ], [ 0, 20, -3000 ] ];

		camera = new THREE.PathCamera( {

			fov: 50, aspect: 1280 / 720, near: 1, far: 100000,
			waypoints: waypoints, duration: 35, 
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }

		 } );


		camera.position.set( 0, 0, 0 );
		camera.lon = 90;

		world = new Part1World( events );
		soup = new Part1Soup( camera, world.scene, events );

		//world.scene.addObject( camera.debugPath );
		world.scene.addObject( camera.animationParent );


		events.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function () {

		oldTime = new Date().getTime();
		camera.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {



	};

	this.update = function ( i ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		THREE.AnimationHandler.update( delta );

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part1.prototype = new SequencerItem();
Part1.prototype.constructor = Part1;
