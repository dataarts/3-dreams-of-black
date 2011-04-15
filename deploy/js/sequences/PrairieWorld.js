var PrairieWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0 );
	this.scene.fog.color.setHSV( 0.5588235294117647,  0.7411764705882353,  0.5882352941176471 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0.23529411764705882,  0.3411764705882353,  0.1411764705882353 );
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

		for ( var i = 0, l = result.scene.objects.length; i < l; i ++ ) {

			var object = result.scene.objects[ i ];
			object.matrixAutoUpdate = false;
			object.updateMatrix();
			//console.log(object);
		}

		var groundMesh = result.objects[ "Ground" ];
		ROME.TrailShaderUtils.setMaterials( [ groundMesh ], 1024, markTexture, renderer );

		that.scene.addChild( result.scene );

		//console.log("colliders = "+THREE.Collisions.colliders.length);

		for( var i = 0; i < THREE.Collisions.colliders.length; i++ ) {
   
			mesh = THREE.Collisions.colliders[ i ].mesh;
			mesh.visible = false;
    
		}

	};	

	loader.load( "files/models/prairie/Prairie.js", function(){}, prairieLoaded, function(){});

	this.update = function ( x, z ) {

		ROME.TrailShaderUtils.updateLava();
		ROME.TrailShaderUtils.setMarkAtWorldPosition( x, -z );

	}


}
