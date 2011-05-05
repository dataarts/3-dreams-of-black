var City = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, renderTarget = shared.renderTarget;

	// temp debug, start with ?debug=true
	shared.debug = false;

	if ( getParameterByName( "debug" ) == "true" ) {

		shared.debug = true;

	}

	this.init = function () {

		camera = new THREE.Camera(50, shared.viewportWidth / shared.viewportHeight, 1, 100000);
		camera.position.set(0,150,-550)

		world = new SoupWorld( shared );
		soup = new UgcSoup( camera, world.scene, shared, true );

		/*

		soup.addAnimal("id") to add an animal
		soup.removeAnimal("id") to remove an animal

		soup.get() to get a string of the current soup
		soup.set("str") to set the soup from a string

		soup.setLife() to set it to life (not done yet)
		soup.setDark() to set it to dark (not done yet)

		id´s of available animals are:

		elk
		moose
		fisha
		fishb
		fishc
		fishd
		horse
		bearbrown
		mountainlion
		deer
		golden
		fox
		seal
		chow 
		raccoon
		rabbit
		frog 
		eagle
		owl
		parrot
		hummingbird
		flamingo
		stork

		bearblack
		panther
		wolf
		toad
		taruffalo
		buffalo
		gator
		goat
		shadow
		arm
		spider
		crab
		scorpion
		raven
		vulture

		*/

		// test stuff
/*		gui.add(soup, "addMoose").name("Add Moose");
		gui.add(soup, "removeMoose").name("Remove Moose");

		gui.add(soup, "addGator").name("Add Gator");
		gui.add(soup, "removeGator").name("Remove Gator");

		gui.add(soup, "addRaven").name("Add Raven");
		gui.add(soup, "removeRaven").name("Remove Raven");

		gui.add(soup, "get").name("Get (test)");
		gui.add(soup, "setTest").name("Set (test)");
*/


	};

	this.show = function ( progress ) {

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {



	};

	this.update = function ( progress, delta, time ) {

		THREE.AnimationHandler.update( delta );

		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

	};

	function getParameterByName(name) {

		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

	}


};

City.prototype = new SequencerItem();
City.prototype.constructor = City;
