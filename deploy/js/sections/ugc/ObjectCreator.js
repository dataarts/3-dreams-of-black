var ObjectCreator = function ( shared ) {

	var camera, scene, renderer;

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	scene = new THREE.Scene();

	var loader = new THREE.JSONLoader();
	loader.load( { model: "files/models/dunes/D_tile_1.js", callback: function ( geometry ) {

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

		renderer.clear();
		renderer.render( scene, camera );

	};

};
