var SharpenEffect = function ( shared, strength ) {

	SequencerItem.call( this );

	var camera, scene, materialScreen, shader, 
	screenUniforms, convolutionUniforms,
	materialScreen, materialConvolution,
	renderTarget2, renderTarget3,
	quad,
	blurx, blury,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		var convolutionShader = THREE.ShaderUtils.lib[ "convolution" ];
		convolutionUniforms = THREE.UniformsUtils.clone( convolutionShader.uniforms );

		blurx = new THREE.Vector2( 0.001953125, 0.0 ),
		blury = new THREE.Vector2( 0.0, 0.001953125 );

		convolutionUniforms[ "tDiffuse" ].texture = renderTarget;
		convolutionUniforms[ "uImageIncrement" ].value = blurx;
		convolutionUniforms[ "cKernel" ].value = [-1, 2.5, -1];

		var vs = [
			"varying vec2 vUv;",

			"uniform vec2 uImageIncrement;",

			"void main(void) {",

				"vUv = vec2( uv.x, 1.0 - uv.y ) - ((KERNEL_SIZE - 1.0) / 2.0) * uImageIncrement;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}" ].join("\n");

		
		materialConvolution = new THREE.MeshShaderMaterial( {

			uniforms: convolutionUniforms,
			vertexShader:   "#define KERNEL_SIZE 3.0\n" + vs,
			fragmentShader: "#define KERNEL_SIZE 3\n"   + convolutionShader.fragmentShader,

		} );

		quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), materialConvolution );
		quad.position.z = -500;
		scene.addObject( quad );

	};

	this.update = function ( progress, delta, time ) {

		renderer.render( scene, camera, renderTarget, false );
		//renderer.render( scene, camera );

	};

}

SharpenEffect.prototype = new SequencerItem();
SharpenEffect.prototype.constructor = SharpenEffect;
