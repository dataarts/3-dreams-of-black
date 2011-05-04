var DunesWorld = function ( shared ) {

	// vars

	var that = this;
	var	SCALE = 0.20;
	var TILE_SIZE = 30000 * SCALE;
	var scenePrairie, sceneCity, sceneWalk;
	var lastCameraTileGridPosition = { x: 999999, z: 9999999 };


	// create scene

	that.scene = new THREE.Scene();
	that.scene.collisions = new THREE.CollisionSystem();
	that.scene.fog = new THREE.FogExp2( 0xffffff, 0.00000275 );
	that.scene.fog.color.setHSV( 0.576,  0.382,  0.9  );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );

	ambient.color.setHSV( 0, 0, 0.1 );

	directionalLight1.position.set( 0.8085776615544399,  0.30962281305702444,  -0.500335766130914 );
	directionalLight1.color.setHSV( 0.08823529411764706,  0,  1 );

	directionalLight2.position.set( 0.09386404300915006,  0.9829903100365339,  0.15785940518149455 );
	directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 );

	that.scene.addLight( ambient );
	that.scene.addLight( directionalLight1 );
	that.scene.addLight( directionalLight2 );
	

	// Lens flares

	that.lensFlare = null;
	that.lensFlareRotate = null;

	initLensFlares( that, new THREE.Vector3( 0, 0, -10000 ), 70, 292 );		


	// can these be removed?

	shared.influenceSpheres = [ 
		
		{ name: "prairie", center: new THREE.Vector3( 544.30, 7167.78, 11173.20 ), radius: 1750, state: 0, type: 0 },
		{ name: "city",    center: new THREE.Vector3( -67.22, 6124.65, 5156.30 ), radius: 1750, state: 0, type: 0 },
		
		{ name: "prairiePortal", center: new THREE.Vector3( -314.95, 6122.06, 5658.0 ), radius: 50, state: 0, type: 1, destination: "prairie", pattern: 32 },
		{ name: "cityPortal",    center: new THREE.Vector3( -689.86, 6985.24, 10657.89 ), radius: 100, state: 0, type: 1, destination: "city", pattern: 16 }
		
	];


	// generate base grid (rotations depend on where the grid is in space)
	// 0-3 = tiles
	// 4 = walk
	// 5 = prairie
	// 6 = city

	var tileMeshes = [[],[],[],[],[],[],[]];
	var tileColliders = [];
	var numTileInstances = [ 0, 0, 0, 0, 1, 1, 1 ];
	var tileGrid = [];
	var tileGridSize = 5;		// must be uneven number
	var numTilesLoaded = 0;
	var z, x, tileRow, tileNumber;
	
	for( z = 0; z < tileGridSize; z++ ) {
		
		tileRow = [];
		tileGrid.push( tileRow );
		
		for( x = 0; x < tileGridSize; x++ ) {

			// place city, prairie and walk

			if( x === 0 && z === 0 ) {
				
				tileRow.push( 4 );										// walk
				
			} else if( x === 0 && z === 4 ) {
				
				tileRow.push( 5 );										// prairie
				
			} else if( x === 1 && z === 3 ) {
				
				tileRow.push( 6 );										// city
				
			} else {
				
				tileNumber = Math.floor( Math.random() * 3.99999 );		// random tile
				tileRow.push( tileNumber );
				numTileInstances[ tileNumber ]++;
				
			}

		}
		
	}


	// create skydome
	
	var skydome = new THREE.Mesh( new THREE.Cube( 50000, 50000, 50000 ), undefined );
	skydome.flipSided = true;
	applyDunesShader( { objects: { skydome: skydome } } );

	that.scene.addChild( skydome );


	// start loading

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( "files/models/dunes/D_tile_walk.js", walkLoaded );
	loader.load( "files/models/dunes/D_tile_prairie.js", prairieLoaded );
	loader.load( "files/models/dunes/D_tile_city.js", cityLoaded );

	loader.load( "files/models/dunes/D_tile_1.js", tileLoaded );
	loader.load( "files/models/dunes/D_tile_2.js", tileLoaded );
	loader.load( "files/models/dunes/D_tile_3.js", tileLoaded );
	loader.load( "files/models/dunes/D_tile_1.js", tileLoaded );

//	var jloader = new THREE.JSONLoader();
	
//	jloader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
//	jloader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };
	
