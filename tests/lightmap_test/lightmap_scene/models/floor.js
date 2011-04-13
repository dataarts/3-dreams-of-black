/*
 * File generated with unity3d-to-webgl exporter
 *
 * vertices: 4
 * faces: 2
 *
 * How to implement skining: 
 * skinWeights = 4 values per vertes such as a+b+c=d = 1
 * skinIndices = from each wieght, an indice to the joint (bone) it references
 * joints = and index + local position & rotation (root relative to model - usually 0,0)
 */

var model = {

	'materials': [{
	"a_dbg_color" : 0x7D7D7D,
	"a_dbg_index" : 0, 
	"a_dbg_name" : "wood_clr"
	}],

	'vertices': [14.588,0,14.4776,-14.3484,0,14.4776,14.588,0,-14.4587,-14.3484,0,-14.4587],
	'normals': [0,1,0,0,1,0,0,1,0,0,1,0],

	'uvs': [0,0,1,0,0,1,1,1],
	'uvs2': [0.002,0.0019,0.6392,0.0019,0.002,0.6391,0.6392,0.6391],

	'triangles': [],
	'triangles_n': [],
	'triangles_uv': [],
	'triangles_n_uv': [1,0,3,0,1,0,3,1,0,3,3,0,2,0,3,0,2,3,0,2],

	'quads': [],
	'quads_n': [],
	'quads_uv': [],
	'quads_n_uv': [],

	'end': (new Date).getTime()

}

postMessage( model );