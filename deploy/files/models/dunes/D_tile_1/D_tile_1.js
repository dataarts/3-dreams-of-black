/* Converted from: Desert.blend
 *
 * File generated with Blender 2.56 Exporter
 * https://github.com/alteredq/three.js/tree/master/utils/exporters/blender/
 *
 * objects:    5
 * geometries: 5
 * materials:  40
 * textures:   3
 */

var scene = {

"type" : "scene",
"urlBaseType" : "relativeToScene",


"objects" :
{
    "Collision_Mountai.000" : {
        "geometry"  : "geo_Collision_Mountai.000",
        "groups"    : [  ],
        "materials" : [ "Collision.010" ],
        "position"  : [ -3602.733154, 2397.891602, 0.000000 ],
        "rotation"  : [ 0.000000, 0.000000, -1.070141 ],
        "quaternion": [ 0.860233, 0.000000, 0.000000, -0.509902 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : false,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Cube.014" : {
        "geometry"  : "geo_Cube.013",
        "groups"    : [  ],
        "materials" : [  ],
        "position"  : [ 2437.548828, 11672.983398, 299.070526 ],
        "rotation"  : [ 0.000000, 0.000000, -0.169539 ],
        "quaternion": [ 0.996409, 0.000000, 0.000000, -0.084668 ],
        "scale"     : [ 253.116791, 294.654022, 271.441040 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "Cube.013" : {
        "geometry"  : "geo_Cube.012",
        "groups"    : [  ],
        "materials" : [  ],
        "position"  : [ 11273.281250, 956.486694, 578.492737 ],
        "rotation"  : [ 0.000000, 0.000000, -0.169539 ],
        "quaternion": [ 0.996409, 0.000000, 0.000000, -0.084668 ],
        "scale"     : [ 437.781158, 294.654114, 361.475739 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "D_tile_1" : {
        "geometry"  : "geo_D_tile_1.001",
        "groups"    : [  ],
        "materials" : [ "Rock.006" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "D_tile_1_Collision" : {
        "geometry"  : "geo_D_tile_1_Collision",
        "groups"    : [  ],
        "materials" : [ "Collision" ],
        "position"  : [ -3.468322, 0.705899, 6.943486 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : false,
        "castsShadow"   : false,
        "meshCollider"  : true
    }
},


"geometries" :
{
    "geo_Collision_Mountai.000" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_1.Collision_Mountai.000.js"
    },

    "geo_Cube.013" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_1.Cube.013.js"
    },

    "geo_Cube.012" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_1.Cube.012.js"
    },

    "geo_D_tile_1.001" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_1.D_tile_1.001.js"
    },

    "geo_D_tile_1_Collision" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_1.D_tile_1_Collision.js"
    }
},


"textures" :
{
    "Closeup_PaintDubs.jpg" : {
        "url": "../textures/Closeup_PaintDubs.jpg"
    },

    "GrungePaint0014_S.jpg" : {
        "url": "../textures/GrungePaint0014_S.jpg"
    },

    "PaintDubs.jpg" : {
        "url": "../textures/PaintDubs.jpg"
    }
},


"materials" :
{
    "08 - Default.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 9803157, opacity: 1.00, vertexColors: "vertex" }
    },

    "11 - Default.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 4600096, opacity: 1.00, vertexColors: "vertex" }
    },

    "12 - Default.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 0, opacity: 1.00, vertexColors: "vertex" }
    },

    "20 - Default.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 3231667, opacity: 1.00, vertexColors: "vertex" }
    },

    "Closeup_PaintDubs.004" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "Closeup_PaintDubs.jpg", vertexColors: "vertex" }
    },

    "Collision" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.002" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.003" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.004" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.006" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.007" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.008" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.009" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Collision.010" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Desert.007" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.008" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.009" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.010" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.011" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.012" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.017" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 9195557, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.019" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "mountain2.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "PaintDubs.004" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "PaintDubs.jpg", vertexColors: "vertex" }
    },

    "Rock.006" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.007" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.008" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.009" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.010" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 4007182, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.011" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.012" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.017" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 4007182, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.019" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "RocksWhite.005" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 2960685, opacity: 1.00 }
    },

    "Standard_10.004" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 1250067, opacity: 1.00, vertexColors: "vertex" }
    },

    "Standard_19" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 14408667, opacity: 1.00, vertexColors: "vertex" }
    },

    "Water" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 6992127, opacity: 0.50 }
    },

    "Water.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 6992127, opacity: 0.50 }
    }
},


"transform" :
{
    "position"  : [ 0.000000, 0.000000, 0.000000 ],
    "rotation"  : [ -1.570796, 0.000000, 0.000000 ],
    "scale"     : [ 1.000000, 1.000000, 1.000000 ],
},

"defaults" :
{
    "bgcolor" : [ 0.000000, 0.000000, 0.000000 ],
    "bgalpha" : 1.000000,
    "camera"  : ""
}

}

postMessage( scene );
close();
