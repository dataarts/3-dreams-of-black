var DunesShaderColors = {
	
	vectorA: new THREE.Vector3( 1.0, 1.0, 1.0 ),
	vectorB: new THREE.Vector3( -0.37, -0.05, 0.15 ),
	vectorC: new THREE.Vector3( 0.83, 0.69, 0.51 )
	
}

var DunesShader = {

	uniforms: {  

		"grassImage": { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Grass.jpg' ) },
		"surfaceImage": { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Clouds.jpg' ) },
		"map": { type: "t", value:2, texture:null },
		"map2": { type: "t", value:3, texture:null },
		"map3": { type: "t", value:4, texture:null },

		"time": { type: "f", value:0.0 },

		"targetStart": { type: "v3", value: new THREE.Vector3() },
		"targetEnd": { type: "v3", value: new THREE.Vector3() },
		
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

		"vectorA": { type: "v3", value: DunesShaderColors.vectorA },
		"vectorB": { type: "v3", value: DunesShaderColors.vectorB },
		"vectorC": { type: "v3", value: DunesShaderColors.vectorC }

	},

	vertexShader: [

		"uniform vec3 ambientLightColor;",
		"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

		"uniform vec3 targetStart;",
		"uniform vec3 targetEnd;",
		
		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormal;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"varying vec3 worldVector;",

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
			"directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 1 ] * directionalLightWeighting;",
			
			//"vLightWeighting = vLightWeighting * vec3(0.5, 0.55, 0.45) + vec3(0.5, 0.45, 0.55);",

			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"worldVector = (vWorldPosition - cameraPosition) * vec3(0.01, 0.02, 0.01);",

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
/*
VectorA 1, 1, 1,
-0.37 -0.05 0.15
0.83 0.69 0.51
*/
		"varying vec3 worldVector;",

		"void main() {",

			"float distance, f;",
			"vec3 normal;",
			"vec3 sky_color;",
			"vec4 surface;",
			"vec4 grass;",
			"f = normalize(worldVector).y + cameraPosition.y * 0.0002 - 0.255;",
			"f = max(f, 0.0);",
			"sky_color = mix(vectorA, vectorB, f);",			
			"vec3 worldPosition = vWorldPosition * 0.0005;",

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
				//"surface = mix( surface, grass, smoothstep( 0.0, 0.1, distance ));",

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"depth *= 0.0002;",

			"gl_FragColor = surface * vec4( vColor, 1.0 ) * vec4(2.0);",
			"gl_FragColor = mix(gl_FragColor * texture2D(surfaceImage, worldPosition.zx * vec2(0.4) + vec2(time)), gl_FragColor, vec4(vectorC.rgb, 0.1));",
	

			// lights
			
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

			// fog
			
			"depth = gl_FragCoord.z / gl_FragCoord.w;",
			"depth *= 50.0;",
			"const float LOG2 = 1.442695;",
			"float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor/*min(length(worldVector) * 0.02, 1.0) */);",
		"}"

	].join("\n")

};

function applyDunesShader( result, exclude, start, end, materials, shader ) {
	
	var i, name, geometry, obj, mat;

	var excludeMap = {};
	
	for ( i = 0; i < exclude.length; i++ ) {
		
		excludeMap[ exclude[ i ] ] = true;
		
	}

	var shaderParams = {

		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		
		shading: THREE.FlatShading,
		lights: true,
		fog: true,
		vertexColors: THREE.VertexColors

	};

	shaderParams.uniforms[ 'grassImage' ].texture.wrapS = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'grassImage' ].texture.wrapT = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapS = THREE.RepeatWrapping;
	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapT = THREE.RepeatWrapping;
	
	function createDunesMaterial() {

		mat = new THREE.MeshShaderMaterial( shaderParams );

		mat.uniforms = THREE.UniformsUtils.clone( shaderParams.uniforms );
		
		mat.uniforms[ 'targetStart'  ].value   = start;
		mat.uniforms[ 'targetEnd'    ].value   = end;
		mat.uniforms[ 'grassImage'   ].texture = shaderParams.uniforms[ 'grassImage'   ].texture;
		mat.uniforms[ 'surfaceImage' ].texture = shaderParams.uniforms[ 'surfaceImage' ].texture;

		mat.uniforms.vectorA.value = DunesShaderColors.vectorA;
		mat.uniforms.vectorB.value = DunesShaderColors.vectorB;
		mat.uniforms.vectorC.value = DunesShaderColors.vectorC;
		
		obj.materials[ 0 ] = mat;
		materials.push( mat );

	}
	
	// copy materials to all geo chunks and add AO-texture

	for( name in result.objects ) {

		obj = result.objects[ name ];
		
		if ( excludeMap[ name ] ) continue;

		if( obj.geometry && obj.geometry.morphTargets.length === 0 ) {
			
			geometry = obj.geometry;
			
			for( i = 0; i < geometry.materials.length; i++ ) {
				
				createDunesMaterial();

			}
			
			if ( geometry.materials.length == 0 ) {

				createDunesMaterial();

			}
			
		}
		
	}
	
};

function updateDunesShader( start, end, materials, position, front, time ) {
	
	start.copy( position );
	end.copy( front );
	
	start.y = 0;
	end.y = 0;
	
	var i, l = materials.length;
	
	for( i = 0; i < l; i++ ) {

		materials[ i ].uniforms[ 'time'  ].value = time;
		
	}

};
