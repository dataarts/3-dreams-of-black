/**
 * @author Mikael Emtinger
 */
//--- Texture Vertex Shader ---

THREE.WebGLShaderDefinitions.shadowPostVertex = (function() {
	
	return [
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"attribute 	vec4 	aVertex;",

		"void main(void)",
		"{",
			"gl_Position = uCameraPerspectiveMatrix * aVertex;",
		"}"
	].join( "\n" );

}());





//--- Texture Fragment Shader ---

THREE.WebGLShaderDefinitions.shadowPostFragment = (function() {
	
	return [ 	
	
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",		

		"void main( void )",
		"{",
			"gl_FragColor = vec4( 1, 1, 1, 0.5 );",
		"}"
	].join( "\n" );

}());

