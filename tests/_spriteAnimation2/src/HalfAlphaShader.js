var HalfAlphaShaderSource = {

	'halfAlpha' : {

		uniforms: {
			"map": { type: "t", value: 0, texture: null },
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
			"uniform sampler2D map;",

			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x * 0.5, vUv.y ) );",
				"vec4 a = texture2D( map, vec2( 0.5 + vUv.x * 0.5, vUv.y ) );",
				"gl_FragColor = vec4(c.rgb, a.r);",
			"}"

		].join("\n")

	}

};