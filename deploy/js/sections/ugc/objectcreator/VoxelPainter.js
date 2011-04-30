var VoxelPainter = function ( camera ) {

	var _intersectPoint, _intersectFace, _intersectObject;

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

	var _mode = VoxelPainter.MODE_IDLE, _size = 50, _grid = {};

	var _geometry = new THREE.Cube( _size, _size, _size );
	var _material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

	// Preview

	var _preview = new THREE.Mesh( _geometry, new THREE.MeshLambertMaterial( { color: 0x00ff00, opacity: 0, transparent: true } ) );
	// _preview.doubleSided = true;
	_preview.matrixAutoUpdate = false;
	_scene.addObject( _preview );

	//

	addVoxel( new THREE.Vector3() );

	function toGridScale( value ) {

		return Math.round( value / _size );

	}

	function addVoxel( vector ) {

		var x = toGridScale( vector.x );
		var y = toGridScale( vector.y );
		var z = toGridScale( vector.z );

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

		var x = toGridScale( voxel.position.x );
		var y = toGridScale( voxel.position.y );
		var z = toGridScale( voxel.position.z );

		_grid[ x + "." + y + "." + z ] = null;

		_sceneVoxels.removeObject( voxel );
		_scene.removeObject( voxel ); // This shouldn't be needed :/

	}

	//

	this.setMode = function ( mode ) {

		_mode = mode;

	};

	this.moveMouse = function ( x, y ) {

		mouse2D.x = x * 2 - 1;
		mouse2D.y = - y * 2 + 1;

		mouse3D = projector.unprojectVector( mouse2D.clone(), camera );
		ray.direction = mouse3D.subSelf( camera.position ).normalize();


	};

	this.update = function () {

		var intersects;

		switch ( _mode ) {

			case VoxelPainter.MODE_IDLE:

				intersects = ray.intersectScene( _sceneVoxels );

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

			break;

			case VoxelPainter.MODE_DRAW:

				_preview.materials[ 0 ].opacity = 0;

				intersects = ray.intersectScene( _sceneCollider );

				if ( _intersectFace && intersects.length > 0 ) {

					var point = intersects[ 0 ].point,
					centroidWorld = _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.centroid.clone() ).addSelf( _intersectObject.position ),
					distance = centroidWorld.distanceTo( point ),
					pointInNormal = centroidWorld.addSelf( _intersectObject.matrixRotationWorld.multiplyVector3( _intersectFace.normal.clone() ).multiplyScalar( distance ) );

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

	this.getGrid = function () {

		return _grid;

	};

}

VoxelPainter.MODE_IDLE = 'VoxelPainter.MODE_IDLE';
VoxelPainter.MODE_DRAW = 'VoxelPainter.MODE_DRAW';
VoxelPainter.MODE_ERASE = 'VoxelPainter.MODE_ERASE';
