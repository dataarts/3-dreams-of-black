var CityWorld = function ( shared ) {

	var that = this;
	var cityMaterials = [];
	var cityMaterialGrassStart = new THREE.Vector3();
	var cityMaterialGrassEnd = new THREE.Vector3();

	var ENABLE_LENSFLARES = true;

	this.scene = new THREE.Scene();
	this.scene.collisions = new THREE.CollisionSystem();
	
	// Portal

	var portal = new THREE.Vector3( 1094.090, -99.358, 246.713  );	

	// Fog

	this.scene.fog = new THREE.FogExp2( 0x535758, 0.000047 );
	
	// Lights

	this.ambientLight = new THREE.AmbientLight( 0xffffff );
	this.scene.addLight( this.ambientLight );

	var directionalLight1 = new THREE.DirectionalLight( 0xffffff );
	directionalLight1.castShadow = false;
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff );
	directionalLight2.castShadow = false;
	this.scene.addLight( directionalLight2 );

	// Set up settings
   
   	//var settings = { "fogDensity": 0.00005, "fogColor": {  "h": 0,  "s": 0.3235294117647059,  "v": 0.34705882352941175 }, "ambientLight": {  "h": 0.4647058823529412,  "s": 0.49411764705882355,  "v": 0 }, "directionalLight1": {  "h": 0.5647058823529412,  "s": 0.32941176470588235,  "v": 0.5411764705882353,  "x": 0.7648718326037581,  "y": -0.5885011172553458,  "z": 0.2619876231400604,  "phi": 0.7757647058823531,  "theta": -0.7388235294117651 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.18235294117647058,  "x": -0.4535568600884794,  "y": 0.8775825618903728,  "z": -0.1553545034191468,  "phi": -1.9948235294117649,  "theta": 0.4063529411764706 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.2411764705882353,  "sIntensity": 0,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 23.558823529411764, "flarey": 358, "flyCamera": {  "position": {   "x": 240.7055633435974,   "y": 725.5500557827488,   "z": -13226.735514435717  },  "target": {   "x": 188.88986375390533,   "y": 744.8835980526541,   "z": -13310.050263546114  } }, "sceneScale": 1};
	//var settings = { "fogDensity": 0.00005, "fogColor": {  "h": 0.6,  "s": 0.3235294117647059,  "v": 0.34705882352941175 }, "ambientLight": {  "h": 0,  "s": 0,  "v": 0.09411764705882353 }, "directionalLight1": {  "h": 0.5588235294117647,  "s": 0.17647058823529413,  "v": 0.3941176470588235,  "x": 0.7078535314198388,  "y": 0.12972382335149782,  "z": -0.6943450926675673,  "phi": 1.4407058823529408,  "theta": -0.7757647058823531 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.40588235294117647,  "x": -0.7501274841811427,  "y": -0.630824564234077,  "z": 0.19841654828908922,  "phi": -2.2534117647058824,  "theta": -0.25858823529411756 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.3176470588235294,  "sIntensity": 0.05,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 18.52941176470588, "flarey": 355.7647058823529, "flyCamera": {  "position": {   "x": -5.8280070122002305,   "y": 495.9422341803853,   "z": -7391.557312943377  },  "target": {   "x": -2.8500586327436173,   "y": 494.8123320660599,   "z": -7491.506575795393  } }, "sceneScale": 1};
	//var settings = { "fogDensity": 0.0000264, "fogColor": {  "h": 0,  "s": 0.3235,  "v": 0.347 }, "ambientLight": {  "h": 0.465,  "s": 0.494,  "v": 0 }, "directionalLight1": {  "h": 0.565,  "s": 0.329,  "v": 0.541,  "x": 0.5176767580772196,  "y": 0.7138857482214859,  "z": -0.4715696264952919,  "phi": 0.7757647058823531,  "theta": -0.7388235294117651 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.18235294117647058,  "x": -0.8372195027957865,  "y": -0.4114343306911316,  "z": -0.3602572631705248,  "phi": -1.9948235294117649,  "theta": 0.4063529411764706 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.2411764705882353,  "sIntensity": 0,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 18.52941176470588, "flarey": 358, "flyCamera": {  "position": {   "x": 16.574202591686277,   "y": 462.26953453589,   "z": -10184.707948888321  },  "target": {   "x": 13.49395371115724,   "y": 486.5924391778843,   "z": -10281.655916255411  } }, "sceneScale": 1};
	var settings = { "fogDensity": 0.0000264, "fogColor": {  "h": 0,  "s": 0.3235,  "v": 0.347 }, "ambientLight": {  "h": 0.465,  "s": 0.494,  "v": 0 }, "directionalLight1": {  "h": 0.565,  "s": 0.329,  "v": 0.841,  "x": 0.5176767580772196,  "y": 0.7138857482214859,  "z": -0.4715696264952919,  "phi": 0.7757647058823531,  "theta": -0.7388235294117651 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.18235294117647058,  "x": -0.8372195027957865,  "y": -0.4114343306911316,  "z": -0.3602572631705248,  "phi": -1.9948235294117649,  "theta": 0.4063529411764706 }, "effectEnabled": true, "effectType": "noise", "postprocessingNoise": {  "nIntensity": 0.2411764705882353,  "sIntensity": 0,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 18.52941176470588, "flarey": 358, "flyCamera": {  "position": {   "x": 16.574202591686277,   "y": 462.26953453589,   "z": -10184.707948888321  },  "target": {   "x": 13.49395371115724,   "y": 486.5924391778843,   "z": -10281.655916255411  } }, "sceneScale": 1};
	
	this.scene.fog.color.setHSV( settings.fogColor.h,  settings.fogColor.s, settings.fogColor.v );
	this.scene.fog.density = settings.fogDensity;

	//this.ambientLight.color.setHSV( settings.ambientLight.h, settings.ambientLight.s, settings.ambientLight.v );
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
		
		
		// setup custom material
		
		var baseMaterialParams = {

			uniforms: CityShader.uniforms,
			vertexShader: CityShader.vertexShader,
			fragmentShader: CityShader.fragmentShader,
			
			shading: THREE.FlatShading,
			lights: true,
			fog: true,
			vertexColors: 2,

		};

		CityShader.uniforms[ 'grassImage' ].texture.wrapS = THREE.RepeatWrapping;
		CityShader.uniforms[ 'grassImage' ].texture.wrapT = THREE.RepeatWrapping;
		CityShader.uniforms[ 'surfaceImage' ].texture.wrapS = THREE.RepeatWrapping;
		CityShader.uniforms[ 'surfaceImage' ].texture.wrapT = THREE.RepeatWrapping;

		var baseMaterial = new THREE.MeshShaderMaterial( baseMaterialParams );
		renderer.initMaterial( baseMaterial, that.scene.lights, that.scene.fog );


		// copy materials to all geo chunks and add AO-texture

		for( var name in result.objects ) {

			var obj = result.objects[ name ];

			if( obj.geometry && obj.geometry.morphTargets.length === 0 ) {
				
				var geometry = obj.geometry;
				
				for( var i = 0; i < geometry.materials.length; i++ ) {
					
					var mat = new THREE.MeshShaderMaterial( baseMaterialParams );
					
					mat.program = baseMaterial.program;
					mat.uniforms = THREE.UniformsUtils.clone( CityShader.uniforms );
					
					mat.uniforms[ 'targetStart'  ].value   = cityMaterialGrassStart;
					mat.uniforms[ 'targetEnd'    ].value   = cityMaterialGrassEnd;
					mat.uniforms[ 'grassImage'   ].texture = CityShader.uniforms[ 'grassImage'   ].texture;
					mat.uniforms[ 'surfaceImage' ].texture = CityShader.uniforms[ 'surfaceImage' ].texture;
					mat.uniforms.colorA.value = CityShader.colors.colorA;
					mat.uniforms.colorB.value = CityShader.colors.colorB;
					mat.uniforms.colorC.value = CityShader.colors.colorC;
		
					//geometry.materials[ i ][ 0 ] = cityMaterials[ i ];
					
					obj.materials[ 0 ] = mat;
					cityMaterials.push( mat );
				}
				
			}
			
		}		
	
	};


	if ( !shared.debug ) {

		loader.load( "files/models/city/City.js", sceneLoaded );

	}
	
	var time = 0;
	var last_time = 0;

	this.update = function ( delta, camera, portalsActive ) {
		
		var position = camera.matrixWorld.getPosition();
		
		cityMaterialGrassEnd.copy( cityMaterialGrassStart );

		cityMaterialGrassStart.x = TriggerUtils.effectors[ 0 ] = Math.sin( position.z / 500 ) * 200;
		cityMaterialGrassStart.y = TriggerUtils.effectors[ 1 ] = position.y;
		cityMaterialGrassStart.z = TriggerUtils.effectors[ 2 ] = position.z - 300;

		cityMaterialGrassEnd.subSelf( cityMaterialGrassStart );
		cityMaterialGrassEnd.multiplyScalar( 200 );
		cityMaterialGrassEnd.addSelf( cityMaterialGrassStart );
		
		
		TriggerUtils.update();
		
		
		time += (new Date().getTime() - last_time) / 50000.0;
		last_time = new Date().getTime();
		if(time > 1.0)
			time = 0.0;

		for( var i = 0; i < cityMaterials.length; i++ )
			cityMaterials[ i ].uniforms[ 'time'  ].value = time;				

		
		
		if ( portalsActive ) {
			
			var currentPosition = camera.matrixWorld.getPosition();
			
			var d = portal.distanceTo( currentPosition );
			
			if ( d < 100 ) {
				
				shared.signals.startexploration.dispatch( "dunes" );

			}
			
		}
		
	};

};



