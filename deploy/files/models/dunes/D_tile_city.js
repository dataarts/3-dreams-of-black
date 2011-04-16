/* Converted from: Desert.blend
 *
 * File generated with Blender 2.56 Exporter
 * https://github.com/alteredq/three.js/tree/master/utils/exporters/blender/
 *
 * objects:    6
 * geometries: 6
 * materials:  54
 * textures:   3
 */

var scene = {

"type" : "scene",
"urlBaseType" : "relativeToScene",


"objects" :
{
    "D_tile_city" : {
        "geometry"  : "geo_D_tile_city",
        "groups"    : [  ],
        "materials" : [ "Water.002", "Stone.003", "Desert.003", "Rock.003" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "D_tile_City_Island_Co" : {
        "geometry"  : "geo_D_tile_City_Island_Co",
        "groups"    : [  ],
        "materials" : [ "Collision.011" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : false,
        "castsShadow"   : false,
        "meshCollider"  : true
    },

    "Collision8" : {
        "geometry"  : "geo_Cube.004",
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

    "Collision7" : {
        "geometry"  : "geo_Cube.006",
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

    "D_tile_City_Island" : {
        "geometry"  : "geo_D_tile_City_Island",
        "groups"    : [  ],
        "materials" : [ "Desert.011", "Rock.011", "mountain2.001", "Standard_19" ],
        "position"  : [ 0.000000, 0.000000, 0.000000 ],
        "rotation"  : [ 0.000000, -0.000000, 0.000000 ],
        "quaternion": [ 1.000000, 0.000000, 0.000000, 0.000000 ],
        "scale"     : [ 1.000000, 1.000000, 1.000000 ],
        "visible"       : true,
        "castsShadow"   : false,
        "meshCollider"  : false
    },

    "D_tile_City_Collision" : {
        "geometry"  : "geo_D_tile_City_Collision",
        "groups"    : [  ],
        "materials" : [ "Collision.004" ],
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
    "geo_D_tile_city" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.D_tile_city.js"
    },

    "geo_D_tile_City_Island_Co" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.D_tile_City_Island_Co.js"
    },

    "geo_Cube.004" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.Cube.004.js"
    },

    "geo_Cube.006" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.Cube.006.js"
    },

    "geo_D_tile_City_Island" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.D_tile_City_Island.js"
    },

    "geo_D_tile_City_Collision" : {
        "type" : "ascii_mesh",
        "url"  : "D_tile_city.D_tile_City_Collision.js"
    }
},


"textures" :
{
    "Closeup_PaintDubs.jpg" : {
        "url": "Closeup_PaintDubs.jpg"
    },

    "GrungePaint0014_S.jpg" : {
        "url": "GrungePaint0014_S.jpg"
    },

    "PaintDubs.jpg" : {
        "url": "PaintDubs.jpg"
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

    "Bush" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "Bush.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
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

    "Collision.011" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 11876351, opacity: 1.00 }
    },

    "Desert" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.002" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.003" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Desert.007" : {
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

    "Rock" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.002" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.003" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.006" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, map: "GrungePaint0014_S.jpg", vertexColors: "vertex" }
    },

    "Rock.007" : {
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

    "Stone" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "Stone.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "Stone.002" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "Stone.003" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 16777215, opacity: 1.00, vertexColors: "vertex" }
    },

    "Water" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 6992127, opacity: 0.50 }
    },

    "Water.001" : {
        "type": "MeshLambertMaterial",
        "parameters": { color: 6992127, opacity: 0.50 }
    },

    "Water.002" : {
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
