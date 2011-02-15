//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.zeroBlinkVertex = (function() {
	
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

THREE.WebGLShaderDefinitions.zeroBlinkFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"void main( void )",
		"{",
			"float depth  = gl_FragCoord.z / gl_FragCoord.w;",
		   	"float color0 = clamp( 1.0 - smoothstep( 1.0,   350.0, depth ), 0.3, 0.9 );",
		   	"float color1 = clamp(       smoothstep( 150.0, 500.0, depth ), 0.3, 0.9 );",
			"gl_FragColor = depth < 250.0 ? vec4( color0, color0, color0, 1.0 ) : vec4( color1, color1, color1, 1.0 );",
		"}"
	].join( "\n" );

}());