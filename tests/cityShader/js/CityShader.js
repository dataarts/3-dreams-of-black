/**
 * @author Mikael Emtinger
 */
ROME = {};

ROME.CityShaderUtils = ( function() {
	
	var that = {};
	
	that.soupHead = new THREE.Vector3( 0, 0, -2000 );
	that.soupTail = new THREE.Vector3( 0, 0, -1000 );
	
	
	//--- set materials ---
	
	that.setMaterials = function ( meshes, scene ) {
		
		// setup texture wrap modes
		
		ROME.CityShader.textures.grass.wrapS = THREE.RepeatWrapping
		ROME.CityShader.textures.grass.wrapT = THREE.RepeatWrapping
		ROME.CityShader.textures.surface.wrapS = THREE.RepeatWrapping;
		ROME.CityShader.textures.surface.wrapT = THREE.RepeatWrapping;


		// create second uv
		
		var m, ml, mesh;
		var v, vl, vertex, vertices;
		var f, fl, face, faces;
		var g, gl, geometry, geometryMaterials, material;
		var surfaceUv, scale;
		var vecAB = new THREE.Vector3();
		var vecAC = new THREE.Vector3();


		// setup materials to all geo chunks and add AO-texture

		for( m = 0, ml = meshes.length; m < ml; m++ ) {
		
			mesh = meshes[ m ];
			
			if( mesh instanceof THREE.Mesh ) {
				
				mesh.materials = [ new THREE.MeshFaceMaterial() ];
				geometryMaterials = mesh.geometry.materials;
				
				for( g = 0, gl = geometryMaterials.length; g < gl; g++ ) {
					
					if( !( geometryMaterials[ g ][ 0 ] instanceof THREE.MeshShaderMaterial )) {
						
						// create material
						
						material = new THREE.MeshShaderMaterial( {
							
							uniforms: ROME.CityShader.uniforms(),
							attributes: ROME.CityShader.attributes(),
							vertexShader: ROME.CityShader.vertexShader,
							fragmentShader: ROME.CityShader.fragmentShader
							
						});


						// setup attributes

						faces = mesh.geometry.faces;
						vertices = mesh.geometry.vertices;
						surfaceUv = material.attributes.surfaceUv.value;
						
						for( f = 0, fl = faces.length; f < fl; f++ ) {
							
							face = faces[ f ];
							vecAB.sub( vertices[ face.a ].position, vertices[ face.b ].position );
							vecAC.sub( vertices[ face.a ].position, vertices[ face.c ].position );
							
							scale = 0.001 * Math.max( vecAB.length(), vecAC.length());
							
							surfaceUv.push( new THREE.Vector2( -0.5 * scale, -0.5 * scale ));
							surfaceUv.push( new THREE.Vector2(  0.5 * scale, -0.5 * scale ));
							surfaceUv.push( new THREE.Vector2(  0.5 * scale,  0.5 * scale ));
							
							if( face.d ) {
								
								surfaceUv.push( new THREE.Vector2( -0.5 * scale, 0.5 * scale ));
								
							}
							
						}	


						// setup uniforms
						
						material.uniforms.targetStart.value = that.soupHead;
						material.uniforms.targetEnd.value = that.soupTail;
						material.uniforms.grassMap.texture = ROME.CityShader.textures.grass;
						material.uniforms.surfaceMap.texture = ROME.CityShader.textures.surface;
						material.fog = true;
						material.lights = true;
		
						if( geometryMaterials[ g ][ 0 ].map ) {
							
							material.uniforms.useAO.value = 1;
							material.uniforms.map.texture = geometryMaterials[ g ][ 0 ].map;
							
						} else {
							
							material.uniforms.useAO.value = 0;
							
						}
						
						geometryMaterials[ g ][ 0 ] = material;
						
					}
					
				}
				
			}
			
		}
		
	}
	
	return that;
	
}());


///// SHADER /////

