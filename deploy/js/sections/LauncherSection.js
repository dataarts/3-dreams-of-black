var LauncherSection = function ( shared ) {

	Section.call( this );

	var domElement,
	canvas, context, gradient,
	clouds, title, buttonEnter, buttonStart,
	buttonEnterImg, uiContainer, ffTitle,
	loading, footer, footNav;

	domElement = document.createElement( 'div' );
	domElement.style.width = window.innerWidth + 'px';
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
		clouds.getDomElement().style.left = "0px";
		clouds.getDomElement().style.top = "0px";
		clouds.getDomElement().style.width = window.innerWidth+"px";
		clouds.getDomElement().style.height = window.innerHeight+"px";
		domElement.appendChild( clouds.getDomElement() );

		// UI

		uiContainer = document.createElement( 'div' );
		uiContainer.style.position = 'absolute';
		uiContainer.setAttribute("id", "ui-container");

		title = document.createElement( 'div' );
		title.style.position = 'absolute';
		title.innerHTML = '<img src="files/logo_heart.png">';
		uiContainer.appendChild( title );

		buttonEnter = createRolloverButton( "10px 0 0 85px", "files/enter_idle.png", "files/enter_rollover.png" );
		buttonEnter.addEventListener( 'click', function () {

			loading.getDomElement().style.display = 'block';
			buttonEnter.style.display = 'none';

			isLoading = true;

			shared.signals.load.dispatch();

		}, false );
		uiContainer.appendChild( buttonEnter );

		buttonStart = createRolloverButton( "10px 0 0 85px", "files/start_idle.png", "files/start_rollover.png" );
		buttonStart.style.display = 'none';
		buttonStart.addEventListener( 'click', function () {

			shared.signals.showfilm.dispatch();

			// Start in 1 second.

			setTimeout( function () {

				shared.signals.startfilm.dispatch( 0, 1 );

			}, 1000 );

		}, false );
		uiContainer.appendChild( buttonStart );

		loading = new LoadingBar( function () {

			loading.getDomElement().style.display = 'none';
			buttonStart.style.display = 'block';

			isLoading = false;

			shared.signals.initscenes.dispatch();

		} );

		loading.getDomElement().style.position = 'absolute';
		loading.getDomElement().style.display = 'none';

		uiContainer.appendChild( loading.getDomElement() );

		shared.signals.loadItemAdded.add( loading.addItem );
		shared.signals.loadItemCompleted.add( loading.completeItem );

		if(!HandleErrors.isWebGLAndFireFox) {

			domElement.appendChild( uiContainer );

		} else {

			ffTitle = document.createElement( 'div' );
			ffTitle.style.paddingTop = "60px";
			ffTitle.style.marginLeft = "-2px";	// Ugly
			ffTitle.innerHTML = "<img src = 'files/footer/header-trans.png' alt = 'ROME' />";
			domElement.appendChild( ffTitle );

		}

		// Implemented Footer.js
		footer = document.createElement( 'div' );
		footer.style.position = 'absolute';
		footer.style.left = '0';
		footer.style.bottom = '0';
		footer.style.width = "100%";
		footNav = new Footer( footer );
		domElement.appendChild( footer );

		function createRolloverButton( margin, imgIdle, imgRoll ) {

			var button = document.createElement( 'div' );
			button.style.position = 'absolute';
			button.style.cursor = 'pointer';
			button.style.margin = margin;

			var buttonImg = document.createElement( 'img' );
			buttonImg.src = imgIdle;

			button.appendChild( buttonImg );

			button.addEventListener( 'mouseout', function () {

				buttonImg.src = imgIdle;

			}, false );

			button.addEventListener( 'mouseover', function () {

				buttonImg.src = imgRoll;

			}, false );

			return button;

		}

	}

	this.show = function () {

		clouds.show();
		domElement.style.display = 'block';

	};

	this.resize = function ( width, height ) {

		clouds.resize( width, height );

		if( title ) {

			title.style.top = '60px';
			title.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

		}

		if( buttonEnter ) {

			buttonEnter.style.top = buttonStart.style.top = '210px';
			buttonEnter.style.left = buttonStart.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

		}

		if( loading ) {

			loading.getDomElement().style.top = '215px';
			loading.getDomElement().style.left = ( window.innerWidth - 300 ) / 2 + 'px';

		}

		domElement.style.width = width + 'px';
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

	LauncherSection.showUI = function() {

		domElement.removeChild( ffTitle );
		domElement.appendChild( uiContainer );

	};

	this.getDomElement = function () {

		return domElement;

	};

};

LauncherSection.prototype = new Section();
LauncherSection.prototype.constructor = LauncherSection;
