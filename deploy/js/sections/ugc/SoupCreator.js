var SoupCreator = function ( shared ) {

	var camera, scene, renderer;

	domElement = document.createElement( 'div' );

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	this.getDomElement = function () {

		return domElement;

	};

	this.show = function () {

		domElement.appendChild( renderer.domElement );

	};

	this.hide = function () {



	};

	this.resize = function ( width, height ) {

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );

	};

	this.update = function () {

		position = ( ( new Date().getTime() - start_time ) * 0.03 ) % 4000;

		camera.position.x += ( mouse.x - camera.target.position.x ) * 0.01;
		camera.position.y += ( - mouse.y - camera.target.position.y ) * 0.01;
		camera.position.z = - position + 4000;

		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.clear();
		renderer.render( scene, camera );

	};

};
