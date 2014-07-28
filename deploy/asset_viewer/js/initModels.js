var wireMat, trigger, morphObject, mesh;

var meshRadius = 2000;

var models = [];
var link = {};

function initModels(){

//  //MORPHS
//  //DEPLOYED
  models.push({"file": '/files/models/soup/birds_B_life.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": '/files/models/soup/animals_A_black.js', "type": 'animal', "centerY": 70, "riseY" : 0, "speed": 0.7});
  models.push({"file": '/files/models/soup/animals_A_life.js', "type": 'animal', "centerY": 70, "riseY" : 0, "speed": 0.7});
  models.push({"file": '/files/models/soup/birds_A_black.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": '/files/models/soup/birds_A_life.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.8});
  models.push({"file": '/files/models/soup/butterfly_hiA.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.2});
  models.push({"file": '/files/models/soup/elk_life.js', "type": 'animal', "centerY": 50, "riseY" : 1, "speed": 0.7});
  models.push({"file": '/files/models/soup/fish_life.js', "type": 'animal', "centerY": 80, "riseY" : -180, "speed": 0.1});
  models.push({"file": '/files/models/soup/gator_black.js', "type": 'animal', "centerY": 10, "riseY" : 0, "speed": 0.35});
  models.push({"file": '/files/models/soup/goat_black.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.55});
  models.push({"file": '/files/models/soup/moose_life.js', "type": 'animal', "centerY": 140, "riseY" : 0, "speed": 0.85});
  models.push({"file": '/files/models/soup/octo_black.js', "type": 'animal', "centerY": 20, "riseY" : 0, "speed": 0.18});
  //models.push({"file": '/files/models/soup/taruffalo_black.js', "type": 'animal', "centerY": 90, "riseY" : 0, "speed": 0.5});
//  //CUSTOM
  
  models.push({"file": '/asset_viewer/files/models/animals/tarbuffaloA_tarbuffaloB.js', "type": 'animal', "centerY": 80, "riseY" : 0, "speed": 0.65});
  models.push({"file": '/asset_viewer/files/models/animals/sealRun_bearBrown.js', "type": 'animal', "centerY": 60, "riseY" : 0, "speed": 0.45});
  models.push({"file": '/asset_viewer/files/models/animals/parrot.js', "type": 'animal', "centerY": 0, "riseY" : 80, "speed": 0.7});
  models.push({"file": '/asset_viewer/files/models/animals/fox.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.5});
  models.push({"file": '/asset_viewer/files/models/animals/rabbit.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.5});
  models.push({"file": '/asset_viewer/files/models/animals/retreiver_bearBlack.js', "type": 'animal', "centerY": 50, "riseY" : 0, "speed": 0.5});
  models.push({"file": '/asset_viewer/files/models/animals/toad.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.2});
  models.push({"file": '/asset_viewer/files/models/animals/treefrog.js', "type": 'animal', "centerY": 30, "riseY" : 0, "speed": 0.2});
  models.push({"file": '/asset_viewer/files/models/animals/hummingbird.js', "type": 'animal', "centerY": 0, "riseY" : 70, "speed": 0.2});
  //TRIGGERS
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_Bus_.js', "base": '/asset_viewer/files/models/city/City.Bus_.js', "type": 'trigger', "centerY": 160, "effector": [0,0,2500,0,0,1000]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_Car_.js', "base": '/asset_viewer/files/models/city/City.Car_.js', "type": 'trigger', "centerY": 90, "effector": [0,0,2800,0,0,1000]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_CarNiss_.js', "base": '/asset_viewer/files/models/city/City.CarNiss_.js', "type": 'trigger', "centerY": 90, "effector": [0,0,2800,0,0,1000]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_nsole_10_.js', "base": '/asset_viewer/files/models/city/City.Console_10_.js', "type": 'trigger', "centerY": 1000, "effector": [-1500,1000,-4500,-1500,1000,4500]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_LampPost_.js', "base": '/asset_viewer/files/models/city/City.LampPost_.js', "type": 'trigger', "centerY": 610, "effector": [0,-2200,0,0,1000,0]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_ailTrain_.js', "base": '/asset_viewer/files/models/city/City.RailTrain_.js', "type": 'trigger', "centerY": 200, "effector": [0,-2000,0,0,800,0]});
  // models.push({"file": '/asset_viewer/files/models/city/City.TriggerMesh_SignMany_.js', "base": '/asset_viewer/files/models/city/City.SignMany_.js', "type": 'trigger', "centerY": 260, "effector": [0,-2500,0,0,-500,0]});

  for (var i in models){
    models[i].name = models[i].file.replace(/\\/g,'/').replace( /.*\//, '' );
    models[i].name = models[i].name.replace(".js", "");

    link[models[i].name] = document.createElement('a');
    link[models[i].name].setAttribute('class', 'modelLink');
    link[models[i].name].setAttribute('href', 'javascript:modelLoader('+i+')');

    link[models[i].name].style.backgroundImage = 'url("/asset_viewer/files/thumbnails/'+models[i].name+'.png")';

    document.getElementById('viewerModels').appendChild(link[models[i].name]);
  }

  modelLoader(0);

}

function modelLoader(id) {
  if(models[id].geometry !== 'undefined' ){
    link[models[id].name].style.backgroundImage = 'url("/asset_viewer/files/thumbnails/loading64.gif")';
    loader = new THREE.JSONLoaderAjax();
    loader.load({ model: models[id].file, callback: function(g) {
      models[id].geometry = g;
      switchModel(id);
      link[models[id].name].style.backgroundImage = 'url("/asset_viewer/files/thumbnails/'+models[id].name+'.png")';
    } });
  } //else switchModel(id);

}

function switchModel(id) {
  
  _gaq.push(['_trackPageview', '/asset_viewer/?model='+models[id].name]);

  makeScene();

  if (models[id].type == "trigger"){
    params.texture = true;

    triggerMat = new TriggerMat();
    lightmapMat = new LightmapMat();
    depthMat = new DepthMat();

    trigger = new TriggerBig( models[id].geometry );

    var baseLoader = new THREE.JSONLoaderAjax();
    baseLoader.load( { model: models[id].base, callback: function( geometry ) {
      triggerBase = new THREE.Mesh( geometry, lightmapMat);
      triggerBase.rotation.x = -90 * Math.PI / 180;
      triggerBase.addChild( trigger.mesh );
      trigger.mesh.rotation.x = 90 * Math.PI / 180;
      trigger.mesh.scale.set( 1, 1, 1 );
      //if (models[id].file.search("city") != -1) mesh.scale.set(0.1,0.1,0.1);
      if (models[id].file.search("country") != -1) trigger.mesh.scale.set(10,10,10);

      rootY.addChild( triggerBase );

      lightmapShader.uniforms[ 'faceLight' ].texture = THREE.ImageUtils.loadTexture("/asset_viewer/files/models/city/"+triggerBase.geometry.materials[0][0].map.sourceFile)

      effector = new THREE.Mesh( new THREE.Sphere( 1500, 8, 8 ), wireMat);
      effector.start = new THREE.Vector3(models[id].effector[0],models[id].effector[1],models[id].effector[2]);
      effector.end = new THREE.Vector3(models[id].effector[3],models[id].effector[4],models[id].effector[5]);
      toggleOpacity('guidat-morph', 1);
      toggleOpacity('guidat-speed', 0);
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

    toggleOpacity('guidat-speed', 1);
    if (morphObject.availableAnimals.length == 1){
      toggleOpacity('guidat-morph', 0);
      nameB = morphObject.availableAnimals[0];
    } else {
      toggleOpacity('guidat-morph', 1);
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