var params, gui;

function initGui(){
  params = {
    "speed": 1,
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
    "occlusion": true,
    "radius": 0.02,
    "vignette": true,
    "background": 0.8
  };
  gui = new GUI({domElement:  document.getElementById('viewerSettings')});
  gui.add(params, "morph", 0, 1).listen().onChange(function(){ params.auto = false; });
  gui.add(params, "speed", 0, 1).listen();
  gui.add(params, 'grid', true).listen();
  gui.add(params, 'wireframe', false).listen();
  gui.add(params, 'texture', true).listen();
  gui.add(params, 'lighting', true).listen();
  gui.add(params, 'component').options({'Composite': 1, 'Normal': 2, 'Depth': 3}).listen();
  gui.add(params, "background",0.0,1.0).listen().onChange(function(){skyMat.color.setRGB(params.background,params.background,params.background);});
  gui.add(params, 'depth_of_field', false).listen().onChange(function(){toggleOpacity('guidat-focus', params.depth_of_field);toggleOpacity('guidat-aperture', params.depth_of_field);});
  gui.add(params, "focus", 0, 1).listen();
  gui.add(params, "aperture", 0, 0.01).listen();
  gui.add(params, "occlusion", false).listen().onChange(function(){ toggleOpacity('guidat-radius', params.occlusion)});
  gui.add(params, "radius", 0.001, 0.05).listen();
  gui.add(params, "vignette",true).listen();
  gui.show();

  toggleOpacity('guidat-radius', params.occlusion);
  toggleOpacity('guidat-focus', params.depth_of_field);
  toggleOpacity('guidat-aperture', params.depth_of_field);

}



function toggleOpacity(target, param){
  var children = document.getElementById(target).getElementsByTagName('*');
  for (var i in children){
    if (children[i].style) children[i].style.opacity = 0.2+0.8*param;
  }
}
