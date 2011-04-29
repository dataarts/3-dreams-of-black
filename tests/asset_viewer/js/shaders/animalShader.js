
AnimalShader = {

  textures: {

    contour: THREE.ImageUtils.loadTexture( 'files/textures/faceContour.jpg' ),
    faceLight: THREE.ImageUtils.loadTexture( 'files/textures/faceLight.jpg' )

  },

  uniforms:  {
    "near": { type: "f", value: 0 },
    "far": { type: "f", value: 0 },
    "animalAInterpolation": 		{ type: "f", value: 0.0 },
    "animalBInterpolation": 		{ type: "f", value: 0.0 },
    "animalMorphValue" :    		{ type: "f", value: 0.0 },
    "animalLength": 				{ type: "f", value: 250.0 },
    "animalAOffset": 				{ type: "v3", value: new THREE.Vector3() },
    "animalBOffset": 				{ type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
    "shaderDebug": 				{ type: "f", value: 1. },
    "enableTexture": 				{ type: "f", value: 1. },
    "enableLights": 				{ type: "f", value: 1. },
    "contour": 						{ type: "t", value: 0, texture: null },
    "faceLight":                    { type: "t", value: 1, texture: null },
    "enableLighting": 				{ type: "i", value: 1 },
    "ambientLightColor": 			{ type: "fv", value: [] },
    "directionalLightDirection": 	{ type: "fv", value: [] },
    "directionalLightColor": 		{ type: "fv", value: [] },
    "pointLightColor": 				{ type: "fv", value: [] },
    "pointLightPosition": 			{ type: "fv", value: [] },
    "pointLightDistance": 			{ type: "fv1", value: [] }
  },

  attributes: function() {

    return {

      "colorAnimalA": 	{ type: "c", boundTo: "faces", value:[] },
      "colorAnimalB": 	{ type: "c", boundTo: "faces", value:[] },
      "contourUV": 		{ type: "v2", boundTo: "faceVertices", value:[] }

    }

  },

  vertexShader: [

    "uniform float near;",
    "uniform float far;",

    "uniform 	float	animalAInterpolation;",
    "uniform 	float	animalBInterpolation;",
    "uniform 	float	animalMorphValue;",
    "uniform 	float	animalLength;",

    "uniform 	vec3	animalAOffset;",
    "uniform 	vec3	animalBOffset;",

    "uniform float enableLights;",

    "varying vec3 vLightWeighting;",
    THREE.ShaderChunk[ "lights_pars_vertex" ],

    "attribute	vec3	colorAnimalA;",
    "attribute	vec3	colorAnimalB;",
    "attribute	vec2	contourUV;",

    "varying 	vec2	vContourUV;",
    "varying	vec3	vColor;",
    "varying vec3 vNormal;",
    "varying float depth;",

    "void main() {",

    "vContourUV = contourUV;",

    "vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
    "vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",

    "float morphValue = smoothstep( animalMorphValue - 0.2, animalMorphValue + 0.2, ( position.z + animalLength * 0.5 ) / animalLength );",

    "vec3 morphed = mix( animalA + animalAOffset, animalB + animalBOffset, morphValue );",

    "vec3 transformedNormal = normalize( normalMatrix * normal );",

    "vColor = mix( colorAnimalA, colorAnimalB, morphValue );",

    THREE.ShaderChunk[ "lights_vertex" ],

    "if (enableLights == 0.0) vLightWeighting = vec3(1.,1.,1.) ;",

    "vNormal = transformedNormal;",

    "gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

    "depth = (gl_Position.z+near)/far;",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform 	sampler2D 	contour;",
    "uniform 	sampler2D 	faceLight;",
    "uniform float 	enableTexture;",
    "uniform float  enableLighting;",
    "uniform float 	shaderDebug;",

    "varying	vec3		vColor;",
    "varying 	vec2		vContourUV;",
    "varying float depth;",

    "varying vec3 vLightWeighting;",
    "varying vec3 vNormal;",

    "void main() {",

    "gl_FragColor = vec4(1.0,1.0,1.0,1.0);",
    "if (enableTexture > 0.0) gl_FragColor = vec4( vColor * (( texture2D( contour, vContourUV ).r - 0.5 ) * 1.5 + 1.0 ), 1.0);",
    "gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",
    "if (shaderDebug == 2.0) gl_FragColor = vec4( vNormal*0.5 + vec3(0.5), 1.0 );",
    "if (shaderDebug == 3.0) gl_FragColor = vec4( (depth*3.), (depth*3.-1.), (depth*3.-2.), 1.0 );",

    "}"

  ].join("\n")
};