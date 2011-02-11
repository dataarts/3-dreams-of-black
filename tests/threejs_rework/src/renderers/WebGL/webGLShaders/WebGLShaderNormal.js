//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.normalVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		"uniform 	mat4 	uMeshNormalMatrix;",
		
		"attribute 	vec4 	aVertex;",
		"attribute	vec4	aNormal;",
		
		"varying	vec3	vNormal;",
		
		"void main(void)",
		"{",
			"vNormal     = normalize( uCameraInverseMatrix * uMeshGlobalMatrix * aNormal ).xyz;",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * aVertex;",
		"}"
	].join( "\n" );

}());





//--- Texture Fragment Shader ---

THREE.WebGLShaderDefinitions.normalFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"varying	vec3	vNormal;",

		"void main( void )",
		"{",
			"gl_FragColor = vec4(( vNormal + 1.0 ) * 0.5, 1.0 );",
		"}"
	].join( "\n" );

}());