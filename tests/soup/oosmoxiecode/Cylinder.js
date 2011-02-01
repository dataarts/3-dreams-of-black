/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/Cylinder.as
 */

var Cylinder = function (radius, height, segmentsW, segmentsH, openEnded) {

	var scope = this;

	this.radius = radius || 100;
	this.height = height || 200;
	this.segmentsW = segmentsW || 10;
	this.segmentsH = segmentsH || 1;
	this.openEnded = openEnded || false;
	var grid = new Array();
	var jMin;
	var jMax;

	THREE.Geometry.call(this);

	this.height /= 2;
	
	// vertices
	if (!this.openEnded) {
		this.segmentsH += 2;
		jMin = 1;
		jMax = this.segmentsH - 1;

		var bottom = vert( 0, -this.height, 0 );
		grid[0] = new Array(this.segmentsW);

		for (var i = 0; i < this.segmentsW; ++i) {
			grid[0][i] = bottom;
		}
		var top = vert(0, this.height, 0);
		grid[this.segmentsH] = new Array(this.segmentsW);

		for (var i = 0; i < this.segmentsW; ++i) {
			grid[this.segmentsH][i] = top;
		}
	} else {
		jMin = 0;
		jMax = this.segmentsH;
	}
                        
	for (var j = jMin; j <= jMax; ++j) { 
		var z = -this.height + 2 * this.height * (j-jMin) / (jMax-jMin);

		grid[j] = new Array(this.segmentsW);
		for (var i = 0; i < this.segmentsW; ++i) { 
			var verangle = 2 * i / this.segmentsW * Math.PI;
			var x = this.radius * Math.sin(verangle);
			var y = this.radius * Math.cos(verangle);
			grid[j][i] = vert(y, z, x);
		}
	}
                        
	// faces
	for (var j = 1; j <= this.segmentsH; ++j) {
		for (var i = 0; i < this.segmentsW; ++i) {
			var a = grid[j][i];
			var b = grid[j][(i-1+this.segmentsW) % this.segmentsW];
			var c = grid[j-1][(i-1+this.segmentsW) % this.segmentsW];
			var d = grid[j-1][i];

			var i2 = i;
			if (i == 0) {
				i2 = this.segmentsW;
			}
								
			var vab = j / this.segmentsH;
			var vcd = (j-1) / this.segmentsH;
			var uad = i2 / this.segmentsW;
			var ubc = (i2-1) / this.segmentsW;

			var uva = new THREE.UV( uad,vab );
			var uvb = new THREE.UV( ubc,vab );
			var uvc = new THREE.UV( ubc,vcd );
			var uvd = new THREE.UV( uad,vcd );

			if (j <= jMax) {
				f3(a,b,c,uva,uvb,uvc);
			}
			if (j > jMin) {            
				f3(a,c,d,uva,uvc,uvd);
			}
		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
	this.sortFacesByMaterial();

	function vert( x, y, z ) {
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
		return i-1;
	}

	function f3( a, b, c, uva, uvb, uvc ) {
		scope.faces.push( new THREE.Face3( a, b, c ) );
		scope.uvs.push( [uva,uvb,uvc] );
	}

}

Cylinder.prototype = new THREE.Geometry();
Cylinder.prototype.constructor = Cylinder;