var SpriteSheetShaderSource = {

	'spriteSheet' : {

		uniforms: {
			"sheet": { type: "t", value: 0, texture: null },
			"tileOffsetX": { type: "v2", value: new THREE.Vector2() },
            "mouseXY": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

			"uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec4 viewPos;",
            "varying vec2 projPos;",
            "varying float distance;",

			"void main() {",
				"viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "projPos = vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",

                "distance = 1.0-length(projPos-vec2(mouseXY.x, mouseXY.y));",
                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*2.0*pow(distance,2.0)*(viewPos.z/10.);",
                "gl_Position = viewPos;",
				"vUv = uv;",
			"}"

		].join("\n"),

		fragmentShader: [
            "varying vec4 viewPos;",
            "varying float distance;",
            "uniform sampler2D sheet;",
			"uniform vec2 tileOffsetX;",
			
			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( sheet, vec2( 2. * vUv.x * tileOffsetX.x + tileOffsetX.y, 2.-vUv.y*2. ) );",
                "if(c.a<0.8) c.a = 0.0;",
                "gl_FragColor = c;",
			"}"

		].join("\n")

	}

};