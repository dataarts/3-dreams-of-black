var Prairie = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup;
	var cameraPath;
	var waypoints = [];
	var delta, time, oldTime;

	this.init = function () {

		waypoints = [
			[ -22, 980, -3950 ],
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
			[ 13707, 281, 304 ]
		];

		cameraPath = new THREE.PathCamera( {

			fov: 60, aspect: WIDTH / HEIGHT, near: 1, far: 100000,
			waypoints: waypoints, duration: 25, 
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: true, createDebugDummy: true,
			lookSpeed: 0.003, lookVertical: true, lookHorizontal: true,
			//verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			//horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ Math.PI/2, Math.PI/2 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ Math.PI/2, Math.PI/2 ] }

		 } );

		cameraPath.position.set( 0, 10, 0 );
		cameraPath.lon = 160;

		camera = cameraPath;

		world = new PrairieWorld( shared );
		soup = new PrairieSoup( camera, world.scene );

		world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );


		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

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

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
