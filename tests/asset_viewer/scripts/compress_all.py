import os
import string

srcDir = './'
destDir = './'

script_compress= 'python compress.py '+srcDir+'JSON '+destDir+'TXT'

models_dict = []

dirList=os.listdir(srcDir)
for file in dirList:
  if file.find(".js") != -1:
    models_dict.append({"file":file})

###Compress
for i in range(0,len(models_dict)):
  sh_script = script_compress.replace("JSON", models_dict[i]["file"])
  sh_script = sh_script.replace("TXT", models_dict[i]["file"].replace(".js", ".txt"))
  os.system(sh_script)
