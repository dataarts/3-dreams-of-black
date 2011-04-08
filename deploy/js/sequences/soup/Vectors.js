var Vectors = function ( length, divider, normaldivider ) {
	
	var that = this;

	that.array = [];
	var length = length || 50;
	var divider = divider || 4;
	var normaldivider = normaldivider || 10;
	var i;

	// vectors
	for ( i = 0; i < length; ++i ) {

		var position = new THREE.Vector3(0,0,0);

		var obj = { position: position, lastposition: position, normal: new THREE.Vector3(0,1,0), scale: 1 };
		that.array.push(obj);

	}

	this.update = function (position, normal) {

		for (i=0; i < length; ++i ) {
			var obj = that.array[i];

			if (i == 0) {

				var tox = position.x;
				var toy = position.y;
				var toz = position.z;

				var tonormalx = normal.x;
				var tonormaly = normal.y;
				var tonormalz = normal.z;

			} else {
				
				var tox = that.array[i-1].lastposition.x;
				var toy = that.array[i-1].lastposition.y;
				var toz = that.array[i-1].lastposition.z;

				var tonormalx = that.array[i-1].normal.x;
				var tonormaly = that.array[i-1].normal.y;
				var tonormalz = that.array[i-1].normal.z;

			}

			var moveX = (tox-obj.position.x)/divider;
			var moveY = (toy-obj.position.y)/divider;
			var moveZ = (toz-obj.position.z)/divider;

			obj.position.x += moveX;
			obj.position.y += moveY;
			obj.position.z += moveZ;

			var moveNormalX = (tonormalx-obj.normal.x)/normaldivider;
			var moveNormalY = (tonormaly-obj.normal.y)/normaldivider;
			var moveNormalZ = (tonormalz-obj.normal.z)/normaldivider;

			obj.normal.x += moveNormalX;
			obj.normal.y += moveNormalY;
			obj.normal.z += moveNormalZ;
		}

	}

	this.reset = function ( x,y,z ) {

		for (var i=0; i<that.array.length; ++i ) {
			var obj = that.array[i];
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
		}

	}

}