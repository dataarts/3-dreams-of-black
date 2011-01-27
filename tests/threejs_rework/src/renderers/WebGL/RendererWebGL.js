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

	
	// shader
	
	THREE.ShaderProgram.prototype.GL = this.GL;
	THREE.ShaderProgramCompiler.GL   = this.GL;
	
}


/*
 * Resize
 */

THREE.RendererWebGL.prototype.resize = function( width, height ) {
	
	this.aspect = width / height;
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
	var lightList                     = scene.lightList;
	
	
	// render opaque
	
	for( shaderProgramId in opaqueShaderProgramDictionary ) {
		
		var shaderPrograms = opaqueShaderProgramDictionary[ shaderProgramId ];
		
		for( var s = 0; s < shaderPrograms.length; s++ ) {
			
			shaderPrograms[ s ].render( )
			renderables.render( camera, lightList );
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

