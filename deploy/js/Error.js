// Create a class to handle emitting cases

var console = console || function() {};

function HandleErrors(d) {

  var that = this;
  var destination = d || "/alternate";
	var fired = false;

  Trailer = "<ul id = 'trailer'><li class = 'first'><a href = 'http://youtu.be/VUQSoHFMD8c'>Watch the Trailer</a></li><li><a href = 'http://romealbum.com/'>Rome Album</a></li><li class = 'last'><a href = '/tech'>The Technology</a></li><li class = 'clear'></li></ul>";

  this.MagicVariable = "case";

  this.Errors = [
    "We are very sorry, but &#147;3 Dreams of Black&#148; is an experiment and unfortunately does not currently function on every configuration. It appears that your computer&#39;s graphics card doesn&#39;t support WebGL technology. You can find more details for troubleshooting <a href = 'http://get.webgl.org/troubleshooting/'>here</a> and obtain a list of recommended graphics cards." + Trailer,
    "Apologies for the tech trouble. &#147;3 Dreams of Black&#148; is an experiment and unfortunately does not currently function on every configuration. It appears your computer&#39;s graphics card doesn&#39;t support WebGL in Mozilla Firefox. We recommend you try it in <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>Google Chrome</a>. You can also find more details for troubleshooting <a href = 'http://get.webgl.org/troubleshooting/'>here</a> and obtain a list of recommended graphics cards." + Trailer,
    "We are sorry, but it appears that your browser does not support WebGL. Please <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and try launching this site again. If you are unable to install a new web browser, you can try downloading the <a href = 'http://www.google.com/chromeframe'>Google Chrome Frame plugin</a> instead.",
    "We are sorry, but it appears that your browser does not support WebGL. Please <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and try launching this site again.",
    "We are sorry, but it appears that your browser does not support WebGL. &#147;3 Dreams of Black&#148; is an experiment that was designed with the browser <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>Google Chrome</a> in mind. Please try launching this site again on a computer with up-to-date graphics drivers. Though not the full experience, you can also watch a video trailer, access the rest of the ROME album site, and learn more about WebGL technology." + Trailer,
    "This project is very experimental. With your current configuration, you may experience problems such as video flickering, so you may want to try this in Chrome Canary, the cutting-edge experimental version of Google Chrome. Download Google Chrome Canary <a href = 'http://tools.google.com/dlpage/chromesxs?platform=win'>here</a>, or <a id = 'escape-from-warning' href = '#'>try the experience anyway</a>.",
    "We&#39;re sorry, but &#147;3 Dreams of Black&#148; is an experiment that was designed with the browser Google Chrome in mind. As a result, it may not work perfectly in your current browser. For the best viewing experience, you can <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and launch this site again, or go ahead and <a id = 'escape-from-warning' href = '#'>try it anyway</a>.",
    "You appear to be running an older version of Chrome. Please click on the wrench icon on the browser toolbar, and select 'Update Google Chrome' before viewing ROME.",
    "We are sorry, but it appears that your browser does not support WebGL. This could be due to a number of different reasons. For more information visit this <a href = 'http://get.webgl.org/troubleshooting/'>page</a>.",
    "We are sorry, but it appears that your browser will not support &#147;3 Dreams of Black&#148;. This could be due to a number of different reasons. For more information visit this <a href = 'http://get.webgl.org/troubleshooting/'>page</a>",
    "We are sorry, but your Chromebook does not support WebGL. (Don't worry, this happens to many visitors.) Please visit again using a computer with a WebGL-compatible graphics card."
  ];

  this.getUrlVars = function() {
      var vars = null;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

      for(var i = 0; i < hashes.length; i++) {
          var hash = hashes[i].split('=');
          if(hash.length == 2) {
            var a = hash[0];
            var b = hash[1];
            if(a && b) {
              if(vars == null) {
                vars = {};
              }
              vars[a] = b;
            }
          }
      }
      return vars;
  };

  this.checkForErrors = function() {
    
    // scrape everything navigator.userAgent;
    var Detector = {
        webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
        conditions : [
                      ( function () { return hasUserAgent(/[cC]hrome/ig); } )(),
                      ( function () { return hasUserAgent(/[Ff]ire[Ff]ox/ig); } )(),
                      ( function () { return hasUserAgent(/[Mm][Ss][Ii][Ee] [7891]/) && hasUserAgent(/[Ww]indows [Nn][Tt] [67891]/) && !hasUserAgent(/[Cc]hrome[Ff]rame/); } )(),
                      ( function () { return hasUserAgent(/[Ss]afari/) && hasUserAgent(/[Mm]ac [Oo][Ss] [Xx] 10\_[6789]/); } )(),
                      ( function () { return hasUserAgent(/i[Pp]hone/) || hasUserAgent(/i[Pp]ad/) || hasUserAgent(/[Aa]ndroid/); } )()
                      ],
        message : ""
    };

    if(Detector.webgl) {
      // We're good!      
      if(Detector.conditions[1]) {
        // Overlay condition check with localStorage
        // if(hasLocalStorage()) {
          // go ahead darling
          // if(localStorage.getItem("RomeError") == "false") {
            // overlay our condition
            window.addEventListener("load", function() {

              var uiContainer = document.getElementById('ui-container');
              if(uiContainer) {
                uiContainer.style.display = "none";
              }

              var shade = document.createElement("div");
              var errorContainer = document.createElement("div");
              var error = document.createElement("div");
                  error.setAttribute("id", "rome-error");
              var styles = document.createElement("style");
                  styles.innerHTML = "a { color: #fff; }";
                  document.getElementsByTagName("head")[0].appendChild(styles);

              // Styling
              var shadeStyle = "width: 100%; height: 100%; position: fixed; margin: 0; padding: 0; top: 0; left: 0;";
              shade.setAttribute("style", shadeStyle);
              var errorContainerStyle = "position: fixed; width: 400px; margin: 0 auto; top: " + (window.innerHeight - 200) / 2.0 + "px; left: " + (window.innerWidth - 400) / 2.0 + "px;";
              errorContainer.setAttribute("style", errorContainerStyle);
              var errorStyle = "width: 330px; padding: 50px 35px; background: rgba(0, 0, 0, 0.3); color: #fff; color: #fff; line-height: 18px !important; font: 500 12px/18px 'Futura', Arial, sans-serif; letter-spacing: 1px; text-align: center;";
              error.setAttribute("style", errorStyle);
              error.innerHTML = that.Errors[6];

              // Add Event Listeners
              var windowResize = function() {
                errorContainer.style.left = (window.innerWidth - 400) / 2.0 + "px";
                errorContainer.style.top = (window.innerHeight) / 2.0 + "px";
              };
              var removeErrors = function() {
                document.body.removeChild(shade);
                document.body.removeChild(errorContainer);
                window.removeEventListener("resize", windowResize, false);
                LauncherSection.showUI();
                localStorage.setItem("RomeError", true);
              };
              shade.addEventListener("click", function() {
                removeErrors();
              }, false);
              window.addEventListener("resize", windowResize, false);

              errorContainer.appendChild(error);
              document.body.appendChild(shade);
              document.body.appendChild(errorContainer);

              var escape = document.getElementById("escape-from-warning");
                  escape.addEventListener("click", function(e) {
                    e.preventDefault();
                    removeErrors();
                  }, false);
            }, false);

            HandleErrors.isWebGLAndBeta = true;
          // }
        // }
      } else if(hasUserAgent(/[Ww]indows/)) {

        // Overlay condition check with localStorage
        // if(hasLocalStorage()) {
          // go ahead darling
          // if(localStorage.getItem("RomeError") == "false") {
            // overlay our condition
						if(isChromeVerOrLess(11)) {

							if(isChromeVerOrLess(10)) {

								// Throw back
								window.location = destination + "?" + this.MagicVariable + "=7";

              // } else {
              // 
              //                  window.addEventListener("load", function() {
              // 
              //                    var uiContainer = document.getElementById('ui-container');
              //                    if(uiContainer) {
              //                      uiContainer.style.display = "none";
              //                    }
              // 
              //                    var shade = document.createElement("div");
              //                    var errorContainer = document.createElement("div");
              //                    var error = document.createElement("div");
              //                        error.setAttribute("id", "rome-error");
              //                    var styles = document.createElement("style");
              //                        styles.innerHTML = "a { color: #fff; }";
              //                        document.getElementsByTagName("head")[0].appendChild(styles);
              // 
              //                    // Styling
              //                    var shadeStyle = "width: 100%; height: 100%; position: fixed; margin: 0; padding: 0; top: 0; left: 0;";
              //                    shade.setAttribute("style", shadeStyle);
              //                    var errorContainerStyle = "position: fixed; width: 400px; margin: 0 auto; top: " + (window.innerHeight - 200) / 2.0 + "px; left: " + (window.innerWidth - 400) / 2.0 + "px;";
              //                    errorContainer.setAttribute("style", errorContainerStyle);
              //                    var errorStyle = "width: 330px; padding: 50px 35px; background: rgba(0, 0, 0, 0.3); color: #fff; color: #fff; line-height: 18px; font: 500 12px/18px 'Futura', Arial, sans-serif; letter-spacing: 1px; text-align: center;";
              //                    error.setAttribute("style", errorStyle);
              //                    error.innerHTML = that.Errors[5];
              // 
              //                    // Add Event Listeners
              //                    var windowResize = function() {
              //                      errorContainer.style.left = (window.innerWidth - 400) / 2.0 + "px";
              //                      errorContainer.style.top = (window.innerHeight) / 2.0 + "px";
              //                    };
              //                    var removeErrors = function() {
              //                      document.body.removeChild(shade);
              //                      document.body.removeChild(errorContainer);
              //                      window.removeEventListener("resize", windowResize, false);
              //                      LauncherSection.showUI();
              //                      localStorage.setItem("RomeError", true);
              //                    };
              //                    shade.addEventListener("click", function() {
              //                      removeErrors();
              //                    }, false);
              //                    window.addEventListener("resize", windowResize, false);
              // 
              //                    errorContainer.appendChild(error);
              //                    document.body.appendChild(shade);
              //                    document.body.appendChild(errorContainer);
              // 
              //                    var escape = document.getElementById("escape-from-warning");
              //                        escape.addEventListener("click", function(e) {
              //                          e.preventDefault();
              //                          removeErrors();
              //                        }, false);
              //                  }, false);
              // 
              //                  HandleErrors.isWebGLAndBeta = true;
			          // }
			        // }
						}
					}

			}
    } else {
      // run other conditions
      for(var i = 0; i < Detector.conditions.length; i++) {
        if(Detector.conditions[i]) {
          // Then we've found what we're looking for!
          window.location = destination + "?" + this.MagicVariable + "=" + i;
					fired = true;
					return false;
        }
      }
      // All purpose error message
			if(!fired) {
				window.location = destination + "?" + this.MagicVariable + "=8";
			}
    }
  };
  // returns true or false based on 
  function hasUserAgent(condition) {
    return navigator.userAgent.match(condition);
  }

	function isChromeVerOrLess(n) {

		var string = navigator.userAgent
		var regex = /[Cc]hrome\/([0-9]{1,2})/;
		var result = string.match(regex);
		if(result) {
			result = parseInt(result[1]);
			return (result <= n);
		} else {
			return false;
		}
	}

  function hasLocalStorage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }
}
HandleErrors.isWebGLAndBeta = false;

// if has get contents of case then dont run else run HandleErrors
// Read a page's GET URL variables and return them as an associative array.
var romeErrors = new HandleErrors();
var variables = romeErrors.getUrlVars();
if(variables) {
  if(variables[romeErrors.MagicVariable]) {
    // this means we are in the error page
		if(window.addEventListener) {

			window.addEventListener("load", function() {
	      var iterator = variables[romeErrors.MagicVariable];
	      var error = document.getElementById("error");
						if(iterator > romeErrors.Errors.length) {
							iterator = 8;
						}
						error.innerHTML = '<p style="line-height: 18px !important;">'+romeErrors.Errors[iterator]+'</p>';

	    }, false);

		} else {

			window.attachEvent("load", function() {
	      var iterator = variables[romeErrors.MagicVariable];
	      var error = document.getElementById("error");
						if(iterator > romeErrors.Errors.length) {
							iterator = 8;
						}
						error.innerHTML = '<p style="line-height: 18px !important;">'+romeErrors.Errors[iterator]+'</p>';
				return false;

	    });

		}
  }
} else {
  romeErrors.checkForErrors();
}