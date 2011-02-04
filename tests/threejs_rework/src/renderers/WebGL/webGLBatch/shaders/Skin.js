THREE.WebGLShaderDefinitions.skinVertex = (function() {
	
	return [

		"uniform	mat4 	uCameraInverseMatrix;",
		"uniform 	mat4 	uCameraPerspectiveMatrix;",
		"uniform 	mat4 	uMeshGlobalMatrix;",
		
		"uniform	mat4	uBonesRootInverseMatrix;",
		"uniform	mat4	uBoneGlobalMatrices[16];",
		"uniform	mat4	uBonePoseMatrices[16];",
		
		"attribute 	vec4 	aVertex;",
		"attribute	vec4	aSkinIndices;",
		"attribute	vec4	aSkinWeights;",
		
		"varying vec3 vNormal;",

		"void main(void)",
		"{",
			"vNormal = vec4( 1, 0, 0, 0 );",
			"int  index    = int( aSkinIndices.x );",
			"vec4 modified = uBonesRootInverseMatrix * uBoneGlobalMatrices[ index ] * uBonePoseMatrices[ index ] * aVertex;",
			"gl_Position = uCameraPerspectiveMatrix * uCameraInverseMatrix * uMeshGlobalMatrix * modified;",
		
		"}"
	].join( "\n" );
	
}());
