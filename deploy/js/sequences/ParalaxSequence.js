var ParalaxSequence = function ( shared, videoPath ) {

	SequencerItem.call( this );

	var interval, video, camera, scene, geometry, texture, mesh,
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
		video.src = videoPath;

		geometry = new THREE.Plane( 2, 2 );
		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		
		var shader = VideoShadersSource['multiVideo3x3'];
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms) ;
		uniforms['map'].texture = texture;

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
