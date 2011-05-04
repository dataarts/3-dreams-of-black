var VideoShaderSource = {
	opaque: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
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
				"gl_FragColor = vec4( c.rgb * vec3(1.4), c.a);",
			"}"
		].join("\n")

	},
	
	halfAlpha : {

		uniforms: {
			"map": { type: "t", value: 0, texture: null },
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
				"vec4 c = texture2D( map, vec2( vUv.x * 0.5, vUv.y ) );",
				"vec4 a = texture2D( map, vec2( 0.5 + vUv.x * 0.5, vUv.y ) );",
				"gl_FragColor = vec4(c.rgb, a.r);",
			"}"

		].join("\n")

	},
	
	smartAlpha : {

		uniforms: {
			"map": { type: "t", value: 0, texture: null },
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
				"vec4 c = texture2D( map, vec2( vUv.x * 0.6666, vUv.y ) );",
				"vec4 a = texture2D( map, vec2( 0.6666 + vUv.x * 0.3333, vUv.y ) );",
				"gl_FragColor = vec4(c.rgb, a.r);",
			"}"

		].join("\n")

	},
	
	
	
	keyed: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 }
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
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",
			
			"varying vec2 vUv;",

			"void main() {",
				"vec3 cd = vec3(1.0 - colorScale);",
				"vec3 cs = vec3(colorScale);",				
				"vec4 c = texture2D( map, vUv );",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t < threshold )",
					"alpha = t / alphaFadeout;",
				"gl_FragColor = vec4( (c.xyz - cd) * cs, alpha );",
				//"gl_FragColor = vec4( c.xyz, alpha );",
			"}"
		].join("\n")
	},
	
	keyedInverse: {

		uniforms: {
			"map" : { type: "t", value: 0, texture: null },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 }
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
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",
			
			"varying vec2 vUv;",

			"void main() {",
				"vec3 cd = vec3(1.0 - colorScale);",
				"vec3 cs = vec3(colorScale);",				
				"vec4 c = texture2D( map, vUv );",
				"float t = c.x + c.y + c.z;",
				"float alpha = 1.0;",
				"if( t > threshold )",
					"alpha = (1.0 - (t - threshold)) / alphaFadeout;",
				"gl_FragColor = vec4( (c.xyz - cd) * cs, alpha );",
				//"gl_FragColor = vec4( c.xyz, alpha );",
			"}"
		].join("\n")
	},
	
	distortOpaque: {

		uniforms: {
            "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
            "mouseXY": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

            "uniform vec2 mouseXY;",
            "uniform vec2 trail1;",
            "uniform vec2 trail2;",
            "uniform vec2 trail3;",
            "uniform float aspect;",

            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",
            "varying float distance;",
            "varying float distancePoly;",


			"void main() {",
				"vUv = uv;",
                "vUvPoly = uv+vec2(normal.x,normal.y);",

                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "viewPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                "projPos = vec2(aspect,1.)*vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "projPosPoly = vec2(aspect,1.)*vec2(viewPosPoly.x/viewPosPoly.z,viewPosPoly.y/viewPosPoly.z);",

                "distance = max(0.,1.0-length(projPos-vec2(mouseXY.x, mouseXY.y)));",

                "float distFade = normal.z*0.8+0.8;",

                "distancePoly = max(0.,distFade-length(projPosPoly-vec2(mouseXY.x, mouseXY.y)));",

                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*0.6*pow(distance,1.)*(viewPos.z/10.);",
                "gl_Position = viewPos;",

			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D map;",

            "uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",

            "varying float distance;",
            "varying float distancePoly;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x, vUv.y ) );",
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.7) c = cPoly; ",
                "if (c.a<=0.1) discard;",
                "else gl_FragColor = c;",
			"}"

		].join("\n")

	},
	
	distortSmartalpha: {

		uniforms: {
            "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
            "mouseXY": { type: "v2", value: new THREE.Vector2() }
		},

		vertexShader: [

            "uniform vec2 mouseXY;",
            "uniform vec2 trail1;",
            "uniform vec2 trail2;",
            "uniform vec2 trail3;",
            "uniform float aspect;",

            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",
            "varying float distance;",
            "varying float distancePoly;",


			"void main() {",
				"vUv = uv;",
                "vUvPoly = uv+vec2(normal.x,normal.y);",

                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "viewPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                "projPos = vec2(aspect,1.)*vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "projPosPoly = vec2(aspect,1.)*vec2(viewPosPoly.x/viewPosPoly.z,viewPosPoly.y/viewPosPoly.z);",

                "distance = max(0.,1.0-length(projPos-vec2(mouseXY.x, mouseXY.y)));",

                "float distFade = normal.z*0.8+0.8;",

                "distancePoly = max(0.,distFade-length(projPosPoly-vec2(mouseXY.x, mouseXY.y)));",

                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*0.6*pow(distance,1.)*(viewPos.z/10.);",
                "gl_Position = viewPos;",

			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D map;",

            "uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",

            "varying float distance;",
            "varying float distancePoly;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x * 0.6666, vUv.y ) );",
				"vec4 a = texture2D( map, vec2( 0.6666 + vUv.x * 0.3333, vUv.y ) );",
				"c.a = a.r;",

				"vec4 cPoly = texture2D( map, vec2( vUvPoly.x * 0.6666, vUvPoly.y ) );",
				"vec4 aPoly = texture2D( map, vec2( 0.6666 + vUvPoly.x * 0.3333, vUvPoly.y ) );",
				"cPoly.a = aPoly.r;",
				
				"if ((distancePoly)>0.7) c = cPoly; ",
				
                
                "if (c.a<=0.2) discard;",
                "else gl_FragColor = c;",
			"}"

		].join("\n")

	},
	
	distortKeyed : {

		uniforms: {
            "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
            "mouseXY": { type: "v2", value: new THREE.Vector2() },
			"colorScale": { type: "f", value: 1 },
			"threshold": { type: "f", value: 0.5 },
			"alphaFadeout": { type: "f", value: 0.5 }
		},

		vertexShader: [

            "uniform vec2 mouseXY;",
            "uniform vec2 trail1;",
            "uniform vec2 trail2;",
            "uniform vec2 trail3;",
            "uniform float aspect;",

            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",
            "varying float distance;",
            "varying float distancePoly;",


			"void main() {",
				"vUv = uv;",
                "vUvPoly = uv+vec2(normal.x,normal.y);",

                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "viewPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                "projPos = vec2(aspect,1.)*vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "projPosPoly = vec2(aspect,1.)*vec2(viewPosPoly.x/viewPosPoly.z,viewPosPoly.y/viewPosPoly.z);",

                "distance = max(0.,1.0-length(projPos-vec2(mouseXY.x, mouseXY.y)));",

                "float distFade = normal.z*0.8+0.8;",

                "distancePoly = max(0.,distFade-length(projPosPoly-vec2(mouseXY.x, mouseXY.y)));",

                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*0.6*pow(distance,1.)*(viewPos.z/10.);",
                "gl_Position = viewPos;",

			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D map;",
			"uniform float colorScale;",
			"uniform float threshold;",
			"uniform float alphaFadeout;",

            "uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",

            "varying float distance;",
            "varying float distancePoly;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x, vUv.y ) );",
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.7) c = cPoly; ",
                "if (c.a<=0.1) {",
				"	discard;",
				"} else {",	
				"	vec3 cd = vec3(1.0 - colorScale);",
				"	vec3 cs = vec3(colorScale);",				
				"	float t = c.x + c.y + c.z;",
				"	float alpha = 1.0;",
				"	if( t < threshold )",
				"		alpha = t / alphaFadeout;",
				"	gl_FragColor = vec4( (c.xyz - cd) * cs, alpha );",		
				"}",
			"}"

		].join("\n")

	},
	
	distortWire : {

		uniforms: {
            "aspect": { type: "f", value: 0 },
			"map": { type: "t", value: 0, texture: null },
            "mouseXY": { type: "v2", value: new THREE.Vector2() },
		},

		vertexShader: [

            "uniform vec2 mouseXY;",
            "uniform float aspect;",

            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",
            "varying float distance;",
            "varying float distancePoly;",


			"void main() {",
				"vUv = uv;",
				"vUv = uv;",
                "vUvPoly = uv+vec2(normal.x,normal.y);",

                "viewPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "viewPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

                "projPos = vec2(aspect,1.)*vec2(viewPos.x/viewPos.z,viewPos.y/viewPos.z);",
                "projPosPoly = vec2(aspect,1.)*vec2(viewPosPoly.x/viewPosPoly.z,viewPosPoly.y/viewPosPoly.z);",

                "distance = max(0.,1.0-length(projPos-vec2(mouseXY.x, mouseXY.y)));",

                "float distFade = normal.z*0.8+0.8;",

                "distancePoly = max(0.,distFade-length(projPosPoly-vec2(mouseXY.x, mouseXY.y)));",

                "viewPos.xy = viewPos.xy + normalize(projPos-vec2(mouseXY.x, mouseXY.y))*0.6*pow(distance,1.)*(viewPos.z/10.);",
                "gl_Position = viewPos;",
			"}"

		].join("\n"),

		fragmentShader: [
            "uniform sampler2D map;",
            "uniform vec2 tileOffsetX;",

            "uniform vec2 mouseXY;",
            "varying vec2 vUv;",
            "varying vec2 vUvPoly;",
            "varying vec3 pos;",
            "varying vec3 posPoly;",
            "varying vec4 viewPos;",
            "varying vec4 viewPosPoly;",
            "varying vec2 projPos;",
            "varying vec2 projPosPoly;",

            "varying float distance;",
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