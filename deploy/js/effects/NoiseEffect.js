var NoiseEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		shader = ShaderUtils.lib["film"];

		uniforms = Uniforms.clone( shader.uniforms );
		uniforms["tDiffuse"].texture = renderTarget;

		material = new THREE.MeshShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		} );

		material.uniforms.grayscale.value = 0;

		var quad = new THREE.Mesh( new Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = -500;
		scene.addObject( quad );

	};

	this.update = function ( progress, time ) {

		uniforms.time.value = time * 0.01;
		renderer.render( scene, camera, renderTarget, false );

	};

}

NoiseEffect.prototype = new SequencerItem();
NoiseEffect.prototype.constructor = NoiseEffect;
