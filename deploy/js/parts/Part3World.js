var Part3World = function () {

	var that = this,
	TILE_SIZE = 10000;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.000025 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	// Ground

	var tiles = [];

	var image = document.createElement( 'img' );
	image.onload = function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = this.width;
		canvas.height = this.height;

		var context = canvas.getContext( '2d' );
		context.drawImage( this, 0, 0 );

		var data = context.getImageData( 0, 0, this.width, this.height ).data;

		var geometry = new Plane( TILE_SIZE, TILE_SIZE, this.width - 1, this.height - 1 );

		for ( var i = 0, j = 0; i < data.length; i += 4, j ++ ) {

			geometry.vertices[ j ].position.x += Math.random() * 0.5; // + data[ i ] * 0.01;
			geometry.vertices[ j ].position.y += Math.random() * 0.5;
			geometry.vertices[ j ].position.z = data[ i ];

		}

		geometry.computeFaceNormals();

		var material = new THREE.MeshLambertMaterial( 0xff0000 );

		for ( var i = 0; i < 10; i ++ ) {

			var mesh = new THREE.Mesh( geometry, material );
			mesh.rotation.x = - 90 * Math.PI / 180;
			mesh.scale.z = 2;
			that.scene.addObject( mesh );

			tiles.push( mesh );

		}

	};
	image.src = 'files/textures/DunesHeightmap.png';

	/*
	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/dune.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;

		that.scene.addObject( mesh );

	} } );
	*/

	// Rocks

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/part3/rock.js', callback: function( geometry ) {

		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } );

		for ( var i = 0; i < 10; i ++ ) {

			var mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = Math.random() * 100000 - 50000;
			mesh.position.z	 = Math.random() * 100000 - 50000;

			mesh.rotation.y = Math.random() * 180 * Math.PI / 180;

			mesh.updateMatrix();
			mesh.matrixAutoUpdate = false;

			that.scene.addObject( mesh );

		}

	} } );

	// Clouds

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/part3/cloud.js', callback: function( geometry ) {

		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, opacity: 0.15, blending: THREE.AdditiveBlending } );

		for ( var i = 0; i < 20; i ++ ) {

			var mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = Math.random() * 60000 - 30000;
			mesh.position.y = Math.random() * 10000 + 20000;
			mesh.position.z	 = Math.random() * 60000 - 30000;

			mesh.rotation.y = Math.random() * 180 * Math.PI / 180;

			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 20 + 1;

			mesh.doubleSided = true;

			mesh.updateMatrix();
			mesh.matrixAutoUpdate = false;

			that.scene.addObject( mesh );

		}

	} } );

	this.update = function ( camera ) {

		var x = Math.round( camera.position.x / TILE_SIZE );
		var z = Math.round( camera.position.z / TILE_SIZE );

		tiles[ 0 ].position.x = ( x - 1 ) * TILE_SIZE;
		tiles[ 0 ].position.z = ( z - 1 ) * TILE_SIZE;

		tiles[ 1 ].position.x = ( x ) * TILE_SIZE;
		tiles[ 1 ].position.z = ( z - 1 ) * TILE_SIZE;

		tiles[ 2 ].position.x = ( x + 1 ) * TILE_SIZE;
		tiles[ 2 ].position.z = ( z - 1 ) * TILE_SIZE;

		tiles[ 3 ].position.x = ( x - 1 ) * TILE_SIZE;
		tiles[ 3 ].position.z = ( z ) * TILE_SIZE;

		tiles[ 4 ].position.x = ( x ) * TILE_SIZE;
		tiles[ 4 ].position.z = ( z ) * TILE_SIZE;

		tiles[ 5 ].position.x = ( x + 1 ) * TILE_SIZE;
		tiles[ 5 ].position.z = ( z ) * TILE_SIZE;

		tiles[ 6 ].position.x = ( x - 1 ) * TILE_SIZE;
		tiles[ 6 ].position.z = ( z + 1 ) * TILE_SIZE;

		tiles[ 7 ].position.x = ( x ) * TILE_SIZE;
		tiles[ 7 ].position.z = ( z + 1 ) * TILE_SIZE;

		tiles[ 8 ].position.x = ( x + 1 ) * TILE_SIZE;
		tiles[ 8 ].position.z = ( z + 1 ) * TILE_SIZE;

	}

}