//	jloader.load( { model: 'files/models/Cloud1_.js', callback: function( geo ) { addClouds( geo, 100 ); } } );
//	jloader.load( { model: 'files/models/Cloud2_.js', callback: function( geo ) { addClouds( geo, 100 ); } } );


	
	/////////// COPIED FROM OLD DUNESWORLD.JS - NOT USED HERE ///////////////

	var showSpheres = false;
	
	if ( showSpheres ) {
	
		var sphere = new THREE.Sphere( 1, 64, 32 );
		var sprite = THREE.ImageUtils.loadTexture( "files/textures/circle-outline.png" );

		for ( var i = 0; i < shared.influenceSpheres.length; i ++ ) {
			
			var s = shared.influenceSpheres[ i ];
			
			//if ( s.type == 1 ) 
			{
			
				var radius = s.radius;
				var center = s.center;
			
				//var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
				//var sphereObject = new THREE.Mesh( sphere, wireMaterial );
				
				var particleMaterial = new THREE.ParticleBasicMaterial( { size: 5, color:0xff7700, map: sprite, transparent: true } );
				var sphereObject = new THREE.ParticleSystem( sphere, particleMaterial );
				sphereObject.sortParticles = true;
				
				sphereObject.name = s.name;
				
				sphereObject.position.copy( center );
				sphereObject.scale.set( radius, radius, radius );
				
				s.mesh = sphereObject;
				
				that.scene.addObject( sphereObject );
				
			}

		}

	}


	// UGC - TODO: Temp implementation

	var ugcHandler = new UgcHandler();

	ugcHandler.getLatestUGOs( function ( objects ) {

		var geometry = new THREE.Cube( 50, 50, 50 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			var data = eval( objects[ i ] );

			if ( data instanceof Array ) {

				var group = new THREE.Object3D();
				group.position.x = Math.random() * 10000 - 5000;
				group.position.z = Math.random() * 10000 - 5000;

				for ( var j = 0, jl = data.length; j < jl; j += 4 ) {

					var voxel = new THREE.Mesh( geometry, material );
					voxel.position.x = data[ j ];
					voxel.position.y = data[ j + 1 ];
					voxel.position.z = data[ j + 2 ];
					voxel.matrixAutoUpdate = false;
					voxel.updateMatrix();
					voxel.update();

					group.addChild( voxel );

				}

				that.scene.addObject( group );

			}

		}

	} );


	/////////////////////////////////////////////////////////////////////////

	//--- walk loaded ---

	function walkLoaded( result ) {

		applyDunesShader( result );
		tileMeshes[ 4 ][ 0 ] = addDunesPart( result );

	};


	//--- prairie loaded ---

	function prairieLoaded( result ) {

		applyDunesShader( result );
		tileMeshes[ 5 ][ 0 ] = addDunesPart( result );
		
	};
	
	
	//--- city loaded ---

	function cityLoaded( result ) {

		applyDunesShader( result );
		tileMeshes[ 6 ][ 0 ] = addDunesPart( result );

	};
	
	
	//--- tile loaded ---

	function tileLoaded( result ) {

		var scene = result.scene;

		applyDunesShader( result );
		markColliders( scene );
		showHierarchyNotColliders( scene, true );
		

		// get collider
		
		tileColliders[ numTilesLoaded ] = scene.collisions.colliders[ 0 ].mesh;
		tileColliders[ numTilesLoaded ].rotation.x = -90 * Math.PI / 180;
		tileColliders[ numTilesLoaded ].scale.set( SCALE, SCALE, SCALE );
		
		//tileColliders[ numTilesLoaded ].materials[ 0 ] = new THREE.MeshLambertMaterial( { color: 0xff00ff, opacity: 0.5 });
		//tileColliders[ numTilesLoaded ].visible= true;
		that.scene.addChild( tileColliders[ numTilesLoaded ] );
		that.scene.collisions.merge( scene.collisions );

		
		// duplicate gfx
		
		for( var i = 0; i < numTileInstances[ numTilesLoaded ]; i++ ) {
			
			tileMeshes[ numTilesLoaded ].push( duplicateMesh( scene ));

		}

		numTilesLoaded++;

	};
	
	
	//--- udpate ---
	
	that.update = function ( delta, camera, portalsActive ) {
		
		that.updateTiles( camera ); 
		updateDunesShader( delta );
		
		skydome.position.copy( camera.matrixWorld.getPosition() );
		skydome.updateMatrix();

	};


	//--- update tiles ---

	that.updateTiles = function( camera ) {
		
		var halfGridSize = Math.floor( tileGridSize / 2 );
		var gridCenterPosition = camera.matrixWorld.getPosition();
		var camX = gridCenterPosition.x;
		var camZ = gridCenterPosition.z;
		

		gridCenterPosition.addSelf( camera.matrixWorld.getColumnZ().multiplyScalar( -TILE_SIZE * 1.5 ));

		var cameraTileGridX = Math.floor( gridCenterPosition.x / TILE_SIZE ) % tileGridSize;
		var cameraTileGridZ = Math.floor( gridCenterPosition.z / TILE_SIZE ) % tileGridSize;

		while( cameraTileGridX < 0 ) cameraTileGridX += tileGridSize;
		while( cameraTileGridZ < 0 ) cameraTileGridZ += tileGridSize;


		var x, z, tx, tz, px, pz, distance, tile, tileMesh;
		var currentNumberUsed = [ 0, 0, 0, 0, 0, 0, 0 ];
		var currentColliderDistances = [ -1, -1, -1, -1 ];
		
		for( z = -halfGridSize; z < halfGridSize + 1; z++ ) {
			
			for( x = -halfGridSize; x < halfGridSize + 1; x++ ) {
				
				px = ( Math.floor( gridCenterPosition.x / TILE_SIZE ) + x ) * TILE_SIZE;
				pz = ( Math.floor( gridCenterPosition.z / TILE_SIZE ) + z ) * TILE_SIZE;
				
				tx = ( cameraTileGridX + x ) % tileGridSize;
				tz = ( cameraTileGridZ + z ) % tileGridSize;
				
				while( tx < 0 ) tx += tileGridSize;
				while( tz < 0 ) tz += tileGridSize;
				
				tile = tileGrid[ tz ][ tx ];
				
				tileMesh = tileMeshes[ tile ][ currentNumberUsed[ tile ]++ ];

				if( tileMesh ) {
					
					tileMesh.position.x = px; 
					tileMesh.position.z = pz;
					tileMesh.rotation.z = getRotation( px, pz );
											
				}
				
				// set colliders around the user
				
				if( tile < 4 ) {
					
					tx = px - camX;
					tz = pz - camZ;
					
					distance = tx * tx + tz * tz;
					
					if( currentColliderDistances[ tile ] === -1 || distance < currentColliderDistances[ tile ] ) {

						currentColliderDistances[ tile ] = distance;
						
						tileMesh = tileColliders[ tile ];
						
						if( tileMesh ) {
							
							tileMesh.position.x = px; 
							tileMesh.position.z = pz;
							tileMesh.rotation.z = getRotation( px, pz );
							
						}
						
					}
					
				}
				
			}
			
		}
		
	}


	//--- helpers ---

	//--- duplicate mesh (dublicates the mesh of the tile) ---
	
	function duplicateMesh( scene ) {
		
		for( var c = 0; c < scene.children.length; c++ ) {
			
			if( !scene.children[ c ].__isCollider ) {
				
				var org  = scene.children[ c ];
				var mesh = new THREE.Mesh( org.geometry, org.materials );
				
				mesh.rotation.x = -90 * Math.PI / 180;
				mesh.scale.set( SCALE, SCALE, SCALE );
				
				that.scene.addChild( mesh );
						
				return mesh;
			}
		
		}
		
	};
	
	
	//--- add dunes part ---

	function addDunesPart( result ) {

		var scene = result.scene;

		scene.scale.set( SCALE, SCALE, SCALE );
		scene.matrixAutoUpdate = true;

		markColliders( scene );
		showHierarchyNotColliders( scene, true );
		preInitScene( result, shared.renderer );
		
		that.scene.addChild( scene );
		
		if ( scene.collisions ) {
		
			that.scene.collisions.merge( scene.collisions );

		}
		
		return scene;
	};


	
	function getRotation ( x, z ) {

		return Math.round( Math.sin( x * 0.001 ) * Math.cos( z * 0.005 ) * 4 ) * ( Math.PI / 2 );

	};

	function showHierarchyNotColliders( scene, visible ) {

		THREE.SceneUtils.traverseHierarchy( scene, function( node ) { 
			
			if ( ! node.__isCollider ) {

				node.visible = visible; 

			}
			
		} );
		
	};

	function markColliders( scene ) {

		THREE.SceneUtils.traverseHierarchy( scene, function( node ) { 
			
			var colliders = scene.collisions.colliders;

			for( var i = 0; i < colliders.length; i++ ) {

				if ( colliders[ i ].mesh == node ) {
				
					node.__isCollider = true; 

				}

			}
			
		} );
		
	};

};



