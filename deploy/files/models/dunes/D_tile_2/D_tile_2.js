/* Converted from: Desert.blend
 *
 * File generated with Blender 2.56 Exporter
 * https://github.com/alteredq/three.js/tree/master/utils/exporters/blender/
 *
 * objects:    4
 * geometries: 4
 * materials:  40
 * textures:   3
 */

var scene = {

"type" : "scene",
"urlBaseType" : "relativeToScene",


"objects" :
{
    "Collision_mountain2" : {
        "geometry"  : "geo_Collision_mountain2",
        "groups"    : [  ],
        "materials" : [ "Collision.006" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : false,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Cube.012" : {
        "geometry"  : "geo_Cube.011",
        "groups"    : [  ],
        "materials" : [  ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : false,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "D_tile_2" : {
        "geometry"  : "geo_D_tile_2",
        "groups"    : [  ],
        "materials" : [ "Desert.007", "Rock.007" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "D_tile_2_Collision" : {
        "geometry"  : "geo_D_tile_2_Collision",
        "groups"    : [  ],
        "materials" : [ "Collision.001" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
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
    "geo_Collision_mountain2" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_2.Collision_mountain2.js"
    },

    "geo_Cube.011" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_2.Cube.011.js"
    },

    "geo_D_tile_2" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_2.D_tile_2.js"
    },

    "geo_D_tile_2_Collision" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_2.D_tile_2_Collision.js"
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
