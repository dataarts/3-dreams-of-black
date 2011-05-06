var VoxelPainter = function ( camera ) {

	var _size = 50, _color = 0xffffff, _mode = VoxelPainter.MODE_CREATE,
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

	var _geometry = new THREE.Cube( _size, _size, _size );

	// Preview

	var _preview = new THREE.Mesh( _geometry, new THREE.MeshLambertMaterial( { color: _color, opacity: 0, transparent: true } ) );
	_preview.matrixAutoUpdate = false;
	_scene.addObject( _preview );

	//

	addVoxel( new THREE.Vector3() );

	function toGridScale( value ) {

		return Math.round( value / _size );

	}

	function addVoxel( vector ) {

		var x = toGridScale( vector.x ), y = toGridScale( vector.y ), z = toGridScale( vector.z );

		if ( !_object.checkVoxel( x, y, z ) ) {

			_object.addVoxel( x, y, z, _color );

			var voxel = new THREE.Mesh( _geometry, new THREE.MeshLambertMaterial( { color: _color } ) );
			voxel.position.x = x * _size;
			voxel.position.y = y * _size;
			voxel.position.z = z * _size;
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			voxel.update();
			_sceneVoxels.addObject( voxel );

		}

	}

	function removeVoxel( voxel ) {

		var x = toGridScale( voxel.position.x ), y = toGridScale( voxel.position.y ), z = toGridScale( voxel.position.z );

		_object.removeVoxel( x, y, z );

		_sceneVoxels.removeObject( voxel );
		_scene.removeObject( voxel ); // This shouldn't be needed :/

	}

	//

	this.setColor = function ( hex ) {

		_color = hex;
		_preview.materials[ 0 ].color.setHex( _color );

	};

	this.setMode = function ( mode ) {

		_mode = mode;

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

						_preview.materials[ 0 ].opacity = 0.5;

						_collider.position.copy( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.centroid.clone() ).addSelf( _intersectObject.position ) );
						_collider.position.addSelf( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.normal.clone() ) );
						_collider.updateMatrix();
						_collider.update();

						_preview.position.copy( _collider.position );
						_preview.position.x = toGridScale( _preview.position.x ) * _size;
						_preview.position.y = toGridScale( _preview.position.y ) * _size;
						_preview.position.z = toGridScale( _preview.position.z ) * _size;
						_preview.updateMatrix();
						_preview.update();

					} else {

						_preview.materials[ 0 ].opacity = 0;

						_intersectObject = null;
						_intersectFace = null;

					}

				} else {

					_preview.materials[ 0 ].opacity = 0;

					intersects = ray.intersectScene( _sceneCollider );

					if ( _intersectFace && intersects.length > 0 ) {

						var point = intersects[ 0 ].point,
						centroidWorld = _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.centroid.clone() ).addSelf( _intersectObject.position ),
						distance = centroidWorld.distanceTo( point ),
						pointInNormal = centroidWorld.addSelf( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.normal.clone() ).multiplyScalar( distance ) );

						addVoxel( pointInNormal );

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

						removeVoxel( intersects[ 0 ].object );

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
