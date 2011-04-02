var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	var speedStart = 1.15,
		speedEnd = 2.5;
	
	this.init = function () {

		camera = new THREE.QuakeCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: speedStart, lookSpeed: 0.0015, noFly: false, lookVertical: true,
			constrainVertical: true, verticalMin: 1.2, verticalMax: 2,
			autoForward: true /*, heightSpeed: true, heightMin: 250, heightMax: 1500, heightCoef: 0.025*/

		} );

		camera.lon = -60;

		world = new DunesWorld( shared );
		soup = new DunesSoup( camera, world.scene, shared );

		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		camera.position.x = 0;
		camera.position.y = 250;
		camera.position.z = 0;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( progress, time, start, end ) {
		
		// not too low
		
		camera.position.y = cap_bottom( camera.position.y, 100 );
		
		// not too high before lift-off
		
		if ( progress < 0.31 ) {
			
			camera.position.y = cap_top( camera.position.y, 200 );

		}
		
		// lift-off
		
		var localProgres = ( progress - 0.31 ) / ( 0.43 - 0.31 );
		
		if ( progress > 0.31 && progress < 0.43 ) {
			
			camera.position.y += 6;
			camera.movementSpeed = speedStart + ( speedEnd - speedStart ) * localProgres;
			
			world.scene.fog.color.setHSV( 0.6, 0.1235 - 0.1235 * localProgres, 1 );
			world.scene.fog.density = 0.0004 - 0.0001 * localProgres;
			renderer.setClearColor( world.scene.fog.color );
			
		}

		world.update( camera );
		soup.update();

		renderer.render( world.scene, camera, renderTarget );

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
