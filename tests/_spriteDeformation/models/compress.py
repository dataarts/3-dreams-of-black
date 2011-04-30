#!/usr/bin/python2.6
# v0.2
import sys
import os
import simplejson as json
import re

BITS = 9
TARGET_SCALE = (1 << (BITS - 1) - 1)

JS_TPL = """

var req = new XMLHttpRequest();
req.open('GET', "%s", false);
req.send(null);
if (req.status == 200 || req.status == 0) {
  var numVertices = %s;
  var numMorphTargets = model.morphTargets.length;
  var scale = %s;
  model.vertices = new Float32Array(numVertices);
  for (var j = 0; j < numMorphTargets; ++j) {
    model.morphTargets[j].vertices = new Float32Array(numVertices);
  }

  var untransposed = new Int16Array(numVertices);
  var transposeOffset = numVertices / 3;
  var prevX = 0, prevY = 0, prevZ = 0;
  for (var i = 0; i < transposeOffset; ++i) {
    var x = req.responseText.charCodeAt(i);
    x = (x >> 1) ^ (-(x & 1));
    prevX += x;
    untransposed[3*i] = prevX;
    var y = req.responseText.charCodeAt(transposeOffset + i);
    y = (y >> 1) ^ (-(y & 1));
    prevY += y;
    untransposed[3*i + 1] = prevY;
    var z = req.responseText.charCodeAt(2*transposeOffset + i);
    z = (z >> 1) ^ (-(z & 1));
    prevZ += z;
    untransposed[3*i + 2] = prevZ;
  }

  for (var i = 0; i < numVertices; ++i) {
    var word = untransposed[i];
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
  var faceOffset = numVertices * (numMorphTargets + 1);
  var numFaces = %s;
  model.faces = new Uint16Array(numFaces);
  for (var i = 0; i < numFaces; ++i) {
    model.faces[i] = req.responseText.charCodeAt(faceOffset + i);
  }
}"""

# Unused face compression.
FACE_DELTA_TPL = """
  var prevFace = 0
  for (var i = 0; i < numFaces; ++i) {
    var face = req.responseText.charCodeAt(faceOffset + i);
    face = (face >> 1) ^ (-(face & 1));
    prevFace += face;
    model.faces[i] = prevFace
  }
"""

def ZigZag(word):
  return ((word << 1) ^ (word >> 15)) & 0xFFFF

def ZigZagOut(arr, out):
  for word in arr:
    u = unichr(ZigZag(word)).encode('utf-8')
    out.write(u)

def UnsignedOut(arr, out):
  for word in arr:
    u = unichr(word).encode('utf-8')
    out.write(u)

def removeVertexAndFaceValues(data):
  def process(line):
    if '"vertices": [' in line or '"faces": [' in line:
      line = re.sub('\[.*?\]','[]',line)
    return line

  lines = data.split('\n')
  lines = map(process, lines)
  return '\n'.join(lines)

def main(json_file, utf8_out):
  # Load JSON
  model = open(json_file, 'r').read()
  jsonStart = model.find("model = ")+8
  jsonEnd = model.find("};")+1

  modelHead = model[0:jsonStart]
  modelTail = model[jsonEnd:]
  model = model[jsonStart:jsonEnd]

  obj = json.loads(model)

  verts = obj['vertices']

  assert (len(verts) % 3 == 0)

  morphTargets = obj['morphTargets']
  morphVertsList = [morphTarget['vertices'] for morphTarget in morphTargets]
  for morphVerts in morphVertsList:
    assert(len(verts) == len(morphVerts))

  faces = obj['faces']

  print "faces: ", len(faces)

  # Compute Scale
  scale = 0
  for vert in verts:
    abs_vert = abs(vert)
    if abs_vert > scale: scale = abs_vert

  for morphVerts in morphVertsList:
    for vert in morphVerts:
      abs_vert = abs(vert)
      if abs_vert > scale: scale = abs_vert

  scale_factor = TARGET_SCALE / scale

  print "scale_factor: ", scale_factor, 1.0/scale_factor

  # Rescale original
  verts = map(lambda x: int(x * scale_factor), verts)

  # Rescale and delta morphs
  prevVerts = verts
  deltaMorphVertsList = []
  for morphVerts in morphVertsList:
    newVerts = map(lambda x: int(x * scale_factor), morphVerts)
    deltaMorphVertsList.append(map(lambda x, prev: x - prev,
                                   newVerts,
                                   prevVerts))
    prevVerts = newVerts

  outCompressed = open(utf8_out, 'w')

  # Delta compress across vertices.
  prevX = 0
  prevY = 0
  prevZ = 0
  transposeOffset = len(verts) / 3
  deltaVerts = []
  deltaVerts.extend(verts)
  for i in range(transposeOffset):
    x = verts[3*i]
    deltaVerts[i] = x - prevX;
    prevX = x
    y = verts[3*i + 1]
    deltaVerts[transposeOffset + i] = y - prevY
    prevY = y
    z = verts[3*i + 2]
    deltaVerts[2*transposeOffset + i] = z - prevZ
    prevZ = z

  # Delta compress face indices.
  prev = 0
  deltaFaces = []
  for face in faces:
    deltaFaces.append(face - prev)
    prev = face

  ZigZagOut(deltaVerts, outCompressed)
  for morphVerts in deltaMorphVertsList:
    ZigZagOut(morphVerts, outCompressed)
  UnsignedOut(faces, outCompressed)
  #ZigZagOut(deltaFaces, outCompressed)

  jsLoader = JS_TPL % (os.path.basename(utf8_out),
                       len(verts),
                       1.0/scale_factor,
                       len(faces))

  model = removeVertexAndFaceValues(model)

  model = modelHead + model + ";" + jsLoader + modelTail[1:]

  outJson = open(utf8_out.replace("txt","js"), 'w')
  outJson.write(model)

if __name__ == '__main__':
  assert(len(sys.argv) == 3)
  main(sys.argv[1], sys.argv[2])
