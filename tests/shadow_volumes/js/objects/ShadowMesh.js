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
}

THREE.ShadowMesh.prototype             = new THREE.Object3D();
THREE.ShadowMesh.prototype.constructor = THREE.ShadowMesh;
THREE.ShadowMesh.prototype.supr        = THREE.Object3D.prototype;


/*
 * Calculate
 */

THREE.ShadowMesh.prototype.calculate = function( light, extrutionLength ) {
	
	
	extrutionLength = extrutionLength || 100;
	
	
	// copy original geometry?
	
	if( this.geometry === undefined ) {
		
		this.copyGeometry( this.originalGeometry );
	}
	else {
		
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
				
				if( result = this.facesShareEdge( vertices, faceA, faceB )) {
				
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
	
	
	lightDirection.multiplyScalar( extrutionLength );

	for( var f = 0; f < faces.length; f++ ) {
		
		var face = faces[ f ];
		
		if( face.isInShadow ) {
			
			var indices;
			
			if( face instanceof THREE.Face4 )
				indices = [ "a", "b", "c", "d" ];
			else
				indices = [ "a", "b", "c" ];
			
			for( var i = 0; i < indices.length; i++ ) {
				
				// todo: add rotation of object
				
				vertices[ face[ indices[ i ]]].position.addSelf( lightDirection );
			}
		}
	}
	
	
	// add silhouette edges' faces
	
	for( var e = 0; e < edges.length; e++ ) {
		
		var edge = edges[ e ];
		
		if( edge.belongsToSilhouette )
			faces.push( edge.extrutionFace );
	}
	
	this.geometry.computeFaceNormals();
	this.geometry.sortFacesByMaterial();
}


/*
 * Faces Share Edge?
 */

THREE.ShadowMesh.prototype.facesShareEdge = function( vertices, faceA, faceB ) {

	var indicesA;
	var indicesB;
	var indexA;
	var indexB;
	var savedVertexA;
	var savedVertexB;
	var savedIndexA;
	var savedIndexB;
	var indexLetters;
	var numMatches = 0;
	
	if( faceA instanceof THREE.Face4 ) indicesA = [ "a", "b", "c", "d" ];
	else                               indicesA = [ "a", "b", "c" ];
	
	if( faceB instanceof THREE.Face4 ) indicesB = [ "a", "b", "c", "d" ];
	else                               indicesB = [ "a", "b", "c" ];
	
	
	for( var a = 0; a < indicesA.length; a++ ) {
		
		var indexA  = faceA[ indicesA[ a ]];
		var vertexA = vertices[ indexA ]; 
	
		for( var b = 0; b < indicesB.length; b++ ) {

			var indexB  = faceB[ indicesB[ b ]];
			var vertexB = vertices[ indexB ];
			
			if( Math.abs( vertexA.position.x - vertexB.position.x ) < 0.0001 &&
				Math.abs( vertexA.position.y - vertexB.position.y ) < 0.0001 &&
				Math.abs( vertexA.position.z - vertexB.position.z ) < 0.0001 ) {
			
				numMatches++;
				
				if( numMatches === 1 ) {
					
 					savedVertexA = vertexA;
 					savedVertexB = vertexB;
					savedIndexA  = indexA;
					savedIndexB  = indexB;
					indexLetters = indicesA[ a ];
				}
				
				if( numMatches === 2 ) {

					indexLetters += indicesA[ a ];
					
					if( indexLetters === "ad" || indexLetters === "ac" ) {
						
						return {
							
							faces   	: [ faceA, faceB ],
							vertices	: [ savedVertexA, vertexA, vertexB, savedVertexB ],
							indices		: [ savedIndexA,  indexA,  indexB,  savedIndexB  ],
							extrudable	: true
						};
					}
					else {
						
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
	
	this.geometry         = new THREE.Geometry();
	this.originalGeometry = originalGeometry;
	var vertices          = originalGeometry.vertices;

	for( var f = 0; f < originalGeometry.faces.length; f++ ) {
		
		var face        = originalGeometry.faces[ f ];
		var numVertices = this.geometry.vertices.length;
		var indices;

		if( face instanceof THREE.Face4 ) {
			
			indices = [ "a", "b", "c", "d" ];
			this.geometry.faces.push( new THREE.Face4( numVertices, numVertices+1, numVertices+2, numVertices+3 ));
		}
		else {
			
          	indices = [ "a", "b", "c" ];
			this.geometry.faces.push( new THREE.Face3( numVertices, numVertices+1, numVertices+2 ));
		}


		for( var i = 0; i < indices.length; i++ )
			this.geometry.vertices.push( new THREE.Vertex( vertices[ face[ indices[ i ]]].position.clone(),
														   vertices[ face[ indices[ i ]]].normal  .clone()));
	}

	this.geometry.computeFaceNormals();
}

