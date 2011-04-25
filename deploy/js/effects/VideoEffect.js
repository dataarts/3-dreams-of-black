var VideoEffect = function ( shared, src ) {

	SequencerItem.call( this );

	var interval, video, camera, scene, texture, object,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	this.init = function () {

		// video

		video = document.createElement( 'video' );
		video.preload = true;
		video.src = src;
		// shared.film.domElement.appendChild( video );

		// 3d

		camera = new THREE.Camera( 53, 1, 1, 1000 );
		camera.position.z = 1;

		scene = new THREE.Scene();

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		object = new THREE.Mesh( new THREE.Plane( 1, 1 ), new THREE.MeshBasicMaterial( { map: texture, depthTest: false } ) );
		scene.addObject( object );

	};

	this.show = function ( progress ) {

		video.currentTime = progress * video.duration;
		video.play();

		interval = setInterval( function () {

			if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

				texture.needsUpdate = true;

			}

		}, 1000 / 30 );

	};

	this.hide = function () {

		video.pause();
		clearInterval( interval );

		// texture.needsUpdate = true;

	};

	this.update = function ( progress, delta, time ) {

		renderer.render( scene, camera, renderTarget );

	};

};

VideoEffect.prototype = new SequencerItem();
VideoEffect.prototype.constructor = VideoEffect;
