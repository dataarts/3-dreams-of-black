/*
 * RendererWebGL
 * Author: Mikael Emtinger
 */

THREE.WebGLRenderer = function( contextId ) {

	this.domElement        = document.createElement( 'canvas' );
	this.domWidth          = -1;
	this.domHeight         = -1;
	this.cameraNeedsUpdate = true;

	
	this.GL = this.domElement.getContext( "experimental-webgl", { antialias: true, stencil: true } );
	
    this.GL.clearColor	( 1.0, 1.0, 1.0, 1.0 );
    this.GL.clearDepth	( 1.0 );
    this.GL.enable		( this.GL.DEPTH_TEST );
    this.GL.depthFunc	( this.GL.LEQUAL );
	this.GL.frontFace   ( this.GL.CCW );
	this.GL.cullFace    ( this.GL.BACK );
	this.GL.enable      ( this.GL.CULL_FACE );
    this.GL.pixelStorei ( this.GL.UNPACK_FLIP_Y_WEBGL, true );

	this.GL.disable( this.GL.BLEND );


	this.renderDictionaryOpaque           = {};
	this.renderDictionaryTransparent      = {};
	this.renderDictionaryTransparent.list = [];
	this.renderDictionaryLights           = {};
	this.renderDictionarySounds           = {};
	this.renderListShadowVolumes          = [];

	THREE.WebGLRenderer.Cache                     = {};
	THREE.WebGLRenderer.Cache.currentGL           = this.GL;
	THREE.WebGLRenderer.Cache.currentElementId    = -1;
	THREE.WebGLRenderer.Cache.currentAttributesId = -1;
	
	this.directionalLightFlat32 = new Float32Array( 3 );
	this.directionalLight       = new THREE.Vector3( 0, -1, 0 );
	
	
	
	// create shadow polygons

	var vertices = [];
	var faces    = [];
	
	var s = 2;
	
	vertices[ 0 * 4 + 0 ] = -1*s; vertices[ 0 * 4 + 1 ] = -1*s; vertices[ 0 * 4 + 2 ] = -1; vertices[ 0 * 4 + 3 ] = 1;
	vertices[ 1 * 4 + 0 ] =  1*s; vertices[ 1 * 4 + 1 ] = -1*s; vertices[ 1 * 4 + 2 ] = -1; vertices[ 1 * 4 + 3 ] = 1;
	vertices[ 2 * 4 + 0 ] =  1*s; vertices[ 2 * 4 + 1 ] =  1*s; vertices[ 2 * 4 + 2 ] = -1; vertices[ 2 * 4 + 3 ] = 1;
	vertices[ 3 * 4 + 0 ] = -1*s; vertices[ 3 * 4 + 1 ] =  1*s; vertices[ 3 * 4 + 2 ] = -1; vertices[ 3 * 4 + 3 ] = 1;
	
	faces[ 0 ] = 0; faces[ 1 ] = 1; faces[ 2 ] = 2;
	faces[ 3 ] = 0; faces[ 4 ] = 2; faces[ 5 ] = 3;
	
	THREE.WebGLBatchCompiler.setGL( this.GL );
	
	var vertexBuffer  = THREE.WebGLBatchCompiler.bindBuffer( "aVertex", "vec4", vertices, 4 );
	var elementBuffer = THREE.WebGLBatchCompiler.bindElement( faces, faces.length );

	this.shadowBatch = new THREE.WebGLBatch( { vertexShaderId: "shadowPostVertex", fragmentShaderId: "shadowPostFragment", blendMode: THREE.WebGLRendererBlendModes.subtract } );

	this.shadowBatch.addAttributeBuffer( vertexBuffer.name, vertexBuffer.type, vertexBuffer.buffer, vertexBuffer.size );
	this.shadowBatch.addElementBuffer  ( elementBuffer.buffer, elementBuffer.size );
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
};

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
	

	// reset cache
	
	THREE.WebGLRenderer.Cache.currentGL           = this.GL;
	THREE.WebGLRenderer.Cache.currentElementId    = -1;
	THREE.WebGLRenderer.Cache.currentAttributesId = -1;
	

	// update scene
	
	scene.update( undefined, false, camera, this );
	


	// update light

	this.directionalLight.normalize();
	this.directionalLightFlat32[ 0 ] = this.directionalLight.x;
	this.directionalLightFlat32[ 1 ] = this.directionalLight.y;
	this.directionalLightFlat32[ 2 ] = this.directionalLight.z;


	// render opaque
   	
    this.GL.disable	 ( this.GL.STENCIL_TEST );
    this.GL.enable	 ( this.GL.DEPTH_TEST );
    this.GL.depthMask( true );
	this.GL.cullFace ( this.GL.BACK );
	this.GL.disable  ( this.GL.BLEND );

  	this.GL.clear( this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT | this.GL.STENCIL_BUFFER_BIT );

	this.renderDictionary( this.renderDictionaryOpaque, 1 );


	// render stencil passes
	
	this.GL.enable( this.GL.POLYGON_OFFSET_FILL );
	this.GL.polygonOffset( 0.1, 1.0 );
	this.GL.enable( this.GL.STENCIL_TEST );
	this.GL.depthMask( false );
	this.GL.colorMask( false, false, false, false );

	this.GL.stencilFunc( this.GL.ALWAYS, 1, 0xFF );
	this.GL.stencilOpSeparate( this.GL.BACK,  this.GL.KEEP, this.GL.INCR, this.GL.KEEP );
	this.GL.stencilOpSeparate( this.GL.FRONT, this.GL.KEEP, this.GL.DECR, this.GL.KEEP );


	// front then back

	this.GL.cullFace( this.GL.FRONT );
	this.renderDictionary( this.renderListShadowVolumes, 1 );
					
	this.GL.cullFace( this.GL.BACK );
	this.renderDictionary( this.renderListShadowVolumes, 1 );


	// color


	this.GL.disable( this.GL.POLYGON_OFFSET_FILL );
	this.GL.colorMask( true, true, true, true );
	this.GL.stencilFunc( this.GL.NOTEQUAL, 0, 0xFF );
	this.GL.stencilOp( this.GL.KEEP, this.GL.KEEP, this.GL.KEEP );
    this.GL.disable( this.GL.DEPTH_TEST );

	this.shadowBatch.loadProgram();
	this.shadowBatch.loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten32());
	this.shadowBatch.render();	
	
	return;
	
	
	// sort transparent

	var transparentList       = this.renderDictionaryTransparent.list;
	var transparentListLength = transparentList.length;
	var temp;

	for( var t = 0; t < transparentListLength - 1; t++ ) {
		
		for( var c = t + 1; c < transparentListLength; c++ ) {
			
			if( transparentList[ t ].screenPosition.z > transparentList[ c ].screenPosition.z ) {
				
				temp                 = transparentList[ t ];
				transparentList[ t ] = transparentList[ c ];
				transparentList[ c ] = temp;
				
				transparentList[ t ].webGLSortListIndex = t;
				transparentList[ c ].webGLSortListIndex = c;
			}
		}
	}
	
	
	// draw transparent

	for( var t = 0; t < transparentListLength; t++ ) {
		
		var batches = transparentList[ t ].webGLBatches;
		
		for( var b = 0; b < batches.length; b++ ) {
			
			var batch = batches[ b ];
			
			batch.loadProgram();
			batch.loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix",     camera.inverseMatrix    .flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix3x3",  camera.inverseMatrix    .flatten323x3());
			batch.render();
		}
	}
}



