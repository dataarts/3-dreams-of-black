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

	this.update = function ( progress, delta, time ) {

		renderer.clear();

		var gl = renderer.getContext();

		gl.bindFramebuffer( gl.FRAMEBUFFER, renderTarget.__webglFramebuffer );
		gl.viewport( 0, 0, renderTarget.width, renderTarget.height );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );

		//renderer.render( scene, camera, renderTarget, true );

	};

};

ClearEffect.prototype = new SequencerItem();
ClearEffect.prototype.constructor = ClearEffect;
