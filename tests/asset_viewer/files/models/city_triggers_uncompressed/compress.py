#!/usr/bin/python2.6
import sys
import os
import simplejson as json
import re

BITS = 14
TARGET_SCALE = (1 << (BITS - 1) - 1)

def ZigZag(word):
  return ((word << 1) ^ (word >> 15)) & 0xFFFF

def ZigZagOut(arr, out):
  for word in arr:
    u = unichr(ZigZag(word)).encode('utf-8')
    out.write(u)

def removeVertexValues(data):
  def process(line):
    if '"vertices": [' in line:
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
  morphTargets = obj['morphTargets']
  morphVertsList = [morphTarget['vertices'] for morphTarget in morphTargets]
  for morphVerts in morphVertsList:
    assert(len(verts) == len(morphVerts))

  print "num_verts: ", len(verts)

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
  ZigZagOut(verts, outCompressed)
  for morphVerts in deltaMorphVertsList:
    ZigZagOut(morphVerts, outCompressed)


  jsLoader = "\n\n"
  jsLoader += "var req = new XMLHttpRequest();\n"
  jsLoader += "req.open('GET', '"+ os.path.basename(utf8_out) +"', false);\n"
  jsLoader += "req.send(null);\n"
  jsLoader += "if (req.status == 200 || req.status == 0) {\n"
  jsLoader += "  var numVertices = "+str(len(verts))+";\n"
  jsLoader += "  var numMorphTargets = model.morphTargets.length;\n"
  jsLoader += "  var scale = "+str(1.0/scale_factor)+";\n"
  jsLoader += "  model.vertices = new Float32Array(numVertices);\n"
  jsLoader += "  for (var j = 0; j < numMorphTargets; ++j) {\n"
  jsLoader += "    model.morphTargets[j].vertices = new Float32Array(numVertices);\n"
  jsLoader += "  }\n"
  jsLoader += "\n"
  jsLoader += "  for (var i = 0; i < numVertices; ++i) {\n"
  jsLoader += "    var word = req.responseText.charCodeAt(i);\n"
  jsLoader += "   word = (word >> 1) ^ (-(word & 1));\n"
  jsLoader += "    model.vertices[i] = scale * word;\n"
  jsLoader += "\n"
  jsLoader += "   var prev = word;\n"
  jsLoader += "   for (var j = 0; j < numMorphTargets; ++j) {\n"
  jsLoader += "     var offset = (j + 1) * numVertices;\n"
  jsLoader += "     var delta = req.responseText.charCodeAt(offset + i);\n"
  jsLoader += "     delta = (delta >> 1) ^ (-(delta & 1));\n"
  jsLoader += "     prev += delta;\n"
  jsLoader += "     model.morphTargets[j].vertices[i] = scale * prev;\n"
  jsLoader += "   }\n"
  jsLoader += " }\n"
  jsLoader += "}\n"

  model = removeVertexValues(model)

  model = modelHead + model + ";" + jsLoader + modelTail[1:]

  outJson = open(json_file, 'w')
  outJson.write(model)

if __name__ == '__main__':
  assert(len(sys.argv) == 3)
  main(sys.argv[1], sys.argv[2])
