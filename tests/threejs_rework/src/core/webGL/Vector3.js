//--- Construct ---

THREE.Vector3 = function( vec ) {

	this.elements = DDD.Math.GLArray( 3 );
	
	if( vec ) 
		set( vec );
	else {
		
		this.elements[ 0 ] = 0;
		this.elements[ 1 ] = 0;
		this.elements[ 2 ] = 0;
	}
}
	   	

//--- Set ---

THREE.Vector3.prototype.set = function( vec ) {

    this.elements[ 0 ] = vec[ 0 ];
    this.elements[ 1 ] = vec[ 1 ];
    this.elements[ 2 ] = vec[ 2 ];
    
    return this;
};


//--- Add ---

THREE.Vector3.prototype.add = function( vec, dest ) {
	
    if( !dest ) {
		
        this.elements[ 0 ] += vec[ 0 ];
        this.elements[ 1 ] += vec[ 1 ];
        this.elements[ 2 ] += vec[ 2 ];
        
		return this;
    }
        
    dest[ 0 ] = this.elements[ 0 ] + vec[ 0 ];
    dest[ 1 ] = this.elements[ 1 ] + vec[ 1 ];
    dest[ 2 ] = this.elements[ 2 ] + vec[ 2 ];
	
    return dest;
};


//--- Substract ---

THREE.Vector3.prototype.subtract = function( vec, dest ) {
	
	if( vec.elements ) vec = vec.elements;
	
    if( !dest ) {
		
        this.elements[ 0 ] -= vec[ 0 ];
        this.elements[ 1 ] -= vec[ 1 ];
        this.elements[ 2 ] -= vec[ 2 ];
        
		return this;
    }

	if( dest.elements ) dest = dest.elements;
    
    dest[ 0 ] = this.elements[ 0 ] - vec[ 0 ];
    dest[ 1 ] = this.elements[ 1 ] - vec[ 1 ];
    dest[ 2 ] = this.elements[ 2 ] - vec[ 2 ];
    
	return dest;
};


//--- Negate ---

THREE.Vector3.prototype.negate = function( dest ) {
	
    if( !dest ) { dest = this.elements; }
    
    dest[ 0 ] = -this.elements[ 0 ];
    dest[ 1 ] = -this.elements[ 1 ];
    dest[ 2 ] = -this.elements[ 2 ];

    return dest;
};


//--- Scale ---

THREE.Vector3.prototype.scale = function( val, dest ) {

    if( !dest ) {

        this.elements[ 0 ] *= val;
        this.elements[ 1 ] *= val;
        this.elements[ 2 ] *= val;
		
        return this;
    }
    
    dest[ 0 ] = this.elements[ 0 ] * val;
    dest[ 1 ] = this.elements[ 1 ] * val;
    dest[ 2 ] = this.elements[ 2 ] * val;

    return dest;
};


//--- Normalize ---	

THREE.Vector3.prototype.normalize = function( dest ) {
	
    if( !dest) { dest = this.elements; }
    
    var x   = this.elements[ 0 ]
	var y   = this.elements[ 1 ]
	var z   = this.elements[ 2 ];
    var len = Math.sqrt( x*x + y*y + z*z );
    
    if( !len ) {
		
        dest[ 0 ] = 0;
        dest[ 1 ] = 0;
        dest[ 2 ] = 0;
        return dest;
		
    } 
	else if (len == 1) {
		
        dest[ 0 ] = x;
        dest[ 1 ] = y;
        dest[ 2 ] = z;
        return dest;
    }
    
    len = 1 / len;
	
    dest[ 0 ] = x*len;
    dest[ 1 ] = y*len;
    dest[ 2 ] = z*len;
    
	return dest;
};


//--- Cross

THREE.Vector3.prototype.cross = function( vec, dest ) {
	
    if( !dest          ) dest = this.elements;
	if(  dest.elements ) dest = dest.elements;
    if(  vec.elements  ) vec  = vec.elements;
	
    var x  = this.elements[ 0 ];
	var y  = this.elements[ 1 ];
	var z  = this.elements[ 2 ];
    var x2 = vec[ 0 ]
	var y2 = vec[ 1 ]
	var z2 = vec[ 2 ];
    
    dest[ 0 ] = y * z2 - z * y2;
    dest[ 1 ] = z * x2 - x * z2;
    dest[ 2 ] = x * y2 - y * x2;
	
    return dest;
};


//--- Length ---

THREE.Vector3.prototype.length = function() {
	
    var x = vec[ 0 ];
	var y = vec[ 1 ];
	var z = vec[ 2 ];
    
	return Math.sqrt( x * x + y * y + z * z );
};


//--- Dot --

THREE.Vector3.prototype.dot = function( vec ) {
	
	return this.elements[ 0 ] * vec[ 0 ] + this.elements[ 1 ] * vec[ 1 ] + this.elements[ 2 ] * vec[ 2 ];
};


//--- Direction ---

THREE.Vector3.prototype.direction = function( vec, dest ) {
	
    if( !dest ) { dest = this.elements; }
    
    var x = this.elements[ 0 ] - vec[ 0 ];
    var y = this.elements[ 1 ] - vec[ 1 ];
    var z = this.elements[ 2 ] - vec[ 2 ];
    
    var len = Math.sqrt( x * x + y * y + z * z );
	
    if( !len ) { 
	
        dest[ 0 ] = 0; 
        dest[ 1 ] = 0; 
        dest[ 2 ] = 0;

        return dest; 
    }
    
    len = 1 / len;

    dest[ 0 ] = x * len; 
    dest[ 1 ] = y * len; 
    dest[ 2 ] = z * len;

    return dest; 
};


//--- To String ---

THREE.Vector3.prototype.toString = function() {
	
    return 'Vector3[ ' + this.elements[ 0 ] + ', ' + this.elements[ 1 ] + ', ' + this.elements[ 2 ] + ' ]'; 
};
