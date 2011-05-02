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
    effect.textureColor = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } );
    effect.textureDepth = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } );
    effect.textureNoise = THREE.ImageUtils.loadTexture( 'files/textures/noise.png', { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    effect.textureNoise.minFilter = THREE.NearestFilter;
    effect.textureNoise.wrapS = THREE.RepeatWrapping;
     effect.textureNoise.wrapT = THREE.RepeatWrapping;
    var heatUniforms = {
    "time": { type: "f", value: 0 },
    "sphere": { type: "fv", value: [0.000000,0.000000,-1.000000,0.000000,0.525731,-0.850651,0.500000,0.162460,-0.850651,0.000000,0.894427,-0.447213,0.500000,0.688191,-0.525731,0.850651,0.276394,-0.447213,0.309017,-0.425325,-0.850651,0.809017,-0.262865,-0.525731,0.525731,-0.723607,-0.447213,-0.309017,-0.425325,-0.850651,0.000000,-0.850651,-0.525731,-0.525731,-0.723607,-0.447213,-0.500000,0.162460,-0.850651,-0.809017,-0.262865,-0.525731,-0.850651,0.276394,-0.447213,-0.500000,0.688191,-0.525731,-0.309017,0.951057,0.000000,-0.809017,0.587785,0.000000,-0.525731,0.723607,0.447213,-1.000000,0.000000,0.000000,-0.809017,-0.587785,0.000000,-0.850651,-0.276394,0.447213,-0.309017,-0.951057,0.000000,0.309017,-0.951057,0.000000,0.000000,-0.894427,0.447213,0.809017,-0.587785,0.000000,1.000000,0.000000,0.000000,0.850651,-0.276394,0.447213,0.809017,0.587785,0.000000,0.309017,0.951057,0.000000,0.525731,0.723607,0.447213,0.000000,0.850651,0.525731,-0.809017,0.262865,0.525731,-0.500000,-0.688191,0.525731,0.500000,-0.688191,0.525731,0.809017,0.262865,0.525731,0.000000,0.000000,1.000000,0.309017,0.425325,0.850651,-0.309017,0.425325,0.850651,0.500000,-0.162460,0.850651,0.000000,-0.525731,0.850651,-0.500000,-0.162460,0.850651]},
    "tColor": { type: "t", value: 0, texture: effect.textureColor },
    "tDepth": { type: "t", value: 1, texture: effect.textureDepth },
    "tNoise": { type: "t", value: 2, texture: effect.textureNoise },
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

        "uniform float maxblur;",  	// max blur amount
        "uniform float aperture;",	// aperture - bigger values for shallower depth of field
        "uniform float dof;",
        "uniform float ssao;",
        "uniform float ssaoRad;",
        "uniform vec3 sphere[12];",
        "uniform float focus;",
        "uniform float aspect;",

				"varying vec2 vUv;",

				"void main() {",

          "vec4 color = texture2D( tColor, vUv.xy );",
          "vec4 depthRGB = texture2D(tDepth, vUv);",
          "float depth = depthRGB.r/3.+depthRGB.g/3.+depthRGB.b/3.;",
          "if (color.a == 0.0) depth = 1.0;",
          "vec2 aspectcorrect = vec2( 1.0, aspect );",
          "float ssaoWeight = 1.0;",

          "if (ssao == 1.0) {",
            "vec4 rndVec = texture2D( tNoise, vUv*vec2(200.,200.)*vec2(depth,-depth));",
            "for( int i=1; i<12; i++ ){",
              "vec3 rndUv = vec3(vUv,depth) + ssaoRad*reflect(sphere[i].xyz,rndVec.xyz);",
              //"vec3 rndUv = vec3(vUv,depth) + ssaoRad*sphere[i].xyz;",
              "vec3 rndDepthRGB = texture2D(tDepth,rndUv.xy).rgb;",
              "float rndDepth = rndDepthRGB.r/3.+rndDepthRGB.g/3.+rndDepthRGB.b/3.;",

              "float depthDelta = (rndUv.z-rndDepth);",

              "depthDelta = max(min(depthDelta-0.08,0.2-depthDelta), 0.0);",

              //"depthDelta = max(min(depthDelta-0.01,0.1-depthDelta), 0.0);",


//              "vec3 se = vec3(vUv,ez) + ssaoRad*reflect(sphere[i].xyz,pl.xyz);",
//
//              "float sz = texture2D(tDepth,se.xy).r;",
//              "float zd = (se.z-sz);",
//              "zd = max(min(zd-0.06,0.22-zd), 0.0);",

               "ssaoWeight += 1.0/(1.0+7000.0*depthDelta*depthDelta);",
            "}",
            "ssaoWeight = ssaoWeight/12.0;",
          "}",

          "if (dof == 1.0) {",
            
            "float factor = depth - focus;",

            "vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );",

            "vec2 dofblur9 = dofblur * 0.9;",
            "vec2 dofblur7 = dofblur * 0.7;",
            "vec2 dofblur4 = dofblur * 0.4;",

            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );",

            "color += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",

            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );",

            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
            "color += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );",

            "color = color / 41.0;",
          "} else {",
            //ANTIALIASING
            "color = texture2D( tColor, vUv );",
            "color += texture2D( tColor, vUv+vec2(.5/960.,0.) );",
            "color += texture2D( tColor, vUv+vec2(.0,.5/360.) );",
            "color += texture2D( tColor, vUv+vec2(.5/960.,.5/360.) );",
            "color *= 0.25;",
          "}",
          "gl_FragColor = vec4(vec3(ssaoWeight),1.0);",
          //"gl_FragColor = vec4(vec3(depth),1.0);",
				"}"

            ].join("\n")

    } );

    effect.quad = new THREE.Mesh( new THREE.Plane( width, height ), effect.materialHeat );
    effect.scene.addObject( effect.quad );

}

function render(){
    renderer.clear();

    wireMat.opacity = params.grid;
    lightmapShader.uniforms['shaderDebug'].value = params.shader_components;
    triggerShader.uniforms['shaderDebug'].value = params.shader_components;
    animalShader.uniforms['shaderDebug'].value = params.shader_components;


    renderer.render( scene, camera, postprocessing.textureColor, true );

    lightmapShader.uniforms['shaderDebug'].value = 3;
    triggerShader.uniforms['shaderDebug'].value = 3;
    animalShader.uniforms['shaderDebug'].value = 3;   
    wireMat.opacity = 0.0;

    renderer.render( scene, camera, postprocessing.textureDepth, true );

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
    renderer.render( postprocessing.scene, postprocessing.camera );


    updateCamera();
}

function updateCamera(){
    near = Math.max(0.1,(-camera.position.x) - Math.max(meshRadius+100, 300));
    far = (-camera.position.x) + Math.max(meshRadius+100, 550);
    camera.projectionMatrix = THREE.Matrix4.makePerspective(45, aspect, near, far);
}