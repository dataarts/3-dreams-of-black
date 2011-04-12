var Prairie = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	cameraPath, waypoints = [],
	delta, time, oldTime;

	this.init = function () {

		waypoints = [
			[ 0, 0, 0 ],
			[ 104, -6, -44 ],
			[ 167, -9, -69 ],
			[ 250, -14, -95 ],
			[ 336, -17, -111 ],
			[ 364, -17, -115 ],
			[ 402, -19, -120 ],
			[ 467, -19, -122 ],
			[ 532, -19, -116 ],
			[ 616, -20, -94 ],
			[ 696, -20, -60 ],
			[ 754, -19, -21 ],
			[ 805, -19, 16 ],
			[ 883, -18, 80 ],
			[ 970, -19, 146 ],
			[ 1028, -18, 182 ],
			[ 1080, -52, 228 ],
			[ 1142, -143, 288 ]
		];

		/*camera = new THREE.QuakeCamera( {
		fov: 60, aspect: WIDTH / HEIGHT, near: 1, far: 100000,
		movementSpeed: 0.75, lookSpeed: 0.0025, noFly: false, lookVertical: true,
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

		cameraPath.position.set( 0, 5, 0 );
		cameraPath.lon = 160;

		camera = cameraPath;

		world = new PrairieWorld( shared );
		soup = new PrairieSoup( camera, world.scene, shared );

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
		/*var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		world.scene.lights[1].color.setRGB(a,a,a);
		world.scene.lights[2].color.setRGB(a,a,a);*/

		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

	};

};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
