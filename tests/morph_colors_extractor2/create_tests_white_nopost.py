import glob
import os.path

# ##################################################################
# Config
# ##################################################################

JSFILES = "results/*.js"
HTMLPATH = "html"

# ##################################################################
# Templates
# ##################################################################

TEMPLATE_HTML = """\
<!DOCTYPE HTML>
<html>
<head>

<title>three.js webgl - %(title)s</title>

<style type="text/css">
body {
    font-family: Monospace;
    background-color: #ffffff;
	color: #000;
    margin: 0px;
    overflow: hidden;
}
</style>

<script type="text/javascript" src="js/Three.js"></script>
<script type="text/javascript" src="js/AnimalRandomSoup.js"></script>
<script type="text/javascript" src="js/Detector.js"></script>
<script type="text/javascript" src="js/RequestAnimationFrame.js"></script>

</head>

<body>

<script>

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var morphObject;

var postprocessing = {};

var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;


init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.Camera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 20;
    camera.position.z = 150;

    scene = new THREE.Scene();

    scene.addLight( new THREE.AmbientLight( 0x333333 ) );

    var light;

    light = new THREE.DirectionalLight( 0xffffff, 1.25 );
    light.position.set( 0, 1, 1 );
    scene.addLight( light );

    renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0xffffff, clearAlpha: 0 } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.autoClear = false;
    
    container.appendChild( renderer.domElement );

    initPostprocessingNoise( postprocessing );

    var loader = new THREE.JSONLoader();
    loader.load( { model: "../%(fname)s", callback: addAnimal } );

};

function addAnimal( geometry ) {

    morphObject = ROME.Animal( geometry, true );
    
    var mesh = morphObject.mesh;

    mesh.rotation.set( 0, -0.75, 0 );
    //mesh.position.set( 0, -100, 0 );

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    mesh.update();
    
    scene.addChild( mesh );

    cameraDistance = 500;
    cameraHeight = 100;

    cameraDistance = mesh.boundRadius * 3;
    //cameraHeight = mesh.boundRadius * 0.1;    

    camera.position.set( 0, cameraHeight, cameraDistance );
    camera.target.position.set( 0, 0, 0 );

    var nameA = morphObject.availableAnimals[ 0 ],
        nameB = morphObject.availableAnimals[ 0 ];

    morphObject.play( nameA, nameB );
    morphObject.animalA.timeScale = morphObject.animalB.timeScale = 0.05;

};


var delta, time, oldTime = new Date().getTime();

function updateMorph( delta ) {

    if ( morphObject ) {
        
        THREE.AnimationHandler.update( delta );
        
    }

};

function animate() {

    requestAnimationFrame( animate );
    
    time = new Date().getTime();
    delta = time - oldTime;
    oldTime = time;

    if ( morphObject ) {
    
        //morphObject.mesh.rotation.y += -0.01;
        //morphObject.mesh.updateMatrix();

    }

    updateMorph( delta );
    
    render();

};

function initPostprocessingNoise( effect ) {
    
    effect.type = "noise";
    
    effect.scene = new THREE.Scene();
    
    effect.camera = new THREE.Camera();
    effect.camera.projectionMatrix = THREE.Matrix4.makeOrtho( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10000, 10000 );
    effect.camera.position.z = 100;
    
    effect.texture = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } );
    effect.texture2 = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } );

    var film_shader = THREE.ShaderUtils.lib["film"];
    var film_uniforms = THREE.UniformsUtils.clone( film_shader.uniforms );
    
    film_uniforms["tDiffuse"].texture = effect.texture;
    
    effect.materialFilm = new THREE.MeshShaderMaterial( { uniforms: film_uniforms, vertexShader: film_shader.vertexShader, fragmentShader: film_shader.fragmentShader } );
    effect.materialFilm.uniforms.grayscale.value = 0;
    
    var heatUniforms = {

		"map": { type: "t", value:0, texture: effect.texture },
		"screenWidth": { type: "f", value: SCREEN_WIDTH },
		"screenHeight": { type: "f", value: SCREEN_HEIGHT },
		"vingenettingOffset": { type: "f", value: 0.87 },
		"vingenettingDarkening": { type: "f", value: 0.61 },
		"colorOffset": { type: "f", value: 0.95 },
		"colorFactor": { type: "f", value: 0 },
		"colorBrightness": { type: "f", value: 0 },
		"sampleDistance": { type: "f", value: 0.54 },
		"waveFactor": { type: "f", value: 0.00127 },
		"colorA": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
		"colorB": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
		"colorC": { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

    };

    effect.materialHeat = new THREE.MeshShaderMaterial( {

        uniforms: heatUniforms,
        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = vec2( uv.x, 1.0 - uv.y );",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\\n"),
        
        fragmentShader: [

				"uniform float screenWidth;",
				"uniform float screenHeight;",
				"uniform float vingenettingOffset;",
				"uniform float vingenettingDarkening;",
				"uniform float colorOffset;",
				"uniform float colorFactor;",
				"uniform float sampleDistance;",
				"uniform float colorBrightness;",
				"uniform float waveFactor;",
				"uniform vec3 colorA;",
				
				
				"uniform sampler2D map;",
				"varying vec2 vUv;",
	
				"void main() {",
	
					"vec4 color, org, tmp, add;",
					"float sample_dist, f;",
					"vec2 vin;",				
					"vec2 uv = vUv;",
					
					"add = color = org = texture2D( map, uv );",

					"vin = (uv - vec2(0.5)) * vec2( 1.4 /*vingenettingOffset * 2.0*/);",
					"sample_dist =(dot( vin, vin ) * 2.0);",
					
					"f = (waveFactor * 100.0 + sample_dist) * sampleDistance * 4.0;",
	
					"vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2(f);",
	
					"add += tmp = texture2D( map, uv + vec2(0.111964, 0.993712) * sampleSize);", 
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.846724, 0.532032) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.943883, -0.330279) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(0.330279, -0.943883) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.532032, -0.846724) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.993712, -0.111964) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"add += tmp = texture2D( map, uv + vec2(-0.707107, 0.707107) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",
	
					"uv = (uv - vec2(0.5)) * vec2( vingenettingOffset );",
					"color = color * vec4(2.0) - (add / vec4(8.0));",
					"color = color + (add / vec4(8.0) - color) * (vec4(1.0) - vec4(sample_dist * 0.5));",
					//"color = color + (add / vec4(8.0) - color) * (-vec4(sample_dist * 0.5));",
					"gl_FragColor = vec4( mix(color.rgb * color.rgb * vec3(colorOffset) + color.rgb, color.ggg * colorFactor - vec3( vingenettingDarkening ), vec3( dot( uv, uv ))), 1.0 );",
				"}"


            ].join("\\n")

    } );
    
    effect.quad = new THREE.Mesh( new THREE.Plane( SCREEN_WIDTH, SCREEN_HEIGHT ), effect.materialFilm );
    effect.quad.position.z = -500;
    effect.scene.addObject( effect.quad );

}

function render() {

    renderer.clear();

    renderer.render( scene, camera );
/*

    renderer.render( scene, camera, postprocessing.texture, true );

    postprocessing.materialFilm.uniforms.time.value += 0.01 * delta;
    //postprocessing.materialHeat.uniforms.time.value += 0.01 * delta;

    // HEAT => NOISE
    
    postprocessing.quad.materials[ 0 ] = postprocessing.materialHeat;
    postprocessing.materialHeat.uniforms.map.texture = postprocessing.texture;

    renderer.render( postprocessing.scene, postprocessing.camera );
    //renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.texture2 );
    
    postprocessing.quad.materials[ 0 ] = postprocessing.materialFilm;
    postprocessing.materialFilm.uniforms.tDiffuse.texture = postprocessing.texture2;
*/

}

</script>
</body>

</html>
"""

