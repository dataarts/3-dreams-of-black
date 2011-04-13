var SpriteSheetShaderSource = {

	'spriteSheet' : {

		uniforms: {
			"sheet": { type: "t", value: 0, texture: null },
			"tileOffsetX": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
			"uniform sampler2D sheet;",
			"uniform vec2 tileOffsetX;",
			
			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( sheet, vec2( vUv.x * tileOffsetX.x + tileOffsetX.y, vUv.y ) );",
				"gl_FragColor = c.rgba;",
			"}"

		].join("\n")

	}

};