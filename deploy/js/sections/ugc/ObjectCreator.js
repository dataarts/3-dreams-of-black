var ObjectCreator = function ( shared ) {

	var camera, scene, renderer;

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 200;

	scene = new THREE.Scene();

	scene.fog = new THREE.FogExp2( 0xffffff, 0.000275 );
	scene.fog.color.setHSV( 0.576,  0.382,  0.9  );

	var light1 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light1.position.set( 0.5, 0.75, 1 );
	light1.color.setHSV( 0, 0, 1 );
	scene.addLight( light1 );

	var light2 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light2.position.set( - 0.5, - 0.75, - 1 );
	light2.color.setHSV( 0, 0, 0.306 );
	scene.addLight( light2 );

	var loader = new THREE.JSONLoader();
	loader.load( { model: "files/models/ugc/D_tile_1.D_tile_1.js", callback: function ( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.position.x = 1500;
		mesh.position.y = - 50;
		mesh.rotation.x = - 90 * Math.PI / 180;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.5;
		scene.addChild( mesh );

	} } );

	renderer = new THREE.WebGLRenderer();
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color );
	renderer.sortObjects = false;
	renderer.autoClear = false;

	this.getDomElement = function () {

		return renderer.domElement;

	};

	this.show = function () {

		

	};

	this.hide = function () {



	};

	this.resize = function ( width, height ) {

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );

	};

	this.update = function () {

		console.log( "rendering") ;

		renderer.clear();
		renderer.render( scene, camera );

	};

};
