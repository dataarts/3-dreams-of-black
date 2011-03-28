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

		camera = new THREE.Camera( 75, WIDTH / HEIGHT, 1, 1000 );
		camera.position.z = -100;
		camera.position.x = 0;
		camera.position.y = 0;

		scene = new THREE.Scene();

		geometry = new Plane( 960, 544, 19, 9 );

		for ( var i = 0; i < geometry.vertices.length; i ++ ) {

			var col = i % 20;
			geometry.vertices[i].position.z = - 50 * Math.sin( col / 6.25 );

		}

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, map: texture } ) );
		scene.addChild( mesh );

	};

	this.show = function ( f ) {

		video.play();

	};

	this.hide = function () {

		video.pause();

	};

	this.update = function ( f ) {

		texture.needsUpdate = true;
		// renderer.render( scene, camera );

	};

};

Intro.prototype = new SequencerItem();
Intro.prototype.constructor = Intro;
