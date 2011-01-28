/*
 * RendererWebGL
 * Author: Mikael Emtinger
 */

THREE.RendererWebGL = function( contextId ) {

	this.canvas = document.getElementById( contextId );
	this.GL     = this.canvas.getContext( "experimental-webgl" );
	
    this.GL.clearColor	( 0.0, 0.0, 0.0, 1.0 );
    this.GL.clearDepth	( 1.0 );
    this.GL.enable		( this.GL.DEPTH_TEST );
    this.GL.depthFunc	( this.GL.LEQUAL );
	this.GL.enable      ( this.GL.CULL_FACE );
	this.GL.cullFace    ( this.GL.BACK );
	this.GL.pixelStorei ( this.GL.UNPACK_FLIP_Y_WEBGL, true );

	this.resize();

	this.applyPrototypes();
	THREE.RendererWebGLContext = this.GL;
};

/*
 * Apply Prototypes
 */

THREE.RendererWebGL.prototype.applyPrototypes = function() {

	// scene

	THREE.Scene.prototype.update  = THREE.RendererWebGL.Scene.update;	
	THREE.Scene.prototype.capture = THREE.RendererWebGL.Scene.capture;
}


/*
 * Resize
 */

THREE.RendererWebGL.prototype.resize = function() {
	
	this.width  = canvas.clientWidth;
	this.height = canvas.clientWidth;
	this.aspect = this.width / this.height;
}

/*
 * Render
 */

THREE.RendererWebGL.prototype.render = function( scene, camera ) {
	
	// update camera
	
	if( camera.aspect !== this.aspect ) 
		camera.aspect = this.aspect;


	// clear

   	this.GL.viewport( 0, 0, this.width, this.height);
    this.GL.clear( this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT );
	

	// update scene
	
	scene.update( camera );
	
	var opaqueShaderProgramDictionary = scene.opaqueShaderProgramDictionary;
	var transparentShaderProgramList  = scene.transparentShaderProgramList;
	var lightList                     = scene.lightList;
	
	
	// render opaque
	
	for( shaderProgramId in opaqueShaderProgramDictionary ) {
		
		var shaderPrograms = opaqueShaderProgramDictionary[ shaderProgramId ];
		
		if( shaderPrograms.length > 0 ) {
			
			shaderPrograms[ 0 ].loadProgram();
			shaderPrograms[ 0 ].loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten() );
			shaderPrograms[ 0 ].loadUniform( "uCameraInverseMatrix",     camera.inverseMatrix    .flatten() );
			shaderPrograms[ 0 ].loadUniform( "uSceneFogFar",             scene.fogFar             );
			shaderPrograms[ 0 ].loadUniform( "uSceneFogNear",            scene.fogNear            );
			shaderPrograms[ 0 ].loadUniform( "uSceneFogColor",           scene.fogColor           );
			
			for( var s = 0; s < shaderPrograms.length; s++ ) {
				
				shaderPrograms[ s ].render()
			}
		}
	}
	
	
	// todo: sort and render transparent
}

