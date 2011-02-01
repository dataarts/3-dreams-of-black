THREE.WebGLRenderer.Scene = {};

/*
 * Scebe Update
 */

THREE.WebGLRenderer.Scene.update = function( camera ) {

	this.opaqueWebGLBatchDictionary = {};
	this.transparentWebGLBatchList  = [];
	this.supr.update.call( this, undefined, false, this, camera );
}


/*
 * Scene capture
 */

THREE.WebGLRenderer.Scene.capture = function( renderable ) {
	
	if( renderable.webGLBatches === undefined )
		THREE.WebGLBatchCompiler.compile( renderable );
		
		
	for( var s = 0; s < renderable.webGLBatches.length; s++ ) {
		
		var batch = renderable.webGLBatches[ s ];
		
		if( batch.blendMode === "src" ) {
			
			if( this.opaqueWebGLBatchDictionary[ batch.id ] === undefined )
				this.opaqueWebGLBatchDictionary[ batch.id ] = [];
			
			this.opaqueWebGLBatchDictionary[ batch.id ].push( batch );
		}
		else {
			
			this.transparentWebGLBatchList.push( batch );
		}
	}
};


