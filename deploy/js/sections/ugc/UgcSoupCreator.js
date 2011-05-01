var UgcSoupCreator = function ( shared ) {

	var camera, scene, renderer;

	domElement = document.createElement( 'div' );

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

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
