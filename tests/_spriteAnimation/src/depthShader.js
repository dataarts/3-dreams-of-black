var depthShaderSource = {

	'depthShader' : {

		uniforms: {
            "aspect": { type: "f", value: 0 },
            "near": { type: "f", value: 0 },
            "far": { type: "f", value: 0 },
			"sheet": { type: "t", value: 0, texture: null },
            "mouseXYZ": { type: "v3", value: new THREE.Vector3() },
            "tileOffsetX": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

            "uniform vec2 mouseXYZ;",
            "uniform float aspect;",
            "uniform float near;",
            "uniform float far;",
            "varying vec4 viewPos;",
            "varying vec2 projPos;",
            "varying vec2 vUv;",
            "varying float depth;",


			"void main() {",
				"vUv = uv;",

                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "projPos = vec2(aspect,1.)*vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "depth = (viewPos.z+near)/far;",

                "gl_Position = viewPos;",

			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D sheet;",
            "uniform vec2 tileOffsetX;",

            "uniform vec2 mouseXY;",
            "varying vec4 viewPos;",
            "varying vec2 projPos;",
            "varying vec2 vUv;",
            "varying float depth;",

            "varying float distance;",
            "varying float distancePoly;",

			"void main() {",
				"vec4 c = texture2D( sheet, vec2( vUv.x, vUv.y ) );",
                "gl_FragColor = vec4(depth,depth,depth,c.a);",
			"}"

		].join("\n")

	}

};