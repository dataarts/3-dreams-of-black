"""
Requires Python Image Library: http://www.pythonware.com/products/pil/

(use version 1.1.6, latest one 1.1.7 had broken handling of fonts)
"""

import glob
import math
import os.path
import Image, ImageDraw, ImageFont

# ##################################################################
# Config
# ##################################################################

SQUARE = 94
MARGIN = 9

LEFT = 1344
TOP1 = 70
TOP2 = 420

COLUMNS = 3
ROWS1 = 3
ROWS2 = 4

LABELMAP = {
"frog":     ["green_range", "blue_range", "red_range", "eye_color"],
"retriever":["shadow_range", "midtone_range", "highlight_range", "eye_color"],
"horse":    ["shadow_range", "midtone_range", "highlight_range", "eye_color", "light_patches"],
"lion":     ["shadow_range", "midtone_range", "highlight_range", "eye_color", "light_facial_patches"],
"deer":     ["shadow_range", "midtone_range", "highlight_range", "eye_color", "lighter_body_patches"],
"rabbit":   ["shadow_range", "midtone_range", "highlight_range", "eye_color", "nose_and_inner_ear_color"],
"flamingo": ["shadow_range", "midtone_range", "highlight_range", "eye_color", "leg_highlight", "leg_midtone", "leg_shadow"],
}

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
                x1 = MARGIN + j * (SQUARE + MARGIN)
                y1 = MARGIN + i * (SQUARE + MARGIN)
                x2 = x1 + SQUARE
                y2 = y1 + SQUARE
                draw.rectangle([x1, y1, x2, y2], fill = color)
            
            x = MARGIN + len(color_row) * (SQUARE + MARGIN) + MARGIN
            y = MARGIN + i * (SQUARE + MARGIN) + SQUARE/2 - fsize/2
            
            range_name = get_range_name(basename, i)
            
            draw.text((x+1, y+1), range_name, font = font, fill = (0,0,0))
            draw.text((x, y), range_name, font = font)
            
    del draw
    
    return len(colors) * (SQUARE + MARGIN) + MARGIN
    
def generate_check_materials(img, materials, bottom):
    
    fsize = 28
    font = ImageFont.truetype("arial.ttf", fsize)
    draw = ImageDraw.Draw(img)
    
    for i, material in enumerate(materials):

        material_string = "%d: %s" % (i, material)

        x = MARGIN
        y = bottom + (fsize + MARGIN) * i
        draw.text((x+1, y+1), material_string, font = font, fill = (0,0,0))
        draw.text((x, y), material_string, font = font)

# ##################################################################
# Color dumper
# ##################################################################
    
def generate_colors(colors, basename):

    chunkrows = []
    for i, color_row in enumerate(colors):
        chunks = []
        for color in color_row:
            chunks.append(generate_rgb(color))

        if len(chunks) > 0:
            range_name = get_range_name(basename, i)
            color_array = ", ".join(chunks)
            color_row = '"%s" : [%s]' % (range_name, color_array)
            chunkrows.append(color_row)

    color_string = ",\n".join(chunkrows)
    return '{\n%s\n}' % (color_string)

# ##################################################################
# Material dumper
# ##################################################################
def generate_material(m):
    return '"%s" : [ "replace_me" ]' % m
    
# ##################################################################
# Color extractor
# ##################################################################

def extract_range(img, left, top, nrows, ncolumns, rows):

    for r in range(nrows):
        
        row = []
        for c in range(ncolumns):

            x = left + c * (SQUARE + MARGIN)
            y = top + r * (SQUARE + MARGIN)
            
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
    
    imgfiles = sorted(glob.glob("colormaps/*.jpg"))
    mtlfiles = sorted(glob.glob("mtls/*.mtl"))
    
    for imgfile in imgfiles:
        
        print "Processing IMG [%s]" % imgfile
        img = Image.open(imgfile)
        
        colors = []
        
        extract_range(img, LEFT, TOP1, ROWS1, COLUMNS, colors)
        extract_range(img, LEFT, TOP2, ROWS2, COLUMNS, colors)

        fname = os.path.splitext(imgfile)[0]
        bname = os.path.basename(fname)        
        
        check_file = "check/check_%s.jpg" % bname
        bottom = generate_check_colors(img, colors, bname)

        materials = []
        mtlfile = get_mtl_name(bname, mtlfiles)
        if mtlfile:
            print "Processing MTL [%s]" % mtlfile
            materials = get_materials(mtlfile)
            generate_check_materials(img, materials, bottom)

        img.save(check_file)

        associations_file = "associations/%s.txt" % bname
        colors_string = generate_colors(colors, bname)
        materials_string = "{\n%s\n}" % ",\n".join(generate_material(m) for m in materials)

        associations_string = ASSOCIATIONS_TEMPLATE % (imgfile, mtlfile, colors_string, materials_string)
        write_file(associations_file, associations_string)
