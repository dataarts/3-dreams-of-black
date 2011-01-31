var url_base     = "lightmap_scene/",
	url_models   = url_base + "models/",
	url_textures = url_base + "textures/";

var scene = {
	
"objects": 
{	
	"cubelarge" : {
		"geometry" : "cubelarge",
		"materials": [ "concrete" ],
		"position" : [ 0,0,0 ],
		"rotation" : [ 0,0,0 ],
		"scale"	   : [ 1,1,1 ],
		"visible"  : true		
	},
	"cubesmall" : {
		"geometry" : "cubesmall",
		"materials": [ "metal" ],
		"position" : [ 0,0,0 ],
		"rotation" : [ 0,0,0 ],
		"scale"	   : [ 1,1,1 ],
		"visible"  : true		
	},
	"floor" : {
		"geometry" : "floor",
		"materials": [ "wood" ],
		"position" : [ 0,0,0 ],
		"rotation" : [ 0,0,0 ],
		"scale"	   : [ 1,1,1 ],
		"visible"  : true		
	},
},

"geometries":
{	
	"cubelarge": {
		"type": "ascii_mesh",
		"url" : url_models + "cubelarge.js"
	},
	"cubesmall": {
		"type": "ascii_mesh",
		"url" : url_models + "cubesmall.js"
	},
	"floor": {
		"type": "ascii_mesh",
		"url" : url_models + "floor.js"
	},
},

"textures": 
{
	
	"lightmap_all": {
		"url": url_textures + "all_LIGHTMAP.jpg"
	},

	"concrete": {
		"url": url_textures + "concrete_CLR.jpg"
	},
	
	"metal": {
		"url": url_textures + "metal_CLR.jpg"
	},
	
	"wood": {
		"url": url_textures + "wood_CLR.jpg"
	}
	
},


"materials":
{	
	"concrete": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xffffff, map: "concrete", light_map: "lightmap_all" } 
	},
	
	"wood": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xffffff, map: "wood", light_map: "lightmap_all" } 
	},
	
	"metal": {
		"type": "MeshLambertMaterial",
		"parameters": { color:0xffffff, map: "metal", light_map: "lightmap_all" }
	},
	
	"face": {
		"type": "MeshFaceMaterial",
		"parameters": {}
	}
},

"cameras":
{	
	"camera": {
		"type"  : "perspective",
		"fov"   : 60,
		"aspect": 1.3333,
		"near"  : 0.3,
		"far"   : 1000,
		"position": [0,26.9229,-14.986],
		"target"  : [0,0,0]
	},
},

"defaults" : 
{
	"bgcolor" : [0,0,0],
	"bgalpha" : 1,
	"camera" : "camera"
}

}

postMessage( scene );