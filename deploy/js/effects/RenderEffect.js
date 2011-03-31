var RenderEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, mesh,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.position.z = 200;
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );

		scene = new THREE.Scene();

		var mesh = new THREE.Mesh( new Plane( shared.baseWidth, shared.baseHeight ), new THREE.MeshBasicMaterial( { map: renderTarget, depthTest: false } ) );
		mesh.scale.y = - 1; // TODO: HACK
		mesh.doubleSided = true;
		scene.addObject( mesh );

	};

	this.update = function ( f ) {

		renderer.render( scene, camera );

	};

};

RenderEffect.prototype = new SequencerItem();
RenderEffect.prototype.constructor = RenderEffect;
