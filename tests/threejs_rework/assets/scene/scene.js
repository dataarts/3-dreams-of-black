/*
 * File generated with unity3d-to-webgl exporter
 */

var url_base = "scene/",
	url_models = "scene/models/",
	url_textures = "scene/textures/";

var scene = {
	
"objects": 
{	
	"spine1" : {
		"geometry" : "spine1",
		"materials": [ "buffalo_mat" ],
		"position" : [ 0,0,0 ],
		"rotation" : [ 0,0,0 ],
		"scale"	   : [ 1,1,1 ],
		"visible"  : true		
	},
	
},

"geometries":
{	
	"spine1": {
		"type": "ascii_mesh",
		"url" : url_models + "spine1.js"
	},
	
},

"textures":
{	
	"Buffalo_Mat": {
		"url": url_textures + "Buffalo_Mat.png"
	},
	
},

"materials":
{	
	"buffalo_mat": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xFFFFFF, map: "Buffalo_Mat",  }
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