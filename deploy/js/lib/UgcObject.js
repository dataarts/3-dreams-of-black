var UgcObject = function ( data ) {

	var VERSION = 3,
	_type = null, _grid = {}, _count = 0;

	this.addVoxel = function ( x, y, z, color ) {

		_grid[ x + "." + y + "." + z ] = { x: x, y: y, z: z, color: color };
		_count ++;

	};

	this.checkVoxel = function ( x, y, z ) {

		return _grid[ x + "." + y + "." + z ];

	};

	this.removeVoxel = function ( x, y, z ) {

		delete _grid[ x + "." + y + "." + z ];
		_count --;

	};

	this.isEmpty = function () {

		return _count == 0;

	};

	this.getJSON = function () {

		var i, item, array = [ VERSION ];

		for ( i in _grid ) {

			item = _grid[ i ];
			array.push( item.x, item.y, item.z, item.color );

		}

		return JSON.stringify( array );
	};

	this.getMesh = function () {

		var geometry = new THREE.Cube( 50, 50, 50 );

		var group = new THREE.Object3D();

		for ( var i in _grid ) {

			var item = _grid[ i ];
			var voxel = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: item.color } ) );
			voxel.position.x = item.x * 50;
			voxel.position.y = item.y * 50;
			voxel.position.z = item.z * 50;
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			voxel.update();

			group.addChild( voxel );

		}

		return group;

	};

	// Parse data

	if ( data && data[ 0 ] == VERSION ) {

		var i = 1, l = data.length;

		while ( i < l ) {

			this.addVoxel( data[ i ++ ], data[ i ++ ], data[ i ++ ], data[ i ++ ] );

		}

	}

};

UgcObject.TYPE_SAND = 'UgcObject.TYPE_SAND';
UgcObject.TYPE_CLOUD = 'UgcObject.TYPE_CLOUD';
