# Batch script exported from AE
#

echo 'Cleaning folder from all image/video files'
rm -f *.png *.jpg *.webm

# Sequence: dust_ [1920 x 817]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_
echo 'Copying sequence files'
cp -f ~/Desktop/videos/dust/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_
echo 'Creating sprite sheet'
makess.py 0.094 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_/ ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/s01.js dust_
echo 'Resizing sequence files for webm encoding'
twosided.py 0.417 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_/
echo 'Encoding webm file'
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_/dust_%5d.png -r 24 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01//dust_.webm 2>/dev/null
echo 'Cleaning sequence files'
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/dust_

# Sequence: car_ [1920 x 817]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_
echo 'Copying sequence files'
cp -f ~/Desktop/videos/car/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_
echo 'Creating sprite sheet'
makess.py 0.094 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_/ ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/s01.js car_
echo 'Resizing sequence files for webm encoding'
twosided.py 0.417 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_/
echo 'Encoding webm file'
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_/car_%5d.png -r 24 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01//car_.webm 2>/dev/null
echo 'Cleaning sequence files'
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/car_

# Image: skyFormat[1920 x 817]
cp -f ~/afterEffects/sequence02/seq2_assets/skyFormat.jpg ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/
echo 'Processing image'
twosided.py 0.417 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s01/skyFormat.jpg -j -a

