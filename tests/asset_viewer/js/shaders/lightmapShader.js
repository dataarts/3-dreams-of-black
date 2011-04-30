var lightmapShaderSource = {

  'lightmapShader' : {

    uniforms: {
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 0 },
      "shaderDebug": 				{ type: "f", value: 1. },
      "faceLight": { type: "t", value: 1, texture: null },
      "enableTexture": 				{ type: "f", value: 1. },
      "enableLighting": 				{ type: "f", value: 1. },
      "enableLights": 				{ type: "f", value: 1. },
      "ambientLightColor": 			{ type: "fv", value: [] },
      "directionalLightDirection": 	{ type: "fv", value: [] },
      "directionalLightColor": 		{ type: "fv", value: [] },
      "pointLightColor": 				{ type: "fv", value: [] },
      "pointLightPosition": 			{ type: "fv", value: [] },
      "pointLightDistance": 			{ type: "fv1", value: [] }
    },

    vertexShader: [

      "uniform float near;",
      "uniform float far;",

      "uniform float enableLights;",

      "varying vec2 vUv;",
      "varying vec3 vLightWeighting;",
      "varying vec3 vNormal;",
      "varying float depth;",

      THREE.ShaderChunk[ "lights_pars_vertex" ],

      "void main() {",

      "vUv = vec2(uv.xy);",

      "vec3 transformedNormal = normalize( normalMatrix * normal );",

      THREE.ShaderChunk[ "lights_vertex" ],

      "if (enableLights == 0.0) vLightWeighting = vec3(1.,1.,1.) ;",

      "vNormal = transformedNormal;",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

      "depth = (gl_Position.z+near)/far;",

      "}"

    ].join("\n"),


    fragmentShader: [

      "uniform sampler2D faceLight;",
      "uniform float 	shaderDebug;",
      "uniform float 	enableTexture;",
      "uniform float  enableLighting;",

      "varying vec2   vUv;",
      "varying vec3 vNormal;",
      "varying vec3 vLightWeighting;",
      "varying float depth;",

      "void main() {",

      "gl_FragColor = vec4(1.0,1.0,1.0,1.0);",
      "if (enableTexture > 0.0) gl_FragColor = texture2D( faceLight, vUv);",
      "gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",
      "if (shaderDebug == 2.0) gl_FragColor = vec4( vNormal*0.5 + vec3(0.5), 1.0 );",
      "if (shaderDebug == 3.0) gl_FragColor = vec4( (depth*3.), (depth*3.-1.), (depth*3.-2.), 1.0 );",

      "}"

    ].join("\n")

  }

};