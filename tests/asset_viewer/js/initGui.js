var params, gui;

function initGui(){
  params = {
    "speed": 0.3,
    "morph": 1,
    "texture": true,
    "wireframe": false,
    "auto": true,
    "lighting": true,
    "shader_components": 1,
    "depth_of_field": false,
    "focus": 0.33,
    "aperture": 0.025
  };
  gui = new GUI({domElement:  document.getElementById('viewerSettings')});
  gui.add(params, "speed", 0, 1).listen();
  gui.add(params, "morph", 0, 1).listen().onChange(function(){ params.auto = false; });
  gui.add(params, 'wireframe', false).listen();
  gui.add(params, 'texture', true).listen();
  gui.add(params, 'lighting', true).listen();
  gui.add(params, 'shader_components').options({'Composit': 1, 'Normal': 2, 'Depth': 3}).listen();
  gui.add(params, 'depth_of_field', false).listen();
  gui.add(params, "focus", 0, 1).listen();
  gui.add(params, "aperture", 0, 0.1).listen();
}