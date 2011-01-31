var Part2 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var mesh, elements = [],
	train, buffalos,
	mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		// Ground

		mesh = new THREE.Mesh( new Plane( 2000, 4000, 50, 100 ), new THREE.MeshBasicMaterial( { color: 0x93735d, wireframe: true } ) );
		mesh.rotation.x = - 90 * Math.PI / 180;
		elements.push( mesh );

		// Train

		train = new THREE.Mesh( new THREE.Geometry(), new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
		train.position.y = 25;

		var carriage = new THREE.Mesh( new Cube( 50, 50, 200 ) );

		for ( var i = 0; i < 10; i ++ ) {

			carriage.position.z = - i * 250;

			GeometryUtils.merge( train.geometry, carriage );
		}

		train.geometry.computeBoundingSphere();

		elements.push( train );

		// Buffalos

		buffalos = new THREE.Mesh( new THREE.Geometry(), new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
		buffalos.position.y = 10;

		var buffalo = new THREE.Mesh( new Cube( 20, 20, 50 ) );

		for ( var i = 0; i < 100; i ++ ) {

			buffalo.position.x = Math.floor( Math.random() * 100 - 50 ) * 10;
			buffalo.position.z = ( Math.random() * 20 - 10 ) * 50;

			GeometryUtils.merge( buffalos.geometry, buffalo );
		}

		buffalos.geometry.computeBoundingSphere();

		elements.push( buffalos );

	};

	this.show = function () {

		events.mousemove.add( onMouseMove );

		camera.position.y = 75;

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

		camera.position.z = - i * 2000 + 1000;

		train.position.z = camera.position.z;

		buffalos.position.z = - i * 2500 + 1250;

		camera.target.position.x = mouse.x;
		camera.target.position.y = camera.position.y - mouse.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	};

};

Part2.prototype = new Effect();
Part2.prototype.constructor = Part2;