TEMPLATE_HTML_INDEX = """\
<!DOCTYPE HTML>
<html>
<head>

<title>rome - animals</title>

<style type="text/css">
body {
    
    background-color: #ffffff;
	color: #000;
    margin: 0px;
    padding: 1em;
    text-align:left;

}
a { color:#000; font-size:1.25em; text-decoration:none }

#links { float:left; width:9%% }
#animals { border: 0; float:left; width:90%%; height:95%%; background:#fff }
</style>

</head>

<body>

<div id="links">
%(links)s
</div>

<iframe id="animals"></iframe>

</body>

</html>
"""

TEMPLATE_LINK = """<a href="#" onclick="document.getElementById('animals').src = 'white_nopost_%s.html';">%s</a>"""

# ##################################################################
# Utils
# ##################################################################

def write_file(name, content):
    f = open(name, "w")
    f.write(content)
    f.close()

# ##################################################################
# Main
# ##################################################################

if __name__ == "__main__":

    jsfiles = sorted(glob.glob(JSFILES))
    
    links = []
    
    for jsname in jsfiles:

        fname = os.path.splitext(jsname)[0]
        bname = os.path.basename(fname)        

        htmlname = "white_nopost_%s.html" % bname
        htmlpath = os.path.join(HTMLPATH, htmlname)

        content = TEMPLATE_HTML % { 
        "fname"	: jsname.replace("\\","/"),
        "title"	: bname
        }
        
        write_file(htmlpath, content)
        
        links.append( bname )
        
    
    links_string = TEMPLATE_HTML_INDEX % {
    
    "links" : "<br/>".join(TEMPLATE_LINK % (x, x) for x in links)
    
    }
    
    linkspath = os.path.join(HTMLPATH, "white_nopost.html")
    write_file( linkspath, links_string )