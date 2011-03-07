var Butterfly2 = function () {

	var scope = this;

	THREE.Geometry.call(this);

	// vertices
	var s = 5;
	// left
	v(-s,0,s); // 0
	v(0,-0.5,0);  // 1
	v(-s,0,-s); // 2
	// right
	v(s,0,s); // 3
	v(s,0,-s); // 4
	// body
	v(0,0,1.5); // 5
	v(-0.5,0,-1); // 6
	v(0.5,0,-1); // 7

	v(0,-0.5,-1); // 8
	v(0,0.5,-1); // 9


	// faces
	var uva = new THREE.UV( 0,0.5 );
	var uvb = new THREE.UV( 1,0 );
	var uvc = new THREE.UV( 1,1 );
	f3(0,1,2,uvb,uva,uvc);
	f3(3,4,1,uvb,uvc,uva);

	var uva = new THREE.UV( 0,0.49 );
	var uvb = new THREE.UV( 0,0,51 );
	var uvc = new THREE.UV( 0.01,0.49 );
	f3(5,6,7,uvc,uva,uva);
	f3(5,8,9,uvc,uva,uva);


	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
	this.sortFacesByMaterial();

	function v( x, y, z ) {
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
		return i-1;
	}

	function f3( a, b, c, uva, uvb, uvc ) {
		scope.faces.push( new THREE.Face3( a, b, c ) );
		scope.uvs.push( [uva,uvb,uvc] );
	}

	this.animate = function (time) {
		var addy = (Math.sin(time)*4);
		var addx = (Math.cos(time)*4);

		this.vertices[0].position.x = -3+(addy+2)/2; 
		this.vertices[2].position.x = -3+(addy+2)/2; 

		this.vertices[0].position.y = addy+3; 
		this.vertices[2].position.y = addy+3; 

		this.vertices[3].position.x = 3-(addy+2)/2; 
		this.vertices[4].position.x = 3-(addy+2)/2; 

		this.vertices[3].position.y = addy+3; 
		this.vertices[4].position.y = addy+3; 

		this.__dirtyVertices = true;
	}

}

Butterfly2.prototype = new THREE.Geometry();
Butterfly2.prototype.constructor = Butterfly2;