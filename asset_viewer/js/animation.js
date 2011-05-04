var delta, time, oldTime = new Date().getTime();

var sineTime = 0;
var drag = false;
var mouseX = 0;
var mouseY = 0;
var offsetX = 0.5;
var offsetY = 0;
var zoom = 0;
var orbitY = 0.5;
var orbitZ = 0;
var riseY = 0;
var centerY = 0;
var gridSpeed = 1;
var objRadius = 100;

var viewerModels,viewerModelsStrip;
var viewerModelsCurrentX = 0;
var viewerModelsGoalX = 0;
var stripSpeedX=0;

function initMouse(){
  document.addEventListener('mouseup', mouseUp, false);
  document.addEventListener('mousemove', mouseMove, false);
  document.getElementById('viewerCanvas').addEventListener('mousewheel', mouseWheel, false);
  document.getElementById('viewerCanvas').addEventListener('mousedown', mouseDown, false);
  document.getElementById('viewerCanvas').addEventListener('mouseout', mouseOut, false);

  viewerModelsStrip = document.getElementById('viewerModelsStrip');
  viewerModels = document.getElementById('viewerModels');
  viewerModels.addEventListener('mousemove', moveModelStrip, false);

}

function mouseOut(e) {

}
function mouseDown(e) {
  drag = true;
}
function mouseUp(e) {
  drag = false;
}
function mouseMove(e) {
  var currentX = (event.clientX - container.offsetLeft - width / 2) / width * 2
  var currentY = (event.clientY - container.offsetTop - height / 2) / height * 2
  var deltaX = mouseX - currentX;
  var deltaY = mouseY - currentY;
  if (drag) {
    offsetX -= deltaX;
    offsetY -= deltaY;
  }
  mouseX = currentX;
  mouseY = currentY;
}
function mouseWheel(e) {
  e.preventDefault();
  firstDraw = true;
  var steps = e.wheelDeltaY ? e.wheelDeltaY : -e.detail * 13;

  maxZ = 800;
  minZ = -200;

  zoom -= steps;
  if (zoom < minZ) {
    zoom = minZ;
  } else if (zoom > maxZ) {
    zoom = maxZ;
  }
}

function animate() {
  time = new Date().getTime();
  delta = time - oldTime;
  oldTime = time;
  sineTime = Math.sin( time/1000 )/2+0.5;
  if (params.auto) params.morph = sineTime;

  orbitY += (offsetX - orbitY) / 10;
  orbitZ += (offsetY - orbitZ) / 30;
  orbitZ = Math.max(-0.16,Math.min(0.16,orbitZ));

  rootY.rotation.y = orbitY * Math.PI - Math.PI/2;
  rootZ.rotation.z = orbitZ * Math.PI + Math.PI/6;

  rootY.position.y = -centerY;

  plane.position.z -= delta * params.speed * gridSpeed;
  plane.position.z = plane.position.z % 100;
  plane.position.y = -riseY;

  camera.position.x -= ( cameraDistance + zoom + camera.position.x) / 20;

  THREE.AnimationHandler.update(delta * params.speed);

  if (typeof(effector) != "undefined"){
    effector.position.x = triggerShader.effectors[ 0 ] = effector.start.x * (1-params.morph) + effector.end.x * params.morph;
    effector.position.y = triggerShader.effectors[ 1 ] = effector.start.y * (1-params.morph) + effector.end.y * params.morph;
    effector.position.z = triggerShader.effectors[ 2 ] = effector.start.z * (1-params.morph) + effector.end.z * params.morph;
  }

  if (typeof(trigger) != "undefined"){
    triggerMat.wireframe = params.wireframe;
    triggerMat.wireframe = lightmapMat.wireframe = params.wireframe;
    triggerMat.vertexColors = params.texture;
  }
  if (typeof(morphObject) != "undefined"){
    morphObject.material.wireframe = params.wireframe;
    morphObject.morph = params.morph;
  }

  updateShaders();

  render();

  animateStrip();

  requestAnimationFrame(animate);
}



function moveModelStrip(e) {
  stripSpeedX = (event.clientX - viewerModelsStrip.offsetLeft - 970 / 2) / 970 * 2;
  (stripSpeedX < 0) ? viewerModelsGoalX = 0 : viewerModelsGoalX = Math.max(0,viewerModels.clientWidth-970);
}
function animateStrip(){
  viewerModelsCurrentX += (viewerModelsGoalX-viewerModelsCurrentX)/(20)*Math.pow(stripSpeedX,4);
  viewerModels.style.left = -viewerModelsCurrentX+"px";
}