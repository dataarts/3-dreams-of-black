var DistortUniforms = {
      "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 },
      "mouseXYZ": { type: "v3", value: new THREE.Vector3() },
      "mouseSpeed": { type: "v2", value: new THREE.Vector2() },
      "mouseRad": { type: "f", value: 0 },
      "near": { type: "f", value: 1 },
      "far": { type: "f", value: 2000 },
      "depthPass" : {type: "f", value: 1.}
		};


var DistortShaderFragmentPars = [
      "uniform sampler2D map;",
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",
      "uniform float depthPass;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying float distancePoly;",
      "varying float vDepth;"].join("\n");

var DistortVertexShader = [
      "uniform vec3 mouseXYZ;",
      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",
      "uniform float depthPass;",
      "uniform vec2 mouseSpeed;",
      "uniform float mouseRad;",

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

                  //"float distance = max(0.,1.0-length(vec3(projPos,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",
                  "float distance = max(0.,1.0-length(vec2(projPos)-vec2(mouseXYZ.x, mouseXYZ.y)));",
                  "float distFade = normal.z*0.9+0.4;",
                  "distance *= mouseRad;",

                  //"distancePoly = max(0.,distFade-length(vec3(projPosPoly,vDepth*10.)-vec3(mouseXYZ.x, mouseXYZ.y, mouseXYZ.z/25.5)));",
                  "distancePoly = max(0.,distFade-length(vec2(projPosPoly)-vec2(mouseXYZ.x, mouseXYZ.y)));",
                  "distancePoly *= mouseRad;",

                  //"gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXYZ.x, mouseXYZ.y)-pow(mouseSpeed.xy,vec2(3.)))*pow(distance,2.);",
                  "gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXYZ.x, mouseXYZ.y))*vec2(distance*100.);",
                  "gl_Position.xy = gl_Position.xy -mouseSpeed.xy*pow(distance,2.)*200.;",
                  "gl_Position.z -= distance;",

            "}",

			"}"

		].join("\n");



var VideoShaderSource = {
	opaque: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
      "near": { type: "f", value: 1 },
      "far": { type: "f", value: 2000 },
      "depthPass" : {type: "f", value: 1.}
		},

		vertexShader: [
			"varying vec2 vUv;",
      "varying float vDepth;",

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
      "uniform float depthPass;",

			"varying vec2 vUv;",
      "varying float vDepth;",
			
			"void main() {",				
				"gl_FragColor = texture2D( map, vUv );",
        "if (depthPass == 1.0) gl_FragColor = vec4(vDepth, vDepth, vDepth, gl_FragColor.a );",
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

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [
        
      DistortShaderFragmentPars,

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

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [

			DistortShaderFragmentPars,

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

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [

      DistortShaderFragmentPars,

			"void main() {",
            "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
            "if ((distancePoly)>0.3 && cPoly.a>0.05) cPoly = vec4( cPoly.rgb*2.,distancePoly/4.); ",
            "else cPoly = vec4(1.,1.,1.,0.); ",
            "gl_FragColor = cPoly;",
			"}"

		].join("\n")

	},

	distortWireKeyed : {

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [

      DistortShaderFragmentPars,

			"void main() {",
				"vec3 cd = vec3(1.0 - colorScale);",
				"vec3 cs = vec3(colorScale);",
        "vec4 c = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t < threshold )",
					"alpha = t / alphaFadeout;",

            "if ((distancePoly)>0.3 && alpha>0.05) gl_FragColor = vec4( c.rgb*2., distancePoly/4. ); ",

			"}"
        
		].join("\n")

	}
};