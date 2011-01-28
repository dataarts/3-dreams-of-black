/*
 * Construct
 */

THREE.Matrix3 = function( mat ) {
	
	//--- Variables ---
	
	this.elements = THREE.Math.GLArray( 9 );
	
    if( mat ) 
		set( mat );
	else
		identity( mat );		
}
 	
//--- set ---

THREE.Matrix3.prototype.set = function( mat, dest ) {
	
	if( !dest          ) dest = this.elements;
	if(  dest.elements ) dest = dest.elements;
	if(  mat.elements  ) mat  = mat.elements;

	if( mat.length === 16 )
	{
        dest[ 0 ] = mat[ 0 ];
        dest[ 1 ] = mat[ 1 ];
        dest[ 2 ] = mat[ 2 ];
        dest[ 3 ] = mat[ 4 ];
        dest[ 4 ] = mat[ 5 ];
        dest[ 5 ] = mat[ 6 ];
        dest[ 6 ] = mat[ 8 ];
        dest[ 7 ] = mat[ 9 ];
        dest[ 8 ] = mat[ 10 ];
		
		return dest;
	}

    dest[ 0 ] = mat[ 0 ];
    dest[ 1 ] = mat[ 1 ];
    dest[ 2 ] = mat[ 2 ];
    dest[ 3 ] = mat[ 3 ];
    dest[ 4 ] = mat[ 4 ];
    dest[ 5 ] = mat[ 5 ];
    dest[ 6 ] = mat[ 6 ];
    dest[ 7 ] = mat[ 7 ];
    dest[ 8 ] = mat[ 8 ];

    return dest;
};


//--- Identity ---

THREE.Matrix3.prototype.identity = function( dest ) {
	
	if( !dest ) dest = this.elements;
	
    dest[ 0 ] = 1;
    dest[ 1 ] = 0;
    dest[ 2 ] = 0;
    dest[ 3 ] = 0;
    dest[ 4 ] = 1;
    dest[ 5 ] = 0;
    dest[ 6 ] = 0;
    dest[ 7 ] = 0;
    dest[ 8 ] = 1;

    return dest;
};


//--- ToMatrix4 ---

THREE.Matrix3.prototype.toMatrix4 = function( dest ) {
	
    if( !dest ) dest = new THREE.Matrix4();
    
    dest[ 0 ] = this.elements[ 0 ];
    dest[ 1 ] = this.elements[ 1 ];
    dest[ 2 ] = this.elements[ 2 ];
    dest[ 3 ] = 0;

    dest[ 4 ] = this.elements[ 3 ];
    dest[ 5 ] = this.elements[ 4 ];
    dest[ 6 ] = this.elements[ 5 ];
    dest[ 7 ] = 0;

    dest[ 8  ] = this.elements[ 6 ];
    dest[ 9  ] = this.elements[ 7 ];
    dest[ 10 ] = this.elements[ 8 ];
    dest[ 11 ] = 0;

    dest[ 12 ] = 0;
    dest[ 13 ] = 0;
    dest[ 14 ] = 0;
    dest[ 15 ] = 1;
        
    return dest;
}


//--- Transpose ---

THREE.Matrix3.prototype.transpose = function() {
	
    var a01 = this.elements[ 1 ], a02 = this.elements[ 2 ];
    var a12 = this.elements[ 5 ];
    
    this.elements[ 1 ] = this.elements[ 3  ];
    this.elements[ 2 ] = this.elements[ 6  ];
    this.elements[ 5 ] = this.elements[ 7  ];
    this.elements[ 3 ] = a01;
    this.elements[ 6 ] = a02;
    this.elements[ 7 ] = a12;
    
    return this;
};


//--- To String ---

THREE.Matrix3.prototype.ToString = function() {

    return '[ ' + this.elements[ 0 ] + ', ' + this.elements[ 1 ] + ', ' + this.elements[ 2 ] + 
           ', ' + this.elements[ 3 ] + ', ' + this.elements[ 4 ] + ', ' + this.elements[ 5 ] + 
           ', ' + this.elements[ 6 ] + ', ' + this.elements[ 7 ] + ', ' + this.elements[ 8 ] + '  ]';
}
