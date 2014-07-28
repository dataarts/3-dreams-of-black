var camera, scene, skyScene, stats, renderer, postRenderer, container, gl;
var postprocessing = {};

var width = 970;
var height = 540;
var near = 10;
var far = 10000;
var aspect = width/height;

function initRenderer() {

  container = document.createElement('div');
  container.id = "viewerCanvas";

  document.getElementById('canvasHolder').appendChild(container);

  camera = new THREE.Camera(45, aspect, near, far);

  camera.position = new THREE.Vector3(-cameraDistance, 0, 0);
  camera.target.position = cameraTarget;

  renderer = new THREE.WebGLRenderer({ antialias: false, clearColor: 0x000000, clearAlpha: 0 });
  renderer.setSize(width, height);
  gl = renderer.getContext();

  renderer.autoClear = false;

  container.appendChild(renderer.domElement);

 stats = new Stats();
 stats.domElement.style.position = 'fixed';
 stats.domElement.style.right = '0px';
 stats.domElement.style.top = '0px';
 container.appendChild( stats.domElement );

  initPostprocessingNoise(postprocessing);
}

function initPostprocessingNoise( effect ) {

    effect.type = "noise";

    effect.scene = new THREE.Scene();

    effect.camera = new THREE.Camera();
    effect.camera.projectionMatrix = THREE.Matrix4.makeOrtho( width / - 2, width / 2, height / 2, height / - 2, -10000, 10000 );
    effect.textureColor = new THREE.WebGLRenderTarget( width*2, height*2, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
    effect.textureDepth = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } );
    effect.textureNormal = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } );
    effect.textureNoise = THREE.ImageUtils.loadTexture( '/asset_viewer/files/textures/noise.png', { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
    effect.textureNoise.minFilter = THREE.NearestFilter;
    effect.textureNoise.wrapS = THREE.RepeatWrapping;
    effect.textureNoise.wrapT = THREE.RepeatWrapping;
    var heatUniforms = {
    "time": { type: "f", value: 0 },
    "samplerSphere": { type: "fv", value: [0.000000,0.000000,-1.000000,0.000000,0.525731,-0.850651,0.500000,0.162460,-0.850651,0.000000,0.894427,-0.447213,0.500000,0.688191,-0.525731,0.850651,0.276394,-0.447213,0.309017,-0.425325,-0.850651,0.809017,-0.262865,-0.525731,0.525731,-0.723607,-0.447213,-0.309017,-0.425325,-0.850651,0.000000,-0.850651,-0.525731,-0.525731,-0.723607,-0.447213,-0.500000,0.162460,-0.850651,-0.809017,-0.262865,-0.525731,-0.850651,0.276394,-0.447213,-0.500000,0.688191,-0.525731,-0.309017,0.951057,0.000000,-0.809017,0.587785,0.000000,-0.525731,0.723607,0.447213,-1.000000,0.000000,0.000000,-0.809017,-0.587785,0.000000,-0.850651,-0.276394,0.447213,-0.309017,-0.951057,0.000000,0.309017,-0.951057,0.000000,0.000000,-0.894427,0.447213,0.809017,-0.587785,0.000000,1.000000,0.000000,0.000000,0.850651,-0.276394,0.447213,0.809017,0.587785,0.000000,0.309017,0.951057,0.000000,0.525731,0.723607,0.447213,0.000000,0.850651,0.525731,-0.809017,0.262865,0.525731,-0.500000,-0.688191,0.525731,0.500000,-0.688191,0.525731,0.809017,0.262865,0.525731,0.000000,0.000000,1.000000,0.309017,0.425325,0.850651,-0.309017,0.425325,0.850651,0.500000,-0.162460,0.850651,0.000000,-0.525731,0.850651,-0.500000,-0.162460,0.850651]},
    "samplerBokehHex": { type: "fv", value: [0.500000,0.000000,0.866025,0.166667,0.000000,0.866025,-0.166667,0.000000,0.866025,-0.500000,0.000000,0.866025,-0.666667,0.000000,0.577350,-0.833333,0.000000,0.288675,-1.000000,0.000000,0.000000,-0.833333,0.000000,-0.288675,-0.666667,0.000000,-0.577350,-0.500000,0.000000,-0.866025,-0.166667,0.000000,-0.866025,0.166667,0.000000,-0.866025,0.500000,0.000000,-0.866025,0.666667,0.000000,-0.577350,0.833333,0.000000,-0.288675,1.000000,0.000000,0.000000,0.833333,0.000000,0.288675,0.666667,0.000000,0.577350]},
    "tColor": { type: "t", value: 0, texture: effect.textureColor },
    "tDepth": { type: "t", value: 1, texture: effect.textureDepth },
    "tNoise": { type: "t", value: 2, texture: effect.textureNoise },
    "tNormal": { type: "t", value: 3, texture: effect.textureNormal },
    "dof":    { type: "f", value: 1.0 },
    "ssao":    { type: "f", value: 0.0 },
    "ssaoRad":    { type: "f", value: 0.0 },
    "focus":    { type: "f", value: 0.33 },
		"aspect":   { type: "f", value: aspect },
		"aperture": { type: "f", value: 0.025 },
		"maxblur":  { type: "f", value: 1.0 },
		"vignette":  { type: "f", value: 1.0 },
    "screenWidth": { type: "f", value:width },
		"screenHeight": { type: "f", value:height },
		"vingenettingDarkening": { type: "f", value: 0.64 },
		"sampleDistance": { type: "f", value: 0.4 },
		"colorA": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
		"colorB": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
		"colorC": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

    };

    effect.materialHeat = new THREE.MeshShaderMaterial( {

        uniforms: heatUniforms,
        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = vec2( uv.x, 1.0 - uv.y );",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

        "uniform sampler2D tColor;",
        "uniform sampler2D tDepth;",
        "uniform sampler2D tNoise;",
        "uniform sampler2D tNormal;",

        "uniform float maxblur;",  	// max blur amount
        "uniform float aperture;",	// aperture - bigger values for shallower depth of field
        "uniform float dof;",
        "uniform float ssao;",
        "uniform float ssaoRad;",
        "uniform vec3 samplerBokehHex[18];",
        "uniform vec3 samplerSphere[42];",
        "uniform float focus;",
        "uniform float aspect;",
        "uniform float vignette;",

				"uniform float screenWidth;",
				"uniform float screenHeight;",
				"uniform float vingenettingDarkening;",
				"uniform float sampleDistance;",

				"varying vec2 vUv;",

				"void main() {",

					"vec4 col = texture2D( tColor, vUv.xy );",
          "if (col.a == 0.) col.rgb = vec3(0.5);",

          "vec4 normal = texture2D(tNormal, vUv);",
          "if(normal.a == 0.0) normal.xyz = vec3(0.,0.,1.);",
          "else normal.xyz = normal.xyz*2. - vec3(1.);",

          "vec4 depthRGB = texture2D(tDepth, vUv);",
          "float depth = depthRGB.r/3.+depthRGB.g/3.+depthRGB.b/3.;",
          "if(depthRGB.a == 0.0) depth = 1.;",

          "vec3 rndVec = texture2D( tNoise, vUv*vec2(30.0+depth,30.0-depth) ).rgb;",

          "float ao = (1.0);",
          "vec3 rndUv = vec3(0.0);",

          "if (ssao == 1.0 && depth != 1.) {",

            "ao = 0.0;",
            "for( int i=1; i<42; i++ ){",
              "rndUv = vec3(vUv,depth) + ssaoRad*reflect(samplerSphere[i].xyz,normal.xyz);",

              "vec4 rndDepthRGB = texture2D(tDepth,rndUv.xy);",
              "float rndDepth = rndDepthRGB.r/3.+rndDepthRGB.g/3.+rndDepthRGB.b/3.;",
              "if(rndDepthRGB.a == 0.0) rndDepth = 1.;",

              "float zd = (rndUv.z-rndDepth);",
              "zd = max(min(zd-0.02,0.1-zd), 0.0);",
              "ao += 1./(1.+10000.*(sqrt(10.*zd)));",
            "}",
            "ao = ao/42.0;",
            "gl_FragColor = vec4(col.rgb*ao,col.a);",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",

          "} else if (dof == 1.0) {",

            "col = vec4(0.);",
            "vec2 aspectcorrect = vec2( 1.0, aspect );",
            "float factor = depth - focus;",
            "vec2 dofblur = vec2( clamp( factor * aperture, -maxblur, maxblur ) );",
            "for( int i=1; i<18; i++ ){",
              "rndUv.xy = vUv + (dofblur*samplerBokehHex[i].xz*aspectcorrect);",
              "col += texture2D( tColor, rndUv.xy );",
            "}",
            "gl_FragColor = col/18.;",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",

          "} else {",

            "gl_FragColor = texture2D( tColor, vUv );",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",

          "}",

          "if (vignette == 1.){",

            "gl_FragColor = vec4( mix(gl_FragColor.rgb, - vec3( vingenettingDarkening ), vec3( dot( (vUv - vec2(0.5)), (vUv - vec2(0.5)) ))), 1.0 );",
					  "gl_FragColor = vec4(1.0) - (vec4(1.0) - gl_FragColor) * (vec4(1.0) - gl_FragColor);",

          "}",
          //"gl_FragColor = vec4(rndVec,1.);",
				"}"

            ].join("\n")

    } );

    effect.quad = new THREE.Mesh( new THREE.Plane( width, height ), effect.materialHeat );
    effect.scene.addObject( effect.quad );

}

