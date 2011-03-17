/*
 * Shadow Volume
 */

THREE.ShadowVolume = function( originalMesh, material ) {
	
	THREE.Mesh.call( this, originalMesh.geometry, material );
	
	this.position.copy( originalMesh.position );
	this.rotation.copy( originalMesh.rotation );
	this.scale   .copy( originalMesh.scale    );

	this.calculateShadowVolumeGeometry();

}

THREE.ShadowVolume.prototype             = new THREE.Mesh();
THREE.ShadowVolume.prototype.constructor = THREE.ShadowVolume;
THREE.ShadowVolume.prototype.supr        = THREE.Mesh.prototype;



/*
 * calculateGeometry
 */

THREE.ShadowVolume.prototype.calculateShadowVolumeGeometry = function() {
	
	var originalGeometry = this.geometry;
	
	this.geometry = new THREE.Geometry();
	this.geometry.vertexTypes = [];
	this.geometry.normalsFaceA = [];
	this.geometry.normalsFaceB = [];
	
	
	// copy vertices / faces from original mesh
	
	var vertexTypes = this.geometry.vertexTypes;
	var normalFaceA = this.geometry.normalsFaceA;
	var normalFaceB = this.geometry.normalsFaceB;
	var vertices    = this.geometry.vertices;
	var	faces       = this.geometry.faces;

	var originalFaces    = originalGeometry.faces;	
	var originalVertices = originalGeometry.vertices;
	var	fl               = originalFaces.length;
	
	var	originalFace, face, i, f, n, vertex, numVertices;
	var indices = [ "a", "b", "c", "d" ];


	for( f = 0; f < fl; f++ ) {
		
		numVertices = vertices.length;
		originalFace = originalFaces[ f ];

		if ( originalFace instanceof THREE.Face4 ) {
			
			n = 4;
			face = new THREE.Face4( numVertices, numVertices + 1, numVertices + 2, numVertices + 3 );
		
		} else {
			
          	n = 3;
			face = new THREE.Face3( numVertices, numVertices + 1, numVertices + 2 );
		}

		face.normal.copy( originalFace.normal );
		faces.push( face );


		for( i = 0; i < n; i++ ) {
			
			vertex = originalVertices[ originalFace[ indices[ i ]]];
			vertices.push( new THREE.Vertex( vertex.position.clone(), vertex.normal.clone() ) );
			vertexTypes.push( 0 );
			normalFaceA.push( face.normal.clone());
			normalFaceB.push( face.normal.clone());
		
		}

	}
	
/*
	// spatial 

	var verticesSpatial = [];
	var position, x, y, z;
	var indices = [ "a", "b", "c", "d" ];
	var f, fl;
	var i, il = indices.length;
	var v, vl;
	var face;
	var offsetX = 0, offsetY = 0, offsetZ = 0;

	for( v = 0, vl = originalVertices.length; v < vl; v++ ) {
		
		position = originalVertices[ v ].position;
		offsetX = Math.min( offsetX, position.x );
		offsetY = Math.min( offsetY, position.y );
		offsetZ = Math.min( offsetZ, position.z );
	}

	offsetX = -offsetX;
	offsetY = -offsetY;
	offsetZ = -offsetZ;


	for( f = 0, fl = originalFaces.length; f < fl; f++ ) {
		
		face = faces[ f ];
		
		for( i = 0; i < il; i++ ) {
			
			if( face[ indices[ i ]] !== undefined ) {
				
				position = vertices[ face[ indices[ i ]]].position;
				
				x = parseInt( position.x, 10 ) + offsetX;		// this can potentially fail if vertices is not exactly on the same position
				y = parseInt( position.y, 10 ) + offsetY;
				z = parseInt( position.z, 10 ) + offsetZ;
				
				if( verticesSpatial[ x ] === undefined )
					verticesSpatial[ x ] = [];
				
				if( verticesSpatial[ x ][ y ] === undefined )
					verticesSpatial[ x ][ y ] = [];
					
				if( verticesSpatial[ x ][ y ][ z ] === undefined )
					verticesSpatial[ x ][ y ][ z ] = [];
		
				verticesSpatial[ x ][ y ][ z ].push( f ); 
				
			}
			
		}
		
	}


	// find and create edge faces

	var result, faceA, faceB, v, vl, fa, fb, fbi, faceList, faceListLen;
	var addedEdges = {};

	for( fa = 0, fl = originalFaces.length; fa < fl; fa++ ) {
		
		faceA = faces[ fa ];
		
		for( i = 0; i < il; i++ ) {
			
			if( faceA[ indices[ i ]] !== undefined ) {
				
				position = vertices[ faceA[ indices[ i ]]].position;
				
				x = parseInt( position.x, 10 ) + offsetX;
				y = parseInt( position.y, 10 ) + offsetY;
				z = parseInt( position.z, 10 ) + offsetZ;

				faceList = verticesSpatial[ x ][ y ][ z ];

				for( fb = 0, faceListLen = faceList.length; fb < faceListLen; fb++ ) {
					
					fbi = faceList[ fb ];

					if( fbi != fa && addedEdges[ fa + "_" + fbi ] === undefined ) {
						
						faceB = faces[ fbi ];
						result = this.facesShareEdge( vertices, faceA, faceB );
						
						if( result !== undefined ) {
			
							addedEdges[ fa  + "_" + fbi ] = 1;
							addedEdges[ fbi + "_" + fa  ] = 1;
			
							numVertices = vertices.length;
							face = new THREE.Face4( numVertices, numVertices + 1, numVertices + 2, numVertices + 3 );
							face.normal.set( 1, 0, 0 );
							faces.push( face );
							
							
							for( v = 0, vl = result.vertices.length; v < vl; v++ ) {
								
								vertices.push( new THREE.Vertex( result.vertices[ v ].position.clone() ));
								vertexTypes.push( result.vertexTypes[ v ] );
								normalFaceA.push( faceA.normal.clone());
								normalFaceB.push( faceB.normal.clone());
			
							}
			
						}

					}
					
				}
				
			}
			
		}
		
	}
*/

	// WORKS!
	// calculate edge faces

	var result, faceA, faceB, v, vl;
	
	for( var fa = 0; fa < originalFaces.length - 1; fa++ ) {
		
		faceA = faces[ fa ];
		
		for( var fb = fa + 1; fb < originalFaces.length; fb++ ) {
			
			faceB = faces[ fb ];
			result = this.facesShareEdge( vertices, faceA, faceB );
			
			if( result !== undefined ) {

				numVertices = vertices.length;
				face = new THREE.Face4( numVertices, numVertices + 1, numVertices + 2, numVertices + 3 );
				face.normal.set( 1, 0, 0 );
				faces.push( face );
				
				
				for( v = 0, vl = result.vertices.length; v < vl; v++ ) {
					
					vertices.push( new THREE.Vertex( result.vertices[ v ].position.clone() ));
					vertexTypes.push( result.vertexTypes[ v ] );
					normalFaceA.push( faceA.normal.clone());
					normalFaceB.push( faceB.normal.clone());

				}

			}

		}

	}
	
	// create geom chunks
	
	this.geometry.sortFacesByMaterial();	

}



