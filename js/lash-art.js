/* Glow by Wanji — lash illustrations.
   Draws every lash style as an SVG so each design has a picture of its
   shape (no photos needed). Usage: GlowLashArt.svg("volume", "cat") */
(function (global) {
  "use strict";

  // Upper and lower lid curves (quadratic Béziers) inside a 220 x 112 box.
  var UP = [[34, 70], [110, 22], [188, 62]];
  var LO = [[34, 70], [110, 102], [188, 62]];
  var EYE = "M34 70Q110 22 188 62Q110 102 34 70Z";
  var BASE = 27;  // base lash length
  var ARC = 168;  // approx. length of the upper lid curve
  var uid = 0;

  function bez(c, t) {
    var u = 1 - t;
    return [
      u * u * c[0][0] + 2 * u * t * c[1][0] + t * t * c[2][0],
      u * u * c[0][1] + 2 * u * t * c[1][1] + t * t * c[2][1]
    ];
  }
  function tangent(c, t) {
    var u = 1 - t;
    return [
      2 * u * (c[1][0] - c[0][0]) + 2 * t * (c[2][0] - c[1][0]),
      2 * u * (c[1][1] - c[0][1]) + 2 * t * (c[2][1] - c[1][1])
    ];
  }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function unit(a) { var l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; }
  // Positive degrees turn clockwise on screen (SVG y points down).
  function rot(v, deg) {
    var r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }
  function n2(x) { return Math.round(x * 100) / 100; }
  function pt(p) { return n2(p[0]) + " " + n2(p[1]); }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed || 1;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function spaced(n, a, b) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(a + (b - a) * (n === 1 ? 0.5 : i / (n - 1)));
    return out;
  }

  // Length profile along the lid (t: 0 = inner corner, 1 = outer corner).
  var MAPS = {
    natural:  function (t) { return 0.5 + 0.55 * Math.exp(-Math.pow((t - 0.58) / 0.3, 2)); },
    cat:      function (t) { return 0.44 + 0.7 * Math.pow(t, 1.6) - (t > 0.94 ? (t - 0.94) * 4 : 0); },
    doll:     function (t) { return 0.52 + 0.58 * Math.exp(-Math.pow((t - 0.5) / 0.24, 2)); },
    squirrel: function (t) { return 0.48 + 0.62 * Math.exp(-Math.pow((t - 0.74) / 0.18, 2)); }
  };

  // A single tapered lash: wide at the base, sharp at the tip.
  function lash(base, ctrl, tip, w) {
    var d = unit(sub(tip, base));
    var p = [-d[1], d[0]];
    var bl = add(base, mul(p, w / 2)), br = add(base, mul(p, -w / 2));
    var cl = add(ctrl, mul(p, w * 0.3)), cr = add(ctrl, mul(p, -w * 0.3));
    return "M" + pt(bl) + "Q" + pt(cl) + " " + pt(tip) + "Q" + pt(cr) + " " + pt(br) + "Z";
  }

  function svg(style, map, opts) {
    opts = opts || {};
    style = style || "classic";
    map = MAPS[map] ? map : "natural";
    var prof = MAPS[map];
    var rand = rng(hash(style + ":" + map));
    var upper = [], lower = [];
    var id = "gla" + (++uid);

    function frame(t) {
      var b = bez(UP, t);
      var tg = unit(tangent(UP, t));
      var n = rot([tg[1], -tg[0]], (t - 0.5) * 34); // outward + flare
      return { b: b, n: n, tg: tg };
    }

    // A fan of strands sharing one base (classic = 1 strand, volume = many).
    function fan(t, o) {
      var f = frame(t);
      var n = o.n || 1, spread = o.spread || 0, curl = o.curl == null ? 22 : o.curl;
      var L = BASE * prof(t) * (o.len || 1);
      for (var i = 0; i < n; i++) {
        var a = n === 1 ? 0 : -spread / 2 + spread * i / (n - 1);
        var d = rot(f.n, a + (rand() - 0.5) * (o.ang || 4));
        var l = L * (1 + (rand() - 0.5) * 2 * (o.jitter == null ? 0.07 : o.jitter));
        if (n > 1) l *= 0.9 + 0.1 * Math.cos(a * Math.PI / 60);
        var c = (t - 0.5) * 2 * curl;
        var tip = add(f.b, mul(rot(d, c), l));
        var ctrl = add(f.b, mul(d, l * 0.55));
        upper.push(lash(f.b, ctrl, tip, o.w || 1.6));
      }
    }

    // A spike: strands from neighbouring bases meeting at one tip.
    function spike(t, o) {
      var f = frame(t);
      var n = o.n || 4, spread = o.baseSpread || 5, curl = o.curl == null ? 22 : o.curl;
      var L = BASE * prof(t) * (o.len || 1) * (1 + (rand() - 0.5) * 2 * (o.jitter || 0.06));
      var tip = add(f.b, mul(rot(f.n, (t - 0.5) * 2 * curl), L));
      for (var i = 0; i < n; i++) {
        var off = n === 1 ? 0 : -spread / 2 + spread * i / (n - 1);
        var bi = bez(UP, Math.min(0.995, Math.max(0.005, t + off / ARC)));
        var ctrl = add(bi, mul(f.n, L * 0.5));
        upper.push(lash(bi, ctrl, tip, o.w || 0.9));
      }
    }

    function lowerFrame(t) {
      var b = bez(LO, t);
      var tg = unit(tangent(LO, t));
      var n = rot([-tg[1], tg[0]], -(t - 0.5) * 30); // downward + flare
      return { b: b, n: n, tg: tg };
    }
    function lowerFan(t, o) {
      var f = lowerFrame(t);
      var L = (o.len || 7) * (0.6 + 0.5 * t) * (1 + (rand() - 0.5) * 0.15);
      var tip = add(f.b, mul(rot(f.n, -(t - 0.5) * 24), L));
      lower.push(lash(f.b, add(f.b, mul(f.n, L * 0.55)), tip, o.w || 1.1));
    }
    function lowerSpike(t, o) {
      var f = lowerFrame(t);
      var n = o.n || 4, spread = o.baseSpread || 5;
      var L = (o.len || 11) * (0.7 + 0.45 * t);
      var tip = add(f.b, mul(rot(f.n, -(t - 0.5) * 24), L));
      for (var i = 0; i < n; i++) {
        var off = -spread / 2 + spread * i / (n - 1);
        var bi = bez(LO, Math.min(0.995, Math.max(0.005, t + off / ARC)));
        lower.push(lash(bi, add(bi, mul(f.n, L * 0.5)), tip, o.w || 0.85));
      }
    }

    var STYLES = {
      classic: function () {
        spaced(28, 0.05, 0.97).forEach(function (t) { fan(t, { n: 1, w: 1.9 }); });
      },
      hybrid: function () {
        spaced(32, 0.05, 0.97).forEach(function (t, i) {
          if (i % 2) fan(t, { n: 3, w: 0.85, spread: 12, len: 0.95 });
          else fan(t, { n: 1, w: 1.8, len: 1.03 });
        });
      },
      volume: function () {
        spaced(30, 0.05, 0.97).forEach(function (t) { fan(t, { n: 4, w: 0.8, spread: 16 }); });
      },
      mega: function () {
        spaced(36, 0.04, 0.97).forEach(function (t) { fan(t, { n: 7, w: 0.62, spread: 22, len: 1.05 }); });
      },
      wispy: function () {
        spaced(34, 0.05, 0.97).forEach(function (t) { fan(t, { n: 3, w: 0.72, spread: 14, len: 0.8 }); });
        spaced(8, 0.12, 0.93).forEach(function (t) { spike(t, { n: 3, baseSpread: 2.5, len: 1.28, w: 1 }); });
      },
      wet: function () {
        spaced(18, 0.06, 0.96).forEach(function (t) { spike(t, { n: 4, baseSpread: 4, len: 1.06, w: 0.95, jitter: 0.1 }); });
      },
      anime: function () {
        spaced(20, 0.05, 0.97).forEach(function (t) { fan(t, { n: 1, w: 1.2, len: 0.45 }); });
        spaced(9, 0.1, 0.93).forEach(function (t) { spike(t, { n: 7, baseSpread: 10, len: 1.2, w: 1 }); });
        spaced(5, 0.28, 0.86).forEach(function (t) { lowerSpike(t, { n: 4, baseSpread: 5, len: 11 }); });
      },
      lift: function () {
        spaced(26, 0.05, 0.97).forEach(function (t) { fan(t, { n: 1, w: 1.45, len: 0.82, curl: 42 }); });
      },
      cluster: function () {
        spaced(24, 0.05, 0.97).forEach(function (t) { fan(t, { n: 1, w: 1.1, len: 0.5 }); });
        spaced(10, 0.09, 0.93).forEach(function (t) { fan(t, { n: 8, w: 0.62, spread: 22 }); });
      },
      strip: function () {
        spaced(46, 0.05, 0.97).forEach(function (t) { fan(t, { n: 1, w: 1.05, len: 0.95, jitter: 0.15, ang: 12 }); });
      },
      bottom: function () {
        STYLES.classic();
        spaced(16, 0.2, 0.93).forEach(function (t) { lowerFan(t, { len: 7.5, w: 1.1 }); });
      }
    };

    (STYLES[style] || STYLES.classic)();

    var label = opts.label || (style + " lash design");
    return (
      '<svg class="lash-art" viewBox="0 0 220 112" role="img" aria-label="' + label.replace(/"/g, "&quot;") + '">' +
        "<defs>" +
          '<clipPath id="' + id + 'c"><path d="' + EYE + '"/></clipPath>' +
          '<radialGradient id="' + id + 'g" cx="0.5" cy="0.5" r="0.5">' +
            '<stop offset="0" stop-color="#a36b45"/><stop offset="0.65" stop-color="#6b3f27"/><stop offset="1" stop-color="#3a2216"/>' +
          "</radialGradient>" +
        "</defs>" +
        '<path class="la-crease" d="M50 50Q112 6 176 44"/>' +
        '<path class="la-white" d="' + EYE + '"/>' +
        '<g clip-path="url(#' + id + 'c)">' +
          '<circle cx="110" cy="65" r="19" fill="url(#' + id + 'g)"/>' +
          '<circle class="la-pupil" cx="110" cy="65" r="7.5"/>' +
          '<circle class="la-glint" cx="116" cy="58" r="3"/>' +
        "</g>" +
        '<path class="la-lashes" d="' + upper.join("") + '"/>' +
        '<path class="la-lid" d="M34 70Q110 22 188 62"/>' +
        '<path class="la-lower" d="M34 70Q110 102 188 62"/>' +
        (lower.length ? '<path class="la-lashes" d="' + lower.join("") + '"/>' : "") +
      "</svg>"
    );
  }

  global.GlowLashArt = { svg: svg, maps: Object.keys(MAPS) };
})(window);
