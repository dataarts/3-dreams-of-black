var HeatEffect = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		uniforms = HeatEffectShader.uniforms;
		uniforms.map.texture = renderTarget;

		material = new THREE.MeshShaderMaterial( {
		
			uniforms: uniforms,
			vertexShader: HeatEffectShader.vertexShader,
			fragmentShader: HeatEffectShader.fragmentShader
		
		} );


		var quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = - 500;
		scene.addObject( quad );

		// renderer.initMaterial( material, scene.lights, scene.fog, quad );

	};

	this.update = function ( progress, time ) {

		uniforms.time.value = time * 0.01;
		renderer.render( scene, camera, renderTarget, false );

	};

}

HeatEffect.prototype = new SequencerItem();
HeatEffect.prototype.constructor = HeatEffect;

HeatEffectShader = {

	uniforms: {

		"map": { type: "t", value:0, texture: null },
		"time": { type: "f", value:0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D map;",
		"uniform float time;",
		"varying vec2 vUv;",

		"void main() {",

			"vec4 color, tmp, add;",
			
			"vec2 uv = vUv + vec2( sin( vUv.y * 100.0 ), cos( vUv.x * 100.0 )) * 0.00025;",
			
			"color = texture2D( map, uv );",

			"vec2 diaA = vec2( 0.0008, 0.0008 );",
			"vec2 diaB = vec2( 0.0008, -0.0008 );",
			"vec2 hor = vec2( 0.001, 0.0 );",
			"vec2 vert = vec2( 0.0, 0.001 );",

			"add = tmp = texture2D( map, uv + diaA );", 
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv - diaA );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv + diaB );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv - diaB );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv + hor );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv - hor );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv + vert );",
			"if( tmp.r < color.r ) color = tmp;",

			"add += tmp = texture2D( map, uv - vert );",
			"if( tmp.r < color.r ) color = tmp;",

			"gl_FragColor = color * color + add * 0.5 / 8.0;",

		"}"

	].join("\n")

}
