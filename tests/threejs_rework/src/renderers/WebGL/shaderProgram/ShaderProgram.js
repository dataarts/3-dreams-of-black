/*
 * Shader Program
 */

THREE.ShaderProgram = function( vertexShaderId, fragmentShaderId, blendMode )
{
	// construct
	
 	this.program      = THREE.ShaderProgramProgram   ( this.GL, vertexShaderId, fragmentShaderId );
	this.uniforms     = THREE.ShaderProgramUniforms  ( this.GL, this.program );
	this.attributes   = THREE.ShaderProgramAttributes( this.GL, this.program );
	this.elements     = -1;
	this.elementsSize = -1;

	this.id        = this.program.id;
	this.blendMode = blendMode !== undefined ? blendMode : "src";
};


/*
 * Add Uniform
 */

THREE.ShaderProgram.prototype.addUniformInput = function( name, type, scope, variable ) {
	
	for( var u = 0; u < this.uniforms.length; u++ ) {
		
		if( this.uniforms[ u ].name === name &&
			this.uniforms[ u ].type === type ) {
				
			this.uniforms[ u ].scope    = scope;
			this.uniforms[ u ].variable = variable;		
		}
	}

	console.log( "Warning: ShaderProgram.addUniformInput: name and type didn't match for " + name + " of type " + type + " in program " + this.program.id );
};


/*
 * Add Attribute Buffer
 */

THREE.ShaderProgram.prototype.addAttributeBuffer = function( name, type, buffer, size ) {
	
	for( var a = 0; a < this.attributes.lenght; a++ ) 
	{
		if( this.attributes[ aÊ].name === name &&
			this.attributes[ a ].type === type ) {
			
			this.attributes[ a ].buffer = buffer;
			return;
		}
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
		
    this.GL.useProgram( this.program );
}


/*
 * Render
 */

THREE.ShaderProgram.prototype.render = function() {
	
	/*
	var LoadUniforms = function( uniforms ) {

		
		
		for( uniform in uniforms ) {
			
			if( this.uniforms[ uniform ] != undefined && this.uniforms[ uniform ] != -1 ) {
				
				var data = uniforms[ uniform ];
				var type = uniforms[ uniform + "Type" ];
				
				if( data !== undefined && type !== undefined )
				{
					     if( type === "Float32Array"        ) loadUniformFloat32Array       ( uniform, data );
					else if( type === "Sampler2D"           ) loadUniformSampler2D          ( uniform, data );
					else if( type === "ArrayOfFloat32Array" ) loadUniformArrayOfFloat32Array( uniform, data );
					else if( type === "Float32"             ) loadUniformFloat32            ( uniform, data );
				}
				else DDD.Error( "ShaderProgram.LoadUniforms: Either data or type is undefined!" );
			}
		}
	}


	function loadUniformFloat32Array( uniform, data ) {
		
		if( data.length === 16 )
		    this.GL.uniformMatrix4fv( this.uniforms[ uniform ], false, data );
		else if( data.length === 9 )
		    this.GL.uniformMatrix3fv( this.uniforms[ uniform ], false, data );
	}

	
	function loadUniformArrayOfFloat32Array( uniform, data ) {

		if( this.uniforms[ uniform ].length !== undefined && data.length !== undefined ) {
			
			for( var i = 0; i < this.uniforms[ uniform ].length && i < data.length; i++ ) {
				
				if( data[ i ].length === 16 )
					this.GL.uniformMatrix4fv( this.uniforms[ uniform ][ i ], false, data[ i ] );
				else
					this.GL.uniform4fv( this.uniforms[ uniform ][ i ], data[ i ] );
			}
		}
	}


	function loadUniformSampler2D( uniform, data ) {
		
	}


	function loadUniformFloat32( uniform, data ) {
		
	}*/
}


/*
 * Render
 */	

THREE.ShaderProgram.prototype.render = function() {
	
	loadUniforms();
	bindAttributes();
	bindTextures();
	drawElements();

    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, elements );
    this.GL.drawElements( this.GL.TRIANGLES, size, this.GL.UNSIGNED_SHORT, 0 );
}

/*
	var LoadAttributes = function( attributes )
	{
		for( attribute in attributes ) {
			
			if( this.attributes[ attribute ] != undefined && this.attributes[ attribute ] != -1 ) {

			    this.GL.bindBuffer( this.GL.ARRAY_BUFFER, attributes[ attribute ] );
			    this.GL.vertexAttribPointer( this.attributes[ attribute ], attributes[ attribute + "Size" ], this.GL.FLOAT, false, 0, 0 );
			}
		}
	}
	
	
	
	var LoadTexture = function( texture ) {
		
    	this.GL.activeTexture( texture.GLTextureId );
    	this.GL.bindTexture  ( this.GL.TEXTURE_2D, texture.GLTexture );
	}
	
	
	
	var DrawElements = function( elements, size )
	{
	    this.GL.bindBuffer( this.GL.ELEMENT_ARRAY_BUFFER, elements );
	    this.GL.drawElements( this.GL.TRIANGLES, size, this.GL.UNSIGNED_SHORT, 0 );
	}
*/