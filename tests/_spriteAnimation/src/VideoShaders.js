var VideoShadersSource = {

	'multiVideo3x3' : {

		uniforms: {

			"map" : { type: "t", value: 0, texture: null },

		},

		vertexShader: [

			"varying vec2 vUv;",
			"uniform bool flip;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vUv = uv;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",

			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x * 0.5, vUv.y * 0.33 ) );",
				"vec4 a = texture2D( map, vec2( 0.5 + vUv.x * 0.5, vUv.y * 0.33 ) );",
				//"gl_FragColor = vec4(c.rgb, a.r);",
				"gl_FragColor = vec4(c.rgb, 1);",
			"}"

		].join("\n")

	},

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
				"gl_FragColor = vec4( c.rgb, a.r ) ;",

			"}"

		].join("\n")

	},

	'opaque' : {

		uniforms: {

			"sheet" : { type: "t", value: 0, texture: null },
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

			"uniform sampler2D sheet;",

			"varying vec2 vUv;",

			"void main() {",
				
				"vec4 c = texture2D( sheet, vUv );",
				
				//"c += texture2D( map, vUv + vec2( 0.1 ) );",
				//"c += texture2D( map, vUv + vec2( 0.2 ) );",				
				//"gl_FragColor = vec4( c.xyz * vec3( 0.3333 ), 0.5 );",
				
				"gl_FragColor = c;",

			"}"

		].join("\n")

	},
	
	'chromakey' : {

		uniforms: {

			"sheet" : { type: "t", value: 0, texture: null },
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

			"uniform sampler2D sheet;",

			"varying vec2 vUv;",

			"void main() {",
				
				"vec4 c = texture2D( sheet, vUv );",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t < 0.5 )",
					"alpha = t;",
				"gl_FragColor = vec4( c.xyz, alpha );",

			"}"

		].join("\n")

	}
};