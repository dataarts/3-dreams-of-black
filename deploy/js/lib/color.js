var DAT = DAT || {};

// Make functional programming masquerade as oop-style:
DAT.Color = function() {

  var _this = this;
  var _hex = DAT.color.args_to_hex(arguments);

  var _rgbaStore = {};
  var _hsvStore = {};

  // Did the object we pass in already specify rgba props?
  // If so we shouldn't reconvert from hex.
  if (arguments.length == 1 && DAT.color.has_rgba_props(arguments[0])) {
    _rgbaStore.r = arguments[0].r;
    _rgbaStore.g = arguments[0].g;
    _rgbaStore.b = arguments[0].b;
    _rgbaStore.a = arguments[0].a;
  } else if (arguments.length == 1 && DAT.color.has_rgb_props(arguments[0])) {
    _rgbaStore.r = arguments[0].r;
    _rgbaStore.g = arguments[0].g;
    _rgbaStore.b = arguments[0].b;
    _rgbaStore.a = DAT.color.bounds.a;
  } else {
    _rgbaStore = DAT.color.hex_to_rgba(_hex);
  }

  if (arguments.length == 1 && arguments[0] instanceof DAT.Color) {
    _hsvStore.h = arguments[0].h;
    _hsvStore.s = arguments[0].s;
    _hsvStore.v = arguments[0].v;
  } else {
    recalculateHSVComponents();
  }


  this.__defineSetter__('hex', function(v) {
    _hex = v;
    _rgbaStore = DAT.color.hex_to_rgba(_hex);
    recalculateHSVComponents();
  });

  this.__defineGetter__('hex', function() {
    return _hex
  });



  this.toString = function() {
    return DAT.color.hex_to_string(_hex);
  };

  // Make functional programming masquerade as oop-style:

  var rgbaComponents = 'argb';
  var hsvComponents = 'hsv';

  for (var i = 0; i < rgbaComponents.length; i++) {
    defineRGBAComponent(rgbaComponents[i]);
  }

  for (var i = 0; i < hsvComponents.length; i++) {
    defineHSVComponent(hsvComponents[i]);
  }

  function recalculateHSVComponents() {
    var tmp = DAT.color.rgba_to_hsva(_rgbaStore.r, _rgbaStore.g, _rgbaStore.b, _rgbaStore.a);
    for (var i in tmp) {
      if (!isNaN(tmp[i])) {
        _hsvStore[i] = tmp[i];
      }
    }
  }

  function defineRGBAComponent(componentName) {

    var setter = DAT.color['hex' + DAT.color.prefix_substitute + componentName];

    _this.__defineGetter__(componentName, function() {
      return _rgbaStore[componentName];
    });

    _this.__defineSetter__(componentName, function(value) {

      if (typeof value != 'number') {
        throw DAT.color.InvalidArgumentException;
      }

      // Remember value
      _rgbaStore[componentName] = value;
      if (_rgbaStore.hex != undefined) {
        console.log('wtf');
      }

      // Update hex
      _hex = setter.call(_this, _hex, value);

      // Update HSV
      recalculateHSVComponents();

    });

  }

  function defineHSVComponent(componentName) {

    _this.__defineSetter__(componentName, function(value) {

      if (typeof value != 'number') {
        throw DAT.color.InvalidArgumentException;
      }

      // This is NOT a hack! Greyscale colors SHOULD return NaN for the
      // hue, and if this doesn't specify a hue, we should keep whatever hue we
      // thought it might have been previously.


      if (!isNaN(value)) {
        _hsvStore[componentName] = value;
      }

      _rgbaStore = DAT.color.hsva_to_rgba(_hsvStore.h, _hsvStore.s, _hsvStore.v, _rgbaStore.a);
      if (_rgbaStore.hex != undefined) {
        console.log('wtf');
      }
      _hex = DAT.color.rgba_to_hex(_rgbaStore.r, _rgbaStore.g, _rgbaStore.b, _rgbaStore.a);

    });

    _this.__defineGetter__(componentName, function() {
      return _hsvStore[componentName];
    });

  }


}

DAT.color = {};

/**
 * The purpose of this is not to write DAT.Color over and over again.
 *
 * Here we add static methods and properties. The style of the code below
 * seeks to be sufficiently idiot proof in providing synonyms while trying to
 * avoid being terribly bloated.
 *
 * @param ns Stands for name space.
 */
