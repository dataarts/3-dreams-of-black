var TransitionToPrairie = function ( shared ) {

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
		video.src = 'files/videos/transition_prairie.webm';

		// 3d

		camera = new THREE.Camera( 50, shared.baseWidth / shared.baseHeight, 1, 1000 );
		camera.position.z = 200;

		scene = new THREE.Scene();

		geometry = new THREE.Plane( 480, 272, 19, 9 );

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture, depthTest: false } ) );
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

TransitionToPrairie.prototype = new SequencerItem();
TransitionToPrairie.prototype.constructor = TransitionToPrairie;
