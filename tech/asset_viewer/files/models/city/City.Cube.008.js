/*
 * File generated with Blender 2.56 Exporter
 * https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender/
 *
 * vertices: 8
 * faces: 6
 * normals: 0
 * uvs: 0
 * colors: 0
 * materials: 1
 * edges: 0
 *
 */

var model = {

    "version" : 2,

    "scale" : 1.000000,

    "materials": [	{
	"DbgColor" : 15658734,
	"DbgIndex" : 0,
	"DbgName" : "default",
	"vertexColors" : false
	}],

    "vertices": [],

    "morphTargets": [],

    "normals": [],

    "colors": [],

    "uvs": [[]],

    "faces": [3,0,1,2,3,0,3,4,7,6,5,0,3,0,4,5,1,0,3,1,5,6,2,0,3,2,6,7,3,0,3,4,0,3,7,0],

    "edges" : []


};

var req = new XMLHttpRequest();
req.open('GET', 'City.Cube.008.txt', false);
req.send(null);
if (req.status == 200 || req.status == 0) {
  var numVertices = 24;
  var numMorphTargets = model.morphTargets.length;
  var scale = 46529048.0;
  model.vertices = new Float32Array(numVertices);
  for (var j = 0; j < numMorphTargets; ++j) {
    model.morphTargets[j].vertices = new Float32Array(numVertices);
  }

  for (var i = 0; i < numVertices; ++i) {
    var word = req.responseText.charCodeAt(i);
   word = (word >> 1) ^ (-(word & 1));
    model.vertices[i] = scale * word;

   var prev = word;
   for (var j = 0; j < numMorphTargets; ++j) {
     var offset = (j + 1) * numVertices;
     var delta = req.responseText.charCodeAt(offset + i);
     delta = (delta >> 1) ^ (-(delta & 1));
     prev += delta;
     model.morphTargets[j].vertices[i] = scale * prev;
   }
 }
}


postMessage( model );
close();
