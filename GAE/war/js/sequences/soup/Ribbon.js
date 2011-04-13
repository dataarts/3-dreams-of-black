var Ribbon = function (in_length, in_height, in_segments) {

	var scope = this;

	var length = in_length || 100;
	var height = in_height || 10;
	var segments = in_segments || 10;

	THREE.Geometry.call(this);

	var halfHeight = height/2;
	var segmentWidth = length/segments;
	var tempVertices = [];

	// vertices
	for (var i=0; i<(segments+2); ++i ) {
		var x = i*segmentWidth
		var y_up = halfHeight;
		var y_down = -halfHeight;
		var z = 0;
		tempVertices.push(v(x,y_up,z));
		tempVertices.push(v(x,y_down,z));
	}

	// faces
	for (var i=0; i<segments*2; i+=2 ) {
		//face 1
		f3( tempVertices[i], tempVertices[i+2], tempVertices[i+1] );
		//face 2
		f3( tempVertices[i+2], tempVertices[i+3], tempVertices[i+1] );
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
	//this.sortFacesByMaterial();

	function v( x, y, z ) {
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
		return i-1;
	}

	function f3( a, b, c ) {
		scope.faces.push( new THREE.Face3( a, b, c ) );
	}

}

Ribbon.prototype = new THREE.Geometry();
Ribbon.prototype.constructor = Ribbon;