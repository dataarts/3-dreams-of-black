#!/usr/bin/env python

from PIL import Image
import glob, os
import sys

jpegQuality = 90
scale = float(sys.argv[1])
path = sys.argv[2]

destJPG = len(sys.argv) > 3 and sys.argv[3] == "-j"
noAlpha = len(sys.argv) > 4 and sys.argv[4] == "-a"

def processImage(imgp):
	file, ext = os.path.splitext( imgp )

	im = Image.open( imgp )
	im = im.resize( ( int( im.size[ 0 ] * scale ), int( im.size[ 1 ] * scale ) ) )
	
	if(noAlpha):
		im2 = Image.new( "RGB", ( im.size[ 0 ], im.size[ 1 ] ) )
	else:
		im2 = Image.new( "RGB", ( im.size[ 0 ] * 2, im.size[ 1 ] ) )
		
	im2.paste( im, ( 0, 0, im.size[ 0 ], im.size[ 1 ] ) )
	
	if( not noAlpha ):	
		im2.paste( im.split()[ 3 ], ( im.size[ 0 ], 0, im.size[ 0 ] * 2, im.size[ 1 ] ) )

	if destJPG:
		im2.save( file + ".jpg", "JPEG", quality=jpegQuality)
		os.remove(imgp)
	else:
		im2.save( file + ".png", "PNG" )
		
	im = None
	im2 = None

if path.endswith("/"):
	for infile in glob.glob( path + "*.png" ):
		processImage(infile)
else:
	processImage(path)
