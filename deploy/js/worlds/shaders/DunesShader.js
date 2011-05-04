var DunesShaderEffectors = [ new THREE.Vector4( 0, 0, -1000, 50 ), 
							 new THREE.Vector4( -100, 0, -1500, 150 ), 
							 new THREE.Vector4( 100, 0, -2000, 150 ), 
							 new THREE.Vector4( 0, 0, -2500, 100 ) ];



var DunesShader = {

	uniforms: {  

		"grassImage": { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Grass.jpg' ) },
		"surfaceImage": { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Clouds.jpg' ) },
		"map": { type: "t", value:2, texture:null },
		"map2": { type: "t", value:3, texture:null },
		"map3": { type: "t", value:4, texture:null },

		"time": { type: "f", value:0.0 },

		"targetStart": { type: "v3", value: new THREE.Vector3( 0, 0, -2000 ) },
		"targetEnd": { type: "v3", value: new THREE.Vector3( 500, 100, -5000  ) },
		
		"fogColor": { type: "c", value: new THREE.Color() },
		"fogDensity": { type: "f", value: 0 },

		"enableLighting" : { type: "i", value: 1 },
		"ambientLightColor" : { type: "fv", value: [] },
		"cameraPosition" : { type: "fv", value: [] },
		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },
		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] },
	},

	vertexShader: [

		"uniform vec3 ambientLightColor;",
		"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

		"uniform vec3 targetStart;",
		"uniform vec3 targetEnd;",
		
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

			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",
			
			"lDirection = viewMatrix * vec4( directionalLightDirection[ 1 ], 0.0 );",
			"directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 1 ] * directionalLightWeighting;",
			
			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
			"vWorldVector = (vWorldPosition - cameraPosition) * vec3(0.01, 0.02, 0.01);",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D grassImage;",
		"uniform sampler2D surfaceImage;",
		"uniform sampler2D map;",
		"uniform sampler2D map2;",
		"uniform sampler2D map3;",
		"uniform vec3 targetStart;",
		"uniform vec3 targetEnd;",

		"uniform float time;",
		"const vec3 vectorA = vec3( 1.0, 1.0, 1.0 );",
		"const vec3 vectorB = vec3( -0.37, -0.05, 0.15 );",
		"const vec3 vectorC = vec3( 0.83, 0.69, 0.51 );",

		"uniform vec3 fogColor;",
		"uniform float fogDensity;",

		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"varying vec3 vWorldVector;",

		"void main() {",

			"float distance, f;",
			"vec3 normal;",
			"vec3 sky_color;",
			"vec4 surface;",
			"vec4 grass;",
			
			"f = normalize(vWorldVector).y + cameraPosition.y * 0.0002 - 0.255;",
			"f = max(f, 0.0);",
			"sky_color = mix(vectorA, vectorB, f);",			
			
			"vec3 worldPosition = vWorldPosition * 0.0005;",


			// remove this
			"vec3 pointStart = vWorldPosition - targetStart;",
			"vec3 endStart = targetEnd - targetStart;",
			"float endStartLength2 = dot(endStart, endStart);",
			"float pointOnLine = clamp( dot( endStart, pointStart ) / endStartLength2, 0.0, 1.0 );",
			"distance = length( vWorldPosition - ( targetStart + pointOnLine * ( targetEnd - targetStart ))) * -0.005;",
			
			
			"grass = texture2D( grassImage, worldPosition.yz * vec2(10.0)) * vNormalsquare.xxxx + ",
			        "texture2D( grassImage, worldPosition.xz * vec2(10.0)) * vNormalsquare.yyyy + ",
			        "texture2D( grassImage, worldPosition.xy * vec2(10.0)) * vNormalsquare.zzzz;",
			"distance += (0.5 + grass.g) * texture2D(surfaceImage, worldPosition.zx * vec2(3.0)).g;",
			"surface = vec4( vec3( 0.5 ), 1.0 );",

			"if(distance > 0.0)",
				"surface = grass;",

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"depth *= 0.0002;",

			"gl_FragColor = surface * vec4( vColor, 1.0 ) * vec4(2.0);",
			"gl_FragColor = mix(gl_FragColor * texture2D(surfaceImage, worldPosition.zx * vec2(0.4) + vec2(time)), gl_FragColor, vec4(vectorC.rgb, 0.1));",
	

			// lights
			
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",


			// fog
			
			"depth = gl_FragCoord.z / gl_FragCoord.w;",
			"depth *= 40.0;",
			"const float LOG2 = 1.442695;",
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor );",
		"}"

	].join("\n")

};


function applyDunesShader( result ) {
	
	var i, name, geometry, obj, mat;

	var shaderParams = {

		uniforms: DunesShader.uniforms,
		vertexShader: DunesShader.vertexShader,
		fragmentShader: DunesShader.fragmentShader,
		
		shading: THREE.FlatShading,
		lights: true,
		fog: true,
		vertexColors: THREE.VertexColors

	};

	shaderParams.uniforms[ 'grassImage' ].texture.wrapS = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'grassImage' ].texture.wrapT = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapS = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapT = THREE.RepeatWrapping;
	
	var mat = new THREE.MeshShaderMaterial( shaderParams );
	
	for( name in result.objects ) {

		obj = result.objects[ name ];
		
		if( obj.geometry && obj.geometry.morphTargets.length === 0 ) {
			
			obj.materials[ 0 ] = mat;

		}
		
	}
	
};


function updateDunesShader( delta ) {
	
	DunesShader.uniforms.time.value += delta * 0.00001;

};
