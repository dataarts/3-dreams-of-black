THREE.Matrix4 = function( mat ) {

	this.elements = THREE.Math.GLArray(16);
	
	if (mat) 
		this.set(mat);
	else 
		this.identity();
}	

  
//--- Set ---  

THREE.Matrix4.prototype.set = function( mat, dest ) {
	
	if( !dest          ) dest = this.elements;
	if(  dest.elements ) dest = dest.elements;
	if(  mat.elements  ) mat  = mat.elements;
	
    dest[ 0  ] = mat[ 0 ];
    dest[ 1  ] = mat[ 1 ];
    dest[ 2  ] = mat[ 2 ];
    dest[ 3  ] = mat[ 3 ];
    dest[ 4  ] = mat[ 4 ];
    dest[ 5  ] = mat[ 5 ];
    dest[ 6  ] = mat[ 6 ];
    dest[ 7  ] = mat[ 7 ];
    dest[ 8  ] = mat[ 8 ];
    dest[ 9  ] = mat[ 9 ];
    dest[ 10 ] = mat[ 10 ];
    dest[ 11 ] = mat[ 11 ];
    dest[ 12 ] = mat[ 12 ];
    dest[ 13 ] = mat[ 13 ];
    dest[ 14 ] = mat[ 14 ];
    dest[ 15 ] = mat[ 15 ];
  
    return dest;
}


//--- Identity ---

THREE.Matrix4.prototype.identity = function() {
	
    this.elements[ 0  ] = 1;
    this.elements[ 1  ] = 0;
    this.elements[ 2  ] = 0;
    this.elements[ 3  ] = 0;
    this.elements[ 4  ] = 0;
    this.elements[ 5  ] = 1;
    this.elements[ 6  ] = 0;
    this.elements[ 7  ] = 0;
    this.elements[ 8  ] = 0;
    this.elements[ 9  ] = 0;
    this.elements[ 10 ] = 1;
    this.elements[ 11 ] = 0;
    this.elements[ 12 ] = 0;
    this.elements[ 13 ] = 0;
    this.elements[ 14 ] = 0;
    this.elements[ 15 ] = 1;
 
    return this;
}


//--- Transpose ---

THREE.Matrix4.prototype.transpose = function() {
	
    var a01 = this.elements[ 1 ], a02 = this.elements[ 2 ], a03 = this.elements[ 3 ];
    var a12 = this.elements[ 6 ], a13 = this.elements[ 7 ];
    var a23 = this.elements[ 11 ];
    
    this.elements[ 1  ] = this.elements[ 4  ];
    this.elements[ 2  ] = this.elements[ 8  ];
    this.elements[ 3  ] = this.elements[ 12 ];
    this.elements[ 4  ] = a01;
    this.elements[ 6  ] = this.elements[ 9  ];
    this.elements[ 7  ] = this.elements[ 13 ];
    this.elements[ 8  ] = a02;
    this.elements[ 9  ] = a12;
    this.elements[ 11 ] = this.elements[ 14 ];
    this.elements[ 12 ] = a03;
    this.elements[ 13 ] = a13;
    this.elements[ 14 ] = a23;
    
    return this;
};


//--- Determinant ---

THREE.Matrix4.prototype.determinant = function() {
	
    var a00 = this.elements[ 0  ], a01 = this.elements[ 1  ], a02 = this.elements[ 2  ], a03 = this.elements[ 3  ];
    var a10 = this.elements[ 4  ], a11 = this.elements[ 5  ], a12 = this.elements[ 6  ], a13 = this.elements[ 7  ];
    var a20 = this.elements[ 8  ], a21 = this.elements[ 9  ], a22 = this.elements[ 10 ], a23 = this.elements[ 11 ];
    var a30 = this.elements[ 12 ], a31 = this.elements[ 13 ], a32 = this.elements[ 14 ], a33 = this.elements[ 15 ];

    return  a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
            a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
            a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
            a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
            a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
            a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
};


//--- Inverse ---

