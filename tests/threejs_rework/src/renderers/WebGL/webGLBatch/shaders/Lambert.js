/*
 * Lambert shader
 */

THREE.WebGLShaderDefinitions.lambertVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		
		"attribute 	vec4 	aVertices;",
		"attribute	vec2	aUV0s;",
		
		"varying 	vec2	vUV0;",
		
		"void main(void)",
		"{",
			"vUV0 = aUV0s;",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * aVertices;",
		"}"
	].join( "\n" );

}());


THREE.WebGLShaderDefinitions.lambertFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"uniform	sampler2D	uMap0;",
		"uniform	sampler2D	uMap1;",
		"uniform	sampler2D	uEnvMap;",
		"uniform	sampler2D	uNormalMap;",
		
		"varying	vec2		vUV0;",

		"void main( void )",
		"{",
			"gl_FragColor = texture2D( uMap0, vUV0 );",
		"}"
	].join( "\n" );

}());