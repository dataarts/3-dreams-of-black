var Dunes = function ( shared ) {

	SequencerItem.call( this );
	var that = this;


	// private variables
	
	var camera, world, soup;
	var renderer = shared.renderer; 
	var renderTarget = shared.renderTarget;


	// signals
	
	shared.signals.initscenes.add( initScene );


	//--- Init ---

	function initScene () {
		
		console.log( "dunes initScene" );
		
		that.update( 0.0009, 49.99, 90375 );

	};

	this.init = function () {
		
		world = new DunesWorld( shared );
		shared.worlds.dunes = world;
		shared.sequences.dunes = this;
		camera = DunesCamera( shared );
		soup = new DunesSoup( camera.camera, world.scene, shared );

		console.log( "dunes init" );

	};


	//--- show & hide ---

	this.show = function ( progress ) {

		camera.resetCamera();
		shared.started.dunes = true;

		world.ambient.color.setHSV( 0, 0, 0 );
		world.directionalLight1.color.setHSV( 0.08823529411764706, 0, 0 );
		world.directionalLight2.color.setHSV( 0, 0, 0 );
		world.lensFlare.position.y = -500;
		
		console.log( "show dunes" );

	};

	this.hide = function () {

	};


	//--- reset camera ---

	this.resetCamera = function() {

		camera.resetCamera();
		renderer.setClearColor( world.scene.fog.color );

	};
	

	//--- update ---

	this.update = function ( progress, delta, time ) {

		// handle sun rise / sun set

		if( progress > 0.04 && progress < 0.2 ) {
			
			var localProgress = Math.sin( ( progress - 0.04 ) / ( 0.2 - 0.04 ) * Math.PI * 0.5 );
			
			world.lensFlare.position.y = -500 + 2500 * localProgress;

			world.ambient.color.setHSV( 0, 0, 0.1 * localProgress );
			world.directionalLight1.color.setHSV( 0.08823529411764706,  0, localProgress );
			world.directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 * localProgress );
			
		} else if( progress > 0.75 ) {
			
			var localProgress = Math.sin(( 1.0 - ( progress - 0.75 ) / 0.25 ) * Math.PI * 0.5 );			
			
			world.lensFlare.position.y = -500 + 2500 * localProgress;

			world.ambient.color.setHSV( 0, 0, 0.1 * localProgress );
			world.directionalLight1.color.setHSV( 0.08823529411764706, 0, localProgress );
			world.directionalLight2.color.setHSV( 0,  0,  0.8647058823529412 * localProgress );
			
		}



		// update everything

		camera.updateCamera( progress, delta, time );

		THREE.AnimationHandler.update( delta );

		world.update( delta, camera.camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera.camera, renderTarget );

	};

};

Dunes.prototype = new SequencerItem();
Dunes.prototype.constructor = Dunes;
