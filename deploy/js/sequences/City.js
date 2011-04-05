var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,

	waypoints = [], delta, time, oldTime;

	this.init = function () {

		waypoints = [ [ 0, 20, 0 ], [ 0, 20, -3000 ] ];

		camera = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypoints, duration: 30, 
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.5, Math.PI-0.5 ] }

		 } );


		camera.position.set( 0, 0, 0 );
		camera.lon = 90;

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );

		//world.scene.addObject( camera.debugPath );
		world.scene.addObject( camera.animationParent );


		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		oldTime = new Date().getTime();
		camera.animation.play( true, 0 );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {



	};

	this.update = function ( f ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		THREE.AnimationHandler.update( delta );

		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );
		
	};

};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
