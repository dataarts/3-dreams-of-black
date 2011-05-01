if (! Detector.webgl) Detector.addGetWebGLMessage();

var loader;

var effector;
var cameraDistance = 300;
var cameraTarget = new THREE.Vector3(0, 0, 0);

var light = [];

var rootY, rootZ, plane;

window.onload = function(){
  initRenderer();
  initGui();
  initModels();
  makeScene();
  initMouse();
  animate();
}

function makeScene(){
  scene = new THREE.Scene();
  rootY = new THREE.Object3D();
  rootZ = new THREE.Object3D();
  scene.addObject(rootZ);
  rootZ.addChild(rootY);

  light[0] = new THREE.AmbientLight( 0xffffff );
  light[0].color.setHSV( 0.7,  0.0, 0.5 );

  light[1] = new THREE.DirectionalLight( 0xffffff );
  light[1].position.set( 0.4,  0.7, -0.6 );
  light[1].color.setHSV( 0.45, 0.2,  0.78 );
  light[1].castShadow = true;

  light[2] = new THREE.DirectionalLight( 0xffffff );
  light[2].position.set( -0.8,  0.8,  0.9 );
  light[2].color.setHSV( 0,  0, 0.5 );
  light[2].castShadow = false;

  scene.addLight( light[0] );
  scene.addLight( light[1] );
  scene.addLight( light[2] );

  //gound plane
  wireMat = new THREE.MeshBasicMaterial({blending: THREE.BillboardBlending, color:0x000000, lighting:false, opacity:0.2, wireframe: true });
  plane = new THREE.Mesh(new THREE.Plane(1000, 1000, 10, 10), wireMat);
  plane.rotation.x = -Math.PI / 2;

  rootY.addChild(plane);
}