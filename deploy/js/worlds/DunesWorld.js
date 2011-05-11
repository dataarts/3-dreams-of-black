var DunesWorld = function ( shared ) {

	// vars

	var that = this;
	var	SCALE = 0.20;
	var TILE_SIZE = 29990 * SCALE;
	var scenePrairie, sceneCity, sceneWalk;

	that.portals = [];
	shared.influenceSpheres = [];
	shared.cameraSlowDown = false;

	// create scene

	that.scene = new THREE.Scene();

	that.scene.collisions = new THREE.CollisionSystem();

	that.scene.fog = new THREE.FogExp2( 0xffffff, 0.00000275 );
	that.scene.fog.color.setHSV( 0.576, 0.382, 0.9 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );

	that.ambient = ambient;
	that.directionalLight1 = directionalLight1;
	that.directionalLight2 = directionalLight2;
	that.skyWhite = 1;

	ambient.color.setHSV( 0, 0, 0.1 );

	directionalLight1.position.set( 0.81, 0.31, -0.5 );
	directionalLight1.color.setHSV( 0.088, 0, 1 );

	directionalLight2.position.set( 0.094, 0.98, 0.158 );
	directionalLight2.color.setHSV( 0, 0, 0.86 );

	that.scene.addLight( ambient );
	that.scene.addLight( directionalLight1 );
	that.scene.addLight( directionalLight2 );

	// Lens flares

	that.lensFlare = null;
	that.lensFlareRotate = null;

	var flares = initLensFlares( new THREE.Vector3( -5500, 3500, -10000 ), 0, 0 );		
	that.scene.addChild( flares );
	
	that.lensFlareRotate = flares;
	that.lensFlare = flares.children[ 0 ];

	// init shader
	
	DunesShader.init();


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

			} else if( x === 3 && z === 4 ) {

				tileRow.push( 5 );										// prairie

			} else if( x === 1 && z === 3 ) {

				tileRow.push( 6 );										// city

			} else if( x === 4 && z === 4 ) {							

				tileRow.push( 0 );										// mountain
				numTileInstances[ 0 ]++;

			} else if( x === 0 && z === 4 ) {

				tileRow.push( 0 );										// mountain
				numTileInstances[ 0 ]++;

			} else if( x === 1 && z === 4 ) {							

				tileRow.push( 0 );										// mountain
				numTileInstances[ 0 ]++;

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

	loader.load( "/files/models/dunes/D_tile_walk.js", walkLoaded );
	loader.load( "/files/models/dunes/D_tile_prairie.js", prairieLoaded );
	loader.load( "/files/models/dunes/D_tile_city.js", cityLoaded );

	loader.load( "/files/models/dunes/D_tile_1.js", tile0Loaded );
	loader.load( "/files/models/dunes/D_tile_2.js", tile1Loaded );
	loader.load( "/files/models/dunes/D_tile_3.js", tile2Loaded );
	loader.load( "/files/models/dunes/D_tile_4.js", tile3Loaded );


	// UGC

	var ugcHandler = new UgcHandler();
	ugcHandler.getLatestUGOs( function ( objects ) {

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			var object = new UgcObject( objects[ i ] );

			if ( ! object.isEmpty() ) {

				var mesh = object.getMesh();

				mesh.position.x = Math.random() * 10000 - 5000;
				mesh.position.z = Math.random() * 10000 - 5000;

				that.scene.addObject( mesh );

			}

		}

	} );


	//--- walk loaded ---

	function walkLoaded( result ) {

		applyDunesShader( result );
		tileMeshes[ 4 ][ 0 ] = addDunesPart( result );

		that.scene.update( undefined, true );

	};


	//--- prairie loaded ---

	function prairieLoaded( result ) {

		applyDunesShader( result, { "D_tile_Prairie_Collis": true, "D_tile_Prairie_Island": true }, { "D_tile_Prairie_Is.000": -0.05 }, { "D_tile_Prairie_Water": 0.65 } );
		tileMeshes[ 5 ][ 0 ] = addDunesPart( result );
		
		addInfluenceSphere( { name: "prairiePortal", object: result.empties.Prairie_Portal, radius: 2000, type: 0, destination: "prairie" } );
		addInfluenceSphere( { name: "prairieSlowDown", object: result.empties.Prairie_Center, radius: 8000, type: 1 } );

		that.scene.update( undefined, true );

	};


	//--- city loaded ---

	function cityLoaded( result ) {

		applyDunesShader( result, { "D_tile_City_Collision":true, "D_tile_City_Island_Co": true }, { "D_tile_City_Island": -1.0 },  { "D_tile_City_Water": 0.65 } );
		tileMeshes[ 6 ][ 0 ] = addDunesPart( result );

		addInfluenceSphere( { name: "cityPortal", object: result.empties.City_Portal, radius: 2500, type: 0, destination: "city" } );
		addInfluenceSphere( { name: "citySlowDown", object: result.empties.City_Center, radius: 10000, type: 1 } );

		that.scene.update( undefined, true );

	};


	//--- tile loaded ---

	function tile0Loaded( result ) { tileLoaded( result, 0 ); }
	function tile1Loaded( result ) { tileLoaded( result, 1 ); }
	function tile2Loaded( result ) { tileLoaded( result, 2 ); }
	function tile3Loaded( result ) { tileLoaded( result, 3 ); }

	function tileLoaded( result, tileNumber ) {

		var scene = result.scene;

		applyDunesShader( result );
		markColliders( scene );
		showHierarchyNotColliders( scene, true );

		// get collider

		tileColliders[ tileNumber ] = scene.collisions.colliders[ 0 ].mesh;
		tileColliders[ tileNumber ].rotation.x = -90 * Math.PI / 180;
		tileColliders[ tileNumber ].scale.set( SCALE, SCALE, SCALE );

		// shows collision meshes
		//tileColliders[ tileNumber ].materials[ 0 ] = new THREE.MeshLambertMaterial( { color: 0xff00ff, opacity: 0.5 });
		//tileColliders[ tileNumber ].visible = true;

		that.scene.addChild( tileColliders[ tileNumber ] );
		that.scene.collisions.merge( scene.collisions );


		// duplicate gfx

		for( var i = 0; i < numTileInstances[ tileNumber ]; i++ ) {

			tileMeshes[ tileNumber ].push( duplicateMesh( scene ));

		}

		//numTilesLoaded++;

		that.scene.update( undefined, true );

	};


	//--- udpate ---

	that.update = function ( delta, camera, portalsActive ) {

		that.checkInfluenceSpheres( camera, portalsActive );
		that.updateTiles( camera ); 
		updateDunesShader( delta, that.skyWhite );

		skydome.position.copy( camera.matrixWorld.getPosition() );
		skydome.updateMatrix();

		that.lensFlareRotate.position.copy( camera.matrixWorld.getPosition() );
		that.lensFlareRotate.updateMatrix();

	};


	//--- check influence spheres ---

	that.checkInfluenceSpheres = function( camera, portalsActive ) {

		var i, il, distance, influenceSphere;

		var currentPosition = camera.matrixWorld.getPosition();

		for( i = 0, il = shared.influenceSpheres.length; i < il; i ++ ) {

			influenceSphere = shared.influenceSpheres[ i ];
			distance = influenceSphere.object.matrixWorld.getPosition().distanceTo( currentPosition );
			influenceSphere.currentDistance = distance;

			if( distance < influenceSphere.radius ) {

				// portal

				if( influenceSphere.type === 0 && influenceSphere.state === 0 ) {

					influenceSphere.state = 1;

					if( portalsActive ) {

						shared.signals.startexploration.dispatch( influenceSphere.destination );

					}

				// slow down

				} else if( influenceSphere.type == 1 ) {

					shared.cameraSlowDown = true;

				}

			} else {

				influenceSphere.state = 0;
				shared.cameraSlowDown = false;

			}

		}

	};


	//--- update tiles ---

	that.updateTiles = function( camera ) {

		var halfGridSize = Math.floor( tileGridSize / 2 );
		var gridCenterPosition = camera.matrixWorld.getPosition();
		var camX = gridCenterPosition.x;
		var camZ = gridCenterPosition.z;
		
		gridCenterPosition.addSelf( camera.matrixWorld.getColumnZ().multiplyScalar( -TILE_SIZE * 1.5 ) );
		gridCenterPosition.x = Math.floor( gridCenterPosition.x / TILE_SIZE );
		gridCenterPosition.z = Math.floor( gridCenterPosition.z / TILE_SIZE );

		var cameraTileGridX = gridCenterPosition.x % tileGridSize;
		var cameraTileGridZ = gridCenterPosition.z % tileGridSize;

		while( cameraTileGridX < 0 ) cameraTileGridX += tileGridSize;
		while( cameraTileGridZ < 0 ) cameraTileGridZ += tileGridSize;

		var x, z, tx, tz, px, pz, distance, tile, tileMesh;
		var currentNumberUsed = [ 0, 0, 0, 0, 0, 0, 0 ];
		var currentColliderDistances = [ -1, -1, -1, -1 ];

		for( z = -halfGridSize; z < halfGridSize + 1; z++ ) {

			for( x = -halfGridSize; x < halfGridSize + 1; x++ ) {

				px = ( gridCenterPosition.x + x ) * TILE_SIZE;
				pz = ( gridCenterPosition.z + z ) * TILE_SIZE;

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

	};


	//--- helpers ---

	//--- duplicate mesh (duplicates the mesh of the tile) ---

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

		for ( var o in result.objects ) {

			if ( o.toLowerCase().indexOf( "cloud" ) >= 0 ) {

				applyCloudsShader( result.objects[ o ], CloudsShader );
				result.objects[ o ].position.z += 8000;
				result.objects[ o ].updateMatrix();

			}

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

	function addInfluenceSphere( info ) {

		info.state = 0;
		info.radius *= SCALE;

		shared.influenceSpheres.push( info );

		if( info.type === 0 ) {

			that.portals.push( info );

		}

	}

};



