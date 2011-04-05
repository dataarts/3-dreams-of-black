var CityWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.0004705882352941177 );
	this.scene.fog.color.setHSV( 0, 0, 0.6411764705882353 );

	// Lights

	var ambientLight = new THREE.AmbientLight( 0xffffff );
	ambientLight.color.setHSV( 0, 0, 0.16470588235294117 );
	this.scene.addLight( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -0.6,  1.8,  -0.6 );
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

	//loader.load( { model: "files/models/city/City_P1.js", callback: partLoaded } );
	loader.load( { model: "files/models/city/City_P2.js", callback: partLoaded } );
	//loader.load( { model: "files/models/city/City_P3.js", callback: partLoaded } );

	function partLoaded ( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );
		
		preInitModel( geometry, shared.renderer, that.scene, mesh );

	} 


	// Shadow

	loader.load( { model: 'files/models/city/City_Shadow.js', callback: function( geometry ) {

		var shadowMesh = new THREE.Mesh( geometry );
		//shadowMesh.scale.x = shadowMesh.scale.y = shadowMesh.scale.z = 0.1;
		
		var shadow = new THREE.ShadowVolume( shadowMesh );
		shadow.scale.x = shadow.scale.y = shadow.scale.z = 0.1;
		
		that.scene.addObject( shadow, true );

		//that.scene.addObject( shadowMesh );

		preInitModel( geometry, shared.renderer, that.scene, shadowMesh );

	} } );

}
