var Intro = function ( shared ) {

	SequencerItem.call( this );

	var video,
	camera, scene, geometry, texture, mesh,
	renderer = shared.renderer;

	this.init = function () {

		// video

		video = document.createElement( 'video' );
		video.src = 'files/videos/s02-1.webm';
		video.addEventListener( 'ended', function onVideoEnd() {

			this.play(); // firefox loop fix

		}, false );

		// 3d

		camera = new THREE.Camera( 50, WIDTH / HEIGHT, 1, 1000 );
		camera.position.z = 220;

		scene = new THREE.Scene();

		geometry = new Plane( 480, 272, 19, 9 );

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
		scene.addChild( mesh );

	};

	this.show = function ( f ) {

		video.currentTime = f * video.duration;
		video.play();

	};

	this.hide = function () {

		video.pause();

	};

	this.update = function ( f ) {

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			texture.needsUpdate = true;

		}

		renderer.render( scene, camera );

	};

};

Intro.prototype = new SequencerItem();
Intro.prototype.constructor = Intro;