var CityShader = {

	colors:{
	
		colorA: new THREE.Vector3( 1, 1, 1 ),
		colorB: new THREE.Vector3( 1, 1, 1 ),
		colorC: new THREE.Vector3( 1, 1, 1 )
			

	},
	
	uniforms: {

		"grassImage": { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Grass.jpg' ) },
		"surfaceImage": { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( 'files/textures/CityShader_Clouds.jpg' ) },
		"map": { type: "t", value:2, texture:null },
		"map2": { type: "t", value:3, texture:null },
		"map3": { type: "t", value:4, texture:null },

		"time": { type: "f", value:0.0},

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
		"pointLightDistance" : { type: "fv1", value: [] },

		"colorA": { type: "v3", value: new THREE.Vector3() },
		"colorB": { type: "v3", value: new THREE.Vector3() },
		"colorC": { type: "v3", value: new THREE.Vector3() }
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


		"void main() {",			
			"vec3 transformedNormal = normalize( normalMatrix * normal );",
			"vNormalsquare = transformedNormal * transformedNormal;",
			"vNormal = transformedNormal;",
			
			"vColor = color;",

			"vLightWeighting = ambientLightColor;",

/*			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ 0 ] * directionalLightWeighting;",
			"vLightWeighting = vLightWeighting * vec3(0.5, 0.55, 0.45) + vec3(0.5, 0.45, 0.55);",
*/
			"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
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

		"uniform vec3 fogColor;",
		"uniform float fogDensity;",

		"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		"varying vec3 vNormal;",
		"varying vec3 vNormalsquare;",
		"varying vec3 vLightWeighting;",
		"uniform vec3 colorA;",
		"uniform vec3 colorB;",
		"uniform vec3 colorC;",


		"void main() {",

			"float distance;",
			"vec3 normal;",
			"vec4 surface;",
			"vec4 grass;",
			"float fog_density = 0.0001;",

			"vec3 worldPosition = vWorldPosition * 0.0005;",

			"vec3 pointStart = vWorldPosition - targetStart;",
			"vec3 endStart = targetEnd - targetStart;",
			"float endStartLength2 = dot(endStart, endStart);",
			"float pointOnLine = clamp( dot( endStart, pointStart ) / endStartLength2, 0.0, 1.0 );",
			"distance = length( vWorldPosition - ( targetStart + pointOnLine * ( targetEnd - targetStart ))) * -0.01;",
			
			"grass = texture2D( grassImage, worldPosition.yz * vec2(10.0)) * vNormalsquare.xxxx + ",
			        "texture2D( grassImage, worldPosition.xz * vec2(10.0)) * vNormalsquare.yyyy + ",
			        "texture2D( grassImage, worldPosition.xy * vec2(10.0)) * vNormalsquare.zzzz;",
			"distance += (0.5 + grass.g) * texture2D(surfaceImage, worldPosition.zx * vec2(3.0)).g;",
			//"distance += grass.g;",
			"surface = vec4(vec3(0.15, 0.18, 0.2)/*colorA*/ * vec3(2.0), 1.0);",

			"if(distance > 0.0)",
				"surface = grass;",
				//"surface = mix( surface, grass, smoothstep( 0.0, 0.1, distance ));",

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"depth *= 0.0001;",

			"gl_FragColor = surface * vec4( vColor, 1.0 ) * vec4(2.0);",
			"gl_FragColor = mix(gl_FragColor * texture2D(surfaceImage, worldPosition.zx * vec2(0.4) + vec2(time)), gl_FragColor, vec4(colorC.rgb, 0.1));",
			"gl_FragColor = mix(vec4(gl_FragColor.rgb, 1.0), vec4(/*colorB*/0.64, 0.88, 1, 1.0), vec4(depth));",	


			//"gl_FragColor = vec4(distance, distance, distance, 1.0);",
			//"gl_FragColor *= vec4( 0.0, 1.0, 0.0, 1.0 );",

			/*time laps only*/
			//"gl_FragColor = texture2D(surfaceImage, worldPosition.zx * vec2(0.4) + vec2(time));",

			/*grass only*/
			//"gl_FragColor = grass;",

			/*grass only*/
			//"gl_FragColor = texture2D( grassImage, worldPosition.zx * vec2(10.0));",
			//"gl_FragColor = vec4(vNormalsquare.yyy, 1.0);", 
		"}"

	].join("\n")

};