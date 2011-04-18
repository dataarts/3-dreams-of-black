var Prairie = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	cameraPath, waypoints = [],
	delta, currentTime, oldTime = -1;

	this.init = function () {

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
		cameraPath.lon = 160;

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

	this.show = function ( f ) {

		oldTime = new Date().getTime();
		cameraPath.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

		shared.started.prairie = true;
		
	};

	this.hide = function () {

	};

	this.update = function ( progress, time, start, end ) {

		currentTime = new Date().getTime();
		
		if ( oldTime == -1 ) oldTime = currentTime;
		
		delta = currentTime - oldTime;
		oldTime = currentTime;

		THREE.AnimationHandler.update( delta );

		// slight camera roll

		if ( camera.animationParent ) {

			camera.animationParent.rotation.z = camera.target.position.x / 600;

		}

		
		// slightly bumpy camera, since we're on a train
		camera.animationParent.position.y += Math.sin( time / 100 ) * 0.2;
		

		// make it darker towards the end
		/*var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		world.scene.lights[1].color.setRGB(a,a,a);
		world.scene.lights[2].color.setRGB(a,a,a);*/

		world.update( delta );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );

	};

};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
