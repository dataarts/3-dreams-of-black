// Converted from: cityPhysics.blend
//  File generated with Blender 2.56 Exporter
//  https://github.com/alteredq/three.js/tree/master/utils/exporters/blender/


var scene = {

"type" : "scene",
"urlBaseType" : "relativeToScene",


"objects" : 
{
    "BuildingShadow" : {
        "geometry"  : "geo_Cube.000",
        "groups"    : [ "Shadows" ],
        "materials" : [  ],
        "position"  : [ -1.400000, 0.000000, 1.800000 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.000000, 2.100000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Rubble2Placeholder" : {
        "geometry"  : "geo_Rubble.001",
        "groups"    : [ "NoExport" ],
        "materials" : [  ],
        "position"  : [ 1.285082, 0.047950, -0.400845 ],
        "rotation"  : [ 0.000000, 0.000000, -1.584242 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Sphere2Col" : {
        "geometry"  : "geo_Sphere.001",
        "groups"    : [ "Physics" ],
        "materials" : [  ],
        "position"  : [ 1.293203, -0.035329, -0.387091 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.220000, 0.220000, 0.220000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Trigger" : {
        "geometry"  : "geo_Cube.005",
        "groups"    : [ "Physics" ],
        "materials" : [  ],
        "position"  : [ 0.000000, 0.500000, -0.839710 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.500000, 0.500000, 0.050000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "BuildingCol" : {
        "geometry"  : "geo_Cube.003",
        "groups"    : [ "Physics", "Shadows" ],
        "materials" : [  ],
        "position"  : [ 1.400000, 0.000000, 1.799684 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.000000, 2.100000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Building1Col" : {
        "geometry"  : "geo_Cube.002",
        "groups"    : [ "Physics", "Shadows" ],
        "materials" : [  ],
        "position"  : [ 1.400000, 0.000000, -1.800000 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.000000, 2.100000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "SphereCol" : {
        "geometry"  : "geo_Sphere",
        "groups"    : [ "Physics" ],
        "materials" : [  ],
        "position"  : [ 0.246069, -0.035329, 0.407018 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.220000, 0.220000, 0.220000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "PlaneCol" : {
        "geometry"  : "geo_Plane",
        "groups"    : [ "Physics" ],
        "materials" : [  ],
        "position"  : [ -0.001918, 0.000000, -0.005755 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 6.000000, 1.000000, 5.999999 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Building2Col" : {
        "geometry"  : "geo_Cube.001",
        "groups"    : [ "Physics", "Shadows" ],
        "materials" : [  ],
        "position"  : [ -1.400000, 0.000000, -1.800000 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.000000, 2.100000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "MonkeyCol" : {
        "geometry"  : "geo_Monkey.001",
        "groups"    : [ "Physics" ],
        "materials" : [  ],
        "position"  : [ 3.238746, 0.621558, 0.008645 ],
        "rotation"  : [ 1.570796, 0.000000, -4.712389 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.200000, 1.200000, 1.200000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Monkey" : {
        "geometry"  : "geo_Monkey",
        "groups"    : [ "Geometries" ],
        "materials" : [  ],
        "position"  : [ 3.238746, 0.621558, 0.008645 ],
        "rotation"  : [ 1.570796, 0.000000, -4.712389 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.200000, 1.200000, 1.200000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Rubble" : {
        "geometry"  : "geo_Rubble",
        "groups"    : [ "Geometries" ],
        "materials" : [  ],
        "position"  : [ 0.248164, 0.045542, 0.398716 ],
        "rotation"  : [ 0.000000, 0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Building3" : {
        "geometry"  : "geo_Building",
        "groups"    : [ "Geometries" ],
        "materials" : [ "Material" ],
        "position"  : [ -1.400001, 0.000000, 1.800001 ],
        "rotation"  : [ 0.000000, 0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Building2" : {
        "geometry"  : "geo_Building",
        "groups"    : [ "Geometries" ],
        "materials" : [ "Material" ],
        "position"  : [ -1.400001, 0.000000, -1.800001 ],
        "rotation"  : [ 0.000000, 0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Building1" : {
        "geometry"  : "geo_Building",
        "groups"    : [ "Geometries" ],
        "materials" : [ "Material" ],
        "position"  : [ 1.400001, 0.000000, -1.800001 ],
        "rotation"  : [ 0.000000, 0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : true,
        "meshCollider"  : false
    },

    "Building" : {
        "geometry"  : "geo_Building",
        "groups"    : [ "Geometries" ],
        "materials" : [ "Material" ],
        "position"  : [ 1.400001, 0.000000, 1.800001 ],
        "rotation"  : [ 0.000000, 0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 0.010000, 0.010000, 0.010000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Ground" : {
        "geometry"  : "geo_Ground",
        "groups"    : [ "Geometries" ],
        "materials" : [ "Material.001" ],
        "position"  : [ 0.000000, 0.000000, -0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, -0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"	    : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    }
},


"geometries" : 
{
    "geo_Cube.000" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Cube.000.js"
    },

    "geo_Rubble.001" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Rubble.001.js"
    },

    "geo_Sphere.001" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Sphere.001.js"
    },

    "geo_Cube.005" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Cube.005.js"
    },

    "geo_Cube.003" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Cube.003.js"
    },

    "geo_Cube.002" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Cube.002.js"
    },

    "geo_Sphere" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Sphere.js"
    },

    "geo_Plane" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Plane.js"
    },

    "geo_Cube.001" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Cube.001.js"
    },

    "geo_Monkey.001" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Monkey.001.js"
    },

    "geo_Monkey" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Monkey.js"
    },

    "geo_Rubble" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Rubble.js"
    },

    "geo_Building" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Building.js"
    },

    "geo_Ground" : {
        "type" : "ascii_mesh",
        "url"  : "cityPhysics.Ground.js"
    }
},


"materials" : 
{
    "Material" : {
        "type": "MeshPhongMaterial",
        "parameters": { color: 0x393939, opacity: 1.00, ambient: 0x000000, specular: 0x7f7f7f, shininess: 50.0 } 
    },

    "Material.001" : {
        "type": "MeshPhongMaterial",
        "parameters": { color: 0x29a333, opacity: 1.00, ambient: 0x000000, specular: 0x7f7f7f, shininess: 50.0 } 
    }
},


"cameras" : 
{
    "default_camera" : {
        "type"  : "perspective",
        "fov"   : 60.000000,
        "aspect": 1.333000,
        "near"  : 1.000000,
        "far"   : 10000.000000,
        "position": [ 0.000000, 0.000000, 10.000000 ],
        "target"  : [ 0.000000, 0.000000, 0.000000 ]
    }
},


"lights" : 
{
	"default_light": {
		"type"		 : "directional",
		"direction"	 : [ 0.000000, 1.000000, 1.000000 ],
		"color" 	 : 0xffffff,
		"intensity"	 : 0.80
	}
},


"defaults" : 
{
    "bgcolor" : [ 0.000000, 0.000000, 0.000000 ],
    "bgalpha" : 1.000000,
    "camera"  : "default_camera"
}

}

postMessage( scene );

