/*
 * Creates shadow volumes
 */

THREE.ShadowVolume = (function() {
	
	var that = {};

	//--- Create From Scene ---

	that.createFromScene = function( scene ) {
		
		
	}

	
	//--- Create From Object ---
	
	that.createFromObject = function( object, lights ) {
		
		if( object instanceof THREE.Mesh ) {

			// get neighbors

			var edges    = [];
			var vertices = object.geometry.vertices;
			var faces    = object.geometry.faces;
			
			for( var f = 0; f < faces.length; f++ )
				faces[ f ].edges = getEdges( vertices, faces, faces[ f ] );
			
			
			// loop through all lights
			
/*			for( var l = 0; l < lights.length; l++ ) {
				
				// find silhouettes
				
				
			}*/
		}
	}
	
	
	//--- get other face ---
	
	var getEdges = function( vertices, faces, currentFace ) {

		var edges = [];
		
		for( var f = 0; f < faces.length; f++ ) {
			
			var face = faces[ f ];
			
			if( face !== currentFace ) {
				
				var result = findCommonVertices( vertices, face, currentFace );
				
				if( result !== undefined ) 
					edges.push( new THREE.Edge( face, currentFace, result.vertexA, result.vertexB ));
			}
		}
		
		return edges;
	}


	//--- Has Two Vertices in Common ---

	var findCommonVertices = function( vertices, faceA, faceB ) {
		
		var indicesA;
		var indicesB;
		var savedVertexA;
		var numMatches = 0;
		
		if( faceA instanceof THREE.Face4 ) indicesA = [ "a", "b", "c", "d" ];
		else                               indicesA = [ "a", "b", "c" ];
		
		if( faceB instanceof THREE.Face4 ) indicesB = [ "a", "b", "c", "d" ];
		else                               indicesB = [ "a", "b", "c" ];
		
		for( var a = 0; a < indicesA.length; a++ ) {
			
			var vertexA = vertices[ faceA[ indicesA[ a ]]]; 
		
			for( var b = 0; b < indicesB.length; b++ ) {

				var vertexB = vertices[ faceB[ indicesB[ b ]]];
				
				if( Math.abs( vertexA.position.x - vertexB.position.x ) < 0.0001 &&
					Math.abs( vertexA.position.y - vertexB.position.y ) < 0.0001 &&
					Math.abs( vertexA.position.z - vertexB.position.z ) < 0.0001 ) {
				
					numMatches++;
					
					if( numMatches === 1 )
						savedVertexA = vertexA;
					
					if( numMatches === 2 ) {
						
						return { 
							vertexA: savedVertexA, 
							vertexB: vertexB 
						};
					}
				}
			}
		}
	
		return undefined;
	}
	
	return that;
}());
