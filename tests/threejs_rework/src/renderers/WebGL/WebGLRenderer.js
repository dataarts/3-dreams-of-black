/*
 * RendererWebGL
 * Author: Mikael Emtinger
 */

THREE.WebGLRenderer = function( contextId ) {

	this.domElement        = document.createElement( 'canvas' );
	this.domWidth          = -1;
	this.domHeight         = -1;
	this.cameraNeedsUpdate = true;

	
	this.GL = this.domElement.getContext( "experimental-webgl", { antialias: true } );
	
    this.GL.clearColor	( 0.8, 0.8, 0.8, 1.0 );
    this.GL.clearDepth	( 1.0 );
    this.GL.enable		( this.GL.DEPTH_TEST );
    this.GL.depthFunc	( this.GL.LEQUAL );
	this.GL.frontFace   ( this.GL.CCW );
	this.GL.cullFace    ( this.GL.BACK );
	this.GL.enable      ( this.GL.CULL_FACE );
    this.GL.pixelStorei ( this.GL.UNPACK_FLIP_Y_WEBGL, true );

	this.GL.enable   ( this.GL.BLEND );
	this.GL.blendFunc( this.GL.ONE, this.GL.ONE_MINUS_SRC_ALPHA );


	this.renderDictionaryOpaque           = {};
	this.renderDictionaryTransparent      = {};
	this.renderDictionaryTransparent.list = [];
	this.renderDictionaryLights           = {};
	this.renderDictionarySounds           = {};


	THREE.WebGLRenderer.Cache                     = {};
	THREE.WebGLRenderer.Cache.currentGL           = this.GL;
	THREE.WebGLRenderer.Cache.currentElementId    = -1;
	THREE.WebGLRenderer.Cache.currentAttributesId = -1;
};


/*
 * Resize
 */

THREE.WebGLRenderer.prototype.setSize = function( wantedWidth, wantedHeight ) {

	this.domElement.width  = this.domWidth  = wantedWidth;
	this.domElement.height = this.domHeight = wantedHeight;
	this.aspect            = wantedWidth / wantedHeight;

	this.GL.viewport( 0, 0, wantedWidth, wantedHeight );
	
	this.cameraNeedsUpdate = true;
}

/*
 * Render
 */

THREE.WebGLRenderer.prototype.render = function( scene, camera ) {
	
	// update camera?
	
	if( this.cameraNeedsUpdate ) {
		
		this.cameraNeedsUpdate = false;
		
		camera.screenCenterX = this.domWidth;
		camera.screenCenterY = this.domHeight;
		camera.aspect        = this.aspect;
		
		camera.updatePerspectiveMatrix();
	}
	

	// update animation
	
	if( THREE.AnimationHandler )
		THREE.AnimationHandler.update();


	// reset cache
	
	THREE.WebGLRenderer.Cache.currentGL           = this.GL;
	THREE.WebGLRenderer.Cache.currentElementId    = -1;
	THREE.WebGLRenderer.Cache.currentAttributesId = -1;
	

	// update scene
	
	scene.update( undefined, false, camera, this );
	
	
	// render opaque

   	this.GL.clear  ( this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT );
	this.GL.disable( this.GL.BLEND );
	
	for( var programId in this.renderDictionaryOpaque ) {
		
		var batches = this.renderDictionaryOpaque[ programId ];

		
		// load common (iterate over batches but break after first)
		
		for( var batchId in batches ) {
			
			var batch = batches[ batchId ];
			
			batch.loadProgram();
			batch.loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix",     camera.inverseMatrix    .flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix3x3",  camera.inverseMatrix    .flatten323x3());
			batch.loadUniform( "uSceneFogFar",             scene.fogFar   );
			batch.loadUniform( "uSceneFogNear",            scene.fogNear  );
			batch.loadUniform( "uSceneFogColor",           scene.fogColor );
	
			break;
		}
		
		
		// render batches
		
		for( var batchId in batches )
			batches[ batchId ].render();
	}
	
	
	// todo: sort and render transparent

//	this.GL.enable   ( this.GL.BLEND );
//	this.GL.blendFunc( this.GL.ONE, this.GL.ONE_MINUS_SRC_ALPHA );		// to be done on each object
}

/*
 * AddToRenderList
 */

THREE.WebGLRenderer.prototype.addToRenderList = function( renderable ) {
	
	// no need to add already added batches
	
	if( renderable.webGLAddedToRenderList ) 
		return;

	 renderable.webGLAddedToRenderList = true;


	// needs to compile?
	
	if( renderable.webGLBatches === undefined )
		THREE.WebGLBatchCompiler.compile( renderable );
	
	
		
	// add batches
	
	for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
		
		var batch = renderable.webGLBatches[ b ];
		
		if( batch.blendMode === "src" ) {
			
			var programDictionary = this.renderDictionaryOpaque[ batch.programId ];
			
			if( programDictionary === undefined )
				programDictionary = this.renderDictionaryOpaque[ batch.programId ] = {};
			 			
			programDictionary[ batch.id ] = batch;
		}
		else {
			
		}
	}
};


THREE.WebGLRenderer.prototype.removeFromRenderList = function( renderable ) {
	
	// no need to remove if not added
	
	if( renderable.webGLAddedToRenderList ) {
		renderable.webGLAddedToRenderList = false;

		
		// remove batches
		
		for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
			
			var batch = renderable.webGLBatches[ b ];
			
			if( batch.blendMode === "src" ) {
				
				var programDictionary = this.renderDictionaryOpaque[ batch.programId ];
				
				if( programDictionary === undefined )
					return;
					
				if( programDictionary[ batch.id ] === undefined )
					return;
					
				delete programDictionary[ batch.id ];
			}
			else {
				
			}
		}
	}
}



