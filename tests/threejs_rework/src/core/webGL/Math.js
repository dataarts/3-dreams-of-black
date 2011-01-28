/* 
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * version 0.9.5
 */
 
/*
 * Copyright (c) 2010 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

/*
 * The original glMatrix code has been split up into Matrix3.js, 
 * Matrix4.js, Vector3.js, Vector4.js and Quaternion.js and (heavliy) refactored
 * to match the DDD framework. 
 * 
 * A SLERP function has been added to Quaternion.js
 * 
 * Modifications was made by Mikael Emtinger
 * 
 */


THREE.Math = (function() {

	//--- variables ---

	var that;
	
	
	//--- construct ---
	
	that = {};
	
	
	// init array type
	
	if( typeof Float32Array != 'undefined' ) {
 
        that.GLArray = function(size) {
			return new Float32Array( size );
		};
	} 
	else {
		
        that.GLArray = function( size ) {
			return new Array( size );
		};
	}
	
	return that;
}());
