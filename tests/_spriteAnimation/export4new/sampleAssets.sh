# Batch script exported from AE
#

# Sequence: [2304 x 1296]
mkdir ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bsq
cp -f ~/afterEffects/anthony/buffrunPNG/*.png ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bsq
twosided.py 0.217 ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bsq/
ffmpeg -i ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bsq/buffrun%5d.png -r 30 -sameq ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new//buffrun.webm 2>/dev/null
rm -r ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bsq

# Image: [5440 x 4080]
cp -f ~/afterEffects/anthony/bg01trees.png ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/
twosided.py 0.092 ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/bg01trees.png -j

# Image: [1060 x 508]
cp -f ~/afterEffects/anthony/mineSky.jpg ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/
twosided.py 0.472 ~/webgl/rome-drojdjou/tests/_spriteAnimation/export4new/mineSky.jpg -j

