var Part1 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {
			fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
			movementSpeed: 3, lookSpeed: 0.0015, noFly: true, lookVertical: true,
			autoForward: true
		} );

		world = new Part1World();

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

		renderer.render( world.scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
