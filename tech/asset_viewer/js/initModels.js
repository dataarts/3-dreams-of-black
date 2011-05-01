var wireMat, trigger, morphObject, mesh;

var meshRadius = 2000;

var models = [];

function initModels(){

  //MORPHS
  models.push({"file": './files/models/animals/stork_flamingo.js', "type": 'animal', "centerY": 0, "riseY" : 60, "speed": 0.8});
  models.push({"file": './files/models/animals/raven_eagle.js', "type": 'animal', "centerY": 0, "riseY" : 70, "speed": 0.9});
  models.push({"file": './files/models/animals/vulture_hummingbird.js', "type": 'animal', "centerY": 0, "riseY" : 70, "speed": 0.9});
  models.push({"file": './files/models/animals/owl_parrot.js', "type": 'animal', "centerY": 0, "riseY" : 70, "speed": 0.8});
  models.push({"file": './files/models/animals/black_widow_scorpion.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.47});
  models.push({"file": './files/models/animals/wolf_fox.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.47});
  models.push({"file": './files/models/animals/fish1_fish2.js', "type": 'animal', "centerY": 100, "riseY" : -160, "speed": 0.2});
  models.push({"file": './files/models/animals/toad_treeFrog.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.47});
  models.push({"file": './files/models/animals/chowchow_sealSwim.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.35});
  models.push({"file": './files/models/animals/retreiver_bearBlack.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.35});
  models.push({"file": './files/models/animals/horse_bearBlack.js', "type": 'animal', "centerY": 90, "riseY" : 0, "speed": 0.47});
  models.push({"file": './files/models/animals/tarbuffaloA_tarbuffaloB.js', "type": 'animal', "centerY": 90, "riseY" : 0, "speed": 0.47});
  //BLACK SOUP
  models.push({"file": './files/models/animals/gator.js', "type": 'animal', "centerY": 40, "riseY" : 0, "speed": 0.4});
  models.push({"file": './files/models/animals/centipede.js', "type": 'animal', "centerY": 20, "riseY" : 0, "speed": 0.5});
  models.push({"file": './files/models/animals/goat.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.5});
  models.push({"file": './files/models/animals/crab.js', "type": 'animal', "centerY": 40, "riseY" : 0, "speed": 0.2});
  models.push({"file": './files/models/animals/cow.js', "type": 'animal', "centerY": 80, "riseY" : 0, "speed": 0});
  models.push({"file": './files/models/animals/panther.js', "type": 'animal', "centerY": 80, "riseY" : 0, "speed": 0});
  //LIFE SOUP
  models.push({"file": './files/models/animals/eagle.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": './files/models/animals/rabbit.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": './files/models/animals/raccoon.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": './files/models/animals/elk.js', "type": 'animal', "centerY": 70, "riseY" : 0, "speed": 0.4});
  models.push({"file": './files/models/animals/moose.js', "type": 'animal', "centerY": 140, "riseY" : 0, "speed": 0.8});

  //Triggers
  models.push({"file": './files/models/city/City.TriggerMesh_Bus_.js', "base": './files/models/city/City.Bus_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2500,0,0,1000]});
  models.push({"file": './files/models/city/City.TriggerMesh_Car_.js', "base": './files/models/city/City.Car_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2800,0,0,1000]});
  models.push({"file": './files/models/city/City.TriggerMesh_CarPile_.js', "base": './files/models/city/City.CarPile_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2800,0,0,1000]});
  models.push({"file": './files/models/city/City.TriggerMesh_CarNiss_.js', "base": './files/models/city/City.CarNiss_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2800,0,0,1000]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_2_.js', "base": './files/models/city/City.Console_2_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_3_.js', "base": './files/models/city/City.Console_3_.001.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_5_.js', "base": './files/models/city/City.Console_5_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_6_.js', "base": './files/models/city/City.Console_6_.000.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_8_.js', "base": './files/models/city/City.Console_8_.000.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
  models.push({"file": './files/models/city/City.TriggerMesh_nsole_10_.js', "base": './files/models/city/City.Console_10_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_11_.js', "base": './files/models/city/City.Console_11_.001.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_14_.js', "base": './files/models/city/City.Console_14.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
//  models.push({"file": './files/models/city/City.TriggerMesh_nsole_15_.js', "base": './files/models/city/City.Console_15_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
  models.push({"file": './files/models/city/City.TriggerMesh_LampPost_.js', "base": './files/models/city/City.LampPost_.js', "type": 'trigger', "centerY": 610, "effector": [0,-2200,0,0,1000,0]});
  models.push({"file": './files/models/city/City.TriggerMesh_ailTrain_.js', "base": './files/models/city/City.RailTrain_.js', "type": 'trigger', "centerY": 210, "effector": [0,-2000,0,0,800,0]});
  models.push({"file": './files/models/city/City.TriggerMesh_SignMany_.js', "base": './files/models/city/City.SignMany_.js', "type": 'trigger', "centerY": 260, "effector": [0,-2500,0,0,-500,0]});

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

      lightmapShader.uniforms[ 'faceLight' ].texture = THREE.ImageUtils.loadTexture("files/models/city/"+triggerBase.geometry.materials[0][0].map.sourceFile)

      effector = new THREE.Mesh( new THREE.Sphere( 1500, 8, 8 ), wireMat);
      effector.start = new THREE.Vector3(models[id].effector[0],models[id].effector[1],models[id].effector[2]);
      effector.end = new THREE.Vector3(models[id].effector[3],models[id].effector[4],models[id].effector[5]);
      document.getElementById('guidat-morph').style.display = 'block';
      //rootY.addChild( effector );
    }});
    models[id].speed = models[id].riseY = 0;
    cameraDistance = 300 + trigger.mesh.boundRadius;
    meshRadius = trigger.mesh.boundRadius;
  }

  if (models[id].type == "animal"){
    morphObject = new ROME.Animal(models[id].geometry, true);
    morphObject.mesh.updateMatrix();
    morphObject.mesh.update();

    nameA = morphObject.availableAnimals[ 0 ];

    if (morphObject.availableAnimals.length == 1){
      document.getElementById('guidat-morph').style.display = 'none';
      nameB = morphObject.availableAnimals[0];
    } else {
      document.getElementById('guidat-morph').style.display = 'block';
      nameB = morphObject.availableAnimals[1];
    }
    rootY.addChild(morphObject.mesh);

    morphObject.play(nameA, nameB, 0, 0, 0);
    cameraDistance = 300 + morphObject.mesh.boundRadius;
    meshRadius = morphObject.mesh.boundRadius;
  }

  centerY = models[id].centerY;
  riseY = models[id].riseY;
  gridSpeed = models[id].speed;
  params.auto = true;


}