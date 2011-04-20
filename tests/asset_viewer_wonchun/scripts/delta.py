#!/usr/bin/python2.6
import sys
import simplejson as json

BITS = 14
TARGET_SCALE = (1 << (BITS - 1) - 1)

def ZigZag(word):
  return ((word << 1) ^ (word >> 15)) & 0xFFFF

def ZigZagOut(arr, out):
  for word in arr:
    u = unichr(ZigZag(word)).encode('utf-8')
    out.write(u)

def main(json_file, utf8_out):
  # Load JSON
  obj = json.loads(open(json_file, 'r').read())
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

  out = open(utf8_out, 'w')
  ZigZagOut(verts, out)
  for morphVerts in deltaMorphVertsList:
    ZigZagOut(morphVerts, out)


if __name__ == '__main__':
  assert(len(sys.argv) == 3)
  main(sys.argv[1], sys.argv[2])
