/*
 * Shader Program
 */

THREE.WebGLBatch = function( args )
{
	// construct
	
	this.GL           = THREE.WebGLRendererContext;
 	this.program      = new THREE.WebGLBatchProgram       ( this.GL, args.vertexShaderId, args.fragmentShaderId );
	this.uniforms     = THREE.WebGLBatchUniforms  .extract( this.program.program );
	this.attributes   = THREE.WebGLBatchAttributes.extract( this.program.program );
	this.elements     = -1;
	this.elementsSize = -1;

	this.id        = this.program.id;
	this.blendMode = args.blendMode !== undefined ? args.blendMode : "src";
	this.wireframe = args.wireframe !== undefined ? args.wireframe : false;
};


/*
 * Add Uniform
 */

THREE.WebGLBatch.prototype.addUniformInput = function( name, type, scope, variable ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined && this.uniforms.dictionary[ name ].type === type ) {
		
		this.uniforms.dictionary[ name ].scope    = scope;
		this.uniforms.dictionary[ name ].variable = variable;		
		
		return;
	}
	
	console.log( "Warning: ShaderProgram.addUniformInput: name and type didn't match for " + name + " of type " + type + " in program " + this.program.id );
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
	
	console.log( "Warning: ShaderProgram.addAttributeBuffer: name and type didn't match for " + name + " of type " + type + " in program " + this.program.id );
};


/*
 * Add Element Buffer
 */

THREE.WebGLBatch.prototype.addElementBuffer = function( buffer, size ) {
	
	this.elements     = buffer;
	this.elementsSize = size; 
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


/*
 * Render
 */	

THREE.WebGLBatch.prototype.render = function() {
	
	this.loadUniformInputs();
	this.bindAttributeBuffers();
	this.bindTextures();

	// draw elements

    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, this.elements );
    this.GL.drawElements( this.GL.TRIANGLES, this.elementsSize, this.GL.UNSIGNED_SHORT, 0 );
}


THREE.WebGLBatch.prototype.bindAttributeBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.bindBuffer( this.GL.ARRAY_BUFFER, this.attributes[ a ].buffer );
	    this.GL.vertexAttribPointer( this.attributes[ a ].location, this.attributes[ a ].size, this.GL.FLOAT, false, 0, 0 );
	}
}
	
	
THREE.WebGLBatch.prototype.loadUniformInputs = function() {
	
	for( var i = 0; i < this.uniforms.length; i++ ) {
		
		var scope    = this.uniforms[ i ].scope;
		var variable = this.uniforms[ i ].variable;
		
		if( scope !== undefined ) {
			
			if( typeof scope[ variable ] === "function" )
				this.loadUniform( this.uniforms[ i ].name, scope[ variable ]() );
			else
				this.loadUniform( this.uniforms[ i ].name, scope[ variable ] );
		}
	}
}

THREE.WebGLBatch.prototype.bindTextures = function() {
	
	//this.GL.activeTexture( texture.GLTextureId );
	//this.GL.bindTexture  ( this.GL.TEXTURE_2D, texture.GLTexture );
}
	
