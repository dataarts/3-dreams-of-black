
import os
import string

srcDir = './'
destDir = './'

script_compress= 'python compress.py '+srcDir+'JSON '+destDir+'TXT'
script_convert = 'python convert_obj_three.py -i '+srcDir+'IN -o '+destDir+'OUT -a none'

models_dict = []

dirList=os.listdir(srcDir)
for file in dirList:
  if file.find(".obj") != -1:
    models_dict.append({"file":file})

###Convert Animals
for i in range(0,len(models_dict)):
  sh_script = script_convert.replace("IN", models_dict[i]["file"])
  sh_script = sh_script.replace("OUT", models_dict[i]["file"].replace(".obj", ".js"))
  os.system(sh_script)    

###Compress
for i in range(0,len(models_dict)):
  sh_script = script_compress.replace("JSON", models_dict[i]["file"].replace(".obj", ".js"))
  sh_script = sh_script.replace("TXT", models_dict[i]["file"].replace(".obj", ".txt"))
  os.system(sh_script)
