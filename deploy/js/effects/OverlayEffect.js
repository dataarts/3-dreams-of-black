var OverlayEffect = function ( shared, texture ) {

	SequencerItem.call( this );

	var camera, scene, material, texture, object,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );

		object = new THREE.Mesh( new THREE.Plane( 3, 3 ), this.material );
		scene.addObject( object );

		// renderer.initMaterial( material, scene.lights, scene.fog, object );

	};

	this.update = function ( progress, delta, time ) {

		//material.opacity = 1 - progress;
		this.material.opacity = 0.25;
		renderer.render( scene, camera, renderTarget );

	};

};

OverlayEffect.prototype = new SequencerItem();
OverlayEffect.prototype.constructor = OverlayEffect;
