import os, fnmatch, shutil, re

UTILS = os.path.dirname(os.path.relpath(__file__))
PREFIX = os.path.join(UTILS,'..')
SRC_ROOT= os.path.join(PREFIX,'deploy/files')

comment = """// 3D assets and textures for ROME "3 Dreams of Black" at http://ro.me are licensed 
// under a Creative CommonsAttribution-NonCommercial-ShareAlike 3.0 Unported License
// ( http://creativecommons.org/licenses/by-nc-sa/3.0/ ).

"""

def flatten(l, ltypes=(list, tuple)):
    ltype = type(l)
    l = list(l)
    i = 0
    while i < len(l):
        while isinstance(l[i], ltypes):
            if not l[i]:
                l.pop(i)
                i -= 1
                break
            else:
                l[i:i + 1] = l[i]
        i += 1
    return ltype(l)

def expand(path, globby):
  matches = []
  path = path.split('.')
  path.insert(0,SRC_ROOT)
  print path
  filename = "%s.%s"%(path[-2],path[-1])
  if fnmatch.fnmatch(filename, globby):
    path[-1] = filename
  path = os.path.join(*path)
  if os.path.isdir(path):
    for root, dirnames, filenames in os.walk(path):
      for filename in fnmatch.filter(filenames, globby):
        matches.append(os.path.join(root, filename))
  else:
    matches.append(path)
  return matches

def unique(seq, idfun=None):
  """Ordered uniquify function
  if in 2.7 use:
   OrderedDict.fromkeys(seq).keys()
  """
  if idfun is None:
    def idfun(x): return x
  seen = {}
  result = []
  for item in seq:
    marker = idfun(item)
    if marker in seen: continue
    seen[marker] = 1
    result.append(item)
  return result

def source_list(src, globby='*.js'):
  def expander(f):
    return expand(f,globby)
  return unique(flatten(map(expander, src)))

if __name__ == '__main__':
  for filename in source_list(['models'],'*.js'):
    with open(filename, 'r') as f:
      print "Put comment in %s"%filename
      data = f.read()
      data = comment + data
    with open(filename, 'w') as f:
      f.write(data)
      
print "Boom."