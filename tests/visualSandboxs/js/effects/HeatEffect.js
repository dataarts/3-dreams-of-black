var HeatEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		uniforms = {

			"time": { type: "f", value:0 },
			"map": { type: "t", value:0, texture: renderTarget },
			"sampleDistance": { type: "f", value: 1 / shared.baseWidth }

		};

		material = new THREE.MeshShaderMaterial( {

			uniforms: uniforms,
			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),
			fragmentShader: [

				"uniform sampler2D map;",
				"varying vec2 vUv;",

				"void main() {",

					"vec4 color, tmp, add;",

					// "vec2 uv = vUv + vec2( sin( vUv.y * 100.0 ), sin( vUv.x * 100.0 )) * 0.0005;",
					"vec2 uv = vUv;",

					"color = texture2D( map, uv );",

					"float param1 = 0.0009;",
					"float param2 = 0.001;",

					"add = tmp = texture2D( map, uv + vec2( param1, param1 ));", 
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -param1, param1 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -param1, -param1 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( param1, -param1 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( param2, 0.0 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -param2, 0.0 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0, param2 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0, -param2 ));",
					"if( tmp.r < color.r ) color = tmp;",


					"gl_FragColor = color * color + add * 0.5 / 8.0;",

					// "gl_FragColor = texture2D( map, uv );",

				"}"

				].join("\n")

		} );


		var quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = - 500;
		scene.addObject( quad );

		// renderer.initMaterial( material, scene.lights, scene.fog, quad );

	};

	this.update = function ( progress, delta, time ) {

		uniforms.time.value = time * 0.01;
		renderer.render( scene, camera, renderTarget, false );

	};

}

HeatEffect.prototype = new SequencerItem();
HeatEffect.prototype.constructor = HeatEffect;
