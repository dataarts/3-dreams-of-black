# Batch script exported from AE
#

echo 'Cleaning folder from all image/video files'
rm -f *.png *.jpg *.webm

# Sequence: buffrun [2304 x 1296]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun
echo 'Copying sequence files'
cp -f ~/afterEffects/sequence02/seq2_assets/buffrunPNG/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun
echo 'Creating sprite sheet'
makess.py 0.078 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun/ ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/s02.js buffrun
echo 'Resizing sequence files for webm encoding'
twosided.py 0.347 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun/
echo 'Encoding webm file'
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun/buffrun%5d.png -r 30 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02//buffrun.webm 2>/dev/null
echo 'Cleaning sequence files'
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/buffrun

# Sequence: sign_ [2304 x 1296]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_
echo 'Copying sequence files'
cp -f ~/afterEffects/sequence02/s02/s02_sign/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_
echo 'Creating sprite sheet'
makess.py 0.078 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_/ ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/s02.js sign_
echo 'Resizing sequence files for webm encoding'
twosided.py 0.347 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_/
echo 'Encoding webm file'
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_/sign_%3d.png -r 12 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02//sign_.webm 2>/dev/null
echo 'Cleaning sequence files'
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/s02/sign_

