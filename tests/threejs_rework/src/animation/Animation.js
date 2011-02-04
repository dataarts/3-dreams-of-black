/*
 * Animation System
 */

THREE.Animation = function( root, data ) {
	
	this.root = root;
	this.data = data;
	this.hierarchy = this.matchHierarchy( root, data );

	this.startTime = 0;
	this.isPlaying = false;
	this.loop      = true;


/*	var vec = new THREE.Vector3();

	for( var h = 0; h < this.data.hierarchy.length; h++ ) {

		for( var k = 0; k < this.data.hierarchy[ h ].keys.length; k++ ) {

			if( this.data.hierarchy[ h ].keys[ k ].rot ) {

				vec.x = this.data.hierarchy[ h ].keys[ k ].rot[ 0 ];
				vec.y = this.data.hierarchy[ h ].keys[ k ].rot[ 1 ];
				vec.z = this.data.hierarchy[ h ].keys[ k ].rot[ 2 ];

				// TEMP!

				this.data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion();
				this.data.hierarchy[ h ].keys[ k ].rot.setFromEuler( vec );

				// ENDTEMP!
			}	
		}
	}
	
	return;*/
	
	for( var h = 0; h < this.data.hierarchy.length; h++ ) {
		
		for( var k = 0; k < this.data.hierarchy[ h ].keys.length; k++ ) {
		
			// set index
			
			this.data.hierarchy[ h ].keys[ k ].index = k;
		
			// create quaternions
		
			if( this.data.hierarchy[ h ].keys[ k ].rot !== undefined &&
			  !(this.data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion)) {
				
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
	this.startTime = new Date().getTime();
	
	
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
	
	console.log( "THREE.Animation.getNextKeyWith: missing " + type + " in animation " + this.data.name );
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
	
	var currentTime         = ( new Date().getTime() - this.startTime ) * 0.001;
	var unloopedCurrentTime = currentTime;
	var types               = [ "pos", "rot", "scl" ];
	var scale;
	var relative;
	var object;
	var vector;
	var prevXYZ, nextXYZ;


	// looped?
	
	if( currentTime >= this.data.length ) {
		
		this.startTime = new Date().getTime() - ( currentTime - this.data.length ) * 1000;
		currentTime = ( new Date().getTime() - this.startTime ) * 0.001;
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

				if( nextKey.time >= this.data.length ) {
					
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
					
					prevKey = nextKey;
					nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );
				}

				object.prevKey[ type ] = prevKey;
				object.nextKey[ type ] = nextKey;
			}
			
			
			// interpolate rot (quaternion slerp)
			
			scale   = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
			prevXYZ = prevKey[ type ];
			nextXYZ = nextKey[ type ];

			if( type === "rot" ) {
				
				THREE.Quaternion.slerp( prevXYZ, nextXYZ, object.object3D.quaternion, scale );
			}
			
			// lerp pos/scl 
						
			else {
				
				vector   = type === "pos" ? object.object3D.position : object.object3D.scale; 
				vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
				vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
				vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;
			}
		}
	}
}



/*
 * Match object3d and animation hierarchy structures
 */

THREE.Animation.prototype.matchHierarchy = function( root, data ) {
	
	// build hierarchy from root

	var hierarchy = [ { parent: -1, object3D: root } ];

	for( var c = 0; c < root.children.length; c++ )
		this.matchHierarchyRecurse( root.children[ c ], hierarchy, 0 );


	// compare hierarchys
	
	if( hierarchy.length === data.hierarchy.length ) {
		
		for( var t = 0; t < hierarchy.length; t++ ) {
			
			if( hierarchy[ t ].parent !== data.hierarchy[ t ].parent ) {
				
				console.log( "THREE.Animation.matchhierarchy: mismatch!" );
				return null;
			}
		}
	}
	else {
		
		console.log( "THREE.Animation.matchhierarchy: mismatch" );
		return [ hierarchy[ 0 ]];
	} 
	
	return hierarchy;
}


THREE.Animation.prototype.matchHierarchyRecurse = function( root, hierarchy, parentNumber ) {
	
	hierarchy.push( { parent: parentNumber, object3D: root } );
	
	for( var c = 0; c < root.children.length; c++ )
		this.matchHierarchyRecurse( root.children[ c ], hierarchy, parentNumber + 1 );
}