/*
 * Faces share edge?
 */

THREE.ShadowVolume.prototype.facesShareEdge = function( vertices, faceA, faceB ) {

	var indicesA,
		indicesB,
		indexA,
		indexB,
		vertexA,
		vertexB,
		savedVertexA,
		savedVertexB,
		savedIndexA,
		savedIndexB,
		indexLetters,
		a, b,
		numMatches = 0,
		indices = [ "a", "b", "c", "d" ];
	
	if( faceA instanceof THREE.Face4 ) indicesA = 4;
	else                               indicesA = 3;
	
	if( faceB instanceof THREE.Face4 ) indicesB = 4;
	else                               indicesB = 3;
	
	
	for( a = 0; a < indicesA; a++ ) {
		
		indexA  = faceA[ indices[ a ] ];
		vertexA = vertices[ indexA ];
	
		for( b = 0; b < indicesB; b++ ) {

			indexB  = faceB[ indices[ b ] ];
			vertexB = vertices[ indexB ];
			
			if( Math.abs( vertexA.position.x - vertexB.position.x ) < 0.0001 &&
				Math.abs( vertexA.position.y - vertexB.position.y ) < 0.0001 &&
				Math.abs( vertexA.position.z - vertexB.position.z ) < 0.0001 ) {
			
				numMatches++;
				
				if( numMatches === 1 ) {
					
 					savedVertexA = vertexA;
 					savedVertexB = vertexB;
					savedIndexA  = indexA;
					savedIndexB  = indexB;
					indexLetters = indices[ a ];

				}
				
				if( numMatches === 2 ) {

					indexLetters += indices[ a ];
					
					if( indexLetters === "ad" || indexLetters === "ac" ) {
						
						return {
							
							faces   	: [ faceA, faceB ],
							vertices	: [ savedVertexA, savedVertexB, vertexB, vertexA  ],
							indices		: [ savedIndexA,  savedIndexB,  indexB,  indexA   ],
							vertexTypes	: [ 1, 2, 2, 1 ],
							extrudable	: true

						};

					} else {
						
						return {
							
							faces   	: [ faceA, faceB ],
							vertices	: [ savedVertexA, vertexA, vertexB, savedVertexB ],
							indices		: [ savedIndexA,  indexA,  indexB,  savedIndexB  ],
							vertexTypes	: [ 1, 1, 2, 2 ],
							extrudable	: true

						};

					}
					
				}
				
			}
			
		}
		
	}

	return undefined;

}

