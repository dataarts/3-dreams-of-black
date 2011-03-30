var TransitionToCity = function ( renderer, events ) {

	SequencerItem.call( this );

	var video, renderer = shared.renderer,
	camera, scene, geometry, texture, mesh;

	var mouseX = 0, mouseY = 0;

	this.init = function () {

		shared.signals.mousemoved.add( function () {

			mouseX = ( shared.mouseX / shared.screenWidth ) * 200 - 100;
			mouseY = ( shared.mouseY / shared.screenHeight ) * 200 - 100;

		} );

		// video

		video = document.createElement( 'video' );
		video.src = 'files/videos/transition_city.webm';

		// 3d

		camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 1, 1000 );
		camera.position.z = 200;

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

		texture.needsUpdate = true;

		camera.position.x = ( mouseX - camera.position.x ) * 0.05;
		camera.position.y = ( - mouseY - camera.position.y ) * 0.05;
		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;

		renderer.render( scene, camera );

	};

};

TransitionToCity.prototype = new SequencerItem();
TransitionToCity.prototype.constructor = TransitionToCity;
