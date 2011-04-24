python convert_obj_three.py -i objs/flamingo/flamingo_flyA_000.obj -o results/flamingo.js -m "objs/flamingo/flamingo_flyA_*.obj" -c "mtls/flamingo_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/moose/mooseGallop_A_001.obj -o results/moose.js -m "objs/moose/mooseGallop_A_*.obj" -c "mtls/moose_colorMap3.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/stork/storkFly_B_001.obj -o results/stork.js -m "objs/stork/storkFly_B_*.obj" -c "mtls/stork_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/horse/horse_A_001.obj -o results/horse.js -m "objs/horse/horse_A_*.obj" -c "mtls/horse_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/gator/gator_runB_001.obj -o results/gator.js -m "objs/gator/gator_runB_*.obj" -c "mtls/gator_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/bear/bearRun_B_001.obj -o results/bear.js -m "objs/bear/bearRun_B_*.obj" -c "mtls/bear_black_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/wolf/wolfDash_A_001.obj -o results/wolf.js -m "objs/wolf/wolfDash_A_*.obj" -c "mtls/wolf_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/toad/toadLeap_A_001.obj -o results/toad.js -m "objs/toad/toadLeap_A_*.obj" -c "mtls/toad_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/mountainlion/mountainlionRun_A_001.obj -o results/mountainlion.js -m "objs/mountainlion/mountainlionRun_A_*.obj" -c "mtls/mountainlion_colorMap_black.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/shdw2/shdw2_crawlE_001.obj -o results/shdw2.js -m "objs/shdw2/shdw2_crawlE_*.obj" -c "mtls/shadowman02_noLegs_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/tarbuffalo/tarbuffalo_runA_001.obj -o results/tarbuffalo.js -m "objs/tarbuffalo/tarbuffalo_runA_*.obj" -c "mtls/tubuffalo_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/goat/goatCharge_A_001.obj -o results/goat.js -m "objs/goat/goatCharge_A_*.obj" -c "mtls/goat_colorMap.obj" -s flat -a none -b -x 10
python convert_obj_three.py -i objs/chow/chowRun_A_001.obj -o results/chow.js -m "objs/chow/chowRun_A_*.obj" -c "mtls/chow_colorMap.obj" -s flat -a none -b -x 10

python convert_obj_three.py -i objs/flamingo/flamingo_flyA_000.obj -o results/birds_B_life.js -m "objs/flamingo/flamingo_flyA_*.obj objs/stork/storkFly_B_*.obj" -c "mtls/flamingo_colorMap.obj mtls/stork_colorMap.obj" -s flat -a none -b -x 10

rem python convert_obj_three.py -i mtls/stork_colorMap.obj -o results/stork.js -m "mtls/stork_colorMap.obj" -c "mtls/stork_colorMap.obj" -s flat -a none -b
rem python convert_obj_three.py -i mtls/moose_colorMap.obj -o results/moose.js -m "mtls/moose_colorMap.obj" -c "mtls/moose_colorMap.obj" -s flat -a none -b

python create_tests.py
