var City = function ( shared ) {

	var that = this;

	SequencerItem.call( this );

	// signals
	
	shared.signals.initscenes.add( initScene );
	
	// private variables
	
	var camera, startCamera, switchCamera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	waypointsA = [], waypointsB = [];
	var switchedCamera = false;

	// temp debug, start with ?debug=true

	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}
	
	function initScene () {
		
		console.log( "city initScene" );
		
		that.update( 0.001, 34.99, 45199 );

	};

	this.init = function () {

		waypointsA = [ [ 0, 18, -300 ], [ 0, 18, -1210 ] ];
		//waypointsA = [ [ 0, 18, -300 ], [ 0, 18, -3350 ] ];

		
		startCamera = new THREE.PathCamera( {

			fov: 60, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 7.8, 
			useConstantSpeed: true, resamplingCoef: 30,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0025, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 0.4, 2.8 ] },
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
		startCamera.lon = 90;

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

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );
		
		shared.worlds.city = world;
		shared.soups.city = soup;
		shared.sequences.city = this;
		 
		
		if ( shared.debug ) {

			world.scene.addObject( camera.debugPath );

		}

		world.scene.addObject( camera.animationParent );
		
		
		console.log( "city init" );
		
	};

	this.resetCamera = function() {
		
		//camera.position.set( 0, 20, -300 );
		camera.animation.play( false, 0 );

		renderer.setClearColor( world.scene.fog.color );
		renderer.setStencilShadowDarkness( 0.7 );

	};
	
	this.show = function ( progress ) {

		this.resetCamera();

		shared.started.city = true;

		console.log( "show city" );

	};

	this.hide = function () {

	};

	this.update = function ( progress, delta, time ) {
		
		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		/*camera.position.z -= 0.9 * delta / 8;

		if ( camera.position.z < -3300 ) {

			camera.position.z = -300;

		}*/

		// choose path
		
		//var camz = camera.matrixWorld.n34;
		var camz = camera.animationParent.position.z;

		if (camz < -1200 && !switchedCamera ) {

			waypointsB = [ [ 0, 18, camz ], [ 0, 18, -3350 ] ];

			/*if (camera.theta < 1.2) {
				// turn left
				waypointsB = [ [ 0, 18, camz ], [ 0, 18, -1600 ], [ -110, 18, -1740 ], [ -1670, 18, -1740 ] ];
			}
			if (camera.theta > 1.8) {
				// turn right
				waypointsB = [ [ 0, 18, camz ], [ 0, 18, -1600 ], [ 110, 18, -1740 ], [ 1670, 18, -1740 ] ];
			}*/

			switchCamera = new THREE.PathCamera( {

				fov: 60, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
				waypoints: waypointsB, duration: 14.3, 
				useConstantSpeed: true, resamplingCoef: 5,
				createDebugPath: false, createDebugDummy: false,
				lookSpeed: 0.0025, lookVertical: true, lookHorizontal: true,
				verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 0.4, 2.8 ] },
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
			
			//console.log("switched camera");
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
		
		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );
		shared.logger.log( 'draw calls: ' + renderer.data.drawCalls );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
