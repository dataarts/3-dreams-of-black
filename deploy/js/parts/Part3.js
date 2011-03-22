var Part3 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {

			fov: 60, aspect: 1280 / 720, near: 1, far: 100000,
			movementSpeed: 10, lookSpeed: 0.0015, noFly: false, lookVertical: true, 
			autoForward: true /*, heightSpeed: true, heightMin: 250, heightMax: 1500, heightCoef: 0.025*/

		} );

		world = new Part3World( events );
		soup = new Part3Soup( camera, world.scene );

	};

	this.show = function () {

		camera.position.x = 0;
		camera.position.y = 250;
		camera.position.z = 0;

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		world.update( camera );
		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
