
postShader = {

  textures: {
  },

  uniforms:{
    "time": { type: "f", value: 0 },
    "sphere": { type: "fv", value: [0.000000,0.000000,-1.000000,0.000000,0.525731,-0.850651,0.500000,0.162460,-0.850651,0.000000,0.894427,-0.447213,0.500000,0.688191,-0.525731,0.850651,0.276394,-0.447213,0.309017,-0.425325,-0.850651,0.809017,-0.262865,-0.525731,0.525731,-0.723607,-0.447213,-0.309017,-0.425325,-0.850651,0.000000,-0.850651,-0.525731,-0.525731,-0.723607,-0.447213,-0.500000,0.162460,-0.850651,-0.809017,-0.262865,-0.525731,-0.850651,0.276394,-0.447213,-0.500000,0.688191,-0.525731,-0.309017,0.951057,0.000000,-0.809017,0.587785,0.000000,-0.525731,0.723607,0.447213,-1.000000,0.000000,0.000000,-0.809017,-0.587785,0.000000,-0.850651,-0.276394,0.447213,-0.309017,-0.951057,0.000000,0.309017,-0.951057,0.000000,0.000000,-0.894427,0.447213,0.809017,-0.587785,0.000000,1.000000,0.000000,0.000000,0.850651,-0.276394,0.447213,0.809017,0.587785,0.000000,0.309017,0.951057,0.000000,0.525731,0.723607,0.447213,0.000000,0.850651,0.525731,-0.809017,0.262865,0.525731,-0.500000,-0.688191,0.525731,0.500000,-0.688191,0.525731,0.809017,0.262865,0.525731,0.000000,0.000000,1.000000,0.309017,0.425325,0.850651,-0.309017,0.425325,0.850651,0.500000,-0.162460,0.850651,0.000000,-0.525731,0.850651,-0.500000,-0.162460,0.850651] },
    "tColor": { type: "t", value: 0, texture: null },
    "tDepth": { type: "t", value: 1, texture: null },
    "tNoise": { type: "t", value: 2, texture: null },
    "dof":    { type: "f", value: 0.0 },
    "ssao":    { type: "f", value: 0.0 },
    "ssaoRad":    { type: "f", value: 0.0 },
    "focus":    { type: "f", value: 0.33 },
		"aspect":   { type: "f", value: aspect },
		"aperture": { type: "f", value: 0.025 },
		"maxblur":  { type: "f", value: 1.0 }
    },

    vertexShader: [

  "varying vec2 vUv;",

  "void main() {",

  "vUv = vec2( uv.x, 1.0 - uv.y );",
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

  "}"

].join("\n"),

    fragmentShader: [

  "uniform sampler2D tColor;",
  "uniform sampler2D tDepth;",
  "uniform sampler2D tNoise;",

  "uniform float maxblur;",  	// max blur amount
  "uniform float aperture;",	// aperture - bigger values for shallower depth of field
  "uniform float dof;",
  "uniform float ssao;",
  "uniform float ssaoRad;",
  "uniform vec3 sphere[42];",
  "uniform float focus;",
  "uniform float aspect;",

  "varying vec2 vUv;",

  "void main() {",

  "vec4 col = vec4( 0.0 );",
  "float ao = 1.0;",

  "if (ssao == 1.0) {",
  "vec4 depthRGB = texture2D(tDepth, vUv);",
  "float depth = depthRGB.r/3.+depthRGB.g/3.+depthRGB.b/3.;",

  "vec4 rndVec = texture2D( tNoise, vUv*vec2(300.0,300.0)*vec2(depth,-depth));",

  "for( int i=1; i<42; i++ ){",

  "vec3 rndUv = vec3(vUv,depth) + ssaoRad*reflect(sphere[i].xyz,rndVec.xyz);",

  "vec3 rndDepthRGB = texture2D(tDepth,rndUv.xy).rgb;",
  "float rndDepth = rndDepthRGB.r/3.+rndDepthRGB.g/3.+rndDepthRGB.b/3.;",

  "float zd = (rndUv.z-rndDepth);",
  "zd = max(min(zd-0.06,0.22-zd), 0.0);",
  "ao += 1.0/(1.0+7000.0*zd*zd);",
  "}",

  "ao = ao/42.0;",
  "}",

  "if (dof == 1.0) {",
  "vec2 aspectcorrect = vec2( 1.0, aspect );",

  "vec4 depth1 = texture2D( tDepth, vUv );",

  "float factor = depth1.x - focus;",

  "vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );",

  "vec2 dofblur9 = dofblur * 0.9;",
  "vec2 dofblur7 = dofblur * 0.7;",
  "vec2 dofblur4 = dofblur * 0.4;",

  "col += texture2D( tColor, vUv.xy );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );",

  "col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",

  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );",

  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
  "col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );",

  "col = col / 41.0;",
  "} else {",
  //ANTIALIASING
  "col = texture2D( tColor, vUv );",
  "col += texture2D( tColor, vUv+vec2(.5/960.,0.) );",
  "col += texture2D( tColor, vUv+vec2(.0,.5/360.) );",
  "col += texture2D( tColor, vUv+vec2(.5/960.,.5/360.) );",
  "col *= 0.25;",
  "}",
  "gl_FragColor = col*vec4(ao,ao,ao,1.0);",
  "}"

  ].join("\n")
};

