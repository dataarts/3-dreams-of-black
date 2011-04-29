var PaintEffectDunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, scene, material, shader, uniforms,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		camera = new THREE.Camera();
		camera.projectionMatrix = THREE.Matrix4.makeOrtho( shared.baseWidth / - 2, shared.baseWidth / 2, shared.baseHeight / 2, shared.baseHeight / - 2, - 10000, 10000 );
		camera.position.z = 100;

		scene = new THREE.Scene();

		this.uniforms = {

			"map": { type: "t", value:0, texture: renderTarget },
			"screenWidth": { type: "f", value:shared.baseWidth },
			"screenHeight": { type: "f", value:shared.baseHeight },
			"vingenettingOffset": { type: "f", value: 0.2 },
			"vingenettingDarkening": { type: "f", value: 0.4 },
			"colorOffset": { type: "f", value: 0.88 },
			"colorFactor": { type: "f", value: 0 },
			"colorBrightness": { type: "f", value: 0 },
			"sampleDistance": { type: "f", value: 1 },
			"waveFactor": { type: "f", value: 0.001 },
			"colorA": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
			"colorB": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
			"colorC": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			
		};

		material = new THREE.MeshShaderMaterial( {

			uniforms: this.uniforms,
			vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = vec2( uv.x, 1.0 - uv.y );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

			].join("\n"),

			fragmentShader: [

				"uniform float screenWidth;",
				"uniform float screenHeight;",
				"uniform float vingenettingOffset;",
				"uniform float vingenettingDarkening;",
				"uniform float colorOffset;",
				"uniform float colorFactor;",
				"uniform float sampleDistance;",
				"uniform float colorBrightness;",
				"uniform float waveFactor;",
				"uniform vec3 colorA;",
				
				
				"uniform sampler2D map;",
				"varying vec2 vUv;",
	
				"void main() {",
	
					"vec4 color, tmp, add;",
					
					"vec2 uv = vUv;// + vec2( sin( vUv.y * 10.0 ), sin( vUv.x * 10.0 )) * waveFactor;",
					
					"color = texture2D( map, uv );",
					
	
					"vec2 diaPlus = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * sampleDistance;",
					"vec2 diaMin  = vec2( -1.0 / screenWidth, 1.0 / screenHeight ) * sampleDistance;",
					"vec2 hori    = vec2( 1.0 / screenWidth, 0 ) * sampleDistance;",
					"vec2 vert    = vec2( 0, 1.0 / screenHeight ) * sampleDistance;",
	
					"tmp = texture2D( map, uv + diaPlus );", 
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv + diaMin );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv - diaPlus );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv - diaMin );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv + hori );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv - hori );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv + vert );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"tmp = texture2D( map, uv - vert );",
					"if( tmp.b > color.b ) color = tmp;",
	
					"uv = (uv - vec2(0.5)) * vec2( vingenettingOffset );",
					"gl_FragColor = vec4( colorA, 1.0 ) * vec4( mix( color.rgb * ( vec3( colorOffset ) + color.rgb * colorFactor ) + vec3( colorBrightness ), color.ggg * ( vec3( colorOffset ) + color.ggg * colorFactor ) - vec3( vingenettingDarkening ), vec3( dot( uv, uv ))), 1.0 );",
	
				"}"

				].join("\n")

		} );


		var quad = new THREE.Mesh( new THREE.Plane( shared.baseWidth, shared.baseHeight ), material );
		quad.position.z = - 500;
		scene.addObject( quad );

		// renderer.initMaterial( material, scene.lights, scene.fog, quad );

	};

	this.update = function ( progress, delta, time ) {

		renderer.render( scene, camera );

	};

};

PaintEffectDunes.prototype = new SequencerItem();
PaintEffectDunes.prototype.constructor = PaintEffectDunes;
