var VideoShaderSource = {

	'videoSheet' : {

		uniforms: {
			"sheet": { type: "t", value: 0, texture: null },
            "mouseXY": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

			"uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec4 viewPos;",
            "varying vec2 projPos;",
            "varying vec2 uvPos;",
            "varying float distance;",
            "varying float uvDistance;",
            "varying vec3 pos;",

			"void main() {",
				"pos = position;",
                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "projPos = vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "uvPos = vec2(uv.x*4.-1., uv.y*4.0-3.);",

                "distance = 1.0-length(projPos-vec2(mouseXY.x, mouseXY.y));",
                "uvDistance = 1.0-length(uvPos-vec2(mouseXY.x, mouseXY.y));",
                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*0.6*pow(distance,2.0)*(viewPos.z/10.);",
                "gl_Position = viewPos;",
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
            "varying vec4 viewPos;",
            "uniform sampler2D sheet;",

			"varying vec2 vUv;",
            "varying float distance;",
            "varying float uvDistance;",
            "varying vec3 pos;",
            "varying vec2 uvPos;",

			"void main() {",
				"vec4 c = texture2D( sheet, vec2( pos.x+.5, -pos.y+.5 ) );",
                "vec4 cPoly = texture2D( sheet, vec2( vUv.x*2., 2.-vUv.y*2. ) );",
                "if ((uvDistance+cPoly.r/2.)>0.9) c = cPoly; ",
                "gl_FragColor = c;",
			"}"

		].join("\n")

	}

};