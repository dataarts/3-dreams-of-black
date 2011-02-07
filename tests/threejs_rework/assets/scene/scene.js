/*
 * File generated with unity3d-to-webgl exporter
 */

var url_base = "scene/",
	url_models = "scene/models/",
	url_textures = "scene/textures/";

var scene = {
	
"objects": 
{	
	"buffalo_bone" : {
		"geometry" : "buffalo_bone",
		"materials": [ "buffalo-buffalo_body" ],
		"position" : [ 4.2288,86.8779,-52.7717 ],
		"rotation" : [ 0,90,347.2545 ],
		"scale"	   : [ 4.3,4.3,4.3 ],
		"visible"  : true		
	},
	
},

"geometries":
{	
	"buffalo_bone": {
		"type": "ascii_mesh",
		"url" : url_models + "buffalo_bone.js"
	},
	
},

"textures":
{	
	"Buffalo_Body": {
		"url": url_textures + "Buffalo_Body.png"
	},
	
},

"materials":
{	
	"buffalo-buffalo_body": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xFFFFFF, map: "Buffalo_Body",  }
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