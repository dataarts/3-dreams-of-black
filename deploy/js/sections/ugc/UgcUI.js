var UgcUI = function (shared) {


  var VALID_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  var TITLE_STRING = 'GIVE YOUR DREAM A TITLE';
  var MAX_TITLE_LENGTH = 35;
  var ANIMAL_CONTAINER_HEIGHT = 114;
  var SIZE_SMALL = 1;
  var SIZE_MED = 3;
  var SIZE_LARGE = 5;

  var numAnimals = 10; // TODO
  var animalSlideTarget = 0;
  var animalSlide = 0;
  var _type = 0;


  var css = getCSS();

  var domElement = document.createElement('div');

  var styleSheet = document.createElement('style');
  styleSheet.setAttribute('type', 'text/css');
  styleSheet.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(styleSheet);

  domElement.innerHTML += getSvgTopLeftContents();
  domElement.innerHTML += getSvgTopRightContents();
  domElement.innerHTML += getSvgBottomRightContents();
  domElement.innerHTML += getSvgBottomLeftContents();

  var tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.font = '12px/0px FuturaBT-Medium';
  tooltip.style.padding = '13px 7px 10px 7px';
  tooltip.style.display = 'none';
  tooltip.style.backgroundColor = '#fff';
  tooltip.style.boxShadow = '-1px 1px 0px rgba(0,0,0,0.4)';
  tooltip.style.textTransform = 'uppercase';
  tooltip.style.color = '#000';
  tooltip.style.zIndex = '15';
  tooltip.innerHTML = 'CREATE';

  domElement.appendChild(tooltip);


  var animalContainerDiv = classedElement('div', 'animal-container');
  animalContainerDiv.setAttribute('id', 'animal-container');
  animalContainerDiv.style.display = 'none';
  animalContainerDiv.style.overflow = 'hidden';
  animalContainerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
  animalContainerDiv.style.width = '100%';
  animalContainerDiv.style.height = ANIMAL_CONTAINER_HEIGHT + 'px';
  animalContainerDiv.style.position = 'fixed';
  animalContainerDiv.style.top = '100%';
  animalContainerDiv.style.left = 0;
  animalContainerDiv.style.marginTop = -ANIMAL_CONTAINER_HEIGHT + 'px';

  var animalInnerDiv = classedElement('div', 'animal-inner');
  var animalInnerDivWidth = ((numAnimals) * 140);
  animalInnerDiv.style.padding = '10px';
  animalInnerDiv.style.width = animalInnerDivWidth + 'px';
  animalInnerDiv.style.height = '100%';
  animalInnerDiv.style.position = 'absolute';
  animalContainerDiv.appendChild(animalInnerDiv);

  for (var i = 0; i < numAnimals; i++) {
    animalInnerDiv.appendChild(makeAnimalDiv());
  }

  domElement.appendChild(animalContainerDiv);

  var submitShade = document.createElement('div');
  submitShade.setAttribute('id', 'voxel-submit-shade');
  domElement.appendChild(submitShade);

  var submit = document.createElement('div');

  submit.addEventListener('mousemove', function(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);
  submit.addEventListener('mouseup', function(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);
  submit.addEventListener('mousedown', function(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);
  submitShade.addEventListener('mousemove', function(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);
  submitShade.addEventListener('mouseup', function(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);
  submitShade.addEventListener('mousedown', function(e) {
    hideSubmitDialogue();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();
  }, false);


  var submitText = idElement('div', 'voxel-submit-text');

  submitText.innerHTML = '<span id="agree-terms" class="foo"><input id="agree" type="checkbox" /> &nbsp;I agree to the <a id="terms-link" href="/terms">terms and conditions</a>.</span><br/>';
  submitText.innerHTML += '<small>Thank you for contributing a model! We\'ll email you when <br/>your unique dream is approved for sharing.</small>';
  var submitImage = idElement('div', 'voxel-submit-image');
  var submitInputs = idElement('div', 'voxel-submit-inputs');

  var submitTitle = idElement('input', 'voxel-submit-title');
  submitTitle.setAttribute('type', 'text');
  submitTitle.setAttribute('value', TITLE_STRING);
  submitTitle.setAttribute('maxlength', MAX_TITLE_LENGTH);

  submitTitle.addEventListener('focus', function() {
    this.value = '';
  }, false);

  var submitEmail = idElement('input', 'voxel-submit-email');

  submitEmail.setAttribute('type', 'text');
  submitEmail.setAttribute('value', 'YOUR EMAIL ADDRESS');

  submitEmail.addEventListener('focus', function() {
    this.value = '';
  }, false);

  var submitSubmit = idElement('div', 'voxel-submit-submit');

  submitSubmit.innerHTML = 'SUBMIT';

  submitSubmit.addEventListener('click', function() {

    var emailInput = document.getElementById('voxel-submit-email');

    var title = document.getElementById('voxel-submit-title').value;
    var email = emailInput.value;

    var invalidEmail = function(email) {
      if (!VALID_EMAIL.test(email)) {
        alert("Please enter a valid email address");
        return true;
      }
      return false;
    };

    if (invalidEmail(email)) {
      return;
    }

    var invalidTitle = function(title) {

      if (title == TITLE_STRING || trim(title) == '') {
        alert("Please enter a title.");
        return true;
      }

      if (title.length < 3) {
        alert("Please enter a title 3 characters or longer.");
        return true;
      }

      return false;

    };

    if (invalidTitle(title)) {
      return;
    }


    if (!document.getElementById('agree').checked) {
      alert("You must agree to the terms and conditions.");
      addClass(document.getElementById('agree-terms'), 'error');
      return;
    }

    shared.ugcSignals.submit.dispatch(title, email);
    hideSubmitDialogue();

  }, false);

  var colormode = false;
  var symmetry_mode = false;
  var submitDialogueOpen = false;
  var rotatemode = false;

  submit.appendChild(submitImage);
  submit.appendChild(submitText);
  submit.appendChild(submitInputs);
  submit.appendChild(submitSubmit);


  submit.setAttribute('id', 'voxel-submit');
  submit.style.position = 'fixed';
  submit.style.top = '200%'
  submit.style.left = '50%';


  domElement.appendChild(submit);

  var colorDOM = document.createElement('div');
  var picker = new ColorPicker(colorDOM);
  picker.onColorChange = function(hex) {
    shared.ugcSignals.object_changecolor.dispatch(hex);
  }
  colorDOM.style.position = 'fixed';
  colorDOM.style.left = '50%';
  colorDOM.style.top = '50%';
  colorDOM.style.display = 'none';
  colorDOM.style.marginTop = -230 + 'px';
  colorDOM.style.marginLeft = -175 + 'px';

  domElement.appendChild(colorDOM);


  var theBR = document.createElement('span');
  theBR.innerHTML += '<br/>';

  submitInputs.appendChild(submitEmail);
  submitInputs.appendChild(theBR);
  submitInputs.appendChild(submitTitle);

  //submitInputs.innerHTML = submitInputs.innerHTML.replace(/type\=\"text\" /, 'type="text" x-webkit-speech ');

  makeUnselectable(colorDOM);
  makeUnselectable(tooltip);

  this.setType = function(type) {
    _type = type
    if (type == 1) {
      colorDOM.style.display = 'none';
      shared.ugcSignals.object_changecolor.dispatch(0xffffff);
      addClass(document.getElementById('ugcui-color'), 'disabled');
    } else {
      removeClass(document.getElementById('ugcui-color'), 'disabled')
    }
    picker.setType(type);
  };

  this.updateCapacity = function (i) {
    document.getElementById('capacity').textContent = ( Math.round(i * 100) + '%' );
  };

  this.addListeners = function() {

    Footer.handleLinkListeners(document.getElementById('terms-link'), 'terms');

    // Make the tooltip follow
    domElement.addEventListener('mousemove', function(e) {
      tooltip.style.top = e.pageY - 40 + 'px';
      tooltip.style.left = e.pageX + 20 + 'px';
    }, true);

//    // Scroll the animal container div
//    animalContainerDiv.addEventListener('mousemove', function(e) {
//      var padding = window.innerWidth / 5;
//      animalSlideTarget = -((e.pageX - padding / 2) / (window.innerWidth - padding)) * (animalInnerDivWidth - window.innerWidth);
//      e.stopPropagation();
//      e.stopImmediatePropagation();
//    });

    /**
     * Submit behavior
     */

    shared.ugcSignals.submit_dialogue.add(function() {
      submitDialogueOpen = true;
      shared.ugcSignals.object_requestsnapshot.dispatch();
    });

    shared.ugcSignals.object_receivesnapshot.add(function(image) {
      submitImage.style.backgroundImage = 'url(' + image + ')';
      submitShade.style.zIndex = '20';
      submit.style.top = '50%';
      submit.style.opacity = 1;
    });

    /**
     * Hover behavior
     */

//    var menus = svgLeft.getElementsByClassName('menu');
//
//    for (var i = 0; i < menus.length; i++) {
//      var open = makeOpenMenuFunction(menus[i]);
//      menus[i].open = open;
//      menus[i].addEventListener('click', open, false);
//    }

    var named = document.getElementsByClassName('button');
    for (var i = 0; i < named.length; i++) {
      if (named[i].getAttribute('title') != undefined) {
        named[i].addEventListener('mouseover', function() {
          if (hasClass(this, 'disabled')) return;
          tooltip.style.display = 'inline-block';
          tooltip.innerHTML = this.getAttribute('title');
        }, false);
        named[i].addEventListener('mouseout', function() {
          tooltip.style.display = 'none';
        }, false);
      }
    }
//
//    onClick('main', closeAnimals);
//
//    onClick('animals', function() {
//      // document.getElementById('animal-container').style.opacity = 1;
//      document.getElementById('animal-container').style.display = 'block';
//      shared.ugcSignals.soup_mode.dispatch();
//    }, false);

    /**
     * Signal dispatching
     */

//    onClick('smoother-up', function() {
//      shared.ugcSignals.object_smoothup.dispatch();
//    });
//
//    onClick('smoother-down', function() {
//      shared.ugcSignals.object_smoothdown.dispatch();
//    });

    window.addEventListener('keydown', function(e) {
      if (submitDialogueOpen) return;
      switch (e.keyCode) {
        case 90:
          shared.ugcSignals.object_undo.dispatch();
          break;
        case 68:
          shared.ugcSignals.object_createmode.dispatch();
          break;
        case 70:
          if (colormode) {
            shared.ugcSignals.object_createmode.dispatch();
          } else {
            shared.ugcSignals.object_colormode.dispatch();
          }
          break;
        case 83:
          shared.ugcSignals.object_symmetrymode.dispatch(!symmetry_mode);
          break;
        case 69:
          shared.ugcSignals.object_erasemode.dispatch();
          break;
        case 82:
          shared.ugcSignals.object_rotatemode.dispatch();
          break;
      }
    }, false);

    onClick('ugcui-color', function() {
      if (colormode) {
        shared.ugcSignals.object_createmode.dispatch();
      } else {
        shared.ugcSignals.object_colormode.dispatch();
      }

    });

    onClick('ugcui-size-small', function() {
      shared.ugcSignals.object_changesize.dispatch(SIZE_SMALL);
    });

    onClick('ugcui-size-med', function() {
      shared.ugcSignals.object_changesize.dispatch(SIZE_MED);
    });

//    onClick('ugcui-size-large', function() {
//      shared.ugcSignals.object_changesize.dispatch(SIZE_LARGE);
//    });

//    onClick('ugcui-undo', function() {
//      shared.ugcSignals.object_undo.dispatch();
//    });

    onClick('ugcui-submit', function() {
      shared.ugcSignals.submit_dialogue.dispatch();
    });

    onClick('ugcui-quit', function() {
      if (confirm("Are you sure you want to quit?")) {
        shared.signals.showrelauncher.dispatch();
      }
    });

    onClick('ugcui-zoom-in', function() {
      shared.ugcSignals.object_zoomin.dispatch();
    });

    onClick('ugcui-zoom-out', function() {
      shared.ugcSignals.object_zoomout.dispatch();
    });

    onClick('ugcui-create', function() {
      shared.ugcSignals.object_createmode.dispatch();
    });

    onClick('ugcui-erase', function() {
      shared.ugcSignals.object_erasemode.dispatch();
    });

    onClick('ugcui-rotate', function() {
      shared.ugcSignals.object_rotatemode.dispatch();
    });

    onClick('ugcui-reflect', function() {
      shared.ugcSignals.object_symmetrymode.dispatch(!symmetry_mode);
    });

    shared.ugcSignals.object_symmetrymode.add(function(bool) {
      symmetry_mode = bool;
      if (bool) {
        addClass(document.getElementById('ugcui-reflect'), 'active');
      } else {
        removeClass(document.getElementById('ugcui-reflect'), 'active');
      }

    });

    shared.ugcSignals.object_rotatemode.add(function() {
      colormode = false;
      rotatemode = true;
      addClass(document.getElementById('ugcui-rotate'), 'active');
      removeClass(document.getElementById('ugcui-create'), 'active');
      removeClass(document.getElementById('ugcui-erase'), 'active');
      removeClass(document.getElementById('ugcui-color'), 'active');
      colorDOM.style.display = 'none';
    });

    shared.ugcSignals.object_erasemode.add(function() {
      colormode = false;
      rotatemode = false;
      addClass(document.getElementById('ugcui-erase'), 'active');
      removeClass(document.getElementById('ugcui-create'), 'active');
      removeClass(document.getElementById('ugcui-rotate'), 'active');
      removeClass(document.getElementById('ugcui-color'), 'active');
      colorDOM.style.display = 'none';
    });

    shared.ugcSignals.object_createmode.add(function() {
      colormode = false;
      rotatemode = false;
      addClass(document.getElementById('ugcui-create'), 'active');
      removeClass(document.getElementById('ugcui-erase'), 'active');
      removeClass(document.getElementById('ugcui-rotate'), 'active');
      removeClass(document.getElementById('ugcui-color'), 'active');
      colorDOM.style.display = 'none';
    });

    shared.ugcSignals.object_colormode.add(function() {
      if (_type == 1) return;
      colormode = true;
      rotatemode = false;
      removeClass(document.getElementById('ugcui-create'), 'active');
      removeClass(document.getElementById('ugcui-erase'), 'active');
      removeClass(document.getElementById('ugcui-rotate'), 'active');
      addClass(document.getElementById('ugcui-color'), 'active');
      colorDOM.style.display = 'block';
    });


    var uis = document.getElementsByClassName('button');
    for (var i = 0; i < uis.length; i++) {
      var elem = uis[i];
      elem.addEventListener('mousemove', function(e) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.stopPropagation();
      }, false);
      elem.addEventListener('mouseup', function(e) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.stopPropagation();
      }, false);
      elem.addEventListener('mousedown', function(e) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.stopPropagation();
      }, false);
    }
    /**
     * Color dispatching
     */

//      // TODO separate dispatch from response
//
//    var colorOptions = document.getElementById('color').getElementsByClassName('options')[0].getElementsByTagName('polygon');
//    for (var i = 0; i < colorOptions.length; i++) {
//
//      onClick(colorOptions[i], function() {
//        var hex = parseInt(this.getAttribute('fill').substr(1), 16);
//        for (var j = 0; j < colorOptions.length; j++) {
//          colorOptions[j].setAttribute('class', '');
//        }
//        this.setAttribute('class', 'selected');
//        shared.ugcSignals.object_changecolor.dispatch(hex);
//
//      });
//    }
//
//    onClick('life', function() {
//      document.getElementById('life').setAttribute('class', 'active');
//      document.getElementById('dark').setAttribute('class', '');
//      // TODO
//    });
//
//    onClick('dark', function() {
//      document.getElementById('dark').setAttribute('class', 'active');
//      document.getElementById('life').setAttribute('class', '');
//      // TODO
//    });

    /**
     * Signal response
     */

    shared.ugcSignals.object_changesize.add(function(size) {
      removeClass(document.getElementById('ugcui-size-small'), 'active');
      removeClass(document.getElementById('ugcui-size-med'), 'active');
//      removeClass(document.getElementById('ugcui-size-large'), 'active');
      switch (size) {
        case SIZE_SMALL:
          addClass(document.getElementById('ugcui-size-small'), 'active');
          break;
        case SIZE_MED:
          addClass(document.getElementById('ugcui-size-med'), 'active');
          break;
        case SIZE_LARGE:
          addClass(document.getElementById('ugcui-size-large'), 'active');
          break;
      }
    });

  };

  var frameCount = 0;
  var _frameCount = 0;
  var lastTime = new Date();

  this.update = function() {
    animalSlide += (animalSlideTarget - animalSlide) * 0.5;
//    animalInnerDiv.
//frstyle.left = Math.round(animalSlide) + 'px';
    submitImage.style.backgroundPosition = '0px ' + -(frameCount * submitImage.offsetHeight) + 'px';
    _frameCount++;
    if (_frameCount % 10 == 0) {
      frameCount += 1;
    }
  };

  this.getDomElement = function () {
    return domElement;
  };

//  function closeAnimals() {
//    // document.getElementById('animal-container').style.opacity = 0;
//    document.getElementById('animal-container').style.display = 'none';
//    shared.ugcSignals.object_mode.dispatch();
//  }

//  function closeAllMenus() {
//    var menus = svgLeft.getElementsByClassName('menu');
//    for (var i = 0; i < menus.length; i++) {
//      showHideMenuButtons(menus[i], false);
//    }
//  }

//  function makeOpenMenuFunction(menu) {
//    return function() {
//      closeAllMenus();
//      showHideMenuButtons(menu, true);
//    };
//  }

//  function showHideMenuButtons(menu, show) {
//    var buttons = menu.getElementsByClassName('menu-buttons');
//    for (var j = 0; j < buttons.length; j++) {
//      buttons[j].style.display = show ? 'block' : 'none';
//    }
//  }

  function classedElement(nodeType, clazz) {
    var div = document.createElement(nodeType);
    div.setAttribute('class', clazz);
    return div;
  }

  function idElement(nodeType, id) {
    var div = document.createElement(nodeType);
    div.setAttribute('id', id);
    return div;
  }

  function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  }

  function onClick(id, fnc) {
    var elem;
    if (typeof id == 'string') {
      elem = document.getElementById(id);
    } else {
      elem = id;
    }
    elem.addEventListener('mouseup', function() {
      fnc.call(elem);
    }, false);
  }

  function hideSubmitDialogue() {
    submitShade.style.zIndex = '-20';
    submit.style.top = '200%';
    submit.style.opacity = 0;
    submitTitle.value = TITLE_STRING;
    submitEmail.value = 'YOUR EMAIL ADDRESS';
    removeClass(document.getElementById('agree-terms'), 'error');
    document.getElementById('agree').checked = false;
    submitDialogueOpen = false;
  }


	function hasClass( elem, zclass ) {

		return elem.getAttribute('class').indexOf(zclass) != -1;

	}

	function addClass( elem, zclass ) {

		if ( hasClass( elem, zclass ) ) return;
		elem.setAttribute( 'class', elem.getAttribute( 'class' ) + ' ' + zclass );

	}

  
	function removeClass( elem, zclass ) {

		if ( !hasClass( elem, zclass ) ) return;
    
		var reg = new RegExp(' ' + zclass, 'g');
    
		elem.setAttribute( 'class', elem.getAttribute( 'class' ).replace( reg, '' ) );

	}

  function makeAnimalDiv() {

    var div = classedElement('div', 'animal');
    var img = classedElement('img', 'animal-thumb');
    img.src = '/files/soupthumbs/test.png';
    img.style.position = 'absolute';

    var controls = classedElement('div', 'animal-controls');

    var count = classedElement('div', 'animal-count');
    count.style.font = '12px/22px FuturaBT-Bold';
    count.innerHTML = '0';

    var add = classedElement('div', 'animal-add');
    add.style.font = '12px/22px FuturaBT-Bold';
    add.innerHTML = '+';

    var remove = classedElement('div', 'animal-remove');
    remove.style.font = '12px/22px FuturaBT-Bold';
    remove.innerHTML = '-';

    div.appendChild(img);
    controls.appendChild(remove);
    controls.appendChild(count);
    controls.appendChild(add);
    div.appendChild(controls);

    return div;

  }

  function getSvgTopLeftContents() {
    return ['<svg class="ugcui" id="ugcui-top-left" version="1.1"',
      '     xmlns="http://www.w3.org/2000/svg"',
      '     xmlns:xlink="http://www.w3.org/1999/xlink"',
      '     xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"',
      '     x="0px" y="0px" width="800px" height="600px" viewBox="0 -1.338 800 600"',
      '     enable-background="new 0 -1.338 800 600"',
      '     xml:space="preserve" >',
      '    <g class="button" title="Symmetry Mode [s]" id="ugcui-reflect">',
      '      <polygon class="hex"',
      '               points="13.126,93.332 0,70.598 13.126,47.862 39.377,47.862 52.503,70.598 39.377,93.332 "/>',
      '      <path fill="#404040" d="M26.195,77.438c-0.428,0-0.771,0.345-0.771,0.771v1.158c0,0.428,0.343,0.772,0.771,0.772',
      '  s0.771-0.345,0.771-0.772v-1.158C26.966,77.783,26.623,77.438,26.195,77.438 M26.195,73.965c-0.428,0-0.771,0.344-0.771,0.771v1.158',
      '  c0,0.425,0.343,0.771,0.771,0.771s0.771-0.346,0.771-0.771v-1.158C26.966,74.309,26.623,73.965,26.195,73.965 M20.23,64.94',
      '  l-4.149-4.594c-0.238-0.262-0.61-0.351-0.939-0.224c-0.327,0.125-0.545,0.441-0.545,0.794v9.187v9.188',
      '  c0,0.351,0.218,0.667,0.545,0.793c0.1,0.039,0.203,0.057,0.306,0.057c0.235,0,0.467-0.098,0.633-0.28l4.149-4.594l4.149-4.593',
      '  c0.293-0.324,0.293-0.817,0-1.142L20.23,64.94z M18.968,74.126l-2.667,2.952v-6.976v-6.976l2.667,2.955l3.632,4.021L18.968,74.126z',
      '  M28.011,69.532c-0.292,0.324-0.292,0.817,0,1.142l4.149,4.593l4.149,4.594c0.165,0.183,0.397,0.28,0.633,0.28',
      '  c0.103,0,0.205-0.018,0.306-0.057c0.327-0.126,0.544-0.442,0.544-0.793v-9.188v-9.187c0-0.353-0.216-0.669-0.544-0.794',
      '  c-0.33-0.127-0.702-0.038-0.938,0.224L32.16,64.94L28.011,69.532z M29.79,70.103l3.634-4.021l2.667-2.955v6.976v6.976l-2.667-2.952',
      '  L29.79,70.103z M26.195,70.489c-0.428,0-0.771,0.345-0.771,0.772v1.159c0,0.427,0.343,0.772,0.771,0.772s0.771-0.345,0.771-0.772',
      '  v-1.159C26.966,70.834,26.623,70.489,26.195,70.489 M26.195,60.066c-0.428,0-0.771,0.346-0.771,0.772v1.158',
      '  c0,0.427,0.343,0.773,0.771,0.773s0.771-0.347,0.771-0.773v-1.158C26.966,60.412,26.623,60.066,26.195,60.066 M26.195,63.541',
      '  c-0.428,0-0.771,0.345-0.771,0.772v1.158c0,0.428,0.343,0.771,0.771,0.771s0.771-0.343,0.771-0.771v-1.158',
      '  C26.966,63.886,26.623,63.541,26.195,63.541 M26.195,67.014c-0.428,0-0.771,0.346-0.771,0.772v1.158',
      '  c0,0.426,0.343,0.772,0.771,0.772s0.771-0.346,0.771-0.772v-1.158C26.966,67.36,26.623,67.014,26.195,67.014"/>',
      '    </g>',
      '    <g class="button active" title="Draw [d]" id="ugcui-create">',
      '      <polygon class="hex" points="54.576,69.401 41.45,46.666 54.576,23.932 80.828,23.932 93.954,46.666',
      '  80.827,69.401 "/>',
      '      <path fill="#404040" d="M67.92,32.249l-12.121,7.29l-0.154-0.098v13.47l12.256,7.661l12.258-7.661V40.265L67.92,32.249z',
      '  M67.883,34.149l9.991,6.543l-9.978,6.405l-10.564-6.602L67.883,34.149z M57.255,42.346l9.842,6.151v9.673l-9.842-6.151V42.346z',
      '  M78.548,52.019l-9.842,6.15v-9.679l9.842-6.318V52.019z"/>',
      '    </g>',
      '    <g class="button" title="Erase [e]" id="ugcui-erase">',
      '      <polygon class="hex" points="96.026,93.332 82.9,70.598 96.026,47.862 122.277,47.862 135.404,70.597',
      '  122.277,93.332 "/>',
      '      <path fill="#404040" d="M111.728,61.285l-13.493,7.131v5.163l9.462,5.387l13.086-7.798v-4.968L111.728,61.285z M113.478,69.723',
      '  l-5.788,3.394l-7.658-4.416l6.083-3.215L113.478,69.723z M108.238,74.062l5.928-3.477v3.252l-5.928,3.534V74.062z M99.328,69.556',
      '  l7.817,4.509v3.328l-7.817-4.45V69.556z"/>',
      '    </g>',
      '    <g class="button" title="Fill Color [f]" id="ugcui-color">',
      '      <polygon class="hex" points="96.026,141.194 82.9,118.46 96.026,95.725 122.277,95.725 135.404,118.459',
      '  122.277,141.194 "/>',
      '      <path fill="#404040" d="M121.346,114.964c-2.85-3.684-8.097-1.808-8.097-1.808s3.946,3.913,5.455,5.42',
      '  c1.633,1.633,2.081,10.199,3.058,8.201C123.29,123.65,123.54,117.801,121.346,114.964 M110.458,110.993v2.259l6.309,6.309',
      '  l-10.072,10.071l-8.699-8.697l10.074-10.073l0.27,0.271v-2.149c-0.084-0.031-0.176-0.049-0.27-0.049',
      '  c-0.213,0-0.414,0.082-0.565,0.233l-11.202,11.204c-0.312,0.311-0.312,0.817,0,1.129l9.827,9.828',
      '  c0.152,0.151,0.352,0.235,0.565,0.235c0.211,0,0.413-0.084,0.565-0.235l11.202-11.203c0.151-0.152,0.235-0.353,0.235-0.565',
      '  c0-0.214-0.084-0.413-0.236-0.563L110.458,110.993z M101.645,108.202c0.001-0.733,0.593-1.325,1.324-1.326h4.543',
      '  c0.729,0.001,1.322,0.593,1.323,1.324v8.447c-0.212,0.081-0.41,0.205-0.579,0.374c-0.321,0.32-0.485,0.748-0.483,1.17',
      '  c-0.001,0.421,0.163,0.85,0.484,1.172c0.322,0.323,0.749,0.487,1.173,0.485h0.004c0.419,0,0.844-0.162,1.167-0.484l-0.396-0.397',
      '  l0.398,0.396c0.321-0.322,0.484-0.75,0.484-1.172s-0.163-0.85-0.485-1.171c-0.186-0.186-0.407-0.313-0.642-0.391v-8.429',
      '  c0-1.353-1.095-2.449-2.448-2.449h-4.543c-1.353,0-2.45,1.096-2.45,2.451v7.208l1.126-1.126V108.202z M109.053,117.816',
      '  c0.107-0.107,0.239-0.156,0.378-0.158c0.137,0.001,0.271,0.051,0.374,0.156c0.107,0.106,0.155,0.239,0.155,0.376',
      '  c0,0.136-0.049,0.271-0.155,0.378c-0.104,0.104-0.239,0.153-0.374,0.153c-0.139,0-0.272-0.051-0.377-0.154',
      '  c-0.104-0.105-0.155-0.24-0.155-0.377C108.9,118.053,108.95,117.92,109.053,117.816"/>',
      '    </g>',
//      '    <g class="button" title="Undo [z]" id="ugcui-undo">',
//      '      <polygon class="hex" points="54.576,165.125 41.45,142.391 54.576,119.657 80.827,119.657 93.953,142.391',
//      '  80.827,165.125 "/>',
//      '      <path fill="#404040" d="M66.954,131.614v-0.083v-0.826c0-0.561-0.399-0.79-0.885-0.51l-0.716,0.414',
//      '  c-0.485,0.281-1.281,0.738-1.768,1.021l-0.714,0.413c-0.486,0.281-0.486,0.739,0,1.02l0.714,0.414',
//      '  c0.487,0.281,1.283,0.741,1.768,1.02l0.716,0.415c0.486,0.28,0.885,0.051,0.885-0.509v-0.827v-0.152',
//      '  c4.616,0.128,8.316,3.893,8.325,8.539c-0.008,4.722-3.829,8.542-8.551,8.549v0.001v-0.001c-0.414,0-0.822-0.027-1.219-0.084',
//      '  c-0.491-0.071-0.947,0.272-1.016,0.763c-0.07,0.493,0.271,0.948,0.762,1.017c0.482,0.07,0.974,0.104,1.473,0.105v0.001',
//      '  c5.717-0.002,10.351-4.635,10.352-10.352C77.078,136.318,72.565,131.735,66.954,131.614"/>',
//      '    </g>',
//      '    <g class="folder" id="ugcui-size">',


//      '      <g class="options">',

      '        <g class="button" title="Large" transform="translate(41.5 ,-23)" id="ugcui-size-med">',
      
      '          <polygon class="hex" points="13.126,188.696 0,165.962 13.126,143.227 39.377,143.227 52.503,165.962',
      '    39.377,188.696 "/>',
      '          <path fill="#404040" d="M35.384,164.724v-9.757l-8.837-4.797l-9.248,4.927v9.452l-9.613,5.704l18.509,11.5l18.509-11.5',
      '    L35.384,164.724z M20.675,170.283l2.864-1.765l2.803,1.666l2.609-1.564l2.74,1.678l-5.496,3.367L20.675,170.283z M25.674,173.983',
      '    l-5.517,3.378l-5.459-3.391l5.458-3.367L25.674,173.983z M34.889,165.062l2.718,1.612l-5.395,3.305l-2.734-1.674L34.889,165.062z',
      '    M23.011,168.204l-2.856,1.761l-5.373-3.291l2.832-1.68L23.011,168.204z M32.212,170.616l5.478,3.354l-5.458,3.391l-5.517-3.378',
      '    L32.212,170.616z M32.732,170.297l5.404-3.31l5.52,3.276l-5.45,3.386L32.732,170.297z M14.253,166.988l5.383,3.297l-5.454,3.364',
      '    l-5.449-3.385L14.253,166.988z M20.675,177.683l5.52-3.381l5.519,3.381l-5.519,3.429L20.675,177.683z"/>',
      '        </g>',
//      '        <g class="button" title="Large" id="ugcui-size-large">',
//      '          <polygon class="hex" points="13.126,236.559 0,213.824 13.126,191.089 39.377,191.089 52.503,213.824',
//      '    39.377,236.559 "/>',
//      '          <path fill="#404040" d="M38.393,215.247v-13.17l-11.994-5.937l-12.195,6.057v12.926l-6.519,3.868l18.509,11.5l18.509-11.5',
//      '    L38.393,215.247z M25.674,222.721l-5.517,3.379l-5.459-3.392l5.458-3.366L25.674,222.721z M32.212,219.355l5.478,3.353l-5.458,3.392',
//      '    l-5.517-3.379L32.212,219.355z M32.732,219.035l5.404-3.31l5.52,3.276l-5.45,3.387L32.732,219.035z M14.253,215.725l5.383,3.299',
//      '    l-5.454,3.364l-5.449-3.387L14.253,215.725z M20.675,226.42l5.52-3.381l5.519,3.381l-5.519,3.43L20.675,226.42z"/>',
//      '        </g>',
      '      </g>',
      '      <g class="button active" title="Small" id="ugcui-size-small">',
      '        <polygon class="hex" points="13.126,141.194 0,118.46 13.126,95.725 39.377,95.725 52.503,118.46 39.377,141.194',
      '    "/>',
      '        <path fill="#404040" d="M32.34,113.829v-6.316l-6.006-3.258l-6.285,3.118v6.456l-12.364,7.334l18.509,11.5l18.509-11.5',
      '    L32.34,113.829z M20.676,121.195l5.477-3.378l5.539,3.391l-5.497,3.367L20.676,121.195z M25.674,124.894l-5.517,3.378l-5.457-3.391',
      '    l5.457-3.367L25.674,124.894z M29.156,115.964l2.936-1.65l5.515,3.272l-5.395,3.304l-5.541-3.393L29.156,115.964z M20.366,114.272',
      '    l5.266,3.226l-5.476,3.378l-5.374-3.29L20.366,114.272z M32.212,121.527l5.477,3.354l-5.457,3.39l-5.517-3.378L32.212,121.527z',
      '    M32.733,121.208l5.403-3.309l5.52,3.274l-5.45,3.386L32.733,121.208z M14.253,117.899l5.384,3.297l-5.454,3.364l-5.45-3.386',
      '    L14.253,117.899z M20.675,128.594l5.521-3.381l5.52,3.38l-5.52,3.43L20.675,128.594z"/>',
      '      </g>',


      '    </g>',
      '</svg>'].join("\n");

  }

  function getSvgTopRightContents() {
    return ['<svg class="ugcui" id="ugcui-top-right" version="1.1"',
      '	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"',
      '	 x="0px" y="0px" width="70px" height="70px" viewBox="-2 -2 60 60"',
      '	 xml:space="preserve">',
      '<g transform="translate(-1, 0)" class="button" id="ugcui-quit">',
      '<polygon class="hex" points="13.126,45.469 0,22.735 13.126,0 39.377,0 52.504,22.735 39.377,45.469 "/>',
      '<path fill="#222222" d="M22.568,23.39c0-1.193-0.437-2.16-1.309-2.901c-0.726-0.617-1.547-0.925-2.462-0.925',
      '	c-1.01,0-1.885,0.352-2.626,1.056c-0.764,0.726-1.145,1.632-1.145,2.719c0,1.109,0.403,2.02,1.21,2.733',
      '	c0.741,0.648,1.59,0.972,2.546,0.972c0.738,0,1.408-0.193,2.01-0.58l0.564,0.58h1.369l-1.191-1.164',
      '	C22.224,25.155,22.568,24.325,22.568,23.39z M20.778,25.096l-1.046-1.041h-1.407l1.696,1.644c-0.38,0.215-0.805,0.322-1.275,0.322',
      '	c-0.691,0-1.307-0.255-1.846-0.766c-0.517-0.495-0.775-1.131-0.775-1.909c0-0.796,0.251-1.455,0.752-1.975',
      '	c0.499-0.523,1.134-0.784,1.906-0.784c0.764,0,1.402,0.261,1.916,0.784s0.771,1.172,0.771,1.947',
      '	C21.47,24.024,21.239,24.617,20.778,25.096z"/>',
      '<path fill="#222222" d="M28.188,24.041c0,0.629-0.102,1.082-0.304,1.359c-0.303,0.414-0.729,0.621-1.28,0.621',
      '	c-0.548,0-0.974-0.207-1.275-0.621c-0.203-0.287-0.304-0.739-0.304-1.359v-4.342h-1.089v4.644c0,0.76,0.236,1.386,0.71,1.878',
      '	c0.53,0.548,1.183,0.822,1.958,0.822s1.43-0.274,1.962-0.822c0.474-0.492,0.711-1.118,0.711-1.878v-4.644h-1.089V24.041z"/>',
      '<rect x="31.006" y="19.699" fill="#222222" width="1.089" height="7.214"/>',
      '<polygon fill="#222222" points="33.071,19.699 33.071,20.722 34.729,20.722 34.729,26.913 35.818,26.913 35.818,20.722 ',
      '	37.473,20.722 37.473,19.699 "/>',
      '</g>',
      '</svg>'].join("\n");

  }

  function getSvgBottomRightContents() {

    return ['<svg id="ugcui-bottom-right" class="ugcui" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',
      '	 x="0px" y="0px" width="70px" height="70px" viewBox="-2 -2 60 60" xml:space="preserve">',
      '<g class="button" transform="translate(-1, 0)" id="ugcui-submit">',
      '<polygon class="hex" points="13.126,45.469 0,22.735 13.126,0 39.377,0 ',
      '	52.504,22.734 39.377,45.469 "/><g transform="translate(0,-1)">',
      '<path fill="#222222" d="M13.54,21.303l-0.883,0.523c-0.166-0.287-0.323-0.474-0.473-0.561c-0.155-0.1-0.356-0.15-0.603-0.15',
      '	c-0.302,0-0.553,0.086-0.752,0.258c-0.199,0.168-0.299,0.381-0.299,0.636c0,0.353,0.262,0.636,0.784,0.851l0.72,0.295',
      '	c0.586,0.237,1.014,0.526,1.285,0.867c0.271,0.342,0.406,0.76,0.406,1.256c0,0.664-0.221,1.213-0.663,1.646',
      '	c-0.445,0.437-0.998,0.655-1.659,0.655c-0.626,0-1.143-0.187-1.551-0.559C9.451,26.647,9.2,26.125,9.1,25.452l1.103-0.242',
      '	c0.05,0.424,0.137,0.717,0.262,0.878c0.224,0.312,0.551,0.468,0.98,0.468c0.34,0,0.622-0.113,0.846-0.342',
      '	c0.225-0.227,0.337-0.515,0.337-0.863c0-0.14-0.02-0.268-0.059-0.385c-0.039-0.117-0.1-0.225-0.183-0.322',
      '	c-0.082-0.098-0.188-0.189-0.319-0.275c-0.131-0.086-0.287-0.168-0.468-0.245l-0.696-0.29c-0.987-0.416-1.48-1.027-1.48-1.83',
      '	c0-0.541,0.207-0.994,0.621-1.358c0.414-0.367,0.93-0.551,1.547-0.551C12.423,20.093,13.072,20.496,13.54,21.303z"/>',
      '<path fill="#222222" d="M16.128,20.232v4.342c0,0.62,0.101,1.072,0.304,1.359c0.302,0.414,0.728,0.621,1.275,0.621',
      '	c0.552,0,0.978-0.207,1.28-0.621c0.202-0.277,0.304-0.73,0.304-1.359v-4.342h1.089v4.645c0,0.76-0.237,1.387-0.711,1.879',
      '	c-0.532,0.548-1.187,0.822-1.962,0.822s-1.428-0.274-1.958-0.822c-0.474-0.492-0.71-1.119-0.71-1.879v-4.645H16.128z"/>',
      '<path fill="#222222" d="M22.108,27.447v-7.215h1.084c0.482,0,0.867,0.037,1.154,0.113c0.289,0.074,0.534,0.2,0.733,0.378',
      '	c0.202,0.184,0.362,0.413,0.481,0.687c0.121,0.277,0.182,0.558,0.182,0.842c0,0.517-0.197,0.954-0.593,1.312',
      '	c0.383,0.131,0.685,0.359,0.906,0.687c0.225,0.324,0.336,0.7,0.336,1.131c0,0.563-0.199,1.04-0.598,1.43',
      '	c-0.24,0.239-0.51,0.406-0.809,0.5c-0.327,0.091-0.736,0.136-1.229,0.136h-1.647V27.447z M23.197,23.33h0.341',
      '	c0.405,0,0.702-0.089,0.891-0.268c0.188-0.18,0.282-0.443,0.282-0.793c0-0.339-0.097-0.597-0.29-0.773',
      '	c-0.192-0.176-0.474-0.264-0.841-0.264h-0.383V23.33z M23.197,26.424h0.673c0.492,0,0.854-0.097,1.084-0.29',
      '	c0.243-0.208,0.364-0.474,0.364-0.794c0-0.312-0.117-0.573-0.351-0.785c-0.228-0.209-0.634-0.312-1.22-0.312h-0.551L23.197,26.424',
      '	L23.197,26.424z"/>',
      '<path fill="#222222" d="M27.515,27.447l1.519-7.756l2.476,5.605l2.565-5.605l1.364,7.756h-1.116l-0.696-4.355l-2.136,4.687',
      '	l-2.074-4.69l-0.775,4.359h-1.127V27.447z"/>',
      '<path fill="#222222" d="M38.055,20.232v7.215h-1.089v-7.215H38.055z"/>',
      '<path fill="#222222" d="M41.778,21.256v6.191h-1.089v-6.191h-1.658v-1.023h4.401v1.023H41.778z"/>',
      '</g></g>',
      '</svg>'].join("\n");

  }

  function getSvgBottomLeftContents() {
    return ['<svg class="ugcui" id="ugcui-bottom-left" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px"',
      '	 height="200px" viewBox="-2 -100 800 200" enable-background="new 0 0 800 200" xml:space="preserve">',
      '<g class="button" id="ugcui-rotate" title="Rotate [R]">',
      '	<polygon class="hex" points="13.127,21.759 0,-0.975 13.127,-23.71 39.377,-23.71 52.504,-0.975 39.377,21.759"/>',
      '	<path fill="#404040" d="M38.91-5.208c-0.406-0.224-0.83-0.434-1.266-0.633v-4.373l-10.986-5.962L15.162-10.47v4.656',
      '		c-0.391,0.179-0.771,0.365-1.135,0.563C10.816-3.495,8.951-1.157,8.67,1.388H6.924L9.41,4.831l2.486-3.443h-1.66',
      '		c0.295-1.96,1.875-3.812,4.539-5.27c0.123-0.067,0.26-0.125,0.387-0.19v5.677l11.496,6.545l10.986-6.18v-6.064',
      '		c0.17,0.086,0.348,0.166,0.512,0.257c2.959,1.63,4.586,3.742,4.582,5.946c-0.004,2.202-1.639,4.308-4.604,5.928',
      '		c-3.1,1.695-7.23,2.625-11.639,2.625h-0.055v0.001c-0.188,0-0.371-0.002-0.555-0.006l-0.031,1.562',
      '		c0.195,0.003,0.387,0.005,0.582,0.005l0,0h0.059c4.664,0,9.062-1,12.387-2.816c3.486-1.906,5.41-4.498,5.416-7.297',
      '		C44.303-0.69,42.391-3.287,38.91-5.208z"/>',
      '	<path fill="#404040" d="M13.49,9.064c0.598,0.359,1.246,0.696,1.932,0.999l0.635-1.426c-0.627-0.281-1.219-0.586-1.766-0.912',
      '		L13.49,9.064z"/>',
      '	<path fill="#404040" d="M16.422,10.478c0.65,0.25,1.338,0.479,2.043,0.679l0.424-1.503c-0.658-0.188-1.299-0.398-1.906-0.635',
      '		L16.422,10.478z"/>',
      '	<path fill="#404040" d="M22.662,11.991c0.699,0.087,1.414,0.15,2.129,0.188l0.082-1.56c-0.678-0.037-1.357-0.096-2.021-0.178',
      '		L22.662,11.991z"/>',
      '	<path fill="#404040" d="M19.504,11.427c0.682,0.162,1.389,0.305,2.1,0.417L21.85,10.3c-0.674-0.105-1.34-0.24-1.984-0.392',
      '		L19.504,11.427z"/>',
      '</g>',
      '<g class="folder"  id="ugcui-zoom">	',
      '	<g class="options">',
      '	<polygon class="hitbox" points="97.417,22.957 82.56,-2.779 52.844,-2.779 39.029,21.152 11.394,21.152 ',
      '		-3.464,46.888 11.394,72.622 39.027,72.622 52.844,96.553 82.559,96.553 97.417,70.818 83.601,46.887 	"/>',
      '		<g class="button" title="zoom in" id="ugcui-zoom-in">',
      '		<polygon class="hex" points="54.576,45.69 41.451,22.957 54.576,0.221 80.828,0.221 93.953,22.957 80.828,45.69"/>',
      '		<polygon fill="#404040" points="73.414,21.578 68.235,21.578 68.235,16.399 66.093,16.399 66.093,21.578 60.914,21.578 ',
      '			60.914,23.721 66.093,23.721 66.093,28.899 68.235,28.899 68.235,23.721 73.414,23.721 	"/>',
      '		</g>',
      '		<g class="button" title="zoom out" id="ugcui-zoom-out">',
      '		<polygon class="hex" points="54.576,93.553 41.45,70.818 54.576,48.084 80.828,48.084 93.953,70.818 80.827,93.553 "/>',
      '		<rect x="60.914" y="68.899" fill="#404040" width="12.5" height="2.143"/>',
      '		</g>',
      '	</g><g class="button" title="zoom" id="ugcui-zoom-folder">',
      '	<polygon class="hex" points="13.126,69.622 0,46.888 13.126,24.152 39.377,24.152 52.503,46.888 39.377,69.622"/>',
      '	<path fill="#404040" d="M24.141,35.035c-4.986,0-9.029,4.043-9.029,9.029c0,4.988,4.043,9.03,9.029,9.03',
      '		c4.988,0,9.031-4.042,9.031-9.03C33.172,39.078,29.129,35.035,24.141,35.035 M24.141,50.909c-3.779,0-6.844-3.065-6.844-6.845',
      '		c0-3.778,3.064-6.843,6.844-6.843c3.781,0,6.844,3.064,6.844,6.843C30.984,47.844,27.922,50.909,24.141,50.909"/>',
      '	<path fill="#404040" d="M37.717,55.305c0.264,0.275,0.213,0.758-0.109,1.065l-2.216,2.112c-0.323,0.312-0.804,0.343-1.069,0.063',
      '		l-4.318-4.521c-0.266-0.276-0.215-0.756,0.111-1.065l2.212-2.114c0.326-0.311,0.808-0.341,1.073-0.062L37.717,55.305z"/>',
      '	</g></g>',
      '</g>',
      '</svg>'].join("\n");
  }

  function getCSS() {
//    var filmstrip = '@-webkit-keyframes filmstrip { ';
//    for(var i=0;i<10;i++) {
//      filmstrip += (i*10)+'% { background-position: 0px '+(i*465)+'px; } ';
//      filmstrip += ((i+1)*10-1)+'% { background-position: 0px '+(i*465)+'px; } ';
//    }
//    filmstrip += '}';
//    var filmstripImage = '#voxel-submit-image { ';
//    filmstripImage += '-webkit-animation-name: filmstrip;';
//    filmstripImage += '-webkit-animation-iteration-count: infinite;';
//    filmstripImage += '-webkit-animation-direction: normal;';
//    filmstripImage += '-webkit-animation-duration: 1s;';
//    filmstripImage += '}';
    return [
      '.ugcui { position: fixed;  } ',
      '#ugcui-top-right { position: fixed; top: 40px; right: 40px; } ',
      '#ugcui-bottom-right { position: fixed; bottom: 40px; right: 40px; z-index: 5 } ',
      '#ugcui-top-left { position: fixed; top: 10px; left: 35px; } ',
      '#ugcui-bottom-left { position: fixed; bottom: 120px; left: 35px; } ',
      '.ugcui g.button {',
      '  cursor: pointer;',
      '}',
      '.ugcui g.button polygon.hex {',
      '  fill: rgba(255, 255, 255, 0.7);',
      '}',
      '.ugcui g.button:not(.disabled):hover polygon.hex {',
      '  fill: #fff;',
      '}',
      '.ugcui g.button.active polygon.hex {',
      '  fill: #F15C22;',
      '}',
      '.ugcui g.button.active:hover polygon.hex {',
      '  fill: #F77952;',
      '}',
      '.ugcui g.folder g.options, .ugcui g.folder polygon.hitbox {',
      '  display: none;',
      '}',
      '.ugcui g.disabled { opacity: 0.1; cursor: auto; }',
      '.ugcui g.folder:hover g.options {',
      '  display: block;',
      '}',
      '.ugcui g.folder:hover #ugcui-zoom-folder polygon.hex { fill: #fff; }',
      '.ugcui g.folder polygon.hitbox {',
      '  display: block; fill-opacity: 0;',
      '}',
      '#ugcui-size g.button.active polygon.hex { fill: rgba(255, 255, 255, 0.7); }',
      '#ugcui-size:hover g.button.active polygon.hex { fill: #F15C22; }',
      '#ugcui-size:hover g.button.active:hover polygon.hex { fill: #F77952; }',
      '#agree-terms.error { background-color: rgba(255, 0, 0, 0.3); }',
      '#voxel-submit-text { float: left; width: 300px; margin-right: 10px; }',
      '#voxel-submit-inputs { margin-right: 10px; margin-top: -4px; float: left; }',
      '#voxel-submit-submit { cursor: pointer; letter-spacing: 0.025em; font: 17px/65px FuturaBT-Bold, sans-serif; float: left; border: 1px solid #d6d1c2; width: 200px; text-align: center; margin-top: -2px;  }',
      '#voxel-submit-submit:hover { border-color: #404040; background-color: #404040; color: #f4f1e8; }',
      '#voxel-submit input[type="text"] { margin-bottom: 3px; color: #404040; font: 11px/22px FuturaBT-Bold, sans-serif; width: 200px; padding: 2px 4px  }',
      '#voxel-submit a { color: #000 } ',
      '#voxel-submit-image { margin-bottom: 20px; width: 735px; height: 465px; background-color: #000; }',
      '#voxel-submit-shade { z-index: -12; opacity: 0.4; -webkit-transition: opacity 0.2s linear; background-color: #f4f1e8; position: fixed; top: 0; left: 0; width: 100%; height: 100% }',
      '#voxel-submit { font: 12px/18px FuturaBT-Medium; color: #404040; z-index: 21; opacity: 0; -webkit-transition: opacity 0.2s linear; width: 735px; height: 556px; padding: 13px; margin-left: -380px; margin-top: -291px; background-color: #f4f1e8; box-shadow: 0px 0px 10px rgba(0,0,0,0.3) }',
      '#voxel-submit small { line-height: 15px; display: block; margin-top: 7px }',
      '.animal-container { opacity: 1; -webkit-transition: opacity 0.3s linear; }',
      '.animal { text-align: center; -webkit-transition: all 0.1s linear; float: left; height: ' + (ANIMAL_CONTAINER_HEIGHT - 22) + 'px; background: url(/files/soupthumbs/shadow.png); border: 1px solid rgba(0,0,0,0); width: 120px; margin-right: 10px; }',
      '.animal:hover { background-color: rgba(255, 255, 255, 0.4); border: 1px solid #fff; }',
      '.animal-controls { height: 21px; overflow:hidden; line-height: 0px; border-right: 1px solid #fff; opacity: 0; display: inline-block; position: relative; margin-top: 71px; }',
      '.animal:hover .animal-controls { opacity: 1; }',
      '.animal-controls div { display: none; text-align: center; border: 1px solid #fff; border-right: 0; border-bottom: 0; display: inline-block; width: 20px;}',
      '.animal-controls div.animal-add:hover, .animal-controls div.animal-remove:hover { cursor: pointer; background-color: #f65824; }',
      '.animal-controls div.animal-count { background-color: #fff; color: #777; width: 25px; }'
//      filmstrip,
//      filmstripImage
    ].join("\n");
  }

  function makeUnselectable(elem) {

    if (elem == undefined || elem.style == undefined) return;
    elem.onselectstart = function() {
      return false;
    };
    elem.style.MozUserSelect = 'none';
    elem.style.KhtmlUserSelect = 'none';
    elem.unselectable = 'on';

    var kids = elem.childNodes;
    for (var i = 0; i < kids.length; i++) {
      makeUnselectable(kids[i]);
    }

  }

}
