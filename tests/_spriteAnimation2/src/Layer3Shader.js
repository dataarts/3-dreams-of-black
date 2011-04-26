var Layer3ShaderSource = {

	'layer3' : {

		uniforms: {
			"layer1": { type: "t", value: 0, texture: null },
			"layer2": { type: "t", value: 1, texture: null },
			"layer3": { type: "t", value: 2, texture: null },
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
			"uniform sampler2D layer3;",
			"uniform sampler2D layer2;",
			"uniform sampler2D layer1;",

			"varying vec2 vUv;",

			"void main() {",
				"vec3 c3 =  texture2D( layer3, vec2( vUv.x * 0.5, vUv.y ) ).rgb;",
				"vec3 c2 =  texture2D( layer2, vec2( vUv.x * 0.5, vUv.y ) ).rgb;",
				"vec3 c1 =  texture2D( layer1, vec2( vUv.x * 0.5, vUv.y ) ).rgb;",	
				
				"float a3 = texture2D( layer3, vec2( 0.5 + vUv.x * 0.5, vUv.y ) ).r;",
				"float a2 = texture2D( layer2, vec2( 0.5 + vUv.x * 0.5, vUv.y ) ).r;",
		
				"vec3 mc = c1 * vec3(1.0 - a2) + c2 * vec3(a2);",
				"mc =      mc * vec3(1.0 - a3) + c3 * vec3(a3);",
				
				//"gl_FragColor = vec4(c1.r, c2.g * a2, c3.b * a3, 1.0);",
				"gl_FragColor = vec4(mc, 1.0);",
			"}"

		].join("\n")
	}
};