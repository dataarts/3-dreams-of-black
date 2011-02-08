/*
 * Animation System
 */

THREE.Animation = function( skin, data ) {
	
	this.skin      = skin;
	this.data      = data;
	this.hierarchy = [];

	this.startTime = 0;
	this.isPlaying = false;
	this.loop      = true;


	// setup hierarchy

	for( var b = 0; b < this.skin.bones.length; b++ ) {
		
		this.skin.bones[ b ].useQuaternion = true;
		this.hierarchy.push( this.skin.bones[ b ] );
	}


	// fix data
	
	for( var h = 0; h < this.data.hierarchy.length; h++ ) {
		
		for( var k = 0; k < this.data.hierarchy[ h ].keys.length; k++ ) {
		
			// remove minus times
			
			if( this.data.hierarchy[ h ].keys[ k ].time < 0 )
				this.data.hierarchy[ h ].keys[ k ].time = 0;
		
		
			// set index
			
			this.data.hierarchy[ h ].keys[ k ].index = k;
	
		
			// create quaternions
		
			if( this.data.hierarchy[ h ].keys[ k ].rot !== undefined &&
			  !(this.data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion )) {
				
				var quat = this.data.hierarchy[ h ].keys[ k ].rot;
				this.data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion( quat[0], quat[1], quat[2], quat[3] ); 
			}	
		}
	}
}


/*
 * Play
 */

THREE.Animation.prototype.play = function( loop, useJITCompiledData ) {

	this.isPlaying = true;
	this.startTime = new Date().getTime() * 0.001;
	
	
	// reset key cache
	
	for( var h = 0; h < this.hierarchy.length; h++ ) {
		
		if( this.hierarchy[ h ].prevKey === undefined ) {
			
			this.hierarchy[ h ].prevKey = { pos: 0, rot: 0, scl: 0 };
			this.hierarchy[ h ].nextKey = { pos: 0, rot: 0, scl: 0 };
		}
		
		this.hierarchy[ h ].prevKey.pos = this.data.hierarchy[ h ].keys[ 0 ];
		this.hierarchy[ h ].prevKey.rot = this.data.hierarchy[ h ].keys[ 0 ];
		this.hierarchy[ h ].prevKey.scl = this.data.hierarchy[ h ].keys[ 0 ];
		
		this.hierarchy[ h ].nextKey.pos = this.getNextKeyWith( "pos", h, 1 );
		this.hierarchy[ h ].nextKey.rot = this.getNextKeyWith( "rot", h, 1 );
		this.hierarchy[ h ].nextKey.scl = this.getNextKeyWith( "scl", h, 1 );
	}	
	
	this.update();
}

THREE.Animation.prototype.getNextKeyWith = function( type, h, key ) {
	
	var keys = this.data.hierarchy[ h ].keys;
	
	for( ; key < keys.length; key++ ) {
		
		if( keys[ key ][ type ] !== undefined )
			return keys[ key ];
	}

	return this.data.hierarchy[ h ].keys[ 0 ];
}

THREE.Animation.prototype.pause = function() {
	
}

THREE.Animation.prototype.stop = function() {
	
}

THREE.Animation.prototype.update = function() {

	// early out
	
	if( !this.isPlaying ) return;
	
	
	// update
	
	var currentTime         = new Date().getTime() * 0.001 - this.startTime;
	var unloopedCurrentTime = currentTime;
	var types               = [ "pos", "rot", "scl" ];
	var scale;
	var relative;
	var object;
	var vector;
	var prevXYZ, nextXYZ;


	// looped?
	
	if( currentTime > this.data.length ) {
		
		while( currentTime > this.data.length )
			currentTime -= this.data.length;
		
		this.startTime = new Date().getTime() * 0.001 - currentTime;
		currentTime    = new Date().getTime() * 0.001 - this.startTime;
	}

	
	for( var h = 0, hl = this.hierarchy.length; h < hl; h++ ) {
		
		object = this.hierarchy[ h ];
		
		for( var t = 0; t < 3; t++ ) {
			
			// get keys
			
			var type    = types[ t ];
			var prevKey = object.prevKey[ type ];
			var nextKey = object.nextKey[ type ];
			
			// switch keys?
						
			if( nextKey.time < unloopedCurrentTime ) {

				// did we loop?

				if( currentTime < unloopedCurrentTime ) {
					
					if( this.loop ) {
						
						prevKey = this.data.hierarchy[ h ].keys[ 0 ];
						nextKey = this.getNextKeyWith( type, h, 1 );
					}
					else {
						
						this.stop();
						return;
					}
				}
				else {
					
					do {
						
						prevKey = nextKey;
						nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );
					}
					while( nextKey.time < currentTime )
				}

				object.prevKey[ type ] = prevKey;
				object.nextKey[ type ] = nextKey;
			}
			
			
			// interpolate rot (quaternion slerp)
			
			scale   = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
			prevXYZ = prevKey[ type ];
			nextXYZ = nextKey[ type ];

			if( type === "rot" ) {

				if( scale < 0 || scale > 1 ) {
					
					console.log( "Scale out of bounds:" + scale ); 
				}

				THREE.Quaternion.slerp( prevXYZ, nextXYZ, object.quaternion, scale );
			}
			
			// lerp pos/scl 
						
			else {
				
				vector   = type === "pos" ? object.position : object.scale; 
				vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
				vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
				vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;
			}
		}
	}
}


