/*
 * File generated with unity3d-to-webgl exporter
 */

var url_base = "scene/",
	url_models = "scene/models/",
	url_textures = "scene/textures/";

var scene = {
	
"objects": 
{	
	"j1" : {
		"geometry" : "j1",
		"materials": [ "Default-Diffuse" ],
		"position" : [ 0,0,0 ],
		"rotation" : [ 0,0,0 ],
		"scale"	   : [ 1,1,1 ],
		"visible"  : true		
	},
	
},

"geometries":
{	
	"j1": {
		"type": "ascii_mesh",
		"url" : url_models + "j1.js"
	},
	
},

"textures":
{	
},

"materials":
{	
	"Default-Diffuse": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xFFFFFF,   }
	},
	
	"face": {
		"type": "MeshFaceMaterial",
		"parameters": { } 
	}
},

"cameras":
{	
},

"defaults" : 
{
	"bgcolor" : [0,0,0],
	"bgalpha" : 1,
	"camera" : "camera"
}

}

postMessage( scene );