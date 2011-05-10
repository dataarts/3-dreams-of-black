var UgcUI = function (shared) {


  var VALID_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
  var TITLE_STRING = 'GIVE YOUR DREAM A TITLE';
  var MAX_TITLE_LENGTH = 35;
  var ANIMAL_CONTAINER_HEIGHT = 114;
  var SIZE_SMALL = 1;
  var SIZE_MED = 3;
  var SIZE_LARGE = 5;

  var NATIVE_AREA = 558056;

  var numAnimals = 10; // TODO
  var animalSlideTarget = 0;
  var animalSlide = 0;

  var css = getCSS();

  var svgLeftContents = getSvgLeftContents();

  var domElement = document.createElement('div');

  var styleSheet = document.createElement('style');
  styleSheet.setAttribute('type', 'text/css');
  styleSheet.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(styleSheet);

  domElement.innerHTML = svgLeftContents;
  var svgLeft = domElement.firstChild;

  var tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.font = '12px/0px FuturaBT-Medium';
  tooltip.style.padding = '13px 7px 10px 7px';
  tooltip.style.display = 'none';
  tooltip.style.backgroundColor = '#fff';
  tooltip.style.boxShadow = '-1px 1px 0px rgba(0,0,0,0.4)';
  tooltip.style.textTransform = 'uppercase';
  tooltip.style.color = '#000';
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
    e.stopImmediatePropagation();
    e.stopPropagation();
  });
  submit.addEventListener('mouseup', function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  });
  submit.addEventListener('mousedown', function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  });
  submitShade.addEventListener('mousemove', function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  });
  submitShade.addEventListener('mouseup', function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  });
  submitShade.addEventListener('mousedown', function(e) {
    hideSubmitDialogue();
    e.stopImmediatePropagation();
    e.stopPropagation();
  });


  var submitText = idElement('div', 'voxel-submit-text');

  submitText.innerHTML = 'Beautiful! Thank you for contributing. If you give us your email, then we will email you when your object is approved.';

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
      return false; // TODO
      if (email.match(VALID_EMAIL) == null) {
        alert("")
      }
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

    shared.ugcSignals.submit.dispatch(title, email);
    hideSubmitDialogue();

  }, false);

  submit.appendChild(submitImage);
  submit.appendChild(submitText);
  submit.appendChild(submitInputs);
  submit.appendChild(submitSubmit);


  submit.setAttribute('id', 'voxel-submit');
  submit.style.position = 'fixed';
  submit.style.top = '200%'
  submit.style.left = '50%';


  domElement.appendChild(submit);

  var theBR = document.createElement('span');
  theBR.innerHTML += '<br/>';

  submitInputs.appendChild(submitEmail);
  submitInputs.appendChild(theBR);
  submitInputs.appendChild(submitTitle);

  //submitInputs.innerHTML = submitInputs.innerHTML.replace(/type\=\"text\" /, 'type="text" x-webkit-speech ');


  this.updateCapacity = function (i) {
    document.getElementById('capacity').textContent = ( Math.round(i * 100) + '%' );
  };

  this.addListeners = function() {


    // Make the tooltip follow
    domElement.addEventListener('mousemove', function(e) {
      tooltip.style.top = e.pageY - 40 + 'px';
      tooltip.style.left = e.pageX + 20 + 'px';
    }, true);

    // Scroll the animal container div
    animalContainerDiv.addEventListener('mousemove', function(e) {
      var padding = window.innerWidth / 5;
      animalSlideTarget = -((e.pageX - padding / 2) / (window.innerWidth - padding)) * (animalInnerDivWidth - window.innerWidth);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });

    /**
     * Submit behavior
     */

    shared.ugcSignals.submit_dialogue.add(function() {
      shared.ugcSignals.object_requestsnapshot.dispatch();
    });

    shared.ugcSignals.object_requestsnapshot.add(function() {
      shared.ugcSignals.object_receivesnapshot.dispatch();
    });

    shared.ugcSignals.object_receivesnapshot.add(function() {
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
      named[i].addEventListener('mouseover', function() {
        tooltip.style.display = 'inline-block';
        tooltip.innerHTML = this.getAttribute('title');
      }, false);
      named[i].addEventListener('mouseout', function() {
        tooltip.style.display = 'none';
      }, false);
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

    onClick('ugcui-size-small', function() {
      shared.ugcSignals.object_changesize.dispatch(SIZE_SMALL);
    });

    onClick('ugcui-size-med', function() {
      shared.ugcSignals.object_changesize.dispatch(SIZE_MED);
    });

    onClick('ugcui-size-large', function() {
      shared.ugcSignals.object_changesize.dispatch(SIZE_LARGE);
    });

    onClick('ugcui-undo', function() {
      shared.ugcSignals.object_undo.dispatch();
      shared.ugcSignals.submit_dialogue.dispatch(); // TODO Give this its own button
    });

    onClick('ugcui-create', function() {
      shared.ugcSignals.object_createmode.dispatch();
    });

    onClick('ugcui-erase', function() {
      shared.ugcSignals.object_erasemode.dispatch();
    });

    onClick('ugcui-reflect', function() {
      if (!hasClass(this, 'active')) {
        addClass(this, 'active');
        shared.ugcSignals.object_symmetrymode.dispatch(true);
      } else {
        removeClass(this, 'active');
        shared.ugcSignals.object_symmetrymode.dispatch(false);
      }
    });


    shared.ugcSignals.object_erasemode.add(function() {
      addClass(document.getElementById('ugcui-erase'), 'active');
      removeClass(document.getElementById('ugcui-create'), 'active');
    });

    shared.ugcSignals.object_createmode.add(function() {
      addClass(document.getElementById('ugcui-create'), 'active');
      removeClass(document.getElementById('ugcui-erase'), 'active');
    });

    return;

    /**
     * Color dispatching
     */

      // TODO separate dispatch from response

    var colorOptions = document.getElementById('color').getElementsByClassName('options')[0].getElementsByTagName('polygon');
    for (var i = 0; i < colorOptions.length; i++) {

      onClick(colorOptions[i], function() {
        var hex = parseInt(this.getAttribute('fill').substr(1), 16);
        for (var j = 0; j < colorOptions.length; j++) {
          colorOptions[j].setAttribute('class', '');
        }
        this.setAttribute('class', 'selected');
        shared.ugcSignals.object_changecolor.dispatch(hex);

      });
    }

    onClick('life', function() {
      document.getElementById('life').setAttribute('class', 'active');
      document.getElementById('dark').setAttribute('class', '');
      // TODO
    });

    onClick('dark', function() {
      document.getElementById('dark').setAttribute('class', 'active');
      document.getElementById('life').setAttribute('class', '');
      // TODO
    });

    /**
     * Signal response
     */

    shared.ugcSignals.object_changesize.add(function(size) {
      findBG('icon-size-small').setAttribute('class', 'bg');
      findBG('icon-size-med').setAttribute('class', 'bg');
      findBG('icon-size-large').setAttribute('class', 'bg');
      switch (size) {
        case SIZE_SMALL:
          findBG('icon-size-small').setAttribute('class', 'active bg');
          break;
        case SIZE_MED:
          findBG('icon-size-med').setAttribute('class', 'active bg');
          break;
        case SIZE_LARGE:
          findBG('icon-size-large').setAttribute('class', 'active bg');
          break;
      }
    });

  };

  this.resize = function(width, height) {

    return;

    var area = width * height;
    var s = area / NATIVE_AREA;


    svgLeft.firstChild.setAttribute('transform', 'translate(10, 0) scale(' + s + ')');
  };

  this.update = function() {
    animalSlide += (animalSlideTarget - animalSlide) * 0.5;
    animalInnerDiv.style.left = Math.round(animalSlide) + 'px';
  };

  this.getDomElement = function () {
    return domElement;
  };

  function closeAnimals() {
    // document.getElementById('animal-container').style.opacity = 0;
    document.getElementById('animal-container').style.display = 'none';
    shared.ugcSignals.object_mode.dispatch();
  }

  function closeAllMenus() {
    var menus = svgLeft.getElementsByClassName('menu');
    for (var i = 0; i < menus.length; i++) {
      showHideMenuButtons(menus[i], false);
    }
  }

  function makeOpenMenuFunction(menu) {
    return function() {
      closeAllMenus();
      showHideMenuButtons(menu, true);
    };
  }

  function showHideMenuButtons(menu, show) {
    var buttons = menu.getElementsByClassName('menu-buttons');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].style.display = show ? 'block' : 'none';
    }
  }

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

  function onClick(id, fnc, stopPropagation) {
    stopPropagation = stopPropagation || true;
    var elem;
    if (typeof id == 'string') {
      elem = document.getElementById(id);
    } else {
      elem = id;
    }
    if (stopPropagation) {
      elem.addEventListener('mousedown', function(e) {
        // better safe than sorry ....
        e.stopPropagation();
        e.stopImmediatePropagation();
      }, false);
    }
    elem.addEventListener('mouseup', function(e) {
      if (stopPropagation) {
        // better safe than sorry ....
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      fnc.call(elem);
    }, false);
  }

  function hideSubmitDialogue() {
    submitShade.style.zIndex = '-20';
    submit.style.top = '200%';
    submit.style.opacity = 0;
    submitTitle.value = TITLE_STRING;
    submitEmail.value = 'YOUR EMAIL ADDRESS';
  }

  function findBG(containerId) {
    var c = document.getElementById(containerId);
    return c.getElementsByClassName('bg')[0];
  }

  function hasClass(elem, class) {
    return elem.getAttribute('class').indexOf(class) != -1;
  }

  function addClass(elem, class) {
    if (hasClass(elem, class)) return;
    elem.setAttribute('class', elem.getAttribute('class') + ' ' + class);
  }

  function removeClass(elem, class) {
    if (!hasClass(elem, class)) return;
    var reg = new RegExp(' ' + class, 'g');
    elem.setAttribute('class', elem.getAttribute('class').replace(reg, ''));
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

  function getSvgLeftContents() {
    return ['<svg class="ugcui" id="ugcui-top-left" version="1.1"',
      '     xmlns="http://www.w3.org/2000/svg"',
      '     xmlns:xlink="http://www.w3.org/1999/xlink"',
      '     xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"',
      '     x="0px" y="0px" width="800px" height="600px" viewBox="0 -1.338 800 600"',
      '     enable-background="new 0 -1.338 800 600"',
      '     xml:space="preserve" >',
      '    <g class="button" title="Mirror Mode" id="ugcui-reflect">',
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
      '    <g class="button active" title="Draw" id="ugcui-create">',
      '      <polygon class="hex" points="54.576,69.401 41.45,46.666 54.576,23.932 80.828,23.932 93.954,46.666',
      '  80.827,69.401 "/>',
      '      <path fill="#404040" d="M67.92,32.249l-12.121,7.29l-0.154-0.098v13.47l12.256,7.661l12.258-7.661V40.265L67.92,32.249z',
      '  M67.883,34.149l9.991,6.543l-9.978,6.405l-10.564-6.602L67.883,34.149z M57.255,42.346l9.842,6.151v9.673l-9.842-6.151V42.346z',
      '  M78.548,52.019l-9.842,6.15v-9.679l9.842-6.318V52.019z"/>',
      '    </g>',
      '    <g class="button" title="Erase" id="ugcui-erase">',
      '      <polygon class="hex" points="96.026,93.332 82.9,70.598 96.026,47.862 122.277,47.862 135.404,70.597',
      '  122.277,93.332 "/>',
      '      <path fill="#404040" d="M111.728,61.285l-13.493,7.131v5.163l9.462,5.387l13.086-7.798v-4.968L111.728,61.285z M113.478,69.723',
      '  l-5.788,3.394l-7.658-4.416l6.083-3.215L113.478,69.723z M108.238,74.062l5.928-3.477v3.252l-5.928,3.534V74.062z M99.328,69.556',
      '  l7.817,4.509v3.328l-7.817-4.45V69.556z"/>',
      '    </g>',
      '    <g class="button" title="Color" id="ugcui-color">',
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
      '    <g class="button" title="Undo" id="ugcui-undo">',
      '      <polygon class="hex" points="54.576,165.125 41.45,142.391 54.576,119.657 80.827,119.657 93.953,142.391',
      '  80.827,165.125 "/>',
      '      <path fill="#404040" d="M66.954,131.614v-0.083v-0.826c0-0.561-0.399-0.79-0.885-0.51l-0.716,0.414',
      '  c-0.485,0.281-1.281,0.738-1.768,1.021l-0.714,0.413c-0.486,0.281-0.486,0.739,0,1.02l0.714,0.414',
      '  c0.487,0.281,1.283,0.741,1.768,1.02l0.716,0.415c0.486,0.28,0.885,0.051,0.885-0.509v-0.827v-0.152',
      '  c4.616,0.128,8.316,3.893,8.325,8.539c-0.008,4.722-3.829,8.542-8.551,8.549v0.001v-0.001c-0.414,0-0.822-0.027-1.219-0.084',
      '  c-0.491-0.071-0.947,0.272-1.016,0.763c-0.07,0.493,0.271,0.948,0.762,1.017c0.482,0.07,0.974,0.104,1.473,0.105v0.001',
      '  c5.717-0.002,10.351-4.635,10.352-10.352C77.078,136.318,72.565,131.735,66.954,131.614"/>',
      '    </g>',
      '    <g class="folder">',
      '      <g class="button" title="Small" id="ugcui-size-small">',
      '        <polygon class="hex" points="13.126,141.194 0,118.46 13.126,95.725 39.377,95.725 52.503,118.46 39.377,141.194',
      '    "/>',
      '        <path fill="#404040" d="M32.34,113.829v-6.316l-6.006-3.258l-6.285,3.118v6.456l-12.364,7.334l18.509,11.5l18.509-11.5',
      '    L32.34,113.829z M20.676,121.195l5.477-3.378l5.539,3.391l-5.497,3.367L20.676,121.195z M25.674,124.894l-5.517,3.378l-5.457-3.391',
      '    l5.457-3.367L25.674,124.894z M29.156,115.964l2.936-1.65l5.515,3.272l-5.395,3.304l-5.541-3.393L29.156,115.964z M20.366,114.272',
      '    l5.266,3.226l-5.476,3.378l-5.374-3.29L20.366,114.272z M32.212,121.527l5.477,3.354l-5.457,3.39l-5.517-3.378L32.212,121.527z',
      '    M32.733,121.208l5.403-3.309l5.52,3.274l-5.45,3.386L32.733,121.208z M14.253,117.899l5.384,3.297l-5.454,3.364l-5.45-3.386',
      '    L14.253,117.899z M20.675,128.594l5.521-3.381l5.52,3.38l-5.52,3.43L20.675,128.594z"/>',
      '      </g>',
      '      <g class="options">',
      '        <g class="button" title="Medium" id="ugcui-size-med">',
      '          <polygon class="hex" points="13.126,188.696 0,165.962 13.126,143.227 39.377,143.227 52.503,165.962',
      '    39.377,188.696 "/>',
      '          <path fill="#404040" d="M35.384,164.724v-9.757l-8.837-4.797l-9.248,4.927v9.452l-9.613,5.704l18.509,11.5l18.509-11.5',
      '    L35.384,164.724z M20.675,170.283l2.864-1.765l2.803,1.666l2.609-1.564l2.74,1.678l-5.496,3.367L20.675,170.283z M25.674,173.983',
      '    l-5.517,3.378l-5.459-3.391l5.458-3.367L25.674,173.983z M34.889,165.062l2.718,1.612l-5.395,3.305l-2.734-1.674L34.889,165.062z',
      '    M23.011,168.204l-2.856,1.761l-5.373-3.291l2.832-1.68L23.011,168.204z M32.212,170.616l5.478,3.354l-5.458,3.391l-5.517-3.378',
      '    L32.212,170.616z M32.732,170.297l5.404-3.31l5.52,3.276l-5.45,3.386L32.732,170.297z M14.253,166.988l5.383,3.297l-5.454,3.364',
      '    l-5.449-3.385L14.253,166.988z M20.675,177.683l5.52-3.381l5.519,3.381l-5.519,3.429L20.675,177.683z"/>',
      '        </g>',
      '        <g class="button" title="Large" id="ugcui-size-large">',
      '          <polygon class="hex" points="13.126,236.559 0,213.824 13.126,191.089 39.377,191.089 52.503,213.824',
      '    39.377,236.559 "/>',
      '          <path fill="#404040" d="M38.393,215.247v-13.17l-11.994-5.937l-12.195,6.057v12.926l-6.519,3.868l18.509,11.5l18.509-11.5',
      '    L38.393,215.247z M25.674,222.721l-5.517,3.379l-5.459-3.392l5.458-3.366L25.674,222.721z M32.212,219.355l5.478,3.353l-5.458,3.392',
      '    l-5.517-3.379L32.212,219.355z M32.732,219.035l5.404-3.31l5.52,3.276l-5.45,3.387L32.732,219.035z M14.253,215.725l5.383,3.299',
      '    l-5.454,3.364l-5.449-3.387L14.253,215.725z M20.675,226.42l5.52-3.381l5.519,3.381l-5.519,3.43L20.675,226.42z"/>',
      '        </g>',
      '      </g>',
      '    </g>',
      '</svg>'].join("\n");

  }

  function getCSS() {
    return [
      '.ugcui g.button {',
      '  cursor: pointer;',
      '}',
      '.ugcui g.button polygon.hex {',
      '  fill: rgba(255, 255, 255, 0.7);',
      '}',
      '.ugcui g.button:hover polygon.hex {',
      '  fill: #fff;',
      '}',
      '.ugcui g.button.active polygon.hex {',
      '  fill: #F15C22;',
      '}',
      '.ugcui g.button.active:hover polygon.hex {',
      '  fill: #F77952;',
      '}',
      '.ugcui g.folder g.options {',
      '  display: none;',
      '}',
      '.ugcui g.folder:hover g.options {',
      '  display: block;',
      '}',
      '#voxel-submit-text { float: left; width: 300px; margin-right: 10px; }',
      '#voxel-submit-inputs { margin-right: 10px; margin-top: -4px; float: left; }',
      '#voxel-submit-submit { cursor: pointer; letter-spacing: 0.025em; font: 17px/65px FuturaBT-Bold, sans-serif; float: left; border: 1px solid #d6d1c2; width: 200px; text-align: center; margin-top: -2px;  }',
      '#voxel-submit-submit:hover { border-color: #404040; background-color: #404040; color: #f4f1e8; }',
      '#voxel-submit input { margin-bottom: 3px; color: #404040; font: 11px/22px FuturaBT-Bold, sans-serif; width: 200px; padding: 2px 4px  }',

      '#voxel-submit-image { margin-bottom: 20px; width: 735px; height: 465px; background-color: #000; }',
      '#voxel-submit-shade { z-index: -12; opacity: 0.4; -webkit-transition: opacity 0.2s linear; background-color: #f4f1e8; position: fixed; top: 0; left: 0; width: 100%; height: 100% }',
      '#voxel-submit { font: 12px/18px FuturaBT-Medium; color: #404040; z-index: 21; opacity: 0; -webkit-transition: opacity 0.2s linear; width: 735px; height: 556px; padding: 13px; margin-left: -380px; margin-top: -291px; background-color: #f4f1e8; box-shadow: 0px 0px 10px rgba(0,0,0,0.3) }',
      '.animal-container { opacity: 1; -webkit-transition: opacity 0.3s linear; }',
      '.animal { text-align: center; -webkit-transition: all 0.1s linear; float: left; height: ' + (ANIMAL_CONTAINER_HEIGHT - 22) + 'px; background: url(/files/soupthumbs/shadow.png); border: 1px solid rgba(0,0,0,0); width: 120px; margin-right: 10px; }',
      '.animal:hover { background-color: rgba(255, 255, 255, 0.4); border: 1px solid #fff; }',
      '.animal-controls { height: 21px; overflow:hidden; line-height: 0px; border-right: 1px solid #fff; opacity: 0; display: inline-block; position: relative; margin-top: 71px; }',
      '.animal:hover .animal-controls { opacity: 1; }',
      '.animal-controls div { display: none; text-align: center; border: 1px solid #fff; border-right: 0; border-bottom: 0; display: inline-block; width: 20px;}',
      '.animal-controls div.animal-add:hover, .animal-controls div.animal-remove:hover { cursor: pointer; background-color: #f65824; }',
      '.animal-controls div.animal-count { background-color: #fff; color: #777; width: 25px; }'
    ].join("\n");
  }

}
