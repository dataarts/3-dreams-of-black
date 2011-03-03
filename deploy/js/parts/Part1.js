var Part1 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		camera = new THREE.Camera( 60, screenWidth / screenHeight, 1, 100000 );
		camera.position.y = 50;

		world = new Part1World();

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		renderer.setClearColorHex( 0x7d7e76, 1 );

	};

	this.hide = function () {

		events.mousemove.remove( onMouseMove );

	};

	this.update = function ( i ) {

		camera.position.z = - i * 1500 + 1000;

		camera.target.position.x += ( mouse.x - camera.target.position.x ) * 0.1;
		camera.target.position.y += ( ( camera.position.y - mouse.y ) - camera.target.position.y ) * 0.1;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( world.scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
