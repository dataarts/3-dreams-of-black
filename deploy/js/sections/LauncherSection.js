var LauncherSection = function (shared) {

  Section.call(this);

  var domElement,
      clouds, title, buttonEnter, buttonStart,
      buttonEnterImg, uiContainer, ffTitle,
      exploreDreams, addToTheDream,
      loading, footer, footNav;

  var delta, time, oldTime = start_time = new Date().getTime();

  var fade;
  var at, alpha = 1;

  domElement = document.createElement('div');
  domElement.style.background = '-moz-linear-gradient(top, #04142e 0%, #1d508f 35%, #5299d1 50%, #1d508f 100%)';
  domElement.style.background = '-webkit-linear-gradient(top, #04142e 0%, #1d508f 35%, #5299d1 50%, #1d508f 100%)';
  domElement.style.background = 'linear-gradient(top, #04142e 0%, #1d508f 35%, #5299d1 50%, #1d508f 100%)';
  domElement.style.textAlign = 'center';

  var isLoading = false;
  var loadedOnce = false;

  // localStorage stuff

  this.load = function () {

    // Clouds

    clouds = new Clouds(shared);
    clouds.getDomElement().style.position = 'absolute';
    clouds.getDomElement().style.left = "0px";
    clouds.getDomElement().style.top = "0px";
    clouds.getDomElement().style.width = window.innerWidth + "px";
    clouds.getDomElement().style.height = window.innerHeight + "px";
    domElement.appendChild(clouds.getDomElement());

    // Fade

    fade = document.createElement('div');
    fade.style.background = "rgba(255,255,255,1)";
    fade.style.width = "100%";
    fade.style.height = "100%";
    fade.style.position = "absolute";
    fade.style.zIndex = 1000;
    domElement.appendChild(fade);

    // UI

    uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.setAttribute("id", "ui-container");
    uiContainer.style.marginTop = "30px";

    title = document.createElement('div');
    title.style.position = 'absolute';
    title.innerHTML = '<img src="/files/logo_heart.png" style="display:block; margin-top:-30px;" />';
    uiContainer.appendChild(title);

    buttonEnter = createRolloverButton("10px 0 0 85px", "/files/enter_idle.png", "/files/enter_rollover.png");
    buttonEnter.style.width = 180 + 'px';
    buttonEnter.addEventListener('click', function () {

      loading.getDomElement().style.display = 'block';
      buttonEnter.style.display = 'none';

      isLoading = true;
      if (addToTheDream != undefined && exploreDreams != undefined) {
        addToTheDream.style.display = "none";
        exploreDreams.style.display = "none";
      }

      shared.signals.load.dispatch();

    }, false);
    uiContainer.appendChild(buttonEnter);

    buttonStart = createRolloverButton("30px 0 0 85px", "/files/start_idle.png", "/files/start_rollover.png");
    buttonStart.style.display = 'none';
    buttonStart.addEventListener('click', function () {

			if( shared.originLink == "/explore" && shared.shouldSkip ) {
			
				// set some special load logic

				shared.signals.showexploration.dispatch();
				shared.signals.startexploration.dispatch( 'dunes', false );
				_gaq.push(['_trackPageview', '/explore']);
				shared.hasExplored = true;
				shared.shouldSkip = false;
			
			} else {
			
				      shared.signals.showfilm.dispatch();
			
				      // Start in 1 second.
			
				      setTimeout(function () {
			
						    shared.signals.startfilm.dispatch(0, 1);
							_gaq.push(['_trackPageview', '/launcher_start_film']);
			
				      }, 1000);
			}
    }, false);
    uiContainer.appendChild(buttonStart);

    loading = new LoadingBar(function () {

      // loading.getDomElement().style.display = 'none';
      var mouseGif = loading.getMouseInfo();
      mouseGif.style.display = 'none';
      buttonStart.style.display = 'block';
      shared.loadedContent = true;
      isLoading = false;

      shared.signals.initscenes.dispatch();

    });

    loading.getDomElement().style.position = 'absolute';
    loading.getDomElement().style.display = 'none';

    uiContainer.appendChild(loading.getDomElement());

    shared.signals.loadItemAdded.add(loading.addItem);
    shared.signals.loadItemCompleted.add(loading.completeItem);

    if (!HandleErrors.isWebGLAndBeta) {

      domElement.appendChild(uiContainer);

    } else {

      ffTitle = document.createElement('div');
      ffTitle.style.paddingTop = "60px";
      ffTitle.style.marginLeft = "-2px";	// Ugly
      ffTitle.innerHTML = "<img src = '/files/footer/header-trans.png' alt = 'ROME' />";
      domElement.appendChild(ffTitle);

    }


    if (localStorage.getItem("RomeSeen") == "true") {

      // Append a CSS file
      if (!loadedOnce) {
        var css = [
          ".seen-before {",
          "	opacity: .35;",
          "	cursor: pointer;",
          " padding: 15px 15px;",
          "}",
          ".seen-before:hover {",
          "	opacity: 1.0;",
          "}"
        ].join('\n');

        var rule = document.createTextNode(css);
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        if (style.stylesheet) {
          style.styleSheet.cssText = rule.nodeValue;
        } else {
          style.appendChild(rule);
        }
        head.appendChild(style);
        loadedOnce = true;
      }

      // Add shortcuts to gallery and tool
      addToTheDream = document.createElement("div");
      addToTheDream.setAttribute("class", "seen-before");
      addToTheDream.setAttribute("style", "background: url('files/launcher/add-trans.png') center center no-repeat; width: 145px; height: 10px;");
      addToTheDream.style.position = "absolute";
      addToTheDream.style.top = "233px";
      addToTheDream.style.left = (window.innerWidth / 2.0 - 354) + "px";
      addToTheDream.addEventListener("click", function(e) {

        e.preventDefault();
        shared.signals.showugc.dispatch();
        _gaq.push(['_trackPageview', '/launcher_add_to_dream']);

      }, false);
      exploreDreams = document.createElement("div");
      exploreDreams.setAttribute("class", "seen-before");
      exploreDreams.setAttribute("style", "background: url('files/launcher/explore-trans.png') center center no-repeat; width: 199px; height: 10px;");
      exploreDreams.style.position = "absolute";
      exploreDreams.style.top = "233px";
      exploreDreams.style.left = (window.innerWidth / 2.0 + 168) + "px";
      exploreDreams.addEventListener("click", function(e) {

        e.preventDefault();
        // window.open("/gallery", "Gallery");
        _gaq.push(['_trackPageview', '/launcher_gallery']);
        window.location = "/gallery/?c=favorite";

      }, false);

      uiContainer.appendChild(addToTheDream);
      uiContainer.appendChild(exploreDreams);

    } else {

      localStorage.setItem("RomeSeen", true);

    }


    // Implemented Footer.js
    footer = document.createElement('div');
    footer.style.position = 'absolute';
    footer.style.left = '0';
    footer.style.bottom = '0';
    footer.style.width = "100%";
    footNav = new Footer(footer);
    domElement.appendChild(footer);

    function createRolloverButton(margin, imgIdle, imgRoll) {

      var button = document.createElement('div');
      button.style.position = 'absolute';
      button.style.cursor = 'pointer';
      button.style.margin = margin;

      var buttonImg = document.createElement('img');
      buttonImg.src = imgIdle;

      button.appendChild(buttonImg);

      button.addEventListener('mouseout', function () {

        buttonImg.src = imgIdle;

      }, false);

      button.addEventListener('mouseover', function () {

        buttonImg.src = imgRoll;

      }, false);

      return button;

    }

  }

  this.show = function () {

    clouds.show();
    domElement.style.display = 'block';
    if (!shared.loadedContent) buttonStart.style.display = 'none';

  };

  this.resize = function (width, height) {

    clouds.resize(width, height);

    if (title) {

      title.style.top = '60px';
      title.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

    }

    if (buttonEnter) {

      buttonEnter.style.top = buttonStart.style.top = '210px';
      buttonEnter.style.left = buttonStart.style.left = ( window.innerWidth - 358 ) / 2 + 'px';

    }

    if (loading) {

      loading.getDomElement().style.top = '215px';
      loading.getDomElement().style.left = ( window.innerWidth - 300 ) / 2 + 'px';

    }

    if (exploreDreams && addToTheDream) {
      exploreDreams.style.left = (window.innerWidth / 2.0 + 168) + "px";
      addToTheDream.style.left = (window.innerWidth / 2.0 - 354) + "px";
    }

    domElement.style.width = width + 'px';
    domElement.style.height = height + 'px';

  };

  this.hide = function () {

    clouds.hide();
    domElement.style.display = 'none';

  };

  this.update = function () {

    time = new Date().getTime();
    delta = time - oldTime;
    oldTime = time;

    if (! isLoading) {

      clouds.update();

    }

    if (alpha > 0) {

      alpha -= 0.0004 * delta;

      at = TWEEN.Easing.Exponential.EaseOut(alpha);

      fade.style.background = "rgba(255,255,255," + at + ")";

    } else {

      fade.style.display = "none";
      fade.style.zIndex = 0;

    }

  };

  LauncherSection.showUI = function() {

		if(ffTitle) {
			ffTitle.style.display = "none";
		}
    domElement.appendChild(uiContainer);

  };

  this.getDomElement = function () {

    return domElement;

  };

};

LauncherSection.prototype = new Section();
LauncherSection.prototype.constructor = LauncherSection;
