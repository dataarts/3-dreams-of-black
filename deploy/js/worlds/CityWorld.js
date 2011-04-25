var CityWorld = function ( shared ) {

	var that = this;

	var ENABLE_LENSFLARES = true;

	this.scene = new THREE.Scene();
	this.scene.collisions = new THREE.CollisionSystem();
	
	// Portal

	var portal = new THREE.Vector3( 1094.090, -99.358, 246.713  );	

	// Fog

	this.scene.fog = new THREE.FogExp2( 0x535758, 0.000047 );
	
	// Lights

	var ambientLight = new THREE.AmbientLight( 0xffffff );
	this.scene.addLight( ambientLight );

	var directionalLight1 = new THREE.DirectionalLight( 0xffffff );
	directionalLight1.castShadow = false;
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff );
	directionalLight2.castShadow = false;
	this.scene.addLight( directionalLight2 );

	// Set up settings
   
   	//var settings = { "fogDensity": 0.00005, "fogColor": {  "h": 0,  "s": 0.3235294117647059,  "v": 0.34705882352941175 }, "ambientLight": {  "h": 0.4647058823529412,  "s": 0.49411764705882355,  "v": 0 }, "directionalLight1": {  "h": 0.5647058823529412,  "s": 0.32941176470588235,  "v": 0.5411764705882353,  "x": 0.7648718326037581,  "y": -0.5885011172553458,  "z": 0.2619876231400604,  "phi": 0.7757647058823531,  "theta": -0.7388235294117651 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.18235294117647058,  "x": -0.4535568600884794,  "y": 0.8775825618903728,  "z": -0.1553545034191468,  "phi": -1.9948235294117649,  "theta": 0.4063529411764706 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.2411764705882353,  "sIntensity": 0,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 23.558823529411764, "flarey": 358, "flyCamera": {  "position": {   "x": 240.7055633435974,   "y": 725.5500557827488,   "z": -13226.735514435717  },  "target": {   "x": 188.88986375390533,   "y": 744.8835980526541,   "z": -13310.050263546114  } }, "sceneScale": 1};
	//var settings = { "fogDensity": 0.00005, "fogColor": {  "h": 0.6,  "s": 0.3235294117647059,  "v": 0.34705882352941175 }, "ambientLight": {  "h": 0,  "s": 0,  "v": 0.09411764705882353 }, "directionalLight1": {  "h": 0.5588235294117647,  "s": 0.17647058823529413,  "v": 0.3941176470588235,  "x": 0.7078535314198388,  "y": 0.12972382335149782,  "z": -0.6943450926675673,  "phi": 1.4407058823529408,  "theta": -0.7757647058823531 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.40588235294117647,  "x": -0.7501274841811427,  "y": -0.630824564234077,  "z": 0.19841654828908922,  "phi": -2.2534117647058824,  "theta": -0.25858823529411756 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.3176470588235294,  "sIntensity": 0.05,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 18.52941176470588, "flarey": 355.7647058823529, "flyCamera": {  "position": {   "x": -5.8280070122002305,   "y": 495.9422341803853,   "z": -7391.557312943377  },  "target": {   "x": -2.8500586327436173,   "y": 494.8123320660599,   "z": -7491.506575795393  } }, "sceneScale": 1};
	var settings = { "fogDensity": 0.0000264, "fogColor": {  "h": 0,  "s": 0.3235,  "v": 0.347 }, "ambientLight": {  "h": 0.465,  "s": 0.494,  "v": 0 }, "directionalLight1": {  "h": 0.565,  "s": 0.329,  "v": 0.541,  "x": 0.5176767580772196,  "y": 0.7138857482214859,  "z": -0.4715696264952919,  "phi": 0.7757647058823531,  "theta": -0.7388235294117651 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.18235294117647058,  "x": -0.8372195027957865,  "y": -0.4114343306911316,  "z": -0.3602572631705248,  "phi": -1.9948235294117649,  "theta": 0.4063529411764706 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.2411764705882353,  "sIntensity": 0,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 18.52941176470588, "flarey": 358, "flyCamera": {  "position": {   "x": 16.574202591686277,   "y": 462.26953453589,   "z": -10184.707948888321  },  "target": {   "x": 13.49395371115724,   "y": 486.5924391778843,   "z": -10281.655916255411  } }, "sceneScale": 1};
	
	this.scene.fog.color.setHSV( settings.fogColor.h,  settings.fogColor.s, settings.fogColor.v );
	this.scene.fog.density = settings.fogDensity;

	ambientLight.color.setHSV( settings.ambientLight.h, settings.ambientLight.s, settings.ambientLight.v );
	directionalLight1.color.setHSV( settings.directionalLight1.h, settings.directionalLight1.s, settings.directionalLight1.v );
	directionalLight2.color.setHSV( settings.directionalLight2.h, settings.directionalLight2.s, settings.directionalLight2.v );

	directionalLight1.position.set( settings.directionalLight1.x, settings.directionalLight1.y, settings.directionalLight1.z );
	directionalLight2.position.set( settings.directionalLight2.x, settings.directionalLight2.y, settings.directionalLight2.z );
	
	// Lens flares

	if ( ENABLE_LENSFLARES ) {

		this.lensFlare = null;
		this.lensFlareRotate = null;

		var flaresPosition = new THREE.Vector3( 0, 0, -5000 );
		var sx = 20, sy = 358;
		initLensFlares( that, flaresPosition, sx, sy );		

	}

	// Scene

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function sceneLoaded( result ) {

		var i, l, scene = result.scene;

		hideColliders( scene );
		makeSceneStatic( scene );		

		scene.scale.set( 0.1, 0.1, 0.1 );
		scene.updateMatrix();
		that.scene.addChild( scene );
		
		if ( scene.collisions ) {
		
			that.scene.collisions.merge( scene.collisions );
			
		}
		
		TriggerUtils.setupCityTriggers( result );
	
	};


	if ( !shared.debug ) {

		loader.load( "files/models/city/City.js", sceneLoaded );

	}
	
	this.update = function ( delta, camera, portalsActive ) {
		
		var position = camera.matrixWorld.getPosition();
		
		TriggerUtils.effectors[ 0 ] = -camera.matrixWorld.getColumnZ().multiplyScalar( 100 ).x;
		TriggerUtils.effectors[ 1 ] = position.y;
		TriggerUtils.effectors[ 2 ] = position.z - 100;
		
		TriggerUtils.update();
		
		if ( portalsActive ) {
			
			var currentPosition = camera.matrixWorld.getPosition();
			
			var d = portal.distanceTo( currentPosition );
			
			if ( d < 100 ) {
				
				shared.signals.startexploration.dispatch( "dunes" );

			}
			
		}
		
	};

/*	function partLoaded ( geometry ) {

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
	}*/
};
