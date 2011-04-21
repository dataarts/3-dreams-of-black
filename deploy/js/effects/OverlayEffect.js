var OverlayEffect = function ( shared, texture ) {

	SequencerItem.call( this );

	var camera, scene, material, texture, object,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );

		object = new THREE.Mesh( new THREE.Plane( 3, 3 ), material );
		scene.addObject( object );

		// renderer.initMaterial( material, scene.lights, scene.fog, object );

	};

	this.update = function ( f ) {

		material.opacity = 1 - f;
		renderer.render( scene, camera, renderTarget );

	};

};

OverlayEffect.prototype = new SequencerItem();
OverlayEffect.prototype.constructor = OverlayEffect;
