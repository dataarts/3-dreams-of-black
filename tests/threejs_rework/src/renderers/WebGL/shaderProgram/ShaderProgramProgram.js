/*
 * Helper for creating Shader Program and reuse if already exists
 */

THREE.ShaderProgramProgram = function( GL, vertexShaderId, fragmentShaderId ) {
	
	//--- Construct ---
	
	this.GL              = GL;
	this.vertexShader    = 0;
	this.fragmentShader  = 0;
	this.program         = 0;
	this.id              = vertexShaderId + "_" + fragmentShaderId;
	
	if( THREE.ShaderProgramDictionary[ id ] !== undefined )
		return THREE.ShaderProgramDictionary[ id ];
	
	initVertexShader  ( vertexShaderId   );
	initFragmentShader( fragmentShaderId );
	initShaderProgram();

	return this.program;
	
	
	//--- Methods ---
	
	function initVertexShader( id ) {
		
		this.vertexShader = this.GL.createShader( this.GL.VERTEX_SHADER );
		
		this.GL.shaderSource ( this.vertexShader, THREE.Shader.getShader( id ));
		this.GL.compileShader( this.vertexShader );

	    if( !this.GL.getShaderParameter( this.vertexShader, this.GL.COMPILE_STATUS ))
		{
			alert( "THREE.ShaderProgramProgram.InitVertexProgram: " + this.GL.getShaderInfoLog( this.vertexShader ));
			return;
		}
	}
	
	
	function initFragmentShader( id ) {
		
		this.fragmentShader = this.GL.createShader( this.GL.FRAGMENT_SHADER );
		
		this.GL.shaderSource ( this.fragmentShader, THREE.Shader.getShader( id ));
		this.GL.compileShader( this.fragmentShader );

	    if( !this.GL.getShaderParameter( this.fragmentShader, this.GL.COMPILE_STATUS )) 
		{
			alert( "THREE.ShaderProgramProgram.InitFragmentShader: " + this.GL.getShaderInfoLog( this.fragmentShader ));
			return;
		}
	}

	
	function initShaderProgram() {
		
	    this.program = this.GL.createProgram();
	
	    this.GL.attachShader( this.program, this.vertexShader );
	    this.GL.attachShader( this.program, this.fragmentShader );
	    this.GL.linkProgram ( this.program );

	    if( !this.GL.getProgramParameter( this.program, this.GL.LINK_STATUS ))
		{
			alert( "THREE.ShaderProgramProgram.InitShaderProgram: Could not initialise program" );
			return;
	    }
	}
}
