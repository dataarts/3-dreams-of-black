var Part1 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var world, mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		world = new Part1World();

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		camera.position.y = 50;

		scene.fog = new THREE.Fog( 0x7d7e76, 0, 5000 );
		renderer.setClearColorHex( 0x7d7e76, 1 );

		for ( var i = 0; i < world.objects.length; i ++ ) {

			scene.addObject( world.objects[ i ] );

		}

	};

	this.hide = function () {

		events.mousemove.remove( onMouseMove );

		for ( var i = 0; i < world.objects.length; i ++ ) {

			scene.removeObject( world.objects[ i ] );

		}

	};

	this.update = function ( i ) {

		camera.position.z = - i * 1500 + 1000;

		camera.target.position.x += ( mouse.x - camera.target.position.x ) * 0.1;
		camera.target.position.y += ( ( camera.position.y - mouse.y ) - camera.target.position.y ) * 0.1;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
