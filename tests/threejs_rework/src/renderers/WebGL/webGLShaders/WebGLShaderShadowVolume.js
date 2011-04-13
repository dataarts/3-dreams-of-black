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

		"void main(void)",
		"{",
			// todo: add rotation
			"vec3 modified = vec3( uMeshGlobalMatrix * aVertex ).xyz;",
			"vec3 normal   = vec3(( uMeshGlobalMatrix * vec4( aShadowNormalA, 1.0 )).xyz );",
			"vec4 final    = vec4( modified + uDirectionalLight * 2000.0 * step( 0.0, dot( uDirectionalLight, normal )), 1.0 );",
			"gl_Position   = uCameraPerspectiveMatrix * uCameraInverseMatrix * final;",
		"}"
	].join( "\n" );

}());





//--- Texture Fragment Shader ---

THREE.WebGLShaderDefinitions.shadowVolumeFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"void main( void )",
		"{",
			"gl_FragColor = vec4( 1, 1, 1, 1 );",
		"}"
	].join( "\n" );

}());

