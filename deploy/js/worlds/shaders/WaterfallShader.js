/**
 * @author Mikael Emtinger
 */

WaterfallShader = {
	
	geometry: undefined,
	materia: undefined,
	
	createWaterfall: function() {

		if( WaterfallShader.geometry === undefined ) {
			
			// create geo
			
			var geometry = new THREE.Geometry();
			var v, f, fl = 4000;
			var faces = geometry.faces;
			var vertices = geometry.vertices;
			var vertex;
			var time = WaterfallShader.attributes.time.value;
			var direction = WaterfallShader.attributes.direction.value;
			var darkness = WaterfallShader.attributes.darkness.value;
			
			for( f = 0; f < fl; f++ ) {
	
				faces.push( new THREE.Face3( f * 3 + 0, f * 3 + 2, f * 3 + 1 ));
	
				time.push( Math.random() );
				darkness.push( Math.random() * 0.4 + 0.6 );
	
				direction.push( 0 );
				direction.push( 120 * Math.PI / 180 );
				direction.push( 240 * Math.PI / 180 );
	
	
				vertex = new THREE.Vertex();
	
				// set end position of particle
	
				vertex.position.x = Math.random() * 250 - 125;	
				vertex.position.y = -5900;
				vertex.position.z = Math.random() * 250 + 120;
	
				vertices.push( vertex );
				vertices.push( vertex );
				vertices.push( vertex );
				
			}
			
			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();
			geometry.boundingSphere.radius = 5000;
			
			// create material
	
			var material = new THREE.MeshShaderMaterial( { uniforms: WaterfallShader.uniforms,
														   attributes: WaterfallShader.attributes,
														   vertexShader: WaterfallShader.vertexShader,
														   fragmentShader: WaterfallShader.fragmentShader,
														   lights: false,
														   fog: false } );
			
			WaterfallShader.geometry = geometry;
			WaterfallShader.material = material;
			
		}


		var mesh = new THREE.Mesh( WaterfallShader.geometry, WaterfallShader.material );
		
		mesh.doubleSided = true;
		
		return mesh;
	},

	update: function( delta, skyWhite ) {
		
		WaterfallShader.uniforms.globalTime.value += delta * 0.00005;
		WaterfallShader.uniforms.skyWhite.value = skyWhite !== undefined ? skyWhite : 1.0;
		
	},
	

	uniforms: {  

		"globalTime": { type: "f", value: 0.0 },
		"skyWhite": { type: "f", value: 1 },

	},

	attributes: {
		
		"time": { type: "f", boundTo: "faces", value: [] },
		"direction": { type: "f", boundTo: "vertices", value: [] },
		"darkness": { type: "f", boundTo: "faces", value: [] }
		
	},

	vertexShader: [

		"const float 	PI 			= 3.14159265;",
		"const vec3 	BASECOLOR 	= vec3( 176.0 / 255.0, 223.0 / 255.0, 247.0 / 255.0 );",
		"const vec3 	ENDCOLOR 	= vec3(  74.0 / 255.0, 163.0 / 255.0, 209.0 / 255.0 );",
		"const vec3     HIGHLIGHT   = vec3( 220.0 / 255.0, 238.0 / 255.0, 247.0 / 255.0 );",

		"uniform 	float	globalTime;",

		"attribute 	float	time;",
		"attribute 	float	direction;",
		"attribute 	float	darkness;",

		"varying 	vec3 	vWorldVector;",
		"varying 	vec3	vColor;",

		"void main() {",

			"float localTime = time + globalTime;",
			"float modTime = mod( localTime, 1.0 );",
			"float sinTime = sin( modTime * PI * 0.5 );",
			"vec2 pulse = vec2( sin( localTime * 5.0 ) * 25.0, cos( localTime * 5.0 ) * 25.0 );",

			// color
			
			"vColor = mix( BASECOLOR * darkness, ENDCOLOR * darkness, modTime );",
			"vColor = mix( vColor, HIGHLIGHT, 1.0 - smoothstep( 0.0, 0.3 * darkness, abs( modTime - sin( localTime ) * 0.2 - 0.5 * darkness )));",

			// position

			"vec3 animated = vec3(( position.x + pulse.x ) * sinTime, position.y * modTime * modTime * modTime, ( position.z + pulse.y ) * sinTime );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( animated, 1.0 );",
			
			"float distance = 1.0 - clamp(( gl_Position.z / gl_Position.w ) / 5000.0, 0.0, 1.0 );",
			
			"gl_Position.x += sin( direction + modTime * 15.0 * PI ) * 10.0 * distance;",
			"gl_Position.y += cos( direction + modTime * 15.0 * PI ) * 10.0 * 2.0 * distance;",

			"vWorldVector = ( vec3( objectMatrix * vec4( animated, 1.0 )).xyz - cameraPosition) * vec3(0.01, 0.02, 0.01);",
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


			// color
			
			

			// mix sky color and fog

			"f = max( 0.0, normalize( vWorldVector ).y + cameraPosition.y * 0.0002 - 0.05 );",
			"sky_color = mix( vec3( skyWhite ), skyBlue, f );",

			"gl_FragColor = vec4( vColor, 1.0 );",
			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n")
	
}
