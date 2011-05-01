var camera, scene, renderer, postRenderer, container;
var postprocessing = {};

var width = 960;
var height = 360;
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

  renderer.autoClear = false;

  container.appendChild(renderer.domElement);

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
    effect.textureNoise = THREE.ImageUtils.loadTexture( 'files/textures/noise.png', { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
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
    "dof":    { type: "f", value: 0.0 },
    "ssao":    { type: "f", value: 0.0 },
    "ssaoRad":    { type: "f", value: 0.0 },
    "focus":    { type: "f", value: 0.33 },
		"aspect":   { type: "f", value: aspect },
		"aperture": { type: "f", value: 0.025 },
		"maxblur":  { type: "f", value: 1.0 }
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

				"varying vec2 vUv;",

				"void main() {",

          "vec4 col = texture2D( tColor, vUv.xy );",

          "vec4 normal = texture2D(tNormal, vUv);",
          "if(normal.a == 0.0) normal.xyz = vec3(0.,0.,1.);",
          "else normal.xyz = normal.xyz*2. - vec3(1.);",

          "vec4 depthRGB = texture2D(tDepth, vUv);",
          "float depth = depthRGB.r/3.+depthRGB.g/3.+depthRGB.b/3.;",
          "if(depthRGB.a == 0.0) depth = 1.;",

          "vec3 rndVec = texture2D( tNoise, vUv*vec2(300.0,200.0) ).rgb * vec3(0.2);",
          //"rndVec = rndVec*2.0 - vec4(1.0);",

          "float ao = (1.0);",
          "vec3 rndUv = vec3(0.0);",

          "if (ssao == 1.0 && depth != 1.) {",
            "ao = 0.0;",
            "for( int i=1; i<42; i++ ){",
              "rndUv = vec3(vUv,depth) + ssaoRad*reflect(samplerSphere[i].xyz,normal.xyz);",
              //"rndUv = vec3(vUv,depth) + ssaoRad*(samplerSphere[i].xyz);",

              "vec4 rndDepthRGB = texture2D(tDepth,rndUv.xy);",
              "float rndDepth = rndDepthRGB.r/3.+rndDepthRGB.g/3.+rndDepthRGB.b/3.;",
              "if(rndDepthRGB.a == 0.0) rndDepth = 1.;",

              "float zd = (rndUv.z-rndDepth);",
              "zd = max(min(zd-0.03,0.2-zd), 0.0);",
              "ao += 1.0/(1.0+10000.0*zd*zd);",
            "}",
            "ao = ao/42.0;",
            "gl_FragColor = vec4(col.rgb*ao,col.a);",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",
          "} else if (dof == 1.0) {",
            "col = vec4(0.);",
            "vec2 aspectcorrect = vec2( 1.0, aspect );",
            "float factor = depth - focus;",
            "vec2 dofblur = vec2( clamp( factor * aperture, -maxblur, maxblur ) );",
            "float j = 1.;",
            "for( int i=1; i<18; i++ ){",
              "rndUv.xy = vUv + (dofblur*samplerBokehHex[i].xz*aspectcorrect);",
              "col += texture2D( tColor, rndUv.xy );",
            "}",
            "gl_FragColor = col/18.;",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",
          "} else {",
            //ANTIALIASING
            "gl_FragColor = texture2D( tColor, vUv );",
            // frame buffer resolution is hard coded
            "gl_FragColor += texture2D( tColor, vUv+vec2(.5/960.,0.) );",
            "gl_FragColor += texture2D( tColor, vUv+vec2(.0,.5/360.) );",
            "gl_FragColor += texture2D( tColor, vUv+vec2(.5/960.,.5/360.) );",
            "gl_FragColor *= 0.25;",
            "gl_FragColor.rgb *= 1./gl_FragColor.a;",
          "}",
				"}"

            ].join("\n")

    } );

    effect.quad = new THREE.Mesh( new THREE.Plane( width, height ), effect.materialHeat );
    effect.scene.addObject( effect.quad );

}

function render(){
    renderer.clear();

    lightmapShader.uniforms['shaderDebug'].value = params.component;
    triggerShader.uniforms['shaderDebug'].value = params.component;
    animalShader.uniforms['shaderDebug'].value = params.component;
    wireMat.opacity = .1*params.grid;
    renderer.render( scene, camera, postprocessing.textureColor, true );

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
    postprocessing.materialHeat.uniforms.dof.value = params.depth_of_field
    postprocessing.materialHeat.uniforms.focus.value = params.focus;
    postprocessing.materialHeat.uniforms.aperture.value = params.aperture;
  
    postprocessing.materialHeat.uniforms.time.value += 0.01 * delta;
    postprocessing.quad.materials[ 0 ] = postprocessing.materialHeat;
    postprocessing.materialHeat.uniforms.tColor.texture = postprocessing.textureColor;
    postprocessing.materialHeat.uniforms.tDepth.texture = postprocessing.textureDepth;
    postprocessing.materialHeat.uniforms.tNoise.texture = postprocessing.textureNoise;
    postprocessing.materialHeat.uniforms.tNormal.texture = postprocessing.textureNormal;
    renderer.render( postprocessing.scene, postprocessing.camera );


    updateCamera();
}

function updateCamera(){
    near = (-camera.position.x) - Math.max(meshRadius+100, 650);
    var negNear = Math.min(0,near);
    near = Math.max(1,near);
    far = (-camera.position.x) + Math.max(meshRadius+100, 650)-negNear;
    camera.projectionMatrix = THREE.Matrix4.makePerspective(45, aspect, near, far);
}