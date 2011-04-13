//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.normalVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform	mat3 	uCameraInverseMatrix3x3;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		"uniform 	mat3 	uMeshNormalMatrix;",
		
		"attribute 	vec4 	aVertex;",
		"attribute	vec3	aNormal;",
		
		"varying	vec3	vNormal;",
		
		"void main(void)",
		"{",
			"vNormal     = normalize( uCameraInverseMatrix3x3 * uMeshNormalMatrix * aNormal );",
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

		"uniform	float	uAmbientLight;",
		"varying	vec3	vNormal;",

		"void main( void )",
		"{",
			"gl_FragColor = vec4(( vNormal + 1.0 ) * 0.5 * uAmbientLight, 1.0 );",
		"}"
	].join( "\n" );

}());