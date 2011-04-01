var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.QuakeCamera( {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: 1.5, lookSpeed: 0.0015, noFly: false, lookVertical: true, 
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

	this.update = function ( f ) {
		
		// not to low
		if (camera.position.y < -400) {
			camera.position.y = -400;
		}

		world.update( camera );
		soup.update();

		renderer.render( world.scene, camera, renderTarget );

	};

};

Dunes.prototype = new SequencerItem();
Dunes.prototype.constructor = Dunes;
