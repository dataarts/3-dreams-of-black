#!/usr/bin/env python

import os
import tempfile

files = [

'js/Error.js',

'js/lib/Logger.js',
'js/lib/Stats.js',
'js/lib/gui.min.js',
'js/lib/color.js',

'js/lib/js-signals.min.js',
'js/lib/Tween.js',
'js/lib/ThreeWebGL.js',
'js/lib/ThreeExtras.js',

'js/lib/JSONLoaderAjax.js' ,
'js/lib/SceneLoaderAjax.js',

'js/lib/LoadingBar.js',
'js/lib/RequestAnimationFrame.js',
'js/lib/Sequencer.js',
'js/lib/Tune.js',
'js/lib/Utils.js',

'js/lib/UgcObject.js',
'js/lib/UgcHandler.js',

'js/lib/Gee.js',
'js/lib/Swell.js',
'js/lib/WonderWall.js',
'js/lib/Heart.js',

'js/effects/ClearEffect.js',
'js/effects/FadeInEffect.js',
'js/effects/FadeOutEffect.js',
'js/effects/RenderEffect.js',

'js/effects/NoiseEffect.js',
'js/effects/BloomEffect.js',
'js/effects/HeatEffect.js',
'js/effects/PaintEffect.js',
'js/effects/PaintEffectPrairie.js',
'js/effects/PaintEffectDunes.js',
'js/effects/PaintEffectVideo.js',
'js/effects/PaintDarkEffect.js',
'js/effects/OverlayEffect.js',

'js/effects/PointerEffect.js',
'js/effects/PointerImageEffect.js',

'js/worlds/CityWorld.js',
'js/worlds/PrairieWorld.js',
'js/worlds/DunesWorld.js',
'js/worlds/shaders/CityShader.js',
'js/worlds/shaders/DunesShader.js',
'js/worlds/shaders/WaterfallShader.js',
'js/worlds/shaders/CloudsShader.js',
'js/worlds/shaders/UgcShader.js',
'js/worlds/shaders/WaterfallShader.js',
'js/worlds/cameras/DunesCamera.js',
'js/worlds/cameras/DunesCameraFreeExplore.js',
'js/worlds/cameras/PrairieCameraFreeExplore.js',
'js/worlds/cameras/CityCameraFreeExplore.js',
'js/worlds/triggers/Trigger.js',

'js/soups/CitySoup.js',
'js/soups/PrairieSoup.js',
'js/soups/DunesSoup.js',
'js/soups/elements/Ribbon.js',
'js/soups/elements/AnimalRandom.js',
'js/soups/elements/AnimalRandom_old.js',


'js/soups/elements/Ribbons.js',
'js/soups/elements/Vectors.js',
'js/soups/elements/Particles.js',
'js/soups/elements/AnimalSwarm.js',
'js/soups/elements/AnimalSwarm2.js',
'js/soups/elements/AnimalSwarm_dunes.js',
'js/soups/elements/AnimalInFrontOfCamera.js',
'js/soups/elements/Trail.js',
'js/soups/elements/CollisionScene.js',
'js/soups/elements/TrailShader.js',
'js/soups/elements/Stragglers.js',

'js/video/VideoPlane.js',
'js/video/VideoPlayer.js',
'js/video/VideoShader.js',
'js/video/VideoShots.js',

'js/sequences/City.js',
'js/sequences/Prairie.js',
'js/sequences/Dunes.js',

'js/sections/Section.js',
'js/sections/LauncherSection.js',
'js/sections/FilmSection.js',
'js/sections/RelauncherSection.js',
'js/sections/ExplorationSection.js',
'js/sections/UgcSection.js',

'js/sections/launcher/Clouds.js',

'js/sections/ugc/UgcIntro.js',
'js/sections/ugc/ColorPicker.js',
'js/sections/ugc/UgcUI.js',
'js/sections/ugc/UgcObjectCreator.js',
'js/sections/ugc/UgcSoupCreator.js',
'js/sections/ugc/objectcreator/VoxelPainter.js',

'js/Footer.js',

'js/Shortcuts.js',

'js/Main.js'

]

string = ''

for item in files:
	src_file = open('../deploy/' + item,'r')
	string += src_file.read() + "\n"

tmp_file = open('main.js','w')
tmp_file.write(string)
tmp_file.close()

os.system("java -jar compiler.jar --language_in=ECMASCRIPT5 --js main.js --js_output_file ../deploy/main.min.js")
os.unlink("main.js") #comment this line if you want to make sense of the errors
