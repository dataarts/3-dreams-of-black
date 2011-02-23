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
		   	"float color0 = ( 1.0 - smoothstep( 1.0,   250.0, depth )) * 0.7 + 0.3;",
		   	"float color1 =         smoothstep( 250.0, 500.0, depth )  * 0.7 + 0.3;",
			"if( depth > 246.0 && depth < 254.0 )",
			"gl_FragColor = vec4( 1.0, 0.5, 0.5, 1.0 );",
			"else",
			"gl_FragColor = depth < 250.0 ? vec4( color0, color0, color0, 1.0 ) : vec4( color1, color1, color1, 1.0 );",
		"}"
	].join( "\n" );

}());