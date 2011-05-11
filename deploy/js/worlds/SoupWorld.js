var SoupWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x7de0f8, 0.0001 );
	this.scene.fog.color.setHSV( 0.576,  0.382,  0.9  );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0, 0, 0.1 );
	this.scene.addLight( ambient );

	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	directionalLight1.position.set( 0.8085776615544399,  0.30962281305702444,  -0.500335766130914 );
	directionalLight1.color.setHSV( 0.08823529411764706,  0,  1 );
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );
	directionalLight2.position.set( 0.09386404300915006,  0.9829903100365339,  0.15785940518149455 );
	directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 );
	this.scene.addLight( directionalLight2 );

	that.scene.collisions = new THREE.CollisionSystem();

	// reference cube
	var cube = new THREE.Cube(100,50,100);
	that.refCube = new THREE.Mesh( cube, new THREE.MeshLambertMaterial( { color: 0x999999, opacity: 0.2 } ) );
	that.refCube.rotation.y = -Math.PI/4;
	//that.refCube.position.x = 100
	that.scene.addObject( that.refCube );

	that.refFloor = new THREE.Mesh( cube, new THREE.MeshLambertMaterial( { color: 0xe0b160 } ) );
	that.refFloor.rotation.y = -Math.PI/4;
	that.refFloor.scale.y = 0.001;
	that.refFloor.scale.x = that.refFloor.scale.z = 500;
	that.scene.addObject( that.refFloor );

};
