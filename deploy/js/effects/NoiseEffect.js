var NoiseEffect = function ( shared, nIntensity, sIntensity, sCount ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		shader = THREE.ShaderUtils.lib[ "film" ];

		uniforms = THREE.UniformsUtils.clone( shader.uniforms );
		uniforms[ "tDiffuse" ].texture = renderTarget;

		material = new THREE.MeshShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		} );

		uniforms.grayscale.value = 0;
		if ( nIntensity !== undefined ) uniforms.nIntensity.value = nIntensity;
		if ( sIntensity !== undefined ) uniforms.sIntensity.value = sIntensity;
		if ( sCount !== undefined ) uniforms.sCount.value = sCount;

		var quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = - 500;
		scene.addObject( quad );

		// renderer.initMaterial( material, scene.lights, scene.fog, quad );

	};

	this.update = function ( progress, delta, time ) {

		uniforms.time.value = ( time * 0.01 ) % 10000;
		renderer.render( scene, camera, renderTarget, false );

	};

}

NoiseEffect.prototype = new SequencerItem();
NoiseEffect.prototype.constructor = NoiseEffect;
