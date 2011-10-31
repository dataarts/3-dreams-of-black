var Clouds = function ( shared, isRelaunch ) {

	// Clouds

	var boid, bird;
	var birds = [];
	var boids = [];
	var morphObject = [];

	var mouse = { x: 0, y: 0 }, vector = { x: 0, y: 0, z: 0 }, delta, time, oldTime = start_time = new Date().getTime(),
	camera, postCamera, scene, postScene, birdsScene, renderer, context, birdsGroup, mesh, mesh2, geometry, fog, material, postMaterial, renderTargetClouds, renderTargetFlamingos,
	wantedCameraUpX = 0;

	fog = new THREE.Fog( 0x5299d1, - 100, 3000 );

	camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 6000;

	scene = new THREE.Scene();
	birdsScene = new THREE.Scene();
	birdsGroup = new THREE.Object3D();

	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( '/files/cloud256.png', null, function () {

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
			if(isRelaunch) {
				plane.position.y = - Math.random() * Math.random() * 200 + 25;
			} else {
				plane.position.y = - Math.random() * Math.random() * 200 - 15;
			}
			plane.position.z = i;
			plane.rotation.z = Math.random() * Math.PI;
			plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

			GeometryUtils.merge( geometry, plane );

		}

    mesh = new THREE.Mesh( geometry, material );
    mesh2 = new THREE.Mesh( geometry, material );

    var loader = new THREE.JSONLoaderAjax();
    loader.load( { model: "/files/models/soup/birds_B_life.js", callback: makeScene } );

	} );

	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	renderer = new THREE.WebGLRenderer({ antialias: false, clearColor: 0x000000, clearAlpha: 0 });
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.left = '0px';
	renderer.domElement.style.top = '0px';
	context = renderer.getContext();

	renderer.sortObjects = false;
	renderer.autoClear = false;
	renderTargetClouds = new THREE.WebGLRenderTarget( 512, 512, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
	renderTargetFlamingos = new THREE.WebGLRenderTarget( 1024, 512, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
	renderTargetClouds.depthBuffer = false;
	renderTargetClouds.stencilBuffer = false;
	renderTargetFlamingos.depthBuffer = false;
	renderTargetFlamingos.stencilBuffer = false;

	window.renderTargetClouds = renderTargetClouds;
	postCamera = new THREE.Camera();
	postCamera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	postScene = new THREE.Scene();

	var postUniforms = {
	"tClouds": { type: "t", value: 0, texture: renderTargetClouds },
	"tFlamingos": { type: "t", value: 1, texture: renderTargetFlamingos },
	"width": { type: "f", value: window.innerWidth },
	"height": { type: "f", value: window.innerHeight },
	"fogColor" : {type: "c", value: fog.color}
	};

	postMaterial = new THREE.MeshShaderMaterial( {
        uniforms: postUniforms,
        vertexShader: [
          "varying vec2 vUv;",

          "void main() {",
              "vUv = vec2( uv.x, 1.0 - uv.y );",
              "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
          "}"

        ].join("\n"),

        fragmentShader: [
          "uniform sampler2D tClouds;",
          "uniform sampler2D tFlamingos;",
          "uniform vec3 fogColor;",
          "uniform float width;",
          "uniform float height;",
          "varying vec2 vUv;",

          "void main() {",
              "vec4 flamingos = vec4(0.);",
              "if (vUv.y > 0.5) {",
                  "flamingos += texture2D( tFlamingos, vUv );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(1./width,0.) );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(.0,1./height) );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(1./width,1./height) );",
                  "flamingos *= 1./4.;",
                  "flamingos.rgb = mix(flamingos.rgb, vec3(fogColor), 0.15*flamingos.a);",
              "}",

              "vec4 clouds = texture2D( tClouds, vUv );",
              "gl_FragColor = mix(flamingos, clouds, clouds.a);",
              "gl_FragColor.rgb *= 1./gl_FragColor.a;",

          "}"

        ].join("\n")
      } );
	postScene.addObject( new THREE.Mesh( new THREE.Plane( window.innerWidth, window.innerHeight ), postMaterial ) );


	function onMouseMove () {
		if(!isRelaunch) {
			mouse.x = ( shared.mouse.x / shared.screenWidth ) * 100 - 50;
			mouse.y = ( shared.mouse.y / shared.screenHeight ) * 60 - 30;
			vector = new THREE.Vector3( shared.mouse.x - shared.screenWidth/2, - shared.mouse.y + shared.screenHeight/2, 0 );
		}
	}

	function makeScene(geometry) {

    for ( var i = 0; i < 2; i ++ ) {
      /////Boids
      boid = boids[ i ] = new Boid();
      boid.position.x = 320;
      boid.position.y = 20 + Math.random() * 10;
      boid.position.z = 200 + Math.random();
      boid.velocity.x = Math.random() * 2 - 1;
      boid.velocity.y = Math.random() * 2 - 1;
      boid.velocity.z = Math.random() * 2 - 1;
      boid.setAvoidWalls( true );
      boid.setWorldSize( 1000, 200, 400 );

      /////Birds
      morphObject[i] = new ROME.Animal( geometry, true );
      morphObject[i].timeOffset = Math.random()*100;
      bird = birds[i] = morphObject[i].mesh;
      bird.phase = Math.floor( Math.random() * 62.8);
      bird.rotation.set( 0, -0.5, 0 );
      bird.updateMatrix();
      bird.update();

      window.morphObject = morphObject[i];

      var nameA = morphObject[i].availableAnimals[ 0 ],
          nameB = morphObject[i].availableAnimals[ 0 ];

      morphObject[i].play( nameA, nameB );

      bird.position = boids[ i ].position;

      bird.doubleSided = false;
      bird.scale.x = bird.scale.y = bird.scale.z = 0.03+0.05*Math.random();
      birdsGroup.addChild( bird );
    }

    //Adding clouds
		mesh.position.z = - 4000;
		scene.addObject( mesh );

    mesh2.position.z = 0;
    scene.addObject( mesh2 );

    birdsScene.addObject( birdsGroup );
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

		renderer.domElement.style.width = width + 'px';
		renderer.domElement.style.height = height + 'px';

	};

	this.update = function () {

		position = ( ( new Date().getTime() - start_time ) * 0.03 ) % 4000;
		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		camera.position.x += (  mouse.x - camera.position.x ) * 0.009;
		camera.position.y += ( -mouse.y - camera.position.y ) * 0.009;
		camera.position.z = - position + 4000;
		birdsGroup.position.z = camera.position.z - 500;
		birdsGroup.position.y = - 50;

		/*
		wantedCameraUpX = Math.min( Math.max( -0.3, ( mouse.x - camera.position.x ) * 0.005 ), 0.3 );
		camera.up.x += ( wantedCameraUpX - camera.up.x ) * 0.005;
		camera.up.normalize();
		*/

		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.clear();

		renderer.render( scene, camera, renderTargetClouds, true );
		renderer.render( birdsScene, camera, renderTargetFlamingos, true );

		renderer.render( postScene, postCamera );

		// render.render( scene, camera );

		for ( var i = 0, il = birds.length; i < il; i++ ) {

			boid = boids[ i ];

			vector.z = boid.position.z;

			//boid.repulse( vector );

			boid.run( boids );
			bird = birds[ i ];

			bird.rotation.y = (Math.atan2( - boid.velocity.z, boid.velocity.x )+Math.PI/2);
			bird.rotation.z = (Math.asin( boid.velocity.y / boid.velocity.length()));

			bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;

			morphObject[i].update(delta*bird.phase/100);
		}

	};

};

var Boid = function() {

  var vector = new THREE.Vector3(),
  _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 3000,
  _maxSpeed = 0.6, _maxSteerForce = 0.03, _avoidWalls = false;

  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function ( target ) {

    _goal = target;

  };

  this.setAvoidWalls = function ( value ) {

    _avoidWalls = value;

  };

  this.setWorldSize = function ( width, height, depth ) {

    _width = width;
    _height = height;
    _depth = depth;

  };

  this.run = function ( boids ) {

    if ( _avoidWalls ) {

      vector.set( - _width*15, this.position.y, this.position.z );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

      vector.set( _width, this.position.y, this.position.z );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

      vector.set( this.position.x, 0, this.position.z );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

      vector.set( this.position.x, _height, this.position.z );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

      vector.set( this.position.x, this.position.y, - _depth );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

      vector.set( this.position.x, this.position.y, _depth );
      vector = this.avoid( vector );
      vector.multiplyScalar( 5 );
      _acceleration.addSelf( vector );

    }/* else {

      this.checkBounds();

    }
    */

    if ( Math.random() > 0.5 ) {

      this.flock( boids );

    }

    this.move();

  };

  this.flock = function ( boids ) {

    if ( _goal ) {

      _acceleration.addSelf( this.reach( _goal, 0.005 ) );

    }

    _acceleration.addSelf( this.alignment( boids ) );
    _acceleration.addSelf( this.cohesion( boids ) );
    _acceleration.addSelf( this.separation( boids ) );

  };

  this.move = function () {

    this.velocity.addSelf( _acceleration );

    var l = this.velocity.length();

    if ( l > _maxSpeed ) {

      this.velocity.divideScalar( l / _maxSpeed );

    }

    this.position.addSelf( this.velocity );
    _acceleration.set( 0, 0, 0 );

  };

  this.checkBounds = function () {

    if ( this.position.x >   _width ) this.position.x = - _width;
    if ( this.position.x < - _width ) this.position.x =   _width;
    if ( this.position.y >   _height ) this.position.y = - _height;
    if ( this.position.y < - _height ) this.position.y =  _height;
    if ( this.position.z >  _depth ) this.position.z = - _depth;
    if ( this.position.z < - _depth ) this.position.z =  _depth;

  };

  //

  this.avoid = function ( target ) {

    var steer = new THREE.Vector3();

    steer.copy( this.position );
    steer.subSelf( target );

    steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

    return steer;

  };

  this.repulse = function ( target ) {

    var distance = this.position.distanceTo( target );

    if ( distance < 150 ) {

      var steer = new THREE.Vector3();

      steer.sub( this.position, target );
      steer.multiplyScalar( 0.5 / distance );

      _acceleration.addSelf( steer );

    }

  };

  this.reach = function ( target, amount ) {

    var steer = new THREE.Vector3();

    steer.sub( target, this.position );
    steer.multiplyScalar( amount );

    return steer;

  };

  this.alignment = function ( boids ) {

    var boid, velSum = new THREE.Vector3(),
    count = 0;

    for ( var i = 0, il = boids.length; i < il; i++ ) {

      if ( Math.random() > 0.6 ) continue;

      boid = boids[ i ];

      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _neighborhoodRadius ) {

        velSum.addSelf( boid.velocity );
        count++;

      }

    }

    if ( count > 0 ) {

      velSum.divideScalar( count );

      var l = velSum.length();

      if ( l > _maxSteerForce ) {

        velSum.divideScalar( l / _maxSteerForce );

      }

    }

    return velSum;

  };

  this.cohesion = function ( boids ) {

    var boid, distance,
    posSum = new THREE.Vector3(),
    steer = new THREE.Vector3(),
    count = 0;

    for ( var i = 0, il = boids.length; i < il; i ++ ) {

      if ( Math.random() > 0.6 ) continue;

      boid = boids[ i ];
      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _neighborhoodRadius ) {

        posSum.addSelf( boid.position );
        count++;

      }

    }

    if ( count > 0 ) {

      posSum.divideScalar( count );

    }

    steer.sub( posSum, this.position );

    var l = steer.length();

    if ( l > _maxSteerForce ) {

      steer.divideScalar( l / _maxSteerForce );

    }

    return steer;

  };

  this.separation = function ( boids ) {

    var boid, distance,
    posSum = new THREE.Vector3(),
    repulse = new THREE.Vector3();

    for ( var i = 0, il = boids.length; i < il; i ++ ) {

      if ( Math.random() > 0.6 ) continue;

      boid = boids[ i ];
      distance = boid.position.distanceTo( this.position );

      if ( distance > 0 && distance <= _neighborhoodRadius ) {

        repulse.sub( this.position, boid.position );
        repulse.normalize();
        repulse.divideScalar( distance );
        posSum.addSelf( repulse );

      }

    }

    return posSum;

  }

};
