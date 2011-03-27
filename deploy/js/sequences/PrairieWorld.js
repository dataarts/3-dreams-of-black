var PrairieWorld = function ( events ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.000035 );
	this.scene.fog.color.setHSV( 0.5, 0.15, 1.0 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { events.loadItemAdd.dispatch() };
	loader.onLoadComplete = function () { events.loadItemComplete.dispatch() };

	loader.load( { model: 'files/models/prairie/prairie.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 10.0;
		mesh.position.set(92970, -350, -273160.216127517);

		that.scene.addObject( mesh );

	} } );

}
