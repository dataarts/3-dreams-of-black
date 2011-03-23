/*
 * Shader Program
 */

THREE.WebGLBatch = function( args )
{
	// copy?
	
	if( args instanceof THREE.WebGLBatch ) {
		
		this.GL       		= args.GL;
		this.program  		= args.program;
		this.attributes 	= args.attributes;
		this.attributesId   = args.attributesId;
		this.textures 		= args.textures;
		this.elements 		= args.elements;
		this.elementsSize 	= args.elementsSize;
		this.id 			= "webGLBatch" + THREE.WebGLBatchAttributesIdCounter++;
		this.programId      = args.programId;
		this.blendMode      = args.blendMode;
		this.wireframe 		= args.wireframe;
	
		// mesh specifics
	
		this.uniforms            = [];
		this.uniforms.dictionary = {};
		this.uniformInputs       = [];
	
		for( var u = 0; u < args.uniforms.length; u++ )
		{
			this.uniforms[ u ] = { name:     args.uniforms[ u ].name,
								   type:     args.uniforms[ u ].type,
								   location: args.uniforms[ u ].location };
								   
			this.uniforms.dictionary[ args.uniforms[ u ].name ] = this.uniforms[ u ];
		}
	}
	
	// create new
	
	else {
		
		this.GL            = THREE.WebGLRenderer.Cache.currentGL;
	 	this.program       = new THREE.WebGLBatchProgram( args.vertexShaderId, args.fragmentShaderId );
		this.uniforms      = THREE.WebGLBatchUniforms  .extract( this.program );
		this.attributes    = THREE.WebGLBatchAttributes.extract( this.program );
		this.attributesId  = THREE.WebGLBatchAttributesIdCounter++;
		this.textures      = [];
		this.uniformInputs = [];
		this.elements      = -1;
		this.elementsSize  = -1;
	
		this.programId = this.program.id;
		this.id        = "webGLBatch" + THREE.WebGLBatchIdCounter++;
		this.wireframe = args.wireframe !== undefined ? args.wireframe : false;
		this.blendMode = args.blendMode !== undefined ? args.blendMode : THREE.WebGLRendererBlendModes.none;
	}
}


/*
 * Render
 */	

THREE.WebGLBatch.prototype.render = function() {
	
	if( this.textures.length !== 0 ) {
		
		this.bindTextures();
	}


	this.loadUniformInputs();


	if( this.attributesId !== THREE.WebGLRenderer.Cache.currentAttributesId ) {
		
		this.bindAttributeBuffers();
		THREE.WebGLRenderer.Cache.currentAttributesId = this.attributesId;
	}
	else this.enableAttributeBuffers();
		

	if( this.elements !== THREE.WebGLRenderer.Cache.currentElementId ) {
		
	    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, this.elements );
		THREE.WebGLRenderer.Cache.currentElementId = this.elements;
	}
	
	
	if( this.blendMode === THREE.WebGLRendererBlendModes.none )
		this.GL.disable( this.GL.BLEND );
	else {
		
		this.GL.enable( this.GL.BLEND );
		this.GL.blendFunc( this.GL.SRC_ALPHA, this.GL.ONE );
		this.GL.blendEquation( this.GL.FUNC_REVERSE_SUBTRACT );
	}
	
    this.GL.drawElements( this.GL.TRIANGLES, this.elementsSize, this.GL.UNSIGNED_SHORT, 0 );

	this.disableAttributesBuffers();
}


THREE.WebGLBatch.prototype.bindAttributeBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.bindBuffer( this.GL.ARRAY_BUFFER, this.attributes[ a ].buffer );
	    this.GL.vertexAttribPointer( this.attributes[ a ].location, this.attributes[ a ].size, this.GL.FLOAT, false, 0, 0 );
	    this.GL.enableVertexAttribArray( this.attributes[ a ].location );
	}
}

THREE.WebGLBatch.prototype.enableAttributeBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.enableVertexAttribArray( this.attributes[ a ].location );
	}
}	

	
THREE.WebGLBatch.prototype.disableAttributesBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.disableVertexAttribArray( this.attributes[ a ].location );
	}
}	
	