ROME.CityShader = {

	textures: {
		
		grass: THREE.ImageUtils.loadTexture( "assets/Texture_Grass.jpg" ),
		surface: THREE.ImageUtils.loadTexture( "assets/Texture_Surface.jpg" )
		
	},
	
	attributes: function() { return {
		
		"surfaceUv": { type: "v2", boundTo: "faceVertices", value: [] }
		
	}},
	
	uniforms: function() { return {

		"grassMap": { type: "t", value: 0, texture: undefined },		// textures set by code
		"surfaceMap": { type: "t", value: 1, texture: undefined },
		"map": { type: "t", value: 2, texture: undefined },
		"useAO": { type: "i", value: 0 },

		"targetStart": { type: "v3", value: undefined },	// values set by code
		"targetEnd": { type: "v3", value: undefined },
		
		"fogColor": { type: "c", value: new THREE.Color() },
		"fogDensity": { type: "f", value: 0 },

		"enableLighting" : { type: "i", value: 1 },
		"ambientLightColor" : { type: "fv", value: [] },
		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },
		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] }

	}},

	vertexShader: [

		"uniform vec3 	ambientLightColor;",
		"uniform vec3 	directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3 	directionalLightDirection[ MAX_DIR_LIGHTS ];",

		"uniform vec3 	targetStart;",
		"uniform vec3 	targetEnd;",
		
		"attribute vec2 surfaceUv;",
		
		"varying vec3 	vWorldPosition;",
		"varying vec3 	vNormal;",
		"varying vec2 	vUv;",
		"varying vec2   vSurfaceUv;",
		"varying vec3 	vLightWeighting;",
		"varying float 	vGrassMixValue;",

		"void main() {",

			"vec3 transformedNormal = normalize( normalMatrix * normal );",
			"vNormal = transformedNormal * transformedNormal;",


			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",

			"vec3 pointStart = vWorldPosition - targetStart;",
			"vec3 endStart = targetEnd - targetStart;",
			"float endStartLength2 = pow( length( endStart ), 2.0 );",
			"float pointOnLine = clamp( dot( endStart, pointStart ) / endStartLength2, 0.0, 1.0 );",

			"vGrassMixValue = 1.0 - length( vWorldPosition - ( targetStart + pointOnLine * ( targetEnd - targetStart ))) * 0.0075;",

			"vWorldPosition *= 0.005;",

			
			"vUv = uv;",
			"vSurfaceUv = surfaceUv;",


			"vLightWeighting = ambientLightColor;",
			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D 	grassMap;",
		"uniform sampler2D 	surfaceMap;",
		"uniform sampler2D 	map;",
		"uniform int 		useAO;",

		"uniform vec3 	fogColor;",
		"uniform float 	fogDensity;",

		"varying vec3 	vWorldPosition;",
		"varying vec3 	vNormal;",
		"varying vec2 	vUv;",
		"varying vec2   vSurfaceUv;",
		"varying vec3 	vLightWeighting;",
		"varying float 	vGrassMixValue;",

		"void main() {",

			"vec3 normal;",
			"vec4 surface;",
			"vec4 grass;",

			"surface  = useAO == 1 ? texture2D( map, vUv ) : vec4( 1.0, 1.0, 1.0, 1.0 );",
			"surface += texture2D( surfaceMap, vSurfaceUv ) - vec4( 0.5, 0.5, 0.5, 0.0 );",

			"float grassMixValue = smoothstep( 0.0, 0.2, vGrassMixValue );",

			"if( grassMixValue >= 0.0 ) {",

				"grass = texture2D( grassMap, vWorldPosition.yz ) * vNormal.x + ",
				        "texture2D( grassMap, vWorldPosition.xz ) * vNormal.y + ",
				        "texture2D( grassMap, vWorldPosition.xy ) * vNormal.z;",

				"surface = mix( surface, grass, grassMixValue );",

			"}",


			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"const float LOG2 = 1.442695;",
			
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

			"gl_FragColor = surface;",
			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

		"}"

	].join("\n")

};
