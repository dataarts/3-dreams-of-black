"""
Requires Python Image Library: http://www.pythonware.com/products/pil/

(use version 1.1.6, latest one 1.1.7 had broken handling of fonts)
"""

import re
import glob
import json
import math
import os.path
import Image, ImageDraw, ImageFont

# ##################################################################
# Config
# ##################################################################

# This table has to be filled in by human.
#
# Format is:
#	"keyword" : [ "label_for_row_1", "label_for_row_1", ... ]
#
# Animals are recognized by keywords present if file names.
#
# For color range row labels, put the same label for color 
# spanning multiple rows.
#
# All strings should be lowercase here.
#
# Matching to material ids is done by color range labels with removed underscores.

LABELMAP = {
"frog":     [ "green_range", "blue_range", "red_range", "eye_color" ],
"retriever":[ "shadow_range", "midtone_range", "highlight_range", "eye_color" ],
"horse":    [ "shadow_range", "midtone_range", "highlight_range", "eye_color", "light_patches" ],
"lion":     [ "shadow_range", "midtone_range", "highlight_range", "eye_color", "light_facial_patches" ],
"deer":     [ "shadow_range", "midtone_range", "highlight_range", "eye_color", "lighter_body_patches" ],
"rabbit":   [ "shadow_range", "midtone_range", "highlight_range", "eye_color", "nose_and_inner_ear_color" ],
"flamingo": [ "body", "body", "body", "beak_dark", "eyes", "face_light", "legs" ],
}


COLORMAPS = "colormaps/*.jpg"
MATERIALS = "mtls/*.mtl"
ASSOCIATIONS = "mtls"

SQUARE = 94
MARGINX = 9
MARGINY1 = 9
MARGINY2 = 30

LEFT = 1200
TOP1 = 70
TOP2 = 420

COLUMNS = 4
ROWS1 = 3
ROWS2 = 4

# ##################################################################
# Templates
# ##################################################################

ASSOCIATIONS_TEMPLATE = """\
{

"mtl" : "%s",
"img" : "%s",

"colorRanges" :

%s,

"materials": 

%s

}
"""

# ##################################################################
# Utils
# ##################################################################

def distance(rgb1, rgb2):
    dr = rgb1[0] - rgb2[0]
    dg = rgb1[1] - rgb2[1]
    db = rgb1[2] - rgb2[2]
    d = math.sqrt(dr*dr + dg*dg + db*db)
    return d
    
def write_file(name, content):
    f = open(name, "w")
    f.write(content)
    f.close()

def read_file(name):
    f = open(name, "r")
    content = f.read()
    f.close()
    return content
    
def generate_rgb(c):
    return "[%.3f, %.3f, %.3f]" % (c[0]/255.0, c[1]/255.0, c[2]/255.)

def get_range_name(basename, index):
    for label in LABELMAP:
        if basename.lower().find(label) >= 0:
            return LABELMAP[label][index]
    return "undefined"

def get_mtl_name(basename, mtlfiles):
    name = ""
    for label in LABELMAP:
        if basename.lower().find(label) >= 0:
            for mtlfile in mtlfiles:
                if mtlfile.lower().find(label) >= 0:
                    name = mtlfile
                    break
    return name

