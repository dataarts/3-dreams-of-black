var VoxelPainter = function ( camera ) {

	var UNIT_SIZE = 50, _size = 1, _color = 0xffffff,
	_mode = VoxelPainter.MODE_CREATE,
	_symmetry = false,
	_object = new UgcObject();

	var _intersectPoint, _intersectFace, _intersectObject,
	_intersectEraseObject;

	// Scene

	var _scene = new THREE.Scene();

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );

	ambient.color.setHSV( 0, 0, 0.1 );

	directionalLight1.position.set( 0.8085776615544399,  0.30962281305702444,  -0.500335766130914 );
	directionalLight1.color.setHSV( 0.08823529411764706,  0,  1 );

	directionalLight2.position.set( 0.09386404300915006,  0.9829903100365339,  0.15785940518149455 );
	directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 );

	_scene.addLight( ambient );
	_scene.addLight( directionalLight1 );
	_scene.addLight( directionalLight2 );

	// Colliders

	var _sceneCollider = new THREE.Scene();
	_scene.addObject( _sceneCollider );

	var _collider = new THREE.Object3D();
	_collider.visible = false;

	var _geometry = new THREE.Plane( 2000, 2000, 16, 16 );
	var _material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true, wireframe: true } );

	_plane = new THREE.Mesh( _geometry, _material );
	_plane.doubleSided = true;
	_plane.visible = _collider.visible;
	_collider.addChild( _plane );

	_plane = new THREE.Mesh( _geometry, _material );
	_plane.rotation.y = - 90 * Math.PI / 180;
	_plane.doubleSided = true;
	_plane.visible = _collider.visible;
	_collider.addChild( _plane );

	_collider.matrixAutoUpdate = false;
	_sceneCollider.addObject( _collider );

	// Mouse projection

	var projector, mouse2D, mouse3D, ray;

	projector = new THREE.Projector();

	mouse2D = new THREE.Vector3( 0, 0, 0.5 );
	ray = new THREE.Ray( camera.position, null );

	// Voxels

	var _sceneVoxels = new THREE.Scene();
	_scene.addObject( _sceneVoxels );

	var _ground = new THREE.Mesh( new THREE.Plane( 2000, 2000, 40, 40 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.1, transparency: true, wireframe: true } ) );
	_ground.position.x = - 25;
	_ground.position.y = - 25;
	_ground.position.z = - 25;
	_ground.rotation.x = - 90 * Math.PI / 180;
	_sceneVoxels.addObject( _ground );

	// Brushes

	var _brushes = [], _brushGeometries = [], _brushMaterial = [ new THREE.MeshLambertMaterial( { color: _color, opacity: 0.25, transparent: true } ), new THREE.MeshBasicMaterial( { color: _color, opacity: 0.75, wireframe: true, transparent: true } ) ];

	_brushGeometries[ 1 ] = new THREE.Cube( UNIT_SIZE, UNIT_SIZE, UNIT_SIZE );
	_brushGeometries[ 3 ] = new THREE.Cube( UNIT_SIZE * 3, UNIT_SIZE * 3, UNIT_SIZE * 3, 3, 3, 3 );
	_brushGeometries[ 5 ] = new THREE.Cube( UNIT_SIZE * 5, UNIT_SIZE * 5, UNIT_SIZE * 5, 5, 5, 5 );

	_brushes[ 0 ] = new THREE.Mesh( _brushGeometries[ _size ], _brushMaterial );
	_scene.addObject( _brushes[ 0 ] );

	_brushes[ 1 ] = new THREE.Mesh( _brushGeometries[ _size ], _brushMaterial );
	_scene.addObject( _brushes[ 1 ] );

	//

	// addVoxel( new THREE.Vector3() );

	function toGridScale( value ) {

		return Math.round( value / UNIT_SIZE );

	}

	function addVoxel( vector ) {

		var x = toGridScale( vector.x ), y = toGridScale( vector.y ), z = toGridScale( vector.z );

		if ( !_object.checkVoxel( x, y, z ) ) {

			_object.addVoxel( x, y, z, _color );

			var voxel = new THREE.Mesh( _brushGeometries[ _size ], new THREE.MeshLambertMaterial( { color: _color } ) );
			voxel.position.x = x * UNIT_SIZE;
			voxel.position.y = y * UNIT_SIZE;
			voxel.position.z = z * UNIT_SIZE;
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			voxel.update();
			_sceneVoxels.addObject( voxel );

		}

	}

	function deleteVoxel( voxel ) {

		var x = toGridScale( voxel.position.x ), y = toGridScale( voxel.position.y ), z = toGridScale( voxel.position.z );

		_object.deleteVoxel( x, y, z );

		_sceneVoxels.removeObject( voxel );
		_scene.removeObject( voxel ); // This shouldn't be needed :/

	}

	//

	this.setMode = function ( mode ) {

		_mode = mode;

	};

	this.setColor = function ( hex ) {

		_color = hex;
		_brushMaterial[ 0 ].color.setHex( _color );
		_brushMaterial[ 1 ].color.setHex( _color );

	};

	this.setSize = function ( size ) {

		// _brushes[ 0 ].geometry = _brushGeometries[ size ];
		// _brushes[ 1 ].geometry = _brushGeometries[ size ];

		// _brushes[ 0 ].scale.set( _size, _size, _size );
		// _brushes[ 1 ].scale.set( _size, _size, _size );

	};

	this.setSymmetry = function ( bool ) {

		_symmetry = bool;

	};

	this.moveMouse = function ( x, y ) {

		mouse2D.x = x * 2 - 1;
		mouse2D.y = - y * 2 + 1;

		mouse3D = projector.unprojectVector( mouse2D.clone(), camera );
		ray.direction = mouse3D.subSelf( camera.position ).normalize();


	};

	this.update = function ( mousedown ) {

		var intersects;

		// Restore opacity of last intesected object.
		if ( _intersectEraseObject ) _intersectEraseObject.materials[ 0 ].opacity = 1;

		switch ( _mode ) {

			case VoxelPainter.MODE_CREATE:

				intersects = ray.intersectScene( _sceneVoxels );

				if ( ! mousedown ) {

					if ( intersects.length > 0 ) {

						_intersectPoint = intersects[ 0 ].point;
						_intersectObject = intersects[ 0 ].object;
						_intersectFace = intersects[ 0 ].face;

						_collider.position.copy( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.centroid.clone() ).addSelf( _intersectObject.position ) );
						_collider.position.addSelf( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.normal.clone() ).multiplyScalar( UNIT_SIZE * _size * 0.5 ) );
						_collider.position.x = toGridScale( _collider.position.x ) * UNIT_SIZE;
						_collider.position.y = toGridScale( _collider.position.y ) * UNIT_SIZE;
						_collider.position.z = toGridScale( _collider.position.z ) * UNIT_SIZE;
						_collider.updateMatrix();
						_collider.update();

						_brushes[ 0 ].position.copy( _collider.position );
						_brushes[ 0 ].visible = true;

						if ( _symmetry ) {

							_brushes[ 1 ].position.copy( _brushes[ 0 ].position );
							_brushes[ 1 ].position.x = -_brushes[ 1 ].position.x;
							_brushes[ 1 ].visible = true;

						}

					} else {

						_intersectObject = null;
						_intersectFace = null;

						_brushes[ 0 ].visible = false;
						_brushes[ 1 ].visible = false;

					}

				} else {

					_brushes[ 0 ].visible = false;
					_brushes[ 1 ].visible = false;

					intersects = ray.intersectScene( _sceneCollider );

					if ( _intersectFace && intersects.length > 0 ) {

						var point = intersects[ 0 ].point,
						centroidWorld = _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.centroid.clone() ).addSelf( _intersectObject.position ),
						distance = centroidWorld.distanceTo( point ),
						pointInNormal = centroidWorld.addSelf( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.normal.clone() ).multiplyScalar( distance ) );

						addVoxel( pointInNormal );

						if ( _symmetry ) {

							pointInNormal.x = - pointInNormal.x;
							addVoxel( pointInNormal );

						}

					}

				}

			break;

			case VoxelPainter.MODE_ERASE:

				intersects = ray.intersectScene( _sceneVoxels );

				if ( intersects.length > 0 && intersects[ 0 ].object != _ground ) {

					if ( ! mousedown ) {

						_intersectEraseObject = intersects[ 0 ].object;
						_intersectEraseObject.materials[ 0 ].opacity = 0.5;

					} else {

						deleteVoxel( intersects[ 0 ].object );

					}

				}

			break;

		}

	};

	this.getScene = function () {

		return _scene;

	};

	this.getObject = function () {

		return _object;

	};

}

VoxelPainter.MODE_CREATE = 'VoxelPainter.MODE_CREATE';
VoxelPainter.MODE_ERASE = 'VoxelPainter.MODE_ERASE';
