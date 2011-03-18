/**
 * @author Mikael Emtinger
 */
//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.shadowVolumeVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		"uniform 	vec3	uDirectionalLight;",
		
		"attribute 	vec4 	aVertex;",
		"attribute 	vec3 	aShadowNormalA;",
//		"attribute 	vec3 	aShadowNormalB;",
//		"attribute 	float 	aShadowVertexType;",

//		"varying	float	vDiscardFragment;",
//		"varying	vec4	vColor;",

		"void main(void)",
		"{",
/*			"vec4 modified = aVertex;",

			"if( dot( uDirectionalLight, aShadowNormalA ) >= 0.0 ) {",
				"modified = vec4( modified.xyz + uDirectionalLight * 2000.0, 1 );",
			"}",
*/
		
			"vec4 modified = vec4( aVertex.xyz + uDirectionalLight * 2000.0 * step( 0.0, dot( uDirectionalLight, aShadowNormalA )), 1.0 );",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;",

		
/*			"vDiscardFragment = 0.0;",
			"vec4 modified = aVertex;",
			
			"if( aShadowVertexType == 0.0 && dot( uDirectionalLight, aShadowNormalA ) >= 0.0 ) {",
				"modified = vec4( modified.xyz + uDirectionalLight * 2000.0, 1 );",
			"} else if( aShadowVertexType == 1.0 || aShadowVertexType == 2.0 ) {",
				"if( aShadowVertexType == 1.0 && dot( uDirectionalLight, aShadowNormalA ) < 0.0 && dot( uDirectionalLight, aShadowNormalB ) >= 0.0 ) {",
					"modified = vec4( modified.xyz + uDirectionalLight * 2000.0, 1 );",
				"} else if( aShadowVertexType == 2.0 && dot( uDirectionalLight, aShadowNormalB ) < 0.0 && dot( uDirectionalLight, aShadowNormalA ) >= 0.0 ) {",
					"modified = vec4( modified.xyz + uDirectionalLight * 2000.0, 1 );",
				"} else {",
					"vDiscardFragment = 1.0;",
				"}",
			"}",
			
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;",*/
		"}"
	].join( "\n" );

}());





//--- Texture Fragment Shader ---

THREE.WebGLShaderDefinitions.shadowVolumeFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

//		"varying	float	vDiscardFragment;",
		
		"void main( void )",
		"{",
//			"if( vDiscardFragment == 1.0 ) { discard; }",
			"gl_FragColor = vec4( 1, 1, 1, 1 );",
		"}"
	].join( "\n" );

}());

/*
		{
			vDiscardFragment = 0.0;
			modified = aVertex;
			
			if( aShadowVertexType == 0.0 && dot( uDirectionalLight, aShadowNormalA ) >= 0.0 ) {
				modified = modified + vec4( uDirectionalLight * 20.0, 1 );
			} else if( aShadowVertexType == 1.0 && dot( uDirectionalLight, aShadowNormalA ) < 0.0 && dot( uDirectionalLight, aShadowNormalB ) >= 0.0 ) {
				modified = modified + vec4( uDirectionalLight * 20.0, 1 );
			} else if( aShadowVertexType == 2.0 && dot( uDirectionalLight, aShadowNormalB ) < 0.0 && dot( uDirectionalLight, aShadowNormalA ) >= 0.0 ) {
				modified = modified + vec4( uDirectionalLight * 20.0, 1 );
			} else if( aShadowVertexType == 1.0 || aShadowVertexType == 2.0 ) {
				vDiscardFragment = 1.0;
			}
			
			gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;
		}
*/