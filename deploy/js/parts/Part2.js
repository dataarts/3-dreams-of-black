var Part2 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;
	var cameraPath;
	var waypoints = [];
	var delta, time, oldTime;

	this.init = function ( callback ) {

		waypoints = [ [ -22, 980, -3950 ],
					  [ 617, 906, -4186 ],
					  [ 1807, 827, -4555 ],
					  [ 3471, 756, -4861 ],
					  [ 5015, 733, -4963 ],
					  [ 6497, 733, -4766 ],
					  [ 8004, 731, -4196 ],
					  [ 8997, 737, -3630 ],
					  [ 10106, 720, -2742 ],
					  [ 11522, 726, -1587 ],
					  [ 12200, 739, -1090 ],
					  [ 12936, 751, -632 ],
					  [ 13236, 680, -332 ],
					  [ 13707, 281, 304 ] ];

		cameraPath = new THREE.PathCamera( {

			fov: 60, aspect: 1280 / 720, near: 1, far: 100000,
			waypoints: waypoints, duration: 25, 
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.003, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }

		 } );

		cameraPath.position.set( 0, 10, 0 );
		cameraPath.lon = 160;

		camera = cameraPath;

		world = new Part2World( events );
		soup = new Part2Soup( camera, world.scene );

		//world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );

	};

	this.show = function () {

		/*gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/
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

		// slight camera roll
		if (camera.animationParent) {
			camera.animationParent.rotation.z = (camera.target.position.x)/600;
		}

		// slightly bumpy camera, since we're on a train
		camera.animationParent.position.y += Math.sin(time/100)*2;

		// make it darker towards the end
		var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		world.scene.lights[1].color.setRGB(a,a,a);

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part2.prototype = new Effect();
Part2.prototype.constructor = Part2;
