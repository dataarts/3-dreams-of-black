var UgcObject = function () {

	this.type = null;
	this.grid = {};

	this.getArray = function () {

		var i, item, array = [];

		for ( i in grid ) {

			item = grid[ i ];
			array.push( item.position.x, item.position.y, item.position.z );

		};

	};

};

UgcObject.TYPE_SAND = 'UgcObject.TYPE_SAND';
UgcObject.TYPE_CLOUD = 'UgcObject.TYPE_CLOUD';
