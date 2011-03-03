var Part3 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world;

	this.init = function ( callback ) {

		camera = new THREE.QuakeCamera( {
			fov: 60, aspect: window.innerWidth / window.innerHeight, near: 1, far: 100000,
			movementSpeed: 2, lookSpeed: 0.0035, noFly: false, lookVertical: true, 
			autoForward: true, heightSpeed: true, heightMin: 250, heightMax: 1500, heightCoef: 0.025
		} );

		world = new Part3World();

	};

	this.show = function () {

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		renderer.render( world.scene, camera );

	};

};

Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
