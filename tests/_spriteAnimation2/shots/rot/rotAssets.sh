# Batch script exported from AE
#

echo 'Cleaning folder from all image/video files'
rm -f *.png *.jpg *.webm

# Image: smoketex_01[512 x 512]
cp -f ~/afterEffects/sequence02/seq2_assets/smoketex_01.png ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/rot/
echo 'Processing image'
twosided.py 1 ~/webgl/rome-drojdjou/tests/_spriteAnimation2/shots/rot/smoketex_01.png -j -a

