/**
 * @author jonobr1 / http://jonobr1.com/
 * For js/sections/LastPageSection.js
 */

// Dependent on swell.js
function Heart(gee, src, x, y) {

  // Heart can have drips or boils

  var that = this;
  var g = gee.ctx;

  // Public variables
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == null || this.x || this == NaN) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == null || this.y || this == NaN) {
    this.y = gee.height / 2.0;
  }

  // Private vars
  var svg;
  var ready = false;

  this.update = function() {
    return this;
  }

  this.render = function() {
    if(ready) {
      g.save();
      g.translate(this.x, this.y);
      g.save();
      g.translate(-this.width / 2.0, -this.height / 2.0)
      svg.draw(g);
      g.restore();
      g.restore();
    }
  };

  var success = function(s, location) {
    svg = s;
    that.source = location;
    that.width = svg.width;
    that.height = svg.height;
    ready = true;
  }
  var fail = function() {
    // doh!
  }

  loadSVG(src, success, fail);
}