// Add EMI content
var emiBuyButtonUrl = 'http://widgets.platform.emi.com/widget/1.0/';
var emiBuyButtonUuids = ["c9e456919b824bdeb2e3a326b122db43"];
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
document.writeln(unescape("%3Cscript src='" + emiBuyButtonUrl + "js/emi_buy_button.js' type='text/javascript'%3E%3C/script%3E"));

function Footer( container, prefix ) {

	var path = prefix || "files/footer";
	var init = true;
	var emiButton;

	this.id = Footer.multipleInstances;
	var divReplacement = "rome_footer_buy_album-" + this.id;

	this.getDomElement = function() {

		return container;

	};

	this.setupEmiBuyButton = function() {

		emiButton = new EMIBuyButton({

			buttonID: "c9e456919b824bdeb2e3a326b122db43",
			buttonImageUrl: path + "/buy_button-trans.png",
			useVendorImages: true

		}).replaceDiv( divReplacement );

		init = false;

		return this;

	}

	this.isSetup = function() {

		return init;

	};

	// Add html
	var html =  '';
			html += '<div class = "rome-footer">';
			html += '<div id = "shout-out">';
			html += '  <ul>';
			html += '    <li><a href = "http://chromeexperiments.com/"><img src = "' + path + '/chrome-trans.png" alt = "This is a Chrome Experiment" border = "0" /></a></li>';
			html += '    <li class = "divider">&nbsp;</li>';
			html += '    <li><a href = "http://google.com/"><img src = "' + path + '/google-trans.png" alt = "Made With Friends From Google" border = "0" /></a></li>';
			html += '    <li class = "clear">&nbsp;</li>';
			html += '  </ul>';
			html += '</div>';
			html += '';
			html += '<div id = "navigation">';
			html += '  <ul class = "primary">';
			html += '    <li class = "first"><a href = "http://ro.me/tech">Technology</a></li>';
			html += '    <li><a href = "http://ro.me/credits">Credits</a></li>';
			html += '    <li><a href = "http://ro.me/album">Rome Album</a></li>';
			html += '    <li id = "' + divReplacement + '" class = "rome_footer_buy_album">';
			html += '    </li>';
			html += '    <li class = "last">Share</li>';
			html += '    <li class = "last icons"><a href="http://www.facebook.com/sharer.php?u=http://ro.me" target="_blank"><img src = "' + path + '/fb-trans.png" alt = "facebook" border = "0"  /></a></li>';
			html += '    <li class = "last icons"><a href="http://twitter.com/share?text=“ROME”&amp;url=http://ro.me" target="_blank"><img src = "' + path + '/twitter-trans.png" alt = "twitter" border = "0" /></a></li>';
			html += '    <li class = "clear last">&nbsp;</li>';
			html += '  </ul>';
			html += '  <ul class = "secondary">';
			html += '    <li class = "first"><a href = "http://ro.me/terms">Terms</a></li>';
			html += '    <li class = "last"><a href = "http://ro.me/privacy">Privacy</a></li>';
			html += '    <li class = "clear last">&nbsp;</li>';
			html += '  </ul>';
			html += '</div>';
			html += '<div class = "clear">&nbsp;</div>';
			html += '</div>';
			html += '</div>';

	var css = '';
			css += '.rome-footer * {';
			css += '  margin: 0;';
			css += '  padding: 0;';
			css += '}';
			css += '.rome-footer {';
			css += '  font: 500 10px/18px "Futura", Arial, sans-serif;';
			css += '  color: #434343;';
			css += '  text-transform: uppercase;';
			css += '  letter-spacing: 1px;';
			css += '}';
			css += '.rome-footer #shout-out {';
			css += '  float: left;';
			css += '  margin: 0 0 0 18px;';
			css += '}';
			css += '.rome-footer #navigation {';
			css += '  float: right;';
			css += '  margin: 20px 26px 0 0;';
			css += '  vertical-align: middle;';
			css += '}';
			css += '.rome-footer ul li {';
			css += '  height: 16px;';
			css += '  border-right: 1px solid #a0a0a0;';
			css += '  padding: 0 10px 0 10px;';
			css += '  width: auto;';
			css += '  float: left;';
			css += '  list-style: none;';
			css += '}';
			css += '.rome-footer ul li.last,';
			css += '.rome-footer ul li.last li {';
			css += '  border: none;';
			css += '  padding: 0 0 0 10px;';
			css += '}';
			css += '.rome-footer #shout-out ul li {';
			css += '  margin: 0;';
			css += '  border: 0;';
			css += '}';
			css += '.rome-footer #shout-out li.divider {';
			css += '  margin: 15px 0 15px 15px;';
			css += '  height: 24px;';
			css += '  border-left: 1px solid #a0a0a0;';
			css += '}';
			css += '.rome-footer a img {';
			css += '  border: 0;';
			css += '}';
			css += '.rome-footer .secondary a:link, .rome-footer .secondary a:visited {';
			css += '  color: #777;';
			css += '}';
			css += '.rome-footer a:link, .rome-footer a:visited,';
			css += '.rome-footer .secondary a:hover, .rome-footer .secondary a:active {';
			css += '  color: #434343;';
			css += '  text-decoration: none;';
			css += '}';
			css += '.rome-footer a:hover, .rome-footer a:active {';
			css += '  color: #000;';
			css += '}';
			css += '.emi_buy_button_link {';
			css += '  margin-top: 2px;';
			css += '  height: 8px;';
			css += '  line-height: 8px;';
			css += '  overflow: hidden;';
			css += '}';
			css += '.rome-footer .rome_footer_buy_album img {';
			css += '  display: block;';
			css += '  margin-top: 0;';
			css += '}';
			css += '.rome-footer .rome_footer_buy_album a:hover img {';
			css += '  margin-top: -8px;';
			css += '}';
			css += '.emi_vendor_menu.using_image a:hover img {';
			css += '  margin-top: 0;';
			css += '}';
			css += '.emi_vendor_menu.using_image {';
			css += '  margin-top: -145px;';
			css += '  margin-left: -11px;';
			css += '  padding: 10px;';
			css += '}';
			css += '.emi_vendor_menu.using_image * {';
			css += '  text-transform: none;';
			css += '}';
			css += '.emi_vendor_menu.using_image .emi_vendor_link {';
			css += '  margin-top: 5px;';
			css += '}';
			css += '.rome-footer .secondary {';
			css += '  margin: 10px 0 0 0;';
			css += '  float: right;';
			css += '}';
			css += '.clear {';
			css += '  clear: both;';
			css += '  display: block;';
			css += '  overflow: hidden;';
			css += '  visibility: hidden;';
			css += '  width: 0;';
			css += '  height: 0;';
			css += '}';

	// Handle dom and html content
	container.innerHTML = html;
	// container.setAttribute("style", "width: 100%; min-width: 930px; margin-bottom: 10px;");

	// Append stylesheet
	if(Footer.multipleInstances < 1) {

		var rule  = document.createTextNode( css );
		var head  = document.getElementsByTagName( 'head' )[ 0 ];
		var style = document.createElement( 'style' );

		if( style.stylesheet ) {

			style.styleSheet.cssText = rule.nodeValue;

		} else {

			style.appendChild( rule );

		}

		head.appendChild( style );

	}

	Footer.multipleInstances++;
}
Footer.multipleInstances = 0;