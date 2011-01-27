/*
 * Helper to extract all existing attributes out of a shader program
 */

THREE.ShaderProgramAttributes = function( GL, program ) {

	//--- construct ---

	this.GL      = GL;
	this.program = program;
	
	return extractAttributes();
	
	
	//--- methods ---
	
	function extractAttributes() {

		var attributes = [];

		for( var i = 0; i < THREE.Shaders.attributes.length; i++ )
			if( attributeExists( THREE.Shaders.attributes[ i ] ))
				attributes.push( addAttribute( THREE.Shaders.attributes[ i ] ))
	}

	function attributeExists( info ) {

		var location = this.GL.getAttribLocation( this.program, info.name );
		
		if( location !== -1 && location !== null && location !== undefined )
			return true;
		else
			return false;
	}
	
	function addAttribute( info ) {
		
		var location = this.GL.getAttribLocation( this.program, info.name );
		this.GL.enableVertexAttribArray( location );
		
		return {
			
			location: location,
			type:	  info.type,
			name:	  info.name
		}
	}
}
