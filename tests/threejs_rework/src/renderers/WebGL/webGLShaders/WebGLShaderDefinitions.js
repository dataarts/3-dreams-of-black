THREE.WebGLShaderDefinitions = {
		
	uniforms: [
	
		{ name: "uCameraInverseMatrix",     type: "mat4" },
		{ name: "uCameraInverseMatrix3x3",  type: "mat3" },
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
		{ name: "uDirectionalLight",		type: "vec3" },
		{ name: "uSceneFogNear",            type: "1f" },
		{ name: "uSceneFogColor", 			type: "vec3" },
		{ name: "uAmbientLight",            type: "1f" }, 
		{ name: "uColor",					type: "vec4" },
		{ name:	"uMap0", 					type: "sampler2D" },
		{ name: "uMap1", 					type: "sampler2D" },
		{ name: "uLightMap", 				type: "sampler2D" },
		{ name: "uEnvMap", 					type: "sampler2D" },
		{ name: "uBumpMap", 				type: "sampler2D" },
		{ name: "uNormalMap",				type: "sampler2D" }
	],
	
	attributes: [
	
		{ name: "aVertex", 				type: "vec4" },	
		{ name: "aSkinVertexA",			type: "vec4" },	
		{ name: "aSkinVertexB",			type: "vec4" },	
		{ name: "aSkinVertexC",			type: "vec4" },	
		{ name: "aSkinVertexD",			type: "vec4" },	
		{ name: "aNormal",  			type: "vec3" },	
		{ name: "aColor",   			type: "vec3" },	
		{ name: "aUV0",     			type: "vec2" },	
		{ name: "aUV1",     			type: "vec2" },	
		{ name: "aSkinIndices", 		type: "vec4" },	
		{ name: "aSkinWeights", 		type: "vec4" },	
		{ name: "aShadowVertexType", 	type: "float" },	
		{ name: "aShadowNormalA", 		type: "vec3" },	
		{ name: "aShadowNormalB", 		type: "vec3" },	
	],
	
	varyings: [
	
		{ name: "vUV0", 	type: "vec2" },
		{ name: "vUV1", 	type: "vec2" },
		{ name: "vEnvUV", 	type: "vec2" },
		{ name: "vNormal",  type: "vec3" }
	]
}
