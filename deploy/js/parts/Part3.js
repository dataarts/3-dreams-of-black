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

				geometry.vertices[ x + y * 100 ].position.z = Math.sin( x / 5 ) * 20 + Math.cos( y / 5 ) * 20;

			}

		}

		mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x93735d } ) );
		mesh.rotation.x = - 90 * Math.PI / 180;
		elements.push( mesh );

		// Objects

		var geometry = new Cube( 50, 100, 50 );
		var material = new THREE.MeshBasicMaterial( { color: 0x261209 } );

		for ( var i = 0; i < 100; i ++ ) {

			mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = Math.random() * 4000 - 2000;
			mesh.position.z = Math.random() * 4000 - 2000;
			mesh.scale.y = Math.random() * 5;

			mesh.autoUpdateMatrix = false;
			mesh.updateMatrix();

			elements.push( mesh );

		}

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		scene.fog = new THREE.Fog( 0x9ca69d, 0, 2000 );
		renderer.setClearColor( 0x9ca69d, 1 );

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
		camera.position.z = - i * 2000 + 1000;

		camera.target.position.x = mouse.x;
		camera.target.position.y = camera.position.y - mouse.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.clear();
		renderer.render( scene, camera );

	};

};

Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
