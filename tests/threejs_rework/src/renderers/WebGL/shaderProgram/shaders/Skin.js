THREE.Shader.skinVertex = (function() {
	
	return [

		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uModelGlobalMatrix;",
		"uniform	mat3 	uModelNormalMatrix;",
		
		"uniform	mat4	uSkinRootInverseMatrix;",
		"uniform	mat4	uSkinPoses[16];",
		"uniform	mat4	uSkinGlobalMatrices[16];",
		
		"attribute 	vec4 	aVertices;",
		"attribute	vec3 	aNormals;",
		"attribute	vec3	aColors;",
		"attribute 	vec2 	aSTs;",
		
		"attribute	vec4	aSkinIndices;",
		"attribute	vec4	aSkinWeights;",
		
		"varying 	vec2 	vST;",
		"varying	float	vLuminance;",
		
		"void main(void)",
		"{",
			"int  index    = int( aSkinIndices.x );",
			"vec4 modified = uSkinRootInverseMatrix * uSkinGlobalMatrices[ index ] * uSkinPoses[ index ] * aVertices;",

			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uModelGlobalMatrix * modified;",
			"vST         = aSTs;",
			"vLuminance  = max( 0.2, dot( uModelNormalMatrix * aNormals, vec3( 0.0, 0, -1.0 )));",
		"}"
	].join( "\n" );
	
}());
