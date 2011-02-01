THREE.WebGLShaderDefinitions.skinVertex = (function() {
	
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
		
		"void main(void)",
		"{",
		
			"int  index    = int( aSkinIndices.x );",
			"vec4 modified = uBonesRootInverseMatrix * uBoneGlobalMatrices[ index ] * uBonePoseMatrices[ index ] * aVertices;",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;",
		
		"}"
	].join( "\n" );
	
}());
