//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.textureVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		
		"attribute 	vec4 	aVertex;",
		
		"void main(void)",
		"{",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * aVertex;",
		"}"
	].join( "\n" );

}());


//--- Texture Fragment Shader ---

THREE.WebGLShaderDefinitions.textureFragment = (function() {
	
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