def camel_to_underscore(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def clean_name(name):
    return name.replace("_","").lower()
    
# ##################################################################
# MTL
# ##################################################################

def get_materials(mtlfile):
    materials = []
    mtls = read_file(mtlfile)
    lines = mtls.split("\n")
    for line in lines:
        if line:
            chunks = line.split()
            if chunks[0] == "newmtl":
                materials.append(chunks[1])
                
    return materials

    
# ##################################################################
# Check
# ##################################################################

def generate_check_colors(img, colors, basename):
    
    fsize = 28
    font = ImageFont.truetype("arial.ttf", fsize)
    draw = ImageDraw.Draw(img)
    
    for i, color_row in enumerate(colors):

        if len(color_row) > 0:
            
            for j, color in enumerate(color_row):
                #rgb = (color[0]/255, color[1]/255, color[2]/255)
                x1 = MARGINX  + j * (SQUARE + MARGINX)
                y1 = MARGINY1 + i * (SQUARE + MARGINY1)
                x2 = x1 + SQUARE
                y2 = y1 + SQUARE
                draw.rectangle([x1, y1, x2, y2], fill = color)
            
            x = MARGINX  + len(color_row) * (SQUARE + MARGINX) + MARGINX
            y = MARGINY1 + i * (SQUARE + MARGINY1) + SQUARE/2 - fsize/2
            
            range_name = get_range_name(basename, i)
            
            draw.text((x+1, y+1), range_name, font = font, fill = (0,0,0))
            draw.text((x, y), range_name, font = font)
            
    del draw
    
    return len(colors) * (SQUARE + MARGINY1) + MARGINY1
    
def generate_check_materials(img, materials, bottom, associations_map):
    
    startx = 350
    margintop = 28
    fsize = 28
    
    font = ImageFont.truetype("arial.ttf", fsize)
    draw = ImageDraw.Draw(img)
    
    for i, material in enumerate(materials):

        material_string = "%d: %s" % (i, material)

        x = MARGINX
        y = margintop + bottom + (fsize + MARGINY1) * i
        draw.text((x+1, y+1), material_string, font = font, fill = (0,0,0))
        draw.text((x, y), material_string, font = font)
        
        if material in associations_map:
            colors = associations_map[material]
            for i, color in enumerate(colors):
                
                x1 = startx + i * fsize
                y1 = y
                x2 = x1 + fsize
                y2 = y1 + fsize
                draw.rectangle([x1, y1, x2, y2], fill = color)
                

# ##################################################################
# Color dumper
# ##################################################################

def generate_colors(colors, basename):

    color_map = {}
    color_map_raw = {}
    for i, color_row in enumerate(colors):
        
        rgb_colors = []
        for color in color_row:
            rgb_colors.append(generate_rgb(color))

        if len(rgb_colors) > 0:
            range_name = get_range_name(basename, i)
            if range_name in color_map:
                color_map[range_name].extend(rgb_colors)
                color_map_raw[range_name].extend(color_row)
            else:
                color_map[range_name] = rgb_colors
                color_map_raw[range_name] = color_row
     
    chunkrows = []
    for range_name in color_map:
        color_array = ", ".join(color_map[range_name])
        color_row = '"%s" : [%s]' % (clean_name(range_name), color_array)
        chunkrows.append(color_row)
        
    color_string = ",\n".join(chunkrows)
    output = '{\n%s\n}' % (color_string)
    return output, color_map, color_map_raw
    
# ##################################################################
# Material dumper
# ##################################################################

def generate_material(m, colors):
    colors_string = ", ".join(colors)
    return '"%s" : [ %s ]' % (m, colors_string)
    
def generate_material_colors(materials, color_map, color_map_raw):

    associations = {}
    chunks = []
    for material in materials:
        colors = []
        colors_raw = []
        for color in color_map:
            if material.lower().find(clean_name(color)) >= 0:
                colors.extend(color_map[color])
                colors_raw.extend(color_map_raw[color])

        chunks.append(generate_material(material, colors))
        associations[material] = colors_raw
            
    material_string = ",\n".join(chunks)
    output = "{\n%s\n}" % material_string
    return output, associations

# ##################################################################
# Color extractor
# ##################################################################

def extract_range(img, left, top, marginx, marginy, nrows, ncolumns, rows):

    for r in range(nrows):
        
        row = []
        for c in range(ncolumns):

            x = left + c * (SQUARE + marginx)
            y = top + r * (SQUARE + marginy)
            
            pixel = img.getpixel((x,y))
            
            if distance(pixel, [118,118,118]) > 6 \
               and distance(pixel, [84,84,84]) > 6 \
               and distance(pixel, [46,46,46]) > 6:
                
                row.append(pixel)
                
        rows.append(row)

# ##################################################################
# Main
# ##################################################################

if __name__ == "__main__":
    
    imgfiles = sorted(glob.glob(COLORMAPS))
    mtlfiles = sorted(glob.glob(MATERIALS))
    
    for imgfile in imgfiles:
        
        print "Processing IMG [%s]" % imgfile
        img = Image.open(imgfile)
        
        colors = []
        
        extract_range(img, LEFT, TOP1, MARGINX, MARGINY1, ROWS1, COLUMNS, colors)
        extract_range(img, LEFT, TOP2, MARGINX, MARGINY2, ROWS2, COLUMNS, colors)

        fname = os.path.splitext(imgfile)[0]
        bname = os.path.basename(fname)        
        
        check_file = "check/check_%s.jpg" % bname
        bottom = generate_check_colors(img, colors, bname)

        materials = []
        mtlfile = get_mtl_name(bname, mtlfiles)
        if mtlfile:
            print "Processing MTL [%s]" % mtlfile
            materials = get_materials(mtlfile)

            fname = os.path.splitext(mtlfile)[0]
            bname = os.path.basename(fname)        

            associations_file = os.path.join(ASSOCIATIONS, bname + ".txt")
            print "Generating associations [%s]" % associations_file
            
            colors_string, color_map, color_map_raw = generate_colors(colors, bname)
            materials_string, associations_map = generate_material_colors(materials, color_map, color_map_raw)
            
            associations_string = ASSOCIATIONS_TEMPLATE % (os.path.basename(mtlfile), os.path.basename(imgfile), colors_string, materials_string)
            write_file(associations_file, associations_string)

            print json.load(open(associations_file))

            if associations_map:
                print "Generating check image"

                generate_check_materials(img, materials, bottom, associations_map)

                img.save(check_file)
