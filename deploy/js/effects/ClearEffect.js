var ClearEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 10000 );
		camera.position.z = 2;

		scene = new THREE.Scene();

		// renderer.initMaterial( material, scene.lights, scene.fog, object );

	};

	this.update = function ( i ) {

		renderer.clear();
		renderer.render( scene, camera, renderTarget, true );

	};

};

ClearEffect.prototype = new SequencerItem();
ClearEffect.prototype.constructor = ClearEffect;
