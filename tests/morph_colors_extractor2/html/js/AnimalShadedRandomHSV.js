/**
 * @author Mikael Emtinger
 */


ROME = {};


// animal

ROME.Animal = function( geometry, parseMorphTargetsNames ) {

	// constructor

	var vertexColors = geometry.materials[ 0 ][ 0 ].vertexColors;

	var that = {};
	that.availableAnimals = ROME.AnimalAnimationData.init( geometry, parseMorphTargetsNames );

	var pars = { uniforms:       ROME.AnimalShader.uniforms, 
				 vertexShader:   ROME.AnimalShader.vertex, 
				 fragmentShader: ROME.AnimalShader.fragment,
				 morphTargets:   true,
				 vertexColors:   vertexColors,
				 lights:         true };

	// colors

	var colorVariations = {
		
	"flamingo": { hRange:  0.05, sRange:  0.05, vRange:  0.00,
				  hOffset: 0.00, sOffset: 0.00, vOffset: 0.00 },

	"shdw2": { hRange:  0.00, sRange:  0.00, vRange:  0.025,
		       hOffset: 0.00, sOffset: 0.00, vOffset: -0.03 },
			   
	"horse": { hRange:  0.01, sRange:   0.00, vRange:  0.05,
		       hOffset: 0.02, sOffset: -0.10, vOffset: 0.00,
			   lScale: 0.75, lOffset: [ 0.5, 0.5, 0.5 ]	},

	"moose": { hRange:  0.07, sRange:  0.00, vRange:  0.05,
		       hOffset: 0.00, sOffset: -0.20, vOffset: 0.00 },

	"tarbuffalo": { hRange:  0.04, sRange:  0.00, vRange:  0.05,
		       hOffset: 0.00, sOffset: -0.10, vOffset: 0.00 },
			   
	"chow": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"deer": { hRange:  0.01, sRange:   0.00, vRange:  0.20,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },
			  
	"vulture": { hRange:  0.01, sRange:   0.10, vRange:  0.12,
			  hOffset: 0.0, sOffset:  0.00, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },
			  
	"bunny": { hRange:  0.00, sRange:  0.00, vRange:  0.05,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: 0.00,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"seal": { hRange:  0.00, sRange:  0.00, vRange:  0.05,
			  hOffset: 0.00, sOffset:  0.05, vOffset: 0.00,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },
			  
	"eagle": { hRange:  0.05, sRange:  0.00, vRange:  0.25,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: 0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"sat":  { hRange:  0.00, sRange:  0.00, vRange:  0.00,
		      hOffset: 0.00, sOffset: 0.10, vOffset: 0.00 },

	"zero": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  0.00, vOffset: 0.00 },

	"dark": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  0.00, vOffset: -0.50 }
			  
	};
	
	var animalVariationMap = {
	
		"flamingo"	: "flamingo",
		"horse"		: "horse",
		"shdw2" 	: "shdw2",
		"moose"		: "moose",
		"tarbuffalo": "tarbuffalo",
		"goat"		: "shdw2",
		"chow"		: "chow",
		"deer"		: "deer",
		"fox"		: "deer",
		"goldenRetreiver": "horse",
		"bunny" 	: "bunny",
		"seal"		: "seal",
		"elk"		: "seal",
		"eagle"		: "eagle",
		"parrot"	: "eagle",
		"hummingBird": "seal",
		"raven"		: "deer",
		"vulture"   : "vulture",
		"centipede" : "tarbuffalo",
		"scorp"		: "tarbuffalo",
		"bison"		: "tarbuffalo",
		"sickle"    : "tarbuffalo",
		
		"crab"		: "zero",
		"bear"		   : "zero",
		"mountainlion" : "zero",

	};

	var name = that.availableAnimals[ 0 ];

	var variations = colorVariations[ "zero" ];
	
	if ( animalVariationMap[ name ] !== undefined ) {
		
		variations = colorVariations[  animalVariationMap[ name ] ];
		
	}
	
	if ( variations.lScale ) {
	
		pars.uniforms.lightScale.value = variations.lScale;
		
	}	

	if ( variations.lOffset ) {
	
		pars.uniforms.lightOffset.value.set( variations.lOffset[ 0 ], variations.lOffset[ 1 ], variations.lOffset[ 2 ] );
		
	} else {
		
		pars.uniforms.lightOffset.value.set( 0.0, 0.0, 0.0 );

	}		
	

	var material = new THREE.MeshShaderMaterial( pars );

	that.mesh = new THREE.Mesh( geometry, material );
	that.morph = 0.0;
	that.animalA = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0 };
	that.animalB = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0 };
	
	
	var isPlaying = false;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;	
	
	var c, r, g, b, hd, sd, vd, dr = 0.5, dg = 0.5, db = 0.5;

	for( var i = 0; i < geometry.faces.length; i++ ) {
		
		c = geometry.faces[ i ].color;
		
		hd = variations.hRange * Math.random() + variations.hOffset;
		sd = variations.sRange * Math.random() + variations.sOffset;
		vd = variations.vRange * Math.random() + variations.vOffset;

		THREE.ColorUtils.adjustHSV( c, hd, sd, vd );		

		/*
		r = c.r;
		g = c.g;
		b = c.b;
		
		c.setRGB( cap( r + Math.random() * dr * r, 0, 1 ), cap( g + Math.random() * dg * g, 0, 1 ), cap( b + Math.random() * db * b, 0, 1 ) );
		*/
		
	}
	
	for( var i = 0; i < geometry.faceVertexUvs[ 0 ].length; i++ ) {
	
		var uv = geometry.faceVertexUvs[ 0 ][ i ];
		
		if ( uv ) {
		
			if ( uv.length == 3 ) {
				
				uv[ 0 ].set( 0.2, 0.2 );
				uv[ 1 ].set( 0.8, 0.2 );
				uv[ 2 ].set( 0.8, 0.8 );
				
			} else if ( uv.length == 4 ) {
				
				uv[ 0 ].set( 0.2, 0.2 );
				uv[ 1 ].set( 0.8, 0.2 );
				uv[ 2 ].set( 0.8, 0.8 );
				uv[ 3 ].set( 0.2, 0.8 );

			}

		}
		
	}
	
	//--- play ---

	that.play = function( animalA, animalB, morph, startTimeAnimalA, startTimeAnimalB ) {
		
		if( !isPlaying ) {

			isPlaying = true;
			that.morph = 0;

			THREE.AnimationHandler.addToUpdate( that );
		}
		
		setAnimalData( animalA, that.animalA );
		setAnimalData( animalB, that.animalB );
		
		that.animalA.currentTime = startTimeAnimalA ? startTimeAnimalA : 0;
		that.animalB.currentTime = startTimeAnimalB ? startTimeAnimalB : 0;
		
		that.update( 0 );

	} 


	//--- update ---
	
	that.update = function( deltaTimeMS ) {
		
		var data, dataNames = [ "animalA", "animalB" ];
		var d, dl;
		var f, fl;
		var frame, nextFrame;
		var time, nextTime;
		var unloopedTime;
		var lengthInMS;
		var lenghtInFrames;
		var morphTarget;
		var scale;
		
		for( d = 0, dl = dataNames.length, morphTarget = 0; d < dl; d++ ) {
			
			data = that[ dataNames[ d ]];
			
			unloopedTime = data.currentTime;
			data.currentTime = ( data.currentTime + deltaTimeMS * data.timeScale ) % data.lengthInMS;


			// did we loop?

			if( unloopedTime > data.currentTime ) {

				data.currentFrame = 0;				

			}


			// find frame/nextFrame
			

			frame = 0;
			
			for( f = data.currentFrame, fl = data.lengthInFrames - 1; f < fl; f++ ) {
				
				if( data.currentTime >= data.frames[ f ].time && data.currentTime < data.frames[ f + 1 ].time ) {
					
					frame = f;
					break;
				}
			}

			data.currentFrame = frame;
			nextFrame = frame + 1 < fl ? frame + 1 : 0;

			
			morphTargetOrder[ morphTarget++ ] = data.frames[ frame     ].index;
			morphTargetOrder[ morphTarget++ ] = data.frames[ nextFrame ].index;
			
			time     = data.frames[ frame     ].time;
			nextTime = data.frames[ nextFrame ].time > time ? data.frames[ nextFrame ].time : data.frames[ nextFrame ].time + data.lengthInMS; 
			
			scale = ( data.currentTime - time ) / ( nextTime - time ) ;
			
			material.uniforms[ dataNames[ d ] + "Interpolation" ].value = scale;

		}

		material.uniforms.animalMorphValue.value = that.morph;

	}


	//--- set new target animal ---
	
	that.setNewTargetAnimal = function( animal, startTimeAnimalB ) {
		
		if( that.morph === 1 ) {
			
			// switch so B -> A
			
			for( var property in that.animalA ) {
				
				that.animalA[ property ] = that.animalB[ property ];
				
			}
			
			
			// set new B and change morph
			
			that.animalB.currentTime = startTimeAnimalB ? startTimeAnimalB : 0;
			setAnimalData( animal, that.animalB );
			setFrame( that.animalB );
			that.morph = 0;
			
		} else {
			
			console.log( "Error: Cannot change animal target if morph != 1. Skipping." );

		}
		
	}


	//--- set animal data ---

	var setAnimalData = function( name, data ) {
		
		if( ROME.AnimalAnimationData[ name ] !== undefined ) {
			
			data.frames         = ROME.AnimalAnimationData[ name ];
			data.lengthInFrames = data.frames.length;
			data.lengthInMS     = data.frames[ data.lengthInFrames - 1 ].time;
			
		} else {
			
			console.log( "Error: Couldn't find data for animal " + name );
			
		}
		
	}
	
	
	//--- set frame ---
	
	var setFrame = function( data ) {
		
		var f, fl;
		var currentTime = data.currentTime;
		var frames = data.frames;
		
		for( f = 0, fl < frames.length; f < fl; f++ ) {
			
			if( currentTime >= frames[ f ].time ) {
				
				data.currentFrame = f;
				return;
				
			}
			
		}
		
	}


	//--- set current frame ---
	
	var setCurrentFrame = function( data ) {
		
				

	}

	
	//--- return public ---
	
	return that;
}



