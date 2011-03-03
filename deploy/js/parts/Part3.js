var Part3 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var world, mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		world = new Part3World();

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		camera.position.y = 50;

		scene.fog = new THREE.Fog( 0x9ca69d, 0, 2000 );
		renderer.setClearColorHex( 0x9ca69d, 1 );

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

		camera.position.z = - i * 2000 + 1000;

		camera.target.position.x += ( mouse.x - camera.target.position.x ) * 0.1;
		camera.target.position.y += ( ( camera.position.y - mouse.y ) - camera.target.position.y ) * 0.1;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	};

};

Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
