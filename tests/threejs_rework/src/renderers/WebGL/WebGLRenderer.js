/*
 * RendererWebGL
 * Author: Mikael Emtinger
 */

THREE.WebGLRenderer = function( contextId ) {

	this.domElement = document.createElement( 'canvas' );
	this.GL         = this.domElement.getContext( "experimental-webgl" );
	
    this.GL.clearColor	( 0.0, 0.0, 0.0, 1.0 );
    this.GL.clearDepth	( 1.0 );
    this.GL.enable		( this.GL.DEPTH_TEST );
    this.GL.depthFunc	( this.GL.LEQUAL );
	this.GL.enable      ( this.GL.CULL_FACE );
	this.GL.cullFace    ( this.GL.BACK );
//	this.GL.pixelStorei ( this.GL.UNPACK_FLIP_Y_WEBGL, true );

	this.applyPrototypes();

	THREE.WebGLRendererContext = this.GL;		// this is no good
};

/*
 * Apply Prototypes
 */

THREE.WebGLRenderer.prototype.applyPrototypes = function() {

	THREE.Scene.prototype.update  = THREE.WebGLRenderer.Scene.update;	
	THREE.Scene.prototype.capture = THREE.WebGLRenderer.Scene.capture;
}


/*
 * Resize
 */

THREE.WebGLRenderer.prototype.setSize = function( wantedWidth, wantedHeight ) {

	this.domElement.width  = wantedWidth;
	this.domElement.height = wantedHeight;
	this.aspect            = wantedWidth / wantedHeight;

	this.GL.viewport( 0, 0, wantedWidth, wantedHeight );
}

/*
 * Render
 */

THREE.WebGLRenderer.prototype.render = function( scene, camera ) {
	
	// update camera
	
	if( camera.aspect !== this.aspect ) {
		
		camera.aspect = this.aspect;
		camera.updatePerspectiveMatrix();
	}


	// clear

    this.GL.clear( this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT );
	

	// update scene
	
	scene.update( camera );
	
	var opaqueWebGLBatchDictionary = scene.opaqueWebGLBatchDictionary;
	var transparentWebGLBatchList  = scene.transparentWebGLBatchList;
	var lightList                  = scene.lightList;
	
	
	// render opaque
	
	for( shaderBatchId in opaqueWebGLBatchDictionary ) {
		
		var shaderBatches = opaqueWebGLBatchDictionary[ shaderBatchId ];
		
		if( shaderBatches.length > 0 ) {
			
			shaderBatches[ 0 ].loadProgram();
			shaderBatches[ 0 ].loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten32());
			shaderBatches[ 0 ].loadUniform( "uCameraInverseMatrix",     camera.inverseMatrix    .flatten32());
			shaderBatches[ 0 ].loadUniform( "uSceneFogFar",             scene.fogFar             );
			shaderBatches[ 0 ].loadUniform( "uSceneFogNear",            scene.fogNear            );
			shaderBatches[ 0 ].loadUniform( "uSceneFogColor",           scene.fogColor           );
			
			for( var s = 0; s < shaderBatches.length; s++ ) {
				
				shaderBatches[ s ].render();
			}
		}
	}
	
	
	// todo: sort and render transparent
}