THREE.WebGLBatch.prototype.bindTextures = function() {
	
	for( var t = 0; t < this.textures.length; t++ ) {
		
	    this.GL.activeTexture( this.GL[ "TEXTURE" + t ] );
	    this.GL.bindTexture  ( this.GL.TEXTURE_2D, this.textures[ t ].buffer );
	    this.GL.uniform1i    ( this.textures[ t ].location, t );
	}
}

	
THREE.WebGLBatch.prototype.loadUniformInputs = function() {
	
	for( var i = 0; i < this.uniformInputs.length; i++ ) {
		
		var input    = this.uniformInputs[ i ];
		var scope    = input.scope;
		var variable = input.variable;
		
		if( input.isFunction )
			this.loadUniform( input.name, scope[ variable ]() );
		else
			this.loadUniform( input.name, scope[ variable ] );
	}
}


/*
 * Add Uniform Input
 */

THREE.WebGLBatch.prototype.addUniformInput = function( name, type, scope, variable ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined && this.uniforms.dictionary[ name ].type === type ) {
		
		this.uniforms.dictionary[ name ].scope      = scope;
		this.uniforms.dictionary[ name ].variable   = variable;
		this.uniforms.dictionary[ name ].isFunction = typeof scope[ variable ] === "function" ? true : false;	
		
		this.uniformInputs.push( this.uniforms.dictionary[ name ] );
		
		return;
	}
	
//	console.log( "Warning: WebGLBatch.addUniformInput: name/type mismatch: " + name + "/" + type + " program: " + this.program.id );
};


/*
 * Add Attribute Buffer
 */

THREE.WebGLBatch.prototype.addAttributeBuffer = function( name, type, buffer, size ) {
	
	if( this.attributes.dictionary[ name ] !== undefined ) {
		
		this.attributes.dictionary[ name ].buffer = buffer;
		this.attributes.dictionary[ name ].size   = size;

		return;
	}
	
//	console.log( "Warning: WebGLBatch.addAttributeBuffer: name/type mismatch: " + name + "/" + type + " program: " + this.program.id );
};


/*
 * Add Element Buffer
 */

THREE.WebGLBatch.prototype.addElementBuffer = function( buffer, size ) {
	
	this.elements     = buffer;
	this.elementsSize = size; 
}


/*
 * Add Texture
 */

THREE.WebGLBatch.prototype.addTexture = function( name, buffer ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined ) {
		
		this.uniforms.dictionary[ name ].buffer = buffer;
		this.textures.push( this.uniforms.dictionary[ name ] );
		
		return;
	}

//	console.log( "Warning: WebGLBatch.addTexture: name/type mismatch: " + name + "/sampler program: " + this.program.id );
}  


/*
 * Load Program
 */
	
THREE.WebGLBatch.prototype.loadProgram = function() {
		
    this.GL.useProgram( this.program.program );
}


/*
 * Load Uniform
 */

THREE.WebGLBatch.prototype.loadUniform = function( name, data ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined ) {
		
		var uniform = this.uniforms.dictionary[ name ];
		
		if( uniform.type.indexOf( "Array" ) === -1 ) {
			
			this.doLoadUniform( uniform.type, uniform.location, data );
		}
		else {

			if( typeof data[ 0 ] === "function" ) {
				
				for( var l = 0; l < uniform.location.length && l < data.length; l++ )
					this.doLoadUniform( uniform.type, uniform.location[ l ], data[ l ]() );			
			}
			else {
				
				for( var l = 0; l < uniform.location.length && l < data.length; l++ )
					this.doLoadUniform( uniform.type, uniform.location[ l ], data[ l ] );			
			}
		}
	}
}

THREE.WebGLBatch.prototype.doLoadUniform = function( type, location, data ) {

	switch( type ) 
	{ 
	   case "mat3": 
	   case "mat3Array":
			this.GL.uniformMatrix3fv( location, false, data );
	     	break; 

	   case "mat4": 
	   case "mat4Array":
			this.GL.uniformMatrix4fv( location, false, data );
	     	break; 

	   case "1i":
	   case "1iArray": 
			this.GL.uniform1i( location, data );
	     	break; 

	   case "1f": 
	   case "1fArray": 
			this.GL.uniform1f( location, data );
	     	break; 

	   case "vec3": 
	   case "vec3Array": 
			this.GL.uniform3fv( location, data );
	     	break; 
	}
}

THREE.WebGLBatchIdCounter           = 0;
THREE.WebGLBatchAttributesIdCounter = 0;
