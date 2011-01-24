var Part3 = function ( camera, scene, renderer ) {

	Effect.call( this );

	var mesh, elements = [], mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		// Dunes

		geometry = new Plane( 2000, 2000, 100, 100 );

		for ( var x = 0; x < 100; x ++ ) {

			for ( var y = 0; y < 102; y ++ ) {

				geometry.vertices[ x + y * 100 ].position.z = Math.sin( x / 10 ) * 50 + Math.cos( y / 10 ) * 50;

			}

		}

		mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } ) );
		mesh.rotation.x = 90 * Math.PI / 180;
		elements.push( mesh );

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

Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
