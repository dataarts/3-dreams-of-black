var FadeInEffect = function ( hex, shared ) {

	SequencerItem.call( this );

	var camera, scene, material, object,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		material = new THREE.MeshBasicMaterial( { color: hex, opacity: 0, depthTest: false } );

		object = new THREE.Mesh( new THREE.Plane( 3, 3 ), material );
		scene.addObject( object );

		// renderer.initMaterial( material, scene.lights, scene.fog, object );

	};

	this.update = function ( progress, delta, time ) {

		material.opacity = 1 - progress;
		renderer.render( scene, camera, renderTarget );

	};

};

FadeInEffect.prototype = new SequencerItem();
FadeInEffect.prototype.constructor = FadeInEffect;
