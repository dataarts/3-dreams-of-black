
/*
 * Positions of grass (xyzr)
 */

var CityShaderEffectors = [ new THREE.Vector4( 0, 0, -1000, 50 ), 
							new THREE.Vector4( -100, 0, -1500, 150 ), 
							new THREE.Vector4( 100, 0, -2000, 150 ), 
							new THREE.Vector4( 0, 0, -2500, 100 ) ];


/*
 * Shader
 */

var CityShader = {

	vertexShader: [

		"varying vec3 vColor;",

		"void main() {",

			"vColor = color;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"varying vec3 vColor;",

		"void main() {",

			"vec3 surface = vec3( 0.15 * 2.0, 0.18 * 2.0, 0.2 * 2.0 );",

			"float depth = ( gl_FragCoord.z / gl_FragCoord.w ) * 0.0001;",

			"gl_FragColor = vec4( surface * vColor * 2.0, 1.0 );",
			"gl_FragColor = vec4( mix( gl_FragColor.rgb, vec3( 0.64, 0.88, 1 ), depth ), 1.0 );",	
		"}"

	].join("\n")

};


/*
 * Utils
 */

function applyCityShader( result, exclude ) {
	
	var i, name, geometry, obj, mat;

	var excludeMap = {};
	
	for ( i = 0; i < exclude.length; i++ ) {
		
		excludeMap[ exclude[ i ] ] = true;
		
	}

	var shaderParams = {

		vertexShader: CityShader.vertexShader,
		fragmentShader: CityShader.fragmentShader,
		
		shading: THREE.FlatShading,
		vertexColors: THREE.VertexColors

	};

	
	mat = new THREE.MeshShaderMaterial( shaderParams );
	
	
	// set material to all geo chunks

	for( name in result.objects ) {

		obj = result.objects[ name ];
		
		if ( excludeMap[ name ] ) continue;

		if( obj.geometry && obj.geometry.morphTargets.length === 0 ) {
			
			geometry = obj.geometry;
			
			for( i = 0; i < geometry.materials.length; i++ ) {
				
				obj.materials[ 0 ] = mat;

			}
			
		}
		
	}
	
	return mat;
	
};