function render(){

//	if (document.body.scrollTop > 1794 || document.body.scrollTop + window.innerHeight < 1142) {
//
//		return;
//	}
	
    renderer.clear();

    lightmapShader.uniforms['shaderDebug'].value = params.component;
    triggerShader.uniforms['shaderDebug'].value = params.component;
    animalShader.uniforms['shaderDebug'].value = params.component;
    wireMat.opacity = 0.3*params.grid;

    renderer.render( sceneSky, camera, postprocessing.textureColor, true );
    gl.clearDepth(true);// bug in three.js ??
    gl.clear(gl.DEPTH_BUFFER_BIT);
    renderer.render( scene, camera, postprocessing.textureColor, false );


    lightmapShader.uniforms['shaderDebug'].value = 3;
    triggerShader.uniforms['shaderDebug'].value = 3;
    animalShader.uniforms['shaderDebug'].value = 3;   
    wireMat.opacity = 0.0;
    renderer.render( scene, camera, postprocessing.textureDepth, true );

    lightmapShader.uniforms['shaderDebug'].value = 2;
    triggerShader.uniforms['shaderDebug'].value = 2;
    animalShader.uniforms['shaderDebug'].value = 2;
    wireMat.opacity = 0.0;
    renderer.render( scene, camera, postprocessing.textureNormal, true );

    postprocessing.materialHeat.uniforms.ssao.value = params.occlusion;
    postprocessing.materialHeat.uniforms.ssaoRad.value = params.radius;
    postprocessing.materialHeat.uniforms.aperture.value = params.aperture;
    postprocessing.materialHeat.uniforms.dof.value = params.depth_of_field;
    postprocessing.materialHeat.uniforms.vignette.value = params.vignette;
    postprocessing.materialHeat.uniforms.focus.value = params.focus;

    postprocessing.materialHeat.uniforms.time.value += 0.01 * delta;
    postprocessing.quad.materials[ 0 ] = postprocessing.materialHeat;
    postprocessing.materialHeat.uniforms.tColor.texture = postprocessing.textureColor;
    postprocessing.materialHeat.uniforms.tDepth.texture = postprocessing.textureDepth;
    postprocessing.materialHeat.uniforms.tNoise.texture = postprocessing.textureNoise;
    postprocessing.materialHeat.uniforms.tNormal.texture = postprocessing.textureNormal;
    renderer.render( postprocessing.scene, postprocessing.camera );

//    stats.update();
    updateCamera();
}

function updateCamera(){
    near = 100;//(-camera.position.x) - Math.max(meshRadius+100, 1000);
    var negNear = Math.min(0,near);
    near = Math.max(1,near);
    far = (-camera.position.x) + Math.max(meshRadius+100, 1000)-negNear;
    camera.projectionMatrix = THREE.Matrix4.makePerspective(45, aspect, near, far);
}
