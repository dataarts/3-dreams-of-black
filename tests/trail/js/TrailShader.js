
ROME = {};

ROME.TrailShaderUtils = ( function() {
	
	var that = {};
	var trailTexture;
	var markTexture;
	var GL;
	var renderer;
	
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
		var maxX = -9999999, maxZ = -9999999, minX = 9999999, minZ = 9999999;
		var width, depth;
		
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

	that.updateTrail = function( u, v ) {
		
		ROME.TrailShader.uniforms.lavaTime.value += 0.01;
		
		GL.bindTexture( GL.TEXTURE_2D, trailTexture );
		GL.texSubImage2D( GL.TEXTURE_2D, 0, u * trailTextureSize, v * trailTextureSize, GL.RGB, GL.UNSIGNED_BYTE, markTexture.image );
		
	}

	return that;	
	
} ());


ROME.TrailShader = {
	
	textures: {
		
		trailMap: undefined,		// set by code
		faceMap: THREE.ImageUtils.loadTexture( "assets/PaintDubs.jpg" ),
		lavaMap: THREE.ImageUtils.loadTexture( "assets/lava.jpg" ),
		lavaNoiseMap: THREE.ImageUtils.loadTexture( "assets/lavaNoise.png" )
		
	},
	
	uniforms: {

		"trailMap": 				 	{ type: "t", value: 0, texture: undefined },
		"faceMap": 					 	{ type: "t", value: 1, texture: undefined },
		"lavaMap": 					 	{ type: "t", value: 2, texture: undefined },
		"lavaNoiseMap": 			 	{ type: "t", value: 3, texture: undefined },

		"lavaTime": 					{ type: "f", value: 0 },
		"lavaUvScale": 					{ type: "v2", value: new THREE.Vector2( 5.0, 5.0 ) },

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

		"uniform 	float	animalAInterpolation;",
		"uniform 	float	animalBInterpolation;",
		"uniform 	float	animalMorphValue;",

		"attribute	vec2	trailUV;",

		"varying 	vec2	vUV;",
		"varying 	vec2	vTrailUV;",
		"varying	vec3	vColor;",

		"void main() {",

			"vUV = uv;",
			"vTrailUV = trailUV;",
			"vColor = color;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
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
		"uniform 	vec3 		directionalLightColor[ 1 ];",

		"varying 	vec2		vUV;",
		"varying 	vec2		vTrailUV;",
		"varying	vec3		vColor;",

		"void main() {",

			// fog

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"const float LOG2 = 1.442695;",
			
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",


			// lava

			"vec4 lavaColor;",
			"float mixValue;",
			"mixValue  = texture2D( trailMap, vTrailUV + vec2(  0.002,  0.001 )).r;",
			"mixValue += texture2D( trailMap, vTrailUV + vec2( -0.001, -0.002 )).r;",
			"mixValue += texture2D( trailMap, vTrailUV + vec2( -0.002,  0.001 )).r;",
			"mixValue += texture2D( trailMap, vTrailUV + vec2(  0.001, -0.002 )).r;",
			"mixValue /= 4.0;",
			"mixValue *= mixValue;",
			
			"if( mixValue != 0.0 ) {",

				"vec2 noiseUV = vTrailUV * lavaUvScale;",
				"vec4 noise = texture2D( lavaNoiseMap, noiseUV );",
				
				"vec2 lavaUV = vec2( lavaTime ) * 0.05 + noiseUV * vec2( sin( noise.a ) * 0.1 + 0.8, cos( noise.a * 0.2 ) * 0.1 + 0.8 );",
	
				"vec4 color = texture2D( lavaMap, lavaUV );",

				"lavaColor = ( color * noise + color * color ) * mixValue;",
			"}",


			// grass
			
			"vec4 grassColor = vec4( vColor, 1.0 ) * texture2D( faceMap, vUV );",
			
			
			// add up
			
			"gl_FragColor = mix( grassColor, lavaColor, mixValue );",

//			"gl_FragColor = mix( vec4( vColor, 1.0 ), vec4( directionalLightColor[ 0 ], 1.0 ), texture2D( faceLight, vLightUV ).r ) * texture2D( contour, vContourUV );",
//			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n")
			
}

