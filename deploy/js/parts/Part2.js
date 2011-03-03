var Part2 = function ( renderer, events ) {

	Effect.call( this );

	var camera, world, mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		camera = new THREE.Camera( 60, screenWidth / screenHeight, 1, 100000 );
		camera.position.y = 75;

		world = new Part2World();

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		renderer.setClearColorHex( 0x9ca69d, 1 );

	};

	this.hide = function () {

		events.mousemove.remove( onMouseMove );

	};

	this.update = function ( i ) {

		camera.position.z = - i * 2000 + 1000;

		camera.target.position.x += ( mouse.x - camera.target.position.x ) * 0.1;
		camera.target.position.y += ( ( camera.position.y - mouse.y ) - camera.target.position.y ) * 0.1;
		camera.target.position.z = camera.position.z - 1000;

		world.update( i );

		renderer.render( world.scene, camera );

	};

};

Part2.prototype = new Effect();
Part2.prototype.constructor = Part2;
