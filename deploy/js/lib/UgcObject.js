var UgcObject = function ( data ) {

	var VERSION = 5, UNIT_SIZE = 50,
	_type = UgcObject.TYPE_GROUND, _grid = {}, _count = 0;

	this.addVoxel = function ( x, y, z, color, object ) {

		_grid[ x + "." + y + "." + z ] = { x: x, y: y, z: z, color: color, object: object };
		_count ++;

	};

	this.getType = function () {

		return _type;

	};

	this.setType = function ( type ) {

		_type = type;

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

	this.getGrid = function () {

		return _grid;

	};

	this.setGrid = function ( grid ) {

		_grid = grid;

	};

	this.clear = function () {

		delete _grid;

		_grid = {};
		_count = 0;

	};

	this.getJSON = function () {

		var i, item, array = [ VERSION ],
		currentColor = null, items = [], itemsCount = 0;

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

		var i, item,
		voxel = new THREE.Mesh( new THREE.Cube( UNIT_SIZE, UNIT_SIZE, UNIT_SIZE ) ),
		geometry = new THREE.Geometry();

		for ( i in _grid ) {

			item = _grid[ i ];

			voxel.position.x = item.x * UNIT_SIZE;
			voxel.position.y = item.y * UNIT_SIZE;
			voxel.position.z = item.z * UNIT_SIZE;

			for (i = 0; i < voxel.geometry.faces.length; i++) {

				voxel.geometry.faces[i].color.setHex( item.color );

			}

			GeometryUtils.merge( geometry, voxel );

		}

    //UgcShader.uniforms = THREE.UniformsUtils.clone(UgcShader.uniforms);
    var UgcMat =  new THREE.MeshShaderMaterial( {
            uniforms: UgcShader.uniforms(),
            vertexShader: UgcShader.vertexShader,
            fragmentShader: UgcShader.fragmentShader,
            shading: THREE.FlatShading,
            lights: true,
            vertexColors: 1
          });
    
    return new THREE.Mesh( geometry, UgcMat );
    //return new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } ) );

	};

	// Parse data

	if ( data && data[ 0 ] == VERSION ) {

		var i = 1, l = data.length, currentColor = 0, itemsCount = 0;

		while ( i < l ) {

			currentColor = data[ i ++ ];
			itemsCount = data[ i ++ ];

			for ( j = 0; j < itemsCount; j ++ ) {

				this.addVoxel(
					data[ i ++ ],
					data[ i ++ ],
					data[ i ++ ],
					currentColor
				);

			}

		}

	}

};

UgcObject.TYPE_GROUND = 'ground';
UgcObject.TYPE_SKY = 'sky';
