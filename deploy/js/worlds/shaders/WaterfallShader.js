/**
 * @author Mikael Emtinger
 */

WaterfallShader = {
	
	createWaterfall: function() {

		// create geo
		
		var geometry = new THREE.Geometry();
		var v, f, fl = 1000;
		var faces = geometry.faces;
		var vertices = geometry.vertices;
		var vertex;
		var time = WaterfallShader.attributes.time.value;
		var direction = WaterfallShader.attributes.direction.value;
		
		for( f = 0; f < fl; f++ ) {

			faces.push( new THREE.Face3( f * 3 + 0, f * 3 + 2, f * 3 + 1 ));

			time.push( Math.random() );

			direction.push( 0 );
			direction.push( 120 * Math.PI / 180 );
			direction.push( 240 * Math.PI / 180 );


			vertex = new THREE.Vertex();

			vertex.position.x = Math.random() * 50;
			vertex.position.y = 0;
			vertex.position.z = Math.random() * 50;

			vertices.push( vertex );
			vertices.push( vertex );
			vertices.push( vertex );
			
		}
		
		geometry.computeFaceNormals();
		geometry.computeBoundingSphere();
		geometry.boundingSphere.radius = 500;
		
		// create material

		var material = new THREE.MeshShaderMaterial( { uniforms: WaterfallShader.uniforms,
													   attributes: WaterfallShader.attributes,
													   vertexShader: WaterfallShader.vertexShader,
													   fragmentShader: WaterfallShader.fragmentShader,
													   lights: false,
													   fog: false } );

		var mesh = new THREE.Mesh( geometry, material );
		
		mesh.doubleSided = true;
		
		return mesh;
	},

	update: function( delta ) {
		
		WaterfallShader.uniforms.globalTime.value += delta * 0.001;
		
	},
	

	uniforms: {  

		"globalTime": { type: "f", value: 0.0 },
		"skyWhite": { type: "f", value: 1 },

	},

	attributes: {
		
		"time": { type: "f", boundTo: "faces", value: [] },
		"direction": { type: "f", boundTo: "vertices", value: [] }
		
	},

	vertexShader: [

		"uniform 	float	globalTime;",

		"attribute 	float	time;",
		"attribute 	float	direction;",

		"varying 	vec3 	vWorldVector;",

		"void main() {",

			"vWorldVector = ( vec3( objectMatrix * vec4( position, 1.0 )).xyz - cameraPosition) * vec3(0.01, 0.02, 0.01);",

			"float localTime = time + globalTime;",
			"float modTime = mod( localTime, 1.0 );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
			"gl_Position.x += sin( direction + localTime ) * 10.0;",
			"gl_Position.y += cos( direction + localTime ) * 10.0 * 2.0;",

		"}"

	].join("\n"),

	fragmentShader: [

		"const   	vec3 	skyBlue = vec3( -0.37, -0.05, 0.15 );",
		"const 	 	vec3 	cloudMix = vec3( 0.83 * 0.83, 0.69 * 0.69, 0.51 * 0.51 );",

		"uniform 	float 	skyWhite;",

		"varying 	vec3 	vWorldVector;",

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

			"gl_FragColor = mix( gl_FragColor, vec4( sky_color, gl_FragColor.w ), fogFactor );",

			"gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );",
		"}"

	].join("\n")
	
}
