var Part2 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var mesh, elements = [], mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		// Ground

		mesh = new THREE.Mesh( new Plane( 1000, 2000, 50, 100 ), new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } ) );
		mesh.rotation.x = 90 * Math.PI / 180;
		elements.push( mesh );

		// Train

		var geometry = new Cube( 50, 50, 50 );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );

		for ( var i = 0; i < 100; i ++ ) {

			mesh = new THREE.Mesh( geometry, material );
			mesh.position.z = i * 100 - 1000;
			elements.push( mesh );
		}

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		for ( var i = 0; i < elements.length; i ++ ) {

			scene.addObject( elements[ i ] );

		}

	};

	this.hide = function () {

		events.mousemove.remove( onMouseMove );

		for ( var i = 0; i < elements.length; i ++ ) {

			scene.removeObject( elements[ i ] );

		}

	};

	this.update = function ( i ) {

		camera.position.y = 50;
		camera.position.z = - i * 1500 + 1000;

		camera.target.position.x = mouse.x;
		camera.target.position.y = camera.position.y - mouse.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	};

};

Part2.prototype = new Effect();
Part2.prototype.constructor = Part2;
