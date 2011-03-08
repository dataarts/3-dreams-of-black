/*
 * Helper to extract all existing attributes out of a shader program
 */

THREE.WebGLBatchAttributes = (function() {

	var GL;
	var program;

	//--- construct ---

	var extract = function( incomingProgram ) {
		
		GL      = THREE.WebGLRenderer.Cache.currentGL;
		program = incomingProgram.program;
		
		return extractAttributes();
	}

		
	//--- methods ---
	
	function extractAttributes() {

		var attributes = [];

		for( var i = 0; i < THREE.WebGLShaderDefinitions.attributes.length; i++ )
			if( attributeExists( THREE.WebGLShaderDefinitions.attributes[ i ] ))
				attributes.push( addAttribute( THREE.WebGLShaderDefinitions.attributes[ i ] ));
				
		attributes.dictionary = {};
		
		for( var i = 0; i < attributes.length; i++ )
			attributes.dictionary[ attributes[ i ].name ] = attributes[ i ];
			
		return attributes;
	}

	function attributeExists( info ) {

		var location = GL.getAttribLocation( program, info.name );
		
		if( location !== -1 && location !== null && location !== undefined )
			return true;
		else
			return false;
	}
	
	function addAttribute( info ) {
		
		var location = GL.getAttribLocation( program, info.name );
		//GL.enableVertexAttribArray( location );
		
		return {
			
			location: location,
			type:	  info.type,
			name:	  info.name
		}
	}
	
	//--- public ---
	
	return {
		
		extract: extract
	}
	
}());
