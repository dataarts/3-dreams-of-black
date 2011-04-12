var MouseDeformShaderSource = {

	'mouseDeform' : {

		uniforms: {
			"poi": { type: "v3", value: new THREE.Vector3() },
			"texture": { type: "t", value: 0, texture: null }
		},

		vertexShader: [
			"uniform vec3 poi;",
			"varying vec2 vUv;",

			"void main() {",

			
				"vec4 p = modelViewMatrix * vec4( position, 1.0 );",
				
				"vec3 d = (p.xyz - poi);",
				"vec3 dn = normalize(d);",
				"p.xyz += dn * 100.0;",
				
				"gl_Position = projectionMatrix * p;",
				
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
			"uniform sampler2D texture;",
			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( texture, vec2( vUv.x, vUv.y ) );",
				"gl_FragColor = c.rgba;",
			"}"

		].join("\n")

	}

};