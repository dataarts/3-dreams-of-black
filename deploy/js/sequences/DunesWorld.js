var DunesWorld = function ( shared ) {

	var that = this,
	TILE_SIZE = 20000;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0004 );
	this.scene.fog.color.setHSV( 0.6, 0.1235, 1 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0, 0, 0.1 );
	this.scene.addLight( ambient );

	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	directionalLight1.position.set( -0.7143659529263534, 0.5424784186070764, 0.4420389696001798 );
	directionalLight1.color.setHSV( 0, 0, 1 );
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );
	directionalLight2.position.set( -0.19979561807642718, -0.1646853205760528,  0.9658987815419486 );
	directionalLight2.color.setHSV( 0, 0, 0.306 );
	this.scene.addLight( directionalLight2 );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function addDunesPart( geo ) {
		
		var mesh = new THREE.Mesh( geo, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );
		
		preInitModel( geo, shared.renderer, that.scene, mesh );

	};
	
	loader.load( { model: 'files/models/dunes/dunes_1.js', callback: addDunesPart } );
	loader.load( { model: 'files/models/dunes/dunes_2.js', callback: addDunesPart } );
	loader.load( { model: 'files/models/dunes/dunes_3.js', callback: addDunesPart } );
	loader.load( { model: 'files/models/dunes/dunes_4.js', callback: addDunesPart } );
	loader.load( { model: 'files/models/dunes/dunes_5.js', callback: addDunesPart } );

	/*

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

			geometry.vertices[ j ].position.x += Math.random() * data[ i ];
			geometry.vertices[ j ].position.y += Math.random() * data[ i ];
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

	*/

	/*

	// Ground

	events.loadItemAdd.dispatch();

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/dunes/Desert_GroundPlane.js', texture_path: 'files/models/prairie_v3/', callback: function( geometry ) {

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

		events.loadItemComplete.dispatch();

	} } );

	// Rocks

	events.loadItemAdd.dispatch();

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/dunes/Desert_GroundRocks.js', texture_path: 'files/models/prairie_v3/', callback: function( geometry ) {

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

		events.loadItemComplete.dispatch();

	} } );

	*/

	/*

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

	*/

	this.update = function ( camera ) {

		var x = Math.round( camera.position.x / TILE_SIZE );
		var z = Math.round( camera.position.z / TILE_SIZE );

		/*

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

		*/

	}

}
