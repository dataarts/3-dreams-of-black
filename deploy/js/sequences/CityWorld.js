var CityWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.00004705882352941177 );
	this.scene.fog.color.setHSV( 0, 0, 0.6411764705882353 );

	// Lights
	/*
	var pointLight = new THREE.PointLight( 0xbbbbff, 0.5 );
	pointLight.position.x = 1000;
	pointLight.position.y = 500;
	pointLight.position.z = - 1000;
	this.scene.addLight( pointLight );

	var pointLight = new THREE.PointLight( 0xffeeee, 0.2 );
	pointLight.position.set( -1000, -500, -1000 );
	this.scene.addLight( pointLight );
	*/	

	var ambientLight = new THREE.AmbientLight( 0xffffff );
	ambientLight.color.setHSV( 0, 0, 0.16470588235294117 );
	this.scene.addLight( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -0.645442029122017,  0.34452945220032116,  -0.6816920445548706 );
	directionalLight.color.setHSV( 0.5411764705882353, 0.12352941176470589, 0.7294117647058823 );
	this.scene.addLight( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
	directionalLight.position.set( 0.7,  -0.5,  0.25 );
	this.scene.addLight( directionalLight );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( { model: 'files/models/city/City_P2.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );
		
		preInitModel( geometry, shared.renderer, that.scene, mesh );

	} } );

	// Shadow

	loader.load( { model: 'files/models/city/City_Shadow.js', callback: function( geometry ) {

		var shadowMesh = new THREE.Mesh( geometry );
		shadowMesh.scale.x = shadowMesh.scale.y = shadowMesh.scale.z = 0.1;
		
		var shadow = new THREE.ShadowVolume( shadowMesh );
		
		that.scene.addChild( shadow );

		preInitModel( geometry, shared.renderer, that.scene, shadowMesh );

	} } );

}
