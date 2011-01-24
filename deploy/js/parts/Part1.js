var Part1 = function ( camera, scene, renderer, events ) {

	Effect.call( this );

	var mesh, elements = [], mouse = { x: 0, y: 0 };

	function onMouseMove( x, y ) {

		mouse.x = x;
		mouse.y = y;

	}

	this.init = function ( callback ) {

		var geometry = new Cube( 100, 100, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );

		for ( var i = 0; i < 100; i ++ ) {

			mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 100;
			mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 100;
			mesh.scale.y = Math.random() * 10;
			mesh.position.y = (mesh.scale.y * 100 ) / 2;

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

Part1.prototype = new Effect();
Part1.prototype.constructor = Part1;
