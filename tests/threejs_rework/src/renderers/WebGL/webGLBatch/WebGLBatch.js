/*
 * Shader Program
 */

THREE.WebGLBatch = function()
{
}

THREE.WebGLBatch.prototype.init = function( args ) {
	
	// construct
	
	this.GL            = THREE.WebGLRendererContext;
 	this.program       = new THREE.WebGLBatchProgram       ( args.vertexShaderId, args.fragmentShaderId );
	this.uniforms      = THREE.WebGLBatchUniforms  .extract( this.program );
	this.attributes    = THREE.WebGLBatchAttributes.extract( this.program );
	this.attributesId  = THREE.WebGLBatchAttributesIdCounter++;
	this.textures      = [];
	this.uniformInputs = [];
	this.elements      = -1;
	this.elementsSize  = -1;
	

	this.id        = this.program.id;
	this.blendMode = args.blendMode !== undefined ? args.blendMode : "src";
	this.wireframe = args.wireframe !== undefined ? args.wireframe : false;
}

/*
 * Clone
 */

THREE.WebGLBatch.prototype.initFrom = function( batch ) {
	
	this.GL       		= batch.GL;
	this.program  		= batch.program;
	this.attributes 	= batch.attributes;
	this.attributesId   = batch.attributesId;
	this.textures 		= batch.textures;
	this.elements 		= batch.elements;
	this.elementsSize 	= batch.elementsSize;
	this.id 			= batch.id;
	this.blendMode 		= batch.blendMode;
	this.wireframe 		= batch.wireframe;

	// mesh specifics

	this.uniforms            = [];
	this.uniforms.dictionary = {};
	this.uniformInputs       = [];

	for( var u = 0; u < batch.uniforms.length; u++ )
	{
		this.uniforms[ u ] = { name:     batch.uniforms[ u ].name,
							   type:     batch.uniforms[ u ].type,
							   location: batch.uniforms[ u ].location };
							   
		this.uniforms.dictionary[ batch.uniforms[ u ].name ] = this.uniforms[ u ];
	}
}


/*
 * Render
 */	

THREE.WebGLBatch.prototype.render = function() {
	
	if( this.attributesId !== THREE.WebGLBatchCurrentAttributesId ) 
		this.bindAttributeBuffers();
	if( this.textures.length !== 0 ) 
		this.bindTextures();

	this.loadUniformInputs();

	// draw elements

    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, this.elements );
    this.GL.drawElements( this.GL.TRIANGLES, this.elementsSize, this.GL.UNSIGNED_SHORT, 0 );
}


THREE.WebGLBatch.prototype.bindAttributeBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.bindBuffer( this.GL.ARRAY_BUFFER, this.attributes[ a ].buffer );
	    this.GL.vertexAttribPointer( this.attributes[ a ].location, this.attributes[ a ].size, this.GL.FLOAT, false, 0, 0 );
	}
	
	THREE.WebGLBatchCurrentAttributesId = this.attributesId;
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

THREE.WebGLBatch.prototype.bindTextures = function() {
	
	for( var t = 0; t < this.textures.length; t++ ) {
		
	    this.GL.activeTexture( this.GL[ "TEXTURE" + t ] );
	    this.GL.bindTexture  ( this.GL.TEXTURE_2D, this.textures[ t ].buffer );
	    this.GL.uniform1i    ( this.textures[ t ].location, t );
	}
}

/*
 * Add Uniform
 */

THREE.WebGLBatch.prototype.addUniformInput = function( name, type, scope, variable ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined && this.uniforms.dictionary[ name ].type === type ) {
		
		this.uniforms.dictionary[ name ].scope      = scope;
		this.uniforms.dictionary[ name ].variable   = variable;
		this.uniforms.dictionary[ name ].isFunction = typeof scope[ variable ] === "function" ? true : false;	
		
		this.uniformInputs.push( this.uniforms.dictionary[ name ] );
		
		return;
	}
	
	console.log( "Warning: WebGLBatch.addUniformInput: name/type mismatch: " + name + "/" + type + " program: " + this.program.id );
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
	
	console.log( "Warning: WebGLBatch.addAttributeBuffer: name/type mismatch: " + name + "/" + type + " program: " + this.program.id );
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

	console.log( "Warning: WebGLBatch.addTexture: name/type mismatch: " + name + "/sampler program: " + this.program.id );
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
			this.GL.uniformVec3( location, data );
	     	break; 
	}
}




THREE.WebGLBatchAttributesIdCounter = 0;
THREE.WebGLBatchCurrentAttributesId = -1;
