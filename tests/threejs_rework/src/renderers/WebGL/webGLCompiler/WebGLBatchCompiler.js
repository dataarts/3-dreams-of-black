/*
 * Shader Program Compiler: compiles all data within a mesh to a ShaderProgram. 
 * Beware: This is all magic.
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
	var skinVerticesA;
	var skinVerticesB;
	var skinVerticesC;
	var skinVerticesD;
	var uv0s;
	var uv1s;
	var colors;
	var shaderCodeInfos;
	var textureBuffers;
	var geoBuffers;
	var GL;
	var doLog;
	var shadowVertexTypes;
	var shadowNormalsFaceA;
	var shadowNormalsFaceB;
	
	//--- compile ---
	
	var compile = function( incomingMesh, _doLog ) {
		
		doLog = _doLog || false;
		
		var ms = new Date().getTime();	
		log( "THREE.WebGLBatchCompiler.compile: Start" );
		
		GL             = THREE.WebGLRenderer.Cache.currentGL;
		mesh           = incomingMesh;
		materials      = mesh.materials;
		geometry       = mesh.geometry;
		geometryChunks = mesh.geometry.geometryChunks;
		faces          = mesh.geometry.faces;
		vertices       = mesh.geometry.vertices;
		skinWeights    = mesh.geometry.skinWeights;
		skinIndices    = mesh.geometry.skinIndices;
		skinVerticesA  = mesh.geometry.skinVerticesA;
		skinVerticesB  = mesh.geometry.skinVerticesB;
		skinVerticesC  = mesh.geometry.skinVerticesC;
		skinVerticesD  = mesh.geometry.skinVerticesD;
		uv0s           = mesh.geometry.uvs;
		uv1s           = [];
		colors         = mesh.geometry.colors;
		shadowNormalsFaceA = mesh.geometry.normalsFace !== undefined ? mesh.geometry.normalsFace : [];

		if( checkBatchCache()) {
			
			log( "THREE.WebGLBatchCompiler.compile: End. Cloning existing." );		
			return;
		}

		shaderCodeInfos         = processShaderCode();
		shaderCodeInfos         = processTextureMaps();
		geoBuffers              = processGeometry();
		mesh.webGLBatches       = processWebGLBatches();
		mesh.webGLIsTransparent = processIsTransparent(); 

		addToBatchCache();

		log( "THREE.WebGLBatchCompiler.compile: End. Took " + ( new Date().getTime() - ms ) + " ms." );		
	}
		
	var log = function( msg ) {
		
		if( doLog )
			console.log( msg );
	}
	
	
	//--- process blend mode ---
	
	function processIsTransparent() {
		
		var numTransparent = 0;
		
		for( var b = 0; b < mesh.webGLBatches.length; b++ ) 
			if( mesh.webGLBatches[ b ].blendMode !== THREE.WebGLRendererBlendModes.none )
				numTransparent++;
		
		
		// transparent?
		
		if( numTransparent !== 0 ) {
			
			// partly transparent? Then sort so opaque batches are rendered first
			
			if( numTransparent !== mesh.webGLBatches.length ) {
				
				var sortedBatches = [];
				
				for( var b = 0; b < mesh.webGLBatches.length; b++ )
					if( mesh.webGLBatches[ b ].blendMode === THREE.WebGLRendererBlendModes.none )
						sortedBatches.push( mesh.webGLBatches[ b ] );
						
				for( var b = 0; b < mesh.webGLBatches.length; b++ )
					if( mesh.webGLBatches[ b ].blendMode !== THREE.WebGLRendererBlendModes.none )
						sortedBatches.push( mesh.webGLBatches[ b ] );
						
				mesh.webGLBatches = sortedBatches;
			}
			
			return true;
		}
		
		return false;
	}


	//--- compile shader code ---
		
	function processShaderCode() {
		
		// set geometry.materials on all chunks that don't have materials
		// remove all other materials on a chunk if one of them is a MeshShaderMaterial as
		// it cannot compile properly with others
		
		for( var chunkName in geometryChunks ) {
			
			var chunk = geometryChunks[ chunkName ];
			
			if( chunk.materials.length === 0 || chunk.materials[ 0 ] === undefined )
				chunk.materials = materials;
				
			for( var m = 0; m < chunk.materials.length; m++ ) {
				
				if( chunk.materials[ m ] instanceof THREE.MeshShaderMaterial ) {
					
					chunk.materials = [ chunk.materials[ m ]];
					break;
				}
			}
		}


		// create materials
		
		shaderCodeInfos = [];

		for( var chunkName in geometryChunks ) {
			
			var chunk = geometryChunks[ chunkName ];
			
			// check so not exist
			
			for( var s = 0; s < shaderCodeInfos.length; s++ ) {
				
				if( shaderCodeInfos[ s ].originalMaterials === chunk.materials )
					break;
			}
			
			
			// create material
			
			if( s === shaderCodeInfos.length ) {
				
				if( chunk.materials[ 0 ] instanceof THREE.MeshShaderMaterial ) {
					
					shaderCodeInfos.push( new THREE.WebGLBatchCompiler.ShaderCodeInfo( chunk.materials, chunk.materials[ 0 ].vertex_shader, chunk.materials[ 0 ].fragment_shader ));
				}
				else {
					
					THREE.WebGLBatchCompilerMaterials.compile( chunk.materials, mesh instanceof THREE.Skin );
					shaderCodeInfos.push( new THREE.WebGLBatchCompiler.ShaderCodeInfo( chunk.materials, THREE.WebGLBatchCompilerMaterials.vertexShaderId, THREE.WebGLBatchCompilerMaterials.fragmentShaderId ));
				}
			}
		}
		
		return shaderCodeInfos;
	}
	
	
	//--- process texture maps ---
	
	function processTextureMaps() {
		
		var textures = [];
		
		for( var s = 0; s < shaderCodeInfos.length; s++ ) {
			
			for( var m = 0; m < shaderCodeInfos[ s ].originalMaterials.length; m++ ) {
				
				var material = shaderCodeInfos[ s ].originalMaterials[ m ];
				
				if( material.map !== undefined && material.map !== null )
					bindTexture( material.map, shaderCodeInfos[ s ], "uMap0" );
				
				if( material.env_map !== undefined && material.env_map !== null )
					bindTexture( material.env_map, shaderCodeInfos[ s ], "uEnvMap" );
			}
		}

		return shaderCodeInfos;
	}	

	function bindTexture( texture, shaderCodeInfo, uniform ) {

		// early out

		if( texture.image === undefined || texture.image.src === undefined )
			return;
		
		
		// check if already added
		
		for( var s = 0; s < shaderCodeInfos.length; s++ ) {
			
			if( shaderCodeInfos[ s ].originalTextures[ uniform ]           !== -1 && 
				shaderCodeInfos[ s ].originalTextures[ uniform ].image     !== undefined && 
				shaderCodeInfos[ s ].originalTextures[ uniform ].image.src !== undefined && 
				shaderCodeInfos[ s ].originalTextures[ uniform ].image.src === texture.image.src ) {

				shaderCodeInfo.originalTextures[ uniform ] = shaderCodeInfos[ s ].originalTextures[ uniform ];
				shaderCodeInfo.textureBuffers  [ uniform ] = shaderCodeInfos[ s ].textureBuffers  [ uniform ];
				return;
			}
		}
		
		// add
		
		shaderCodeInfo.originalTextures[ uniform ] = texture;
		shaderCodeInfo.textureBuffers  [ uniform ] = GL.createTexture();
		
		GL.bindTexture   ( GL.TEXTURE_2D, shaderCodeInfo.textureBuffers[ uniform ] );
	    GL.texImage2D    ( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image );
		GL.texParameteri ( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, convertThreeParameterToGL( texture.wrap_s ));
		GL.texParameteri ( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, convertThreeParameterToGL( texture.wrap_t ));

		GL.texParameteri ( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, convertThreeParameterToGL( texture.mag_filter ));
		GL.texParameteri ( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, convertThreeParameterToGL( texture.min_filter ));
		GL.generateMipmap( GL.TEXTURE_2D );
		GL.bindTexture   ( GL.TEXTURE_2D, null );

		log( "--> THREE.WebGLBatchCompiler.bindTexture: src=" + texture.image.src + " size=" + texture.image.width + "x" + texture.image.height );
	}
	
	

	//--- process geometry chunks ---
	
	function processGeometry() {
		
		// buffers processed?
		
		if( THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ] === undefined ) {
			
			THREE.WebGLBatchCompiler.geometryBuffersDictionary[ geometry.id ] = [];	
	
			
			// loop through chunks
			
			for( chunkName in geometryChunks ) {
				
				var chunk           	= geometryChunks[ chunkName ];
				var tempVertices    	= [];
				var tempNormals     	= [];
				var tempColors      	= [];
				var tempUV0s        	= [];
				var tempUV1s        	= [];
				var tempSkinWeights 	= [];
				var tempSkinIndices 	= [];
				var tempSkinVerticesA 	= [];
				var tempSkinVerticesB 	= [];
				var tempShadowVertexTypes = [];
				var tempShadowNormalsFaceA = [];
				var tempShadowNormalsFaceB = [];
				var tempFaces       	= [];
				var vertexCounter   	= 0;
				
				
				if( mesh instanceof THREE.ShadowVolume ) {
					
					for( var f = 0; f < chunk.faces.length; f++ ) {
						
						var face          = faces[ chunk.faces[ f ]];
						var faceIndices   = face instanceof THREE.Face3 ? [ "a", "b", "c" ] : [ "a", "b", "c", "d" ];
						var uvIndices     = face instanceof THREE.Face3 ? [ 0, 1, 2 ]       : [ 0, 1, 2, 3 ];
	
						if( face instanceof THREE.Face3 ) {
							
							tempFaces.push( face.a );
							tempFaces.push( face.b );
							tempFaces.push( face.c );
						}
						else {
							
							tempFaces.push( face.a );
							tempFaces.push( face.b );
							tempFaces.push( face.c );
	
							tempFaces.push( face.a );
							tempFaces.push( face.c );
							tempFaces.push( face.d );
						}
					}
	
					for( var i = 0; i < vertices.length; i++ ) {
					
						tempVertices.push( vertices[ i ].position.x );  
						tempVertices.push( vertices[ i ].position.y );  
						tempVertices.push( vertices[ i ].position.z );  
						tempVertices.push( 1 );	

						tempShadowNormalsFaceA.push( shadowNormalsFaceA[ i ].x );
						tempShadowNormalsFaceA.push( shadowNormalsFaceA[ i ].y );
						tempShadowNormalsFaceA.push( shadowNormalsFaceA[ i ].z );
					}
	
					
				} else {
					
					
					// loop through faces
					
					for( var f = 0; f < chunk.faces.length; f++ ) {
						
						var face          = faces[ chunk.faces[ f ]];
						var faceIndices   = face instanceof THREE.Face3 ? [ "a", "b", "c" ] : [ "a", "b", "c", "d" ];
						var uvIndices     = face instanceof THREE.Face3 ? [ 0, 1, 2 ]       : [ 0, 1, 2, 3 ];
	
						if( face instanceof THREE.Face3 ) {
							
							tempFaces.push( vertexCounter + 0 );
							tempFaces.push( vertexCounter + 1 );
							tempFaces.push( vertexCounter + 2 );
						}
						else {
							
							tempFaces.push( vertexCounter + 0 );
							tempFaces.push( vertexCounter + 1 );
							tempFaces.push( vertexCounter + 2 );
	
							tempFaces.push( vertexCounter + 0 );
							tempFaces.push( vertexCounter + 2 );
							tempFaces.push( vertexCounter + 3 );
						}
	 					
						for( var i = 0; i < faceIndices.length; i++ ) {
							
							vertexCounter++;
							
							if( skinWeights.length == 0 ) {
								
								tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.x );  
								tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.y );  
								tempVertices.push( vertices[ face[ faceIndices[ i ]]].position.z );  
								tempVertices.push( 1 );				// pad for faster vertex shader
									
								tempNormals.push( face.normal.x );
								tempNormals.push( face.normal.y );
								tempNormals.push( face.normal.z );
							}
							
					
						
							
							if( uv0s.length > 0 ) {
								
								tempUV0s.push( uv0s[ chunk.faces[ f ] ][ uvIndices[ i ]].u );
								tempUV0s.push( uv0s[ chunk.faces[ f ] ][ uvIndices[ i ]].v );
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
	
								tempSkinVerticesA.push( skinVerticesA[ face[ faceIndices[ i ]]].x );  
								tempSkinVerticesA.push( skinVerticesA[ face[ faceIndices[ i ]]].y );  
								tempSkinVerticesA.push( skinVerticesA[ face[ faceIndices[ i ]]].z );  
								tempSkinVerticesA.push( 1 );			// pad for faster vertex shader
	
								tempSkinVerticesB.push( skinVerticesB[ face[ faceIndices[ i ]]].x );  
								tempSkinVerticesB.push( skinVerticesB[ face[ faceIndices[ i ]]].y );  
								tempSkinVerticesB.push( skinVerticesB[ face[ faceIndices[ i ]]].z );  
								tempSkinVerticesB.push( 1 );			// pad for faster vertex shader
								
								// todo: insert more influences
							}
						}
					}
				}



				// bind to GL
				
				var attributeBuffers = [];
				var elementBuffer;
				
				if( tempVertices     .length > 0 ) attributeBuffers.push( bindBuffer( "aVertex",      "vec4", tempVertices,    	 4 ));
				if( tempNormals      .length > 0 ) attributeBuffers.push( bindBuffer( "aNormal",      "vec3", tempNormals,     	 3 ));
				if( tempColors       .length > 0 ) attributeBuffers.push( bindBuffer( "aColor",       "vec3", tempColors,      	 3 ));
				if( tempUV0s         .length > 0 ) attributeBuffers.push( bindBuffer( "aUV0",         "vec2", tempUV0s,        	 2 ));
				if( tempSkinWeights  .length > 0 ) attributeBuffers.push( bindBuffer( "aSkinWeights", "vec4", tempSkinWeights, 	 4 ));
				if( tempSkinIndices  .length > 0 ) attributeBuffers.push( bindBuffer( "aSkinIndices", "vec4", tempSkinIndices, 	 4 ));
				if( tempSkinVerticesA.length > 0 ) attributeBuffers.push( bindBuffer( "aSkinVertexA", "vec4", tempSkinVerticesA, 4 ));
				if( tempSkinVerticesB.length > 0 ) attributeBuffers.push( bindBuffer( "aSkinVertexB", "vec4", tempSkinVerticesB, 4 ));

			//	if( tempShadowVertexTypes.length > 0 ) attributeBuffers.push( bindBuffer( "aShadowVertexType", "float", tempShadowVertexTypes, 1 ));
				if( tempShadowNormalsFaceA.length > 0 ) attributeBuffers.push( bindBuffer( "aShadowNormalA", "vec3", tempShadowNormalsFaceA, 3 ));
			//	if( tempShadowNormalsFaceB.length > 0 ) attributeBuffers.push( bindBuffer( "aShadowNormalB", "vec3", tempShadowNormalsFaceB, 3 ));

				if( tempFaces.length > 0 ) elementBuffer = bindElement( tempFaces, tempFaces.length );
				
				
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
		
		log( "--> THREE.WebGLBatchCompiler.bindBuffer: " + name + " numElements=" + ( data.length / size ));

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
		
		log( "--> THREE.WebGLBatchCompiler.bindElement: numElements=" + ( data.length / 3 ));
		
		return info;
	}
	
	
	//--- process shader programs ---
	
	function processWebGLBatches() {
		
		var batches = [];
		
		for( chunkName in geometryChunks ) {
			
			var chunk          = geometryChunks[ chunkName ];
			var shaderCodeInfo = getShaderCodeInfo( chunk.materials );
			var batch          = new THREE.WebGLBatch( shaderCodeInfo );
			
			
			// handle skin/mesh
			
			if( mesh instanceof THREE.Skin ) {

				batch.addUniformInput( "uMeshGlobalMatrix", "mat4", mesh.globalMatrix, "flatten32" );
				batch.addUniformInput( "uBoneGlobalMatrices", "mat4Array", mesh, "boneMatrices" );
			}
			else {
				
				batch.addUniformInput( "uMeshGlobalMatrix", "mat4", mesh.globalMatrix, "flatten32" );
				batch.addUniformInput( "uMeshNormalMatrix", "mat3", mesh.normalMatrix, "flatten32" );
			}

			
			
			
			// add sampler uniform if exists

			for( var uniform in shaderCodeInfo.textureBuffers ) {
				
				if( shaderCodeInfo.textureBuffers[ uniform ] !== -1 ) 
					batch.addTexture( uniform, shaderCodeInfo.textureBuffers[ uniform ] );
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
					break;
				}
			}

			batches.push( batch );
		}
		
		log( "--> THREE.WebGLBatchCompiler.processWebGLBatches: numBatches=" + batches.length );

		return batches;
	}
	
	
	//--- get shader code info ---
	
	function getShaderCodeInfo( originalMaterials ) {
		
		for( var i = 0; i < shaderCodeInfos.length; i++ ) {
			
			if( shaderCodeInfos[ i ].originalMaterials == originalMaterials )
				return shaderCodeInfos[ i ];
		}
		
		return shaderCodeInfos[ 0 ];
	}


	//--- conversion helper ---

	function convertThreeParameterToGL( p ) {

		switch( p ) {

			case THREE.RepeatWrapping: 				return GL.REPEAT; 					break;
			case THREE.ClampToEdgeWrapping: 		return GL.CLAMP_TO_EDGE; 			break;
			case THREE.MirroredRepeatWrapping: 		return GL.MIRRORED_REPEAT; 			break;

			case THREE.NearestFilter: 				return GL.NEAREST; 					break;
			case THREE.NearestMipMapNearestFilter: 	return GL.NEAREST_MIPMAP_NEAREST; 	break;
			case THREE.NearestMipMapLinearFilter: 	return GL.NEAREST_MIPMAP_LINEAR; 	break;

			case THREE.LinearFilter: 				return GL.LINEAR; 					break;
			case THREE.LinearMipMapNearestFilter: 	return GL.LINEAR_MIPMAP_NEAREST;	break;
			case THREE.LinearMipMapLinearFilter: 	return GL.LINEAR_MIPMAP_LINEAR; 	break;

			case THREE.ByteType: 					return GL.BYTE; 					break;
			case THREE.UnsignedByteType: 			return GL.UNSIGNED_BYTE; 			break;
			case THREE.ShortType: 					return GL.SHORT; 					break;
			case THREE.UnsignedShortType: 			return GL.UNSIGNED_SHORT; 			break;
			case THREE.IntType: 					return GL.INT; 						break;
			case THREE.UnsignedShortType: 			return GL.UNSIGNED_INT; 			break;
			case THREE.FloatType: 					return GL.FLOAT; 					break;

			case THREE.AlphaFormat: 				return GL.ALPHA; 					break;
			case THREE.RGBFormat: 					return GL.RGB; 						break;
			case THREE.RGBAFormat: 					return GL.RGBA; 					break;
			case THREE.LuminanceFormat:		 		return GL.LUMINANCE; 				break;
			case THREE.LuminanceAlphaFormat: 		return GL.LUMINANCE_ALPHA; 			break;
		}

		return 0;
	};
	
	
	//--- Add to batch cache ---
	
	function addToBatchCache() {
		
		THREE.WebGLBatchCompiler.batchCache.push( new THREE.WebGLBatchCompiler.batchCacheObject( geometry, materials, mesh.webGLBatches, mesh.webGLIsTransparent ));
	}

	

	//--- check batch cache ---
	
	function checkBatchCache() {
		
		var cache = THREE.WebGLBatchCompiler.batchCache;
		
		for( var c = 0; c < cache.length; c++ ) {
			
			if( geometry === cache[ c ].geometry &&	materials.length === cache[ c ].materials.length ) {
				
				var allMatch = true;
				
				for( var m = 0; m < materials.length; m++ ) {
					
					if( materials[ m ] !== cache[ c ].materials[ m ] ) {
						
						allMatch = false;
						break;
					}
				}
	
				if( allMatch ) {
					
					var batches = [];
					
					for( var b = 0; b < cache[ c ].webGLBatches.length; b++ ) {
						
						batches[ b ] = new THREE.WebGLBatch( cache[ c ].webGLBatches[ b ] );
			
						if( mesh instanceof THREE.Skin ) {
			
							batches[ b ].addUniformInput( "uMeshGlobalMatrix",   "mat4", mesh.globalMatrix, "flatten32" );
							batches[ b ].addUniformInput( "uBoneGlobalMatrices", "mat4Array", mesh, "boneMatrices" );
						}
						else {
							
							batches[ b ].addUniformInput( "uMeshGlobalMatrix", "mat4", mesh.globalMatrix, "flatten32" );
							batches[ b ].addUniformInput( "uMeshNormalMatrix", "mat3", mesh.normalMatrix, "flatten32" );
						}

					}
			
					mesh.webGLIsTransparent = cache[ c ].isTransparent;
					mesh.webGLBatches       = batches;
					
					return true;
				}
			} 
		}
		
		return false;
	}
	
	
	var setGL = function( incomingGL ) {
		
		GL = incomingGL;
	}
	
	
			
	
	//--- public ---
	
	return {
		
		compile: compile,
		bindBuffer: bindBuffer,
		bindElement: bindElement, 
		setGL: setGL
	}
}());


/*
 * Dictionaries and helpers
 */

