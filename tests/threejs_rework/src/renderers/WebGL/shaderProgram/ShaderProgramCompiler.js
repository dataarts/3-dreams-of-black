/*
 * Shader Program Compiler: compiles all data within a mesh to a ShaderProgram. Beware: This is magic.
 */

THREE.ShaderProgramCompiler = {};
THREE.ShaderProgramCompiler.compile = function( mesh ) {
	
	mesh.shaderPrograms = [];
	
	for( var m = 0; m < mesh.materials.length; m++ ) {

		var material = mesh.materials[ m ];
		var program;
		var textures;
		var chunks;
		
		
		/*
		 * TODO!
		 * Varje chunk Šr ett shader program!
		 * Just nu Šr det kodat lite sŒ att varje material Šr det, men det Šr fel
		 * Om dŠremot ett MeshFaceMaterial finns, sŒ Šr de faces som har det materialet samlat
		 * i en chunk som dŠrfšr ska ha det materialet, resten ska ha de andra materialen
		 * 
		 * Att gšra: kompilera ihop material som inte Šr MeshShaderMaterial, som till exempel
		 * lambert och sŒ vidare. Och gšra stšd fšr wireframe.
		 * 
		 * Jag har precis gjort laddningen šver till GPUn men inte matchat mot shader programet
		 */
		
		if( typeof material === THREE.MeshShaderMaterial ) {
			
			program = new THREE.ShaderProgram( material.vertex_shader, material.fragment_shader );
			
			processTextureMaps   ( mesh, program );
			processGeometryChunks( mesh, program );
			addUniformInputs     ( mesh, program );
			
			mesh.shaderPrograms.push( program );
		}
	}
	
	
	//--- process texture maps ---
	
	function processTextureMaps( mesh ) {
		
		// already processed?
	}	
	
	
	//--- process geometry chunks ---
	
	function processGeometryChunks( mesh ) {
		
		// already processed?
		
		if( THREE.ShaderProgramCompiler.chunkDictionary[ mesh.geometry.id ] === undefined ) {
			
			THREE.ShaderProgramCompiler.chunkDictionary[ mesh.geometry.id ]	= [];	
	
			
			// loop through chunks
			
			for( chunkName in mesh.geometry.geometryChunks ) {
				
				var chunk       = mesh.geometry.geometryChunks[ chunkName ];
				var vertices    = [];
				var normals     = [];
				var colors      = [];
				var uv0s        = [];
				var uv1s        = [];
				var skinWeights = [];
				var skinIndices = [];
				var faces       = [];
				
				
				// loop through faces
				
				for( var f = 0; f < chunk.faces; f++ ) {
					
					var face          = mesh.faces[ chunk.faces[ f ]];
					var faceIndices   = face.d === undefined ? [ "a", "b", "c" ] : [ "a", "b", "c", "a", "c", "d" ];
					var vertexCounter = 0;
					
					for( var i = 0; i < faceIndices.length; i++ ) {
						
						faces.push( vertexCounter++ );
						
						vertices.push( mesh.vertices[ face[ faceIndices[ i ]]].position.x );  
						vertices.push( mesh.vertices[ face[ faceIndices[ i ]]].position.y );  
						vertices.push( mesh.vertices[ face[ faceIndices[ i ]]].position.z );  
						vertices.push( 1 );	// pad for faster vertex shader
						
						normals.push( face.normal.x );
						normals.push( face.normal.y );
						normals.push( face.normal.z );
						
						if( mesh.uvs.length > 0 ) {
							
							uv0s.push( mesh.uvs[ face[ faceIndices[ i ]]].u );
							uv0s.push( mesh.uvs[ face[ faceIndices[ i ]]].v );
						}
						
						if( mesh.colors.length > 0 ) {
							
							colors.push( mesh.colors[ face[ faceIndices[ i ]]].r );
							colors.push( mesh.colors[ face[ faceIndices[ i ]]].g );
							colors.push( mesh.colors[ face[ faceIndices[ i ]]].b );
						}
						
						if( mesh.geometry.skinWeights.length > 0 ) {
							
							skinWeights.push( mesh.skinWeights[ face[ faceIndices[ i ]]].x );
							skinWeights.push( mesh.skinWeights[ face[ faceIndices[ i ]]].y );
							skinWeights.push( mesh.skinWeights[ face[ faceIndices[ i ]]].z );
							skinWeights.push( mesh.skinWeights[ face[ faceIndices[ i ]]].w );
	
							skinIndices.push( mesh.skinIndices[ face[ faceIndices[ i ]]].x );
							skinIndices.push( mesh.skinIndices[ face[ faceIndices[ i ]]].y );
							skinIndices.push( mesh.skinIndices[ face[ faceIndices[ i ]]].z );
							skinIndices.push( mesh.skinIndices[ face[ faceIndices[ i ]]].w );
						}
					}
				}


				// bind to GL
				
				var attributes = [];
				
				if( vertices   .length > 0 ) attributes.push( bindBuffer( "aVertices",    "vec4", vertices,    4 ));
				if( normals    .length > 0 ) attributes.push( bindBuffer( "aNormals",     "vec3", normals,     3 ));
				if( colors     .length > 0 ) attributes.push( bindBuffer( "aColors",      "vec3", colors,      3 ));
				if( uv0s       .length > 0 ) attributes.push( bindBuffer( "aUVs",         "vec2", uv0s,        2 ));
				if( skinWeights.length > 0 ) attributes.push( bindBuffer( "aSkinWeights", "vec4", skinWeights, 4 ));
				if( skinIndices.length > 0 ) attributes.push( bindBuffer( "aSkinIndices", "vec4", skinIndices, 4 ));
				
				var elements = bindElement( faces, faces.length );
				var chunk    = new THREE.ShaderProgramCompiler.ChunkBuffers( attributes, elements );
				
				THREE.ShaderProgramCompiler.chunkDictionary[ mesh.geometry.id ].push( chunk )
			}
		}
		
		// add attributes to shader program
		
		var chunkBuffers = THREE.ShaderProgramCompiler.chunkDictionary[ mesh.geometry.id ];
		
		for( var c = 0; c < chunkBuffers.length; c++ ) {
			
			
		}
	}
	
	
	function bindBuffer( name, type, data, size ) {
		
		var info = {};
		
		info.name   = name;
		info.type   = type;
		info.size   = size;
		info.buffer = this.GL.creatBuffer();

		this.GL.bindBuffer( this.GL.ARRAY_BUFFER, info.buffer );
		this.GL.bufferData( this.GL.ARRAY_BUFFER, new Float32Array( data ), this.GL.STATIC_DRAW );
		
		return info;
	}
	
	function bindElement( data, size ) {
		
		var info = {};
		
		info.name   = "elements";
		info.type   = "?";
		info.size   = size;
		info.buffer = this.GL.createBuffer();
				
		this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, info.buffer );
     	this.GL.bufferData( this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array( data ), this.GL.STATIC_DRAW );
		
		return info;
	}
}

THREE.ShaderProgramCompiler.chunkDictionary   = {};
THREE.ShaderProgramCompiler.textureDictionary = {};

THREE.ShaderProgramCompiler.ChunkBuffers = function( attributes, elements ) {
	
	this.attributes = attributes;
	this.elements   = elements;
}