THREE.WebGLRenderer.prototype.renderDictionary = function( dictionary, ambient ) {

	for( var programId in dictionary ) {
		
		var batches = dictionary[ programId ];

		for( var batchId in batches ) {
			
			var batch = batches[ batchId ];
			
			batch.loadProgram();
			batch.loadUniform( "uCameraPerspectiveMatrix", camera.perspectiveMatrix.flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix",     camera.inverseMatrix    .flatten32   ());
			batch.loadUniform( "uCameraInverseMatrix3x3",  camera.inverseMatrix    .flatten323x3());
			batch.loadUniform( "uDirectionalLight",        this.directionalLightFlat32 );
			batch.loadUniform( "uAmbientLight",            ambient );
	
			break;
		}
		
		
		// render batches
		
		for( var batchId in batches )
			batches[ batchId ].render();
	}
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
		THREE.WebGLBatchCompiler.compile( renderable, true );
	
	
		
	// add to shadow volumes
	
	if( renderable instanceof THREE.ShadowVolume ) {
		
		var batch;
		var programDictionary;
		
		for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
			
			batch             = renderable.webGLBatches[ b ];
			programDictionary = this.renderListShadowVolumes[ batch.programId ];
			
			if( programDictionary === undefined )
				programDictionary = this.renderListShadowVolumes[ batch.programId ] = {};
			 			
			programDictionary[ batch.id ] = batch;
		}
	}
	
	// add opaque object's batches
	
	else if( !renderable.webGLIsTransparent ) {
		
		var batch;
		var programDictionary;
		
		for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
			
			batch             = renderable.webGLBatches[ b ];
			programDictionary = this.renderDictionaryOpaque[ batch.programId ];
			
			if( programDictionary === undefined )
				programDictionary = this.renderDictionaryOpaque[ batch.programId ] = {};
			 			
			programDictionary[ batch.id ] = batch;
		}
	}

	// add transparent/partly transparent object's batches
	
	else {
		
		renderable.webGLSortListIndex = this.renderDictionaryTransparent.list.length;
		
		this.renderDictionaryTransparent[ renderable.webGLBatches[ 0 ].id ] = renderable;	// use 1st batch id as key
		this.renderDictionaryTransparent.list.push( renderable );
	}
};