THREE.Matrix4.prototype.inverse = function( dest ) {
	
    if( !dest          ) dest = this.elements;
	if(  dest.elements ) dest = dest.elements;
	
    
    var a00 = this.elements[ 0  ], a01 = this.elements[ 1  ], a02 = this.elements[ 2  ], a03 = this.elements[ 3  ];
    var a10 = this.elements[ 4  ], a11 = this.elements[ 5  ], a12 = this.elements[ 6  ], a13 = this.elements[ 7  ];
    var a20 = this.elements[ 8  ], a21 = this.elements[ 9  ], a22 = this.elements[ 10 ], a23 = this.elements[ 11 ];
    var a30 = this.elements[ 12 ], a31 = this.elements[ 13 ], a32 = this.elements[ 14 ], a33 = this.elements[ 15 ];
    
    var b00 = a00*a11 - a01*a10;
    var b01 = a00*a12 - a02*a10;
    var b02 = a00*a13 - a03*a10;
    var b03 = a01*a12 - a02*a11;
    var b04 = a01*a13 - a03*a11;
    var b05 = a02*a13 - a03*a12;
    var b06 = a20*a31 - a21*a30;
    var b07 = a20*a32 - a22*a30;
    var b08 = a20*a33 - a23*a30;
    var b09 = a21*a32 - a22*a31;
    var b10 = a21*a33 - a23*a31;
    var b11 = a22*a33 - a23*a32;
    
    var invDet = 1/( b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
    
    dest[ 0  ] = (  a11*b11 - a12*b10 + a13*b09 ) * invDet;
    dest[ 1  ] = ( -a01*b11 + a02*b10 - a03*b09 ) * invDet;
    dest[ 2  ] = (  a31*b05 - a32*b04 + a33*b03 ) * invDet;
    dest[ 3  ] = ( -a21*b05 + a22*b04 - a23*b03 ) * invDet;
    dest[ 4  ] = ( -a10*b11 + a12*b08 - a13*b07 ) * invDet;
    dest[ 5  ] = (  a00*b11 - a02*b08 + a03*b07 ) * invDet;
    dest[ 6  ] = ( -a30*b05 + a32*b02 - a33*b01 ) * invDet;
    dest[ 7  ] = (  a20*b05 - a22*b02 + a23*b01 ) * invDet;
    dest[ 8  ] = (  a10*b10 - a11*b08 + a13*b06 ) * invDet;
    dest[ 9  ] = ( -a00*b10 + a01*b08 - a03*b06 ) * invDet;
    dest[ 10 ] = (  a30*b04 - a31*b02 + a33*b00 ) * invDet;
    dest[ 11 ] = ( -a20*b04 + a21*b02 - a23*b00 ) * invDet;
    dest[ 12 ] = ( -a10*b09 + a11*b07 - a12*b06 ) * invDet;
    dest[ 13 ] = (  a00*b09 - a01*b07 + a02*b06 ) * invDet;
    dest[ 14 ] = ( -a30*b03 + a31*b01 - a32*b00 ) * invDet;
    dest[ 15 ] = (  a20*b03 - a21*b01 + a22*b00 ) * invDet;
    
    return this;
};


//--- To Rotation Matrix ---

THREE.Matrix4.prototype.toRotationMatrix4 = function() {
	
    this.elements[ 12 ] = 0;
    this.elements[ 13 ] = 0;
    this.elements[ 14 ] = 0;
    this.elements[ 15 ] = 1;
    
    return this;
};


//--- To Matrix 3 ---

THREE.Matrix4.prototype.toMatrix3 = function() {

	// to do
	
};


//--- To Inverse Matrix3 ---

THREE.Matrix4.prototype.toInverseMatrix3 = function( dest ) {

    var a00 = this.elements[ 0 ], a01 = this.elements[ 1 ], a02 = this.elements[ 2 ];
    var a10 = this.elements[ 4 ], a11 = this.elements[ 5 ], a12 = this.elements[ 6 ];
    var a20 = this.elements[ 8 ], a21 = this.elements[ 9 ], a22 = this.elements[ 10 ];
    
    var b01 =  a22*a11 - a12*a21;
    var b11 = -a22*a10 + a12*a20;
    var b21 =  a21*a10 - a11*a20;
            
    var d = a00*b01 + a01*b11 + a02*b21;
    
	if( !d ) { return null; }
	
    var id = 1/d;
	var elem;
	
	if( !dest         ) dest = new DDD.Matrix3();
	if( dest.elements ) elem = dest.elements;
    else                elem = dest;
	
    elem[ 0 ] = b01*id;
    elem[ 1 ] = ( -a22*a01 + a02*a21 ) * id;
    elem[ 2 ] = (  a12*a01 - a02*a11 ) * id;
    elem[ 3 ] = b11*id;
    elem[ 4 ] = (  a22*a00 - a02*a20 ) * id;
    elem[ 5 ] = ( -a12*a00 + a02*a10 ) * id;
    elem[ 6 ] = b21*id;
    elem[ 7 ] = ( -a21*a00 + a01*a20 ) * id;
    elem[ 8 ] = (  a11*a00 - a01*a10 ) * id;
    
    return dest;
};


//--- Multiply ---

THREE.Matrix4.prototype.multiply = function( mat, dest ) {
	
    if( !dest          ) dest = this.elements;
	if(  dest.elements ) dest = dest.elements;
    if(  mat.elements  ) mat  = mat.elements;
	
    var a00 = this.elements[ 0  ], a01 = this.elements[ 1  ], a02 = this.elements[ 2  ], a03 = this.elements[ 3 ];
    var a10 = this.elements[ 4  ], a11 = this.elements[ 5  ], a12 = this.elements[ 6  ], a13 = this.elements[ 7 ];
    var a20 = this.elements[ 8  ], a21 = this.elements[ 9  ], a22 = this.elements[ 10 ], a23 = this.elements[ 11 ];
    var a30 = this.elements[ 12 ], a31 = this.elements[ 13 ], a32 = this.elements[ 14 ], a33 = this.elements[ 15 ];
    
    var b00 = mat[ 0  ], b01 = mat[ 1  ], b02 = mat[ 2  ], b03 = mat[ 3  ];
    var b10 = mat[ 4  ], b11 = mat[ 5  ], b12 = mat[ 6  ], b13 = mat[ 7  ];
    var b20 = mat[ 8  ], b21 = mat[ 9  ], b22 = mat[ 10 ], b23 = mat[ 11 ];
    var b30 = mat[ 12 ], b31 = mat[ 13 ], b32 = mat[ 14 ], b33 = mat[ 15 ];
    
    dest[ 0  ] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
    dest[ 1  ] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
    dest[ 2  ] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
    dest[ 3  ] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
    dest[ 4  ] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
    dest[ 5  ] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
    dest[ 6  ] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
    dest[ 7  ] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
    dest[ 8  ] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
    dest[ 9  ] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
    dest[ 10 ] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
    dest[ 11 ] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
    dest[ 12 ] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
    dest[ 13 ] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
    dest[ 14 ] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
    dest[ 15 ] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
    
    return this;
}


//--- Multiply Vector 3 ---

THREE.Matrix4.prototype.multiplyVector3 = function( vec, dest ) {
	
    if( !dest          ) dest = vec;
	if(  dest.elements ) dest = dest.elements;
	if(  vec.elements  ) vec  = vec.elements;
    
    var x = vec[ 0 ], y = vec[ 1 ], z = vec[ 2 ];
    
    dest[ 0 ] = this.elements[ 0 ]*x + this.elements[ 4 ]*y + this.elements[ 8  ]*z + this.elements[ 12 ];
    dest[ 1 ] = this.elements[ 1 ]*x + this.elements[ 5 ]*y + this.elements[ 9  ]*z + this.elements[ 13 ];
    dest[ 2 ] = this.elements[ 2 ]*x + this.elements[ 6 ]*y + this.elements[ 10 ]*z + this.elements[ 14 ];
    
    return dest;
}


//--- Multiply Vector 4 ---	

THREE.Matrix4.prototype.multiplyVector4 = function( vec, dest ) {
        
	if( !dest          ) dest = vec;
	if(  dest.elements ) dest = dest.elements;
	if(  vec.elements  ) vec  = vec.elements;
    
    var x = vec[ 0 ], y = vec[ 1 ], z = vec[ 2 ], w = vec[ 3 ];
    
    dest[ 0 ] = this.elements[ 0 ]*x + this.elements[ 4 ]*y + this.elements[ 8  ]*z + this.elements[ 12 ]*w;
    dest[ 1 ] = this.elements[ 1 ]*x + this.elements[ 5 ]*y + this.elements[ 9  ]*z + this.elements[ 13 ]*w;
    dest[ 2 ] = this.elements[ 2 ]*x + this.elements[ 6 ]*y + this.elements[ 10 ]*z + this.elements[ 14 ]*w;
    dest[ 4 ] = this.elements[ 4 ]*x + this.elements[ 7 ]*y + this.elements[ 11 ]*z + this.elements[ 15 ]*w;
    
    return dest;
}


//--- Translate ---

THREE.Matrix4.prototype.translate = function( vec ) {

	if( vec.elements ) vec = vec.elements;
	
	this.elements[ 12 ] += vec[ 0 ];
	this.elements[ 13 ] += vec[ 1 ];
	this.elements[ 14 ] += vec[ 2 ];

    return this;
};

THREE.Matrix4.prototype.translation = function( vec ) {
	
	if( vec.elements ) vec = vec.elements;
	
	this.elements[ 12 ] = vec[ 0 ];
	this.elements[ 13 ] = vec[ 1 ];
	this.elements[ 14 ] = vec[ 2 ];

    return this;
}


//--- Scale ---

THREE.Matrix4.prototype.scale = function( vec ) {
	
	if( vec.elements ) vec = vec.elements;
	
    var x = vec[ 0 ], y = vec[ 1 ], z = vec[ 2 ];
    
    this.elements[ 0  ] *= x;
    this.elements[ 1  ] *= x;
    this.elements[ 2  ] *= x;
    this.elements[ 4  ] *= y;
    this.elements[ 5  ] *= y;
    this.elements[ 6  ] *= y;
    this.elements[ 8  ] *= z;
    this.elements[ 9  ] *= z;
    this.elements[ 10 ] *= z;

    return this;
}


THREE.Matrix4.prototype.rotate = function( angle, axis, dest ) {
	
	if( axis.elements ) axis = axis.elements;
	
    var x   = axis[ 0 ], y = axis[ 1 ], z = axis[ 2 ];
    var len = Math.sqrt( x*x + y*y + z*z );

    if( !len     ) { return null; }
    if( len != 1 ) {
        len = 1 / len;
        x *= len; 
        y *= len; 
        z *= len;
    }
    
    var s = Math.sin( angle );
    var c = Math.cos( angle );
    var t = 1-c;
    
    // Cache the matrix values ( makes for huge speed increases!)
    var a00 = this.elements[ 0 ], a01 = this.elements[ 1 ], a02 = this.elements[ 2  ], a03 = this.elements[ 3  ];
    var a10 = this.elements[ 4 ], a11 = this.elements[ 5 ], a12 = this.elements[ 6  ], a13 = this.elements[ 7  ];
    var a20 = this.elements[ 8 ], a21 = this.elements[ 9 ], a22 = this.elements[ 10 ], a23 = this.elements[ 11 ];
    
    // Construct the elements of the rotation matrix
    var b00 = x*x*t + c,   b01 = y*x*t + z*s, b02 = z*x*t - y*s;
    var b10 = x*y*t - z*s, b11 = y*y*t + c,   b12 = z*y*t + x*s;
    var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
    
    if( !dest          ) dest = this.elements; 
	if(  dest.elements ) dest = dest.elements;
    
    // Perform rotation-specific matrix multiplication
    
	dest[ 0  ] = a00*b00 + a10*b01 + a20*b02;
    dest[ 1  ] = a01*b00 + a11*b01 + a21*b02;
    dest[ 2  ] = a02*b00 + a12*b01 + a22*b02;
    dest[ 3  ] = a03*b00 + a13*b01 + a23*b02;
    dest[ 4  ] = a00*b10 + a10*b11 + a20*b12;
    dest[ 5  ] = a01*b10 + a11*b11 + a21*b12;
    dest[ 6  ] = a02*b10 + a12*b11 + a22*b12;
    dest[ 7  ] = a03*b10 + a13*b11 + a23*b12;
    dest[ 8  ] = a00*b20 + a10*b21 + a20*b22;
    dest[ 9  ] = a01*b20 + a11*b21 + a21*b22;
    dest[ 10 ] = a02*b20 + a12*b21 + a22*b22;
    dest[ 11 ] = a03*b20 + a13*b21 + a23*b22;

    return dest;
}


//--- Frustum ---

THREE.Matrix4.prototype.frustum = function( left, right, bottom, top, near, far ) {
	
    var rl = ( right - left   );
    var tb = ( top   - bottom );
    var fn = ( far   - near   );
	
    this.elements[ 0  ] = ( near*2 ) / rl;
    this.elements[ 1  ] = 0;
    this.elements[ 2  ] = 0;
    this.elements[ 3  ] = 0;
    this.elements[ 4  ] = 0;
    this.elements[ 5  ] = ( near*2 ) / tb;
    this.elements[ 6  ] = 0;
    this.elements[ 7  ] = 0;
    this.elements[ 8  ] = ( right + left ) / rl;
    this.elements[ 9  ] = ( top + bottom ) / tb;
    this.elements[ 10 ] = -( far + near ) / fn;
    this.elements[ 11 ] = -1;
    this.elements[ 12 ] = 0;
    this.elements[ 13 ] = 0;
    this.elements[ 14 ] = -( far*near*2 ) / fn;
    this.elements[ 15 ] = 0;

    return this;
}


//--- Perspective ---

THREE.Matrix4.prototype.perspective = function( fovy, aspect, near, far ) {
	
    var top   = near * Math.tan( fovy * Math.PI / 360.0 );
    var right = top * aspect;
	
    return this.frustum( -right, right, -top, top, near, far );
}


/*
 * mat4.ortho
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * Params:
 * eye - vec3, position of the viewer
 * center - vec3, point the viewer is looking at
 * up - vec3 pointing "up"
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
THREE.Matrix4.prototype.lookAt = function( center, up ) {

		console.log( "Matrix4.LookAt: NOT IMPLEMENTED!");
		return;
/*
        var eyex = eye[ 0 ],
            eyey = eye[ 1 ],
            eyez = eye[ 2 ],
            upx = up[ 0 ],
            upy = up[ 1 ],
            upz = up[ 2 ],
            centerx = center[ 0 ],
            centery = center[ 1 ],
            centerz = center[ 2 ];

        if ( eyex == centerx && eyey == centery && eyez == centerz ) {
                return mat4.identity( dest );
        }
        
        var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
        
        //vec3.direction( eye, center, z );
        z0 = eyex - center[ 0 ];
        z1 = eyey - center[ 1 ];
        z2 = eyez - center[ 2 ];
        
        // normalize ( no check needed for 0 because of early return )
        len = 1/Math.sqrt( z0*z0 + z1*z1 + z2*z2 );
        z0 *= len;
        z1 *= len;
        z2 *= len;
        
        //vec3.normalize( vec3.cross( up, z, x ) );
        x0 = upy*z2 - upz*z1;
        x1 = upz*z0 - upx*z2;
        x2 = upx*z1 - upy*z0;
        len = Math.sqrt( x0*x0 + x1*x1 + x2*x2 );
        if ( !len ) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
        } else {
                len = 1/len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
        };
        
        //vec3.normalize( vec3.cross( z, x, y ) );
        y0 = z1*x2 - z2*x1;
        y1 = z2*x0 - z0*x2;
        y2 = z0*x1 - z1*x0;
        
        len = Math.sqrt( y0*y0 + y1*y1 + y2*y2 );
        if ( !len ) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
        } else {
                len = 1/len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
        }
        
        dest[ 0 ] = x0;
        dest[ 1 ] = y0;
        dest[ 2 ] = z0;
        dest[ 3 ] = 0;
        dest[ 4 ] = x1;
        dest[ 5 ] = y1;
        dest[ 6 ] = z1;
        dest[ 7 ] = 0;
        dest[ 8 ] = x2;
        dest[ 9 ] = y2;
        dest[ 10 ] = z2;
        dest[ 11 ] = 0;
        dest[ 12 ] = -( x0*eyex + x1*eyey + x2*eyez );
        dest[ 13 ] = -( y0*eyex + y1*eyey + y2*eyez );
        dest[ 14 ] = -( z0*eyex + z1*eyey + z2*eyez );
        dest[ 15 ] = 1;
        
        return dest;*/
}

//--- ToString ---

THREE.Matrix4.prototype.toString = function() {
	
    return '[ ' + this.elements[ 0  ] + ', ' + this.elements[ 1  ] + ', ' + this.elements[ 2  ] + ', ' + this.elements[ 3  ] + 
            ', '+ this.elements[ 4  ] + ', ' + this.elements[ 5  ] + ', ' + this.elements[ 6  ] + ', ' + this.elements[ 7  ] + 
            ', '+ this.elements[ 8  ] + ', ' + this.elements[ 9  ] + ', ' + this.elements[ 10 ] + ', ' + this.elements[ 11 ] + 
            ', '+ this.elements[ 12 ] + ', ' + this.elements[ 13 ] + ', ' + this.elements[ 14 ] + ', ' + this.elements[ 15 ] + ' ]';
}
	
