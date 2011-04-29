var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, startCamera, switchCamera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,
	waypointsA = [], waypointsB = [];
	var switchedCamera = false;

	// temp debug, start with ?debug=true

	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}

	this.init = function () {

		//waypointsA = [ [ 0, 20, 0 ], [ 0, 20, -1210 ] ];
		//waypointsA = [ [ 0, 20, 0 ], [ 0, 20, -3350 ] ];

		/*startCamera = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 9.2, 
			useConstantSpeed: true, resamplingCoef: 30,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );*/


		/*startCamera = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsA, duration: 26, 
			useConstantSpeed: true, resamplingCoef: 30,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );

		startCamera.position.set( 0, 0, 0 );
		startCamera.lon = 90;

		camera = startCamera;*/

		/*camera = new THREE.QuakeCamera( {
		fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
		movementSpeed: 100.0, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );
		gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/

		camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera.position.set(0,20,0);

		world = new CityWorld( shared );
		soup = new CitySoup( camera, world.scene, shared );
		
		shared.worlds.city = world;
		 
		/*if ( shared.debug ) {

			world.scene.addObject( camera.debugPath );

		}

		world.scene.addObject( camera.animationParent );
		*/
	};

	this.show = function ( progress ) {

		//camera.animation.play( false, 0 );


		renderer.setClearColor( world.scene.fog.color );
		renderer.setStencilShadowDarkness( 0.7 );

		shared.started.city = true;

	};

	this.hide = function () {



	};

	this.update = function ( progress, delta, time ) {

		THREE.AnimationHandler.update( delta );

		soup.update( delta );

		camera.position.z -= delta / 8.5;

		if (camera.position.z < -3300) {
			camera.position.z = 0;
		}

		// choose path
		/*var camz = camera.matrixWorld.n34;

		if (camz < -1200 && !switchedCamera ) {

			waypointsB = [ [ 0, 20, camz ], [ 0, 20, -3350 ] ];

			if (camera.theta < 1.2) {
				// turn left
				waypointsB = [ [ 0, 20, camz ], [ 0, 20, -1600 ], [ -110, 20, -1740 ], [ -1670, 20, -1740 ] ];
			}
			if (camera.theta > 1.8) {
				// turn right
				waypointsB = [ [ 0, 20, camz ], [ 0, 20, -1600 ], [ 110, 20, -1740 ], [ 1670, 20, -1740 ] ];
			}

			switchCamera = new THREE.PathCamera( {

				fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
				waypoints: waypointsB, duration: 14.3, 
				useConstantSpeed: true, resamplingCoef: 5,
				createDebugPath: false, createDebugDummy: false,
				lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
				verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
				horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

			 } );
		
			switchCamera.lat = startCamera.lat;
			switchCamera.lon = startCamera.lon;

			world.scene.addObject( switchCamera.animationParent );
			switchCamera.animation.play( false, 0 );

			camera = switchCamera;
			soup.changeCamera(camera);

			startCamera.animation.stop();
			
			//console.log("switched camera");
			switchedCamera = true;

		}*/


		// slight camera roll

		/*if ( camera.animationParent ) {

			camera.animationParent.rotation.z = ( camera.target.position.x ) / 700;

		}*/

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
