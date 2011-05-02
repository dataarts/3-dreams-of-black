var LauncherSection = function ( shared ) {

	Section.call( this );

	var domElement,
	canvas, context, gradient,
	clouds, title, buttonEnter, buttonStart,
	loading, footer;

	domElement = document.createElement( 'div' );
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#4584b4';
	domElement.style.textAlign = 'center';

	var isLoading = false;
	
	this.load = function () {

		// Background

		canvas = document.createElement( 'canvas' );
		canvas.width = 32;
		canvas.height = window.innerHeight;

		context = canvas.getContext( '2d' );

		gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
		gradient.addColorStop( 0, "#0e223a" );
		gradient.addColorStop( 0.5, "#4584b4" );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		domElement.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
		domElement.style.backgroundRepeat = 'repeat-x';

		// Clouds

		clouds = new Clouds( shared );
		clouds.getDomElement().style.position = 'absolute';
		domElement.appendChild( clouds.getDomElement() );

		// UI

		title = document.createElement( 'div' );
		title.style.position = 'absolute';
		title.innerHTML = '<img src="files/title_heart_loading.png">';
		domElement.appendChild( title );

		buttonEnter = document.createElement( 'div' );
		buttonEnter.style.position = 'absolute';
		buttonEnter.style.cursor = 'pointer';
		buttonEnter.innerHTML = '<img src="files/title_heart_enter.png">';
		buttonEnter.addEventListener( 'click', function () {

			loading.getDomElement().style.display = 'block';
			buttonEnter.style.display = 'none';

			isLoading = true;
			
			shared.signals.load.dispatch();

		}, false );
		domElement.appendChild( buttonEnter );

		buttonStart = document.createElement( 'div' );
		buttonStart.style.position = 'absolute';
		buttonStart.style.cursor = 'pointer';
		buttonStart.style.display = 'none';
		buttonStart.innerHTML = '<img src="files/title_heart_start.png">';
		buttonStart.addEventListener( 'click', function () {

			shared.signals.showfilm.dispatch();

			// Start in 1 second.

			setTimeout( function () {

				shared.signals.startfilm.dispatch( 0, 1 );

			}, 1000 );
			
		}, false );
		domElement.appendChild( buttonStart );
		
		loading = new LoadingBar( function () {
			
			loading.getDomElement().style.display = 'none';
			buttonStart.style.display = 'block';
			
			isLoading = false;

		} );

		loading.getDomElement().style.position = 'absolute';
		loading.getDomElement().style.display = 'none';

		domElement.appendChild( loading.getDomElement() );

		shared.signals.loadItemAdded.add( loading.addItem );
		shared.signals.loadItemCompleted.add( loading.completeItem );

		footer = document.createElement( 'div' );
		footer.style.position = 'absolute';
		footer.style.left = '20px';
		footer.style.bottom = '10px';
		footer.innerHTML = '<img src="files/footer.png">';
		domElement.appendChild( footer );

	}

	this.show = function () {

		clouds.show();
		domElement.style.display = 'block';

	};

	this.resize = function ( width, height ) {

		clouds.resize( width, height );

		title.style.top = '60px';
		title.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

		buttonEnter.style.top = buttonStart.style.top = '210px';
		buttonEnter.style.left = buttonStart.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

		loading.getDomElement().style.top = '215px';
		loading.getDomElement().style.left = ( window.innerWidth - 300 ) / 2 + 'px';

		domElement.style.height = height + 'px';

	};

	this.hide = function () {

		clouds.hide();
		domElement.style.display = 'none';

	};

	this.update = function () {

		if ( ! isLoading ) {
		
			clouds.update();
			
		}

	};

	this.getDomElement = function () {

		return domElement;

	};

};

LauncherSection.prototype = new Section();
LauncherSection.prototype.constructor = LauncherSection;
