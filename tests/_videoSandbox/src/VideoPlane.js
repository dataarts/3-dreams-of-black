var VideoPlane = function(layer, conf){
  var video, texture, interval, shader, material, wireMaterial;
  var config = conf;
  var hasDistortion = false;
  var hasKey = false;

  var polyTrail = new PolyTrail();

  video = document.createElement('video');
  video.src = layer.path;

  texture = new THREE.Texture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  switch (layer.shaderId) {
    case VIDEO_OPAQUE:
      shader = VideoShaderSource.opaque;
      break;
    case VIDEO_OPAQUE_DISTORT:
      shader = VideoShaderSource.distortOpaque;
      hasDistortion = true;
      break;
    case VIDEO_KEYED_DISTORT:
      shader = VideoShaderSource.distortSmartalpha;
      hasDistortion = true;
      hasKey = true;
      break;
    case VIDEO_KEYED:
    default:
      shader = VideoShaderSource.smartAlpha;
      hasKey = true;
      break;
  }

  var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  uniforms['map'].texture = texture;

  if (hasDistortion) {
    uniforms['mouseXY'].value = new THREE.Vector2(0, 0);
    uniforms['aspect'].value = aspect;
		uniforms['mouseSpeed'].value = 1;
    uniforms['mouseRad'].value = 1;

  }

  if (hasKey) {

    uniforms['colorScale'].value = layer.colorScale;
    uniforms['threshold'].value = layer.threshold;
    uniforms['alphaFadeout'].value = layer.alphaFadeout;

  }

  material = new THREE.MeshShaderMaterial({

        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        depthTest: false

      });

  //
  if(!layer.width) layer.width = (hasDistortion) ? 1.104 : 1;
  if(!layer.height) layer.height = (hasDistortion) ? 1.24 : 1;

  if(hasDistortion)
    this.mesh = new THREE.Mesh( config.grid, material );
  else
    this.mesh = new THREE.Mesh( new THREE.Plane(1,1,1,1), material );


  this.mesh.scale.x = layer.width;
  this.mesh.scale.y = layer.height;
  this.mesh.position.z = layer.z;
  this.mesh.scale.x *= Math.abs(layer.z) * config.adj * config.aspect;
  this.mesh.scale.y *= Math.abs(layer.z) * config.adj;

  this.start = function(t, mouseX, mouseY) {

    polyTrail.set(-mouseX * config.aspect, -mouseY);

    video.currentTime = video.duration * t;
    video.play();

    interval = setInterval(function(){
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        texture.needsUpdate = true;
      }
    }, 1000 / 24);
  };

  this.stop = function() {
    video.pause();
    clearInterval( interval );
  };

  this.updateUniform = function(mouseX, mouseY, mouseSpeed, mouseRad) {
    if(!hasDistortion) return;

    polyTrail.target.x = -mouseX * config.aspect;
    polyTrail.target.y = -mouseY;
    polyTrail.update();

    for (i = 0; i <= 4; i++) {
      material.uniforms['trail' + i].value.x = params.polyDetail * polyTrail.s[i*2*params.trail].x;
      material.uniforms['trail' + i].value.y = params.polyDetail * polyTrail.s[i*2*params.trail].y+0.0001*i;
    }
    material.uniforms['mouseXY'].value.x = params.polyDetail * -mouseX * config.aspect;
    material.uniforms['mouseXY'].value.y = params.polyDetail * -mouseY;
    material.uniforms['mouseSpeed'].value = mouseSpeed;

    material.uniforms['mouseRad'].value = params.radius;
    material.uniforms['polyRandom'].value = params.random;
    material.uniforms['polyDetail'].value = params.polyDetail;
    material.uniforms['bulge'].value = params.bulge;
    material.uniforms['softEdge'].value = params.softEdge;

  };

};

function PolyTrail(){
    this.target = new THREE.Vector2();
    this.s = [];
    for (var i = 0; i <= 50; i++) {
        this.s[i] = new THREE.Vector2();
    }
}
PolyTrail.prototype.set = function(x,y){
    for (var i = 50; i >= 0; i = i - 1) {
        this.s[i] = new THREE.Vector3(x,y,0);
    }
};
PolyTrail.prototype.update = function(){
    for (var i = 50; i > 0; i = i - 1) {
        this.s[i].x = this.s[i - 1].x;
        this.s[i].y = this.s[i - 1].y;
    }
    this.s[0].x = this.target.x;
    this.s[0].y = this.target.y;
};



