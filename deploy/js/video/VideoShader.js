var DistortUniforms = {

  "aspect": { type: "f", value: 0 },
  "map": { type: "t", value: 0, texture: null },
  "colorScale": { type: "f", value: 1 },
  "threshold": { type: "f", value: 0.5 },
  "alphaFadeout": { type: "f", value: 0.5 },
  "mouseXY": { type: "v2", value: new THREE.Vector2() },
  "trail0": { type: "v2", value: new THREE.Vector2() },
  "trail1": { type: "v2", value: new THREE.Vector2() },
  "trail2": { type: "v2", value: new THREE.Vector2() },
  "trail3": { type: "v2", value: new THREE.Vector2() },
  "trail4": { type: "v2", value: new THREE.Vector2() },
  "mouseSpeed": { type: "v2", value: new THREE.Vector2() },
  "mouseRad": { type: "f", value: 1. }

};


var DistortShaderFragmentPars = [

    "uniform sampler2D map;",
    "uniform float colorScale;",
    "uniform float threshold;",
    "uniform float alphaFadeout;",

    "varying vec2 vUv;",
    "varying vec2 vUvPoly;",
    "varying float distancePoly;",
    "varying float distance;"

].join("\n");

var DistortVertexShader = [

    "uniform vec2 mouseXY;",
    "uniform vec2 trail0;",
    "uniform vec2 trail1;",
    "uniform vec2 trail2;",
    "uniform vec2 trail3;",
    "uniform vec2 trail4;",
    "uniform float aspect;",
    "uniform vec2 mouseSpeed;",
    "uniform float mouseRad;",

    "varying vec2 vUv;",
    "varying vec2 vUvPoly;",
    "varying float distance;",
    "varying float distancePoly;",

    "float getDistance(vec2 p, vec2 l1, vec2 l2){",
        "float A = p.x - l1.x;",
        "float B = p.y - l1.y;",
        "float C = l2.x - l1.x;",
        "float D = l2.y - l1.y;",

        "float dot = A * C + B * D;",
        "float len_sq = C * C + D * D;",
        "float param = dot / len_sq;",

        "float xx,yy;",

        "if(param < 0.)",
        "{",
        "   xx = l1.x;",
        "   yy = l1.y;",
        "}",
        "else if(param > 1.)",
        "{",
        "    xx = l2.x;",
        "    yy = l2.y;",
        "}",
        "else",
        "{",
        "    xx = l1.x + param * C;",
        "    yy = l1.y + param * D;",
        "}",
        "return 1. - sqrt( ((p.x - xx) * (p.x - xx)) + ((p.y - yy) * (p.y - yy)) );",
    "}",

    "void main() {",

        "vUv = uv;",

        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "vUvPoly = uv+vec2(normal.x,normal.y);",
        "vec4 glPosPoly = projectionMatrix * modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

        "vec2 projPos = vec2(aspect,1.)*vec2(gl_Position.x/gl_Position.z,gl_Position.y/gl_Position.z);",
        "vec2 projPosPoly = vec2(aspect,1.)*vec2(glPosPoly.x/glPosPoly.z,glPosPoly.y/glPosPoly.z);",
        //"distance = getDistance(projPos,mouseXY,trail5);",
        "distance = max(0.,1.-length(vec2(projPos)-vec2(mouseXY.x, mouseXY.y)));",
        "distance *= mouseRad;",

        "float distFade = normal.z*0.9+0.4;",
        //"distancePoly = max(0.,distFade-length(vec2(projPosPoly)-vec2(mouseXY.x, mouseXY.y)));",
        //"distancePoly *= mouseRad;",

        "float distanceTrail0 = distFade*getDistance(projPosPoly,mouseXY,trail0);",
        "float distanceTrail1 = -0.3+1.3*distFade*getDistance(projPosPoly,trail0,trail1);",
        "float distanceTrail2 = -0.5+1.5*distFade*getDistance(projPosPoly,trail1,trail2);",
        "float distanceTrail3 = -0.7+1.7*distFade*getDistance(projPosPoly,trail2,trail3);",
        "float distanceTrail4 = -0.9+1.9*distFade*getDistance(projPosPoly,trail3,trail4);",
        "distancePoly = max(distanceTrail0,max(distanceTrail1,max(distanceTrail2,max(distanceTrail3,distanceTrail4))));",
//
        "gl_Position.xy = gl_Position.xy + normalize(projPos.xy-vec2(mouseXY.x, mouseXY.y))*vec2(distance*100.);",
        "gl_Position.xy = gl_Position.xy -mouseSpeed.xy*pow(distance,2.)*100.;",
        "gl_Position.z -= distance;",

    "}"


    
].join("\n");


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
				"gl_FragColor = texture2D( map, vUv );",
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
	
	halfAlpha : {

		uniforms: {
			"map": { type: "t", value: 0, texture: null }
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
	
	distortOpaque: {

		uniforms:DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [

      DistortShaderFragmentPars,

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x, vUv.y ) );",
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.7) c = cPoly; ",
                "if (c.a<=0.1) discard;",
                "else gl_FragColor = c;",
			"}"

		].join("\n")

	},
	
	distortKeyed : {

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [
      DistortShaderFragmentPars,

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x, vUv.y ) );",
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.6) c = cPoly; ",
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

		uniforms: DistortUniforms,

		vertexShader: DistortVertexShader,

		fragmentShader: [

      DistortShaderFragmentPars,

			"void main() {",
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.3 && cPoly.a>0.05) cPoly = vec4(cPoly.rgb*2.,distancePoly/4.); ",
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
                "vec4 cPoly = texture2D( map, vec2( vUvPoly.x, vUvPoly.y ) );",
                "if ((distancePoly)>0.8 && cPoly.a>0.) cPoly = vec4(1.,1.,1.,distancePoly/16.); ",
                "else cPoly = vec4(1.,1.,1.,0.); ",
                "gl_FragColor = cPoly;",
			"}"

		].join("\n")

	}
};
