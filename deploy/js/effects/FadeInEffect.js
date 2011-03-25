var FadeInEffect = function ( hex, renderer ) {

	SequencerItem.call( this );

	var camera, scene, material, object;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		material = new THREE.MeshBasicMaterial( { color: hex, opacity: 0 } );
		object = new THREE.Mesh( new Plane( 3, 3 ), material );

		scene.addObject( object );

	};

	this.update = function ( i ) {

		material.opacity = i;
		renderer.render( scene, camera );

	};

};

FadeInEffect.prototype = new SequencerItem();
FadeInEffect.prototype.constructor = FadeInEffect;
