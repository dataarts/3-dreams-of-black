var VideoShadersSource = {

	'halfAlpha' : {

		uniforms: {

			"map" : { type: "t", value: 0, texture: null },
			"flip": { type: "i", value: 0 }

		},

		vertexShader: [

			"varying vec2 vUv;",
			"uniform bool flip;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"if ( flip )",
					"vUv = vec2( 1.0 - uv.x, uv.y );",
				"else",
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

	},

	'opaque' : {

		uniforms: {

			"map" : { type: "t", value: 0, texture: null },
			"flip": { type: "i", value: 0 }

		},

		vertexShader: [

			"varying vec2 vUv;",
			"uniform bool flip;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"if ( flip )",
					"vUv = vec2( 1.0 - uv.x, uv.y );",
				"else",
					"vUv = uv;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",

			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( map, vUv );",
				"gl_FragColor = c;",
			"}"

		].join("\n")

	}

};