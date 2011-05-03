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

/*			if( x === 2 && z === 2 ) {
				
				tileRow.push( 4 );					// walk
				
			} else if( x === 3 && z === 1 ) {
				
				tileRow.push( 5 );					// prairie
				
			} else if( x === 2 && z === 0 ) {
				
				tileRow.push( 6 );					// city
				
			} else */{
				
				tileNumber = Math.floor( Math.random() * 3.99999 );
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
	loader.load( "files/models/dunes/D_tile_4.js", tileLoaded );


	//--- functions ---

	//--- walk loaded ---

	function walkLoaded( result ) {

		applyDunesShader( result );
	//	tileMeshes[ 4 ][ 0 ] = addDunesPart( result );

	};


	//--- prairie loaded ---

	function prairieLoaded( result ) {

		applyDunesShader( result );
	//	tileMeshes[ 5 ][ 0 ] = addDunesPart( result );
		
	};
	
	
	//--- city loaded ---

	function cityLoaded( result ) {

		applyDunesShader( result );
	//	tileMeshes[ 6 ][ 0 ] = addDunesPart( result );

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

		tileColliders[ numTilesLoaded ].materials[ 0 ] = new THREE.MeshLambertMaterial( { color: 0xff00ff, opacity: 0.5 } );
		tileColliders[ numTilesLoaded ].visible = true;
		
		that.scene.addChild( tileColliders[ numTilesLoaded ] );
		that.scene.collisions.merge( scene.collisions );

		
		// duplicate gfx
		
		for( var i = 0; i < numTileInstances[ numTilesLoaded ]; i++ ) {
			
			tileMeshes[ numTilesLoaded ].push( duplicateMesh( scene ));

		}

		numTilesLoaded++;

	};
	
	
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
		var position = camera.matrixWorld.getPosition();//.addSelf( camera.matrixWorld.getColumnZ().multiplyScalar( -TILE_SIZE * 1.5 ));
		var cameraPositionX = Math.floor( position.x / TILE_SIZE );
		var cameraPositionZ = Math.floor( position.z / TILE_SIZE );
		var cameraTileGridX = ( cameraPositionX + halfGridSize ) % tileGridSize;
		var cameraTileGridZ = ( cameraPositionZ + halfGridSize ) % tileGridSize;

		while( cameraTileGridX < 0 ) cameraTileGridX += tileGridSize;
		while( cameraTileGridZ < 0 ) cameraTileGridZ += tileGridSize;

		shared.logger.log( "X: " + cameraTileGridX );
		shared.logger.log( "Z: " + cameraTileGridZ );

		if( cameraTileGridX !== lastCameraTileGridPosition.x || cameraTileGridZ !== lastCameraTileGridPosition.z ) {
			
			lastCameraTileGridPosition.x = cameraTileGridX;
			lastCameraTileGridPosition.z = cameraTileGridZ;
			
			var x, z, tx, tz, px, pz, distance, tile, tileMesh;
			var currentNumberUsed = [ 0, 0, 0, 0, 0, 0, 0 ];
			var currentColliderDistances = [ -1, -1, -1, -1 ];
			
			for( z = -halfGridSize; z < halfGridSize + 1; z++ ) {
				
				for( x = -halfGridSize; x < halfGridSize + 1; x++ ) {
					
					tx = ( cameraTileGridX + x ) % tileGridSize;
					tz = ( cameraTileGridZ + z ) % tileGridSize;
					
					while( tx < 0 ) tx += tileGridSize;
					while( tz < 0 ) tz += tileGridSize;
					
					tile = tileGrid[ tz ][ tx ];
					
					tileMesh = tileMeshes[ tile ][ currentNumberUsed[ tile ]++ ];

					px = ( cameraPositionX + x ) * TILE_SIZE;
					pz = ( cameraPositionZ + z ) * TILE_SIZE;
					
					if( tileMesh ) {
						
						tileMesh.position.x = px; 
						tileMesh.position.z = pz;
						tileMesh.rotation.z = getRotation( px, pz );
												
					}
					
					// set colliders around the user
					
					if( tile < 4 ) {
						
						tx = px - cameraPositionX * TILE_SIZE;
						tz = pz - cameraPositionZ * TILE_SIZE;
						
						distance = tx * tx + tz * tz;
						
						if( currentColliderDistances[ tile ] === -1 || distance < currentColliderDistances[ tile ] ) {

							currentColliderDistances[ tile ] = distance;
							
							tileMesh = tileColliders[ tile ];
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



