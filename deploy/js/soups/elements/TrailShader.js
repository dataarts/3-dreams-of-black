ROME.TrailShaderUtils = ( function() {
	
	var that = {};
	var trailTexture;
	var markTexture;
	var trailTextureSize;
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

	that.updateLava = function( deltaTime, x, z ) {
		
		deltaTime = deltaTime !== undefined ? deltaTime : 1;
		
		//ROME.TrailShader.uniforms.lavaHeadPosition.value.set( x !== undefined ? x : 0, 0, z != undefined ? z : 0 );
		ROME.TrailShader.uniforms.lavaTime.value += deltaTime;

	}
	
	
	//--- set mark at ---
	
	var oldU = NaN;
	var oldV = NaN;
	
	that.setMarkAtWorldPosition = function( worldX, worldZ ) {

		if( trailTextureSize && worldX && worldZ ) {
			
			var u = (( worldX - minX ) / width ) * trailTextureSize;
			var v = (( worldZ - minZ ) / depth ) * trailTextureSize;

			var markSize = markTexture.image.width;


			if( u >= 0 && u < trailTextureSize - markSize && 
				v >= 0 && v < trailTextureSize - markSize ) {
			
				if( isNaN( oldU )) {
					
					oldU = u;
					oldV = v;
				}
				
				var du = u - oldU;
				var dv = v - oldV;
				var dist = Math.sqrt( du * du + dv * dv ) + 1;
	
				du = ( markSize * du / dist ) * 0.8;
				dv = ( markSize * dv / dist ) * 0.8;
	
				GL.bindTexture( GL.TEXTURE_2D, trailTexture );

				var currentU = oldU;
				var currentV = oldV;
	
				do {
					
					GL.texSubImage2D( GL.TEXTURE_2D, 0, Math.floor( currentU ), Math.floor( currentV ), GL.RGB, GL.UNSIGNED_BYTE, markTexture.image );
							
					currentU += du;
					currentV += dv;
					
					dist -= markSize * 0.8;
					
				} while( dist > markSize )
				
				oldU = u;
				oldV = v;

			}
		}

	}

	return that;	
	
} ());


ROME.TrailShader = {
	
	init: function() {

		ROME.TrailShader.textures.faceMap = THREE.ImageUtils.loadTexture( "/files/textures/PaintDubs.jpg" );
		ROME.TrailShader.textures.lavaMap = THREE.ImageUtils.loadTexture( "/files/textures/lava.jpg" );
		ROME.TrailShader.textures.lavaNoiseMap = THREE.ImageUtils.loadTexture( "/files/textures/Color_noise.jpg" );

	},
	
	textures: {

		trailMap: undefined,		// set by code
		faceMap: undefined,
		lavaMap: undefined,
		lavaNoiseMap: undefined

	},
	
	uniforms: {

		"trailMap": 				 	{ type: "t", value: 0, texture: undefined },
		"faceMap": 					 	{ type: "t", value: 1, texture: undefined },
		"lavaMap": 					 	{ type: "t", value: 2, texture: undefined },
		"lavaNoiseMap": 			 	{ type: "t", value: 3, texture: undefined },
		"lavaHeadPosition":				{ type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
		"lavaTime": 					{ type: "f", value: 0 },
		"lavaUvScale": 					{ type: "v2", value: new THREE.Vector2( 50.0, 50.0 ) },

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
		"varying 	vec2	vPos;",
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

			"vUV = uv;",
			"vTrailUV = trailUV;",
			"vColor = color;",
			"vPos = position.xy;",
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

		"uniform 	vec3 		lavaHeadPosition;",
		"uniform 	vec3 		fogColor;",
		"uniform 	float 		fogDensity;",

		"varying 	vec2		vUV;",
		"varying 	vec2		vPos;",
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
			"float mixValue, f;",
			
			"float offsetU = sin( lavaTime * 10.0 ) * 0.002;",
			"float offsetV = cos( lavaTime * 11.0 ) * 0.002;",
			"vec2 uvOffsetA = vec2( offsetU, offsetV );",
			"vec2 uvOffsetB = vec2( -offsetU, offsetV );",
			"vec2 lookup;",
			

			// grass
			
			"gl_FragColor = vec4( vColor, 1.0 ) * texture2D(faceMap, vUV);",
			"lookup = texture2D(lavaNoiseMap, vTrailUV * vec2(65.0)).rg;",
			"f = texture2D(trailMap, vTrailUV + vec2(0.01) * lookup).r;",
//			"mixValue = f + max(1.0 - length(vec2(0.030) * vec2(vPos.xy - lavaHeadPosition.xz) + lookup * vec2(0.4)), 0.0);",
//			"if(mixValue > 0.5)",
			"if( f > 0.5)",
			"{",
				"mixValue = abs((texture2D(lavaNoiseMap, vTrailUV.yx * vec2(40.0, -40.0)).r - 0.5));",
				"mixValue = max(max(1.0 - mixValue * 32.0, 0.0) * (lookup.r - 0.5) * 8.0, 0.0);",
				"gl_FragColor = vec4(mixValue) * texture2D( lavaMap, vTrailUV * vec2(200.0) - vec2( lavaTime * 2.5)) * texture2D(lavaNoiseMap, vTrailUV * vec2(10.0) - vec2( lavaTime * 2.5)).rrrr * vec4(2.0);",
			"}",

			"gl_FragColor = gl_FragColor * vLightWeighting;",
			"gl_FragColor.a = 1.0;",

		"}"

	].join("\n")
			
}

