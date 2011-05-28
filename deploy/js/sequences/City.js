var City = function ( shared ) {

	var that = this;

	SequencerItem.call( this );

	var LOOK_SPEED = 0.001;
	
	// signals
	
	shared.signals.initscenes.add( initScene );
	
	// private variables
	
	var camera, startCamera, switchCamera, world, soup, 
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	waypointsA = [], waypointsB = [];
	var switchedCamera = false, lookLocked = 0;


	// temp debug, start with ?debug=true

	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}
	
	function initScene () {
		
		that.update( 0.001, 34.99, 45199 );

	};

	this.init = function () {

		waypointsA = [ [ 0, 18, -300 ], [ 0, 18, -1430 ] ];
		//waypointsA = [ [ 0, 18, -350 ], [ 0, 18, -3350 ] ];

		
		startCamera = new THREE.PathCamera( {

			fov: 65, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 9.7, 
			useConstantSpeed: true, resamplingCoef: 5,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: LOOK_SPEED, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 0.4, 2.0 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0, Math.PI ] }

		 } );
		
		
		/*startCamera = new THREE.PathCamera( {

			fov: 60, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 26, 
			useConstantSpeed: true, resamplingCoef: 30,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0060, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 3.0 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.2, Math.PI-0.2 ] }

		 } );
		*/
		startCamera.position.set( 0, 0, 0 );
		startCamera.lon = 180;
		startCamera.lat = -20;

		camera = startCamera;
		

		/*
		camera = new THREE.QuakeCamera( {
		fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
		movementSpeed: 100.0, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );

		gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

		//camera = new THREE.Camera( 60, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		//camera.position.set( 0, 20, -300 );

		if (shared.debug) {
			gui = new GUI();
			gui.add( camera, 'fov', 50, 120 ).name( 'Lens' );		
		}

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );
		
		shared.worlds.city = world;
		shared.soups.city = soup;
		shared.sequences.city = this;
		 
		
		/*if ( shared.debug ) {

			world.scene.addObject( camera.debugPath );

		}*/

		world.scene.addObject( camera.animationParent );
		
	};

	this.resetCamera = function() {

		switchedCamera = false;

		startCamera.position.set( 0, 0, 0 );
		startCamera.lon = 180;
		startCamera.lat = -20;

		camera = startCamera;
		camera.animation.play( false, 0 );

		soup.changeCamera(camera);

		renderer.setClearColor( world.scene.fog.color );

	};
	
	this.show = function ( progress ) {

		this.resetCamera();

		shared.started.city = true;

	};

	this.hide = function () {

	};

	this.update = function ( progress, delta, time ) {
		
		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		lookLocked += delta;

		if (lookLocked < 2000) {
			camera.lon = 180;
			camera.lat = -20;
		}


		if (shared.debug) {
			camera.updateProjectionMatrix();		
		}

		/*camera.position.z -= 0.9 * delta / 8;

		if ( camera.position.z < -3300 ) {

			camera.position.z = -350;

		}*/

		// choose path
		
		//var camz = camera.matrixWorld.n34;
		var camz = camera.animationParent.position.z;

		if (camz < -1400 && !switchedCamera ) {

			waypointsB = [ [ 0, 18, camz ], [ 0, 18, -3400 ] ];

			if (camera.theta < 1.2) {
				// turn left
				waypointsB = [ [ 0, 18, camz ], [ 0, 18, -1650 ], [ -110, 18, -1740 ], [ -1670, 18, -1740 ] ];
			}
			if (camera.theta > 1.8) {
				// turn right
				waypointsB = [ [ 0, 18, camz ], [ 0, 18, -1650 ], [ 110, 18, -1740 ], [ 1670, 18, -1740 ] ];
			}

			var fov = 65;
			if (shared.debug) {
				fov = startCamera.fov
			}

			switchCamera = new THREE.PathCamera( {

				fov: fov, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
				waypoints: waypointsB, duration: 15.6, 
				useConstantSpeed: true, resamplingCoef: 5,
				createDebugPath: false, createDebugDummy: false,
				lookSpeed: LOOK_SPEED, lookVertical: true, lookHorizontal: true,
				verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 0.4, 2.0 ] },
				horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0, Math.PI ] }

			 } );
		
			switchCamera.lat = startCamera.lat;
			switchCamera.lon = startCamera.lon;

			//switchCamera.mouseX = startCamera.mouseX;
			//switchCamera.mouseY = startCamera.mouseY;

			world.scene.addObject( switchCamera.animationParent );
			switchCamera.animation.play( false, 0 );

			camera = switchCamera;
			soup.changeCamera(camera);

			startCamera.animation.stop();
			
		if (shared.debug) {
			gui.add( camera, 'fov', 50, 120 ).name( 'Lens' );		
		}

			switchedCamera = true;

		}
		
		THREE.AnimationHandler.update( delta );

		soup.update( delta );


		// slight camera roll

		if ( camera.animationParent ) {

			camera.animationParent.rotation.z = ( camera.target.position.x ) / 400;

		}
		

		renderer.render( world.scene, camera, renderTarget );

		world.update( delta, camera, false );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
