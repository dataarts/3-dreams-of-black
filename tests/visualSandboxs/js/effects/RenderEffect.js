var RenderEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, object,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.position.z = 200;
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );

		scene = new THREE.Scene();

		var material = new THREE.MeshBasicMaterial( { map: renderTarget, depthTest: false } );
		object = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		object.scale.y = - 1; // TODO: HACK
		object.doubleSided = true;
		scene.addObject( object );

		// renderer.initMaterial( material, scene.lights, scene.fog, object );

	};

	this.update = function ( progress, delta, time ) {

		var gl = renderer.getContext();
		gl.disable( gl.BLEND );
		renderer.render( scene, camera );
		gl.enable( gl.BLEND );

	};

};

RenderEffect.prototype = new SequencerItem();
RenderEffect.prototype.constructor = RenderEffect;
