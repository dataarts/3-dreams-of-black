/*
 * Helper to extract all uniforms out of a shader program
 */

THREE.WebGLBatchUniforms = (function() {

	var GL;
	var program;
	
	//--- construct ---
	
	var extract = function( incomingProgram ) {
		
		GL       = THREE.WebGLRenderer.Cache.currentGL;
		program  = incomingProgram.program;
		
		return extractUniforms();
	}
	
	
	
	//--- methods ---
	
	function extractUniforms() {

		var uniforms = [];
		
		for( var i = 0; i < THREE.WebGLShaderDefinitions.uniforms.length; i++ )
			if( uniformExists( THREE.WebGLShaderDefinitions.uniforms[ i ] ))
				uniforms.push( addUniform( THREE.WebGLShaderDefinitions.uniforms[ i ] ));

		uniforms.dictionary = {};
		
		for( var i = 0; i < uniforms.length; i++ )
			uniforms.dictionary[ uniforms[ i ].name ] = uniforms[ i ];
				
		return uniforms;
	}


	function uniformExists( info ) {

		var name = info.name;
		if( info.type.indexOf( "Array" ) !== -1 ) name = name + "[0]";
			
		var location = GL.getUniformLocation( program, name );
		
		if( location === null || location === -1 || location === undefined )
			return false;
		else
			return true;
	}
	
	
	function addUniform( info ) {
		
		if( info.type.indexOf( "Array" ) === -1 ) {

			return {
				
				location:	GL.getUniformLocation( program, info.name ),
				name:		info.name,
				type: 		info.type
			}		
		}
		else {


			var index = 0;
			var locations = [];
			
			while( true ) {
				
				var location = GL.getUniformLocation( program, info.name + "[" + index + "]" );
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
	
	
	//--- public ---
	
	return {
		
		extract: extract
	}
}());
