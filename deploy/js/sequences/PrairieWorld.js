var PrairieWorld = function ( shared, camera ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.collisions = new THREE.CollisionSystem();

	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0 );
	this.scene.fog.color.setHSV( 0.559, 0.741, 0.588 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0.235,  0.341,  0.141 );
	this.scene.addLight( ambient );

	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight1.position.set( 0.19587102348124588,  0.9325398992514422,  -0.30332141115410777  );
	directionalLight1.color.setHSV( 0,  0,  0.8764705882352941 );
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight2.position.set( 0.19122302057716462,  -0.30810803127799236,  -0.9319351895187481 );
	directionalLight2.color.setHSV( 0.34705882352941175,  0.5058823529411764,  0.13529411764705881 );						
	this.scene.addLight( directionalLight2 );

	// trail

	var markTexture = THREE.ImageUtils.loadTexture( "files/textures/trailMarkTexture.jpg" );

	// Scene

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function prairieLoaded( result ) {

		var i, l, object, scene = result.scene;

		for( i = 0, l = scene.collisions.colliders.length; i < l; i++ ) {

			mesh = scene.collisions.colliders[ i ].mesh;
			mesh.visible = false;
    
		}

		for ( i = 0, l = scene.objects.length; i < l; i ++ ) {

			object = scene.objects[ i ];
			object.matrixAutoUpdate = false;
			object.updateMatrix();

		}

		var groundMesh = result.objects[ "Ground" ];

		ROME.TrailShaderUtils.setMaterials( [ groundMesh ], 1024, markTexture, shared.renderer );

		that.scene.addChild( scene );
		
		if ( scene.collisions ) {
		
			that.scene.collisions.merge( scene.collisions );

		}

		var train  = result.objects[ "Train" ],
			cargo1 = result.objects[ "cargo1" ],
			cargo2 = result.objects[ "cargo2" ];
		 
		//train.materials[ 0 ].wireframe = true;

		train.position.set( -0.5, -6, 11 );
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

	};	

	loader.load( "files/models/prairie/Prairie.js", prairieLoaded );

	this.update = function ( delta ) {

		ROME.TrailShaderUtils.updateLava( delta );
		ROME.TrailShaderUtils.setMarkAtWorldPosition( shared.lavatrailx, -shared.lavatrailz );

	};


};
