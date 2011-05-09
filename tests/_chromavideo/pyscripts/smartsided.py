#!/usr/bin/env python

from PIL import Image
import glob, os
import sys

jpegQuality = 90
path = sys.argv[1]

def processImage(imgp):
	file, ext = os.path.splitext( imgp )

	im = Image.open( imgp )
	
	ima = im.resize( ( int( im.size[0] * 0.5 ), im.size[1] ) ) 

	im2 = Image.new( "RGB", ( int( im.size[0] + ima.size[0] ), im.size[1] ) )
	im2.paste( im, ( 0, 0, im.size[0], im.size[1] ) )
	im2.paste( ima.split()[3],  ( im.size[0], 0, im2.size[0], im.size[1] ) )

	im2.save( file + ".png", "PNG" )

if path.endswith("/"):
	for infile in glob.glob( path + "*.png" ):
		processImage(infile)
else:
	processImage(path)