THREE.WebGLBatchCompiler.geometryBuffersDictionary = {};
THREE.WebGLBatchCompiler.textureBuffersDictionary  = {};
THREE.WebGLBatchCompiler.batchCache = [];

THREE.WebGLBatchCompiler.batchCacheObject = function( geometry, materials, webGLBatches, isTransparent ) {
	
	this.geometry      = geometry;
	this.materials     = materials;
	this.webGLBatches  = webGLBatches;
	this.isTransparent = isTransparent;
}

THREE.WebGLBatchCompiler.ShaderCodeInfo = function( originalMaterials, vertexShaderId, fragmentShaderId ) {
	
	this.originalMaterials = originalMaterials;
	this.vertexShaderId    = vertexShaderId;
	this.fragmentShaderId  = fragmentShaderId;
	this.blendMode         = THREE.WebGLRendererBlendModes.none;//one_oneMinusSrcAlpha;
	this.wireframe         = false;
	this.originalTextures  = { uMap0: -1, uMap1: -1, uEnvMap: -1, uNormalMap: -1 };
	this.textureBuffers    = { uMap0: -1, uMap1: -1, uEnvMap: -1, uNormalMap: -1 };
}

THREE.WebGLBatchCompiler.GLBuffers = function( chunkName, attributes, elements ) {
	
	this.chunkName        = chunkName;
	this.attributeBuffers = attributes;
	this.elementBuffer    = elements;
}
