var ParalaxSequence = function ( shared, videoPath1, videoPath2 ) {

	SequencerItem.call( this );

	var interval, video, video2, camera, scene, geometry, geometry2, texture, texture2, mesh, mesh2,
	renderer = shared.renderer, renderTarget = shared.renderTarget;
	
	var mouseX = 0, mouseY = 0;

	this.init = function () {
		camera = new THREE.Camera( 53, 1, 1, 1000 );
		camera.position.z = 1;

		scene = new THREE.Scene();
		
		shared.signals.mousemoved.add( function () {
			mouseX = ( shared.mouse.x / shared.screenWidth ) * 2 - 1;
			mouseY = ( shared.mouse.y / shared.screenHeight ) * 2 - 1;
		} );
	
		
		video = document.createElement( 'video' );
		video.src = videoPath1;

		geometry = new THREE.Plane( 2, 2 );
		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		
		var shader = VideoShadersSource['opaque'];
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms) ;
		uniforms['map'].texture = texture;
		uniforms['flip'].value = 1;

		var mat = new THREE.MeshShaderMaterial({
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			blending: THREE.BillboardBlending,
			//depthTest: false
		});

		mesh = new THREE.Mesh( geometry, mat );
		mesh.position.z = -1;
		scene.addChild( mesh );
		
		
		
		
		
		video2 = document.createElement( 'video' );
		video2.src = videoPath2;
		
		geometry2 = new THREE.Plane( 1, 1 );
		texture2 = new THREE.Texture( video2 );
		texture2.minFilter = THREE.LinearFilter;
		texture2.magFilter = THREE.LinearFilter;

		var shader = VideoShadersSource['halfAlpha'];
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
		uniforms['map'].texture = texture2;
		uniforms['flip'].value = 0;

		var mat2 = new THREE.MeshShaderMaterial({
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			blending: THREE.BillboardBlending,
			//depthTest: false
		});

		mesh2 = new THREE.Mesh( geometry2, mat2 );
		scene.addChild( mesh2 );

	};

	this.show = function ( progress ) {

		video.currentTime = progress * video.duration;
		video.play();

		interval = setInterval( function () {

			if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

				texture.needsUpdate = true;

			}

		}, 1000 / 24 );
		
		video2.currentTime = progress * video2.duration;
		video2.play();

		interval2 = setInterval( function () {

			if ( video2.readyState === video2.HAVE_ENOUGH_DATA ) {

				texture2.needsUpdate = true;

			}

		}, 1000 / 24 );

	};

	this.hide = function () {

		video.pause();

		clearInterval( interval );

	};

	this.update = function ( progress, delta, time ) {

		//camera.position.x = ( mouseX - camera.position.x ) * 0.05;
		//camera.position.y = ( - mouseY - camera.position.y ) * 0.05;
		//camera.target.position.x = camera.position.x;
		//camera.target.position.y = camera.position.y;
		
		mesh.position.x = mouseX * 0.1;
		mesh.position.y = mouseY * 0.1;

		renderer.render( scene, camera, renderTarget );

	};

};

ParalaxSequence.prototype = new SequencerItem();
ParalaxSequence.prototype.constructor = ParalaxSequence;
