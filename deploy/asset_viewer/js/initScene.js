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
};

function makeScene()  {
  scene = new THREE.Scene();
  sceneSky = new THREE.Scene();
  rootY = new THREE.Object3D();
  rootZ = new THREE.Object3D();
  scene.addObject(rootZ);
  rootZ.addChild(rootY);

  light[0] = new THREE.AmbientLight( 0x608090 );

  light[1] = new THREE.DirectionalLight( 0xffcc99, 0.6 );
  light[1].position.set( 0, 2, 1 );

  light[2] = new THREE.DirectionalLight( 0xffffff, 1 );
  light[2].position.set( -1, 0, 0.5 );

  scene.addLight( light[0] );
  scene.addLight( light[1] );
  //scene.addLight( light[2] );

  //gound plane
  wireMat = new THREE.MeshBasicMaterial({blending: THREE.BillboardBlending, color:0x222222, lighting:false, opacity:0.5, wireframe: true });
  skyMat = new THREE.MeshBasicMaterial({blending: THREE.BillboardBlending, color:0xcccccc, lighting:false, opacity:1, wireframe: false });
  plane = new THREE.Mesh(new THREE.Plane(1000, 1000, 10, 10), wireMat);
  sky = new THREE.Mesh(new THREE.Sphere(200, 32, 32), skyMat);
  skyMat.color.setRGB(params.background,params.background,params.background);
  sky.flipSided = true;
  plane.rotation.x = -Math.PI / 2;

  sceneSky.addChild(sky);
  rootY.addChild(plane);
}