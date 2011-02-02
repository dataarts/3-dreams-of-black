/*
 * Lambert shader
 */

THREE.WebGLShaderDefinitions.lambertVertex = (function() {
	
	return [
	
		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		
		"uniform	mat4	uBonesRootInverseMatrix;",
		"uniform	mat4	uBoneGlobalMatrices[16];",
		"uniform	mat4	uBonePoseMatrices[16];",
		
		"attribute 	vec4 	aVertices;",
		"attribute	vec4	aSkinIndices;",
		"attribute	vec4	aSkinWeights;",
		"attribute	vec2	aUV0s;",
		
		"varying 	vec2	vUV0;",
		
		"void main(void)",
		"{",
			"vUV0 = aUV0s;",
			"int  index    = int( aSkinIndices.x );",
			"gl_Position = uBonesRootInverseMatrix * uBoneGlobalMatrices[ index ] * uBonePoseMatrices[ index ] * aVertices;",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * gl_Position;",
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