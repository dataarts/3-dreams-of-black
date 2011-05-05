// Add EMI content
var emiBuyButtonUrl = 'http://widgets.platform.emi.com/widget/1.0/';
var emiBuyButtonUuids = ["c9e456919b824bdeb2e3a326b122db43"];
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl.": "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
document.writeln(unescape("%3Cscript src='" + emiBuyButtonUrl + "js/emi_buy_button.js' type='text/javascript'%3E%3C/script%3E"));

var Footer = function(container, prefix) {

    var path = prefix || "files/footer";
    var init = true;
    var emiButton;

    this.id = Footer.multipleInstances;
    var divReplacement = "rome_footer_buy_album-" + this.id;

    this.getDomElement = function() {

        return container;

    };

    this.load = function() {

        if (EMIBuyButton) {
            emiButton = new EMIBuyButton({

                buttonID: "c9e456919b824bdeb2e3a326b122db43",
                buttonImageUrl: path + "/buy_button-trans.png",
                useVendorImages: true

            }).replaceDiv(divReplacement);

            init = false;

        }

        return this;

    };

    window.addEventListener("load", this.load, false);

    // Add html
    var html = ['<div class="rome-footer">',
		'<div class="shout-out">',
		'  <ul>',
		'    <li><a href="http://chromeexperiments.com/"><img src="' + path + '/chrome-trans.png" alt="This is a Chrome Experiment" border="0" /></a></li>',
		'    <li class="divider">&nbsp;</li>',
		'    <li><a href="http://google.com/"><img src="' + path + '/google-trans.png" alt="Made With Friends From Google" border="0" /></a></li>',
		'    <li class="clear">&nbsp;</li>',
		'  </ul>',
		'</div>',
		'<div class="navigation">',
		'  <ul class="primary">',
		'    <li class="first"><a href="http://ro.me/tech">Technology</a></li>',
		'    <li><a href="http://ro.me/credits">Credits</a></li>',
		'    <li><a href="http://ro.me/album">Rome Album</a></li>',
		'    <li id="' + divReplacement + '" class="rome_footer_buy_album">',
		'    </li>',
		'    <li class="last">Share</li>',
		'    <li class="last icons"><a href="http://www.facebook.com/sharer.php?u=http://ro.me" target="_blank"><img src="' + path + '/fb-trans.png" alt="facebook" border="0"  /></a></li>',
		'    <li class="last icons"><a href="http://twitter.com/share?text=“ROME”&amp;url=http://ro.me" target="_blank"><img src="' + path + '/twitter-trans.png" alt="twitter" border="0" /></a></li>',
		'    <li class="clear last">&nbsp;</li>',
		'  </ul>',
		'  <ul class="secondary">',
		'    <li class="first"><a href="http://ro.me/terms">Terms</a></li>',
		'    <li class="last"><a href="http://ro.me/privacy">Privacy</a></li>',
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
		'  font: 500 10px/18px FuturaBT-Medium, Arial, sans-serif;',
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
		'  margin: 15px 0 15px 15px;',
		'  height: 24px;',
		'  border-left: 1px solid #a0a0a0;',
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

				var link = document.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				link.setAttribute('href', '/files/futura.css');

        if (style.stylesheet) {

            style.styleSheet.cssText = rule.nodeValue;

        } else {

            style.appendChild(rule);

        }

        head.appendChild(style);

    }

    Footer.multipleInstances++;
}
Footer.multipleInstances = 0;