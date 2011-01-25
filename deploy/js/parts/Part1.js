var Part1 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var mesh, elements = [], mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		// Ground

		mesh = new THREE.Mesh( new Plane( 8000, 8000 ), new THREE.MeshBasicMaterial( { color: 0x2c2b30 } ) );
		mesh.rotation.x = - 90 * Math.PI / 180;
		elements.push( mesh );

		// Buildings

		var geometry = new Cube( 200, 100, 200 );
		var material = new THREE.MeshBasicMaterial( { color: 0x2c2b30 } );

		for ( var i = 0; i < 300; i ++ ) {

			mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = Math.floor( Math.random() * 40 - 20 ) * 200;
			if ( mesh.position.x == 0 ) mesh.position.x += 200;
			mesh.position.z = Math.floor( Math.random() * 40 - 20 ) * 200;
			mesh.scale.y = Math.random() * Math.random() * 10;
			mesh.position.y = (mesh.scale.y * 100 ) / 2;

			mesh.autoUpdateMatrix = false;
			mesh.updateMatrix();

			elements.push( mesh );

		}

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		scene.fog = new THREE.Fog( 0x7d7e76, 0, 5000 );
		renderer.setClearColor( 0x7d7e76, 1 );

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

		renderer.clear();
		renderer.render( scene, camera );

	};

};

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
