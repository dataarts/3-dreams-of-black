var VoxelPainter = function () {

	var _intersectedFace, _intersectedObject;

	// Scene

	var _scene = new THREE.Scene();

	var _light1 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	_light1.position.set( 0.5, 0.75, 1 );
	_light1.color.setHSV( 0, 0, 1 );
	_scene.addLight( _light1 );

	var _light2 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	_light2.position.set( - 0.5, - 0.75, - 1 );
	_light2.color.setHSV( 0, 0, 0.306 );
	_scene.addLight( _light2 );

	var _ground = new THREE.Mesh( new THREE.Plane( 2000, 2000, 40, 40 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2, transparency: true, wireframe: true } ) );
	_ground.position.x = - 25;
	_ground.position.y = - 25;
	_ground.position.z = - 25;
	_ground.rotation.x = - 90 * Math.PI / 180;
	_scene.addObject( _ground );

	// Colliders

	var _sceneCollider = new THREE.Scene();
	_scene.addObject( _sceneCollider );

	var _collider = new THREE.Object3D();
	_collider.visible = false;

	var _geometry = new THREE.Plane( 2000, 2000, 16, 16 );
	var _material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2, transparency: true, wireframe: true } );

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

	// Voxels

	var _sceneVoxels = new THREE.Scene();
	_scene.addObject( _sceneVoxels );

	var _mode = VoxelPainter.MODE_IDLE, _size = 50, _grid = {};

	var _geometry = new THREE.Cube( _size, _size, _size );
	var _material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

	//

	addVoxel( new THREE.Vector3() );

	function addVoxel( vector ) {

		var x = Math.round( vector.x / _size );
		var y = Math.round( vector.y / _size );
		var z = Math.round( vector.z / _size );

		if ( _grid[ x + "." + y + "." + z ] == null ) {

			var voxel = new THREE.Mesh( _geometry, _material );
			voxel.position.x = x * _size;
			voxel.position.y = y * _size;
			voxel.position.z = z * _size;
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			voxel.update();
			_sceneVoxels.addObject( voxel );

			_grid[ x + "." + y + "." + z ] = voxel;

		}

	}

	function removeVoxel( voxel ) {

		var x = Math.round( voxel.position.x / _size );
		var y = Math.round( voxel.position.y / _size );
		var z = Math.round( voxel.position.z / _size );

		_grid[ x + "." + y + "." + z ] = null;

		_sceneVoxels.removeObject( voxel );
		_scene.removeObject( voxel ); // This shouldn't be needed :/

	}

	//

	this.setMode = function ( mode ) {

		_mode = mode;

	};

	this.process = function ( ray ) {

		var intersects;

		switch ( _mode ) {

			case VoxelPainter.MODE_IDLE:

				intersects = ray.intersectScene( _sceneVoxels );

				if ( intersects.length > 0 ) {

					_collider.position.copy( intersects[ 0 ].point );
					_collider.updateMatrix();
					_collider.update();

					_intersectedObject = intersects[ 0 ].object;
					_intersectedFace = intersects[ 0 ].face;

				} else {

					_intersectedObject = null;
					_intersectedFace = null;

				}

			break;

			case VoxelPainter.MODE_DRAW:

				intersects = ray.intersectScene( _sceneCollider );

				if ( _intersectedFace && intersects.length > 0 ) {

					var face = _intersectedFace,
					point = intersects[ 0 ].point,
					centroidWorld = face.centroid.clone().addSelf( _intersectedObject.position ),
					distance = centroidWorld.distanceTo( point ),
					pointInNormal = centroidWorld.addSelf( _intersectedObject.matrixRotationWorld.multiplyVector3( face.normal.clone() ).multiplyScalar( distance ) );

					addVoxel( pointInNormal );

				}

			break;

			case VoxelPainter.MODE_ERASE:

				intersects = ray.intersectScene( _sceneVoxels );

				if ( intersects.length > 0 && intersects[ 0 ].object != _ground ) {

					removeVoxel( intersects[ 0 ].object );

				}

			break;

		}

	};

	this.getScene = function () {

		return _scene;

	};

}

VoxelPainter.MODE_IDLE = 'mode_idle';
VoxelPainter.MODE_DRAW = 'mode_draw';
VoxelPainter.MODE_ERASE = 'mode_erase';
