var depthShaderSource = {

	'depthShader' : {

		uniforms: {
            "aspect": { type: "f", value: 0 },
            "near": { type: "f", value: 0 },
            "far": { type: "f", value: 0 },
		},

		vertexShader: [

      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",

      "varying float depth;",

			"void main() {",

            "vec4 viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "depth = (viewPos.z+near)/far;",
            "gl_Position = viewPos;",

			"}"

		].join("\n"),

		fragmentShader: [

      "varying float depth;",
      
			"void main() {",
            "gl_FragColor = vec4(depth,depth,depth,1.0);",
			"}"

		].join("\n")

	}

};