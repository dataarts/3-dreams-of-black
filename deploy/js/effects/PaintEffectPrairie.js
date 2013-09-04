var PaintEffectPrairie = function ( shared ) {

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
			"vingenettingOffset": { type: "f", value: 0.94 },
			"vingenettingDarkening": { type: "f", value: 0.36 },
			"colorOffset": { type: "f", value: 0 },
			"colorFactor": { type: "f", value: 0 },
			"colorBrightness": { type: "f", value: 0 },
			"sampleDistance": { type: "f", value: 0.49 },
			"waveFactor": { type: "f", value: 0.00161 },
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
					"vec4 color, org, tmp, add;",
					"float sample_dist, f;",
					"vec2 vin;",				
					"vec2 uv = vUv;",
					
					"add = color = org = texture2D( map, uv );",


					"vin = (uv - vec2(0.5)) * vec2( 1.55 /*vingenettingOffset * 2.0*/);",
					"sample_dist =(dot( vin, vin ) * 2.0);",
					"f = (waveFactor * 100.0 + sample_dist) * sampleDistance * 4.0;",

				//	"vin = (uv - vec2(0.5)) * vec2(4.0);",
				//	"sample_dist = (dot( vin, vin ) * 2.0);",
					
				//	"f = (1.86 + sample_dist) * sampleDistance * 0.5;",
	
					"vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2(f);",
	
					"add += tmp = texture2D( map, uv + vec2(0.111964, 0.993712) * sampleSize);", 
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.846724, 0.532032) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.943883, -0.330279) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.330279, -0.943883) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.532032, -0.846724) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.993712, -0.111964) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.707107, 0.707107) * sampleSize);",
					"if( tmp.g > color.g ) color = tmp;",
	

					"uv = (uv - vec2(0.5)) * vec2( vingenettingOffset );",
					/* Blob */ 
					//"color = color * vec4(2.0) - (add / vec4(8.0));",
					//"color = color + (add / vec4(8.0) - color) * (vec4(1.0) - vec4(sample_dist * 0.5));",

					/* Blob and blur */ 
					"color = color + (add / vec4(8.0) - color) * (vec4(1.0) - vec4(sample_dist * 0.5));",
					/* Blur */ 
					//"color = (add / vec4(8.0));",
					"gl_FragColor = vec4( mix(color.rgb * color.rgb * vec3(colorOffset) + color.rgb, color.ggg * colorFactor - vec3( vingenettingDarkening ), vec3( dot( uv, uv ))), 1.0 );",
					"gl_FragColor = vec4(1.0) - (vec4(1.0) - gl_FragColor) * (vec4(1.0) - gl_FragColor);",
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

PaintEffectPrairie.prototype = new SequencerItem();
PaintEffectPrairie.prototype.constructor = PaintEffectPrairie;
