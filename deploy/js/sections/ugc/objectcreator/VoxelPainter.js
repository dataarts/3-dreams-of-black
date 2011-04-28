var VoxelPainter = function () {

	var _mode = VoxelPainter.MODE_PREVIEW,
	_scene, _ground;

	_scene = new THREE.Scene();

	_ground = new THREE.Mesh( new THREE.Plane( 2000, 2000, 40, 40 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.2, transparency: true, wireframe: true } ) );
	_ground.position.x = - 25;
	_ground.position.y = - 25;
	_ground.position.z = - 25;
	_ground.rotation.x = - 90 * Math.PI / 180;
	_scene.addObject( _ground );

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

		console.log( _mode );
		return _scene;

	};

}

VoxelPainter.MODE_IDLE = 'mode_idle';
VoxelPainter.MODE_DRAW = 'mode_draw';
VoxelPainter.MODE_ERASE = 'mode_erase';
