var UgcSoupCreator = function ( shared ) {

	var soup, soupGroup;

	this.init = function () {

    shared.ugc.scene.collisions = new THREE.CollisionSystem();
		soupGroup = new THREE.Object3D();
    soup = new UgcSoup( shared.ugc.camera, shared.ugc.scene, shared, true );

  };

	this.getDomElement = function () {

		return shared.renderer.domElement;

	};

	this.show = function () {


	};

	this.hide = function () {



	};

	this.resize = function ( width, height ) {

		//camera.aspect = width / height;
		//camera.updateProjectionMatrix();

		//renderer.setSize( width, height );

	};

	this.update = function () {
    //TODO add real delta
    soup.update( 20 );
    THREE.AnimationHandler.update( 20 );
		//renderer.clear();
		//renderer.render( scene, camera );

	};

};
