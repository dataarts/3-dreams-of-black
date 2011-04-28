# Batch script exported from AE
#

echo 'Cleaning folder from all image/video files'
rm -f *.png *.jpg *.webm

# Image: pov[960 x 409]
cp -f ~/afterEffects/_lastchance/pov.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/pov.png -j

# Image: boxcar[1188 x 566]
cp -f ~/afterEffects/_lastchance/boxcar.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/boxcar.png -j

# Sequence: buffrunB_ [2304 x 1296]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_
echo 'Copying sequence files'
cp -f ~/afterEffects/_lastchance/buffrun/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_
echo 'Creating sprite sheet'
makess.py 0.078 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_/ ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/boxcar.js buffrunB_
echo 'Resizing sequence files for webm encoding'
twosided.py 0.217 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_/
echo 'Encoding webm file'
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_/buffrunB_%4d.png -r 24 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr//buffrunB_.webm 2>/dev/null
echo 'Cleaning sequence files'
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/buffrunB_

# Image: poll[200 x 295]
cp -f ~/afterEffects/_lastchance/poll.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/poll.png -j

# Image: grass[1700 x 552]
cp -f ~/afterEffects/_lastchance/grass.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/grass.png -j

# Image: treeline[1600 x 140]
cp -f ~/afterEffects/_lastchance/treeline.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/treeline.png -j

# Image: hills[1300 x 260]
cp -f ~/afterEffects/_lastchance/hills.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/hills.png -j

# Image: mountain[1100 x 159]
cp -f ~/afterEffects/_lastchance/mountain.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/mountain.png -j

# Image: sky[1116 x 400]
cp -f ~/afterEffects/_lastchance/sky.jpg ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/lastr/sky.jpg -j -a

