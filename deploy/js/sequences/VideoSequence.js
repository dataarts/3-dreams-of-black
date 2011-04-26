var HalfAlphaShaderSource = {

	'halfAlpha' : {

		uniforms: {
			"map": { type: "t", value: 0, texture: null },
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
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

	}

};

var VideoSequence = function ( shared, videoPath, hasAlpha ) {

	SequencerItem.call( this );

	var interval, video, camera, scene, geometry, texture, mesh,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	var mouseX = 0, mouseY = 0;

	this.init = function () {

		shared.signals.mousemoved.add( function () {

			mouseX = ( shared.mouse.x / shared.screenWidth ) * 200 - 100;
			mouseY = ( shared.mouse.y / shared.screenHeight ) * 200 - 100;

		} );

		// video

		video = document.createElement( 'video' );
		video.src = videoPath;

		// 3d

		camera = new THREE.Camera( 50, shared.baseWidth / shared.baseHeight, 1, 1000 );
		camera.position.z = 200;

		scene = new THREE.Scene();

		geometry = new THREE.Plane( 480, 272, 19, 9 );

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		
		if (hasAlpha) {
			var shader = HalfAlphaShaderSource['halfAlpha'];
			
			var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
			uniforms['map'].texture = texture;
			
			var mat = new THREE.MeshShaderMaterial({
				uniforms: uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				blending: THREE.BillboardBlending,
				depthTest: false
			});
			
			mesh = new THREE.Mesh(geometry, mat);
		}
		else {
			mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, depthTest: false }));
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

		camera.position.x = ( mouseX - camera.position.x ) * 0.05;
		camera.position.y = ( - mouseY - camera.position.y ) * 0.05;
		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;

		renderer.render( scene, camera, renderTarget );

	};

};

VideoSequence.prototype = new SequencerItem();
VideoSequence.prototype.constructor = VideoSequence;
