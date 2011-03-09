var Part2 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, soup;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {
			fov: 60, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
			movementSpeed: 10, lookSpeed: 0.0025, noFly: false, lookVertical: true, 
			autoForward: true
		} );

		world = new Part2World();
		soup = new Part2Soup( camera, world.scene );

	};

	this.show = function () {

		camera.position.y = 0;
		camera.position.z = -1000;
		camera.position.x = 15000;
		camera.lon = 170;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		soup.update();

		renderer.render( world.scene, camera );

	};

};

Part2.prototype = new Effect();
Part2.prototype.constructor = Part2;
