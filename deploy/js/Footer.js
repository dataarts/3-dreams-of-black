// Add EMI content
// var emiBuyButtonUrl = 'http://widgets.platform.emi.com/widget/1.0/';
// var emiBuyButtonUuids = ["c9e456919b824bdeb2e3a326b122db43"];
// var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl.": "http://www.");
// document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
// document.writeln(unescape("%3Cscript src='" + emiBuyButtonUrl + "js/emi_buy_button.js' type='text/javascript'%3E%3C/script%3E"));

var Footer = function(container, prefix) {

    var path = prefix || "files/footer";
    var init = true;
    var emiButton;

    this.id = Footer.multipleInstances;
    var divReplacement = "rome_footer_buy_album-" + this.id;
    var terms          = "rome_terms-" + this.id;
    var privacy        = "rome_privacy-" + this.id;
    var facebook       = "rome_facebook-" + this.id;
    var twitter        = "rome_twitter-" + this.id;
    var credits        = "rome_credits-" + this.id;

    if(!window.screenX && !window.screenY) {
      window.screenX = window.screenLeft;
      window.screenY = window.screenTop;
    }

    var popupPosition = {
      x: (window.screenX + window.innerWidth / 2.0),
      y: (window.screenY + window.innerHeight / 2.0)
    };
    var DEFAULT_POPUP_PROPERTIES = 'menubar=0, resizable=0, location=0, toolbar=0, status=0, scrollbars=1, titlebar=0, left=' + (popupPosition.x - 150) + ', top=' + (popupPosition.y - 300) + ', width=330, height=600';
    var DEFAULT_POPUP_SHARING = 'menubar=0, resizable=0, location=0, toolbar=0, status=0, scrollbars=1, titlebar=0, left=' + (popupPosition.x - 225) + ', top=' + (popupPosition.y - 250) + ', width=550, height=500';

    this.getDomElement = function() {

        return container;

    };

    this.load = function() {

        var EMIBuyButton = EMIBuyButton || null;
        if (EMIBuyButton) {
            emiButton = new EMIBuyButton({

                buttonID: "c9e456919b824bdeb2e3a326b122db43",
                buttonImageUrl: path + "/buy_button-trans.png",
                useVendorImages: true

            }).replaceDiv(divReplacement);

            init = false;

        }

        Footer.handleLinkListeners(document.getElementById(credits), "Credits", DEFAULT_POPUP_PROPERTIES);
        Footer.handleLinkListeners(document.getElementById(privacy), "Privacy", DEFAULT_POPUP_PROPERTIES);
        Footer.handleLinkListeners(document.getElementById(terms), "Terms", DEFAULT_POPUP_PROPERTIES);

        Footer.handleLinkListeners(document.getElementById(twitter), "Twitter", DEFAULT_POPUP_SHARING);
        Footer.handleLinkListeners(document.getElementById(facebook), "Facebook", DEFAULT_POPUP_SHARING);

        return this;

    };

    Footer.handleLinkListeners = function(dom, title, properties) {

      if(!properties) {
        properties = DEFAULT_POPUP_PROPERTIES;
      }

			if(dom.addEventListener) {

	      dom.addEventListener("click", function(e) {

					handleDomEvent(this, e);

				}, false);

			} else {

				dom.attachEvent("click", function(e) {

					handleDomEvent(this, e);

				});

			}
      
			function handleDomEvent(d, e) {

				e.preventDefault();
				var url = d.getAttribute("href");
				var win = window.open(url, title, properties);
				return false;

			}

    }

		if(window.addEventListener) {

			window.addEventListener("load", this.load, false);

		} else {

			window.attachEvent("load", this.load);

		}

    // Add html
    var html = ['<div class="rome-footer">',
		'<div class="shout-out">',
		'  <ul>',
		'    <li class="last"><a href="http://www.chromeexperiments.com/webgl"><img src="' + path + '/chrome-trans.png" alt="This is a Chrome Experiment" border="0" /></a></li>',
		'    <li class="divider">&nbsp;</li>',
		'    <li class="last"><a href="http://google.com/"><img src="' + path + '/google-trans.png" alt="Made With Friends From Google" border="0" /></a></li>',
		'    <li class="clear">&nbsp;</li>',
		'  </ul>',
		'</div>',
		'<div class="navigation">',
		'  <ul class="primary">',
		'    <li class="first"><a href="/tech" target="_blank">Technology</a></li>',
		'    <li><a id = "' + credits + '" href="/credits">Credits</a></li>',
		'    <li><a href="http://romealbum.com/" target="_blank">Rome Album</a></li>',
		'    <li id="' + divReplacement + '" class="rome_footer_buy_album">',
		'      <a href = "http://widgets.platform.emi.com/landing/2520403d33984be0b70fca43945728e9.html" onClick="_gaq.push([\'_trackPageview\', \'/buy_album\'])" target="blank">Buy Album</a>',
		'    </li>',
		'    <li class="last">Share</li>',
		'    <li class="last icons"><a id = "' + facebook + '" href="http://www.facebook.com/sharer.php?u=http://ro.me?fb=1" target="_blank"><img src="' + path + '/fb-trans.png" alt="facebook" border="0"  /></a></li>',
		'    <li class="last icons"><a id = "' + twitter + '" href="http://twitter.com/share?text=%E2%80%9C3%20Dreams%20of%20Black%E2%80%9D%20an%20interactive%20film%20by%20Chris%20Milk%20for%20Danger%20Mouse%20%26%20Daniele%20Luppi%E2%80%99s%20ROME%20album%20%E2%99%A5%20http%3A%2F%2Fro.me%20%23rome%20%23webgl&url=" target="_blank"><img src="' + path + '/twitter-trans.png" alt="twitter" border="0" /></a></li>',
		'    <li class="clear last">&nbsp;</li>',
		'  </ul>',
		'  <ul class="secondary">',
		'    <li class="first"><a id = "' + terms + '" href="/terms">Terms</a></li>',
		'    <li class="last"><a id = "' + privacy + '" href="/privacy">Privacy</a></li>',
		'    <li class="clear last">&nbsp;</li>',
		'  </ul>',
		'</div>',
		'<div class="clear">&nbsp;</div>',
		'</div>',
		'</div>'].join("\n");

    var css = ['.rome-footer * {',
		'  margin: 0;',
		'  padding: 0;',
		'}',
		'.rome-footer {',
		'  font: 500 10px/18px "FuturaBT-Medium", Arial, sans-serif;',
		'  color: #434343;',
		'  text-transform: uppercase;',
		'  letter-spacing: 1px;',
		'}',
		'.rome-footer .shout-out {',
		'  float: left;',
		'  margin: 0 0 0 18px;',
		'}',
		'.rome-footer .navigation {',
		'  float: right;',
		'  margin: 20px 26px 0 0;',
		'  vertical-align: middle;',
		'}',
		'.rome-footer ul li {',
		'  height: 16px;',
		'  border-right: 1px solid #a0a0a0;',
		'  padding: 0 10px 0 10px;',
		'  width: auto;',
		'  float: left;',
		'  line-height: 18px;',
		'  list-style: none;',
		'}',
		'.rome-footer ul li.last,',
		'.rome-footer ul li.last li {',
		'  border: none;',
		'  padding: 0 0 0 10px;',
		'}',
		'.rome-footer .shout-out ul li {',
		'  margin: 0;',
		'  border: 0;',
		'}',
		'.rome-footer .shout-out li.divider {',
		'  margin: 15px -15px 15px 15px;',
		'  height: 24px;',
		'  border-left: 1px solid #a0a0a0;',
		'  border-right: 0 !important;',
		'}',
		'.rome-footer a img {',
		'  border: 0;',
		'}',
		'.rome-footer .secondary a:link, .rome-footer .secondary a:visited {',
		'  color: #777;',
		'}',
		'.rome-footer a:link, .rome-footer a:visited,',
		'.rome-footer .secondary a:hover, .rome-footer .secondary a:active {',
		'  color: #434343;',
		'  text-decoration: none;',
		'}',
		'.rome-footer a:hover, .rome-footer a:active {',
		'  color: #000;',
		'}',
		'.emi_buy_button_link {',
		'  margin-top: 2px;',
		'  height: 8px;',
		'  line-height: 8px;',
		'  overflow: hidden;',
		'}',
		'.rome-footer .rome_footer_buy_album img {',
		'  display: block;',
		'  margin-top: 0;',
		'}',
		'.rome-footer .rome_footer_buy_album a:hover img {',
		'  margin-top: -8px;',
		'}',
		'.emi_vendor_menu.using_image a:hover img {',
		'  margin-top: 0;',
		'}',
		'.emi_vendor_menu.using_image {',
		'  margin-top: -145px;',
		'  margin-left: -11px;',
		'  padding: 10px;',
		'}',
		'.emi_vendor_menu.using_image * {',
		'  text-transform: none;',
		'}',
		'.emi_vendor_menu.using_image .emi_vendor_link {',
		'  margin-top: 5px;',
		'}',
		'.rome-footer .secondary {',
		'  margin: 10px 0 0 0;',
		'  float: right;',
		'}',
		'.clear {',
		'  clear: both;',
		'  display: block;',
		'  overflow: hidden;',
		'  visibility: hidden;',
		'  width: 0;',
		'  height: 0;',
		'}'].join("\n");

    // Handle dom and html content
    container.innerHTML = html;

    // Append stylesheets
    if (Footer.multipleInstances < 1) {

        var rule = document.createTextNode(css);
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
						style.type = "text/css";

        if (style.styleSheet) {

            style.styleSheet.cssText = rule.nodeValue;

        } else {

          style.appendChild(rule);

        }

        head.appendChild(style);

    }

    Footer.multipleInstances++;
}
Footer.multipleInstances = 0;