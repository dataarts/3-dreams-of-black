var wireMat, trigger, morphObject, mesh;

var meshRadius = 2000;

var models = [];

function initModels(){

  //MORPHS
  models.push({"file": '/files/models/soup/birds_B_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/animals_A_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/animals_A_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/arm_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/birds_A_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/birds_A_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/butterfly_hiA.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/elk_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/fish_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/gator_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/goat_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/moose_life.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/octo_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/shadow_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/shdw2.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});
  models.push({"file": '/files/models/soup/taruffalo_black.js', "type": 'animal', "centerY": 0, "riseY" : 1, "speed": 0});

  //Triggers
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_Bus_.js', "base": '/asset_viewer/files/models/city/City.Bus_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2500,0,0,1000]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_Car_.js', "base": '/asset_viewer/files/models/city/City.Car_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2800,0,0,1000]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_CarNiss_.js', "base": '/asset_viewer/files/models/city/City.CarNiss_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2800,0,0,1000]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_nsole_10_.js', "base": '/asset_viewer/files/models/city/City.Console_10_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_LampPost_.js', "base": '/asset_viewer/files/models/city/City.LampPost_.js', "type": 'trigger', "centerY": 610, "effector": [0,-2200,0,0,1000,0]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_ailTrain_.js', "base": '/asset_viewer/files/models/city/City.RailTrain_.js', "type": 'trigger', "centerY": 210, "effector": [0,-2000,0,0,800,0]});
  models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_SignMany_.js', "base": '/asset_viewer/files/models/city/City.SignMany_.js', "type": 'trigger', "centerY": 260, "effector": [0,-2500,0,0,-500,0]});

  modelLoader(0);

}

function modelLoader(id) {
  loader = new THREE.JSONLoader();
  loader.load({ model: models[id].file, callback: function(g) {
    addModel(g, id);
  } });
}

function addModel(geometry, id) {
  models[id].geometry = geometry;

  link = document.createElement('a');
  link.setAttribute('class', 'modelLink');
  link.setAttribute('href', 'javascript:switchModel('+id+')');

  models[id].name = models[id].file.replace(/\\/g,'/').replace( /.*\//, '' );
  models[id].name = models[id].name.replace(".js", "");
  link.innerHTML = models[id].name.replace("_", "<br />");

  document.getElementById('viewerModels').appendChild(link);

  if (id == 0){
    switchModel(0);
  }
  if (id < models.length-1) {
    modelLoader(id+1);
  }
}

function switchModel(id) {

  makeScene();

  if (models[id].type == "trigger"){

    triggerMat = new TriggerMat();
    lightmapMat = new LightmapMat();
    depthMat = new DepthMat();

    trigger = new TriggerBig( models[id].geometry );

    var baseLoader = new THREE.JSONLoader();
    baseLoader.load( { model: models[id].base, callback: function( geometry ) {
      triggerBase = new THREE.Mesh( geometry, lightmapMat);
      //if (models[id].file.search("city") != -1) mesh.scale.set(0.1,0.1,0.1);
      //if (models[id].file.search("country") != -1) mesh.scale.set(10,10,10);
      triggerBase.rotation.x = -90 * Math.PI / 180;
      triggerBase.addChild( trigger.mesh );
      trigger.mesh.rotation.x = 90 * Math.PI / 180;
      trigger.mesh.scale.set( 1, 1, 1 );

      rootY.addChild( triggerBase );

      lightmapShader.uniforms[ 'faceLight' ].texture = THREE.ImageUtils.loadTexture("/files/models/city/"+triggerBase.geometry.materials[0][0].map.sourceFile)

      effector = new THREE.Mesh( new THREE.Sphere( 1500, 8, 8 ), wireMat);
      effector.start = new THREE.Vector3(models[id].effector[0],models[id].effector[1],models[id].effector[2]);
      effector.end = new THREE.Vector3(models[id].effector[3],models[id].effector[4],models[id].effector[5]);
      document.getElementById('guidat-morph').style.opacity = 1;
      document.getElementById('guidat-speed').style.opacity = 0.3;
      //rootY.addChild( effector );
    }});
    models[id].speed = models[id].riseY = 0;
    cameraDistance = 100 + trigger.mesh.boundRadius;
    meshRadius = trigger.mesh.boundRadius;
  }

  if (models[id].type == "animal"){
    morphObject = new ROME.Animal(models[id].geometry, true);
    morphObject.mesh.updateMatrix();
    morphObject.mesh.update();

    nameA = morphObject.availableAnimals[ 0 ];

    document.getElementById('guidat-speed').style.opacity = 1;
    if (morphObject.availableAnimals.length == 1){
      document.getElementById('guidat-morph').style.opacity = 0.3;
      nameB = morphObject.availableAnimals[0];
    } else {
      document.getElementById('guidat-morph').style.opacity = 1;
      nameB = morphObject.availableAnimals[1];
    }
    rootY.addChild(morphObject.mesh);

    morphObject.play(nameA, nameB );
    morphObject.animalA.timeScale = morphObject.animalB.timeScale = 0.9;
        
    cameraDistance = 300 + morphObject.mesh.boundRadius;
    meshRadius = morphObject.mesh.boundRadius;

    animalShader.uniforms["animalLength"].value = meshRadius*3;
  }

  centerY = models[id].centerY;
  riseY = models[id].riseY;
  gridSpeed = models[id].speed;
  params.auto = true;

}