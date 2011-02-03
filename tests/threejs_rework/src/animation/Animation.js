var testAnimation = {

	name: 	"hello",
	fps: 	30,
	length: 10,
	JIT: 	undefined,	
	
	tree: [ 

		{
			parent: -1,
			animation: [ 
				
				{ time: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 0, 0, 0 ] },
				  
				{ time: 4,
				  rot: [ 10, 0, 0 ] },
	
				{ time: 8,
				  rot: [ 0, 0, 0 ] },
				
			]
		}, 
			
	
		{ 
			parent: 0,
			animation: [
			
				{ time: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 0, 0, 0 ] },
				  
				{ time: 5,
				  rot: [ -5, 0, 0 ] },
	
				{ time: 8,
				  rot: [ 0, 0, 0 ] },
	
			]
		}, 
			 
	
		{ 
			 parent: 1,
			 animation: [
			 
				{ time: 0,
				  pos: [ 0, 0, 0 ],
				  rot: [ 0, 0, 0 ],
				  scl: [ 0, 0, 0 ] },
				  
				{ time: 3,
				  rot: [ 5, 0, 0 ] },
	
				{ time: 6,
				  rot: [ -5, 0, 0 ] },
	
				{ time: 10,
				  rot: [ 0, 0, 0 ] },
	
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
	this.isLooping = true;
}


/*
 * Play
 */

THREE.Animation.prototype.play = function( loop, useJITCompiledData ) {

	this.isPlaying = true;
	this.startTime = new Date().getTime();
	
	// reset keyframe cache
	
	for( var t = 0; this.tree.length; t++ ) {
		
		
	}	
	
	this.update();
}

THREE.Animation.prototype.pause = function() {
	
}

THREE.Animation.prototype.stop = function() {
	
}

THREE.Animation.prototype.update = function() {
	
	var currentTime = new Date().getTime() - this.lastTime;
	
	for( var t = 0, tl = this.data.tree.length; t < lt; t++ ) {
		
		var object = this.data.tree[ t ];
		
		
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
