/*
 * Shader Program Compiler: compiles all data within a mesh to a ShaderProgram. Beware: This is magic.
 */


THREE.WebGLBatchCompiler = (function() {
	
	// cache
	
	var mesh;
	var materials;
	var geometry;
	var geometryChunks;
	var faces;
	var vertices;
	var skinWeights;
	var skinIndices;
	var uv0s;
	var uv1s;
	var colors;
	var shaderCodeInfos;
	var textureBuffers;
	var geoBuffers;
	var GL;
	
	
	//--- compile ---
	
	var compile = function( incomingMesh ) {
		
		GL             = THREE.WebGLRendererContext;
		mesh           = incomingMesh;
		materials      = mesh.materials;
		geometry       = mesh.geometry;
		geometryChunks = mesh.geometry.geometryChunks;
		faces          = mesh.geometry.faces;
		vertices       = mesh.geometry.vertices;
		skinWeights    = mesh.geometry.skinWeights;
		skinIndices    = mesh.geometry.skinIndices;
		uv0s           = mesh.geometry.uvs;
		colors         = mesh.geometry.colors;
		uv1s           = [];

		shaderCodeInfos = processShaderCode();
		textureBuffers  = processTextureMaps();
		geoBuffers      = processGeometry();
		
		mesh.webGLBatches = processWebGLBatches();
	}
		

	//--- compile shader code ---
		
	function processShaderCode() {
		
		shaderCodeInfos = [];
		
		// todo: assign base material if no exists
		// todo: compile all (but MeshShaderMaterials) into one single material 
		
		for( var m = 0; m < materials.length; m++ ) {
	
			var material = materials[ m ];
			
			if( material instanceof THREE.MeshShaderMaterial ) {
	
				shaderCodeInfos.push( new THREE.WebGLBatchCompiler.ShaderCodeInfo( [ material ], material.vertex_shader, material.fragment_shader ));
				break;	
			}
			else if( material instanceof THREE.LambertMaterial ) {
				
				shaderCodeInfos.push( new THREE.WebGLBatchCompiler.ShaderCodeInfo( [ material ], "lambertVertex", "lambertFragment" ));
				break;
			}
		}
		
		return shaderCodeInfos;
	}
	
	
	//--- process texture maps ---
	
	function processTextureMaps() {
		
		// maps processed?
	}	
	
	
	//--- process geometry chunks ---
	
	function processGeometry() {
		
		// buffers processed?
		
		if( THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ] === undefined ) {
			
			THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ] = [];	
	
			
			// loop through chunks
			
			for( chunkName in geometryChunks ) {
				
				var chunk           = geometryChunks[ chunkName ];
				var tempVertices    = [];
				var tempNormals     = [];
				var tempColors      = [];
				var tempUV0s        = [];
				var tempUV1s        = [];
				var tempSkinWeights = [];
				var tempSkinIndices = [];
				var tempFaces       = [];
				var vertexCounter   = 0;
				
				
				// loop through faces
				
				for( var f = 0; f < chunk.faces.length; f++ ) {
					
					var face          = faces[ chunk.faces[ f ]];
					var faceIndices   = face instanceof THREE.Face3 ? [ "a", "b", "c" ] : [ "a", "b", "c", "a", "c", "d" ];
					var uvIndices     = face instanceof THREE.Face3 ? [ 0, 1, 2 ]       : [ 0, 1, 2, 0, 2, 3 ];
					
					for( var i = 0; i < faceIndices.length; i++ ) {
						
						tempFaces.push( vertexCounter++ );
						
						tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.x );  
						tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.y );  
						tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.z );  
						tempVertices.push( 1 );	// pad for faster vertex shader
						
						tempNormals.push( face.normal.x );
						tempNormals.push( face.normal.y );
						tempNormals.push( face.normal.z );
						
						if( uv0s.length > 0 ) {
							
							tempUV0s.push( uv0s[ f ][ uvIndices[ i ]].u );
							tempUV0s.push( uv0s[ f ][ uvIndices[ i ]].v );
						}
						
						if( colors.length > 0 ) {

							tempColors.push( colors[ face[ faceIndices[ i ]]].r );
							tempColors.push( colors[ face[ faceIndices[ i ]]].g );
							tempColors.push( colors[ face[ faceIndices[ i ]]].b );
						}
						
						if( skinWeights.length > 0 ) {
							
							tempSkinWeights.push( skinWeights[ face[ faceIndices[ i ]]].x );
							tempSkinWeights.push( skinWeights[ face[ faceIndices[ i ]]].y );
							tempSkinWeights.push( skinWeights[ face[ faceIndices[ i ]]].z );
							tempSkinWeights.push( skinWeights[ face[ faceIndices[ i ]]].w );
	
							tempSkinIndices.push( skinIndices[ face[ faceIndices[ i ]]].x );
							tempSkinIndices.push( skinIndices[ face[ faceIndices[ i ]]].y );
							tempSkinIndices.push( skinIndices[ face[ faceIndices[ i ]]].z );
							tempSkinIndices.push( skinIndices[ face[ faceIndices[ i ]]].w );
						}
					}
				}


				// bind to GL
				
				var attributeBuffers = [];
				var elementBuffer;
				
				if( tempVertices   .length > 0 ) attributeBuffers.push( bindBuffer( "aVertices",    "vec4", tempVertices,    4 ));
				if( tempNormals    .length > 0 ) attributeBuffers.push( bindBuffer( "aNormals",     "vec3", tempNormals,     3 ));
				if( tempColors     .length > 0 ) attributeBuffers.push( bindBuffer( "aColors",      "vec3", tempColors,      3 ));
				if( tempUV0s       .length > 0 ) attributeBuffers.push( bindBuffer( "aUV0s",        "vec2", tempUV0s,        2 ));
				if( tempSkinWeights.length > 0 ) attributeBuffers.push( bindBuffer( "aSkinWeights", "vec4", tempSkinWeights, 4 ));
				if( tempSkinIndices.length > 0 ) attributeBuffers.push( bindBuffer( "aSkinIndices", "vec4", tempSkinIndices, 4 ));
				if( tempFaces      .length > 0 ) elementBuffer = bindElement( tempFaces, tempFaces.length );
				
				if( attributeBuffers.length > 0 && elementBuffer !== undefined ) {
					
					var buffers = new THREE.WebGLBatchCompiler.GLBuffers( chunkName, attributeBuffers, elementBuffer );
					THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ].push( buffers )
				}
			}
		}
		
		return THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ];
	}
	
	
	//--- helper: bind buffer ---
	
	function bindBuffer( name, type, data, size ) {
		
		var info = {};
		
		info.name   = name;
		info.type   = type;
		info.size   = size;
		info.buffer = GL.createBuffer();

		GL.bindBuffer( GL.ARRAY_BUFFER, info.buffer );
		GL.bufferData( GL.ARRAY_BUFFER, new Float32Array( data ), GL.STATIC_DRAW );
		
		return info;
	}
	
	
	//--- helper: bind elements ---
	
	function bindElement( data, size ) {
		
		var info = {};
		
		info.name   = "elements";
		info.type   = "elements";
		info.size   = size;
		info.buffer = GL.createBuffer();
				
		GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, info.buffer );
     	GL.bufferData( GL.ELEMENT_ARRAY_BUFFER, new Uint16Array( data ), GL.STATIC_DRAW );
		
		return info;
	}
	
	
	//--- process shader programs ---
	
	function processWebGLBatches() {
		
		var batches = [];
		
		for( chunkName in geometryChunks ) {
			
			var chunk = geometryChunks[ chunkName ];
			var batch;
			
			if( chunk.materials === undefined || chunk.materials[ 0 ] === undefined ) {
			
				batch = new THREE.WebGLBatch( shaderCodeInfos[ 0 ] ); // is [ 0 ] going to work?
 			}
			else {
				
				batch = new THREE.WebGLBatch( getShaderCodeInfo( chunk.materials ));
				
				// todo: match chunk.materials against shaderCodeIds[ x ].originalMaterials
			}

			// add uniform inputs that will be update on render
			
			batch.addUniformInput( "uMeshGlobalMatrix", "mat4", mesh.globalMatrix, "flatten32" );
			batch.addUniformInput( "uMeshNormalMatrix", "mat3", mesh.normalMatrix, "flatten32" );
			
			if( mesh instanceof THREE.Skin ) {

				batch.addUniformInput( "uBonesRootInverseMatrix", "mat4",      mesh.bonesRootInverse, "flatten32" );
				batch.addUniformInput( "uBoneGlobalMatrices",     "mat4Array", mesh,                  "bones"     );
				batch.addUniformInput( "uBonePoseMatrices",       "mat4Array", mesh,                  "bonePoses" );
			}
			
			
			// add sampler uniform if exists

			if( true ) {
				
				
			}


			// add attribute and element buffers
			
			for( var b = 0; b < geoBuffers.length; b++ ) {
				
				if( geoBuffers[ b ].chunkName === chunkName ) {
					
					var attributeBuffers = geoBuffers[ b ].attributeBuffers;
					var elementBuffer    = geoBuffers[ b ].elementBuffer;
					
					for( var a = 0; a < attributeBuffers.length; a++ ) {
						
						batch.addAttributeBuffer( attributeBuffers[ a ].name,
													attributeBuffers[ a ].type,
													attributeBuffers[ a ].buffer,
													attributeBuffers[ a ].size );
					}

					batch.addElementBuffer( elementBuffer.buffer, elementBuffer.size );
				}
			}

			batches.push( batch );
		}
		
		return batches;
	}
	
	
	//--- get shader code info ---
	
	function getShaderCodeInfo( materials ) {
		
		
	}
	
	
	//--- public ---
	
	return {
		
		compile: compile
	}
}());


/*
 * Dictionaries and helpers
 */

THREE.WebGLBatchCompiler.geometryBuffersDictionary = {};
THREE.WebGLBatchCompiler.textureBuffersDictionary  = {};

THREE.WebGLBatchCompiler.ShaderCodeInfo = function( originalMaterials, vertexShaderId, fragmentShaderId ) {
	
	this.originalMaterials = originalMaterials;
	this.vertexShaderId    = vertexShaderId;
	this.fragmentShaderId  = fragmentShaderId;
	this.blendMode         = "src";
	this.wireframe         = false;
}

THREE.WebGLBatchCompiler.GLBuffers = function( chunkName, attributes, elements ) {
	
	this.chunkName        = chunkName;
	this.attributeBuffers = attributes;
	this.elementBuffer    = elements;
}

