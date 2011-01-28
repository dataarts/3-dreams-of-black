//--- Texture Vertex Shader ---

THREE.Shader.textureVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		
		"attribute 	vec4 	aVertices;",
		
		"void main(void)",
		"{",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * aVertices;",
		"}"
	].join( "\n" );

}());


//--- Texture Fragment Shader ---

THREE.Shader.textureFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"void main( void )",
		"{",
			"gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );",
		"}"
	].join( "\n" );

}());