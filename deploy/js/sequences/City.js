var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget,

	waypoints = [], delta, time, oldTime;

	// temp debug, start with ?debug=true
	shared.debug = false;
	if (getParameterByName("debug") == "true") {
		shared.debug = true;
	}

	this.init = function () {

		waypointsStraight = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ 0, 20, -3300 ] ];
		waypointsRight = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ 250, 20, -1750 ], [ 1660, 20, -1750 ] ];
		waypointsLeft = [ [ 0, 20, 0 ], [ 0, 20, -1570 ], [ -250, 20, -1750 ], [ -1660, 20, -1750 ] ];

		camera = new THREE.PathCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			waypoints: waypointsStraight, duration: 30, 
			useConstantSpeed: true, resamplingCoef: 20,
			createDebugPath: shared.debug, createDebugDummy: shared.debug,
			lookSpeed: 0.0020, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.09, 3.05 ], dstRange: [ 1.0, 1.9 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0.4, Math.PI-0.4 ] }

		 } );


		camera.position.set( 0, 0, 0 );
		camera.lon = 90;

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
		
		if (shared.debug) {
			world.scene.addObject( camera.debugPath );
		}
		world.scene.addObject( camera.animationParent );

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

		// slight camera roll
		if (camera.animationParent) {
			camera.animationParent.rotation.z = (camera.target.position.x)/700;
		}

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
