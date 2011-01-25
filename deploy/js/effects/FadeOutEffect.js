var FadeOutEffect = function ( hex, renderer ) {

	Effect.call( this );

	var camera, scene, material, object;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		material = new THREE.MeshBasicMaterial( { color: hex, opacity: 1 } );
		object = new THREE.Mesh( new Plane( 3, 3 ), material );

		scene.addObject( object );

	};

	this.update = function ( i ) {

		material.opacity = 1 - i;
		renderer.render( scene, camera );

	};

};

FadeOutEffect.prototype = new Effect();
FadeOutEffect.prototype.constructor = FadeOutEffect;
