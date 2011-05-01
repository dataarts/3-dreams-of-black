var Clouds = function ( shared ) {

  var mouse = { x: 0, y: 0 }, vector = { x: 0, y: 0, z: 0}, delta, time, oldTime = start_time = new Date().getTime(),
	camera, scene, renderer, mesh, mesh2, geometry, material;

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	scene = new THREE.Scene();

	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( '../errors/files/cloud256.png', null, function () {

		var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

		material = new THREE.MeshShaderMaterial( {

			uniforms: {

				"map": { type: "t", value:2, texture: texture },
				"fogColor" : { type: "c", value: fog.color },
				"fogNear" : { type: "f", value: fog.near },
				"fogFar" : { type: "f", value: fog.far }

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

		for ( var i = 0; i < 4000; i++ ) {

			plane.position.x = Math.random() * 1000 - 500;
			plane.position.y = - Math.random() * Math.random() * 200 + 25;
			plane.position.z = i;
			plane.rotation.z = Math.random() * Math.PI;
			plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

			GeometryUtils.merge( geometry, plane );

		}

    mesh = new THREE.Mesh( geometry, material );
    mesh2 = new THREE.Mesh( geometry, material );
    
    makeScene();
	} );

	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	renderer = new THREE.WebGLRenderer();
  renderer.domElement.style.position = 'absolute';
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	renderer.autoClear = true;
  renderer.clearColor = 0xff0000;
  renderer.clearAlpha = 1.0;

	function onMouseMove () {

		mouse.x = ( shared.mouse.x / shared.screenWidth ) * 100 - 50;
		mouse.y = ( shared.mouse.y / shared.screenHeight ) * 100 - 50;
    vector = new THREE.Vector3( shared.mouse.x - shared.screenWidth/2, - shared.mouse.y + shared.screenHeight/2, 0 );
	}

  function makeScene(){

    //Adding clouds
		mesh.position.z = - 4000;
		scene.addObject( mesh );

    mesh2.position.z = 0;
    scene.addObject( mesh2 );
  }

	this.getDomElement = function () {

		return renderer.domElement;

	};

	this.show = function () {

		shared.signals.mousemoved.add( onMouseMove );

	};

	this.hide = function () {

		shared.signals.mousemoved.remove( onMouseMove );

	};

	this.resize = function ( width, height ) {

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );

	};

	this.update = function () {

		position = ( ( new Date().getTime() - start_time ) * 0.03 ) % 4000;
    time = new Date().getTime();
    delta = time - oldTime;
    oldTime = time;
    
		camera.position.x += ( mouse.x - camera.target.position.x ) * 0.01;
		camera.position.y += ( - mouse.y - camera.target.position.y ) * 0.01;
		camera.position.z = - position + 4000;

		camera.target.position.x =  camera.position.x;
		camera.target.position.y = camera.position.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.clear();
		renderer.render( scene, camera );
	};

};