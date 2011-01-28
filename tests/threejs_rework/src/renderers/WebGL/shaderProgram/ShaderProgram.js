/*
 * Shader Program
 */

THREE.ShaderProgram = function( args )
{
	// construct
	
	this.GL           = THREE.RendererWebGLContext;
 	this.program      = new THREE.ShaderProgramProgram       ( this.GL, args.vertexShaderId, args.fragmentShaderId );
	this.uniforms     = THREE.ShaderProgramUniforms  .extract( this.program.program );
	this.attributes   = THREE.ShaderProgramAttributes.extract( this.program.program );
	this.elements     = -1;
	this.elementsSize = -1;

	this.id        = this.program.id;
	this.blendMode = args.blendMode !== undefined ? args.blendMode : "src";
	this.wireframe = args.wireframe !== undefined ? args.wireframe : false;
};


/*
 * Add Uniform
 */

THREE.ShaderProgram.prototype.addUniformInput = function( name, type, scope, variable ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined ) {
		
		this.uniforms.dictionary[ name ].scope    = scope;
		this.uniforms.dictionary[ name ].variable = variable;		
		
		return;
	}
	
	console.log( "Warning: ShaderProgram.addUniformInput: name and type didn't match for " + name + " of type " + type + " in program " + this.program.id );
};


/*
 * Add Attribute Buffer
 */

THREE.ShaderProgram.prototype.addAttributeBuffer = function( name, type, buffer, size ) {
	
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

THREE.ShaderProgram.prototype.addElementBuffer = function( buffer, size ) {
	
	this.elements     = buffer;
	this.elementsSize = size; 
}



/*
 * Load Program
 */
	
THREE.ShaderProgram.prototype.loadProgram = function() {
		
    this.GL.useProgram( this.program.program );
}


/*
 * Load Uniform
 */

THREE.ShaderProgram.prototype.loadUniform = function( name, data ) {
	
	if( this.uniforms.dictionary[ name ] !== undefined ) {
		
		var uniform = this.uniforms.dictionary[ name ];
		
		if( uniform.name.indexOf( "Array" === -1 )) {
			
			this.doLoadUniform( uniform.type, uniform.location, data );
		}
		else {

			for( var l = 0; l < uniform.location.length && l < data.length; l++ )
				this.doLoadUniform( uniform.type, uniform.location[ l ], data[ l ] );			
		}
	}
}

THREE.ShaderProgram.prototype.doLoadUniform = function( type, location, data ) {

	switch( type ) 
	{ 
	   case "mat3": 
			this.GL.uniformMatrix3fv( location, false, new Float32Array( data ));
	     	break; 

	   case "mat4": 
			this.GL.uniformMatrix4fv( location, false, new Float32Array( data ));
	     	break; 

	   case "1i": 
			this.GL.uniform1i( location, data );
	     	break; 

	   case "1f": 
			this.GL.uniform1f( location, data );
	     	break; 

	   case "vec3": 
			this.GL.uniformVec3( location, data );
	     	break; 
	}
}


/*
 * Render
 */	

THREE.ShaderProgram.prototype.render = function() {
	
	this.loadUniformInputs();
	this.bindAttributeBuffers();
	this.bindTextures();

	// draw elements

    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, this.elements );
    this.GL.drawElements( this.GL.TRIANGLES, this.elementsSize, this.GL.UNSIGNED_SHORT, 0 );
}


THREE.ShaderProgram.prototype.bindAttributeBuffers = function() {
	
	for( var a = 0; a < this.attributes.length; a++ ) {
		
	    this.GL.bindBuffer( this.GL.ARRAY_BUFFER, this.attributes[ a ].buffer );
	    this.GL.vertexAttribPointer( this.attributes[ a ].buffer, this.attributes[ a ].size, this.GL.FLOAT, false, 0, 0 );
	}
}
	
THREE.ShaderProgram.prototype.loadUniformInputs = function() {
	
	for( var i = 0; i < this.uniforms.length; i++ ) {
		
		if( this.uniforms[ i ].scope !== undefined ) {
			
			// HACK! Need to find better way to access input
			
			if( this.uniforms[ i ].scope[ this.uniforms[ i ].variable ].flatten !== undefined ) {
				
				this.loadUniform( this.uniforms[ i ].name, this.uniforms[ i ].scope[ this.uniforms[ i ].variable ].flatten());
				continue;
			}
			
			// END HACK!
			
			this.loadUniform( this.uniforms[ i ].name, this.uniforms[ i ].scope[ this.uniforms[ i ].variable ] );
		}
	}
}

THREE.ShaderProgram.prototype.bindTextures = function() {
	
	//this.GL.activeTexture( texture.GLTextureId );
	//this.GL.bindTexture  ( this.GL.TEXTURE_2D, texture.GLTexture );
}
	
