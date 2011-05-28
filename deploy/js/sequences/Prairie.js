var Prairie = function ( shared ) {

	var that = this;

	SequencerItem.call( this );

	// signals
	
	shared.signals.initscenes.add( initScene );
	
	// private variables
	
	var camera, world, soup,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget,
	cameraPath, waypoints = [], lookToRight = 0;

	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}

	function initScene () {
		
		//console.log( "prairie initScene" );
		
		that.update( 0.0009, 49.99, 90375 );

	};
	
	this.init = function () {

		waypoints = [
		[ 332.182, 105.662, -15.045 ],
		[ 352.207, 114.403, -16.674 ],
		[ 402.111, 120.122, -17.990 ],
		[ 452.904, 122.699, -19.151 ],
		[ 504.217, 120.952, -20.024 ],
		[ 553.975, 113.019, -20.361 ],
		[ 602.272, 99.086, -20.384 ],
		[ 649.469, 80.302, -20.309 ],
		[ 693.666, 56.337, -19.920 ],
		[ 736.849, 28.213, -19.488 ],
		[ 778.636, -1.415, -19.337 ],
		[ 819.084, -33.658, -19.508 ],
		[ 856.894, -66.605, -19.823 ],
		[ 895.344, -100.750, -20.237 ],
		[ 934.572, -133.462, -20.619 ],
		[ 974.512, -164.171, -20.174 ],
		[ 1014.980, -193.612, -21.554 ],
		[ 1055.660, -220.791, -32.133 ],
		[ 1085.890, -240.610, -66.939 ],
		[ 1094.090, -246.713, -99.358 ]
		];

		var i, x, y, z, t, d = 6;

		for( var i = 0; i < waypoints.length; i++ ) {

			t = waypoints[ i ][ 1 ];
			waypoints[ i ][ 1 ] = waypoints[ i ][ 2 ] + d;
			waypoints[ i ][ 2 ] = -t;

		}

		/*
		camera = new THREE.QuakeCamera( {
		fov: 60, aspect: WIDTH / HEIGHT, near: 1, far: 100000,
		movementSpeed: 100, lookSpeed: 0.25, noFly: false, lookVertical: true,
		autoForward: false
		} );
		*/

		cameraPath = new THREE.PathCamera( {

			fov: 73, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 1000000,
			waypoints: waypoints, duration: 26.2,
			useConstantSpeed: true, resamplingCoef: 1,
			createDebugPath: false, createDebugDummy: false,
			lookSpeed: 0.0028, lookVertical: true, lookHorizontal: true,
			verticalAngleMap:   { srcRange: [ 0.00, 6.28 ], dstRange: [ 1.7, 3.0 ] },
			horizontalAngleMap: { srcRange: [ 0.00, 6.28 ], dstRange: [ 0, Math.PI ] }

		 } );

		cameraPath.position.set( 0, 0, 0 );
		cameraPath.lon = 360;

		camera = cameraPath;

		if (shared.debug) {
			gui = new GUI();
			gui.add( camera, 'fov', 50, 120 ).name( 'Lens' );		
		}

		//world = new PrairieWorld( shared, camera );
		//soup = new PrairieSoup( camera, world.scene, shared );
		world = new PrairieWorld( shared, camera, callbackSoup );
		
		function callbackSoup() {
			soup = new PrairieSoup( camera, world.scene, shared );
			shared.soups.prairie = soup;
			shared.prairieSoupHead = new THREE.Vector3();

		}


		shared.worlds.prairie = world;
		//shared.soups.prairie = soup;
		shared.sequences.prairie = this;

		//world.scene.addObject( cameraPath.debugPath );
		world.scene.addObject( cameraPath.animationParent );

		/*gui.add( camera.position, 'x' ).name( 'Camera x' ).listen();
		gui.add( camera.position, 'y' ).name( 'Camera y' ).listen();
		gui.add( camera.position, 'z' ).name( 'Camera z' ).listen();
		*/
		 
		//console.log( "prairie init" );

	};

	this.show = function ( progress ) {

		this.resetCamera();

		shared.started.prairie = true;
		
		//console.log( "show prairie" );

	};

	this.hide = function () {

	};

	this.resetCamera = function() {
		
		lookToRight = 0;
		camera.position.set( 0, 0, 0 );
		camera.lon = 360;

		camera.animation.play( false, 0 );

		//renderer.setClearColor( world.scene.fog.color );

	};
	
	this.update = function ( progress, delta, time ) {
		
		if ( isNaN(delta) || delta > 1000 || delta == 0 ) {

			delta = 1000 / 60;

		}

		lookToRight += delta;

		if (lookToRight < 2500) {
			camera.lon = 360;
		}

		if (shared.debug) {
			camera.updateProjectionMatrix();		
		}

		THREE.AnimationHandler.update( delta );

		// slight camera roll

		if ( camera.animationParent ) {

			camera.animationParent.rotation.z = camera.target.position.x / 300;

		}

		// slightly bumpy camera, since we're on a train // this feels like a horse or something... // lol ;)
		// camera.animationParent.position.y += Math.sin( time / 100 ) * 0.2;
		camera.animationParent.position.y += (Math.random()-0.5)*0.3;

		// make it darker towards the end
		/*var a =  Math.min(1, 1.2-(camera.animationParent.position.x/14000) );
		world.scene.lights[1].color.setRGB(a,a,a);
		world.scene.lights[2].color.setRGB(a,a,a);*/

		world.update( delta, camera, false );
		if ( soup ) {
			soup.update( delta );
		}

		renderer.render( world.scene, camera, renderTarget );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

Prairie.prototype = new SequencerItem();
Prairie.prototype.constructor = Prairie;
