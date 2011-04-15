
ROME = {};

ROME.TrailShaderUtils = ( function() {
	
	var that = {};
	var trailTexture;
	var markTexture;
	var GL;
	var renderer;
	var maxX = -9999999, maxZ = -9999999, minX = 9999999, minZ = 9999999;
	var width, depth;
	
	
	//--- set materials ---
	
	that.setMaterials = function( meshes, trailTextureSizeIn, markTextureIn, rendererIn ) {

		// set params
		
		trailTextureSize = trailTextureSizeIn;
		markTexture = markTextureIn;
		renderer = rendererIn;
		GL = renderer.getContext();
		

		// init trail map
		
		trailTexture = GL.createTexture();
		
		GL.bindTexture( GL.TEXTURE_2D, trailTexture );
		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGB, trailTextureSize, trailTextureSize, 0, GL.RGB, GL.UNSIGNED_BYTE, null );
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR );
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST );

		ROME.TrailShader.textures.trailMap = new THREE.Texture();
		ROME.TrailShader.textures.trailMap.needsUpdate = false;
		ROME.TrailShader.textures.trailMap.__webglTexture = trailTexture;
				
				
		// find extremes
		
		var m, ml, mesh, positionX, positionZ;
		var x, z;
		var v, vl, vertices, vertex;
		
		for( m = 0, ml = meshes.length; m < ml; m++ ) {
			
			mesh = meshes[ m ];
			positionX = mesh.position.x;
			positionZ = mesh.position.y;
			vertices = mesh.geometry.vertices;
			
			for( v = 0, vl = vertices.length; v < vl; v++ ) {
				
				vertex = vertices[ v ].position;
				
				x = vertex.x + positionX;
				z = vertex.y + positionZ;
				
				maxX = Math.max( maxX, x );
				maxZ = Math.max( maxZ, z );
				minX = Math.min( minX, x );
				minZ = Math.min( minZ, z );
										
			}
			
		}
		
		width = maxX - minX;
		depth = maxZ - minZ;
		
		
		// create uv and materials

		var attributes, trailUV;
		var trailMaterial, material;

		for( m = 0; m < ml; m++ ) {

			mesh = meshes[ m ];
			positionX = mesh.position.x;
			positionZ = mesh.position.y;
			vertices = mesh.geometry.vertices;


			// create custom attributes

			attributes = ROME.TrailShader.attributes();
			trailUV = attributes.trailUV.value;


			// calc uv
			
			for( v = 0, vl = vertices.length; v < vl; v++ ) {
				
				vertex = vertices[ v ].position;
				
				trailUV.push( new THREE.Vector2(( vertex.x + positionX - minX ) / width, 
												( vertex.y + positionZ - minZ ) / depth ));
				
			}

			
			// create material
			
			trailMaterial = new THREE.MeshShaderMaterial( {
				
				uniforms: ROME.TrailShader.uniforms,
				attributes: attributes,
				vertexShader: ROME.TrailShader.vertexShader,
				fragmentShader: ROME.TrailShader.fragmentShader
				
			} );
			
			trailMaterial.fog = true;
			trailMaterial.lights = true;
			trailMaterial.vertexColors = 2;
			trailMaterial.uniforms.trailMap.texture = ROME.TrailShader.textures.trailMap;
			trailMaterial.uniforms.faceMap.texture = ROME.TrailShader.textures.faceMap;
			trailMaterial.uniforms.lavaMap.texture = ROME.TrailShader.textures.lavaMap;
			trailMaterial.uniforms.lavaNoiseMap.texture = ROME.TrailShader.textures.lavaNoiseMap;

			trailMaterial.uniforms.lavaMap.texture.wrapS = trailMaterial.uniforms.lavaMap.texture.wrapT = THREE.Repeat;
			trailMaterial.uniforms.lavaNoiseMap.texture.wrapS = trailMaterial.uniforms.lavaNoiseMap.texture.wrapT = THREE.Repeat;

			
			mesh.materials[ 0 ] = trailMaterial;
		}

	}


	//--- update lava ---

	that.updateLava = function( deltaTime ) {
		
		deltaTime = deltaTime !== undefined ? deltaTime : 1;
		
		ROME.TrailShader.uniforms.lavaTime.value += 0.0001 * deltaTime;
		
	}
	
	
	//--- set mark at ---
	
	that.setMarkAtWorldPosition = function( worldX, worldZ ) {

		var u = (( worldX - minX ) / width ) * trailTextureSize;
		var v = (( worldZ - minZ ) / depth ) * trailTextureSize;
		
		if( u >= 0 && u < trailTextureSize - markTexture.image.width && 
			v >= 0 && v < trailTextureSize - markTexture.image.height ) {
				
			GL.bindTexture( GL.TEXTURE_2D, trailTexture );
			GL.texSubImage2D( GL.TEXTURE_2D, 0, u, v, GL.RGB, GL.UNSIGNED_BYTE, markTexture.image );
				
		}
		
	}

	return that;	
	
} ());


