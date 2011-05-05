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

		camera.updateCamera( progress, delta, time );

		THREE.AnimationHandler.update( delta );

		world.update( delta, camera.camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera.camera, renderTarget );

	};

};

Dunes.prototype = new SequencerItem();
Dunes.prototype.constructor = Dunes;
