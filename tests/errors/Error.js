// Create a class to handle emitting cases
function HandleErrors(d) {

  var that = this;
  var destination = d || "http://ro.me/alternate";

  Trailer = "<ul id = 'trailer'><li class = 'first'><a href = '#'>Watch Trailer</a></li><li><a href = 'http://ro.me/album'>Rome Album</a></li><li class = 'last'><a href = 'http://ro.me/tech'>The Technology</a></li><li class = 'clear'></li></ul>";

  this.MagicVariable = "case";

  this.Errors = [
    "<p>We are very sorry, but &#147;3 Dreams of Black&#148; is an experiment and unfortunately does not currently function on every configuration. It appears that your computer&#39;s graphics card doesn&#39;t support WebGL technology. You can find more details for troubleshooting <a href = 'http://get.webgl.org/troubleshooting/'>here</a> and obtain a list of recommended graphics cards. Although you are unable to participate in the full experience today, we expect this website to be up for a while, so please check back if you&#39;re on a different computer. Though not the full experience, you can also watch a video trailer, access the rest of the ROME album site and learn more about WebGL technology.</p>" + Trailer,
    "<p>Apologies for the tech trouble. &#147;3 Dreams of Black&#148; is an experiment and unfortunately does not currently function on every configuration. It appears your computer&#39;s graphics card doesn&#39;t support WebGL technology. You can find more details for troubleshooting <a href = 'http://get.webgl.org/troubleshooting/'>here</a> and obtain a list of recommended graphics cards. Although you are unable to participate in the full experience today, we expect this website to be up for a while, so please check back if you&#39;re on a different computer. Though not the full experience, you can also watch a video trailer, access the rest of the ROME album site and learn more about WebGL technology.<p>" + Trailer,
    "<p>We are sorry, but it appears that your browser does not support WebGL. Please <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and try launching this site again. If you are unable to install a new web browser, you can try downloading the <a href = 'http://www.google.com/chromeframe'>Google Chrome Frame plugin</a> instead.</p>",
    "<p>We are sorry, but it appears that your browser does not support WebGL. Please <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and try launching this site again.</p>",
    "<p>We are sorry, but it appears that your browser does not support WebGL. &#147;3 Dreams of Black&#148; is an experiment that was designed with the browser Google Chrome in mind. Please try launching this site again on a computer with up-to-date graphics drivers. Though not the full experience, you can also watch a video trailer, access the rest of the ROME album site, and learn more about WebGL technology.</p>" + Trailer,
    "<p>We&#39;re sorry, but &#147;3 Dreams of Black&#148; is an experiment that was designed with the browser Google Chrome in mind. As a result, it may not work perfectly in your current browser. For the best viewing experience, you can <a href = 'http://www.google.com/chrome?brand=CHKX&utm_campaign=en&utm_source=en-rome-webgl&utm_medium=rome-webgl'>download Google Chrome</a> and launch this site again, or go ahead and <a id = 'escape-from-warning' href = '#'>try it anyway</a>.</p>"
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
                      ( function () { return hasUserAgent(/[cC]hrome/); } )(),
                      ( function () { return hasUserAgent(/[Ff]ire[Ff]ox\/[4-9]/); } )(),
                      ( function () { return hasUserAgent(/MSIE [789]/) && hasUserAgent(/[Ww]indows [Nn][Tt] [6789]\./); } )(),
                      ( function () { return hasUserAgent(/[Ss]afari/) && hasUserAgent(/[Mm]ac [Oo][Ss] [Xx] 10\_[6789]/); } )(),
                      ( function () { return hasUserAgent(/i[Pp]hone/) || hasUserAgent(/i[Pp]ad/) || hasUserAgent(/[Aa]ndroid/); } )()
                      ],
        message : ""
    };

    if(Detector.webgl) {
      // We're good!
      if(Detector.conditions[1]) {
        // Overlay condition check with localStorage
        // Detector.message = Errors[5];
        if(hasLocalStorage()) {
          // go ahead darling
          if(!localStorage.getItem("RomeError")) {
            // overlay our condition

            window.onload = function() {

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
              var errorContainerStyle = "position: fixed; width: 400px; margin: 50px auto; top: 0; left: " + (window.innerWidth - 400) / 2.0 + "px;";
              errorContainer.setAttribute("style", errorContainerStyle);
              var errorStyle = "width: 330px; padding: 50px 35px; background: rgba(0, 0, 0, 0.3); color: #fff; font: color: #fff; font: 500 12px/18px 'Futura', Arial, sans-serif; letter-spacing: 1px; text-align: center;";
              error.setAttribute("style", errorStyle);
              error.innerHTML = this.Errors[5];

              // Add Event Listeners
              var windowResize = function() {
                errorContainer.style.left = (window.innerWidth - 400) / 2.0 + "px";
              };
              var removeErrors = function() {
                document.body.removeChild(shade);
                document.body.removeChild(errorContainer);
                window.removeEventListener("resize", windowResize, false);
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
            };

            localStorage.getItem("RomeError", true);
          }
        }
      }
    } else {
      // run other conditions
      for(var i = 0; i < Detector.conditions.length; i++) {
        if(Detector.conditions[i]) {
          // Then we've found what we're looking for!
          window.location = destination + "?" + this.MagicVariable + "=" + i;
          break;
        }
      }
    }
  };
  // returns true or false based on 
  function hasUserAgent(condition) {
    return navigator.userAgent.match(condition);
  }

  function hasLocalStorage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }
}

// if has get contents of case then dont run else run HandleErrors
// Read a page's GET URL variables and return them as an associative array.
var romeErrors = new HandleErrors();
var variables = romeErrors.getUrlVars();

if(variables) {
  if(variables[romeErrors.MagicVariable]) {
    // this means we are in the error page
    window.onload = function() {
      var iterator = variables[romeErrors.MagicVariable];
      var error = document.getElementById("error");
          error.innerHTML = romeErrors.Errors[iterator];
    };
  }
} else {
  romeErrors.checkForErrors();
}