ROME.TrailShader = {
	
	textures: {
		
		trailMap: undefined,		// set by code
		faceMap: THREE.ImageUtils.loadTexture( "assets/PaintDubs.jpg" ),
		lavaMap: THREE.ImageUtils.loadTexture( "assets/lava.jpg" ),
		lavaNoiseMap: THREE.ImageUtils.loadTexture( "assets/cloud.png" )
		
	},
	
	uniforms: {

		"trailMap": 				 	{ type: "t", value: 0, texture: undefined },
		"faceMap": 					 	{ type: "t", value: 1, texture: undefined },
		"lavaMap": 					 	{ type: "t", value: 2, texture: undefined },
		"lavaNoiseMap": 			 	{ type: "t", value: 3, texture: undefined },

		"lavaTime": 					{ type: "f", value: 0 },
		"lavaUvScale": 					{ type: "v2", value: new THREE.Vector2( 7.0, 7.0 ) },

		"fogColor": 					{ type: "c", value: new THREE.Color() },
		"fogDensity": 					{ type: "f", value: 0 },

		"enableLighting": 				{ type: "i", value: 1 },
		"ambientLightColor": 			{ type: "fv", value: [] },
		"directionalLightDirection": 	{ type: "fv", value: [] },
		"directionalLightColor": 		{ type: "fv", value: [] },
		"pointLightColor": 				{ type: "fv", value: [] },
		"pointLightPosition": 			{ type: "fv", value: [] },
		"pointLightDistance": 			{ type: "fv1", value: [] }

	},
	
	attributes: function() { return {

			"trailUV": 	{ type: "v2", boundTo: "vertices", value:[] }

		}
	},

	vertexShader: [

		"#if MAX_DIR_LIGHTS > 0",
			"uniform vec3 		directionalLightColor    [ MAX_DIR_LIGHTS ];",
			"uniform vec3 		directionalLightDirection[ MAX_DIR_LIGHTS ];",
		"#endif",
	
		"#if MAX_POINT_LIGHTS > 0",
			"uniform vec3 		pointLightColor   [ MAX_POINT_LIGHTS ];",
			"uniform vec3 		pointLightPosition[ MAX_POINT_LIGHTS ];",
			"uniform float	 	pointLightDistance[ MAX_POINT_LIGHTS ];",
		"#endif",

		"uniform vec3 		ambientLightColor;",

		"attribute	vec2	trailUV;",

		"varying 	vec2	vUV;",
		"varying 	vec2	vTrailUV;",
		"varying	vec3	vColor;",
		"varying  	vec4	vLightWeighting;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec3 transformedNormal = normalize( normalMatrix * normal );",
	
			"vLightWeighting = vec4( ambientLightColor, 1.0 );",
	
			"#if MAX_DIR_LIGHTS > 0",
	
				"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",
		
					"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
					"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
					"vLightWeighting.xyz += directionalLightColor[ i ] * directionalLightWeighting;",
		
				"}",
	
			"#endif",
	
			"#if MAX_POINT_LIGHTS > 0",
	
				"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",
	
					"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
					"vec3 lVector = lPosition.xyz - mvPosition.xyz;",
					"float lDistance = 1.0;",
	
					"if ( pointLightDistance[ i ] > 0.0 )",
						"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",
	
					"lVector = normalize( lVector );",
	
					"float pointLightWeighting = max( dot( transformedNormal, lVector ), 0.0 );",
					"vLightWeighting.xyz += pointLightColor[ i ] * pointLightWeighting * lDistance;",
	
				"}",
	
			"#endif",

			"vUV = uv;",
			"vTrailUV = trailUV;",
			"vColor = color;",
			
			"gl_Position = projectionMatrix * mvPosition;",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform 	sampler2D 	faceMap;",
		"uniform 	sampler2D 	trailMap;",
		"uniform 	sampler2D 	lavaMap;",
		"uniform 	sampler2D 	lavaNoiseMap;",

		"uniform  	vec2		lavaUvScale;",
		"uniform  	float		lavaTime;",

		"uniform 	vec3 		fogColor;",
		"uniform 	float 		fogDensity;",

		"varying 	vec2		vUV;",
		"varying 	vec2		vTrailUV;",
		"varying	vec3		vColor;",
		"varying 	vec4 		vLightWeighting;",

		"void main() {",

			// fog

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"const float LOG2 = 1.442695;",
			
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",


			// lava

			"vec4 lavaColor;",
			"float mixValue;",
			
			"float offsetU = sin( lavaTime * 10.0 ) * 0.002;",
			"float offsetV = cos( lavaTime * 11.0 ) * 0.002;",
			"vec2 uvOffsetA = vec2( offsetU, offsetV );",
			"vec2 uvOffsetB = vec2( -offsetU, offsetV );",
			
			"mixValue  = texture2D( trailMap, vTrailUV + uvOffsetA ).r;",
			"mixValue += texture2D( trailMap, vTrailUV - uvOffsetA ).r;",
			"mixValue += texture2D( trailMap, vTrailUV + uvOffsetB ).r;",
			"mixValue += texture2D( trailMap, vTrailUV - uvOffsetB ).r;",
			"mixValue /= 4.0;",
			"mixValue = smoothstep( 0.0, 0.5, mixValue );",
			
			"if( mixValue != 0.0 ) {",

				"vec2 movement = vec2( lavaTime );",
				"vec4 noise = texture2D( lavaNoiseMap, ( vTrailUV - movement ) * lavaUvScale * 3.0 + vec2( sin( lavaTime * 100.0 ) * 0.05, cos( lavaTime * 150.0 ) * 0.05 ));",
				"vec4 color = texture2D( lavaMap, ( vTrailUV + movement ) * lavaUvScale + vec2( sin( noise.a ) * 0.03, cos( noise.a * 1.1 ) * 0.03 ));",

				"lavaColor = color * color * mixValue * noise.a;",
			"}",


			// grass
			
			"vec4 grassColor = vec4( vColor, 1.0 ) * texture2D( faceMap, vUV );",
			
			
			// add up
			
			"gl_FragColor = mix( grassColor, lavaColor, mixValue ) * vLightWeighting;", 
			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
			"gl_FragColor.a = 1.0;",

		"}"

	].join("\n")
			
}

