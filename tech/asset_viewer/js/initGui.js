var params, gui;

function initGui(){
  params = {
    "speed": 0.3,
    "morph": 1,
    "texture": true,
    "grid": true,
    "wireframe": false,
    "auto": true,
    "lighting": true,
    "component": 1,
    "depth_of_field": false,
    "focus": 0.33,
    "aperture": 0.005,
    "occlusion": false,
    "radius": 0.033
  };
  gui = new GUI({domElement:  document.getElementById('viewerSettings')});
  gui.add(params, "morph", 0, 1).listen().onChange(function(){ params.auto = false; });
  gui.add(params, "speed", 0, 1).listen();
  gui.add(params, 'grid', true).listen();
  gui.add(params, 'wireframe', false).listen();
  gui.add(params, 'texture', true).listen();
  gui.add(params, 'lighting', true).listen();
  gui.add(params, 'component').options({'Composit': 1, 'Normal': 2, 'Depth': 3}).listen();
  gui.add(params, 'depth_of_field', false).listen();
  gui.add(params, "focus", 0, 1).listen();
  gui.add(params, "aperture", 0, 0.01).listen();
  gui.add(params, "occlusion", false).listen();
  gui.add(params, "radius", 0, 0.1).listen();
}