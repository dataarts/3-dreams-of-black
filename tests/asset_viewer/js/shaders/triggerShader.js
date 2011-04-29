
var triggerShaderSource = {

  'triggerShader' : {

    uniforms: {
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 0 },
      "effectors": 					{ type: "fv", value: [ 0, 200, 0, 0, 100000, 0 ] },
      "diffuse":            { type: "c", value: new THREE.Color( 0xffffff ) },
      "shaderDebug": 				{ type: "f", value: 1. },
      "enableLighting": 				{ type: "f", value: 1. },
      "enableLights": 				{ type: "f", value: 1. },
      "enableTexture": 				{ type: "f", value: 1. },
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

      "const 		int		NUMEFFECTORS = 1;",
      "uniform 	vec3 	effectors[ NUMEFFECTORS ];",
      "uniform float enableLights;",

      THREE.ShaderChunk[ "map_pars_vertex" ],
      THREE.ShaderChunk[ "lights_pars_vertex" ],
      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

      "varying vec3 vLightWeighting;",
      "varying vec3 vNormal;",
      "varying float depth;",

      "float elastic( float k ) {",

      "float s;",
      "float a = 0.8;",
      "float p = 0.7;",
      "if ( k == 0.0 ) return 0.0; if ( k == 1.0 ) return 1.0; if ( p == 0.0 ) p = 0.3;",
      "if ( a == 0.0 || a < 1.0 ) { a = 1.0; s = p / 4.0; }",
      "else s = p / ( 2.0 * 3.14159265 ) * asin( 1.0 / a );",
      "return ( a * pow( 2.0, -10.0 * k ) * sin( ( k - s ) * ( 2.0 * 3.14159265 ) / p ) + 1.0 );",

      "}",

      "void main() {",

      "vec3 worldPosition = ( objectMatrix * vec4( position, 1.0 )).xyz;",
      "float morph = 0.0;",

      "for( int i = 0; i < NUMEFFECTORS; i++ ) {",

      "morph = max( morph, smoothstep( 0.0, 0.4, 1.0 - distance( morphTarget0, effectors[ i ] ) / 2000.0 ));",
//				"morph = distance( worldPosition, effectors[ i ] ) / 1000.0;",

      "}",

      "morph = elastic( morph );",

      "vec4 mvPosition = modelViewMatrix * vec4( mix( morphTarget0, morphTarget1, morph ), 1.0 );",

      THREE.ShaderChunk[ "map_vertex" ],
      THREE.ShaderChunk[ "color_vertex" ],

      "vec3 transformedNormal = normalize( normalMatrix * normal );",

      THREE.ShaderChunk[ "lights_vertex" ],

      "if (enableLights == 0.0) vLightWeighting = vec3(1.,1.,1.) ;",

      "vNormal = transformedNormal;",

      "gl_Position = projectionMatrix * mvPosition;",

      "depth = (gl_Position.z+near)/far;",

      "}"


    ].join("\n"),

    fragmentShader: [

      "uniform float  darkness;",
      "uniform vec3 	diffuse;",
      "uniform float 	opacity;",
      "uniform float 	enableTexture;",
      "uniform float  enableLighting;",
      "uniform float 	shaderDebug;",

      "varying vec3 vLightWeighting;",
      "varying vec3 vNormal;",
      "varying float depth;",

      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "map_pars_fragment" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],

      "void main() {",

      "vec4 color = vec4( diffuse, opacity );",
      "color = gl_FragColor = color * vec4( vLightWeighting, 1.0 );",

      THREE.ShaderChunk[ "map_fragment" ],
      THREE.ShaderChunk[ "color_fragment" ],

      "if (enableTexture == 0.0) gl_FragColor = color;",

      "gl_FragColor = vec4( gl_FragColor.rgb * ( 1.0 - darkness ), 1.0 );",
      THREE.ShaderChunk[ "fog_fragment" ],
      "if (shaderDebug == 2.0) gl_FragColor = vec4( vNormal*0.5 + vec3(0.5), 1.0 );",
      "if (shaderDebug == 3.0) gl_FragColor = vec4( (depth*3.), (depth*3.-1.), (depth*3.-2.), 1.0 );",

      "}"

    ].join("\n")
  }
}