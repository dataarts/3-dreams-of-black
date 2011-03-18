var Part1World = function () {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.0006 );
//	this.scene.fog.color.setHSV( 0.6, 0.35, 1.0 );
	this.scene.fog.color.setHSV( 0.25, 0.25, 0.25 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.x = 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	var pointLight = new THREE.PointLight( 0xffffff, 0.35 );
	this.scene.addLight( pointLight );

	// Mesh
	var loader = new THREE.Loader();
	//loader.loadAscii( { model: 'files/models/street_v3/street.js', texture_path: 'files/models/street_v3/', callback: function( geometry ) {
	loader.loadAscii( { model: 'files/models/street_v3/CITY_EXPORT_CHUNK_AO.js', texture_path: 'files/models/street_v3/', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;

		that.scene.addObject( mesh );

	} } );

}
