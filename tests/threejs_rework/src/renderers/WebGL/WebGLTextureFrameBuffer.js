/**
 * @author Mikael Emtinger
 */


THREE.WebGLTextureFrameBuffer = function( width, height ) {
	
	this.width        = width  !== undefined ? width  : 512;
	this.height       = height !== undefined ? height : 512;
	this.GL           = THREE.WebGLRenderer.Cache.currentGL;
	this.frameBuffer  = this.GL.createFramebuffer();
	this.texture      = this.GL.createTexture();
	this.renderbuffer = this.GL.createRenderbuffer();
	
	
	this.GL.bindFramebuffer( this.GL.FRAMEBUFFER, this.frameBuffer );
	this.GL.bindTexture( this.GL.TEXTURE_2D, this.texture );
	this.texParameteri( this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST );
	this.texParameteri( this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST );
    //this.generateMipmap(gl.TEXTURE_2D);

	this.GL.texImage2D( this.GL.TEXTURE_2D, 0, this.GL.ALPHA, this.width, this.height, 0, this.GL.ALPHA, this.GL.UNSIGNED_BYTE, null);

	this.GL.bindRenderbuffer( this.GL.RENDERBUFFER, this.renderbuffer );
	this.GL.renderbufferStorage( this.GL.RENDERBUFFER, this.DEPTH_COMPONENT16, this.width, this.height);

	this.GL.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
} 