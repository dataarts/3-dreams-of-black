var Part1 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {
			fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
			movementSpeed: 0.6, lookSpeed: 0.0020, noFly: true, lookVertical: true,
			autoForward: true
		} );

		gui.add( camera, 'movementSpeed', 0, 4).name( 'CameraSpeed' );

		world = new Part1World();
		soup = new Part1Soup( camera, world.scene );


	};

	this.show = function () {

		camera.position.x = -150;
		camera.position.y = -575;
		camera.position.z = 200;

/*		camera.position.x = - 150;
		camera.position.y = 500;
		camera.position.z = 200;
*/
		camera.lon = - 90;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		camera.position.x = -150;
		if (camera.position.z < -1700) {
			camera.position.z = 200;
		}

		/*if (camera.position.x < -200) {
			camera.position.x = -200;
		}
		if (camera.position.x > -100) {
			camera.position.x = -100;
		}*/

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
