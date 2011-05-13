var UgcShader = {

	update: function( skyWhite ) {
		
		skyWhite = skyWhite !== undefined ? Math.max( 0, Math.min( 1, skyWhite )) : 1;
		
		for( var i = 0; i < UgcShader.savedUniforms.length; i++ ) {
			
			UgcShader.savedUniforms[ i ].skyWhite.value = skyWhite;
			
		}
		
	},
	
	savedUniforms: [],

	uniforms: function() {
		
		var uniform = {

	    	"skyWhite": { type: "f", value: 1 },
	
			"invertLightY" : { type: "f", value: 1.0 },
			
			"fogColor": { type: "c", value: new THREE.Color() },
			"fogDensity": { type: "f", value: 0 },
	
			"enableLighting" : 				{ type: "i", value: 1 },
			"ambientLightColor" : 			{ type: "fv", value: [] },
			"directionalLightDirection" : 	{ type: "fv", value: [] },
			"directionalLightColor" : 		{ type: "fv", value: [] },
			"pointLightColor": 				{ type: "fv", value: [] },
			"pointLightPosition": 			{ type: "fv", value: [] },
			"pointLightDistance": 			{ type: "fv1", value: [] }
	
		};
		
		UgcShader.savedUniforms.push( uniform );
		
		return 	uniform;
		
	},

	vertexShader: [

		"uniform vec3  ambientLightColor;",
		"uniform vec3  directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3  directionalLightDirection[ MAX_DIR_LIGHTS ];",
		"uniform float invertLightY;",
		
		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"varying vec3 vWorldVector;",

		"void main() {",

			"vec3 transformedNormal = normalize( normalMatrix * normal );",
			"vNormalsquare = transformedNormal * transformedNormal;",

			"vColor = color;",

			"vLightWeighting = ambientLightColor;",


			"vec3 lightDir = directionalLightDirection[ 0 ];",
			"lightDir.y *= invertLightY;",

			"vec4 lDirection = viewMatrix * vec4( lightDir, 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",


			"lightDir = directionalLightDirection[ 1 ];",
			"lightDir.y *= invertLightY;",

			"lDirection = viewMatrix * vec4( lightDir, 0.0 );",
			"directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 1 ] * directionalLightWeighting;",


			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
			"vWorldVector = (vWorldPosition - cameraPosition) * vec3(0.01, 0.02, 0.01);",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"const   vec3 	skyBlue = vec3( -0.37, -0.05, 0.15 );",
		"const 	 vec3 	cloudMix = vec3( 0.83 * 0.83, 0.69 * 0.69, 0.51 * 0.51 );",

	    "uniform float  skyWhite;",
		"uniform vec3 fogColor;",
		"uniform float fogDensity;",

		"varying vec3 vColor;",
		"varying vec3 vLightWeighting;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vWorldPosition;",
		"varying vec3 vWorldVector;",

		"void main() {",

			"gl_FragColor = vec4(vColor,1.);",
    	  "gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

			"const float viewDistance = 6000.0 * 2.0;",
			"float fogFactor = clamp(( gl_FragCoord.z / gl_FragCoord.w ) / viewDistance, 0.0, 1.0 );",
			"fogFactor *= fogFactor;",

			"float f = max( 0.0, normalize( vWorldVector ).y + cameraPosition.y * 0.0002 - 0.05 );",
			"vec3 sky_color = mix( vec3( skyWhite ), skyBlue, f );",

			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n")

};