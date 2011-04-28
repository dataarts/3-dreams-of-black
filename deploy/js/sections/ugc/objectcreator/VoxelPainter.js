var VoxelPainter = function () {

	// Scene

	var _scene, _light1, _light2, _ground;

	_scene = new THREE.Scene();

	_light1 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	_light1.position.set( 0.5, 0.75, 1 );
	_light1.color.setHSV( 0, 0, 1 );
	_scene.addLight( _light1 );

	_light2 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	_light2.position.set( - 0.5, - 0.75, - 1 );
	_light2.color.setHSV( 0, 0, 0.306 );
	_scene.addLight( _light2 );

	_ground = new THREE.Mesh( new THREE.Plane( 2000, 2000, 40, 40 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2, transparency: true, wireframe: true } ) );
	_ground.position.x = - 25;
	_ground.position.y = - 25;
	_ground.position.z = - 25;
	_ground.rotation.x = - 90 * Math.PI / 180;
	_scene.addObject( _ground );

	// Voxels

	var _size = 50, _geometry, _material, _grid = {},
	_mode = VoxelPainter.MODE_PREVIEW;

	_geometry = new THREE.Cube( 50, 50, 50 );
	_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

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
			_scene.addObject( voxel );

			_grid[ x + "." + y + "." + z ] = voxel;

		}

	}

	function removeVoxel( vector ) {

		var x = Math.round( voxel.position.x / voxel_size );
		var y = Math.round( voxel.position.y / voxel_size );
		var z = Math.round( voxel.position.z / voxel_size );

		_grid[ x + "." + y + "." + z ] = null;

		sceneVoxels.removeObject( voxel );

	}

	//

	this.setMode = function ( mode ) {

		_mode = mode;

	};

	this.process = function ( ray ) {

		switch ( _mode ) {

			case VoxelPainter.MODE_DRAW:

				intersects = ray.intersectScene( sceneCollider );

				if ( intersectedFace && intersects.length > 0 ) {

					var face = intersectedFace,
					point = intersects[ 0 ].point,
					centroidWorld = face.centroid.clone().addSelf( intersectedObject.position ),
					distance = centroidWorld.distanceTo( point ),
					pointInNormal = centroidWorld.addSelf( intersectedObject.matrixRotationWorld.multiplyVector3( face.normal.clone() ).multiplyScalar( distance ) );

					addVoxel( pointInNormal );

				}

			break;

			case VoxelPainter.MODE_ERASE:

				intersects = ray.intersectScene( sceneVoxels );

				if ( intersects.length > 0 && intersects[ 0 ].object != ground ) {

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
