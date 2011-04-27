var HalfAlphaShaderSource = {

	'halfAlpha' : {

		uniforms: {

			"map" : { type: "t", value: 0, texture: null },
			"flip": { type: "i", value: 0 }

		},

		vertexShader: [

			"varying vec2 vUv;",
			"uniform bool flip;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"if ( flip )",
					"vUv = vec2( 1.0 - uv.x, uv.y );",
				"else",
					"vUv = uv;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",

			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( map, vec2( vUv.x * 0.5, vUv.y ) );",
				"vec4 a = texture2D( map, vec2( 0.5 + vUv.x * 0.5, vUv.y ) );",
				"gl_FragColor = vec4(c.rgb, a.r);",
			"}"

		].join("\n")

	},

	'opaque' : {

		uniforms: {

			"map" : { type: "t", value: 0, texture: null },
			"flip": { type: "i", value: 0 }

		},

		vertexShader: [

			"varying vec2 vUv;",
			"uniform bool flip;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"if ( flip )",
					"vUv = vec2( 1.0 - uv.x, uv.y );",
				"else",
					"vUv = uv;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",

			"varying vec2 vUv;",

			"void main() {",
				"vec4 c = texture2D( map, vUv );",
				"gl_FragColor = c;",
			"}"

		].join("\n")

	}

};

var VideoSequence = function ( shared, videoPath, hasAlpha, flip ) {

	SequencerItem.call( this );

	var interval, video, camera, scene, geometry, texture, mesh,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	// var mouseX = 0, mouseY = 0;

	this.init = function () {

		/*
		shared.signals.mousemoved.add( function () {

			mouseX = ( shared.mouse.x / shared.screenWidth ) * 200 - 100;
			mouseY = ( shared.mouse.y / shared.screenHeight ) * 200 - 100;

		} );
		*/

		// video

		video = document.createElement( 'video' );
		video.preload = true;
		video.src = videoPath;

		// 3d

		camera = new THREE.Camera( 53, 1, 1, 1000 );
		camera.position.z = 1;

		scene = new THREE.Scene();

		geometry = new THREE.Plane( 1, 1 );

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		if ( hasAlpha ) {

			var shader = HalfAlphaShaderSource['halfAlpha'];

			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
			uniforms['map'].texture = texture;
			uniforms['flip'].value = ( flip !== undefined ) ? flip : 0;

			var mat = new THREE.MeshShaderMaterial({
				uniforms: uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				blending: THREE.BillboardBlending,
				depthTest: false
			});

			mesh = new THREE.Mesh( geometry, mat );

		} else {

			var shader = HalfAlphaShaderSource['opaque'];

			var uniforms = THREE.UniformsUtils.clone( shader.uniforms) ;
			uniforms['map'].texture = texture;
			uniforms['flip'].value = ( flip !== undefined ) ? flip : 0;

			var mat = new THREE.MeshShaderMaterial({
				uniforms: uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				blending: THREE.BillboardBlending,
				depthTest: false
			});

			//mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, depthTest: false }));
			mesh = new THREE.Mesh( geometry, mat );

		}

		//mesh.scale.x = -1;
		//mesh.doubleSided = true;

		scene.addChild( mesh );

	};

	this.show = function ( progress ) {

		video.currentTime = progress * video.duration;
		video.play();

		interval = setInterval( function () {

			if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

				texture.needsUpdate = true;

			}

		}, 1000 / 24 );

	};

	this.hide = function () {

		video.pause();

		clearInterval( interval );

	};

	this.update = function ( progress, delta, time ) {

		/*
		camera.position.x = ( mouseX - camera.position.x ) * 0.05;
		camera.position.y = ( - mouseY - camera.position.y ) * 0.05;
		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;
		*/

		renderer.render( scene, camera, renderTarget );

	};

};

VideoSequence.prototype = new SequencerItem();
VideoSequence.prototype.constructor = VideoSequence;
