THREE.WebGLShaderDefinitions = {
		
	uniforms: [
		{ name: "uCameraInverseMatrix",     type: "mat4" },
		{ name: "uCameraPerspectiveMatrix", type: "mat4" },
		{ name: "uMeshGlobalMatrix",       	type: "mat4" },
		{ name: "uMeshNormalMatrix",       	type: "mat3" },
		{ name: "uBonesRootInverseMatrix",  type: "mat4" },
		{ name: "uBoneGlobalMatrices",      type: "mat4Array" },
		{ name: "uBonePoseMatrices",		type: "mat4Array" },
		{ name: "uSceneFogNear",            type: "1f" },
		{ name: "uSceneFogFar", 			type: "1f" },
		{ name: "uSceneFogColor", 			type: "vec3" },
		{ name:	"sMap0", 					type: "sampler" },
		{ name: "sMap1", 					type: "sampler" }
	],
	
	attributes: [
		{ name: "aVertices", 	type: "vec4" },	
		{ name: "aNormals",  	type: "vec3" },	
		{ name: "aColors",   	type: "vec3" },	
		{ name: "aUV0s",     	type: "vec2" },	
		{ name: "aUV1s",     	type: "vec2" },	
		{ name: "aSkinIndices", type: "vec4" },	
		{ name: "aSkinWeights", type: "vec4" },	
	],
}
