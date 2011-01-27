/*
 * Helper to extract all uniforms out of a shader program
 */

THREE.ShaderProgramUniforms = function( GL, program ) {
	
	//--- construct ---
	
	this.GL       = GL;
	this.program  = program;
	
	return extractUniforms();
	
	
	//--- methods ---
	
	function extractUniforms() {

		var uniforms = [];
		
		for( var i = 0; i < THREE.Shader.uniforms.length; i++ )
			if( uniformExists( THREE.Shader.uniforms[ i ] ))
				uniforms.push( addUniform( THREE.Shader.uniforms[ i ] ));
				
		return uniforms;
	}


	function uniformExists( info ) {

		var name = info.name;
		if( info.type.indexOf( "Array" ) !== -1 ) name = name + "[0]";
			
		var location = this.GL.getUniformLocation( this.program, name );
		
		if( location === null || location === -1 || location === undefined )
			return false;
		else
			return true;
	}
	
	
	function addUniform( info ) {
		
		if( info.type.indexOf( "Array" ) === -1 ) {

			return {
				
				location:	this.GL.getUniformLocation( this.program, info.name ),
				name:		info.name,
				type: 		info.type
			}		
		}
		else {

			var index = 0;
			var locations = [];
			
			while( true ) {
				
				var location = this.GL.getUniformLocation( this.program, info.name + "[" + index + "]" );
				index = index + 1;
				
				if( location !== null && location !== -1 && location !== undefined )
					locations.push( location );
				else
					break;
			}
			
			return {
				
				location:	locations,
				name:		info.name,
				type:		info.type
			}
		}
	}
	
}
