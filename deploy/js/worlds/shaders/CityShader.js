
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

	init: function() {
		
		//CityShader.uniforms.grassImage.texture = THREE.ImageUtils.loadTexture( '/files/textures/CityShader_Grass.jpg' );
		//CityShader.uniforms.surfaceImage.texture = THREE.ImageUtils.loadTexture( '/files/textures/CityShader_Clouds.jpg' );
		
	},

	uniforms: {

		//"grassImage": { type: "t", value: 0, texture: undefined },
		//"surfaceImage": { type: "t", value: 1, texture: undefined },

		//"time": { type: "f", value:0.0 },

		//"targets": { type: "fv", value: [] },
		//"radiuses": { type: "fv1", value: [] }

	},

	vertexShader: [

		//"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		//"varying vec3 vNormalsquare;",

		"void main() {",

			//"vec3 transformedNormal = normalize( normalMatrix * normal );",
			//"vNormalsquare = transformedNormal * transformedNormal;",
			
			"vColor = color;",

			//"vWorldPosition = vec3( objectMatrix * vec4( position, 1.0 )).xyz;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		//"uniform sampler2D grassImage;",
		//"uniform sampler2D surfaceImage;",

		//"const 	 int  	NUMTARGETS = " + CityShaderEffectors.length + ";",
		//"uniform vec3 	targets[ NUMTARGETS ];",
		//"uniform float 	radiuses[ NUMTARGETS ];",

		//"uniform float time;",

		//"varying vec3 vWorldPosition;",
		"varying vec3 vColor;",
		//"varying vec3 vNormalsquare;",

		"void main() {",

			//"float distance = -9999999.0;",
			
			//"for( int i = 0; i < NUMTARGETS; i++ ) {",
				//"distance = max( distance, length( vWorldPosition - targets[ i ].xyz ) * -1.0 / radiuses[ i ] );",
			//"}",

			//"vec3 worldPosition = vWorldPosition * 0.0005;",
			//"vec4 grass = texture2D( grassImage, worldPosition.yz * vec2(10.0)) * vNormalsquare.xxxx + ",
			//             "texture2D( grassImage, worldPosition.xz * vec2(10.0)) * vNormalsquare.yyyy + ",
			//             "texture2D( grassImage, worldPosition.xy * vec2(10.0)) * vNormalsquare.zzzz;",
			
			//"distance += ( 0.5 + grass.g ) * texture2D( surfaceImage, worldPosition.zx * vec2( 3.0 )).g;",

			"vec3 surface = vec3( 0.15 * 2.0, 0.18 * 2.0, 0.2 * 2.0 );",

			//"if( distance > 0.0 )",
			//	"surface = grass.rgb;",

			"float depth = ( gl_FragCoord.z / gl_FragCoord.w ) * 0.0001;",

			"gl_FragColor = vec4( surface * vColor * 2.0, 1.0 );",
//clouds:			"gl_FragColor = mix( gl_FragColor * texture2D( surfaceImage, worldPosition.zx * vec2( 0.4 ) + vec2( time )), gl_FragColor, 0.8 );",
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

	updateCityShader( 0 );

	var shaderParams = {

//		uniforms: CityShader.uniforms,
		vertexShader: CityShader.vertexShader,
		fragmentShader: CityShader.fragmentShader,
		
		shading: THREE.FlatShading,
		vertexColors: THREE.VertexColors

	};

//	shaderParams.uniforms[ 'grassImage' ].texture.wrapS = THREE.RepeatWrapping;
//	shaderParams.uniforms[ 'grassImage' ].texture.wrapT = THREE.RepeatWrapping;
//	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapS = THREE.RepeatWrapping;
//	shaderParams.uniforms[ 'surfaceImage' ].texture.wrapT = THREE.RepeatWrapping;
	
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


function updateCityShader( delta ) {
	
	/*
	var effector, e, el = CityShaderEffectors.length;
	var p, pos = CityShader.uniforms.targets.value;
	var r, rad = CityShader.uniforms.radiuses.value;
	
	for( p = 0, r = 0, e = 0; e < el; e++ ) {
		
		effector = CityShaderEffectors[ e ];
		
		pos[ p++ ] = effector.x;
		pos[ p++ ] = effector.y;
		pos[ p++ ] = effector.z;
		rad[ r++ ] = effector.w;
		
	}
	
	CityShader.uniforms.time.value += delta / 10000;
*/
};

