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
			var m    = that.m; 
			
			flat[ 0  ] = m[ 0 ]; flat[ 1 ] = m[ 1 ]; flat[ 2 ] = m[ 2 ];
			flat[ 3  ] = m[ 3 ]; flat[ 4 ] = m[ 4 ]; flat[ 5 ] = m[ 5 ];
			flat[ 6  ] = m[ 6 ]; flat[ 7 ] = m[ 7 ]; flat[ 8 ] = m[ 8 ];
	
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
