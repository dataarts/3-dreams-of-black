var CityWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.0004705882352941177 );
	this.scene.fog.color.setHSV( 0, 0, 0.6411764705882353 );

	// Lights

	var ambientLight = new THREE.AmbientLight( 0xffffff );
	//ambientLight.color.setHSV( 0, 0, 0.16470588235294117 );
	ambientLight.color.setHSV( 0, 0, 0.36470588235294117 );
	this.scene.addLight( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -0.6,  2.1,  -0.6 );
	directionalLight.color.setHSV( 0.5411764705882353, 0.12352941176470589, 0.7294117647058823 );
	this.scene.addLight( directionalLight );

	/*gui.add( directionalLight.position, 'x', -10, 20 ).name( 'x' );
	gui.add( directionalLight.position, 'y', -10, 20 ).name( 'y' );
	gui.add( directionalLight.position, 'z', -10, 20 ).name( 'z' );
	*/

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	// Parts
	if (!shared.debug) {
	//loader.load( { model: "files/models/city/City_P1.js", callback: partLoaded } );
	loader.load( { model: "files/models/city/City_P2.js", callback: partLoaded } );
	//loader.load( { model: "files/models/city/City_P3.js", callback: partLoaded } );
	}

	function partLoaded ( geometry ) {

		// setup base material

		var shader = Shaders[ 'soup' ];
		var uniforms = shader.uniforms;

		uniforms[ 'grassImage' ].texture = THREE.ImageUtils.loadTexture( "files/textures/Texture_Grass3.jpg" );
		uniforms[ 'grassImage' ].texture.wrapS = THREE.RepeatWrapping;
		uniforms[ 'grassImage' ].texture.wrapT = THREE.RepeatWrapping;

		uniforms[ 'surfaceImage' ].texture = THREE.ImageUtils.loadTexture( "files/textures/Texture_Pavement3.jpg" );
		uniforms[ 'surfaceImage' ].texture.wrapS = THREE.RepeatWrapping;
		uniforms[ 'surfaceImage' ].texture.wrapT = THREE.RepeatWrapping;

		var baseMaterialParams = {

			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		};
		var baseMaterial = new THREE.MeshShaderMaterial( baseMaterialParams );
		renderer.initMaterial( baseMaterial, that.scene.lights, that.scene.fog );

		// copy materials to all geo chunks and add AO-texture

		var materials = [];

		for( var i = 0; i < geometry.materials.length; i++ ) {

			materials[ i ] = new THREE.MeshShaderMaterial( baseMaterialParams );

			materials[ i ].program = baseMaterial.program;
			materials[ i ].uniforms = THREE.UniformsUtils.clone( uniforms );

			materials[ i ].uniforms[ 'targetStart'  ].value   = shared.targetStart;
			materials[ i ].uniforms[ 'targetEnd'    ].value   = shared.targetEnd;
			materials[ i ].uniforms[ 'map'          ].texture = geometry.materials[ i ][ 0 ].map;  
			materials[ i ].uniforms[ 'grassImage'   ].texture = uniforms[ 'grassImage'   ].texture;
			materials[ i ].uniforms[ 'surfaceImage' ].texture = uniforms[ 'surfaceImage' ].texture;

			materials[ i ].fog = true;
			materials[ i ].lights = true;

			geometry.materials[ i ][ 0 ] = materials[ i ];

		}

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );

		preInitModel( geometry, shared.renderer, that.scene, mesh );

	} 


	// Shadow

	loader.load( { model: 'files/models/city/City_Shadow.js', callback: function( geometry ) {

		var shadowMesh = new THREE.Mesh( geometry );

		if (shared.debug) {
			shadowMesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:0xCCCCCC } ) );
			shadowMesh.scale.x = shadowMesh.scale.y = shadowMesh.scale.z = 0.1;
			that.scene.addObject( shadowMesh );
		}

		var shadow = new THREE.ShadowVolume( shadowMesh );
		shadow.scale.x = shadow.scale.y = shadow.scale.z = 0.1;
		
		that.scene.addObject( shadow, true );

		preInitModel( geometry, shared.renderer, that.scene, shadowMesh );

	} } );


	var Shaders = {
		
		/////////// WORLD SHADER ////////////////
		
		'soup' : {

			uniforms: {

				"grassImage": { type: "t", value: 0, texture: null },
				"surfaceImage": { type: "t", value: 1, texture: null },
				"map": { type: "t", value:2, texture:null },

				"targetStart": { type: "v3", value: new THREE.Vector3() },
				"targetEnd": { type: "v3", value: new THREE.Vector3() },
				
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
				"varying vec3 vNormal;",
				"varying vec2 vUv;",
				"varying vec3 vLightWeighting;",


				"void main() {",

					"vec3 transformedNormal = normalize( normalMatrix * normal );",
					"vNormal = transformedNormal * transformedNormal;",
					
					"vUv = uv;",

					"vLightWeighting = ambientLightColor;",

					"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
					"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
					"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",

					"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D grassImage;",
				"uniform sampler2D surfaceImage;",
				"uniform sampler2D map;",
				"uniform vec3 targetStart;",
				"uniform vec3 targetEnd;",

				"uniform vec3 fogColor;",
				"uniform float fogDensity;",

				"varying vec3 vWorldPosition;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",
				"varying vec3 vLightWeighting;",

				"void main() {",

					"float distance;",
					"vec3 normal;",
					"vec4 surface;",
					"vec4 grass;",

					"vec3 worldPosition = vWorldPosition * 0.0145;",

					"vec3 pointStart = vWorldPosition - targetStart;",
					"vec3 endStart = targetEnd - targetStart;",
					"float endStartLength2 = pow( length( endStart ), 2.0 );",
					"float pointOnLine = clamp( dot( endStart, pointStart ) / endStartLength2, 0.0, 1.0 );",

					"distance  = 1.0 - length( vWorldPosition - ( targetStart + pointOnLine * ( targetEnd - targetStart ))) * 0.0080;",
					"distance += texture2D( grassImage, worldPosition.xz ).g - 0.5;",
					
					"surface = texture2D( surfaceImage, worldPosition.yz ) * vNormal.x + ",
							  "texture2D( surfaceImage, worldPosition.xz ) * vNormal.y + ",
							  "texture2D( surfaceImage, worldPosition.xy ) * vNormal.z;",

					"if( distance >= 0.0 ) {",

						"grass = texture2D( grassImage, worldPosition.yz ) * vNormal.x + ",
								"texture2D( grassImage, worldPosition.xz ) * vNormal.y + ",
								"texture2D( grassImage, worldPosition.xy ) * vNormal.z;",

						"surface = mix( surface, grass, smoothstep( 0.0, 0.9, distance ));",

					"}",

					"float depth = gl_FragCoord.z / gl_FragCoord.w;",
					"const float LOG2 = 1.442695;",
					
					"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
					"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

					"gl_FragColor = surface * texture2D( map, vUv );",
					"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
					"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",
				"}"

			].join("\n")

		}
	}
}
