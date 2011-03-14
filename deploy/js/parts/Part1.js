var Part1 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {
			fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
			movementSpeed: 0.8, lookSpeed: 0.0020, noFly: true, lookVertical: true,
			autoForward: true
		} );

		gui.add( camera, 'movementSpeed', 0, 4).name( 'CameraSpeed' );

		world = new Part1World();
		soup = new Part1Soup( camera, world.scene );


	};

	this.show = function () {

		camera.position.x = - 150;
		camera.position.y = - 575;
		camera.position.z = 200;

		camera.lon = - 90;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
