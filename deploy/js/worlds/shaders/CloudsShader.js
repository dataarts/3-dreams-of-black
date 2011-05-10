var CloudsShader = {
	
	uniforms: {
		
		"fogColor": { type: "c", value: new THREE.Color() },
		"fogDensity": { type: "f", value: 0 },

		"enableLighting" : { type: "i", value: 1 },
		"ambientLightColor" : { type: "fv", value: [] },
		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },
		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] }

	},

	vertexShader: [

		"uniform vec3 ambientLightColor;",
		"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
		
		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormal;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"varying vec3 vWorldVector;",

		"void main() {",

			"vec3 transformedNormal = normalize( normalMatrix * normal );",
			"vNormalsquare = transformedNormal * transformedNormal;",
			"vNormal = transformedNormal;",
			
			"vColor = color;",

			"vLightWeighting = ambientLightColor;",

			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",
			
			"lDirection = viewMatrix * vec4( directionalLightDirection[ 1 ], 0.0 );",
		//	"directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"directionalLightWeighting = dot( transformedNormal, normalize( lDirection.xyz ) ) * 0.5 + 0.5;",
			"vLightWeighting += directionalLightColor[ 1 ] * directionalLightWeighting;",
			
			//"vLightWeighting = vLightWeighting * vec3(0.5, 0.55, 0.45) + vec3(0.5, 0.45, 0.55);",

			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"vWorldVector = ( vWorldPosition - cameraPosition ) * vec3( 0.01, 0.02, 0.01 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"const vec3 skyBlue = vec3( -0.37, -0.05, 0.15 );",

		"uniform vec3 fogColor;",
		"uniform float fogDensity;",

		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormal;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"uniform vec3 vectorA;",
		"uniform vec3 vectorB;",
		"uniform vec3 vectorC;",

		"varying vec3 vWorldVector;",

		"void main() {",

			"float f;",
			"vec3 normal;",
			"vec3 sky_color;",
			
			// lights
			
			"gl_FragColor = vec4( vec3( vLightWeighting ) * vec3( 0.9, 0.5, 0.3 ) + vec3( 0.7, 0.6, 0.6 ), vLightWeighting * 0.95 + 0.05 );",


			// fog
/*			
			"const float LOG2 = 1.442695;",
			"float depth = ( gl_FragCoord.z / gl_FragCoord.w ) * 50.0;",
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",
*/
			"const float viewDistance = 6000.0 * 2.0;", // tile size is 6000 and we'd like to see 2 tiles ahead
			"float fogFactor = clamp(( gl_FragCoord.z / gl_FragCoord.w ) / viewDistance, 0.0, 1.0 );",
			"fogFactor *= fogFactor;",


			// mix sky color and fog

			"f = max( 0.0, normalize( vWorldVector ).y + cameraPosition.y * 0.0002 - 0.05 );",
			"sky_color = mix( vec3( 1.0 ), skyBlue, f );",

			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.a ), fogFactor );",

		"}"

	].join("\n")

};

function applyCloudsShader( obj, shader ) {

	var shaderParams = {

		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		
		shading: THREE.FlatShading,
		lights: true,
		fog: true,
		vertexColors: THREE.VertexColors

	};

		
	var mat = new THREE.MeshShaderMaterial( shaderParams );
	mat.uniforms = THREE.UniformsUtils.clone( shaderParams.uniforms );
	
	obj.materials[ 0 ] = mat;
	
};

