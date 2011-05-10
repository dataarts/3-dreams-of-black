var PrairieWorld = function ( shared, camera, callbackSoup ) {

	var that = this;

	var ENABLE_LENSFLARES = true;

	this.scene = new THREE.Scene();
	this.scene.collisions = new THREE.CollisionSystem();

	// Portals

	this.portals = [];


	// Fog

	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0 );
	this.scene.fog.color.setHSV( 0.559, 0.741, 0.588 );

	// Lights

	this.ambient = new THREE.AmbientLight( 0x221100 );
	this.ambient.color.setHSV( 0.235,  0.341,  0.141 );
	this.scene.addLight( this.ambient );

	this.directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	this.directionalLight1.position.set( 0.196, 0.93, -0.3 );
	this.directionalLight1.color.setHSV( 0, 0, 0.876 );
	this.scene.addLight( this.directionalLight1 );

	this.directionalLight2 = new THREE.DirectionalLight( 0xffeedd );
	this.directionalLight2.position.set( 0.19,  -0.31,  -0.93 );
	this.directionalLight2.color.setHSV( 0.347,  0.51,  0.135 );
	this.scene.addLight( this.directionalLight2 );

	// Settings

	this.settings = { "fogDensity": 0.000020588, "fogColor": {  "h": 0.5235
		,  "s": 0.5,  "v": 1 }, "ambientLight": {  "h": 0.465,  "s": 0,  "v": 0 }, "directionalLight1": {  "h": 0.565,  "s": 0,  "v": 0.5058823529411764,  "x": 0.7648718326037581,  "y": -0.5885011172553458,  "z": 0.2619876231400604,  "phi": 0.6649411764705881,  "theta": 0.9235294117647057 }, "directionalLight2": {  "h": 0,  "s": 0,  "v": 0.4235294117647059,  "x": -0.4535568600884794,  "y": 0.8775825618903728,  "z": -0.1553545034191468,  "phi": -1.588470588235294,  "theta": 0.6279999999999997 }, "effectEnabled": true, "effectType": "bloom", "postprocessingNoise": {  "nIntensity": 1,  "sIntensity": 0.05,  "sCount": 4096 }, "postprocessingBloom": {  "opacity": 1 }, "flarex": 12.176470588235293, "flarey": 304.94117647058823, "flyCamera": {  "position": {   "x": 225.04246271915372,   "y": 2.9824761744404835,   "z": -95.92308075145283  },  "target": {   "x": 318.61355381056615,   "y": -32.161822413807094,   "z": -92.86870868788631  } }, "sceneScale": 1};	
	
	//this.scene.fog.color.setHSV( this.settings.fogColor.h, this.settings.fogColor.s, this.settings.fogColor.v );
	//this.scene.fog.density = this.settings.fogDensity;
	this.directionalLight1.color.setHSV( this.settings.directionalLight1.h, this.settings.directionalLight1.s, this.settings.directionalLight1.v );
	this.directionalLight2.color.setHSV( this.settings.directionalLight2.h, this.settings.directionalLight2.s, this.settings.directionalLight2.v );

	this.directionalLight1.position.set( this.settings.directionalLight1.x, this.settings.directionalLight1.y, this.settings.directionalLight1.z );
	this.directionalLight2.position.set( this.settings.directionalLight2.x, this.settings.directionalLight2.y, this.settings.directionalLight2.z );
	
	
	// Init shader
	
	ROME.TrailShader.init();
	
	
	// Lens flares

	if ( ENABLE_LENSFLARES ) {

		this.lensFlare = null;
		this.lensFlareRotate = null;

		var flaresPosition = new THREE.Vector3( 0, 0, -3000 );
		var sx = 14, sy = 311;
		initLensFlares( that, flaresPosition, sx, sy );		

	}

	// Trail

	var markTexture = THREE.ImageUtils.loadTexture( "/files/textures/trailMarkTexture.jpg" );

	// Scene

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function prairieLoaded( result ) {

		var i, l, object, scene = result.scene;

		hideColliders( scene );
		makeSceneStatic( scene );

		var groundMesh = result.objects[ "Ground" ];

		ROME.TrailShaderUtils.setMaterials( [ groundMesh ], 2500, markTexture, shared.renderer );

		TriggerUtils.setupPrairieTriggers( result );

		that.scene.addChild( scene );

		result.objects[ "Backdrop" ].materials[ 0 ].map.wrapS = THREE.RepeatWrapping;
		result.objects[ "Backdrop" ].materials[ 0 ].map.wrapT = THREE.RepeatWrapping;

		that.portals.push( { object: result.objects[ "Portal"     ], radius: 120, currentDistance: 9999999 } );
		that.portals.push( { object: result.objects[ "Portal.001" ], radius: 120, currentDistance: 9999999 } );

		that.portals[ 0 ].object.visible = false;		// hack, should not have geo in content, should be object3d
		that.portals[ 1 ].object.visible = false;

		preInitScene( result, shared.renderer );
		
		if ( scene.collisions ) {

			that.scene.collisions.merge( scene.collisions );

		}

		var train  = result.objects[ "Train" ],
			cargo1 = result.objects[ "cargo1" ],
			cargo2 = result.objects[ "cargo2" ];

		//train.materials[ 0 ].wireframe = true;

/*		train.position.set( -0.5, -6, 11 );
		train.rotation.set( -1.57, 0, 3.14  );
		train.updateMatrix();
		camera.animationParent.addChild( train );

		cargo1.position.set( -0.5, -6, 0 );
		cargo1.rotation.set( -1.57, 0, 3.14  );
		cargo1.updateMatrix();
		camera.animationParent.addChild( cargo1 );

		cargo2.position.set( 0, -6, -11 );
		cargo2.rotation.set( -1.57, 0, 3.14  );
		cargo2.updateMatrix();
		camera.animationParent.addChild( cargo2 );
*/		

		that.scene.update( undefined, true );
		
		callbackSoup();

	};

	loader.load( "/files/models/prairie/Prairie.js", prairieLoaded );

	this.update = function ( delta, camera, portalsActive ) {

		ROME.TrailShaderUtils.updateLava( delta * 0.0001, shared.lavatrailx, -shared.lavatrailz );
		ROME.TrailShaderUtils.setMarkAtWorldPosition( shared.lavatrailx, -shared.lavatrailz );

		TriggerUtils.effectorRadius = 50;
		TriggerUtils.update( "prairie" );

		// check portals

		if( portalsActive ) {

			var currentPosition = camera.matrixWorld.getPosition();

			for( var i = 0; i < that.portals.length; i++ ) {

				that.portals[ i ].currentDistance = that.portals[ i ].object.matrixWorld.getPosition().distanceTo( currentPosition );

				if( that.portals[ i ].currentDistance < that.portals[ i ].radius ) {

					shared.signals.startexploration.dispatch( "dunes" );

				}

			}

		}

	}

};