// shader

ROME.AnimalShader = {
	
	uniforms: THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "common" ],
								THREE.UniformsLib[ "lights" ], 
								{
									"animalAInterpolation": { type: "f", value: 0.0 },
									"animalBInterpolation": { type: "f", value: 0.0 },
									"animalMorphValue" :    { type: "f", value: 0.0 },
									
									"lightScale"  :    { type: "f", value: 1.0 },
									"lightOffset" :    { type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
								} ] ),

	vertex: [

		"uniform float	animalAInterpolation;",
		"uniform float	animalBInterpolation;",
		"uniform float	animalMorphValue;",
		"varying vec3 	vLightWeighting;",

		"uniform float lightScale;",
		"uniform vec3 lightOffset;",

		THREE.ShaderChunk[ "lights_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

			THREE.ShaderChunk[ "color_vertex" ],

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			THREE.ShaderChunk[ "lights_vertex" ],
			
			"vLightWeighting = lightScale * vLightWeighting + lightOffset;",
			
			"vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

		"}"

	].join("\n"),

	fragment: [

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		"varying vec3 vLightWeighting;",
		
		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "lights_pars_fragment" ],

		"void main() {",

			"gl_FragColor = vec4( vLightWeighting, 1.0 );",

			"gl_FragColor = gl_FragColor * vec4( diffuse, opacity );",

			THREE.ShaderChunk[ "color_fragment" ],
			THREE.ShaderChunk[ "fog_fragment" ],

		"}"

	].join("\n")
}


