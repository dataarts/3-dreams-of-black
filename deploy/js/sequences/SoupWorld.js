var SoupWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.0 );
	this.scene.fog.color.setHSV( 0, 0, 0.5411764705882353 );

	// Lights

	var ambientLight = new THREE.AmbientLight( 0xffffff );
	//ambientLight.color.setHSV( 0, 0, 0.16470588235294117 );
	ambientLight.color.setHSV( 0, 0, 0.36470588235294117 );
	this.scene.addLight( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -0.6,  1.1,  -0.6 );
	//directionalLight.color.setHSV( 0.5411764705882353, 0.12352941176470589, 0.7294117647058823 );
	this.scene.addLight( directionalLight );

	that.scene.collisions = new THREE.CollisionSystem();

	// reference cube
	var cube = new THREE.Cube(100,50,100);
	that.refCube = new THREE.Mesh( cube, new THREE.MeshLambertMaterial( { color: 0x0000aa, opacity: 0.2 } ) );
	that.refCube.rotation.y = -Math.PI/4;
	that.refCube.position.x = 100
	that.scene.addObject( that.refCube );

	that.refFloor = new THREE.Mesh( cube, new THREE.MeshLambertMaterial( { color: 0x244220 } ) );
	that.refFloor.rotation.y = -Math.PI/4;
	that.refFloor.scale.y = 0.001;
	that.refFloor.scale.x = that.refFloor.scale.z = 100;
	that.scene.addObject( that.refFloor );


}
