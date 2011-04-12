var DunesWorld = function ( shared ) {

	var that = this,
	scale = 0.15,
	TILE_SIZE = 30000*scale;

	var randomAdded = 0;
	var tiles = [ [], [], [] ]; // 9x9 grid
	var lastx, lastz;

	// static tiles
	var walkPosition, prairiePosition, cityPosition;
	var sceneWalk, scenePrairie, sceneCity;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.00030 );
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

	// reference cube
	var cube = new THREE.Cube(100,100,100);
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	that.refCube = new THREE.Mesh( cube, material );
	that.refCube.visible = false;
	that.scene.addObject( that.refCube );

	// Mesh

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function addDunesPart( scene, position ) {

		scene.scale.x = scene.scale.y = scene.scale.z = scale;
		scene.position = position;
		scene.updateMatrix();

		that.scene.addChild( scene );

	};

	function walkLoaded( result ) {

		sceneWalk = result.scene;
		walkPosition = new THREE.Vector3(0,0,0*TILE_SIZE);
		sceneWalk.rotation.z = Math.PI;
		addDunesPart( sceneWalk, walkPosition );
	};

	function prairieLoaded( result ) {

		scenePrairie = result.scene;
		prairiePosition = new THREE.Vector3(0,0,1*TILE_SIZE);
		addDunesPart( scenePrairie, prairiePosition );

	};

	function cityLoaded( result ) {

		sceneCity = result.scene;
		cityPosition = new THREE.Vector3(0,0,2*TILE_SIZE);
		THREE.SceneUtils.showHierarchy( sceneCity, false );
		addDunesPart( sceneCity, cityPosition );

	};

	function randomLoaded( result ) {

		var x = (randomAdded%3);
		var z = Math.floor(randomAdded/3);
		//console.log(x+" - "+z);

		result.scene.rotation.z = getRandomRotation();
		if (x == 1 && (z == 1 || z == 2)) {
			THREE.SceneUtils.showHierarchy( result.scene, false );
		}
		addDunesPart(result.scene, new THREE.Vector3((x-1)*TILE_SIZE, 0, (z-1)*TILE_SIZE));

		tiles[z][x] = result.scene;
		++randomAdded;

	};

	// static parts
	loader.load( "files/models/dunes/D_tile_walk/D_tile_walk.js", function(){}, walkLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_prairie/D_tile_prairie.js", function(){}, prairieLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_city/D_tile_city.js", function(){}, cityLoaded, function(){});

	// random parts
	loader.load( "files/models/dunes/D_tile_1/D_tile_1.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_2/D_tile_2.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_3/D_tile_3.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_4/D_tile_4.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_1/D_tile_1.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_2/D_tile_2.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_3/D_tile_3.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_4/D_tile_4.js", function(){}, randomLoaded, function(){});
	loader.load( "files/models/dunes/D_tile_1/D_tile_1.js", function(){}, randomLoaded, function(){});


	function getRandomRotation () {
		return Math.round(Math.random()*4)*(Math.PI/2);
	}

	function updateTiles (z,x) {
	
		var difz = lastz-z;
		var difx = lastx-x;
	
		if (isNaN(difz) || isNaN(difx)) {
			return;
		}

		var t0, t1, t2;

		// z
		if (difz < 0) {
			//console.log("z0");
			var row = tiles.shift(); 
			t0 = row[0];
			t1 = row[1];
			t2 = row[2];

			showHideStaticTiles(t0.position, false);
			showHideStaticTiles(t1.position, false);
			showHideStaticTiles(t2.position, false);

			t0.position.z = (z+1)*TILE_SIZE;
			t1.position.z = (z+1)*TILE_SIZE;
			t2.position.z = (z+1)*TILE_SIZE;
	
			tiles.push(row);

		} else if (difz > 0) {	
			//console.log("z1");
			var row = tiles.pop(); 
			t0 = row[0];
			t1 = row[1];
			t2 = row[2];

			showHideStaticTiles(t0.position, false);
			showHideStaticTiles(t1.position, false);
			showHideStaticTiles(t2.position, false);

			t0.position.z = (z-1)*TILE_SIZE;
			t1.position.z = (z-1)*TILE_SIZE;
			t2.position.z = (z-1)*TILE_SIZE;

			tiles.unshift(row);

		}

		// x
		if (difx < 0) {
			//console.log("x0");
			t0 = tiles[0].shift();
			t1 = tiles[1].shift();
			t2 = tiles[2].shift();

			showHideStaticTiles(t0.position, false);
			showHideStaticTiles(t1.position, false);
			showHideStaticTiles(t2.position, false);

			t0.position.x = (x+1)*TILE_SIZE;
			t1.position.x = (x+1)*TILE_SIZE;
			t2.position.x = (x+1)*TILE_SIZE;

			tiles[0].push(t0);
			tiles[1].push(t1);
			tiles[2].push(t2);
		
		} else if (difx > 0) {	
			//console.log("x1");
			t0 = tiles[0].pop();
			t1 = tiles[1].pop();
			t2 = tiles[2].pop();

			showHideStaticTiles(t0.position, false);
			showHideStaticTiles(t1.position, false);
			showHideStaticTiles(t2.position, false);

			t0.position.x = (x-1)*TILE_SIZE;
			t1.position.x = (x-1)*TILE_SIZE;
			t2.position.x = (x-1)*TILE_SIZE;

			tiles[0].unshift(t0);
			tiles[1].unshift(t1);
			tiles[2].unshift(t2);
		
		}

		t0.rotation.z = getRandomRotation();
		t1.rotation.z = getRandomRotation();
		t2.rotation.z = getRandomRotation();

		THREE.SceneUtils.showHierarchy( t0, true );
		THREE.SceneUtils.showHierarchy( t1, true );
		THREE.SceneUtils.showHierarchy( t2, true );

		var visible0 = showHideStaticTiles(t0.position, true);
		var visible1 = showHideStaticTiles(t1.position, true);
		var visible2 = showHideStaticTiles(t2.position, true);

		// temp, since visible don´t seem to effect scenes
		if (visible0) {
			THREE.SceneUtils.showHierarchy( t0, false );
		}
		if (visible1) {
			THREE.SceneUtils.showHierarchy( t1, false );
		}
		if (visible2) {
			THREE.SceneUtils.showHierarchy( t2, false );
		}

		t0.updateMatrix();
		t1.updateMatrix();
		t2.updateMatrix();

	};

	// for the static tiles
	function showHideStaticTiles ( position, show ) {
		if (position.x == walkPosition.x && position.z == walkPosition.z) {
			THREE.SceneUtils.showHierarchy( sceneWalk, show );
			sceneWalk.updateMatrix();
			return true;
		}

		if (position.x == prairiePosition.x && position.z == prairiePosition.z) {
			THREE.SceneUtils.showHierarchy( scenePrairie, show );
			scenePrairie.updateMatrix();
			return true;
		}

		if (position.x == cityPosition.x && position.z == cityPosition.z) {
			THREE.SceneUtils.showHierarchy( sceneCity, show );
			sceneCity.updateMatrix();
			return true;
		}

	}

	this.update = function ( camera ) {

		that.refCube.position.x = camera.position.x + Math.cos( camera.theta )*2000;
		that.refCube.position.z = camera.position.z + Math.sin( camera.theta )*2000;
		//that.refCube.position.y = camera.position.y;

		//var z = Math.round( camera.position.z / TILE_SIZE );
		//var x = Math.round( camera.position.x / TILE_SIZE );
		var z = Math.round( that.refCube.position.z / TILE_SIZE );
		var x = Math.round( that.refCube.position.x / TILE_SIZE );

		// did we change?
		if (z != lastz || x != lastx) {
			updateTiles(z,x);
		}

		lastz = z;
		lastx = x;

	}

	//loader.load( "files/models/dunes/D_tile_city/D_tile_city.js", function(){}, addDunesPart, function(){});



/*	var loader = new THREE.JSONLoader();

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
*/
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

/*	this.update = function ( camera ) {

		var z = Math.round( camera.position.z / TILE_SIZE );
		var x = Math.round( camera.position.x / TILE_SIZE );

		

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

		

	}*/

}
