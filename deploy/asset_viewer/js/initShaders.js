var triggerMat, depthMat, lightmapMat, animalMat;

var depthShader = depthShaderSource[ 'depthShader' ];

depthShader.uniforms = THREE.UniformsUtils.clone(depthShader.uniforms);
depthShader.uniforms[ 'aspect' ].value = aspect;
depthShader.uniforms[ 'near' ].value = near;
depthShader.uniforms[ 'far' ].value = far;

function DepthMat(){
    return new THREE.MeshShaderMaterial({
        uniforms: depthShader.uniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader,
        blending: THREE.BillboardBlending
      });
}

var lightmapShader = lightmapShaderSource[ 'lightmapShader' ];

lightmapShader.uniforms = THREE.UniformsUtils.clone(lightmapShader.uniforms);

function LightmapMat(){
  return new THREE.MeshShaderMaterial({
        uniforms: lightmapShader.uniforms,
        vertexShader: lightmapShader.vertexShader,
        fragmentShader: lightmapShader.fragmentShader,
        blending: THREE.BillboardBlending,
        wireframe: false,
        lights: true
      });
}

var triggerShader = triggerShaderSource['triggerShader'];
triggerShader.effectors = [ 0, 200, 0, 0, 100000, 0 ];

triggerShader.uniforms = THREE.UniformsUtils.clone(triggerShader.uniforms);
triggerShader.uniforms['effectors'].value = triggerShader.effectors;

function TriggerMat(){
  return new THREE.MeshShaderMaterial( {
        uniforms: triggerShader.uniforms,
        vertexShader: triggerShader.vertexShader,
        fragmentShader: triggerShader.fragmentShader,
        shading: THREE.FlatShading,
        lights: true,
        morphTargets: true,
        vertexColors: 1,
        wireframe: false
      });
}

var animalShader = AnimalShader;
animalShader.uniforms = THREE.UniformsUtils.clone(AnimalShader.uniforms);

function AnimalMat(attributes){

  if (attributes) attributes = animalShader.attributes();
  else attributes = {};

  return new THREE.MeshShaderMaterial( {
				uniforms: animalShader.uniforms,
				attributes: attributes,
				vertexShader: animalShader.vertexShader,
				fragmentShader: animalShader.fragmentShader,
				lights: true,
				morphTargets: true,
        wireframe: false
      });
}

function updateShaders(){
    lightmapShader.uniforms['enableTexture'].value = params.texture;
    lightmapShader.uniforms['enableLights'].value = params.lighting;
    lightmapShader.uniforms['shaderDebug'].value = params.component;
    lightmapShader.uniforms['near'].value = near;
    lightmapShader.uniforms['far'].value = far;

    triggerShader.uniforms['enableTexture'].value = params.texture;
    triggerShader.uniforms['enableLights'].value = params.lighting;
    triggerShader.uniforms['shaderDebug'].value = params.component;
    triggerShader.uniforms['near'].value = near;
    triggerShader.uniforms['far'].value = far;

    animalShader.uniforms['enableTexture'].value = params.texture;
    animalShader.uniforms['enableLights'].value = params.lighting;
    animalShader.uniforms['shaderDebug'].value = params.component;
    animalShader.uniforms['near'].value = near;
    animalShader.uniforms['far'].value = far;


    animalShader.uniforms['enableTexture'].value = params.texture;
    animalShader.uniforms['enableLights'].value = params.lighting;
    animalShader.uniforms['shaderDebug'].value = params.component;
    animalShader.uniforms['near'].value = near;
    animalShader.uniforms['far'].value = far;
}