THREE.WebGLRenderer.prototype.removeFromRenderList = function( renderable ) {
	
	// no need to remove if not added
	
	if( !renderable.webGLAddedToRenderList )
		return;
		
	renderable.webGLAddedToRenderList = false;


	// remove shadow volumes
	
	if( renderable instanceof THREE.ShadowVolume ) {
		
		for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
			
			var batch             = renderable.webGLBatches[ b ];
			var programDictionary = this.renderListShadowVolumes[ batch.programId ];
			
			if( programDictionary === undefined )
				return;
				
			if( programDictionary[ batch.id ] === undefined )
				return;
				
			delete programDictionary[ batch.id ];
		}
	}
	
	// remove batches
		
	else if( !renderable.webGLIsTransparent ) {
		
		for( var b = 0; b < renderable.webGLBatches.length; b++ ) {
			
			var batch             = renderable.webGLBatches[ b ];
			var programDictionary = this.renderDictionaryOpaque[ batch.programId ];
			
			if( programDictionary === undefined )
				return;
				
			if( programDictionary[ batch.id ] === undefined )
				return;
				
			delete programDictionary[ batch.id ];
		}
	}

	// remove transparent
	
	else {

		var id = renderable.webGLBatches[ 0 ].id;		// use first batch id as key
		
		if( this.renderDictionaryTransparent[ id ] === undefined )
			return;
		
		this.renderDictionaryTransparent.list.splice( renderable.webGLSortListIndex, 1 );
		delete this.renderDictionaryTransparent[ id ];
	}
}

/*
 * Read pixel
 */

THREE.WebGLRenderer.prototype.readPixel = function( x, y ) {


	//this.GL.framebufferRenderbuffer( this.GL.FRAMEBUFFER, this.GL.DEPTH_ATTACHMENT, this.GL.RENDERBUFFER, renderBuf );

	pixel = new Uint8Array( 4 );
	this.GL.readPixels( x, y, 1, 1, this.GL.RGBA, this.GL.UNSIGNED_BYTE, pixel );
	
	return pixel;
}

