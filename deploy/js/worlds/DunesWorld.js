var DunesWorld = function ( shared ) {

	// vars

	var ENABLE_WATERFALLS = true;

	var that = this;
	var SCALE = 0.20;
	var TILE_SIZE = 29990 * SCALE;
  	var MAX_UGC_PAGES = 2;
	var scenePrairie, sceneCity, sceneWalk;

	that.scale = SCALE;
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

	var flares = initLensFlares( new THREE.Vector3( -5500, -2500, -10000 ), 0, 0 );
	that.scene.addChild( flares );

	that.lensFlareRotate = flares;
	that.lensFlare = flares.children[ 0 ];

	// init shader

	DunesShader.init();


	// waterfall

	if ( ENABLE_WATERFALLS ) {

		var waterfallPrairiePosition = new THREE.Object3D();
		var waterfallCityPosition = new THREE.Object3D();
		var waterfallPrairie = WaterfallShader.createWaterfall( 0 );
		var waterfallCity = WaterfallShader.createWaterfall( 1 );

		that.scene.addChild( waterfallPrairie );
		that.scene.addChild( waterfallCity );

	}

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

				tileRow.push( 2 );										// flat for first UGC
				numTileInstances[ 2 ]++;

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

	var loader = new THREE.SceneLoaderAjax();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( "/files/models/dunes/D_tile_walk.js", walkLoaded );
	loader.load( "/files/models/dunes/D_tile_prairie.js", prairieLoaded );
	loader.load( "/files/models/dunes/D_tile_city.js", cityLoaded );

	loader.load( "/files/models/dunes/D_tile_1.js", tile0Loaded );
	loader.load( "/files/models/dunes/D_tile_2.js", tile1Loaded );
	loader.load( "/files/models/dunes/D_tile_3.js", tile2Loaded );
	loader.load( "/files/models/dunes/D_tile_4.js", tile3Loaded );


	var loader = new THREE.JSONLoaderAjax();
	loader.load( { model: "/files/models/dunes/D_tile_1_clouds.js", callback: function( geo ) { addClouds( geo, 100 ) } } );

	function addClouds( geometry, n ) {

		var material = new THREE.MeshFaceMaterial();
		//var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );

		var x, y, z;

		for ( var i = 0; i < n; i++ ) {

			var model = new THREE.Mesh( geometry, material );


			x = 150000 * ( Math.random() - 0.5 );
			y = 3000;
			z = 150000 * ( Math.random() - 0.5 );

			model.scale.set( SCALE, SCALE, SCALE );
			model.position.set( x, y, z );
			model.updateMatrix();
			model.matrixAutoUpdate = false;

			applyCloudsShader( model, CloudsShader );

			that.scene.addChild( model );

		}

	};

	// create UGC handler

	var ugcHandler = new UgcHandler();
	var ugcPageIndex = 0;
	var loadedUGC = [];
	var newUgcLoaded = false;
	var loadingUgc = false;
	var ugcOccupiedTiles = {};
	var ugcTileLoaded = {};
	var ugcCollider = new THREE.SphereCollider( new THREE.Vector3( 0, -5000, 0 ), 1 );
	var ugcTileDisplacement = [

		{ x: -1, z: -1 },		// -pi
		{ x: -1, z: -1 },
		{ x: 0, z: 1 },
		{ x: 0, z: 1 },			// 0
		{ x: 1, z: 1 },
		{ x: 1, z: 1 },
		{ x: 1, z: -1 },
		{ x: 1, z: -1 }

	];

	var ugcFirstThreePositions = [ new THREE.Vector3( TILE_SIZE * 0.15, -1000, -TILE_SIZE * 1.25 ),
								   new THREE.Vector3( TILE_SIZE, -1000, -TILE_SIZE ) ];

  	var ugcFirstThreePositionsSky = [ new THREE.Vector3( TILE_SIZE * 0.15, 10000, -TILE_SIZE * 1.25 ),
    								  new THREE.Vector3( TILE_SIZE, 10000, -TILE_SIZE ) ];


	that.scene.collisions.colliders.push( ugcCollider );


	//--- update ugc ---

	function updateUgc( camera ) {

		// find closest to place physics
		// make new ones pop up through the ground

		var closestDistance = 99999999999, tempDistance, closestUgc = undefined;
		var cameraPosition = camera.matrixWorld.getPosition();
		var camX = cameraPosition.x;
		var camZ = cameraPosition.z;
		var u, ul = loadedUGC.length;
		var ugc, ugcPos, dx, dz;

		for( u = 0; u < ul; u++ ) {

			ugc = loadedUGC[ u ];

			if( ugc.visible === true && ugc.placedOnGrid) {

				//ugcPos = ugc.position;

				//dx = ugcPos.x - camX;
				//dz = ugcPos.z - camZ;

				//tempDistance = Math.min( closestDistance, dx * dx + dz * dz );

				//if( tempDistance < closestDistance ) {

					//closestDistance = tempDistance;
					//closestUgc = ugc;

				//}


				// move up

          		ugc.position.y += ( ugc.wantedY - ugc.position.y ) * 0.05;

			}

		}


		// set physics on closest ugc

		if( closestUgc !== undefined ) {

			ugcCollider.center.copy( closestUgc.matrixWorld.getPosition());
			ugcCollider.radius   = closestUgc.boundRadius;
			ugcCollider.radiusSq = ugcCollider.radius * ugcCollider.radius;

		}


		// check if we've loaded on this tile ( * 2 for every second tile )

		var cameraTileX = Math.floor( cameraPosition.x / ( TILE_SIZE * 3 ));
		var cameraTileZ = Math.floor( cameraPosition.z / ( TILE_SIZE * 3 ));

		if( !ugcTileLoaded[ cameraTileX + " " + cameraTileZ ] ) {

			ugcTileLoaded[ cameraTileX + " " + cameraTileZ ] = true;
			loadUgc();

		}



		// need to place any new?

		if( newUgcLoaded ) {

			newUgcLoaded = false;

			cameraTileX = Math.floor( cameraPosition.x / TILE_SIZE );
			cameraTileZ = Math.floor( cameraPosition.z / TILE_SIZE );

			var tx, tz;
			var txTemp, tzTemp;
			var c, tileCollider;
			var d, dl = ugcTileDisplacement.length;

			var cameraDirection = camera.matrixWorld.getColumnZ().negate();
			var tileDisplacementIndex = 3 + Math.ceil( 3 * Math.atan2( cameraDirection.x, cameraDirection.z ) / Math.PI );
			if( tileDisplacementIndex < 0 ) tileDisplacementIndex = 0;


			// loop throug all loaded ugc

			for( u = 0; u < ul; u++ ) {

				ugc = loadedUGC[ u ];

				// place?

				if( !ugc.placedOnGrid ) {

					// first three have special treatment

          			var firstPos = ugcFirstThreePositions;

          			if( ugc.category === 'sky' ) {

            			firstPos = ugcFirstThreePositionsSky;

         	 		}

					if( firstPos.length ) {

						ugc.position.copy( firstPos.shift() );
						ugc.position.x += Math.random() * 200 - 100;
						ugc.position.z += Math.random() * 200 - 100;
						ugc.rotation.set( Math.random() * 0.03, Math.random() * Math.PI, Math.random() * 0.03 );

						ugc.visible = true;
						ugc.placedOnGrid = true;

						if( ugc.category === 'sky' ) {

						  ugc.wantedY = 2500;

						} else {

						  ugc.wantedY = -5;

                        }

						that.scene.addChild( ugc );

						tx = Math.floor( ugc.position.x / TILE_SIZE );
						tz = Math.floor( ugc.position.z / TILE_SIZE );

						ugcOccupiedTiles[ tx + " " + tz + " " + ugc.category ] = true;

					} else {

						// try find placement

						for( d = 0; d < dl; d++ ) {

							tx = txTemp = cameraTileX + ugcTileDisplacement[ tileDisplacementIndex ].x;
							tz = tzTemp = cameraTileZ + ugcTileDisplacement[ tileDisplacementIndex ].z;

							txTemp %= tileGridSize;
							tzTemp %= tileGridSize;

							while( txTemp < 0 ) txTemp += tileGridSize;
							while( tzTemp < 0 ) tzTemp += tileGridSize;

							if( tileGrid[ tzTemp ][ txTemp ] < 4 ) {		// only place on tiles, not praire/city/walk

								if( !ugcOccupiedTiles[ tx + " " + tz + " " + ugc.category ] ) {	// already occupied?

									ugcOccupiedTiles[ tx + " " + tz + " " + ugc.category ] = true;
									break;

								}

							}

							tileDisplacementIndex++;
							tileDisplacementIndex %= ugcTileDisplacement.length;
						}


						// found spot, place

						if( d !== dl ) {

							ugc.position.set( tx * TILE_SIZE, 0, tz * TILE_SIZE );

              				if( ugc.category === 'sky' ) {

				                ugc.position.x += Math.random() * 200 - 100;
            				    ugc.position.z += Math.random() * 200 - 100;
            				    ugc.wantedY = 2500 + Math.random() * 1000 - 500;
            				    ugc.position.y = 10000;

              				} else {

              				  ugc.wantedY = -5;

                            }

							ugc.rotation.set( Math.random() * 0.03, Math.random() * Math.PI, Math.random() * 0.03 );

							ugc.visible = true;
							ugc.placedOnGrid = true;
             				ugc.updateMatrix();

							that.scene.addChild( ugc );

						}

					}

				}

			}

		}

	}


	//--- load ugc ---

	function loadUgc() {

		if( !loadingUgc ) {

			loadingUgc = true;

	      	if( ugcPageIndex < MAX_UGC_PAGES ) {

	        	ugcHandler.getLatestUGOs( onLoadUgc, ugcPageIndex );
	        	ugcPageIndex++;

	      	}

		}

	}


	//--- on load ugc ---

	function onLoadUgc( objects ) {

		loadingUgc = false;

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			var object = new UgcObject( JSON.parse(objects[ i ].data) );
			var category = objects[ i ].category;

			if ( ! object.isEmpty() ) {

				var mesh = object.getMesh();
				mesh.category = category;
				mesh.visible = false;
				loadedUGC.push( mesh );

				newUgcLoaded = true;

			}

		}

	}




	//--- walk loaded ---

	function walkLoaded( result ) {

		applyDunesShader( result );
		tileMeshes[ 4 ][ 0 ] = addDunesPart( result );

		that.scene.update( undefined, true );

	}


	//--- prairie loaded ---

	function prairieLoaded( result ) {

		applyDunesShader( result, { "D_tile_Prairie_Collis": true, "D_tile_Prairie_Island": true }, { "D_tile_Prairie_Is.000": -0.05 }, { "D_tile_Prairie_Water": 0.65 } );
		tileMeshes[ 5 ][ 0 ] = addDunesPart( result );

		if ( ENABLE_WATERFALLS ) {

			waterfallPrairiePosition.position.set( -5165.693848, 1024.796875, 18247.871094 );
			result.scene.addChild( waterfallPrairiePosition );

		}

		addInfluenceSphere( { name: "prairiePortal", object: result.empties.Prairie_Portal, radius: 2000, type: 0, destination: "prairie" } );
		addInfluenceSphere( { name: "prairieSlowDown", object: result.empties.Prairie_Center, radius: 10000, type: 1 } );

		that.scene.update( undefined, true );

	}


	//--- city loaded ---

	function cityLoaded( result ) {

		applyDunesShader( result, { "D_tile_City_Collision":true, "D_tile_City_Island_Co": true }, { "D_tile_City_Island": -1.0 },  { "D_tile_City_Water": 0.65 } );
		tileMeshes[ 6 ][ 0 ] = addDunesPart( result );


		if ( ENABLE_WATERFALLS ) {

			waterfallCityPosition.position.set( 750.267456, 709.979614, 29121.154297 );
			result.scene.addChild( waterfallCityPosition );

		}

		addInfluenceSphere( { name: "cityPortal", object: result.empties.City_Portal, radius: 3500, type: 0, destination: "city" } );
		addInfluenceSphere( { name: "citySlowDown", object: result.empties.City_Center, radius: 12000, type: 1 } );

		that.scene.update( undefined, true );

	}


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

		UgcShader.update( that.skyWhite );
		updateUgc( camera );
		that.checkInfluenceSpheres( camera, portalsActive );
		that.updateTiles( camera );
		updateDunesShader( delta, that.skyWhite );

		if ( ENABLE_WATERFALLS ) {

			waterfallPrairie.position.copy( waterfallPrairiePosition.matrixWorld.getPosition());
			waterfallCity.position.copy( waterfallCityPosition.matrixWorld.getPosition());
			WaterfallShader.update( delta, that.skyWhite );

		}

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

						shared.signals.showexploration.dispatch();
						shared.signals.startexploration.dispatch( influenceSphere.destination, shared.isExperience );

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

					if( tile !== 6 ) {

						tileMesh.rotation.z = getRotation( px, pz );

					} else {

						tileMesh.rotation.z = 1.5 * Math.PI;

					}

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

	}

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
				result.objects[ o ].position.z += 4000;
				result.objects[ o ].updateMatrix();
				result.objects[ o ].matrixAutoUpdate = false;

			}

		}

		return scene;

	}


	function getRotation ( x, z ) {

		return Math.round( Math.sin( x * 0.001 ) * Math.cos( z * 0.005 ) * 4 ) * ( Math.PI / 2 );

	}

	function showHierarchyNotColliders( scene, visible ) {

		THREE.SceneUtils.traverseHierarchy( scene, function( node ) {

			if ( ! node.__isCollider ) {

				node.visible = visible;

			}

		} );

	}

	function markColliders( scene ) {

		THREE.SceneUtils.traverseHierarchy( scene, function( node ) {

			var colliders = scene.collisions.colliders;

			for( var i = 0; i < colliders.length; i++ ) {

				if ( colliders[ i ].mesh == node ) {

					node.__isCollider = true;

				}

			}

		} );

	}

	function addInfluenceSphere( info ) {

		info.state = 0;
		info.radius *= SCALE;

		shared.influenceSpheres.push( info );

		if( info.type === 0 ) {

			that.portals.push( info );

		}

	}

};



