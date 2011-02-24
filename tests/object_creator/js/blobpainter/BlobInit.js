function createShaderMaterial( id, light ) {
	
	var smaterial, shader, vs, fs, u;
	
	shader = ShaderExtras[ id ];
	u  = Uniforms.clone( shader.uniforms );
	vs = shader.vertex_shader;
	fs = shader.fragment_shader;
	
	smaterial = new THREE.MeshShaderMaterial( { uniforms: u, vertex_shader: vs,	fragment_shader: fs } );

	smaterial.uniforms.uDirLightPos.value = light.position;
	smaterial.uniforms.uDirLightColor.value = light.color;
	
	return smaterial;
	
}

function init( config, postprocessing, mlib, effectController ) {

	config.camera = new THREE.Camera( 55, window.innerWidth / window.innerHeight, 1, 10000 );
	config.camera.position.y = 1200;
	config.camera.target.position.y = 400;
	
	config.scene = new THREE.Scene();

	// Lights

	config.light = new THREE.DirectionalLight( 0xffffff );
	config.light.position.set( 0.5, 0.5, 1 );
	config.light.position.normalize();
	config.scene.addLight( config.light );

	config.pointLight = new THREE.PointLight( 0xffffff );
	config.pointLight.color.setHSV( 0.05, 1.0, 0.5 );
	config.pointLight.position.set( 0, 0, 100 );
	config.scene.addLight( config.pointLight );

	// toon shaders
	
	var toonMaterial5     = createShaderMaterial( "toon5", config.light ),
		toonMaterial3     = createShaderMaterial( "toon3", config.light ),
		hatchingMaterial  = createShaderMaterial( "hatching", config.light ),
		hatchingMaterial2 = createShaderMaterial( "hatching", config.light ),
		dottedMaterial	  = createShaderMaterial( "dotted", config.light ),
		dottedMaterial2	  = createShaderMaterial( "dotted", config.light );	

	hatchingMaterial2.uniforms.uBaseColor.value.setRGB( 0, 0, 0 );
	hatchingMaterial2.uniforms.uLineColor1.value.setHSV( 0, 0.9, 0.9 );
	hatchingMaterial2.uniforms.uLineColor2.value.setHSV( 0, 0.9, 0.9 );
	hatchingMaterial2.uniforms.uLineColor3.value.setHSV( 0, 0.9, 0.9 );
	hatchingMaterial2.uniforms.uLineColor4.value.setHSV( 0.1, 0.9, 0.9 );

	dottedMaterial2.uniforms.uBaseColor.value.setRGB( 0, 0, 0 );
	dottedMaterial2.uniforms.uLineColor1.value.setHSV( 0.05, 1.0, 1.0 );

	// environment map
	
	var path = "textures/cube/SwedishRoyalCastle/";
	var format = '.jpg';
	var urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];

	var images = ImageUtils.loadArray( urls );

	var reflectionCube = new THREE.Texture( images );
	var refractionCube = new THREE.Texture( images, new THREE.CubeRefractionMapping() );				

	var opacity = mlib.opacity;
	
	mlib.materials = {
	
	"chrome" : 
	{ 
		m: new THREE.MeshLambertMaterial( { color: 0xffffff, env_map: reflectionCube, opacity: opacity } ),
		h: 0, s: 0, v: 1,
		o: opacity
	},
	
	"liquid" : 
	{
		m: new THREE.MeshLambertMaterial( { color: 0xffffff, env_map: refractionCube, refraction_ratio: 0.85, opacity: opacity } ),
		h: 0, s: 0, v: 1,
		o: opacity
	},
		
	"shiny"	: 
	{
		m: new THREE.MeshPhongMaterial( { color: 0x550000, specular:0x220000, env_map: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3, opacity: opacity } ),
		h: 0, s: 0.9, v: 0.3,
		o: opacity
	},
		
	"matte" : 
	{
		m: new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: opacity } ),
		h: 0, s: 0, v: 1,
		o: opacity
	},
	
	"toon5"	: 
	{
		m: toonMaterial5,
		h: 0.2, s: 0.5, v: 0.8,
		o: opacity
	},
	
	"toon3" : 
	{
		m: toonMaterial3,
		h: 0.4, s: 0.5, v: 1,
		o: opacity
	},
	
	"hatching" : 
	{
		m: hatchingMaterial,
		h: 0.2, s: 0.2, v: 1,
		o: opacity
	},

	"hatching2" : 
	{
		m: hatchingMaterial2,
		h: 0.0, s: 0.9, v: 0.9,
		o: opacity
	},

	"dotted" : 
	{
		m: dottedMaterial,
		h: 0.2, s: 0.2, v: 1,
		o: opacity
	},
	
	"dotted2" : 
	{
		m: dottedMaterial2,
		h: 0.1, s: 1.0, v: 1,
		o: opacity
	}
	
	};


	// postprocessing
	
	postprocessing.scene = new THREE.Scene();		
	
	postprocessing.camera = new THREE.Camera();
	postprocessing.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	postprocessing.camera.position.z = 100;
	
	postprocessing.texture = new THREE.RenderTarget( window.innerWidth, window.innerHeight, { min_filter: THREE.LinearFilter, mag_filter: THREE.NearestFilter } );

	var film_shader = ShaderUtils.lib["film"];
	var film_uniforms = Uniforms.clone( film_shader.uniforms );
	
	film_uniforms["tDiffuse"].texture = postprocessing.texture;
	
	postprocessing.material = new THREE.MeshShaderMaterial( { uniforms: film_uniforms, vertex_shader: film_shader.vertex_shader, fragment_shader: film_shader.fragment_shader } );
	postprocessing.material.uniforms.grayscale.value = 0;
	
	var quad = new THREE.Mesh( new Plane( window.innerWidth, window.innerHeight ), postprocessing.material );
	quad.position.z = -500;
	postprocessing.scene.addObject( quad );

	// renderer
	
	var container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	config.renderer = new THREE.WebGLRenderer();
	config.renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( config.renderer.domElement );

	// stats
	
	config.stats = new Stats();
	config.stats.domElement.style.position = 'absolute';
	config.stats.domElement.style.top = '0px';
	container.appendChild( config.stats.domElement );

}