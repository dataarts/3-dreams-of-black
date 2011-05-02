var PaintDarkEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		uniforms = {

			"map": { type: "t", value:0, texture: renderTarget }

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
					
					"vec2 uv = vUv + vec2( sin( vUv.y * 100.0 ), sin( vUv.x * 100.0 )) * 0.0005;",
					
					"color = texture2D( map, uv );",

					"add = tmp = texture2D( map, uv + vec2( 0.0015, 0.0015 ));", 
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -0.0015, 0.0015 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -0.0015, -0.0015 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0.0015, -0.0015 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0.002, 0.0 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( -0.002, 0.0 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0, 0.002 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"add += tmp = texture2D( map, uv + vec2( 0, -0.002 ));",
					"if( tmp.r < color.r ) color = tmp;",

					"uv = (uv - vec2(0.5)) * vec2(0.7);",
					"gl_FragColor = vec4(mix(color.rgb * color.rgb * vec3(1.8), color.ggg * color.ggg - vec3(0.4), vec3(dot(uv, uv))), 1.0);",
					
				"}"

				].join("\n")

		} );


		var quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = - 500;
		scene.addObject( quad );

		// renderer.initMaterial( material, scene.lights, scene.fog, quad );

	};

	this.update = function ( progress, delta, time ) {

		renderer.render( scene, camera, renderTarget, false );

	};

};

PaintDarkEffect.prototype = new SequencerItem();
PaintDarkEffect.prototype.constructor = PaintDarkEffect;
