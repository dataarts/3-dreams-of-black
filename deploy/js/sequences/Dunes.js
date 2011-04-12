var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup
	renderer = shared.renderer, renderTarget = shared.renderTarget;
	var delta, time, oldTime;

	var speedStart = 200.0,
		speedEnd = 400.0;

	this.init = function () {

		var autoCameraPars = {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: speedStart, lookSpeed: 0.1, noFly: false, lookVertical: true,
			constrainVertical: true, verticalMin: 1.0, verticalMax: 2.1,
			autoForward: true, 
			heightSpeed: true, heightMin: 150, heightMax: 5000, heightCoef: 0.1

		};
		
		var testCameraPars = {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: speedStart, lookSpeed: 0.1, noFly: false, lookVertical: true,
			constrainVertical: true, verticalMin: 0, verticalMax: 3,
			autoForward: false

		};
		
		camera = new THREE.QuakeCamera( autoCameraPars );
		//camera = new THREE.QuakeCamera( testCameraPars );

		camera.lon = 90;

		world = new DunesWorld( shared );
		soup = new DunesSoup( camera, world.scene, shared );

		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		camera.position.x = 0;
		camera.position.y = 150;
		camera.position.z = -1600;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( progress, time, start, end ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		//THREE.AnimationHandler.update( delta );

		// not too low

		camera.position.y = cap_bottom( camera.position.y, 150 );

		// not too high

		camera.position.y = cap_top( camera.position.y, 5000 );

		// not too high before lift-off

		var startLift = 0.29,
			endLift   = 0.4,
			liftSpeed = 250;
		
		if ( progress < startLift ) {

			camera.position.y = cap_top( camera.position.y, 150 );

			// small bump

			camera.position.y += Math.sin( time / 150 );

			// small roll

			camera.up.z = Math.sin( time / 250 ) / 200;
			camera.up.x = Math.cos( time / 250 ) / 200;

			camera.position.x = 0;

		}

		// lift-off

		var localProgres = ( progress - startLift ) / ( endLift - startLift );

		if ( progress > startLift && progress < endLift ) {

			camera.position.y += liftSpeed * ( delta / 1000 );
			camera.movementSpeed = speedStart + ( speedEnd - speedStart ) * localProgres;

			//world.scene.fog.color.setHSV( 0.6, 0.1235 - 0.1235 * localProgres, 1 );
			//world.scene.fog.density = 0.0004 - 0.0001 * localProgres;
			//renderer.setClearColor( world.scene.fog.color );

		}


		world.update( camera );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );

	};

	function cap( val, bottom, top ) {

		return ( val < bottom ) ? bottom : ( val > top ? top : val );

	};

	function cap_bottom( val, bottom ) {

		return val < bottom ? bottom : val;

	};

	function cap_top( val, top ) {

		return val > top ? top : val;

	};

};

Dunes.prototype = new SequencerItem();
Dunes.prototype.constructor = Dunes;
