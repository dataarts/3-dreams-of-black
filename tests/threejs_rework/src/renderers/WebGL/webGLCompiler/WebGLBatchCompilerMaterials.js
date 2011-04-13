/*
 * Material Compiler. Merges Three Materials into shader code 
 */

THREE.WebGLBatchCompilerMaterials = (function() {

	var that = {};
	var vertexId;
	var fragmentId;
	var uniforms;
	var attributes;
	var varyings;
	var vertex;
	var fragmentUniforms;
	var fragment;

	//--- compile materials ---
	
	var compile = function( materials, isSkin ) {
		
		uniforms         = [];
		attributes       = [];
		varyings         = [];
		vertex           = [];
		fragmentUniforms = [];
		fragment         = [];
		vertexId         = "vertex";
		fragmentId       = "fragment";

		addUniform  ( "uCameraInverseMatrix" );
		addUniform  ( "uCameraPerspectiveMatrix" );
		addUniform  ( "uMeshGlobalMatrix" );
		addUniform  ( "uMeshNormalMatrix" );
		addAttribute( "aVertex" );
		
		for( var m = 0; m < materials.length; m++ ) {

			// lambert

			if( materials[ m ] instanceof THREE.MeshLambertMaterial ) {
				
				vertexId   += "Lambert";
				fragmentId += "Lambert";
				
				if( materials[ m ].map ) {

					vertexId   += "Map";
					fragmentId += "Map";

					addAttribute( "aUV0"  );
					addVarying  ( "vUV0"  );
					addVertex   ( "vUV0 = aUV0;" );

					addFragmentUniform( "uMap0" );										
					addFragment       ( "gl_FragColor = texture2D( uMap0, vUV0 );" ); 
				}
				else {
					
					vertexId   += "Color";
					fragmentId += "Color";

					addFragment( "gl_FragColor = vec4( 1, 0, 1, 1 );" );
				}
			}
		}


		// skin?

		if( isSkin ) {
			
			vertexId += "Skin";
			
			addUniform( "uBoneGlobalMatrices[20]" );
		
			addAttribute( "aSkinIndices" );
			addAttribute( "aSkinWeights" );
			addAttribute( "aSkinVertexA" );
			addAttribute( "aSkinVertexB" );

			addVertex( "gl_Position  = (uBoneGlobalMatrices[ int( aSkinIndices.x ) ] * aSkinVertexA) * aSkinWeights.x;" );
			addVertex( "gl_Position += (uBoneGlobalMatrices[ int( aSkinIndices.y ) ] * aSkinVertexB) * aSkinWeights.y;" );
			addVertex( "gl_Position  = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * gl_Position;" );
		}
		else
			addVertex( "gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * aVertex;" );



		// round up

		if( THREE.WebGLShaderDefinitions[ vertexId ] === undefined ) {
			
			THREE.WebGLShaderDefinitions[ vertexId ] = uniforms  .join( "\n" ) + "\n" +
													   attributes.join( "\n" ) + "\n" +
													   varyings  .join( "\n" ) + "\n" +
													   "void main(void) {\n"   + "\n" +
													   vertex    .join( "\n" ) + "\n" +
													   "}";  
 		}
		
		if( THREE.WebGLShaderDefinitions[ fragmentId ] === undefined ) {
			
			THREE.WebGLShaderDefinitions[ fragmentId ] = "#ifdef GL_ES\n" +
											  			 "precision highp float;\n" +
														 "#endif\n" +		
														 fragmentUniforms.join( "\n" ) + "\n" + 
													     varyings        .join( "\n" ) + "\n" +
													     "void main(void) {\n"         + "\n" +
													     fragment        .join( "\n" ) + "\n" +
													     "}";  
		}
		
		that.vertexShaderId   = vertexId;
		that.fragmentShaderId = fragmentId;
	}
	
	
	/*
	 * Helpers
	 */
	
	var addVertex = function( instruction ) {
		
		vertex.push( instruction );
	}
	
	var addFragment = function( instruction ) {
		
		fragment.push( instruction );
	}

	var addUniform = function( name ) {
		
		if( !exists( uniforms, name ))
			uniforms.push( "uniform " + validateAndGetType( "uniforms", name ) + " " + name + ";" );
	}
	
	var addFragmentUniform = function( name ) {
		
		if( !exists( fragmentUniforms, name ))
			fragmentUniforms.push( "uniform " + validateAndGetType( "uniforms", name ) + " " + name + ";" );
	}
	
	var addAttribute = function( name ) {
		
		if( !exists( attributes, name ))
			attributes.push( "attribute " + validateAndGetType( "attributes", name ) + " " + name + ";" );
	}
	
	var addVarying = function( name ) {
		
		if( !exists( varyings, name ))
			varyings.push( "varying " + validateAndGetType( "varyings", name ) + " " + name + ";" );
	}
	
	var exists = function( toCheck, name ) {
		
		for( var i = 0; i < toCheck.length; i++ ) 
			if( toCheck[ i ].indexOf( name ) !== -1 )
				return true;
				
		return false;
	}
	
	var validateAndGetType = function( type, name ) {
		
		var definitions = THREE.WebGLShaderDefinitions[ type ];
		
		if( name.indexOf( "[") !== -1 )
			name = name.slice( 0, name.indexOf( "[" ));
		
		for( var d = 0; d < definitions.length; d++ ) {
			
			if( definitions[ d ].name === name ) {
				
				if( definitions[ d ].type.indexOf( "Array" ) === -1 )
					return definitions[ d ].type;
				else
					return definitions[ d ].type.slice( 0, definitions[ d ].type.indexOf( "Array" ));
			}
		}
		
		alert( "WebGLBatchCompilerMaterials.compile: Couldn't find shader definition " + name );
		return "";
	}
	
	//--- public ---
	
	that.compile          = compile;
	that.vertexShaderId   = "";
	that.fragmentShaderId = "";
	
	return that;
}());
