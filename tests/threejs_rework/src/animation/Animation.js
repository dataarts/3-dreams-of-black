var testAnimation = {

	name: 	"hello",
	fps: 	30,
	length: 8,
	JIT: 	undefined,	
	
	tree: [ 

		{
			parent: -1,
			animation: [ 
				
				{ time: 0,
				  index: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
				  
				{ time: 4,
				  index: 1,
				  rot: [ 10, 0, 0 ] },
	
				{ time: 8,
				  index: 2,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
				
			]
		}, 
			
	
		{ 
			parent: 0,
			animation: [
			
				{ time: 0,
				  index: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
				  
				{ time: 5,
				  index: 1,
				  rot: [ -5, 0, 0 ] },
	
				{ time: 8,
				  index: 2,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
	
			]
		}, 
			 
	
		{ 
			 parent: 1,
			 animation: [
			 
				{ time: 0,
				  index: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
				  
				{ time: 3,
				  index: 1,
				  rot: [ 5, 0, 0 ] },
	
				{ time: 6,
				  index: 2,
				  rot: [ -5, 0, 0 ] },
	
				{ time: 8,
				  index: 3,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 1, 1, 1 ] },
		 	]
		}
	]
}


THREE.Animation = function( root, data ) {
	
	this.root = root;
	this.data = data;
	this.tree = this.matchTree( root, data );

	this.startTime = 0;
	this.isPlaying = false;
	this.loop      = true;
	
	// TEMP
	
	this.currentTimeCounter = 0;
}


/*
 * Play
 */

THREE.Animation.prototype.play = function( loop, useJITCompiledData ) {

	this.isPlaying = true;
	this.startTime = new Date().getTime();
	
	// reset keyframe cache and set object
	
	for( var t = 0; this.tree.length; t++ ) {
		
		this.tree[ t ].prevPosKey = this.data.tree[ t ].animation[ 0 ];
		this.tree[ t ].prevRotKey = this.data.tree[ t ].animation[ 0 ];
		this.tree[ t ].prevSclKey = this.data.tree[ t ].animation[ 0 ];
		
		this.tree[ t ].nextPosKey = this.getNextKeyWith( "pos", t, 1 );
		this.tree[ t ].nextRotKey = this.getNextKeyWith( "rot", t, 1 );
		this.tree[ t ].nextSclKey = this.getNextKeyWith( "scl", t, 1 );
	}	
	
	this.update();
}

THREE.Animation.prototype.getNextKeyWith = function( type, t, key ) {
	
	var animation = this.data.tree[ t ].animation;
	
	for( ; key < animation.length; key++ ) {
		
		if( animation[ key ][ type ] !== undefined )
			return animation[ key ];
	}
}

THREE.Animation.prototype.pause = function() {
	
}

THREE.Animation.prototype.stop = function() {
	
}

THREE.Animation.prototype.update = function() {

	// early out
	
	if( !this.isPlaying ) return;
	
	
	// update
	
	var currentTime = this.currentTimeCounter++;//new Date().getTime() - this.startTime;
	
	for( var t = 0, tl = this.tree.length; t < lt; t++ ) {
		
		var object = this.tree[ t ];

		
		// switch keyframes?
		
		if( object.nextKey.time < currentTime ) {
			
			// loop or stop?
			
			if( object.nextKey.index + 1 == this.data.tree[ t ].animation.length ) {
				
				if( this.loop ) {
					
					object.prevKey = object.nextKey;
					object.nextKey = this.data.tree[ t ].animation[ 0 ];
				}
				else this.stop();
			}

			else {
				
				object.prevKey = object.nextKey;
				object.nextKey = this.data.tree[ t ].animation[ object.nextKey.index + 1 ];
			}
		}
		
		
		// interpolate and set
		
		var prevKey = object.prevKey;
		var nextKey = object.nextKey;
	}
}


/*
 * Match object3d and animation tree structures
 */

THREE.Animation.prototype.matchTree = function( root, data ) {
	
	
	// build tree from root

	var tree = [ { parent: -1, object3D: root } ];

	for( var c = 0; c < root.children.length; c++ )
		this.matchTreeRecurse( root.children[ c ], tree, 0 );


	// compare trees
	
	if( tree.length === data.tree.length ) {
		
		for( var t = 0; t < tree.length; t++ ) {
			
			if( tree[ t ].parent !== data.tree[ t ].parent ) {
				
				console.log( "THREE.Animation.matchTree: mismatch!" );
				return null;
			}
		}
	}
	else {
		
		console.log( "THREE.Animation.matchTree: mismatch" );
		return [ tree[ 0 ]];
	} 
	
	return tree;
}

THREE.Animation.prototype.matchTreeRecurse = function( root, tree, parentNumber ) {
	
	tree.push( { parent: parentNumber, object3D: root } );
	
	for( var c = 0; c < root.children.length; c++ )
		this.matchTreeRecurse( root.children[ c ], tree, parentNumber + 1 );
}