(
    function(ns) {

      // Strings

      ns.prefix_component = '_to_';
      ns.prefix_substitute = '_with_';
      ns.InvalidArgumentException = 'Invalid argument.';

      // Component boundaries

      /**
       * All conversions performed by DAT.color respect these values as the
       * maximum for that component's  range. This is also the range we
       * expect that they adhere to when you pass them as parameters.
       */
      ns.bounds = { a: 1, r: 255, g: 255, b: 255, h: 360, s: 100, v: 100 };

      // Object creation

      /**
       * Creates a DAT.Color object from the specified RGBA components. Those
       * componenets should respect the ranges specified by DAT.color.bounds.
       * The alpha is assumed to be fully opaque.
       *
       * @param r red
       * @param g green
       * @param b blue
       */
      ns.rgb = function(r, g, b, a) {
        return ns.rgba(r, g, b, a || ns.bounds['a']);
      };

      /**
       * Creates a DAT.Color object from the specified RGBA components. Those
       * componenets should respect the ranges specified by DAT.color.bounds.
       *
       * @param r red
       * @param g green
       * @param b blue
       * @param a alpha / opacity
       */
      ns.rgba = function(r, g, b, a) {
        return new DAT.Color(r, g, b, a || ns.bounds['a']);
      };

      /**
       * Creates a DAT.Color object from the specified HSV components. Those
       * componenets should respect the ranges specified by DAT.color.bounds.
       * The alpha is assumed to be fully opaque.
       *
       * @param h hue
       * @param s saturation
       * @param v value / brightness
       */
      ns.hsv = function(h, s, v, a) {
        return ns.hsva(h, s, v, a || ns.bounds['a'])
      };

      /**
       * Creates a DAT.Color object from the specified HSVA components. Those
       * componenets should respect the ranges specified by DAT.color.bounds.
       *
       * @param h hue
       * @param s saturation
       * @param v value / brightness
       * @param a alpha / opacity
       */
      ns.hsva = function(h, s, v, a) {
        var asRGB = ns.hsva_to_rgba(h, s, v, a || ns.bounds['a']);

        return new DAT.Color(asRGB.r, asRGB.g, asRGB.b, asRGB.a);
      };

      // Conversions

      /**
       * Does a best guess to convert the data in arguments to a 32-bit hex
       * representation of color.
       *
       * @param args
       */
      ns.args_to_hex = function (args) {

        // TODO: be able to take in arbitrary css string

        var _hex;

        if (args.length == 0) {

          _hex = 0;

        } else if (args.length == 1) {

          if (typeof args[0] == 'number') {

            _hex = args[0];

          } else if (typeof args[0] == 'array') {

            _hex = ns.rgba_to_hex(args[0][0], args[0][1], args[0][2], args[0][3]);

          } else if (typeof args[0] == 'object' && ns.has_rgba_props(args[0])) {

            _hex = ns.rgba_to_hex(args[0].r, args[0].g, args[0].b, args[0].a);

          } else if (typeof args[0] == 'object' && ns.has_rgb_props(args[0])) {

            _hex = ns.rgba_to_hex(args[0].r, args[0].g, args[0].b);

          } else {

            _hex = 0;

          }

        } else if (args.length == 3) {

          _hex = ns.rgb_to_hex(args[0], args[1], args[2]);

        } else if (args.length == 4) {

          _hex = ns.rgba_to_hex(args[0], args[1], args[2], args[3]);

        } else {

          _hex = 0;

        }


        return _hex;


      }

      /**
       * Converts a color in HSVA space to a color in RGBA space as
       * represented by { r:?, g:?, b:?, a:? }
       *
       * @param h hue
       * @param s saturation
       * @param v value / brightness
       * @param a alpha / opacity
       */
      ns.hsva_to_rgba = function(h, s, v, a) {

        h = isNaN(h) ? 0 : h;
        h = h / ns.bounds['h'] * 360;
        s /= ns.bounds['s'];
        v /= ns.bounds['v'];
        a = a || ns.bounds['a'];


        var hi = Math.floor(h / 60) % 6;

        var f = h / 60 - Math.floor(h / 60);
        var p = v * (1.0 - s);
        var q = v * (1.0 - (f * s));
        var t = v * (1.0 - ((1.0 - f) * s));
        var c = [
          [v, t, p],
          [q, v, p],
          [p, v, t],
          [p, q, v],
          [t, p, v],
          [v, p, q]
        ][hi];

        return { r: c[0] * ns.bounds['r'],
          g: c[1] * ns.bounds['g'],
          b: c[2] * ns.bounds['b'],
          a: a || ns.bounds['a']
        }

      }

      ns.hsv_to_rgb = ns.hsva_to_rgba;

      /**
       * Converts an object in RGBA space to HSVA space as represented by
       * { h:?, s:?, v:?, a:? }. Currently this returns NaN for the hue of greyscale values.
       *
       * @param r red
       * @param g green
       * @param b blue
       * @param a alpha / opacity
       */
      ns.rgba_to_hsva = function(r, g, b, a) {

        r /= ns.bounds['r'];
        g /= ns.bounds['g'];
        b /= ns.bounds['b'];

        var min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            delta = max - min,
            h, s, v = max;

        v = max;
        if (max != 0) {
          s = delta / max;
        } else {
          return { h: 0, s: 0, v: 0, a: a || ns.bounds['a'] }
        }

        if (r == max) {
          h = ( g - b ) / delta;
        } else if (g == max) {
          h = 2 + ( b - r ) / delta;
        } else {
          h = 4 + ( r - g ) / delta;
        }
        h /= 6;
        if (h < 0) {
          h += 1;
        }

        return {
          h: h * ns.bounds['h'] ,
          s: s * ns.bounds['s'],
          v: v * ns.bounds['v'],
          a: a || ns.bounds['a']
        }

      };

      ns.rgb_to_hsv = ns.rgba_to_hsva;

      /**
       * Converts a color in RGBA space to a 32-bit hex integer.
       *
       * @param r red
       * @param g green
       * @param b blue
       * @param a alpha / opacity
       */
      ns.rgba_to_hex = function(r, g, b, a) {
        var hex = 0;
        hex = ns['hex' + ns.prefix_substitute + 'a'](hex, a || ns.bounds['a']);
        hex = ns['hex' + ns.prefix_substitute + 'r'](hex, r);
        hex = ns['hex' + ns.prefix_substitute + 'g'](hex, g);
        return ns['hex' + ns.prefix_substitute + 'b'](hex, b);
      };
      ns.rgb_to_hex = ns.rgba_to_hex;


      /**
       * Converts a 32-bit hex integer representing a color into RGBA space,
       * as represented by { r:?, g:?, b:?, a:? }.
       *
       * @param hex 32-bit hex integer
       */
      ns.hex_to_rgba = function(hex) {
        return {
          a: ns['hex' + ns.prefix_component + 'a'](hex),
          r: ns['hex' + ns.prefix_component + 'r'](hex),
          g: ns['hex' + ns.prefix_component + 'g'](hex),
          b: ns['hex' + ns.prefix_component + 'b'](hex)
        };
      }
      ns.hex_to_rgb = ns.hex_to_rgba;

      /**
       * Converts a 32-bit hex integer into a CSS or fillStyle compatible
       * string.
       *
       * @param hex 32-bit hex integer
       */
      ns.hex_to_string = function(hex) {
        var a = ns['hex' + ns.prefix_component + 'a'](hex) / ns.bounds['a'];
        var r = Math.round(ns['hex' + ns.prefix_component + 'r'](hex) / ns
            .bounds['r'] * 255);
        var g = Math.round(ns['hex' + ns.prefix_component + 'g'](hex) / ns
            .bounds['g'] * 255);
        var b = Math.round(ns['hex' + ns.prefix_component + 'b'](hex) / ns
            .bounds['b'] * 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      };

      ns.has_rgba_props = function(obj) {

        return obj.r != undefined &&
            obj.g != undefined &&
            obj.b != undefined &&
            obj.a != undefined;

      };

      ns.has_rgb_props = function(obj) {

        return obj.r != undefined &&
            obj.g != undefined &&
            obj.b != undefined

      };

      // This is the guts of DAT.color, and its defined using ultra-tight
      // black voodoo magic.

      for (var i = 0; i < 4; i++) {
        defineARGBComponent(i);
      }
      for (i = 0; i < 3; i++) {
        defineHSVComponent('hsv'[i]);
      }

      function defineARGBComponent(i) {
        var name = 'bgra'[i];
        var i8 = i * 8;
        ns['hex' + ns.prefix_component + name] = function(hex) {
          return ((hex >> (i8)) & 0xFF) / 0xFF * ns.bounds[name];
        };
        ns['hex' + ns.prefix_substitute + name] = function(hex, c) {
          c = c / ns.bounds[name] * 0xFF;
          return (c << (i8) | (hex & ~(0xFF << (i8))));
        };
      }

      function defineHSVComponent(c) {
        ns['hex' + ns.prefix_component + c] = function(hex) {
          var rgba = ns.hex_to_rgba(hex);
          var hsva = ns.rgba_to_hsva(rgba.r, rgba.g, rgba.b, rgba.a);
          return hsva[c];
        };
        ns['hex' + ns.prefix_substitute + c] = function(hex, v) {
          var rgba = ns.hex_to_rgba(hex);
          var hsva = ns.rgba_to_hsva(rgba.r, rgba.g, rgba.b, rgba.a);
          hsva[c] = v;
          rgba = ns.hsva_to_rgba(hsva.h, hsva.s, hsva.v, hsva.a);
          var tr = ns.rgba_to_hex(rgba.r, rgba.g, rgba.b, rgba.a);
          return tr;
        };
      }

    }
    )(DAT.color);