// animation data

ROME.AnimalAnimationData = {

	// static animal names (please fill in as it's faster than parsing through the geometry.morphTargets

	animalNames: [ "sickle", "scorp", "crab", "centipede", "hummingBird", "elk", "seal", "bunny", "goldenRetreiver", "chow", "goat", "tarbuffalo", "flamingo", "moose", "shdw2", "gator", "bear", "horse", "mountainlion", "wolf", "fox", "deer", "bison", "tarbuffalo_runB", "tarbuffalo_runA", "parrot", "eagle", "vulture", "raven", "blackWidow" ],


	// init frame times and indices
	
	init: function( geometry, parseMorphTargetNames ) {
		
		var availableAnimals = [];
		var animal, animalName;
		var charCode, morphTargetName, morphTargets = geometry.morphTargets;
		var a, al, m, ml, currentTime;
		
		// add animal names to static list?
		
		if( parseMorphTargetNames ) {
			
			for( m = 0, ml = morphTargets.length; m < ml; m++ ) {

				// check so not already exists
				
				for( a = 0, al = this.animalNames.length; a < al; a++ ) {
					
					animalName = this.animalNames[ a ];
					
					if( morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {
						
						break;
					}
					
				}
				
				
				// did not exist?
				
				if( a === al ) {
					
					morphTargetName = morphTargets[ m ].name;
					
					for( a = 0; al < morphTargetName.length; a++ ) {
				
						charCode = morphTargetName.charCodeAt( a );
						
						if(! (( charCode >= 65 && charCode <= 90  ) ||
						      ( charCode >= 97 && charCode <= 122 ))) {

							break;      	

						} 
						
					}
					
					this.animalNames.push( morphTargetName.slice( 0, a ));
					
				}
				
			}
			
		}
				
		// parse out the names
		
		for( a = 0, al = this.animalNames.length; a < al; a++ ) {
			
			animalName  = this.animalNames[ a ];
			animal      = this[ animalName ];
			currentTime = 0;
			
			if( animal === undefined || animal.length === 0 ) {
				
				animal = this[ animalName ] = [];
				
				for( m = 0, ml = morphTargets.length; m < ml; m++ ) {
	
					if( morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {

						animal.push( { index: m, time: currentTime } );
						currentTime += parseInt( 1000 / 24, 10 );		// 24 fps			
						
	
						if( availableAnimals.indexOf( animalName ) === -1 ) {
							
							availableAnimals.push( animalName );
							
						}
						
					}
					
				}

			} else {
				
				for( m = 0, ml = morphTargets.length; m < ml; m++ ) {
					
					if( availableAnimals.indexOf( animalName ) === -1 && morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {
						
						availableAnimals.push( animalName );
						
					}
					
				}
				
			}
			 
		}

		return availableAnimals;

	}
	
}


