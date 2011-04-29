var CloudsWorld = function ( shared ) {

	/*
	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = window.innerHeight;

	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop(0, "#1e4877");
	gradient.addColorStop(0.5, "#4584b4");

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	document.body.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
	*/

	// Clouds

	var domElement;
	var camera, scene, renderer, sky, mesh, geometry, material,
	i, h, color, colors = [], sprite, size, x, y, z;

	var mouse = { x: 0, y: 0 };
	var start_time = new Date().getTime();

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	//

	domElement = document.createElement( 'div' );

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	scene = new THREE.Scene();

	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'files/cloud256.png', null, function () {

		var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

		material = new THREE.MeshShaderMaterial( {

			uniforms: {

				"map": { type: "t", value:2, texture: texture },
				"fogColor" : { type: "c", value: fog.color },
				"fogNear" : { type: "f", value: fog.near },
				"fogFar" : { type: "f", value: fog.far },

			},
			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D map;",

				"uniform vec3 fogColor;",
				"uniform float fogNear;",
				"uniform float fogFar;",

				"varying vec2 vUv;",

				"void main() {",

					"float depth = gl_FragCoord.z / gl_FragCoord.w;",
					"float fogFactor = smoothstep( fogNear, fogFar, depth );",

					"gl_FragColor = texture2D( map, vUv );",
					"gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );",
					"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

				"}"

			].join("\n"),

			depthTest: false

		} );

		var plane = new THREE.Mesh( new THREE.Plane( 64, 64 ) );

		for ( i = 0; i < 4000; i++ ) {

			plane.position.x = Math.random() * 1000 - 500;
			plane.position.y = - Math.random() * Math.random() * 200 - 15;
			plane.position.z = i;
			plane.rotation.z = Math.random() * Math.PI;
			plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

			GeometryUtils.merge( geometry, plane );

		}

		mesh = new THREE.Mesh( geometry, material );
		scene.addObject( mesh );

		mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = - 4000;
		scene.addObject( mesh );

	} );

	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	domElement.appendChild( renderer.domElement );

	shared.signals.mousemoved.add( function () {

		shared.signals.mousemoved.add( function () {

			mouse.x = ( shared.mouse.x / shared.screenWidth ) * 100 - 50;
			mouse.y = ( shared.mouse.y / shared.screenHeight ) * 100 - 50;

		} );

	} );

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

		position = ( ( new Date().getTime() - start_time ) * 0.03 ) % 4000;

		camera.position.x += ( mouse.x - camera.target.position.x ) * 0.01;
		camera.position.y += ( - mouse.y - camera.target.position.y ) * 0.01;
		camera.position.z = - position + 4000;

		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	}

}
