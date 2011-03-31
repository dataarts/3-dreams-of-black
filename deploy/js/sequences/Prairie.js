var Prairie = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	cameraPath, waypoints = [],
	delta, time, oldTime;

	this.init = function () {

		waypoints = [
			[ 3223, 930, -2510 ],
			[ 4400, 885, -2990 ],
			[ 5711, 820, -3352 ],
			[ 6988, 775, -3550 ],
			[ 8364, 730, -3455 ],
			[ 9875, 736, -2857 ],
			[ 10855, 736, -2162 ],
			[ 12145, 736, -1080 ],
			[ 13022, 740, -524 ],
			[ 13365, 596, -208 ],
			[ 13950, -276, 412 ]
		];

		/*camera = new THREE.QuakeCamera( {
		fov: 60, aspect: WIDTH / HEIGHT, near: 1, far: 100000,
		movementSpeed: 1.5, lookSpeed: 0.0025, noFly: false, lookVertical: true,
		autoForward: false, heightSpeed: true, heightMin: -1500, heightMax: 1000, heightCoef: 0.0125
		} );*/

		cameraPath = new THREE.PathCamera( {

			fov: 60, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypoints, duration: 29, 
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.004, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.00, 6.28 ], dstRange: [ 1.7, 3.0 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }
		 } );

		cameraPath.position.set( 0, 10, 0 );
		cameraPath.lon = 160;

		camera = cameraPath;

		world = new PrairieWorld( shared );
		//soup = new PrairieSoup( camera, world.scene, shared );

		//world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );

		/*gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		oldTime = new Date().getTime();
		cameraPath.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( f ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		THREE.AnimationHandler.update( delta );

		// slight camera roll
		if (camera.animationParent) {

			camera.animationParent.rotation.z = (camera.target.position.x)/600;

		}

		/*
		// slightly bumpy camera, since we're on a train
		camera.animationParent.position.y += Math.sin(time/100)*2;
		*/

		// make it darker towards the end
		//var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		//world.scene.lights[1].color.setRGB(a,a,a);

		//soup.update();

		renderer.render( world.scene, camera, renderTarget );

	};

};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
