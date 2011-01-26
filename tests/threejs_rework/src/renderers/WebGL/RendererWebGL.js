/*
 * RendererWebGL
 * Author: Mikael Emtinger
 */

THREE.RendererWebGL = function( contextId ) {

	this.canvas = document.getElementById( contextId );
	this.GL     = this.canvas.getContext( "experimental-webgl" );
	this.aspect  = 1;
	
	this.applyPrototypes();
};

/*
 * Apply Prototypes
 */

THREE.RendererWebGL.prototype.applyPrototypes = function() {

	// scene

	THREE.Scene.prototype.update  = THREE.RendererWebGL.Scene.update;	
	THREE.Scene.prototype.capture = THREE.RendererWebGL.Scene.capture;
	THREE.Scene.prototype.GL      = this.GL;
	
	
	// mesh
	
	THREE.Mesh.prototype.render = THREE.RendererWebGL.Mesh.render;
	THREE.Mesh.prototype.GL     = this.GL;
}


/*
 * Resize
 */

THREE.RendererWebGL.prototype.resize = function( width, height ) {
	
	this.aspect    = width / height;
	this.modifiers = {}
	
	this.addModifiers( [ "update" ], new THREE.RendererWebGL.Scene());
	this.addModifiers( [ "render" ], new THREE.RendererWebGL.Mesh());
	this.addModifiers( [ "render" ], new THREE.RendererWebGL.Skin());
}

/*
 * Render
 */

THREE.RendererWebGL.prototype.render = function( scene, camera ) {
	
	// update camera
	
	if( camera.aspect !== this.aspect ) 
		camera.aspect = this.aspect;

	
	// update scene
	
	scene.update( camera );
	
	var opaqueShaderProgramDictionary = scene.opaqueShaderProgramDictionary;
	var transparentShaderProgramList  = scene.transparentShaderProgramList;
	
	
	// render opaque
	
	for( shaderProgram in opaqueShaderProgramDictionary ) {
		
		var renderables = opaqueShaderProgramDictionary[ shaderProgram ];
		
		for( var i = 0; i < renderables.length; i++ ) {
			
			renderables.render( camera );
		}
	}
	
	
	// sort transparent
	// todo
	
	// render transparent
	
	for( shaderProgram in opaqueShaderProgramDictionary ) {
		
		var renderables = opaqueShaderProgramDictionary[ shaderProgram ];
		
		for( var i = 0; i < renderables.length; i++ ) {
			
			renderables.render( camera );
		}
	}
}

