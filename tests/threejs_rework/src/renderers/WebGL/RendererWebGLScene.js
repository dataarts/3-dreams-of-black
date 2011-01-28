THREE.RendererWebGL.Scene = {};

/*
 * Scebe Update
 */

THREE.RendererWebGL.Scene.update = function( camera ) {

	this.opaqueShaderProgramDictionary = {};
	this.transparentShaderProgramList  = [];
	this.supr.update.call( this, undefined, false, this, camera );
}


/*
 * Scene capture
 */

THREE.RendererWebGL.Scene.capture = function( renderable ) {
	
	if( renderable.shaderPrograms === undefined )
		THREE.ShaderProgramCompiler.compile( renderable );
		
		
	for( var s = 0; s < renderable.shaderPrograms.length; s++ ) {
		
		var shaderProgram = renderable.shaderPrograms[ s ];
		
		if( shaderProgram.blendMode === "src" ) {
			
			if( this.opaqueShaderProgramDictionary === undefined )
				this.opaqueShaderProgramDictionary[ shaderProgram.id ] = [];
			
			this.opaqueShaderProgramDictionary[ shaderProgram.id ].push( shaderProgram );
		}
		else {
			
			this.transparentShaderProgramList.push( shaderProgram );
		}
	}
};


