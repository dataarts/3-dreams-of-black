//--- Texture Vertex Shader ---

THREE.Shader.textureVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uModelGlobalMatrix;",
		"uniform	mat3 	uModelNormalMatrix;",
		
		"attribute 	vec4 	aVertices;",
		"attribute	vec3 	aNormals;",
		"attribute	vec3	aColors;",
		"attribute 	vec2 	aSTs;",
		
		"varying 	vec2 	vST;",
		"varying	float	vLuminance;",
		
		"void main(void)",
		"{",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uModelGlobalMatrix * aVertices;",
			"vLuminance  = 1.0 - max( 0.0, dot( uModelNormalMatrix * aNormals, vec3( 1, 0, 0 )));",
			"vST         = aSTs;",
		"}"
	].join( "\n" );

}());


//--- Texture Fragment Shader ---

THREE.Shader.textureFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"uniform sampler2D 	uDiffuseSampler;",
		"uniform sampler2D 	uLightSampler;",
		"uniform sampler2D 	uBumpSampler;",
		"uniform sampler2D 	uDetailSampler;",

		"varying float 		vLuminance;",
		"varying vec2		vST;",
	
		"void main( void )",
		"{",
			"vec4 color = texture2D( uDiffuseSampler, vST );",
			"gl_FragColor = vec4( vLuminance, vLuminance, vLuminance, 1.0 );",
		"}"
	].join( "\n" );

}());