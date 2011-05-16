/**
 * @author Mikael Emtinger
 */

WaterfallShader = {
	
	geometry: undefined,
	materials: [],
	
	createWaterfall: function( shrinkTop ) {

		if( WaterfallShader.geometry === undefined ) {
			
			// create geo
			
			var geometry = new THREE.Geometry();
			var v, f, fl = 800;
			var faces = geometry.faces;
			var vertices = geometry.vertices;
			var vertex;
			var time = WaterfallShader.attributes.time.value;
			var direction = WaterfallShader.attributes.direction.value;
			var darkness = WaterfallShader.attributes.darkness.value;
			var size = WaterfallShader.attributes.size.value;
			var t, d, s;

			for( f = 0; f < fl; f++ ) {

				// faces
	
				faces.push( new THREE.Face3( f * 4 + 0, f * 4 + 1, f * 4 + 2 ));
				faces.push( new THREE.Face3( f * 4 + 0, f * 4 + 2, f * 4 + 3 ));
				faces.push( new THREE.Face3( f * 4 + 0, f * 4 + 3, f * 4 + 1 ));
				faces.push( new THREE.Face3( f * 4 + 3, f * 4 + 2, f * 4 + 1 ));
	
	
				// direction added to particle to create pyramid
	
				direction.push( new THREE.Vector3(  0.0 + Math.random()*0.2,  0.7 + Math.random()*0.2,  1.3 + Math.random()*0.2 ));
				direction.push( new THREE.Vector3( -1.0 + Math.random()*0.2,  0.7 + Math.random()*0.2, -0.7 + Math.random()*0.2 ));
				direction.push( new THREE.Vector3(  1.0 + Math.random()*0.2,  0.7 + Math.random()*0.2, -0.7 + Math.random()*0.2 ));
				direction.push( new THREE.Vector3(  0.0 + Math.random()*0.2, -1.3 + Math.random()*0.2,  0.0 + Math.random()*0.2 ));

	
				// set end position of particle

				vertex = new THREE.Vertex();
	
				vertex.position.x = Math.random() * 240 - 120;	
				vertex.position.y = -5800;
				vertex.position.z = Math.random() * 240 - 120;
	
				vertices.push( vertex );
				vertices.push( vertex );
				vertices.push( vertex );
				vertices.push( vertex );


				// time

				t = Math.random();

				time.push( t );
				time.push( t );
				time.push( t );
				time.push( t );

				
				// darkness
				
				d = Math.random() * 0.3 + 0.7;

				darkness.push( d * ( Math.random() * 0.4 + 0.6 ));
				darkness.push( d * ( Math.random() * 0.4 + 0.6 ));
				darkness.push( d * ( Math.random() * 0.4 + 0.6 ));
				darkness.push( d * ( Math.random() * 0.4 + 0.6 ));
				
				
				// size
				
				s = Math.random() * 30 + 5;
				
				size.push( s );
				size.push( s );
				size.push( s );
				size.push( s );
				
				
			}
			
			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();
			geometry.boundingSphere.radius = 5000;
			
			WaterfallShader.geometry = geometry;
			
		}


		// create material

		var material = new THREE.MeshShaderMaterial( { uniforms: WaterfallShader.uniforms( shrinkTop ),
													   attributes: WaterfallShader.attributes,
													   vertexShader: WaterfallShader.vertexShader,
													   fragmentShader: WaterfallShader.fragmentShader,
													   lights: false,
													   fog: false } );

		var mesh = new THREE.Mesh( WaterfallShader.geometry, material );
		mesh.doubleSided = true;
		
		WaterfallShader.materials.push( material );
		
		return mesh;
	},

	update: function( delta, skyWhite ) {

		for( var i = 0; i < WaterfallShader.materials.length; i++ ) {
			
			WaterfallShader.materials[ i ].uniforms.globalTime.value += delta * 0.00012;
			WaterfallShader.materials[ i ].uniforms.skyWhite.value = skyWhite !== undefined ? skyWhite : 1.0;
			
		}
		
	},
	

	uniforms: function( shrinkTop ) {  

		shrinkTop = shrinkTop !== undefined ? Math.max( 0, Math.min( 1.0, shrinkTop )) : 0;

		var uniform = {
			
			"globalTime": { type: "f", value: 0.0 },
			"skyWhite": { type: "f", value: 1 },
			"shrinkTop": { type: "f", value: shrinkTop }
			
		};


		return uniform;
	},
	
	
	attributes: {
		
		"time": { type: "f", boundTo: "vertices", value: [] },
		"darkness": { type: "f", boundTo: "faces", value: [] },
		"direction": { type: "v3", boundTo: "vertices", value: [] },
		"size": { type: "f", boundTo: "vertices", value: [] }
		
	},


	vertexShader: [

		"const float 	PI 			= 3.14159265;",
		"const vec3 	BASECOLOR 	= vec3(  16.0 / 255.0,  93.0 / 255.0, 118.0 / 255.0 );",
		"const vec3     HIGHLIGHT   = vec3( 235.0 / 255.0, 237.0 / 255.0, 245.0 / 255.0 );",
		"const vec3 	ENDCOLOR 	= vec3( 99.00 / 255.0, 239.0 / 255.0, 253.0 / 255.0 );",

		"uniform 	float	globalTime;",
		"uniform    float   shrinkTop;",

		"attribute 	float	time;",
		"attribute 	float	darkness;",
		"attribute 	float	size;",
		"attribute 	vec3	direction;",
		

		"varying 	vec3 	vWorldVector;",
		"varying 	vec3	vColor;",

		"void main() {",

			"float localTime = time + globalTime;",
			"float modTime = mod( localTime, 1.0 );",
			"float accTime = modTime * modTime;",
			"vec2 pulse = vec2( sin( localTime * 2.0 ) * 20.0, cos( localTime * 2.0 ) * 20.0 );",

			// color
			
			"vColor = mix( BASECOLOR * darkness, ENDCOLOR * darkness, modTime );",
			"vColor = mix( vColor, HIGHLIGHT, 1.0 - smoothstep( 0.0, 0.25, abs( modTime - ( sin( globalTime ) * 0.2 * darkness + 0.5 ))));",


			// position

			"vec3 animated = vec3( position.x + pulse.x, position.y * accTime, position.z + pulse.y );",
			
			"animated.x -= ( 1.0 - accTime ) * shrinkTop * animated.x;",			
			"animated.z -= ( 1.0 - accTime ) * shrinkTop * animated.z;",			
			
			
			// rotate

			"vec3 rotatedDirection;",
			"float rotation = modTime * size;",
			"float cosRot = cos( rotation );",
			"float sinRot = sin( rotation );",
			"rotatedDirection.x = ( cosRot * direction.x - sinRot * direction.y );",
			"rotatedDirection.y = ( sinRot * direction.x + cosRot * direction.y );",
			"rotatedDirection.z = direction.z;",
			
			
			// expand and pulse
			
			"animated += rotatedDirection * size * ( sin( localTime * 150.0 ) * 0.1 + 1.1 );",
			
			
			// project

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( animated, 1.0 );",
			"vWorldVector = ( vec3( objectMatrix * vec4( animated, 1.0 )).xyz - cameraPosition ) * vec3( 0.01, 0.02, 0.01 );",
		"}"

	].join("\n"),


	fragmentShader: [

		"const   	vec3 	skyBlue = vec3( -0.37, -0.05, 0.15 );",
		"const 	 	vec3 	cloudMix = vec3( 0.83 * 0.83, 0.69 * 0.69, 0.51 * 0.51 );",

		"uniform 	float 	skyWhite;",

		"varying 	vec3 	vWorldVector;",
		"varying 	vec3	vColor;",

		"void main() {",

			"float f;",
			"vec3 normal;",
			"vec3 sky_color;",
			
			// fog

			"const float viewDistance = 6000.0 * 2.0;", // tile size is 6000 and we'd like to see 2 tiles ahead
			"float fogFactor = clamp(( gl_FragCoord.z / gl_FragCoord.w ) / viewDistance, 0.0, 1.0 );",
			"fogFactor *= fogFactor;",


			// mix sky color and fog

			"f = max( 0.0, normalize( vWorldVector ).y + cameraPosition.y * 0.0002 - 0.05 );",
			"sky_color = mix( vec3( skyWhite ), skyBlue, f );",

			"gl_FragColor = vec4( vColor, 1.0 );",
			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n")
	
}
