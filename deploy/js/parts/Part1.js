var Part1 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;
	var cameraPath;
	var waypoints = [];
	var delta, time, oldTime;

	this.init = function ( callback ) {

		/*waypoints = [ [ 0, -465, 1800 ],
					  [ 0, -465, -1200 ]
					  ];*/

		waypoints = [ [ 0, 20, 0 ],
					  [ 0, 20, -3000 ]
					  ];

		cameraPath = new THREE.PathCamera( { fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
										 waypoints: waypoints, duration: 35, 
										 useConstantSpeed: true, resamplingCoef: 1,
										 createDebugPath: false, createDebugDummy: false,
										 lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
										 verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
										 horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }
									 } );
				
		
		cameraPath.position.set( 0, 0, 0 );				
		cameraPath.lon = 90;
			
		camera = cameraPath;

		world = new Part1World();
		soup = new Part1Soup( camera, world.scene );

		//world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );				

	};

	this.show = function () {

		oldTime = new Date().getTime();
		cameraPath.animation.play( true, 0 );

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

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
