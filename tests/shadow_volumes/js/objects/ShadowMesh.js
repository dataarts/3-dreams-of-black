/*
 * Shadow Mesh
 */

THREE.ShadowMesh = function( mesh ) {
	
	THREE.Object3D.call( this );
	
	this.position.copy( mesh.position );
	this.rotation.copy( mesh.rotation );
	this.scale   .copy( mesh.scale    );
	
	this.originalGeometry = mesh.geometry;
	this.geometry         = undefined;
	
	this.indices = [ "a", "b", "c", "d" ];

}

THREE.ShadowMesh.prototype             = new THREE.Object3D();
THREE.ShadowMesh.prototype.constructor = THREE.ShadowMesh;
THREE.ShadowMesh.prototype.supr        = THREE.Object3D.prototype;


/*
 * Calculate
 */

THREE.ShadowMesh.prototype.calculate = function( light, extrusionLength ) {
	
	
	extrusionLength = extrusionLength || 100;
	
	
	// copy original geometry?
	
	if( this.geometry === undefined ) {
		
		this.copyGeometry( this.originalGeometry );

	} else {
		
		// todo: clear all extruded faces from geometry and reset back-cap position

	}

	
	// find edges?
	
	if( this.geometry.edges === undefined ) {
		
		var vertices = this.geometry.vertices;
		var faces    = this.geometry.faces;
		var edges    = this.geometry.edges      = {};
					   this.geometry.edges.list = [];
		var edge;
		var result;
		var faceA;
		var faceB;
		
		for( var fa = 0; fa < faces.length - 1; fa++ ) {
			
			faceA = faces[ fa ];
			
			for( var fb = fa + 1; fb < faces.length; fb++ ) {
				
				faceB = faces[ fb ];
				
				if( result = this.facesShareEdge( vertices, faceA, faceB ) ) {
				
					edge = new THREE.Edge( result );
				
					edges[ fa + "_" + fb ] = edge;
					edges.list.push( edge );
					
					if( faceA.edges === undefined )
						faceA.edges = [];
					
					if( faceB.edges === undefined )
						faceB.edges = [];
					
					faceA.edges.push( edge );
					faceB.edges.push( edge );

				}
			}
		}
	}
	
	
	// move faces in shadow
	
	var lightDirection = new THREE.Vector3().copy( light.position ).negate().normalize();
	var faces          = this.geometry.faces;
	var vertices       = this.geometry.vertices;
	var edges          = this.geometry.edges.list;


	for( var e = 0; e < edges.length; e++ )
		edges[ e ].markFacesInShadow( lightDirection );
	
	
	lightDirection.multiplyScalar( extrusionLength );

	var face, f, n, i, 
		fl = faces.length;
	
	for( f = 0; f < fl; f++ ) {
		
		face = faces[ f ];
		
		if( face.isInShadow ) {
			
			if( face instanceof THREE.Face4 )
				n = 4;
			else
				n = 3;
			
			for( i = 0; i < n; i++ ) {
				
				// todo: add rotation of object
				
				vertices[ face[ this.indices[ i ] ] ].position.addSelf( lightDirection );

			}

		}

	}
	
	
	// add silhouette edges' faces
	
	for( var e = 0; e < edges.length; e++ ) {
		
		var edge = edges[ e ];
		
		if( edge.belongsToSilhouette )
			faces.push( edge.extrusionFace );

	}
	
	this.geometry.computeFaceNormals();
	this.geometry.sortFacesByMaterial();

}


/*
 * Faces share edge?
 */

THREE.ShadowMesh.prototype.facesShareEdge = function( vertices, faceA, faceB ) {

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
		numMatches = 0;
	
	if( faceA instanceof THREE.Face4 ) indicesA = 4;
	else                               indicesA = 3;
	
	if( faceB instanceof THREE.Face4 ) indicesB = 4;
	else                               indicesB = 3;
	
	
	for( a = 0; a < indicesA; a++ ) {
		
		indexA  = faceA[ this.indices[ a ] ];
		vertexA = vertices[ indexA ]; 
	
		for( b = 0; b < indicesB; b++ ) {

			indexB  = faceB[ this.indices[ b ] ];
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
					indexLetters = this.indices[ a ];

				}
				
				if( numMatches === 2 ) {

					indexLetters += this.indices[ a ];
					
					if( indexLetters === "ad" || indexLetters === "ac" ) {
						
						return {
							
							faces   	: [ faceA, faceB ],
							vertices	: [ savedVertexA, vertexA, vertexB, savedVertexB ],
							indices		: [ savedIndexA,  indexA,  indexB,  savedIndexB  ],
							extrudable	: true

						};

					} else {
						
						return {
							
							faces   	: [ faceA, faceB ],
							vertices	: [ savedVertexA, savedVertexB, vertexB, vertexA  ],
							indices		: [ savedIndexA,  savedIndexB,  indexB,  indexA   ],
							extrudable	: true

						};

					}
				}
			}
		}
	}

	return undefined;

}


/*
 * Copy geometry
 * Makes sure each face has its own setup of vertices
 */

THREE.ShadowMesh.prototype.copyGeometry = function( originalGeometry ) {
	
	this.geometry = new THREE.Geometry();
	this.originalGeometry = originalGeometry;
	
	var vertices = originalGeometry.vertices,
		originalVertices = originalGeometry.vertices,
		fl = originalGeometry.faces.length,
		faces = this.geometry.faces,
		vertices = this.geometry.vertices,
		face, i, f, n, vertex, numVertices;

	for( f = 0; f < fl; f++ ) {
		
		face = originalGeometry.faces[ f ];

		numVertices = vertices.length;

		if ( face instanceof THREE.Face4 ) {
			
			n = 4;
			faces.push( new THREE.Face4( numVertices, numVertices + 1, numVertices + 2, numVertices + 3 ) );
		
		} else {
			
          	n = 3;
			faces.push( new THREE.Face3( numVertices, numVertices + 1, numVertices + 2 ) );

		}

		for( i = 0; i < n; i++ ) {
			
			vertex = originalVertices[ face[ this.indices[ i ] ] ];
			vertices.push( new THREE.Vertex( vertex.position.clone(), vertex.normal.clone() ) );

		}

	}

	this.geometry.computeFaceNormals();

}

