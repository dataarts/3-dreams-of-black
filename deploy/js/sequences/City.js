var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, startCamera, switchCamera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	waypointsA = [], waypointsB = [], delta, time, oldTime;
	var switchedCamera = false;

	// temp debug, start with ?debug=true

	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}

	this.init = function () {

		waypointsA = [ [ 0, 20, 0 ], [ 0, 20, -1210 ] ];

		startCamera = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 11, 
			useConstantSpeed: true, resamplingCoef: 30,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );


		startCamera.position.set( 0, 0, 0 );
		startCamera.lon = 90;

		camera = startCamera;

		/*camera = new THREE.QuakeCamera( {
		fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
		movementSpeed: 100.0, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );
		gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );
		
		shared.worlds.city = world;
		 
		if ( shared.debug ) {

			world.scene.addObject( camera.debugPath );

		}

		world.scene.addObject( camera.animationParent );

	};

	this.show = function ( f ) {

		oldTime = new Date().getTime();
		
		camera.animation.play( false, 0 );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {



	};

	this.update = function ( f ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		// choose path
		var camz = camera.matrixWorld.n34;
	
		if (camz < -1200 && !switchedCamera ) {

			waypointsB = [ [ 0, 20, camz ], [ 0, 20, -3350 ] ];

			if (camera.theta < 1.2) {
				// turn left
				waypointsB = [ [ 0, 20, camz ], [ 0, 20, -1600 ], [ -250, 20, -1740 ], [ -1670, 20, -1740 ] ];
			}
			if (camera.theta > 1.8) {
				// turn right
				waypointsB = [ [ 0, 20, camz ], [ 0, 20, -1600 ], [ 250, 20, -1740 ], [ 1670, 20, -1740 ] ];
			}

			switchCamera = new THREE.PathCamera( {

				fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
				waypoints: waypointsB, duration: 19, 
				useConstantSpeed: true, resamplingCoef: 5,
				createDebugPath: false, createDebugDummy: false,
				lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
				verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
				horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

			 } );
		
			switchCamera.lat = startCamera.lat;
			switchCamera.lon = startCamera.lon;

			switchCamera.position.set( 0, 0, 0 );

			world.scene.addObject( switchCamera.animationParent );
			switchCamera.animation.play( false, 0 );

			camera = switchCamera;
			soup.changeCamera(camera);

			startCamera.animation.stop();
			
			//console.log("switched camera");
			switchedCamera = true;

		}

		THREE.AnimationHandler.update( delta );

		soup.update( delta );


		// slight camera roll

		/*if ( camera.animationParent ) {

			camera.animationParent.rotation.z = ( camera.target.position.x ) / 700;

		}*/

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
