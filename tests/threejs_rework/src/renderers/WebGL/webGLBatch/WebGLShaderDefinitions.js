THREE.WebGLShaderDefinitions = {
		
	uniforms: [
	
		{ name: "uCameraInverseMatrix",     type: "mat4" },
		{ name: "uCameraPerspectiveMatrix", type: "mat4" },
		{ name: "uMeshGlobalMatrix",       	type: "mat4" },
		{ name: "uMeshNormalMatrix",       	type: "mat3" },
		{ name: "uBonesRootInverseMatrix",  type: "mat4" },
		{ name: "uBoneGlobalMatrices",      type: "mat4Array" },
		{ name: "uBonePoseMatrices",		type: "mat4Array" },
		{ name: "uPointLight0Matrix",  		type: "mat4" },
		{ name: "uPointLight1Matrix",  		type: "mat4" },
		{ name: "uSpotLight0Matrix",  		type: "mat4" },
		{ name: "uSpotLight1Matrix",  		type: "mat4" },
		{ name: "uDirectionalLight0Matrix",	type: "mat4" },
		{ name: "uDirectionalLight1Matrix",	type: "mat4" },
		{ name: "uSceneFogNear",            type: "1f" },
		{ name: "uSceneFogFar", 			type: "1f" },
		{ name: "uSceneFogColor", 			type: "vec3" },
		{ name: "uColor",					type: "vec3" },
		{ name:	"uMap0", 					type: "sampler" },
		{ name: "uMap1", 					type: "sampler" },
		{ name: "uLightMap", 				type: "sampler" },
		{ name: "uEnvMap", 					type: "sampler" },
		{ name: "uBumpMap", 				type: "sampler" },
		{ name: "uNormalMap",				type: "sampler" }
	],
	
	attributes: [
	
		{ name: "aVertices", 	type: "vec4" },	
		{ name: "aNormals",  	type: "vec3" },	
		{ name: "aColors",   	type: "vec3" },	
		{ name: "aUV0s",     	type: "vec2" },	
		{ name: "aUV1s",     	type: "vec2" },	
		{ name: "aSkinIndices", type: "vec4" },	
		{ name: "aSkinWeights", type: "vec4" },	
	]
}
