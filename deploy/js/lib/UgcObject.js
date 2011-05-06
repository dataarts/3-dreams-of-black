var UgcObject = function ( data ) {

	var VERSION = 4,
	_type = null, _grid = {}, _count = 0;

	this.addVoxel = function ( x, y, z, color, object ) {

		_grid[ x + "." + y + "." + z ] = { x: x, y: y, z: z, color: color, object: object };
		_count ++;

	};

	this.getVoxel = function ( x, y, z ) {

		return _grid[ x + "." + y + "." + z ];

	};

	this.deleteVoxel = function ( x, y, z ) {

		delete _grid[ x + "." + y + "." + z ];
		_count --;

	};

	this.isEmpty = function () {

		return _count == 0;

	};

	this.getJSON = function () {

		var i, item, array = [ VERSION ], currentColor = null, items = [], itemsCount = 0;

		function pushItems() {

			if ( items.length ) {

				array.push( currentColor );
				array.push( itemsCount );
				array = array.concat( items );

			}

		}

		for ( i in _grid ) {

			item = _grid[ i ];

			if ( item.color != currentColor ) {

				pushItems();

				currentColor = item.color;
				itemsCount = 0;
				items = [];

			}

			items.push( item.x, item.y, item.z );
			itemsCount ++;

		}

		pushItems();

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

		var i = 1, l = data.length, currentColor = 0, itemsCount = 0;

		while ( i < l ) {

			currentColor = data[ i ++ ];
			itemsCount = data[ i ++ ];

			for ( j = 0; j < itemsCount; j ++ ) {

				this.addVoxel( data[ i ++ ], data[ i ++ ], data[ i ++ ], currentColor );

			}

		}

	}

};

UgcObject.TYPE_SAND = 'UgcObject.TYPE_SAND';
UgcObject.TYPE_CLOUD = 'UgcObject.TYPE_CLOUD';
