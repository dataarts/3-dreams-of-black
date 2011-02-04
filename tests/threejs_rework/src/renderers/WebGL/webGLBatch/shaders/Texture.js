//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.textureVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		"uniform	mat3	uMeshNormalMatrix;",
		
		"attribute 	vec4 	aVertex;",
		"attribute  vec3	aNormal;",
		
		"varying vec3 vNormal;",
		
		"void main(void)",
		"{",
			"vNormal     = normalize( uMeshNormalMatrix * aNormal );",
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

		"varying vec3 vNormal;",

		"void main( void )",
		"{",
			"gl_FragColor = vec4(( vNormal + 1.0 ) * 0.5, 1 );",
		"}"
	].join( "\n" );

}());