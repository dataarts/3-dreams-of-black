/*
 * Shadow Volume
 */

THREE.ShadowVolume = function( originalMesh, material ) {
	
	THREE.Mesh.call( this, originalMesh.geometry, material );
	
	//this.position.copy( originalMesh.position );
	//this.rotation.copy( originalMesh.rotation );
	//this.scale   .copy( originalMesh.scale    );

	originalMesh.addChild( this );

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
	this.geometry.normalsFace = [];
	
	
	// copy vertices / faces from original mesh
	
	var vertexTypes = this.geometry.vertexTypes;
	var normalFaceA = this.geometry.normalsFace;
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
			normalFaceA.push( face.normal.clone());
		
		}

	}
	

	// calculate edge faces

	var result, faceA, faceB, v, vl;
	
	for( var fa = 0; fa < originalFaces.length - 1; fa++ ) {
		
		faceA = faces[ fa ];
		
		for( var fb = fa + 1; fb < originalFaces.length; fb++ ) {
			
			faceB = faces[ fb ];
			result = this.facesShareEdge( vertices, faceA, faceB );
			
			if( result !== undefined ) {

				numVertices = vertices.length;
				face = new THREE.Face4( result.indices[ 0 ], result.indices[ 3 ], result.indices[ 2 ], result.indices[ 1 ] );
				face.normal.set( 1, 0, 0 );
				faces.push( face );

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

