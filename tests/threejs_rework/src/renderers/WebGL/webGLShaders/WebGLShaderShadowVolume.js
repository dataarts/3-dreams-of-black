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
			"vec4 modified = vec4( aVertex.xyz + uDirectionalLight * 2000.0 * step( 0.0, dot( uDirectionalLight, aShadowNormalA )), 1.0 );",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;",
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

