THREE.Matrix3 = function () {

	this.m = [];
	this.flat = new Array(1, 0, 0, 0, 1, 0, 0, 0, 1);
	
	this.flatten = function() {
	
		return this.flat;
	}
	

	// WebGL additions - NEEDS TO BE DISCUSSED!

	if( typeof Float32Array !== 'undefined' ) {

		var that = this;		
		this.float32Array = new Float32Array( 9 ),
		this.flatten32 = function() {
			
			var flat = that.float32Array;
			
			flat[ 0  ] = 1; flat[ 1  ] = 0; flat[ 2 ] = 0;
			flat[ 3  ] = 0; flat[ 4  ] = 1; flat[ 5 ] = 0;
			flat[ 6  ] = 0; flat[ 7  ] = 0; flat[ 8 ] = 1;
	
			return flat;
		}
	}
};

THREE.Matrix3.prototype = {

	transpose: function () {

		var tmp, m = this.m;

		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;
	}
};
