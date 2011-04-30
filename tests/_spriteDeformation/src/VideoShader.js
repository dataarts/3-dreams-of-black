var VideoShaderSource = {
	opaque: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null }
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
				"vec4 c = texture2D( map, vUv );",				
				"gl_FragColor = c;",
			"}"
		].join("\n")

	},
	
	keyed: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 },
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 3000 },
      "depthPass" : {type: "f", value: 1.}
		},

		vertexShader: [
			"varying vec2 vUv;",
      "varying float vDepth;",

			"uniform bool flip;",
      "uniform float near;",
      "uniform float far;",
      "uniform float depthPass;",

			"void main() {",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "vDepth = (gl_Position.z+near)/far;",
				"vUv = uv;",
			"}"
		].join("\n"),

		fragmentShader: [
			"uniform sampler2D map;",
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",
      "uniform float depthPass;",
			
			"varying vec2 vUv;",
      "varying float vDepth;",

			"void main() {",
				"vec3 cd = vec3(1.0 - colorScale);",
				"vec3 cs = vec3(colorScale);",				
				"vec4 c = texture2D( map, vUv );",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t < threshold )",
					"alpha = t / alphaFadeout;",
				"gl_FragColor = vec4( (c.xyz - cd) * cs, alpha );",
				"if (depthPass == 1.0) gl_FragColor = vec4(vDepth, vDepth, vDepth, alpha);",
				//"gl_FragColor = vec4( c.xyz, alpha );",
			"}"
		].join("\n")
	},
	
	distortOpaque: {

		uniforms: {
      "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
      "mouseXYZ": { type: "v3", value: new THREE.Vector3() },
      "near": { type: "f", value: 1 },
      "far": { type: "f", value: 2000 },
      "depthPass" : {type: "f", value: 1.}
		},

		vertexShader: [
      "uniform vec3 mouseXYZ;",
      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",
      "uniform float depthPass;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;",

			"void main() {",
            "vUv = uv;",

            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "vDepth = (gl_Position.z+near)/far;",
            "if (depthPass != 1.0)  {",
                  "vUvPoly = uv+vec2(normal.x,normal.y);",
                  "vec4 glPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                  "vec2 projPos = vec2(aspect,1.)*vec2(gl_Position.x/gl_Position.z,gl_Position.y/gl_Position.z);",
                  "vec2 projPosPoly = vec2(aspect,1.)*vec2(glPosPoly.x/glPosPoly.z,glPosPoly.y/glPosPoly.z);",

                  "float distance = max(0.,1.0-length(vec3(projPos,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",
            
                  "float distFade = normal.z*0.8+0.2;",

                  "distancePoly = max(0.,distFade-length(vec3(projPosPoly,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",

                  "gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXYZ.x, mouseXYZ.y))*1.2*pow(distancePoly,1.)*(gl_Position.z/10.);",

            "}",

			"}"

		].join("\n"),

		fragmentShader: [
      "uniform sampler2D map;",
      "uniform float depthPass;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;",

			"void main() {",
				    "gl_FragColor = texture2D( map, vec2( vUv.x, vUv.y ) );",
            "if (depthPass != 1.0) {",
                  "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                  "if ((distancePoly)>0.3) gl_FragColor = cPoly; ",
            "} else gl_FragColor = vec4(vDepth, vDepth, vDepth, gl_FragColor.a);",
            "if (gl_FragColor.a<=0.1) discard;",
			"}"

		].join("\n")

	},

	distortKeyed: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 },
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 3000 },
      "depthPass" : {type: "f", value: 1.},
      "aspect": { type: "f", value: 0 },
      "mouseXYZ": { type: "v3", value: new THREE.Vector3() }
		},

		vertexShader: [
      "uniform vec3 mouseXYZ;",
      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",
      "uniform float depthPass;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;",

			"void main() {",
            "vUv = uv;",

            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "vDepth = (gl_Position.z+near)/far;",
            "if (depthPass != 1.0)  {",
                  "vUvPoly = uv+vec2(normal.x,normal.y);",
                  "vec4 glPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                  "vec2 projPos = vec2(aspect,1.)*vec2(gl_Position.x/gl_Position.z,gl_Position.y/gl_Position.z);",
                  "vec2 projPosPoly = vec2(aspect,1.)*vec2(glPosPoly.x/glPosPoly.z,glPosPoly.y/glPosPoly.z);",

                  "float distance = max(0.,1.0-length(vec3(projPos,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",

                  "float distFade = normal.z*0.8+0.2;",

                  "distancePoly = max(0.,distFade-length(vec3(projPosPoly,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",

                  "gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXYZ.x, mouseXYZ.y))*1.2*pow(distancePoly,1.)*(gl_Position.z/10.);",

            "}",

			"}"
		].join("\n"),

		fragmentShader: [
			"uniform sampler2D map;",
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",
      "uniform float depthPass;",

			"varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;",

			"void main() {",
				"vec3 cd = vec3(1.0 - colorScale);",
				"vec3 cs = vec3(colorScale);",

				"vec4 c = texture2D( map, vUv );",
        "if (depthPass != 1.0) {",
            "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
            "if ((distancePoly)>0.3) c = cPoly; ",
        "}",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t < threshold )",
					"alpha = t / alphaFadeout;",
				"gl_FragColor = vec4( (c.xyz - cd) * cs, alpha );",
				"if (depthPass == 1.0) gl_FragColor = vec4(vDepth, vDepth, vDepth, alpha);",
			"}"

		].join("\n")
	},

	distortWire : {

		uniforms: {
      "aspect": { type: "f", value: 0 },
		  "map": { type: "t", value: 0, texture: null },
      "mouseXYZ": { type: "v3", value: new THREE.Vector3() }
		},

		vertexShader: [
      "uniform vec3 mouseXYZ;",
      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",
      "uniform float depthPass;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;",

			"void main() {",
            "vUv = uv;",

            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "vDepth = (gl_Position.z+near)/far;",
            "if (depthPass != 1.0)  {",
                  "vUvPoly = uv+vec2(normal.x,normal.y);",
                  "vec4 glPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                  "vec2 projPos = vec2(aspect,1.)*vec2(gl_Position.x/gl_Position.z,gl_Position.y/gl_Position.z);",
                  "vec2 projPosPoly = vec2(aspect,1.)*vec2(glPosPoly.x/glPosPoly.z,glPosPoly.y/glPosPoly.z);",

                  "float distance = max(0.,1.0-length(vec3(projPos,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",

                  "float distFade = normal.z*0.8+0.8;",

                  "distancePoly = max(0.,distFade-length(vec3(projPosPoly,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",

                  "gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXYZ.x, mouseXYZ.y))*0.6*pow(distance,1.)*(gl_Position.z/10.);",

            "}",
			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D map;",

            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying float distancePoly;",

			"void main() {",
            "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
            "if ((distancePoly)>0.8 && cPoly.a>0.) cPoly = vec4(1.,1.,1.,distancePoly/16.); ",
            "else cPoly = vec4(1.,1.,1.,0.); ",
            "gl_FragColor = cPoly;",
			"}"

		].join("\n")

	}
};