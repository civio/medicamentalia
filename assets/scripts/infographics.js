(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  function extent(array, f) {
    var i = -1,
        n = array.length,
        a,
        b,
        c;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    return [a, c];
  }

  function sequence(start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  }

  var e10 = Math.sqrt(50);
  var e5 = Math.sqrt(10);
  var e2 = Math.sqrt(2);
  function ticks(start, stop, count) {
    var step = tickStep(start, stop, count);
    return sequence(
      Math.ceil(start / step) * step,
      Math.floor(stop / step) * step + step / 2, // inclusive
      step
    );
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  function max(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
    }

    return a;
  }

  function min(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
    }

    return a;
  }

  function scan(array, compare) {
    if (!(n = array.length)) return;
    var i = 0,
        n,
        j = 0,
        xi,
        xj = array[j];

    if (!compare) compare = ascending;

    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

    if (compare(xj, xj) === 0) return j;
  }

  function shuffle(array, i0, i1) {
    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }

    return array;
  }

  function sum(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1;

    if (f == null) {
      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
    }

    else {
      while (++i < n) if (a = +f(array[i], i, array)) s += a;
    }

    return s;
  }

  var prefix = "$";

  function Map() {}

  Map.prototype = map$1.prototype = {
    constructor: Map,
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };

  function map$1(object, f) {
    var map = new Map;

    // Copy constructor.
    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function nest() {
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;

    function apply(array, depth, createResult, setResult) {
      if (depth >= keys.length) return rollup != null
          ? rollup(array) : (sortValues != null
          ? array.sort(sortValues)
          : array);

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map$1(),
          values,
          result = createResult();

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.each(function(values, key) {
        setResult(result, key, apply(values, depth, createResult, setResult));
      });

      return result;
    }

    function entries(map, depth) {
      if (++depth > keys.length) return map;
      var array, sortKey = sortKeys[depth - 1];
      if (rollup != null && depth >= keys.length) array = map.entries();
      else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
      return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
    }

    return nest = {
      object: function(array) { return apply(array, 0, createObject, setObject); },
      map: function(array) { return apply(array, 0, createMap, setMap); },
      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
      key: function(d) { keys.push(d); return nest; },
      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
      sortValues: function(order) { sortValues = order; return nest; },
      rollup: function(f) { rollup = f; return nest; }
    };
  }

  function createObject() {
    return {};
  }

  function setObject(object, key, value) {
    object[key] = value;
  }

  function createMap() {
    return map$1();
  }

  function setMap(map, key, value) {
    map.set(key, value);
  }

  function Set() {}

  var proto = map$1.prototype;

  Set.prototype = set.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function set(object, f) {
    var set = new Set;

    // Copy constructor.
    if (object instanceof Set) object.each(function(value) { set.add(value); });

    // Otherwise, assume it’s an array.
    else if (object) {
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);
      else while (++i < n) set.add(f(object[i], i, object));
    }

    return set;
  }

  function keys(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  }

  function values(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  }

  function entries(map) {
    var entries = [];
    for (var key in map) entries.push({key: key, value: map[key]});
    return entries;
  }

  function easeCubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var exponent = 3;

  var polyIn = (function custom(e) {
    e = +e;

    function polyIn(t) {
      return Math.pow(t, e);
    }

    polyIn.exponent = custom;

    return polyIn;
  })(exponent);

  var polyOut = (function custom(e) {
    e = +e;

    function polyOut(t) {
      return 1 - Math.pow(1 - t, e);
    }

    polyOut.exponent = custom;

    return polyOut;
  })(exponent);

  var polyInOut = (function custom(e) {
    e = +e;

    function polyInOut(t) {
      return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    }

    polyInOut.exponent = custom;

    return polyInOut;
  })(exponent);

  var pi = Math.PI;
  var halfPi = pi / 2;
  function sinInOut(t) {
    return (1 - Math.cos(pi * t)) / 2;
  }

  var overshoot = 1.70158;

  var backIn = (function custom(s) {
    s = +s;

    function backIn(t) {
      return t * t * ((s + 1) * t - s);
    }

    backIn.overshoot = custom;

    return backIn;
  })(overshoot);

  var backOut = (function custom(s) {
    s = +s;

    function backOut(t) {
      return --t * t * ((s + 1) * t + s) + 1;
    }

    backOut.overshoot = custom;

    return backOut;
  })(overshoot);

  var backInOut = (function custom(s) {
    s = +s;

    function backInOut(t) {
      return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    }

    backInOut.overshoot = custom;

    return backInOut;
  })(overshoot);

  var tau = 2 * Math.PI;
  var amplitude = 1;
  var period = 0.3;
  var elasticIn = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticIn(t) {
      return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
    }

    elasticIn.amplitude = function(a) { return custom(a, p * tau); };
    elasticIn.period = function(p) { return custom(a, p); };

    return elasticIn;
  })(amplitude, period);

  var elasticOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticOut(t) {
      return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
    }

    elasticOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticOut.period = function(p) { return custom(a, p); };

    return elasticOut;
  })(amplitude, period);

  var elasticInOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticInOut(t) {
      return ((t = t * 2 - 1) < 0
          ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
          : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
    }

    elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticInOut.period = function(p) { return custom(a, p); };

    return elasticInOut;
  })(amplitude, period);

  var slice$1 = [].slice;

  var noabort = {};

  function Queue(size) {
    if (!(size >= 1)) throw new Error;
    this._size = size;
    this._call =
    this._error = null;
    this._tasks = [];
    this._data = [];
    this._waiting =
    this._active =
    this._ended =
    this._start = 0; // inside a synchronous task callback?
  }

  Queue.prototype = queue.prototype = {
    constructor: Queue,
    defer: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      if (this._error != null) return this;
      var t = slice$1.call(arguments, 1);
      t.push(callback);
      ++this._waiting, this._tasks.push(t);
      poke(this);
      return this;
    },
    abort: function() {
      if (this._error == null) abort(this, new Error("abort"));
      return this;
    },
    await: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = function(error, results) { callback.apply(null, [error].concat(results)); };
      maybeNotify(this);
      return this;
    },
    awaitAll: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = callback;
      maybeNotify(this);
      return this;
    }
  };

  function poke(q) {
    if (!q._start) {
      try { start(q); } // let the current task complete
      catch (e) {
        if (q._tasks[q._ended + q._active - 1]) abort(q, e); // task errored synchronously
        else if (!q._data) throw e; // await callback errored synchronously
      }
    }
  }

  function start(q) {
    while (q._start = q._waiting && q._active < q._size) {
      var i = q._ended + q._active,
          t = q._tasks[i],
          j = t.length - 1,
          c = t[j];
      t[j] = end(q, i);
      --q._waiting, ++q._active;
      t = c.apply(null, t);
      if (!q._tasks[i]) continue; // task finished synchronously
      q._tasks[i] = t || noabort;
    }
  }

  function end(q, i) {
    return function(e, r) {
      if (!q._tasks[i]) return; // ignore multiple callbacks
      --q._active, ++q._ended;
      q._tasks[i] = null;
      if (q._error != null) return; // ignore secondary errors
      if (e != null) {
        abort(q, e);
      } else {
        q._data[i] = r;
        if (q._waiting) poke(q);
        else maybeNotify(q);
      }
    };
  }

  function abort(q, e) {
    var i = q._tasks.length, t;
    q._error = e; // ignore active callbacks
    q._data = undefined; // allow gc
    q._waiting = NaN; // prevent starting

    while (--i >= 0) {
      if (t = q._tasks[i]) {
        q._tasks[i] = null;
        if (t.abort) {
          try { t.abort(); }
          catch (e) { /* ignore */ }
        }
      }
    }

    q._active = NaN; // allow notification
    maybeNotify(q);
  }

  function maybeNotify(q) {
    if (!q._active && q._call) {
      var d = q._data;
      q._data = undefined; // allow gc
      q._call(q._error, d);
    }
  }

  function queue(concurrency) {
    return new Queue(arguments.length ? +concurrency : Infinity);
  }

  var pi$1 = Math.PI;
  var tau$1 = 2 * pi$1;
  var epsilon = 1e-6;
  var tauEpsilon = tau$1 - epsilon;
  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = [];
  }

  function path() {
    return new Path;
  }

  Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
      this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y);
    },
    closePath: function() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._.push("Z");
      }
    },
    lineTo: function(x, y) {
      this._.push("L", this._x1 = +x, ",", this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
      this._.push("Q", +x1, ",", +y1, ",", this._x1 = +x, ",", this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this._.push("C", +x1, ",", +y1, ",", +x2, ",", +y2, ",", this._x1 = +x, ",", this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._.push(
          "M", this._x1 = x1, ",", this._y1 = y1
        );
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon)) {}

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
        this._.push(
          "L", this._x1 = x1, ",", this._y1 = y1
        );
      }

      // Otherwise, draw an arc!
      else {
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon) {
          this._.push(
            "L", x1 + t01 * x01, ",", y1 + t01 * y01
          );
        }

        this._.push(
          "A", r, ",", r, ",0,0,", +(y01 * x20 > x01 * y20), ",", this._x1 = x1 + t21 * x21, ",", this._y1 = y1 + t21 * y21
        );
      }
    },
    arc: function(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._.push(
          "M", x0, ",", y0
        );
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._.push(
          "L", x0, ",", y0
        );
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._.push(
          "A", r, ",", r, ",0,1,", cw, ",", x - dx, ",", y - dy,
          "A", r, ",", r, ",0,1,", cw, ",", this._x1 = x0, ",", this._y1 = y0
        );
      }

      // Otherwise, draw an arc!
      else {
        if (da < 0) da = da % tau$1 + tau$1;
        this._.push(
          "A", r, ",", r, ",0,", +(da >= pi$1), ",", cw, ",", this._x1 = x + r * Math.cos(a1), ",", this._y1 = y + r * Math.sin(a1)
        );
      }
    },
    rect: function(x, y, w, h) {
      this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y, "h", +w, "v", +h, "h", -w, "Z");
    },
    toString: function() {
      return this._.join("");
    }
  };

  function constant$1(x) {
    return function constant() {
      return x;
    };
  }

  var epsilon$1 = 1e-12;

  function Linear(context) {
    this._context = context;
  }

  Linear.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: this._context.lineTo(x, y); break;
      }
    }
  };

  function curveLinear(context) {
    return new Linear(context);
  }

  function x(p) {
    return p[0];
  }

  function y(p) {
    return p[1];
  }

  function line() {
    var x$$ = x,
        y$$ = y,
        defined = constant$1(true),
        context = null,
        curve = curveLinear,
        output = null;

    function line(data) {
      var i,
          n = data.length,
          d,
          defined0 = false,
          buffer;

      if (context == null) output = curve(buffer = path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) output.lineStart();
          else output.lineEnd();
        }
        if (defined0) output.point(+x$$(d, i, data), +y$$(d, i, data));
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    line.x = function(_) {
      return arguments.length ? (x$$ = typeof _ === "function" ? _ : constant$1(+_), line) : x$$;
    };

    line.y = function(_) {
      return arguments.length ? (y$$ = typeof _ === "function" ? _ : constant$1(+_), line) : y$$;
    };

    line.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), line) : defined;
    };

    line.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    };

    line.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    };

    return line;
  }

  function noop() {}

  function point(that, x, y) {
    that._context.bezierCurveTo(
      (2 * that._x0 + that._x1) / 3,
      (2 * that._y0 + that._y1) / 3,
      (that._x0 + 2 * that._x1) / 3,
      (that._y0 + 2 * that._y1) / 3,
      (that._x0 + 4 * that._x1 + x) / 6,
      (that._y0 + 4 * that._y1 + y) / 6
    );
  }

  function Basis(context) {
    this._context = context;
  }

  Basis.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 3: point(this, this._x1, this._y1); // proceed
        case 2: this._context.lineTo(this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
        default: point(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function Bundle(context, beta) {
    this._basis = new Basis(context);
    this._beta = beta;
  }

  Bundle.prototype = {
    lineStart: function() {
      this._x = [];
      this._y = [];
      this._basis.lineStart();
    },
    lineEnd: function() {
      var x = this._x,
          y = this._y,
          j = x.length - 1;

      if (j > 0) {
        var x0 = x[0],
            y0 = y[0],
            dx = x[j] - x0,
            dy = y[j] - y0,
            i = -1,
            t;

        while (++i <= j) {
          t = i / j;
          this._basis.point(
            this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
            this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
          );
        }
      }

      this._x = this._y = null;
      this._basis.lineEnd();
    },
    point: function(x, y) {
      this._x.push(+x);
      this._y.push(+y);
    }
  };

  (function custom(beta) {

    function bundle(context) {
      return beta === 1 ? new Basis(context) : new Bundle(context, beta);
    }

    bundle.beta = function(beta) {
      return custom(+beta);
    };

    return bundle;
  })(0.85);

  function point$1(that, x, y) {
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x),
      that._y2 + that._k * (that._y1 - y),
      that._x2,
      that._y2
    );
  }

  function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  Cardinal.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: point$1(this, this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
        case 2: this._point = 3; // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  (function custom(tension) {

    function cardinal(context) {
      return new Cardinal(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalClosed(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  (function custom(tension) {

    function cardinal(context) {
      return new CardinalClosed(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalOpen(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  (function custom(tension) {

    function cardinal(context) {
      return new CardinalOpen(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function point$2(that, x, y) {
    var x1 = that._x1,
        y1 = that._y1,
        x2 = that._x2,
        y2 = that._y2;

    if (that._l01_a > epsilon$1) {
      var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
          n = 3 * that._l01_a * (that._l01_a + that._l12_a);
      x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
      y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }

    if (that._l23_a > epsilon$1) {
      var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
          m = 3 * that._l23_a * (that._l23_a + that._l12_a);
      x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
      y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
    }

    that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
  }

  function CatmullRom(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRom.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: this.point(this._x2, this._y2); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; // proceed
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var catmullRom = (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function CatmullRomClosed(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRomClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function CatmullRomOpen(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRomOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function sign(x) {
    return x < 0 ? -1 : 1;
  }

  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }

  // Calculate a one-sided slope.
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }

  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function point$3(that, t0, t1) {
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  }

  function MonotoneX(context) {
    this._context = context;
  }

  MonotoneX.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 =
      this._t0 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x1, this._y1); break;
        case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      var t1 = NaN;

      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
        default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
      }

      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    }
  }

  function MonotoneY(context) {
    this._context = new ReflectContext(context);
  }

  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
    MonotoneX.prototype.point.call(this, y, x);
  };

  function ReflectContext(context) {
    this._context = context;
  }

  ReflectContext.prototype = {
    moveTo: function(x, y) { this._context.moveTo(y, x); },
    closePath: function() { this._context.closePath(); },
    lineTo: function(x, y) { this._context.lineTo(y, x); },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
  };

  var noop$1 = {value: function() {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$1(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  function request(url, callback) {
    var request,
        event = dispatch("beforesend", "progress", "load", "error"),
        mimeType,
        headers = map$1(),
        xhr = new XMLHttpRequest,
        user = null,
        password = null,
        response,
        responseType,
        timeout = 0;

    // If IE does not support CORS, use XDomainRequest.
    if (typeof XDomainRequest !== "undefined"
        && !("withCredentials" in xhr)
        && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

    "onload" in xhr
        ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
        : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

    function respond(o) {
      var status = xhr.status, result;
      if (!status && hasResponse(xhr)
          || status >= 200 && status < 300
          || status === 304) {
        if (response) {
          try {
            result = response.call(request, xhr);
          } catch (e) {
            event.call("error", request, e);
            return;
          }
        } else {
          result = xhr;
        }
        event.call("load", request, result);
      } else {
        event.call("error", request, o);
      }
    }

    xhr.onprogress = function(e) {
      event.call("progress", request, e);
    };

    request = {
      header: function(name, value) {
        name = (name + "").toLowerCase();
        if (arguments.length < 2) return headers.get(name);
        if (value == null) headers.remove(name);
        else headers.set(name, value + "");
        return request;
      },

      // If mimeType is non-null and no Accept header is set, a default is used.
      mimeType: function(value) {
        if (!arguments.length) return mimeType;
        mimeType = value == null ? null : value + "";
        return request;
      },

      // Specifies what type the response value should take;
      // for instance, arraybuffer, blob, document, or text.
      responseType: function(value) {
        if (!arguments.length) return responseType;
        responseType = value;
        return request;
      },

      timeout: function(value) {
        if (!arguments.length) return timeout;
        timeout = +value;
        return request;
      },

      user: function(value) {
        return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
      },

      password: function(value) {
        return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
      },

      // Specify how to convert the response content to a specific type;
      // changes the callback value on "load" events.
      response: function(value) {
        response = value;
        return request;
      },

      // Alias for send("GET", …).
      get: function(data, callback) {
        return request.send("GET", data, callback);
      },

      // Alias for send("POST", …).
      post: function(data, callback) {
        return request.send("POST", data, callback);
      },

      // If callback is non-null, it will be used for error and load events.
      send: function(method, data, callback) {
        xhr.open(method, url, true, user, password);
        if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
        if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
        if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
        if (responseType != null) xhr.responseType = responseType;
        if (timeout > 0) xhr.timeout = timeout;
        if (callback == null && typeof data === "function") callback = data, data = null;
        if (callback != null && callback.length === 1) callback = fixCallback(callback);
        if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
        event.call("beforesend", request, xhr);
        xhr.send(data == null ? null : data);
        return request;
      },

      abort: function() {
        xhr.abort();
        return request;
      },

      on: function() {
        var value = event.on.apply(event, arguments);
        return value === event ? request : value;
      }
    };

    if (callback != null) {
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return request.get(callback);
    }

    return request;
  }

  function fixCallback(callback) {
    return function(error, xhr) {
      callback(error == null ? xhr : null);
    };
  }

  function hasResponse(xhr) {
    var type = xhr.responseType;
    return type && type !== "text"
        ? xhr.response // null on error
        : xhr.responseText; // "" on error
  }

  function type(defaultMimeType, response) {
    return function(url, callback) {
      var r = request(url).mimeType(defaultMimeType).response(response);
      if (callback != null) {
        if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
        return r.get(callback);
      }
      return r;
    };
  }

  var json = type("application/json", function(xhr) {
    return JSON.parse(xhr.responseText);
  });

  var xml = type("application/xml", function(xhr) {
    var xml = xhr.responseXML;
    if (!xml) throw new Error("parse error");
    return xml;
  });

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns;
      return rows;
    }

    function parseRows(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I, c;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var k = 1;
          c = text.charCodeAt(I++);
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      })).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return text == null ? ""
          : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
          : text;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    };
  }

  var csv$1 = dsv(",");

  var csvParse = csv$1.parse;

  var tsv = dsv("\t");

  function dsv$1(defaultMimeType, parse) {
    return function(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var r = request(url).mimeType(defaultMimeType);
      r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
      r.row(row);
      return callback ? r.get(callback) : r;
    };
  }

  function responseOf(parse, row) {
    return function(request) {
      return parse(request.responseText, row);
    };
  }

  var csv = dsv$1("text/csv", csvParse);

  var array$1 = Array.prototype;

  var map$2 = array$1.map;
  var slice$3 = array$1.slice;

  var implicit = {name: "implicit"};

  function ordinal(range) {
    var index = map$1(),
        domain = [],
        unknown = implicit;

    range = range == null ? [] : slice$3.call(range);

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = map$1();
      var i = -1, n = _.length, d, key;
      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice$3.call(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal()
          .domain(domain)
          .range(range)
          .unknown(unknown);
    };

    return scale;
  }

  function band() {
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        range = [0, 1],
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;

    delete scale.unknown;

    function rescale() {
      var n = domain().length,
          reverse = range[1] < range[0],
          start = range[reverse - 0],
          stop = range[1 - reverse];
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = sequence(n).map(function(i) { return start + step * i; });
      return ordinalRange(reverse ? values.reverse() : values);
    }

    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.range = function(_) {
      return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = [+_[0], +_[1]], round = true, rescale();
    };

    scale.bandwidth = function() {
      return bandwidth;
    };

    scale.step = function() {
      return step;
    };

    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };

    scale.padding = function(_) {
      return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
    };

    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };

    scale.copy = function() {
      return band()
          .domain(domain())
          .range(range)
          .round(round)
          .paddingInner(paddingInner)
          .paddingOuter(paddingOuter)
          .align(align);
    };

    return rescale();
  }

  function pointish(scale) {
    var copy = scale.copy;

    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;

    scale.copy = function() {
      return pointish(copy());
    };

    return scale;
  }

  function point$4() {
    return pointish(band().paddingInner(1));
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reHex3 = /^#([0-9a-f]{3})$/;
  var reHex6 = /^#([0-9a-f]{6})$/;
  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function colorRgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, colorRgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function colorHsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, colorHsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  var Kn = 18;
  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;
  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var b = rgb2xyz(o.r),
        a = rgb2xyz(o.g),
        l = rgb2xyz(o.b),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);
      return new Rgb(
        xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function colorHcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hcl, colorHcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert(this).rgb();
    }
  }));

  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;
  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  function constant$2(x) {
    return function() {
      return x;
    };
  }

  function linear$2(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear$2(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear$2(a, d) : constant$2(isNaN(a) ? b : a);
  }

  var rgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb(start, end) {
      var r = color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = color(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function array$2(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(nb),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function reinterpolate(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolateValue(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: reinterpolate(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolateValue(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$2(b)
        : (t === "number" ? reinterpolate
        : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
        : b instanceof color ? rgb
        : b instanceof Date ? date
        : Array.isArray(b) ? array$2
        : isNaN(b) ? object
        : reinterpolate)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  function cubehelix$1(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix$$(start, end) {
        var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix$$.gamma = cubehelixGamma;

      return cubehelix$$;
    })(1);
  }

  cubehelix$1(hue);
  var interpolateCubehelixLong = cubehelix$1(nogamma);

  function constant$3(x) {
    return function() {
      return x;
    };
  }

  function number$1(x) {
    return +x;
  }

  var unit = [0, 1];

  function deinterpolate(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constant$3(b);
  }

  function deinterpolateClamp(deinterpolate) {
    return function(a, b) {
      var d = deinterpolate(a = +a, b = +b);
      return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
    };
  }

  function reinterpolateClamp(reinterpolate) {
    return function(a, b) {
      var r = reinterpolate(a = +a, b = +b);
      return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
    };
  }

  function bimap(domain, range, deinterpolate, reinterpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
    else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, deinterpolate, reinterpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp());
  }

  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
  function continuous(deinterpolate$$, reinterpolate) {
    var domain = unit,
        range = unit,
        interpolate = interpolateValue,
        clamp = false,
        piecewise,
        output,
        input;

    function rescale() {
      piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate$$) : deinterpolate$$, interpolate)))(+x);
    }

    scale.invert = function(y) {
      return (input || (input = piecewise(range, domain, deinterpolate, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice$3.call(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = slice$3.call(_), interpolate = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };

    return rescale();
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent$1(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function identity$4(x) {
    return x;
  }

  function formatLocale(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
        currency = locale.currency,
        decimal = locale.decimal;

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // If the original value was negative, it may be rounded to zero during
          // formatting; treat this as (positive) zero.
          if (valueNegative) {
            i = -1, n = value.length;
            valueNegative = false;
            while (++i < n) {
              if (c = value.charCodeAt(i), (48 < c && c < 58)
                  || (type === "x" && 96 < c && c < 103)
                  || (type === "X" && 64 < c && c < 71)) {
                valueNegative = true;
                break;
              }
            }
          }

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent$1(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
  }

  function tickFormat(domain, count, specifier) {
    var start = domain[0],
        stop = domain[domain.length - 1],
        step = tickStep(start, stop, count == null ? 10 : count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain(), count, specifier);
    };

    scale.nice = function(count) {
      var d = domain(),
          i = d.length - 1,
          n = count == null ? 10 : count,
          start = d[0],
          stop = d[i],
          step = tickStep(start, stop, n);

      if (step) {
        step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
        d[0] = Math.floor(start / step) * step;
        d[i] = Math.ceil(stop / step) * step;
        domain(d);
      }

      return scale;
    };

    return scale;
  }

  function linear$1() {
    var scale = continuous(deinterpolate, reinterpolate);

    scale.copy = function() {
      return copy(scale, linear$1());
    };

    return linearish(scale);
  }

  function raise(x, exponent) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function pow() {
    var exponent = 1,
        scale = continuous(deinterpolate, reinterpolate),
        domain = scale.domain;

    function deinterpolate(a, b) {
      return (b = raise(b, exponent) - (a = raise(a, exponent)))
          ? function(x) { return (raise(x, exponent) - a) / b; }
          : constant$3(b);
    }

    function reinterpolate(a, b) {
      b = raise(b, exponent) - (a = raise(a, exponent));
      return function(t) { return raise(a + b * t, 1 / exponent); };
    }

    scale.exponent = function(_) {
      return arguments.length ? (exponent = +_, domain(domain())) : exponent;
    };

    scale.copy = function() {
      return copy(scale, pow().exponent(exponent));
    };

    return linearish(scale);
  }

  var t0$2 = new Date;
  var t1$2 = new Date;
  function newInterval$1(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
      return range;
    };

    interval.filter = function(test) {
      return newInterval$1(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) while (--step >= 0) while (offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0$2.setTime(+start), t1$2.setTime(+end);
        floori(t0$2), floori(t1$2);
        return Math.floor(count(t0$2, t1$2));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var millisecond$1 = newInterval$1(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond$1.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond$1;
    return newInterval$1(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var durationSecond$2 = 1e3;
  var durationMinute$2 = 6e4;
  var durationHour$2 = 36e5;
  var durationDay$2 = 864e5;
  var durationWeek$2 = 6048e5;

  var second$1 = newInterval$1(function(date) {
    date.setTime(Math.floor(date / durationSecond$2) * durationSecond$2);
  }, function(date, step) {
    date.setTime(+date + step * durationSecond$2);
  }, function(start, end) {
    return (end - start) / durationSecond$2;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var minute$1 = newInterval$1(function(date) {
    date.setTime(Math.floor(date / durationMinute$2) * durationMinute$2);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute$2);
  }, function(start, end) {
    return (end - start) / durationMinute$2;
  }, function(date) {
    return date.getMinutes();
  });

  var hour$1 = newInterval$1(function(date) {
    var offset = date.getTimezoneOffset() * durationMinute$2 % durationHour$2;
    if (offset < 0) offset += durationHour$2;
    date.setTime(Math.floor((+date - offset) / durationHour$2) * durationHour$2 + offset);
  }, function(date, step) {
    date.setTime(+date + step * durationHour$2);
  }, function(start, end) {
    return (end - start) / durationHour$2;
  }, function(date) {
    return date.getHours();
  });

  var day$1 = newInterval$1(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$2) / durationDay$2;
  }, function(date) {
    return date.getDate() - 1;
  });

  function weekday$1(i) {
    return newInterval$1(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$2) / durationWeek$2;
    });
  }

  var sunday$1 = weekday$1(0);
  var monday$1 = weekday$1(1);

  var month$1 = newInterval$1(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var year$1 = newInterval$1(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year$1.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval$1(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  var utcMinute$1 = newInterval$1(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute$2);
  }, function(start, end) {
    return (end - start) / durationMinute$2;
  }, function(date) {
    return date.getUTCMinutes();
  });

  var utcHour$1 = newInterval$1(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationHour$2);
  }, function(start, end) {
    return (end - start) / durationHour$2;
  }, function(date) {
    return date.getUTCHours();
  });

  var utcDay$1 = newInterval$1(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay$2;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday$1(i) {
    return newInterval$1(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek$2;
    });
  }

  var utcSunday = utcWeekday$1(0);
  var utcMonday$1 = utcWeekday$1(1);

  var utcMonth$1 = newInterval$1(function(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });

  var utcYear$1 = newInterval$1(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear$1.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval$1(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", localDate);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier, utcDate);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"};
  var numberRe = /^\s*\d+/;
  var percentRe = /^%/;
  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + day$1.count(year$1(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday$1.count(year$1(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday$1.count(year$1(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay$1.count(utcYear$1(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear$1(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday$1.count(utcYear$1(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  var locale$1;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    timeParse = locale$1.parse;
    utcFormat = locale$1.utcFormat;
    utcParse = locale$1.utcParse;
    return locale$1;
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
    return date.toISOString();
  }

  var formatIso = Date.prototype.toISOString
      ? formatIsoNative
      : utcFormat(isoSpecifier);

  function parseIsoNative(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  }

  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
      ? parseIsoNative
      : utcParse(isoSpecifier);

  function colors(s) {
    return s.match(/.{6}/g).map(function(x) {
      return "#" + x;
    });
  }

  colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

  colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

  colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

  interpolateCubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

  var warm = interpolateCubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var cool = interpolateCubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var rainbow = cubehelix();

  function ramp(range) {
    var n = range.length;
    return function(t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }

  ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

  var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

  var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

  var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

  function sequential(interpolator) {
    var x0 = 0,
        x1 = 1,
        clamp = false;

    function scale(x) {
      var t = (x - x0) / (x1 - x0);
      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
    }

    scale.domain = function(_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, scale) : clamp;
    };

    scale.interpolator = function(_) {
      return arguments.length ? (interpolator = _, scale) : interpolator;
    };

    scale.copy = function() {
      return sequential(interpolator).domain([x0, x1]).clamp(clamp);
    };

    return linearish(scale);
  }

  function colors$1(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  colors$1("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

  colors$1("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

  colors$1("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

  colors$1("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

  colors$1("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

  colors$1("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

  colors$1("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

  colors$1("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

  function define$1(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend$1(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color$1() {}

  var darker$1 = 0.7;
  var brighter$1 = 1 / darker$1;

  var reI = "\\s*([+-]?\\d+)\\s*";
  var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
  var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
  var reHex3$1 = /^#([0-9a-f]{3})$/;
  var reHex6$1 = /^#([0-9a-f]{6})$/;
  var reRgbInteger$1 = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
  var reRgbPercent$1 = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
  var reRgbaInteger$1 = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
  var reRgbaPercent$1 = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
  var reHslPercent$1 = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
  var reHslaPercent$1 = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
  var named$1 = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define$1(Color$1, color$1, {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color$1(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3$1.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$1((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6$1.exec(format)) ? rgbn$1(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format])
        : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn$1(n) {
    return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba$1(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb$1(r, g, b, a);
  }

  function rgbConvert$1(o) {
    if (!(o instanceof Color$1)) o = color$1(o);
    if (!o) return new Rgb$1;
    o = o.rgb();
    return new Rgb$1(o.r, o.g, o.b, o.opacity);
  }

  function colorRgb$1(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb$1(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$1(Rgb$1, colorRgb$1, extend$1(Color$1, {
    brighter: function(k) {
      k = k == null ? brighter$1 : Math.pow(brighter$1, k);
      return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$1 : Math.pow(darker$1, k);
      return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla$1(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl$1(h, s, l, a);
  }

  function hslConvert$1(o) {
    if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color$1)) o = color$1(o);
    if (!o) return new Hsl$1;
    if (o instanceof Hsl$1) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl$1(h, s, l, o.opacity);
  }

  function colorHsl$1(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl$1(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Hsl$1, colorHsl$1, extend$1(Color$1, {
    brighter: function(k) {
      k = k == null ? brighter$1 : Math.pow(brighter$1, k);
      return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$1 : Math.pow(darker$1, k);
      return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb$1(
        hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb$1(h, m1, m2),
        hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb$1(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad$1 = Math.PI / 180;
  var rad2deg$1 = 180 / Math.PI;

  var Kn$1 = 18;
  var Xn$1 = 0.950470;
  var Yn$1 = 1;
  var Zn$1 = 1.088830;
  var t0$3 = 4 / 29;
  var t1$3 = 6 / 29;
  var t2$1 = 3 * t1$3 * t1$3;
  var t3$1 = t1$3 * t1$3 * t1$3;
  function labConvert$1(o) {
    if (o instanceof Lab$1) return new Lab$1(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl$1) {
      var h = o.h * deg2rad$1;
      return new Lab$1(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
    var b = rgb2xyz$1(o.r),
        a = rgb2xyz$1(o.g),
        l = rgb2xyz$1(o.b),
        x = xyz2lab$1((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn$1),
        y = xyz2lab$1((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn$1),
        z = xyz2lab$1((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn$1);
    return new Lab$1(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab$2(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert$1(l) : new Lab$1(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab$1(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$1(Lab$1, lab$2, extend$1(Color$1, {
    brighter: function(k) {
      return new Lab$1(this.l + Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab$1(this.l - Kn$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn$1 * lab2xyz$1(y);
      x = Xn$1 * lab2xyz$1(x);
      z = Zn$1 * lab2xyz$1(z);
      return new Rgb$1(
        xyz2rgb$1( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb$1(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb$1( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab$1(t) {
    return t > t3$1 ? Math.pow(t, 1 / 3) : t / t2$1 + t0$3;
  }

  function lab2xyz$1(t) {
    return t > t1$3 ? t * t * t : t2$1 * (t - t0$3);
  }

  function xyz2rgb$1(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz$1(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert$1(o) {
    if (o instanceof Hcl$1) return new Hcl$1(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab$1)) o = labConvert$1(o);
    var h = Math.atan2(o.b, o.a) * rad2deg$1;
    return new Hcl$1(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function colorHcl$1(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert$1(h) : new Hcl$1(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl$1(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Hcl$1, colorHcl$1, extend$1(Color$1, {
    brighter: function(k) {
      return new Hcl$1(this.h, this.c, this.l + Kn$1 * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl$1(this.h, this.c, this.l - Kn$1 * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert$1(this).rgb();
    }
  }));

  var A$1 = -0.14861;
  var B$1 = +1.78277;
  var C$1 = -0.29227;
  var D$1 = -0.90649;
  var E$1 = +1.97294;
  var ED$1 = E$1 * D$1;
  var EB$1 = E$1 * B$1;
  var BC_DA$1 = B$1 * C$1 - D$1 * A$1;
  function cubehelixConvert$1(o) {
    if (o instanceof Cubehelix$1) return new Cubehelix$1(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA$1 * b + ED$1 * r - EB$1 * g) / (BC_DA$1 + ED$1 - EB$1),
        bl = b - l,
        k = (E$1 * (g - l) - C$1 * bl) / D$1,
        s = Math.sqrt(k * k + bl * bl) / (E$1 * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg$1 - 120 : NaN;
    return new Cubehelix$1(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix$4(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert$1(h) : new Cubehelix$1(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix$1(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Cubehelix$1, cubehelix$4, extend$1(Color$1, {
    brighter: function(k) {
      k = k == null ? brighter$1 : Math.pow(brighter$1, k);
      return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$1 : Math.pow(darker$1, k);
      return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$1,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb$1(
        255 * (l + a * (A$1 * cosh + B$1 * sinh)),
        255 * (l + a * (C$1 * cosh + D$1 * sinh)),
        255 * (l + a * (E$1 * cosh)),
        this.opacity
      );
    }
  }));

  function basis$3(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$4(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis$3((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant$4(x) {
    return function() {
      return x;
    };
  }

  function linear$3(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential$1(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue$1(a, b) {
    var d = b - a;
    return d ? linear$3(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$4(isNaN(a) ? b : a);
  }

  function gamma$1(y) {
    return (y = +y) === 1 ? nogamma$1 : function(a, b) {
      return b - a ? exponential$1(a, b, y) : constant$4(isNaN(a) ? b : a);
    };
  }

  function nogamma$1(a, b) {
    var d = b - a;
    return d ? linear$3(a, d) : constant$4(isNaN(a) ? b : a);
  }

  (function rgbGamma(y) {
    var color = gamma$1(y);

    function rgb(start, end) {
      var r = color((start = colorRgb$1(start)).r, (end = colorRgb$1(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma$1(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function rgbSpline$1(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = colorRgb$1(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }

  var rgbBasis$1 = rgbSpline$1(basis$4);

  function cubehelix$5(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix(start, end) {
        var h = hue((start = cubehelix$4(start)).h, (end = cubehelix$4(end)).h),
            s = nogamma$1(start.s, end.s),
            l = nogamma$1(start.l, end.l),
            opacity = nogamma$1(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix.gamma = cubehelixGamma;

      return cubehelix;
    })(1);
  }

  cubehelix$5(hue$1);
  var cubehelixLong = cubehelix$5(nogamma$1);

  function ramp$1(scheme) {
    return rgbBasis$1(scheme[scheme.length - 1]);
  }

  var scheme = new Array(3).concat(
    "d8b365f5f5f55ab4ac",
    "a6611adfc27d80cdc1018571",
    "a6611adfc27df5f5f580cdc1018571",
    "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
    "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
    "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
    "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
    "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
    "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
  ).map(colors$1);

  ramp$1(scheme);

  var scheme$1 = new Array(3).concat(
    "af8dc3f7f7f77fbf7b",
    "7b3294c2a5cfa6dba0008837",
    "7b3294c2a5cff7f7f7a6dba0008837",
    "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
    "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
    "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
    "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
    "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
    "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
  ).map(colors$1);

  ramp$1(scheme$1);

  var scheme$2 = new Array(3).concat(
    "e9a3c9f7f7f7a1d76a",
    "d01c8bf1b6dab8e1864dac26",
    "d01c8bf1b6daf7f7f7b8e1864dac26",
    "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
    "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
    "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
    "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
    "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
    "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
  ).map(colors$1);

  ramp$1(scheme$2);

  var scheme$3 = new Array(3).concat(
    "f1a340f7f7f7998ec3",
    "e66101fdb863b2abd25e3c99",
    "e66101fdb863f7f7f7b2abd25e3c99",
    "b35806f1a340fee0b6d8daeb998ec3542788",
    "b35806f1a340fee0b6f7f7f7d8daeb998ec3542788",
    "b35806e08214fdb863fee0b6d8daebb2abd28073ac542788",
    "b35806e08214fdb863fee0b6f7f7f7d8daebb2abd28073ac542788",
    "7f3b08b35806e08214fdb863fee0b6d8daebb2abd28073ac5427882d004b",
    "7f3b08b35806e08214fdb863fee0b6f7f7f7d8daebb2abd28073ac5427882d004b"
  ).map(colors$1);

  ramp$1(scheme$3);

  var scheme$4 = new Array(3).concat(
    "ef8a62f7f7f767a9cf",
    "ca0020f4a58292c5de0571b0",
    "ca0020f4a582f7f7f792c5de0571b0",
    "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
    "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
    "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
    "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
    "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
    "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
  ).map(colors$1);

  ramp$1(scheme$4);

  var scheme$5 = new Array(3).concat(
    "ef8a62ffffff999999",
    "ca0020f4a582bababa404040",
    "ca0020f4a582ffffffbababa404040",
    "b2182bef8a62fddbc7e0e0e09999994d4d4d",
    "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
    "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
    "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
    "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
    "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
  ).map(colors$1);

  ramp$1(scheme$5);

  var scheme$6 = new Array(3).concat(
    "fc8d59ffffbf91bfdb",
    "d7191cfdae61abd9e92c7bb6",
    "d7191cfdae61ffffbfabd9e92c7bb6",
    "d73027fc8d59fee090e0f3f891bfdb4575b4",
    "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
    "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
    "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
    "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
    "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
  ).map(colors$1);

  ramp$1(scheme$6);

  var scheme$7 = new Array(3).concat(
    "fc8d59ffffbf91cf60",
    "d7191cfdae61a6d96a1a9641",
    "d7191cfdae61ffffbfa6d96a1a9641",
    "d73027fc8d59fee08bd9ef8b91cf601a9850",
    "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
    "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
    "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
    "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
    "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
  ).map(colors$1);

  ramp$1(scheme$7);

  var scheme$8 = new Array(3).concat(
    "fc8d59ffffbf99d594",
    "d7191cfdae61abdda42b83ba",
    "d7191cfdae61ffffbfabdda42b83ba",
    "d53e4ffc8d59fee08be6f59899d5943288bd",
    "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
    "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
    "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
    "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
    "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
  ).map(colors$1);

  ramp$1(scheme$8);

  var scheme$9 = new Array(3).concat(
    "e5f5f999d8c92ca25f",
    "edf8fbb2e2e266c2a4238b45",
    "edf8fbb2e2e266c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
  ).map(colors$1);

  ramp$1(scheme$9);

  var scheme$10 = new Array(3).concat(
    "e0ecf49ebcda8856a7",
    "edf8fbb3cde38c96c688419d",
    "edf8fbb3cde38c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
  ).map(colors$1);

  ramp$1(scheme$10);

  var scheme$11 = new Array(3).concat(
    "e0f3dba8ddb543a2ca",
    "f0f9e8bae4bc7bccc42b8cbe",
    "f0f9e8bae4bc7bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
  ).map(colors$1);

  ramp$1(scheme$11);

  var scheme$12 = new Array(3).concat(
    "fee8c8fdbb84e34a33",
    "fef0d9fdcc8afc8d59d7301f",
    "fef0d9fdcc8afc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
  ).map(colors$1);

  var OrRd = ramp$1(scheme$12);

  var scheme$13 = new Array(3).concat(
    "ece2f0a6bddb1c9099",
    "f6eff7bdc9e167a9cf02818a",
    "f6eff7bdc9e167a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
  ).map(colors$1);

  ramp$1(scheme$13);

  var scheme$14 = new Array(3).concat(
    "ece7f2a6bddb2b8cbe",
    "f1eef6bdc9e174a9cf0570b0",
    "f1eef6bdc9e174a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
  ).map(colors$1);

  ramp$1(scheme$14);

  var scheme$15 = new Array(3).concat(
    "e7e1efc994c7dd1c77",
    "f1eef6d7b5d8df65b0ce1256",
    "f1eef6d7b5d8df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
  ).map(colors$1);

  ramp$1(scheme$15);

  var scheme$16 = new Array(3).concat(
    "fde0ddfa9fb5c51b8a",
    "feebe2fbb4b9f768a1ae017e",
    "feebe2fbb4b9f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
  ).map(colors$1);

  ramp$1(scheme$16);

  var scheme$17 = new Array(3).concat(
    "edf8b17fcdbb2c7fb8",
    "ffffcca1dab441b6c4225ea8",
    "ffffcca1dab441b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
  ).map(colors$1);

  ramp$1(scheme$17);

  var scheme$18 = new Array(3).concat(
    "f7fcb9addd8e31a354",
    "ffffccc2e69978c679238443",
    "ffffccc2e69978c67931a354006837",
    "ffffccd9f0a3addd8e78c67931a354006837",
    "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
  ).map(colors$1);

  ramp$1(scheme$18);

  var scheme$19 = new Array(3).concat(
    "fff7bcfec44fd95f0e",
    "ffffd4fed98efe9929cc4c02",
    "ffffd4fed98efe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
  ).map(colors$1);

  ramp$1(scheme$19);

  var scheme$20 = new Array(3).concat(
    "ffeda0feb24cf03b20",
    "ffffb2fecc5cfd8d3ce31a1c",
    "ffffb2fecc5cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
  ).map(colors$1);

  ramp$1(scheme$20);

  var scheme$21 = new Array(3).concat(
    "deebf79ecae13182bd",
    "eff3ffbdd7e76baed62171b5",
    "eff3ffbdd7e76baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
  ).map(colors$1);

  ramp$1(scheme$21);

  var scheme$22 = new Array(3).concat(
    "e5f5e0a1d99b31a354",
    "edf8e9bae4b374c476238b45",
    "edf8e9bae4b374c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
  ).map(colors$1);

  ramp$1(scheme$22);

  var scheme$23 = new Array(3).concat(
    "f0f0f0bdbdbd636363",
    "f7f7f7cccccc969696525252",
    "f7f7f7cccccc969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
  ).map(colors$1);

  ramp$1(scheme$23);

  var scheme$24 = new Array(3).concat(
    "efedf5bcbddc756bb1",
    "f2f0f7cbc9e29e9ac86a51a3",
    "f2f0f7cbc9e29e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
  ).map(colors$1);

  ramp$1(scheme$24);

  var scheme$25 = new Array(3).concat(
    "fee0d2fc9272de2d26",
    "fee5d9fcae91fb6a4acb181d",
    "fee5d9fcae91fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
  ).map(colors$1);

  ramp$1(scheme$25);

  var scheme$26 = new Array(3).concat(
    "fee6cefdae6be6550d",
    "feeddefdbe85fd8d3cd94701",
    "feeddefdbe85fd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
  ).map(colors$1);

  ramp$1(scheme$26);

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  var nextId = 0;

  function local() {
    return new Local;
  }

  function Local() {
    this._ = "@" + (++nextId).toString(36);
  }

  Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
      var id = this._;
      while (!(id in node)) if (!(node = node.parentNode)) return;
      return node[id];
    },
    set: function(node, value) {
      return node[this._] = value;
    },
    remove: function(node) {
      return this._ in node && delete node[this._];
    },
    toString: function() {
      return this._;
    }
  };

  var matcher = function(selector) {
    return function() {
      return this.matches(selector);
    };
  };

  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!element.matches) {
      var vendorMatches = element.webkitMatchesSelector
          || element.msMatchesSelector
          || element.mozMatchesSelector
          || element.oMatchesSelector;
      matcher = function(selector) {
        return function() {
          return vendorMatches.call(this, selector);
        };
      };
    }
  }

  var matcher$1 = matcher;

  var filterEvents = {};

  exports.event = null;

  if (typeof document !== "undefined") {
    var element$1 = document.documentElement;
    if (!("onmouseenter" in element$1)) {
      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
    }
  }

  function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function(event) {
      var related = event.relatedTarget;
      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
        listener.call(this, event);
      }
    };
  }

  function contextListener(listener, index, group) {
    return function(event1) {
      var event0 = exports.event; // Events can be reentrant (e.g., focus).
      exports.event = event1;
      try {
        listener.call(this, this.__data__, index, group);
      } finally {
        exports.event = event0;
      }
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) {
      var on = this.__on, o, listener = wrap(value, i, group);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, capture);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, capture) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    if (capture == null) capture = false;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
    return this;
  }

  function customEvent(event1, listener, that, args) {
    var event0 = exports.event;
    event1.sourceEvent = exports.event;
    exports.event = event1;
    try {
      return listener.apply(that, args);
    } finally {
      exports.event = event0;
    }
  }

  function sourceEvent() {
    var current = exports.event, source;
    while (source = current.sourceEvent) current = source;
    return current;
  }

  function point$5(node, event) {
    var svg = node.ownerSVGElement || node;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }

    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  }

  function mouse(node) {
    var event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point$5(node, event);
  }

  function none$2() {}

  function selector(selector) {
    return selector == null ? none$2 : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function selection_selectAll(select) {
    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher$1(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$5(x) {
    return function() {
      return x;
    };
  }

  var keyPrefix = "$"; // Protect against keys like “__proto__”.

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = {},
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) {
          exit[i] = node;
        } else {
          nodeByKeyValue[keyValue] = node;
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = keyPrefix + key.call(parent, data[i], i, data);
      if (node = nodeByKeyValue[keyValue]) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue[keyValue] = null;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
        exit[i] = node;
      }
    }
  }

  function selection_data(value, key) {
    if (!value) {
      data = new Array(this.size()), j = -1;
      this.each(function(d) { data[++j] = d; });
      return data;
    }

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$5(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = value.call(parent, parent && parent.__data__, j, parents),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_merge(selection) {

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending$2;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending$2(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    var size = 0;
    this.each(function() { ++size; });
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function window(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    var node;
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : window(node = this.node())
            .getComputedStyle(node, null)
            .getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise$1() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise$1);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function dispatchEvent(node, type, params) {
    var window$$ = window(node),
        event = window$$.CustomEvent;

    if (event) {
      event = new event(type, params);
    } else {
      event = window$$.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function selectAll(selector) {
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([selector == null ? [] : selector], root);
  }

  function touch(node, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return point$5(node, touch);
      }
    }

    return null;
  }

  function touches(node, touches) {
    if (touches == null) touches = sourceEvent().touches;

    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
      points[i] = point$5(node, touches[i]);
    }

    return points;
  }

  var noop$2 = {value: function() {}};

  function dispatch$1() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch$1(_);
  }

  function Dispatch$1(_) {
    this._ = _;
  }

  function parseTypenames$2(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch$1.prototype = dispatch$1.prototype = {
    constructor: Dispatch$1,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames$2(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get$2(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$3(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$3(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch$1(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get$2(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$3(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var frame = 0;
  var timeout = 0;
  var interval = 0;
  var pokeDelay = 1000;
  var taskHead;
  var taskTail;
  var clockLast = 0;
  var clockNow = 0;
  var clockSkew = 0;
  var clock = typeof performance === "object" && performance.now ? performance : Date;
  var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) { setTimeout(f, 17); };
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke$1() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, delay);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) interval = setInterval(poke$1, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout$1(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(function(elapsed) {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch$1("start", "end", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
    return schedule;
  }

  function set$2(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
    return schedule;
  }

  function get$1(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        // Dispatch the interrupt event.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions. No interrupt event is dispatched
        // because the cancelled transitions never started. Note that this also
        // removes this transition from the pending list!
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(null, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state === STARTED;
      schedule.state = ENDED;
      schedule.timer.stop();
      if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function define$2(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend$2(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color$2() {}

  var darker$2 = 0.7;
  var brighter$2 = 1 / darker$2;

  var reHex3$2 = /^#([0-9a-f]{3})$/;
  var reHex6$2 = /^#([0-9a-f]{6})$/;
  var reRgbInteger$2 = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent$2 = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reRgbaInteger$2 = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reRgbaPercent$2 = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reHslPercent$2 = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslaPercent$2 = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var named$2 = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define$2(Color$2, color$2, {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color$2(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3$2.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$2((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6$2.exec(format)) ? rgbn$2(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger$2.exec(format)) ? new Rgb$2(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent$2.exec(format)) ? new Rgb$2(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger$2.exec(format)) ? rgba$2(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent$2.exec(format)) ? rgba$2(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent$2.exec(format)) ? hsla$2(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent$2.exec(format)) ? hsla$2(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named$2.hasOwnProperty(format) ? rgbn$2(named$2[format])
        : format === "transparent" ? new Rgb$2(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn$2(n) {
    return new Rgb$2(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba$2(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb$2(r, g, b, a);
  }

  function rgbConvert$2(o) {
    if (!(o instanceof Color$2)) o = color$2(o);
    if (!o) return new Rgb$2;
    o = o.rgb();
    return new Rgb$2(o.r, o.g, o.b, o.opacity);
  }

  function colorRgb$2(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert$2(r) : new Rgb$2(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb$2(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$2(Rgb$2, colorRgb$2, extend$2(Color$2, {
    brighter: function(k) {
      k = k == null ? brighter$2 : Math.pow(brighter$2, k);
      return new Rgb$2(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$2 : Math.pow(darker$2, k);
      return new Rgb$2(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla$2(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl$2(h, s, l, a);
  }

  function hslConvert$2(o) {
    if (o instanceof Hsl$2) return new Hsl$2(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color$2)) o = color$2(o);
    if (!o) return new Hsl$2;
    if (o instanceof Hsl$2) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl$2(h, s, l, o.opacity);
  }

  function colorHsl$2(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert$2(h) : new Hsl$2(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl$2(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$2(Hsl$2, colorHsl$2, extend$2(Color$2, {
    brighter: function(k) {
      k = k == null ? brighter$2 : Math.pow(brighter$2, k);
      return new Hsl$2(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$2 : Math.pow(darker$2, k);
      return new Hsl$2(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb$2(
        hsl2rgb$2(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb$2(h, m1, m2),
        hsl2rgb$2(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb$2(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad$2 = Math.PI / 180;
  var rad2deg$2 = 180 / Math.PI;

  var Kn$2 = 18;
  var Xn$2 = 0.950470;
  var Yn$2 = 1;
  var Zn$2 = 1.088830;
  var t0$4 = 4 / 29;
  var t1$4 = 6 / 29;
  var t2$2 = 3 * t1$4 * t1$4;
  var t3$2 = t1$4 * t1$4 * t1$4;
  function labConvert$2(o) {
    if (o instanceof Lab$2) return new Lab$2(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl$2) {
      var h = o.h * deg2rad$2;
      return new Lab$2(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb$2)) o = rgbConvert$2(o);
    var b = rgb2xyz$2(o.r),
        a = rgb2xyz$2(o.g),
        l = rgb2xyz$2(o.b),
        x = xyz2lab$2((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn$2),
        y = xyz2lab$2((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn$2),
        z = xyz2lab$2((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn$2);
    return new Lab$2(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab$4(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert$2(l) : new Lab$2(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab$2(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$2(Lab$2, lab$4, extend$2(Color$2, {
    brighter: function(k) {
      return new Lab$2(this.l + Kn$2 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab$2(this.l - Kn$2 * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn$2 * lab2xyz$2(y);
      x = Xn$2 * lab2xyz$2(x);
      z = Zn$2 * lab2xyz$2(z);
      return new Rgb$2(
        xyz2rgb$2( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb$2(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb$2( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab$2(t) {
    return t > t3$2 ? Math.pow(t, 1 / 3) : t / t2$2 + t0$4;
  }

  function lab2xyz$2(t) {
    return t > t1$4 ? t * t * t : t2$2 * (t - t0$4);
  }

  function xyz2rgb$2(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz$2(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert$2(o) {
    if (o instanceof Hcl$2) return new Hcl$2(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab$2)) o = labConvert$2(o);
    var h = Math.atan2(o.b, o.a) * rad2deg$2;
    return new Hcl$2(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function colorHcl$2(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert$2(h) : new Hcl$2(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl$2(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$2(Hcl$2, colorHcl$2, extend$2(Color$2, {
    brighter: function(k) {
      return new Hcl$2(this.h, this.c, this.l + Kn$2 * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl$2(this.h, this.c, this.l - Kn$2 * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert$2(this).rgb();
    }
  }));

  var A$2 = -0.14861;
  var B$2 = +1.78277;
  var C$2 = -0.29227;
  var D$2 = -0.90649;
  var E$2 = +1.97294;
  var ED$2 = E$2 * D$2;
  var EB$2 = E$2 * B$2;
  var BC_DA$2 = B$2 * C$2 - D$2 * A$2;
  function cubehelixConvert$2(o) {
    if (o instanceof Cubehelix$2) return new Cubehelix$2(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb$2)) o = rgbConvert$2(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA$2 * b + ED$2 * r - EB$2 * g) / (BC_DA$2 + ED$2 - EB$2),
        bl = b - l,
        k = (E$2 * (g - l) - C$2 * bl) / D$2,
        s = Math.sqrt(k * k + bl * bl) / (E$2 * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg$2 - 120 : NaN;
    return new Cubehelix$2(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix$7(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert$2(h) : new Cubehelix$2(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix$2(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$2(Cubehelix$2, cubehelix$7, extend$2(Color$2, {
    brighter: function(k) {
      k = k == null ? brighter$2 : Math.pow(brighter$2, k);
      return new Cubehelix$2(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker$2 : Math.pow(darker$2, k);
      return new Cubehelix$2(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$2,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb$2(
        255 * (l + a * (A$2 * cosh + B$2 * sinh)),
        255 * (l + a * (C$2 * cosh + D$2 * sinh)),
        255 * (l + a * (E$2 * cosh)),
        this.opacity
      );
    }
  }));

  function constant$6(x) {
    return function() {
      return x;
    };
  }

  function linear$4(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential$2(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue$2(a, b) {
    var d = b - a;
    return d ? linear$4(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$6(isNaN(a) ? b : a);
  }

  function gamma$2(y) {
    return (y = +y) === 1 ? nogamma$2 : function(a, b) {
      return b - a ? exponential$2(a, b, y) : constant$6(isNaN(a) ? b : a);
    };
  }

  function nogamma$2(a, b) {
    var d = b - a;
    return d ? linear$4(a, d) : constant$6(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma$2(y);

    function rgb(start, end) {
      var r = color((start = colorRgb$2(start)).r, (end = colorRgb$2(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = color(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function interpolateNumber(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  var reA$2 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB$2 = new RegExp(reA$2.source, "g");
  function zero$2(b) {
    return function() {
      return b;
    };
  }

  function one$2(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA$2.lastIndex = reB$2.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA$2.exec(a))
        && (bm = reB$2.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB$2.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one$2(q[0].x)
        : zero$2(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var degrees$2 = 180 / Math.PI;

  var identity$6 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose$2(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees$2,
      skewX: Math.atan(skewX) * degrees$2,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode$2;
  var cssRoot$2;
  var cssView$2;
  var svgNode$2;
  function parseCss$2(value) {
    if (value === "none") return identity$6;
    if (!cssNode$2) cssNode$2 = document.createElement("DIV"), cssRoot$2 = document.documentElement, cssView$2 = document.defaultView;
    cssNode$2.style.transform = value;
    value = cssView$2.getComputedStyle(cssRoot$2.appendChild(cssNode$2), null).getPropertyValue("transform");
    cssRoot$2.removeChild(cssNode$2);
    value = value.slice(7, -1).split(",");
    return decompose$2(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg$2(value) {
    if (value == null) return identity$6;
    if (!svgNode$2) svgNode$2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode$2.setAttribute("transform", value);
    if (!(value = svgNode$2.transform.baseVal.consolidate())) return identity$6;
    value = value.matrix;
    return decompose$2(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform$2(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransform$3 = interpolateTransform$2(parseCss$2, "px, ", "px)", "deg)");
  var interpolateTransformSvg$2 = interpolateTransform$2(parseSvg$2, ", ", ")", ")");

  function cubehelix$8(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix(start, end) {
        var h = hue((start = cubehelix$7(start)).h, (end = cubehelix$7(end)).h),
            s = nogamma$2(start.s, end.s),
            l = nogamma$2(start.l, end.l),
            opacity = nogamma$2(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix.gamma = cubehelixGamma;

      return cubehelix;
    })(1);
  }

  cubehelix$8(hue$2);
  var cubehelixLong$1 = cubehelix$8(nogamma$2);

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set$2(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set$2(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set$2(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get$1(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color$2 ? interpolateRgb
        : (c = color$2(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, interpolate, value1) {
    var value00,
        interpolate0;
    return function() {
      var value0 = this.getAttribute(name);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value1);
    };
  }

  function attrConstantNS$1(fullname, interpolate, value1) {
    var value00,
        interpolate0;
    return function() {
      var value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value1);
    };
  }

  function attrFunction$1(name, interpolate, value) {
    var value00,
        value10,
        interpolate0;
    return function() {
      var value0, value1 = value(this);
      if (value1 == null) return void this.removeAttribute(name);
      value0 = this.getAttribute(name);
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
  }

  function attrFunctionNS$1(fullname, interpolate, value) {
    var value00,
        value10,
        interpolate0;
    return function() {
      var value0, value1 = value(this);
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg$2 : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
  }

  function attrTweenNS(fullname, value) {
    function tween() {
      var node = this, i = value.apply(node, arguments);
      return i && function(t) {
        node.setAttributeNS(fullname.space, fullname.local, i(t));
      };
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    function tween() {
      var node = this, i = value.apply(node, arguments);
      return i && function(t) {
        node.setAttribute(name, i(t));
      };
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set$2(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set$2(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set$2(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher$1(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start$1(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start$1(name) ? init : set$2;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection$1 = selection.prototype.constructor;

  function transition_selection() {
    return new Selection$1(this._groups, this._parents);
  }

  function styleRemove$1(name, interpolate) {
    var value00,
        value10,
        interpolate0;
    return function() {
      var style = window(this).getComputedStyle(this, null),
          value0 = style.getPropertyValue(name),
          value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
  }

  function styleRemoveEnd(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, interpolate, value1) {
    var value00,
        interpolate0;
    return function() {
      var value0 = window(this).getComputedStyle(this, null).getPropertyValue(name);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value1);
    };
  }

  function styleFunction$1(name, interpolate, value) {
    var value00,
        value10,
        interpolate0;
    return function() {
      var style = window(this).getComputedStyle(this, null),
          value0 = style.getPropertyValue(name),
          value1 = value(this);
      if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransform$3 : interpolate;
    return value == null ? this
            .styleTween(name, styleRemove$1(name, i))
            .on("end.style." + name, styleRemoveEnd(name))
        : this.styleTween(name, typeof value === "function"
            ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
            : styleConstant$1(name, i, value), priority);
  }

  function styleTween(name, value, priority) {
    function tween() {
      var node = this, i = value.apply(node, arguments);
      return i && function(t) {
        node.style.setProperty(name, i(t), priority);
      };
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction$1(tweenValue(this, "text", value))
        : textConstant$1(value == null ? "" : value + ""));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function transition(name) {
    return selection().transition(name);
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease
  };

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: easeCubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        return defaultTiming.time = now(), defaultTiming;
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  var root$1 = [null];

  function active(node, name) {
    var schedules = node.__transition,
        schedule,
        i;

    if (schedules) {
      name = name == null ? null : name + "";
      for (i in schedules) {
        if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
          return new Transition([[node]], root$1, name, +i);
        }
      }
    }

    return null;
  }

  var slice$4 = Array.prototype.slice;

  function identity$7(x) {
    return x;
  }

  var top = 1;
  var right = 2;
  var bottom = 3;
  var left = 4;
  var epsilon$2 = 1e-6;
  function translateX(scale0, scale1, d) {
    var x = scale0(d);
    return "translate(" + (isFinite(x) ? x : scale1(d)) + ",0)";
  }

  function translateY(scale0, scale1, d) {
    var y = scale0(d);
    return "translate(0," + (isFinite(y) ? y : scale1(d)) + ")";
  }

  function center(scale) {
    var offset = scale.bandwidth() / 2;
    if (scale.round()) offset = Math.round(offset);
    return function(d) {
      return scale(d) + offset;
    };
  }

  function entering() {
    return !this.__axis;
  }

  function axis(orient, scale) {
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3;

    function axis(context) {
      var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
          format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$7) : tickFormat,
          spacing = Math.max(tickSizeInner, 0) + tickPadding,
          transform = orient === top || orient === bottom ? translateX : translateY,
          range = scale.range(),
          range0 = range[0] + 0.5,
          range1 = range[range.length - 1] + 0.5,
          position = (scale.bandwidth ? center : identity$7)(scale.copy()),
          selection = context.selection ? context.selection() : context,
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text"),
          k = orient === top || orient === left ? -1 : 1,
          x, y = orient === left || orient === right ? (x = "x", "y") : (x = "y", "x");

      path = path.merge(path.enter().insert("path", ".tick")
          .attr("class", "domain")
          .attr("stroke", "#000"));

      tick = tick.merge(tickEnter);

      line = line.merge(tickEnter.append("line")
          .attr("stroke", "#000")
          .attr(x + "2", k * tickSizeInner)
          .attr(y + "1", 0.5)
          .attr(y + "2", 0.5));

      text = text.merge(tickEnter.append("text")
          .attr("fill", "#000")
          .attr(x, k * spacing)
          .attr(y, 0.5)
          .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

      if (context !== selection) {
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);

        tickExit = tickExit.transition(context)
            .attr("opacity", epsilon$2)
            .attr("transform", function(d) { return transform(position, this.parentNode.__axis || position, d); });

        tickEnter
            .attr("opacity", epsilon$2)
            .attr("transform", function(d) { return transform(this.parentNode.__axis || position, position, d); });
      }

      tickExit.remove();

      path
          .attr("d", orient === left || orient == right
              ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
              : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

      tick
          .attr("opacity", 1)
          .attr("transform", function(d) { return transform(position, position, d); });

      line
          .attr(x + "2", k * tickSizeInner);

      text
          .attr(x, k * spacing)
          .text(format);

      selection.filter(entering)
          .attr("fill", "none")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

      selection
          .each(function() { this.__axis = position; });
    }

    axis.scale = function(_) {
      return arguments.length ? (scale = _, axis) : scale;
    };

    axis.ticks = function() {
      return tickArguments = slice$4.call(arguments), axis;
    };

    axis.tickArguments = function(_) {
      return arguments.length ? (tickArguments = _ == null ? [] : slice$4.call(_), axis) : tickArguments.slice();
    };

    axis.tickValues = function(_) {
      return arguments.length ? (tickValues = _ == null ? null : slice$4.call(_), axis) : tickValues && tickValues.slice();
    };

    axis.tickFormat = function(_) {
      return arguments.length ? (tickFormat = _, axis) : tickFormat;
    };

    axis.tickSize = function(_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    };

    axis.tickSizeInner = function(_) {
      return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    };

    axis.tickSizeOuter = function(_) {
      return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    };

    axis.tickPadding = function(_) {
      return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    };

    return axis;
  }

  function axisBottom(scale) {
    return axis(bottom, scale);
  }

  function axisLeft(scale) {
    return axis(left, scale);
  }

  exports.ascending = ascending;
  exports.extent = extent;
  exports.max = max;
  exports.min = min;
  exports.range = sequence;
  exports.scan = scan;
  exports.shuffle = shuffle;
  exports.sum = sum;
  exports.ticks = ticks;
  exports.tickStep = tickStep;
  exports.entries = entries;
  exports.keys = keys;
  exports.values = values;
  exports.map = map$1;
  exports.set = set;
  exports.nest = nest;
  exports.easeCubic = easeCubicInOut;
  exports.easeSinInOut = sinInOut;
  exports.queue = queue;
  exports.line = line;
  exports.curveCatmullRom = catmullRom;
  exports.request = request;
  exports.csv = csv;
  exports.json = json;
  exports.xml = xml;
  exports.scaleBand = band;
  exports.scalePoint = point$4;
  exports.scaleLinear = linear$1;
  exports.scaleOrdinal = ordinal;
  exports.scalePow = pow;
  exports.scaleSequential = sequential;
  exports.interpolateMagma = magma;
  exports.interpolateOrRd = OrRd;
  exports.creator = creator;
  exports.customEvent = customEvent;
  exports.local = local;
  exports.matcher = matcher$1;
  exports.mouse = mouse;
  exports.namespace = namespace;
  exports.namespaces = namespaces;
  exports.select = select;
  exports.selectAll = selectAll;
  exports.selection = selection;
  exports.selector = selector;
  exports.selectorAll = selectorAll;
  exports.touch = touch;
  exports.touches = touches;
  exports.window = window;
  exports.active = active;
  exports.transition = transition;
  exports.axisBottom = axisBottom;
  exports.axisLeft = axisLeft;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
/*
 * popcorn.js version v1.5.11
 * http://popcornjs.org
 *
 * Copyright 2011, Mozilla Foundation
 * Licensed under the MIT license
 *
 * popcorn.js + HTMLYouTubeVideoElement wrapper
 * Gnerated from http://popcorn-js.chrisdecairos.ca/
 */

(function(global, document) {

  // Popcorn.js does not support archaic browsers
  if ( !document.addEventListener ) {
    global.Popcorn = {
      isSupported: false
    };

    var methods = ( "byId forEach extend effects error guid sizeOf isArray nop position disable enable destroy" +
          "addTrackEvent removeTrackEvent getTrackEvents getTrackEvent getLastTrackEventId " +
          "timeUpdate plugin removePlugin compose effect xhr getJSONP getScript" ).split(/\s+/);

    while ( methods.length ) {
      global.Popcorn[ methods.shift() ] = function() {};
    }
    return;
  }

  var

  AP = Array.prototype,
  OP = Object.prototype,

  forEach = AP.forEach,
  slice = AP.slice,
  hasOwn = OP.hasOwnProperty,
  toString = OP.toString,

  // Copy global Popcorn (may not exist)
  _Popcorn = global.Popcorn,

  //  Ready fn cache
  readyStack = [],
  readyBound = false,
  readyFired = false,

  //  Non-public internal data object
  internal = {
    events: {
      hash: {},
      apis: {}
    }
  },

  //  Non-public `requestAnimFrame`
  //  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimFrame = (function(){
    return global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.mozRequestAnimationFrame ||
      global.oRequestAnimationFrame ||
      global.msRequestAnimationFrame ||
      function( callback, element ) {
        global.setTimeout( callback, 16 );
      };
  }()),

  //  Non-public `getKeys`, return an object's keys as an array
  getKeys = function( obj ) {
    return Object.keys ? Object.keys( obj ) : (function( obj ) {
      var item,
          list = [];

      for ( item in obj ) {
        if ( hasOwn.call( obj, item ) ) {
          list.push( item );
        }
      }
      return list;
    })( obj );
  },

  Abstract = {
    // [[Put]] props from dictionary onto |this|
    // MUST BE CALLED FROM WITHIN A CONSTRUCTOR:
    //  Abstract.put.call( this, dictionary );
    put: function( dictionary ) {
      // For each own property of src, let key be the property key
      // and desc be the property descriptor of the property.
      for ( var key in dictionary ) {
        if ( dictionary.hasOwnProperty( key ) ) {
          this[ key ] = dictionary[ key ];
        }
      }
    }
  },


  //  Declare constructor
  //  Returns an instance object.
  Popcorn = function( entity, options ) {
    //  Return new Popcorn object
    return new Popcorn.p.init( entity, options || null );
  };

  //  Popcorn API version, automatically inserted via build system.
  Popcorn.version = "@VERSION";

  //  Boolean flag allowing a client to determine if Popcorn can be supported
  Popcorn.isSupported = true;

  //  Instance caching
  Popcorn.instances = [];

  //  Declare a shortcut (Popcorn.p) to and a definition of
  //  the new prototype for our Popcorn constructor
  Popcorn.p = Popcorn.prototype = {

    init: function( entity, options ) {

      var matches, nodeName,
          self = this;

      //  Supports Popcorn(function () { /../ })
      //  Originally proposed by Daniel Brooks

      if ( typeof entity === "function" ) {

        //  If document ready has already fired
        if ( document.readyState === "complete" ) {

          entity( document, Popcorn );

          return;
        }
        //  Add `entity` fn to ready stack
        readyStack.push( entity );

        //  This process should happen once per page load
        if ( !readyBound ) {

          //  set readyBound flag
          readyBound = true;

          var DOMContentLoaded  = function() {

            readyFired = true;

            //  Remove global DOM ready listener
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            //  Execute all ready function in the stack
            for ( var i = 0, readyStackLength = readyStack.length; i < readyStackLength; i++ ) {

              readyStack[ i ].call( document, Popcorn );

            }
            //  GC readyStack
            readyStack = null;
          };

          //  Register global DOM ready listener
          document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        }

        return;
      }

      if ( typeof entity === "string" ) {
        try {
          matches = document.querySelector( entity );
        } catch( e ) {
          throw new Error( "Popcorn.js Error: Invalid media element selector: " + entity );
        }
      }

      //  Get media element by id or object reference
      this.media = matches || entity;

      //  inner reference to this media element's nodeName string value
      nodeName = ( this.media.nodeName && this.media.nodeName.toLowerCase() ) || "video";

      //  Create an audio or video element property reference
      this[ nodeName ] = this.media;

      this.options = Popcorn.extend( {}, options ) || {};

      //  Resolve custom ID or default prefixed ID
      this.id = this.options.id || Popcorn.guid( nodeName );

      //  Throw if an attempt is made to use an ID that already exists
      if ( Popcorn.byId( this.id ) ) {
        throw new Error( "Popcorn.js Error: Cannot use duplicate ID (" + this.id + ")" );
      }

      this.isDestroyed = false;

      this.data = {

        // data structure of all
        running: {
          cue: []
        },

        // Executed by either timeupdate event or in rAF loop
        timeUpdate: Popcorn.nop,

        // Allows disabling a plugin per instance
        disabled: {},

        // Stores DOM event queues by type
        events: {},

        // Stores Special event hooks data
        hooks: {},

        // Store track event history data
        history: [],

        // Stores ad-hoc state related data]
        state: {
          volume: this.media.volume
        },

        // Store track event object references by trackId
        trackRefs: {},

        // Playback track event queues
        trackEvents: new TrackEvents( this )
      };

      //  Register new instance
      Popcorn.instances.push( this );

      //  function to fire when video is ready
      var isReady = function() {

        // chrome bug: http://code.google.com/p/chromium/issues/detail?id=119598
        // it is possible the video's time is less than 0
        // this has the potential to call track events more than once, when they should not
        // start: 0, end: 1 will start, end, start again, when it should just start
        // just setting it to 0 if it is below 0 fixes this issue
        if ( self.media.currentTime < 0 ) {

          self.media.currentTime = 0;
        }

        self.media.removeEventListener( "loadedmetadata", isReady, false );

        var duration, videoDurationPlus,
            runningPlugins, runningPlugin, rpLength, rpNatives;

        //  Adding padding to the front and end of the arrays
        //  this is so we do not fall off either end
        duration = self.media.duration;

        //  Check for no duration info (NaN)
        videoDurationPlus = duration != duration ? Number.MAX_VALUE : duration + 1;

        Popcorn.addTrackEvent( self, {
          start: videoDurationPlus,
          end: videoDurationPlus
        });

        if ( !self.isDestroyed ) {
          self.data.durationChange = function() {
            var newDuration = self.media.duration,
                newDurationPlus = newDuration + 1,
                byStart = self.data.trackEvents.byStart,
                byEnd = self.data.trackEvents.byEnd;

            // Remove old padding events
            byStart.pop();
            byEnd.pop();

            // Remove any internal tracking of events that have end times greater than duration
            // otherwise their end events will never be hit.
            for ( var k = byEnd.length - 1; k > 0; k-- ) {
              if ( byEnd[ k ].end > newDuration ) {
                self.removeTrackEvent( byEnd[ k ]._id );
              }
            }

            // Remove any internal tracking of events that have end times greater than duration
            // otherwise their end events will never be hit.
            for ( var i = 0; i < byStart.length; i++ ) {
              if ( byStart[ i ].end > newDuration ) {
                self.removeTrackEvent( byStart[ i ]._id );
              }
            }

            // References to byEnd/byStart are reset, so accessing it this way is
            // forced upon us.
            self.data.trackEvents.byEnd.push({
              start: newDurationPlus,
              end: newDurationPlus
            });

            self.data.trackEvents.byStart.push({
              start: newDurationPlus,
              end: newDurationPlus
            });
          };

          // Listen for duration changes and adjust internal tracking of event timings
          self.media.addEventListener( "durationchange", self.data.durationChange, false );
        }

        if ( self.options.frameAnimation ) {

          //  if Popcorn is created with frameAnimation option set to true,
          //  requestAnimFrame is used instead of "timeupdate" media event.
          //  This is for greater frame time accuracy, theoretically up to
          //  60 frames per second as opposed to ~4 ( ~every 15-250ms)
          self.data.timeUpdate = function () {

            Popcorn.timeUpdate( self, {} );

            // fire frame for each enabled active plugin of every type
            Popcorn.forEach( Popcorn.manifest, function( key, val ) {

              runningPlugins = self.data.running[ val ];

              // ensure there are running plugins on this type on this instance
              if ( runningPlugins ) {

                rpLength = runningPlugins.length;
                for ( var i = 0; i < rpLength; i++ ) {

                  runningPlugin = runningPlugins[ i ];
                  rpNatives = runningPlugin._natives;
                  rpNatives && rpNatives.frame &&
                    rpNatives.frame.call( self, {}, runningPlugin, self.currentTime() );
                }
              }
            });

            self.emit( "timeupdate" );

            !self.isDestroyed && requestAnimFrame( self.data.timeUpdate );
          };

          !self.isDestroyed && requestAnimFrame( self.data.timeUpdate );

        } else {

          self.data.timeUpdate = function( event ) {
            Popcorn.timeUpdate( self, event );
          };

          if ( !self.isDestroyed ) {
            self.media.addEventListener( "timeupdate", self.data.timeUpdate, false );
          }
        }
      };

      self.media.addEventListener( "error", function() {
        self.error = self.media.error;
      }, false );

      // http://www.whatwg.org/specs/web-apps/current-work/#dom-media-readystate
      //
      // If media is in readyState (rS) >= 1, we know the media's duration,
      // which is required before running the isReady function.
      // If rS is 0, attach a listener for "loadedmetadata",
      // ( Which indicates that the media has moved from rS 0 to 1 )
      //
      // This has been changed from a check for rS 2 because
      // in certain conditions, Firefox can enter this code after dropping
      // to rS 1 from a higher state such as 2 or 3. This caused a "loadeddata"
      // listener to be attached to the media object, an event that had
      // already triggered and would not trigger again. This left Popcorn with an
      // instance that could never start a timeUpdate loop.
      if ( self.media.readyState >= 1 ) {

        isReady();
      } else {

        self.media.addEventListener( "loadedmetadata", isReady, false );
      }

      return this;
    }
  };

  //  Extend constructor prototype to instance prototype
  //  Allows chaining methods to instances
  Popcorn.p.init.prototype = Popcorn.p;

  Popcorn.byId = function( str ) {
    var instances = Popcorn.instances,
        length = instances.length,
        i = 0;

    for ( ; i < length; i++ ) {
      if ( instances[ i ].id === str ) {
        return instances[ i ];
      }
    }

    return null;
  };

  Popcorn.forEach = function( obj, fn, context ) {

    if ( !obj || !fn ) {
      return {};
    }

    context = context || this;

    var key, len;

    // Use native whenever possible
    if ( forEach && obj.forEach === forEach ) {
      return obj.forEach( fn, context );
    }

    if ( toString.call( obj ) === "[object NodeList]" ) {
      for ( key = 0, len = obj.length; key < len; key++ ) {
        fn.call( context, obj[ key ], key, obj );
      }
      return obj;
    }

    for ( key in obj ) {
      if ( hasOwn.call( obj, key ) ) {
        fn.call( context, obj[ key ], key, obj );
      }
    }
    return obj;
  };

  Popcorn.extend = function( obj ) {
    var dest = obj, src = slice.call( arguments, 1 );

    Popcorn.forEach( src, function( copy ) {
      for ( var prop in copy ) {
        dest[ prop ] = copy[ prop ];
      }
    });

    return dest;
  };


  // A Few reusable utils, memoized onto Popcorn
  Popcorn.extend( Popcorn, {
    noConflict: function( deep ) {

      if ( deep ) {
        global.Popcorn = _Popcorn;
      }

      return Popcorn;
    },
    error: function( msg ) {
      throw new Error( msg );
    },
    guid: function( prefix ) {
      Popcorn.guid.counter++;
      return  ( prefix ? prefix : "" ) + ( +new Date() + Popcorn.guid.counter );
    },
    sizeOf: function( obj ) {
      var size = 0;

      for ( var prop in obj ) {
        size++;
      }

      return size;
    },
    isArray: Array.isArray || function( array ) {
      return toString.call( array ) === "[object Array]";
    },

    nop: function() {},

    position: function( elem ) {

      if ( !elem.parentNode ) {
        return null;
      }

      var clientRect = elem.getBoundingClientRect(),
          bounds = {},
          doc = elem.ownerDocument,
          docElem = document.documentElement,
          body = document.body,
          clientTop, clientLeft, scrollTop, scrollLeft, top, left;

      //  Determine correct clientTop/Left
      clientTop = docElem.clientTop || body.clientTop || 0;
      clientLeft = docElem.clientLeft || body.clientLeft || 0;

      //  Determine correct scrollTop/Left
      scrollTop = ( global.pageYOffset && docElem.scrollTop || body.scrollTop );
      scrollLeft = ( global.pageXOffset && docElem.scrollLeft || body.scrollLeft );

      //  Temp top/left
      top = Math.ceil( clientRect.top + scrollTop - clientTop );
      left = Math.ceil( clientRect.left + scrollLeft - clientLeft );

      for ( var p in clientRect ) {
        bounds[ p ] = Math.round( clientRect[ p ] );
      }

      return Popcorn.extend({}, bounds, { top: top, left: left });
    },

    disable: function( instance, plugin ) {

      if ( instance.data.disabled[ plugin ] ) {
        return;
      }

      instance.data.disabled[ plugin ] = true;

      if ( plugin in Popcorn.registryByName &&
           instance.data.running[ plugin ] ) {

        for ( var i = instance.data.running[ plugin ].length - 1, event; i >= 0; i-- ) {

          event = instance.data.running[ plugin ][ i ];
          event._natives.end.call( instance, null, event  );

          instance.emit( "trackend",
            Popcorn.extend({}, event, {
              plugin: event.type,
              type: "trackend"
            })
          );
        }
      }

      return instance;
    },
    enable: function( instance, plugin ) {

      if ( !instance.data.disabled[ plugin ] ) {
        return;
      }

      instance.data.disabled[ plugin ] = false;

      if ( plugin in Popcorn.registryByName &&
           instance.data.running[ plugin ] ) {

        for ( var i = instance.data.running[ plugin ].length - 1, event; i >= 0; i-- ) {

          event = instance.data.running[ plugin ][ i ];
          event._natives.start.call( instance, null, event  );

          instance.emit( "trackstart",
            Popcorn.extend({}, event, {
              plugin: event.type,
              type: "trackstart",
              track: event
            })
          );
        }
      }

      return instance;
    },
    destroy: function( instance ) {
      var events = instance.data.events,
          trackEvents = instance.data.trackEvents,
          singleEvent, item, fn, plugin;

      //  Iterate through all events and remove them
      for ( item in events ) {
        singleEvent = events[ item ];
        for ( fn in singleEvent ) {
          delete singleEvent[ fn ];
        }
        events[ item ] = null;
      }

      // remove all plugins off the given instance
      for ( plugin in Popcorn.registryByName ) {
        Popcorn.removePlugin( instance, plugin );
      }

      // Remove all data.trackEvents #1178
      trackEvents.byStart.length = 0;
      trackEvents.byEnd.length = 0;

      if ( !instance.isDestroyed ) {
        instance.data.timeUpdate && instance.media.removeEventListener( "timeupdate", instance.data.timeUpdate, false );
        instance.isDestroyed = true;
      }

      Popcorn.instances.splice( Popcorn.instances.indexOf( instance ), 1 );
    }
  });

  //  Memoized GUID Counter
  Popcorn.guid.counter = 1;

  //  Factory to implement getters, setters and controllers
  //  as Popcorn instance methods. The IIFE will create and return
  //  an object with defined methods
  Popcorn.extend(Popcorn.p, (function() {

      var methods = "load play pause currentTime playbackRate volume duration preload playbackRate " +
                    "autoplay loop controls muted buffered readyState seeking paused played seekable ended",
          ret = {};


      //  Build methods, store in object that is returned and passed to extend
      Popcorn.forEach( methods.split( /\s+/g ), function( name ) {

        ret[ name ] = function( arg ) {
          var previous;

          if ( typeof this.media[ name ] === "function" ) {

            // Support for shorthanded play(n)/pause(n) jump to currentTime
            // If arg is not null or undefined and called by one of the
            // allowed shorthandable methods, then set the currentTime
            // Supports time as seconds or SMPTE
            if ( arg != null && /play|pause/.test( name ) ) {
              this.media.currentTime = Popcorn.util.toSeconds( arg );
            }

            this.media[ name ]();

            return this;
          }

          if ( arg != null ) {
            // Capture the current value of the attribute property
            previous = this.media[ name ];

            // Set the attribute property with the new value
            this.media[ name ] = arg;

            // If the new value is not the same as the old value
            // emit an "attrchanged event"
            if ( previous !== arg ) {
              this.emit( "attrchange", {
                attribute: name,
                previousValue: previous,
                currentValue: arg
              });
            }
            return this;
          }

          return this.media[ name ];
        };
      });

      return ret;

    })()
  );

  Popcorn.forEach( "enable disable".split(" "), function( method ) {
    Popcorn.p[ method ] = function( plugin ) {
      return Popcorn[ method ]( this, plugin );
    };
  });

  Popcorn.extend(Popcorn.p, {

    //  Rounded currentTime
    roundTime: function() {
      return Math.round( this.media.currentTime );
    },

    //  Attach an event to a single point in time
    exec: function( id, time, fn ) {
      var length = arguments.length,
          eventType = "trackadded",
          trackEvent, sec, options;

      // Check if first could possibly be a SMPTE string
      // p.cue( "smpte string", fn );
      // try/catch avoid awful throw in Popcorn.util.toSeconds
      // TODO: Get rid of that, replace with NaN return?
      try {
        sec = Popcorn.util.toSeconds( id );
      } catch ( e ) {}

      // If it can be converted into a number then
      // it's safe to assume that the string was SMPTE
      if ( typeof sec === "number" ) {
        id = sec;
      }

      // Shift arguments based on use case
      //
      // Back compat for:
      // p.cue( time, fn );
      if ( typeof id === "number" && length === 2 ) {
        fn = time;
        time = id;
        id = Popcorn.guid( "cue" );
      } else {
        // Support for new forms

        // p.cue( "empty-cue" );
        if ( length === 1 ) {
          // Set a time for an empty cue. It's not important what
          // the time actually is, because the cue is a no-op
          time = -1;

        } else {

          // Get the TrackEvent that matches the given id.
          trackEvent = this.getTrackEvent( id );

          if ( trackEvent ) {

            // remove existing cue so a new one can be added via trackEvents.add
            this.data.trackEvents.remove( id );
            TrackEvent.end( this, trackEvent );
            // Update track event references
            Popcorn.removeTrackEvent.ref( this, id );

            eventType = "cuechange";

            // p.cue( "my-id", 12 );
            // p.cue( "my-id", function() { ... });
            if ( typeof id === "string" && length === 2 ) {

              // p.cue( "my-id", 12 );
              // The path will update the cue time.
              if ( typeof time === "number" ) {
                // Re-use existing TrackEvent start callback
                fn = trackEvent._natives.start;
              }

              // p.cue( "my-id", function() { ... });
              // The path will update the cue function
              if ( typeof time === "function" ) {
                fn = time;
                // Re-use existing TrackEvent start time
                time = trackEvent.start;
              }
            }
          } else {

            if ( length >= 2 ) {

              // p.cue( "a", "00:00:00");
              if ( typeof time === "string" ) {
                try {
                  sec = Popcorn.util.toSeconds( time );
                } catch ( e ) {}

                time = sec;
              }

              // p.cue( "b", 11 );
              // p.cue( "b", 11, function() {} );
              if ( typeof time === "number" ) {
                fn = fn || Popcorn.nop();
              }

              // p.cue( "c", function() {});
              if ( typeof time === "function" ) {
                fn = time;
                time = -1;
              }
            }
          }
        }
      }

      options = {
        id: id,
        start: time,
        end: time + 1,
        _running: false,
        _natives: {
          start: fn || Popcorn.nop,
          end: Popcorn.nop,
          type: "cue"
        }
      };

      if ( trackEvent ) {
        options = Popcorn.extend( trackEvent, options );
      }

      if ( eventType === "cuechange" ) {

        //  Supports user defined track event id
        options._id = options.id || options._id || Popcorn.guid( options._natives.type );

        this.data.trackEvents.add( options );
        TrackEvent.start( this, options );

        this.timeUpdate( this, null, true );

        // Store references to user added trackevents in ref table
        Popcorn.addTrackEvent.ref( this, options );

        this.emit( eventType, Popcorn.extend({}, options, {
          id: id,
          type: eventType,
          previousValue: {
            time: trackEvent.start,
            fn: trackEvent._natives.start
          },
          currentValue: {
            time: time,
            fn: fn || Popcorn.nop
          },
          track: trackEvent
        }));
      } else {
        //  Creating a one second track event with an empty end
        Popcorn.addTrackEvent( this, options );
      }

      return this;
    },

    // Mute the calling media, optionally toggle
    mute: function( toggle ) {

      var event = toggle == null || toggle === true ? "muted" : "unmuted";

      // If `toggle` is explicitly `false`,
      // unmute the media and restore the volume level
      if ( event === "unmuted" ) {
        this.media.muted = false;
        this.media.volume = this.data.state.volume;
      }

      // If `toggle` is either null or undefined,
      // save the current volume and mute the media element
      if ( event === "muted" ) {
        this.data.state.volume = this.media.volume;
        this.media.muted = true;
      }

      // Trigger either muted|unmuted event
      this.emit( event );

      return this;
    },

    // Convenience method, unmute the calling media
    unmute: function( toggle ) {

      return this.mute( toggle == null ? false : !toggle );
    },

    // Get the client bounding box of an instance element
    position: function() {
      return Popcorn.position( this.media );
    },

    // Toggle a plugin's playback behaviour (on or off) per instance
    toggle: function( plugin ) {
      return Popcorn[ this.data.disabled[ plugin ] ? "enable" : "disable" ]( this, plugin );
    },

    // Set default values for plugin options objects per instance
    defaults: function( plugin, defaults ) {

      // If an array of default configurations is provided,
      // iterate and apply each to this instance
      if ( Popcorn.isArray( plugin ) ) {

        Popcorn.forEach( plugin, function( obj ) {
          for ( var name in obj ) {
            this.defaults( name, obj[ name ] );
          }
        }, this );

        return this;
      }

      if ( !this.options.defaults ) {
        this.options.defaults = {};
      }

      if ( !this.options.defaults[ plugin ] ) {
        this.options.defaults[ plugin ] = {};
      }

      Popcorn.extend( this.options.defaults[ plugin ], defaults );

      return this;
    }
  });

  Popcorn.Events  = {
    UIEvents: "blur focus focusin focusout load resize scroll unload",
    MouseEvents: "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave click dblclick",
    Events: "loadstart progress suspend emptied stalled play pause error " +
            "loadedmetadata loadeddata waiting playing canplay canplaythrough " +
            "seeking seeked timeupdate ended ratechange durationchange volumechange"
  };

  Popcorn.Events.Natives = Popcorn.Events.UIEvents + " " +
                           Popcorn.Events.MouseEvents + " " +
                           Popcorn.Events.Events;

  internal.events.apiTypes = [ "UIEvents", "MouseEvents", "Events" ];

  // Privately compile events table at load time
  (function( events, data ) {

    var apis = internal.events.apiTypes,
    eventsList = events.Natives.split( /\s+/g ),
    idx = 0, len = eventsList.length, prop;

    for( ; idx < len; idx++ ) {
      data.hash[ eventsList[idx] ] = true;
    }

    apis.forEach(function( val, idx ) {

      data.apis[ val ] = {};

      var apiEvents = events[ val ].split( /\s+/g ),
      len = apiEvents.length,
      k = 0;

      for ( ; k < len; k++ ) {
        data.apis[ val ][ apiEvents[ k ] ] = true;
      }
    });
  })( Popcorn.Events, internal.events );

  Popcorn.events = {

    isNative: function( type ) {
      return !!internal.events.hash[ type ];
    },
    getInterface: function( type ) {

      if ( !Popcorn.events.isNative( type ) ) {
        return false;
      }

      var eventApi = internal.events,
        apis = eventApi.apiTypes,
        apihash = eventApi.apis,
        idx = 0, len = apis.length, api, tmp;

      for ( ; idx < len; idx++ ) {
        tmp = apis[ idx ];

        if ( apihash[ tmp ][ type ] ) {
          api = tmp;
          break;
        }
      }
      return api;
    },
    //  Compile all native events to single array
    all: Popcorn.Events.Natives.split( /\s+/g ),
    //  Defines all Event handling static functions
    fn: {
      trigger: function( type, data ) {
        var eventInterface, evt, clonedEvents,
            events = this.data.events[ type ];

        //  setup checks for custom event system
        if ( events ) {
          eventInterface  = Popcorn.events.getInterface( type );

          if ( eventInterface ) {
            evt = document.createEvent( eventInterface );
            evt.initEvent( type, true, true, global, 1 );

            this.media.dispatchEvent( evt );

            return this;
          }

          // clone events in case callbacks remove callbacks themselves
          clonedEvents = events.slice();

          // iterate through all callbacks
          while ( clonedEvents.length ) {
            clonedEvents.shift().call( this, data );
          }
        }

        return this;
      },
      listen: function( type, fn ) {
        var self = this,
            hasEvents = true,
            eventHook = Popcorn.events.hooks[ type ],
            origType = type,
            clonedEvents,
            tmp;

        if ( typeof fn !== "function" ) {
          throw new Error( "Popcorn.js Error: Listener is not a function" );
        }

        // Setup event registry entry
        if ( !this.data.events[ type ] ) {
          this.data.events[ type ] = [];
          // Toggle if the previous assumption was untrue
          hasEvents = false;
        }

        // Check and setup event hooks
        if ( eventHook ) {
          // Execute hook add method if defined
          if ( eventHook.add ) {
            eventHook.add.call( this, {}, fn );
          }

          // Reassign event type to our piggyback event type if defined
          if ( eventHook.bind ) {
            type = eventHook.bind;
          }

          // Reassign handler if defined
          if ( eventHook.handler ) {
            tmp = fn;

            fn = function wrapper( event ) {
              eventHook.handler.call( self, event, tmp );
            };
          }

          // assume the piggy back event is registered
          hasEvents = true;

          // Setup event registry entry
          if ( !this.data.events[ type ] ) {
            this.data.events[ type ] = [];
            // Toggle if the previous assumption was untrue
            hasEvents = false;
          }
        }

        //  Register event and handler
        this.data.events[ type ].push( fn );

        // only attach one event of any type
        if ( !hasEvents && Popcorn.events.all.indexOf( type ) > -1 ) {
          this.media.addEventListener( type, function( event ) {
            if ( self.data.events[ type ] ) {
              // clone events in case callbacks remove callbacks themselves
              clonedEvents = self.data.events[ type ].slice();

              // iterate through all callbacks
              while ( clonedEvents.length ) {
                clonedEvents.shift().call( self, event );
              }
            }
          }, false );
        }
        return this;
      },
      unlisten: function( type, fn ) {
        var ind,
            events = this.data.events[ type ];

        if ( !events ) {
          return; // no listeners = nothing to do
        }

        if ( typeof fn === "string" ) {
          // legacy support for string-based removal -- not recommended
          for ( var i = 0; i < events.length; i++ ) {
            if ( events[ i ].name === fn ) {
              // decrement i because array length just got smaller
              events.splice( i--, 1 );
            }
          }

          return this;
        } else if ( typeof fn === "function" ) {
          while( ind !== -1 ) {
            ind = events.indexOf( fn );
            if ( ind !== -1 ) {
              events.splice( ind, 1 );
            }
          }

          return this;
        }

        // if we got to this point, we are deleting all functions of this type
        this.data.events[ type ] = null;

        return this;
      }
    },
    hooks: {
      canplayall: {
        bind: "canplaythrough",
        add: function( event, callback ) {

          var state = false;

          if ( this.media.readyState ) {

            // always call canplayall asynchronously
            setTimeout(function() {
              callback.call( this, event );
            }.bind(this), 0 );

            state = true;
          }

          this.data.hooks.canplayall = {
            fired: state
          };
        },
        // declare special handling instructions
        handler: function canplayall( event, callback ) {

          if ( !this.data.hooks.canplayall.fired ) {
            // trigger original user callback once
            callback.call( this, event );

            this.data.hooks.canplayall.fired = true;
          }
        }
      }
    }
  };

  //  Extend Popcorn.events.fns (listen, unlisten, trigger) to all Popcorn instances
  //  Extend aliases (on, off, emit)
  Popcorn.forEach( [ [ "trigger", "emit" ], [ "listen", "on" ], [ "unlisten", "off" ] ], function( key ) {
    Popcorn.p[ key[ 0 ] ] = Popcorn.p[ key[ 1 ] ] = Popcorn.events.fn[ key[ 0 ] ];
  });

  // Internal Only - construct simple "TrackEvent"
  // data type objects
  function TrackEvent( track ) {
    Abstract.put.call( this, track );
  }

  // Determine if a TrackEvent's "start" and "trackstart" must be called.
  TrackEvent.start = function( instance, track ) {

    if ( track.end > instance.media.currentTime &&
        track.start <= instance.media.currentTime && !track._running ) {

      track._running = true;
      instance.data.running[ track._natives.type ].push( track );

      if ( !instance.data.disabled[ track._natives.type ] ) {

        track._natives.start.call( instance, null, track );

        instance.emit( "trackstart",
          Popcorn.extend( {}, track, {
            plugin: track._natives.type,
            type: "trackstart",
            track: track
          })
        );
      }
    }
  };

  // Determine if a TrackEvent's "end" and "trackend" must be called.
  TrackEvent.end = function( instance, track ) {

    var runningPlugins;

    if ( ( track.end <= instance.media.currentTime ||
        track.start > instance.media.currentTime ) && track._running ) {

      runningPlugins = instance.data.running[ track._natives.type ];

      track._running = false;
      runningPlugins.splice( runningPlugins.indexOf( track ), 1 );

      if ( !instance.data.disabled[ track._natives.type ] ) {

        track._natives.end.call( instance, null, track );

        instance.emit( "trackend",
          Popcorn.extend( {}, track, {
            plugin: track._natives.type,
            type: "trackend",
            track: track
          })
        );
      }
    }
  };

  // Internal Only - construct "TrackEvents"
  // data type objects that are used by the Popcorn
  // instance, stored at p.data.trackEvents
  function TrackEvents( parent ) {
    this.parent = parent;

    this.byStart = [{
      start: -1,
      end: -1
    }];

    this.byEnd = [{
      start: -1,
      end: -1
    }];
    this.animating = [];
    this.startIndex = 0;
    this.endIndex = 0;
    this.previousUpdateTime = -1;

    this.count = 1;
  }

  function isMatch( obj, key, value ) {
    return obj[ key ] && obj[ key ] === value;
  }

  TrackEvents.prototype.where = function( params ) {
    return ( this.parent.getTrackEvents() || [] ).filter(function( event ) {
      var key, value;

      // If no explicit params, match all TrackEvents
      if ( !params ) {
        return true;
      }

      // Filter keys in params against both the top level properties
      // and the _natives properties
      for ( key in params ) {
        value = params[ key ];
        if ( isMatch( event, key, value ) || isMatch( event._natives, key, value ) ) {
          return true;
        }
      }
      return false;
    });
  };

  TrackEvents.prototype.add = function( track ) {

    //  Store this definition in an array sorted by times
    var byStart = this.byStart,
        byEnd = this.byEnd,
        startIndex, endIndex;

    //  Push track event ids into the history
    if ( track && track._id ) {
      this.parent.data.history.push( track._id );
    }

    track.start = Popcorn.util.toSeconds( track.start, this.parent.options.framerate );
    track.end   = Popcorn.util.toSeconds( track.end, this.parent.options.framerate );

    for ( startIndex = byStart.length - 1; startIndex >= 0; startIndex-- ) {

      if ( track.start >= byStart[ startIndex ].start ) {
        byStart.splice( startIndex + 1, 0, track );
        break;
      }
    }

    for ( endIndex = byEnd.length - 1; endIndex >= 0; endIndex-- ) {

      if ( track.end > byEnd[ endIndex ].end ) {
        byEnd.splice( endIndex + 1, 0, track );
        break;
      }
    }

    // update startIndex and endIndex
    if ( startIndex <= this.parent.data.trackEvents.startIndex &&
      track.start <= this.parent.data.trackEvents.previousUpdateTime ) {

      this.parent.data.trackEvents.startIndex++;
    }

    if ( endIndex <= this.parent.data.trackEvents.endIndex &&
      track.end < this.parent.data.trackEvents.previousUpdateTime ) {

      this.parent.data.trackEvents.endIndex++;
    }

    this.count++;

  };

  TrackEvents.prototype.remove = function( removeId, state ) {

    if ( removeId instanceof TrackEvent ) {
      removeId = removeId.id;
    }

    if ( typeof removeId === "object" ) {
      // Filter by key=val and remove all matching TrackEvents
      this.where( removeId ).forEach(function( event ) {
        // |this| refers to the calling Popcorn "parent" instance
        this.removeTrackEvent( event._id );
      }, this.parent );

      return this;
    }

    var start, end, animate, historyLen, track,
        length = this.byStart.length,
        index = 0,
        indexWasAt = 0,
        byStart = [],
        byEnd = [],
        animating = [],
        history = [],
        comparable = {};

    state = state || {};

    while ( --length > -1 ) {
      start = this.byStart[ index ];
      end = this.byEnd[ index ];

      // Padding events will not have _id properties.
      // These should be safely pushed onto the front and back of the
      // track event array
      if ( !start._id ) {
        byStart.push( start );
        byEnd.push( end );
      }

      // Filter for user track events (vs system track events)
      if ( start._id ) {

        // If not a matching start event for removal
        if ( start._id !== removeId ) {
          byStart.push( start );
        }

        // If not a matching end event for removal
        if ( end._id !== removeId ) {
          byEnd.push( end );
        }

        // If the _id is matched, capture the current index
        if ( start._id === removeId ) {
          indexWasAt = index;

          // cache the track event being removed
          track = start;
        }
      }
      // Increment the track index
      index++;
    }

    // Reset length to be used by the condition below to determine
    // if animating track events should also be filtered for removal.
    // Reset index below to be used by the reverse while as an
    // incrementing counter
    length = this.animating.length;
    index = 0;

    if ( length ) {
      while ( --length > -1 ) {
        animate = this.animating[ index ];

        // Padding events will not have _id properties.
        // These should be safely pushed onto the front and back of the
        // track event array
        if ( !animate._id ) {
          animating.push( animate );
        }

        // If not a matching animate event for removal
        if ( animate._id && animate._id !== removeId ) {
          animating.push( animate );
        }
        // Increment the track index
        index++;
      }
    }

    //  Update
    if ( indexWasAt <= this.startIndex ) {
      this.startIndex--;
    }

    if ( indexWasAt <= this.endIndex ) {
      this.endIndex--;
    }

    this.byStart = byStart;
    this.byEnd = byEnd;
    this.animating = animating;
    this.count--;

    historyLen = this.parent.data.history.length;

    for ( var i = 0; i < historyLen; i++ ) {
      if ( this.parent.data.history[ i ] !== removeId ) {
        history.push( this.parent.data.history[ i ] );
      }
    }

    // Update ordered history array
    this.parent.data.history = history;

  };

  // Helper function used to retrieve old values of properties that
  // are provided for update.
  function getPreviousProperties( oldOptions, newOptions ) {
    var matchProps = {};

    for ( var prop in oldOptions ) {
      if ( hasOwn.call( newOptions, prop ) && hasOwn.call( oldOptions, prop ) ) {
        matchProps[ prop ] = oldOptions[ prop ];
      }
    }

    return matchProps;
  }

  // Internal Only - Adds track events to the instance object
  Popcorn.addTrackEvent = function( obj, track ) {
    var temp;

    if ( track instanceof TrackEvent ) {
      return;
    }

    track = new TrackEvent( track );

    // Determine if this track has default options set for it
    // If so, apply them to the track object
    if ( track && track._natives && track._natives.type &&
        ( obj.options.defaults && obj.options.defaults[ track._natives.type ] ) ) {

      // To ensure that the TrackEvent Invariant Policy is enforced,
      // First, copy the properties of the newly created track event event
      // to a temporary holder
      temp = Popcorn.extend( {}, track );

      // Next, copy the default onto the newly created trackevent, followed by the
      // temporary holder.
      Popcorn.extend( track, obj.options.defaults[ track._natives.type ], temp );
    }

    if ( track._natives ) {
      //  Supports user defined track event id
      track._id = track.id || track._id || Popcorn.guid( track._natives.type );

      // Trigger _setup method if exists
      if ( track._natives._setup ) {

        track._natives._setup.call( obj, track );

        obj.emit( "tracksetup", Popcorn.extend( {}, track, {
          plugin: track._natives.type,
          type: "tracksetup",
          track: track
        }));
      }
    }

    obj.data.trackEvents.add( track );
    TrackEvent.start( obj, track );

    this.timeUpdate( obj, null, true );

    // Store references to user added trackevents in ref table
    if ( track._id ) {
      Popcorn.addTrackEvent.ref( obj, track );
    }

    obj.emit( "trackadded", Popcorn.extend({}, track,
      track._natives ? { plugin: track._natives.type } : {}, {
        type: "trackadded",
        track: track
    }));
  };

  // Internal Only - Adds track event references to the instance object's trackRefs hash table
  Popcorn.addTrackEvent.ref = function( obj, track ) {
    obj.data.trackRefs[ track._id ] = track;

    return obj;
  };

  Popcorn.removeTrackEvent = function( obj, removeId ) {
    var track = obj.getTrackEvent( removeId );

    if ( !track ) {
      return;
    }

    // If a _teardown function was defined,
    // enforce for track event removals
    if ( track._natives._teardown ) {
      track._natives._teardown.call( obj, track );
    }

    obj.data.trackEvents.remove( removeId );

    // Update track event references
    Popcorn.removeTrackEvent.ref( obj, removeId );

    if ( track._natives ) {

      // Fire a trackremoved event
      obj.emit( "trackremoved", Popcorn.extend({}, track, {
        plugin: track._natives.type,
        type: "trackremoved",
        track: track
      }));
    }
  };

  // Internal Only - Removes track event references from instance object's trackRefs hash table
  Popcorn.removeTrackEvent.ref = function( obj, removeId ) {
    delete obj.data.trackRefs[ removeId ];

    return obj;
  };

  // Return an array of track events bound to this instance object
  Popcorn.getTrackEvents = function( obj ) {

    var trackevents = [],
      refs = obj.data.trackEvents.byStart,
      length = refs.length,
      idx = 0,
      ref;

    for ( ; idx < length; idx++ ) {
      ref = refs[ idx ];
      // Return only user attributed track event references
      if ( ref._id ) {
        trackevents.push( ref );
      }
    }

    return trackevents;
  };

  // Internal Only - Returns an instance object's trackRefs hash table
  Popcorn.getTrackEvents.ref = function( obj ) {
    return obj.data.trackRefs;
  };

  // Return a single track event bound to this instance object
  Popcorn.getTrackEvent = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  // Internal Only - Returns an instance object's track reference by track id
  Popcorn.getTrackEvent.ref = function( obj, trackId ) {
    return obj.data.trackRefs[ trackId ];
  };

  Popcorn.getLastTrackEventId = function( obj ) {
    return obj.data.history[ obj.data.history.length - 1 ];
  };

  Popcorn.timeUpdate = function( obj, event ) {
    var currentTime = obj.media.currentTime,
        previousTime = obj.data.trackEvents.previousUpdateTime,
        tracks = obj.data.trackEvents,
        end = tracks.endIndex,
        start = tracks.startIndex,
        byStartLen = tracks.byStart.length,
        byEndLen = tracks.byEnd.length,
        registryByName = Popcorn.registryByName,
        trackstart = "trackstart",
        trackend = "trackend",

        byEnd, byStart, byAnimate, natives, type, runningPlugins;

    //  Playbar advancing
    if ( previousTime <= currentTime ) {

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end <= currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd._running === true ) {

            byEnd._running = false;
            runningPlugins = obj.data.running[ type ];
            runningPlugins.splice( runningPlugins.indexOf( byEnd ), 1 );

            if ( !obj.data.disabled[ type ] ) {

              natives.end.call( obj, event, byEnd );

              obj.emit( trackend,
                Popcorn.extend({}, byEnd, {
                  plugin: type,
                  type: trackend,
                  track: byEnd
                })
              );
            }
          }

          end++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start <= currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;
        //  If plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {
          if ( byStart.end > currentTime &&
                byStart._running === false ) {

            byStart._running = true;
            obj.data.running[ type ].push( byStart );

            if ( !obj.data.disabled[ type ] ) {

              natives.start.call( obj, event, byStart );

              obj.emit( trackstart,
                Popcorn.extend({}, byStart, {
                  plugin: type,
                  type: trackstart,
                  track: byStart
                })
              );
            }
          }
          start++;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

    // Playbar receding
    } else if ( previousTime > currentTime ) {

      while ( tracks.byStart[ start ] && tracks.byStart[ start ].start > currentTime ) {

        byStart = tracks.byStart[ start ];
        natives = byStart._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byStart._running === true ) {

            byStart._running = false;
            runningPlugins = obj.data.running[ type ];
            runningPlugins.splice( runningPlugins.indexOf( byStart ), 1 );

            if ( !obj.data.disabled[ type ] ) {

              natives.end.call( obj, event, byStart );

              obj.emit( trackend,
                Popcorn.extend({}, byStart, {
                  plugin: type,
                  type: trackend,
                  track: byStart
                })
              );
            }
          }
          start--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byStart._id );
          return;
        }
      }

      while ( tracks.byEnd[ end ] && tracks.byEnd[ end ].end > currentTime ) {

        byEnd = tracks.byEnd[ end ];
        natives = byEnd._natives;
        type = natives && natives.type;

        // if plugin does not exist on this instance, remove it
        if ( !natives ||
            ( !!registryByName[ type ] ||
              !!obj[ type ] ) ) {

          if ( byEnd.start <= currentTime &&
                byEnd._running === false ) {

            byEnd._running = true;
            obj.data.running[ type ].push( byEnd );

            if ( !obj.data.disabled[ type ] ) {

              natives.start.call( obj, event, byEnd );

              obj.emit( trackstart,
                Popcorn.extend({}, byEnd, {
                  plugin: type,
                  type: trackstart,
                  track: byEnd
                })
              );
            }
          }
          end--;
        } else {
          // remove track event
          Popcorn.removeTrackEvent( obj, byEnd._id );
          return;
        }
      }
    }

    tracks.endIndex = end;
    tracks.startIndex = start;
    tracks.previousUpdateTime = currentTime;

    //enforce index integrity if trackRemoved
    tracks.byStart.length < byStartLen && tracks.startIndex--;
    tracks.byEnd.length < byEndLen && tracks.endIndex--;

  };

  //  Map and Extend TrackEvent functions to all Popcorn instances
  Popcorn.extend( Popcorn.p, {

    getTrackEvents: function() {
      return Popcorn.getTrackEvents.call( null, this );
    },

    getTrackEvent: function( id ) {
      return Popcorn.getTrackEvent.call( null, this, id );
    },

    getLastTrackEventId: function() {
      return Popcorn.getLastTrackEventId.call( null, this );
    },

    removeTrackEvent: function( id ) {

      Popcorn.removeTrackEvent.call( null, this, id );
      return this;
    },

    removePlugin: function( name ) {
      Popcorn.removePlugin.call( null, this, name );
      return this;
    },

    timeUpdate: function( event ) {
      Popcorn.timeUpdate.call( null, this, event );
      return this;
    },

    destroy: function() {
      Popcorn.destroy.call( null, this );
      return this;
    }
  });

  //  Plugin manifests
  Popcorn.manifest = {};
  //  Plugins are registered
  Popcorn.registry = [];
  Popcorn.registryByName = {};
  //  An interface for extending Popcorn
  //  with plugin functionality
  Popcorn.plugin = function( name, definition, manifest ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    //  Provides some sugar, but ultimately extends
    //  the definition into Popcorn.p
    var isfn = typeof definition === "function",
        blacklist = [ "start", "end", "type", "manifest" ],
        methods = [ "_setup", "_teardown", "start", "end", "frame" ],
        plugin = {},
        setup;

    // combines calls of two function calls into one
    var combineFn = function( first, second ) {

      first = first || Popcorn.nop;
      second = second || Popcorn.nop;

      return function() {
        first.apply( this, arguments );
        second.apply( this, arguments );
      };
    };

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // apply safe, and empty default functions
    methods.forEach(function( method ) {
      definition[ method ] = safeTry( definition[ method ] || Popcorn.nop, name );
    });

    var pluginFn = function( setup, options ) {

      if ( !options ) {
        return this;
      }

      // When the "ranges" property is set and its value is an array, short-circuit
      // the pluginFn definition to recall itself with an options object generated from
      // each range object in the ranges array. (eg. { start: 15, end: 16 } )
      if ( options.ranges && Popcorn.isArray(options.ranges) ) {
        Popcorn.forEach( options.ranges, function( range ) {
          // Create a fresh object, extend with current options
          // and start/end range object's properties
          // Works with in/out as well.
          var opts = Popcorn.extend( {}, options, range );

          // Remove the ranges property to prevent infinitely
          // entering this condition
          delete opts.ranges;

          // Call the plugin with the newly created opts object
          this[ name ]( opts );
        }, this);

        // Return the Popcorn instance to avoid creating an empty track event
        return this;
      }

      //  Storing the plugin natives
      var natives = options._natives = {},
          compose = "",
          originalOpts, manifestOpts;

      Popcorn.extend( natives, setup );

      options._natives.type = options._natives.plugin = name;
      options._running = false;

      natives.start = natives.start || natives[ "in" ];
      natives.end = natives.end || natives[ "out" ];

      if ( options.once ) {
        natives.end = combineFn( natives.end, function() {
          this.removeTrackEvent( options._id );
        });
      }

      // extend teardown to always call end if running
      natives._teardown = combineFn(function() {

        var args = slice.call( arguments ),
            runningPlugins = this.data.running[ natives.type ];

        // end function signature is not the same as teardown,
        // put null on the front of arguments for the event parameter
        args.unshift( null );

        // only call end if event is running
        args[ 1 ]._running &&
          runningPlugins.splice( runningPlugins.indexOf( options ), 1 ) &&
          natives.end.apply( this, args );

        args[ 1 ]._running = false;
        this.emit( "trackend",
          Popcorn.extend( {}, options, {
            plugin: natives.type,
            type: "trackend",
            track: Popcorn.getTrackEvent( this, options.id || options._id )
          })
        );
      }, natives._teardown );

      // extend teardown to always trigger trackteardown after teardown
      natives._teardown = combineFn( natives._teardown, function() {

        this.emit( "trackteardown", Popcorn.extend( {}, options, {
          plugin: name,
          type: "trackteardown",
          track: Popcorn.getTrackEvent( this, options.id || options._id )
        }));
      });

      // default to an empty string if no effect exists
      // split string into an array of effects
      options.compose = options.compose || [];
      if ( typeof options.compose === "string" ) {
        options.compose = options.compose.split( " " );
      }
      options.effect = options.effect || [];
      if ( typeof options.effect === "string" ) {
        options.effect = options.effect.split( " " );
      }

      // join the two arrays together
      options.compose = options.compose.concat( options.effect );

      options.compose.forEach(function( composeOption ) {

        // if the requested compose is garbage, throw it away
        compose = Popcorn.compositions[ composeOption ] || {};

        // extends previous functions with compose function
        methods.forEach(function( method ) {
          natives[ method ] = combineFn( natives[ method ], compose[ method ] );
        });
      });

      //  Ensure a manifest object, an empty object is a sufficient fallback
      options._natives.manifest = manifest;

      //  Checks for expected properties
      if ( !( "start" in options ) ) {
        options.start = options[ "in" ] || 0;
      }

      if ( !options.end && options.end !== 0 ) {
        options.end = options[ "out" ] || Number.MAX_VALUE;
      }

      // Use hasOwn to detect non-inherited toString, since all
      // objects will receive a toString - its otherwise undetectable
      if ( !hasOwn.call( options, "toString" ) ) {
        options.toString = function() {
          var props = [
            "start: " + options.start,
            "end: " + options.end,
            "id: " + (options.id || options._id)
          ];

          // Matches null and undefined, allows: false, 0, "" and truthy
          if ( options.target != null ) {
            props.push( "target: " + options.target );
          }

          return name + " ( " + props.join(", ") + " )";
        };
      }

      // Resolves 239, 241, 242
      if ( !options.target ) {

        //  Sometimes the manifest may be missing entirely
        //  or it has an options object that doesn't have a `target` property
        manifestOpts = "options" in manifest && manifest.options;

        options.target = manifestOpts && "target" in manifestOpts && manifestOpts.target;
      }

      if ( !options._id && options._natives ) {
        // ensure an initial id is there before setup is called
        options._id = Popcorn.guid( options._natives.type );
      }

      if ( options instanceof TrackEvent ) {

        if ( options._natives ) {
          //  Supports user defined track event id
          options._id = options.id || options._id || Popcorn.guid( options._natives.type );

          // Trigger _setup method if exists
          if ( options._natives._setup ) {

            options._natives._setup.call( this, options );

            this.emit( "tracksetup", Popcorn.extend( {}, options, {
              plugin: options._natives.type,
              type: "tracksetup",
              track: options
            }));
          }
        }

        this.data.trackEvents.add( options );
        TrackEvent.start( this, options );

        this.timeUpdate( this, null, true );

        // Store references to user added trackevents in ref table
        if ( options._id ) {
          Popcorn.addTrackEvent.ref( this, options );
        }
      } else {
        // Create new track event for this instance
        Popcorn.addTrackEvent( this, options );
      }

      //  Future support for plugin event definitions
      //  for all of the native events
      Popcorn.forEach( setup, function( callback, type ) {
        // Don't attempt to create events for certain properties:
        // "start", "end", "type", "manifest". Fixes #1365
        if ( blacklist.indexOf( type ) === -1 ) {
          this.on( type, callback );
        }
      }, this );

      return this;
    };

    //  Extend Popcorn.p with new named definition
    //  Assign new named definition
    Popcorn.p[ name ] = plugin[ name ] = function( id, options ) {
      var length = arguments.length,
          trackEvent, defaults, mergedSetupOpts, previousOpts, newOpts;

      // Shift arguments based on use case
      //
      // Back compat for:
      // p.plugin( options );
      if ( id && !options ) {
        options = id;
        id = null;
      } else {

        // Get the trackEvent that matches the given id.
        trackEvent = this.getTrackEvent( id );

        // If the track event does not exist, ensure that the options
        // object has a proper id
        if ( !trackEvent ) {
          options.id = id;

        // If the track event does exist, merge the updated properties
        } else {

          newOpts = options;
          previousOpts = getPreviousProperties( trackEvent, newOpts );

          // Call the plugins defined update method if provided. Allows for
          // custom defined updating for a track event to be defined by the plugin author
          if ( trackEvent._natives._update ) {

            this.data.trackEvents.remove( trackEvent );

            // It's safe to say that the intent of Start/End will never change
            // Update them first before calling update
            if ( hasOwn.call( options, "start" ) ) {
              trackEvent.start = options.start;
            }

            if ( hasOwn.call( options, "end" ) ) {
              trackEvent.end = options.end;
            }

            TrackEvent.end( this, trackEvent );

            if ( isfn ) {
              definition.call( this, trackEvent );
            }

            trackEvent._natives._update.call( this, trackEvent, options );

            this.data.trackEvents.add( trackEvent );
            TrackEvent.start( this, trackEvent );
          } else {
            // This branch is taken when there is no explicitly defined
            // _update method for a plugin. Which will occur either explicitly or
            // as a result of the plugin definition being a function that _returns_
            // a definition object.
            //
            // In either case, this path can ONLY be reached for TrackEvents that
            // already exist.

            // Directly update the TrackEvent instance.
            // This supports TrackEvent invariant enforcement.
            Popcorn.extend( trackEvent, options );

            this.data.trackEvents.remove( id );

            // If a _teardown function was defined,
            // enforce for track event removals
            if ( trackEvent._natives._teardown ) {
              trackEvent._natives._teardown.call( this, trackEvent );
            }

            // Update track event references
            Popcorn.removeTrackEvent.ref( this, id );

            if ( isfn ) {
              pluginFn.call( this, definition.call( this, trackEvent ), trackEvent );
            } else {

              //  Supports user defined track event id
              trackEvent._id = trackEvent.id || trackEvent._id || Popcorn.guid( trackEvent._natives.type );

              if ( trackEvent._natives && trackEvent._natives._setup ) {

                trackEvent._natives._setup.call( this, trackEvent );

                this.emit( "tracksetup", Popcorn.extend( {}, trackEvent, {
                  plugin: trackEvent._natives.type,
                  type: "tracksetup",
                  track: trackEvent
                }));
              }

              this.data.trackEvents.add( trackEvent );
              TrackEvent.start( this, trackEvent );

              this.timeUpdate( this, null, true );

              // Store references to user added trackevents in ref table
              Popcorn.addTrackEvent.ref( this, trackEvent );
            }

            // Fire an event with change information
            this.emit( "trackchange", {
              id: trackEvent.id,
              type: "trackchange",
              previousValue: previousOpts,
              currentValue: trackEvent,
              track: trackEvent
            });

            return this;
          }

          if ( trackEvent._natives.type !== "cue" ) {
            // Fire an event with change information
            this.emit( "trackchange", {
              id: trackEvent.id,
              type: "trackchange",
              previousValue: previousOpts,
              currentValue: newOpts,
              track: trackEvent
            });
          }

          return this;
        }
      }

      this.data.running[ name ] = this.data.running[ name ] || [];

      // Merge with defaults if they exist, make sure per call is prioritized
      defaults = ( this.options.defaults && this.options.defaults[ name ] ) || {};
      mergedSetupOpts = Popcorn.extend( {}, defaults, options );

      pluginFn.call( this, isfn ? definition.call( this, mergedSetupOpts ) : definition,
                                  mergedSetupOpts );

      return this;
    };

    // if the manifest parameter exists we should extend it onto the definition object
    // so that it shows up when calling Popcorn.registry and Popcorn.registryByName
    if ( manifest ) {
      Popcorn.extend( definition, {
        manifest: manifest
      });
    }

    //  Push into the registry
    var entry = {
      fn: plugin[ name ],
      definition: definition,
      base: definition,
      parents: [],
      name: name
    };
    Popcorn.registry.push(
       Popcorn.extend( plugin, entry, {
        type: name
      })
    );
    Popcorn.registryByName[ name ] = entry;

    return plugin;
  };

  // Storage for plugin function errors
  Popcorn.plugin.errors = [];

  // Returns wrapped plugin function
  function safeTry( fn, pluginName ) {
    return function() {

      //  When Popcorn.plugin.debug is true, do not suppress errors
      if ( Popcorn.plugin.debug ) {
        return fn.apply( this, arguments );
      }

      try {
        return fn.apply( this, arguments );
      } catch ( ex ) {

        // Push plugin function errors into logging queue
        Popcorn.plugin.errors.push({
          plugin: pluginName,
          thrown: ex,
          source: fn.toString()
        });

        // Trigger an error that the instance can listen for
        // and react to
        this.emit( "pluginerror", Popcorn.plugin.errors );
      }
    };
  }

  // Debug-mode flag for plugin development
  // True for Popcorn development versions, false for stable/tagged versions
  Popcorn.plugin.debug = ( Popcorn.version === "@" + "VERSION" );

  //  removePlugin( type ) removes all tracks of that from all instances of popcorn
  //  removePlugin( obj, type ) removes all tracks of type from obj, where obj is a single instance of popcorn
  Popcorn.removePlugin = function( obj, name ) {

    //  Check if we are removing plugin from an instance or from all of Popcorn
    if ( !name ) {

      //  Fix the order
      name = obj;
      obj = Popcorn.p;

      if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
        Popcorn.error( "'" + name + "' is a protected function name" );
        return;
      }

      var registryLen = Popcorn.registry.length,
          registryIdx;

      // remove plugin reference from registry
      for ( registryIdx = 0; registryIdx < registryLen; registryIdx++ ) {
        if ( Popcorn.registry[ registryIdx ].name === name ) {
          Popcorn.registry.splice( registryIdx, 1 );
          delete Popcorn.registryByName[ name ];
          delete Popcorn.manifest[ name ];

          // delete the plugin
          delete obj[ name ];

          // plugin found and removed, stop checking, we are done
          return;
        }
      }

    }

    var byStart = obj.data.trackEvents.byStart,
        byEnd = obj.data.trackEvents.byEnd,
        animating = obj.data.trackEvents.animating,
        idx, sl;

    // remove all trackEvents
    for ( idx = 0, sl = byStart.length; idx < sl; idx++ ) {

      if ( byStart[ idx ] && byStart[ idx ]._natives && byStart[ idx ]._natives.type === name ) {

        byStart[ idx ]._natives._teardown && byStart[ idx ]._natives._teardown.call( obj, byStart[ idx ] );

        byStart.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
        if ( obj.data.trackEvents.startIndex <= idx ) {
          obj.data.trackEvents.startIndex--;
          obj.data.trackEvents.endIndex--;
        }
      }

      // clean any remaining references in the end index
      // we do this seperate from the above check because they might not be in the same order
      if ( byEnd[ idx ] && byEnd[ idx ]._natives && byEnd[ idx ]._natives.type === name ) {

        byEnd.splice( idx, 1 );
      }
    }

    //remove all animating events
    for ( idx = 0, sl = animating.length; idx < sl; idx++ ) {

      if ( animating[ idx ] && animating[ idx ]._natives && animating[ idx ]._natives.type === name ) {

        animating.splice( idx, 1 );

        // update for loop if something removed, but keep checking
        idx--; sl--;
      }
    }

  };

  Popcorn.compositions = {};

  //  Plugin inheritance
  Popcorn.compose = function( name, definition, manifest ) {

    //  If `manifest` arg is undefined, check for manifest within the `definition` object
    //  If no `definition.manifest`, an empty object is a sufficient fallback
    Popcorn.manifest[ name ] = manifest = manifest || definition.manifest || {};

    // register the effect by name
    Popcorn.compositions[ name ] = definition;
  };

  Popcorn.plugin.effect = Popcorn.effect = Popcorn.compose;

  var rnaiveExpr = /^(?:\.|#|\[)/;

  //  Basic DOM utilities and helpers API. See #1037
  Popcorn.dom = {
    debug: false,
    //  Popcorn.dom.find( selector, context )
    //
    //  Returns the first element that matches the specified selector
    //  Optionally provide a context element, defaults to `document`
    //
    //  eg.
    //  Popcorn.dom.find("video") returns the first video element
    //  Popcorn.dom.find("#foo") returns the first element with `id="foo"`
    //  Popcorn.dom.find("foo") returns the first element with `id="foo"`
    //     Note: Popcorn.dom.find("foo") is the only allowed deviation
    //           from valid querySelector selector syntax
    //
    //  Popcorn.dom.find(".baz") returns the first element with `class="baz"`
    //  Popcorn.dom.find("[preload]") returns the first element with `preload="..."`
    //  ...
    //  See https://developer.mozilla.org/En/DOM/Document.querySelector
    //
    //
    find: function( selector, context ) {
      var node = null;

      //  Default context is the `document`
      context = context || document;

      if ( selector ) {

        //  If the selector does not begin with "#", "." or "[",
        //  it could be either a nodeName or ID w/o "#"
        if ( !rnaiveExpr.test( selector ) ) {

          //  Try finding an element that matches by ID first
          node = document.getElementById( selector );

          //  If a match was found by ID, return the element
          if ( node !== null ) {
            return node;
          }
        }
        //  Assume no elements have been found yet
        //  Catch any invalid selector syntax errors and bury them.
        try {
          node = context.querySelector( selector );
        } catch ( e ) {
          if ( Popcorn.dom.debug ) {
            throw new Error(e);
          }
        }
      }
      return node;
    }
  };

  //  Cache references to reused RegExps
  var rparams = /\?/,
  //  XHR Setup object
  setup = {
    ajax: null,
    url: "",
    data: "",
    dataType: "",
    success: Popcorn.nop,
    type: "GET",
    async: true,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8"
  };

  Popcorn.xhr = function( options ) {
    var settings;

    options.dataType = options.dataType && options.dataType.toLowerCase() || null;

    if ( options.dataType &&
         ( options.dataType === "jsonp" || options.dataType === "script" ) ) {

      Popcorn.xhr.getJSONP(
        options.url,
        options.success,
        options.dataType === "script"
      );
      return;
    }

    //  Merge the "setup" defaults and custom "options"
    //  into a new plain object.
    settings = Popcorn.extend( {}, setup, options );

    //  Create new XMLHttpRequest object
    settings.ajax = new XMLHttpRequest();

    if ( settings.ajax ) {

      if ( settings.type === "GET" && settings.data ) {

        //  append query string
        settings.url += ( rparams.test( settings.url ) ? "&" : "?" ) + settings.data;

        //  Garbage collect and reset settings.data
        settings.data = null;
      }

      //  Open the request
      settings.ajax.open( settings.type, settings.url, settings.async );

      //  For POST, set the content-type request header
      if ( settings.type === "POST" ) {
        settings.ajax.setRequestHeader(
          "Content-Type", settings.contentType
        );
      }

      settings.ajax.send( settings.data || null );

      return Popcorn.xhr.httpData( settings );
    }
  };


  Popcorn.xhr.httpData = function( settings ) {

    var data, json = null,
        parser, xml = null;

    settings.ajax.onreadystatechange = function() {

      if ( settings.ajax.readyState === 4 ) {

        try {
          json = JSON.parse( settings.ajax.responseText );
        } catch( e ) {
          //suppress
        }

        data = {
          xml: settings.ajax.responseXML,
          text: settings.ajax.responseText,
          json: json
        };

        // Normalize: data.xml is non-null in IE9 regardless of if response is valid xml
        if ( !data.xml || !data.xml.documentElement ) {
          data.xml = null;

          try {
            parser = new DOMParser();
            xml = parser.parseFromString( settings.ajax.responseText, "text/xml" );

            if ( !xml.getElementsByTagName( "parsererror" ).length ) {
              data.xml = xml;
            }
          } catch ( e ) {
            // data.xml remains null
          }
        }

        //  If a dataType was specified, return that type of data
        if ( settings.dataType ) {
          data = data[ settings.dataType ];
        }


        settings.success.call( settings.ajax, data );

      }
    };
    return data;
  };

  Popcorn.xhr.getJSONP = function( url, success, isScript ) {

    var head = document.head || document.getElementsByTagName( "head" )[ 0 ] || document.documentElement,
      script = document.createElement( "script" ),
      isFired = false,
      params = [],
      rjsonp = /(=)\?(?=&|$)|\?\?/,
      replaceInUrl, prefix, paramStr, callback, callparam;

    if ( !isScript ) {

      // is there a calback already in the url
      callparam = url.match( /(callback=[^&]*)/ );

      if ( callparam !== null && callparam.length ) {

        prefix = callparam[ 1 ].split( "=" )[ 1 ];

        // Since we need to support developer specified callbacks
        // and placeholders in harmony, make sure matches to "callback="
        // aren't just placeholders.
        // We coded ourselves into a corner here.
        // JSONP callbacks should never have been
        // allowed to have developer specified callbacks
        if ( prefix === "?" ) {
          prefix = "jsonp";
        }

        // get the callback name
        callback = Popcorn.guid( prefix );

        // replace existing callback name with unique callback name
        url = url.replace( /(callback=[^&]*)/, "callback=" + callback );
      } else {

        callback = Popcorn.guid( "jsonp" );

        if ( rjsonp.test( url ) ) {
          url = url.replace( rjsonp, "$1" + callback );
        }

        // split on first question mark,
        // this is to capture the query string
        params = url.split( /\?(.+)?/ );

        // rebuild url with callback
        url = params[ 0 ] + "?";
        if ( params[ 1 ] ) {
          url += params[ 1 ] + "&";
        }
        url += "callback=" + callback;
      }

      //  Define the JSONP success callback globally
      window[ callback ] = function( data ) {
        // Fire success callbacks
        success && success( data );
        isFired = true;
      };
    }

    script.addEventListener( "load",  function() {

      //  Handling remote script loading callbacks
      if ( isScript ) {
        //  getScript
        success && success();
      }

      //  Executing for JSONP requests
      if ( isFired ) {
        //  Garbage collect the callback
        delete window[ callback ];
      }
      //  Garbage collect the script resource
      head.removeChild( script );
    }, false );

    script.addEventListener( "error",  function( e ) {
      //  Handling remote script loading callbacks
      success && success( { error: e } );

      //  Executing for JSONP requests
      if ( !isScript ) {
        //  Garbage collect the callback
        delete window[ callback ];
      }
      //  Garbage collect the script resource
      head.removeChild( script );
    }, false );

    script.src = url;
    head.insertBefore( script, head.firstChild );

    return;
  };

  Popcorn.getJSONP = Popcorn.xhr.getJSONP;

  Popcorn.getScript = Popcorn.xhr.getScript = function( url, success ) {

    return Popcorn.xhr.getJSONP( url, success, true );
  };

  Popcorn.util = {
    // Simple function to parse a timestamp into seconds
    // Acceptable formats are:
    // HH:MM:SS.MMM
    // HH:MM:SS;FF
    // Hours and minutes are optional. They default to 0
    toSeconds: function( timeStr, framerate ) {
      // Hours and minutes are optional
      // Seconds must be specified
      // Seconds can be followed by milliseconds OR by the frame information
      var validTimeFormat = /^([0-9]+:){0,2}[0-9]+([.;][0-9]+)?$/,
          errorMessage = "Invalid time format",
          digitPairs, lastIndex, lastPair, firstPair,
          frameInfo, frameTime;

      if ( typeof timeStr === "number" ) {
        return timeStr;
      }

      if ( typeof timeStr === "string" &&
            !validTimeFormat.test( timeStr ) ) {
        Popcorn.error( errorMessage );
      }

      digitPairs = timeStr.split( ":" );
      lastIndex = digitPairs.length - 1;
      lastPair = digitPairs[ lastIndex ];

      // Fix last element:
      if ( lastPair.indexOf( ";" ) > -1 ) {

        frameInfo = lastPair.split( ";" );
        frameTime = 0;

        if ( framerate && ( typeof framerate === "number" ) ) {
          frameTime = parseFloat( frameInfo[ 1 ], 10 ) / framerate;
        }

        digitPairs[ lastIndex ] = parseInt( frameInfo[ 0 ], 10 ) + frameTime;
      }

      firstPair = digitPairs[ 0 ];

      return {

        1: parseFloat( firstPair, 10 ),

        2: ( parseInt( firstPair, 10 ) * 60 ) +
              parseFloat( digitPairs[ 1 ], 10 ),

        3: ( parseInt( firstPair, 10 ) * 3600 ) +
            ( parseInt( digitPairs[ 1 ], 10 ) * 60 ) +
              parseFloat( digitPairs[ 2 ], 10 )

      }[ digitPairs.length || 1 ];
    }
  };

  // alias for exec function
  Popcorn.p.cue = Popcorn.p.exec;

  //  Protected API methods
  Popcorn.protect = {
    natives: getKeys( Popcorn.p ).map(function( val ) {
      return val.toLowerCase();
    })
  };

  // Setup logging for deprecated methods
  Popcorn.forEach({
    // Deprecated: Recommended
    "listen": "on",
    "unlisten": "off",
    "trigger": "emit",
    "exec": "cue"

  }, function( recommend, api ) {
    var original = Popcorn.p[ api ];
    // Override the deprecated api method with a method of the same name
    // that logs a warning and defers to the new recommended method
    Popcorn.p[ api ] = function() {
      if ( typeof console !== "undefined" && console.warn ) {
        console.warn(
          "Deprecated method '" + api + "', " +
          (recommend == null ? "do not use." : "use '" + recommend + "' instead." )
        );

        // Restore api after first warning
        Popcorn.p[ api ] = original;
      }
      return Popcorn.p[ recommend ].apply( this, [].slice.call( arguments ) );
    };
  });


  //  Exposes Popcorn to global context
  global.Popcorn = Popcorn;

})(window, window.document);
// PLUGIN: Footnote/Text

(function ( Popcorn ) {

  /**
   * Footnote popcorn plug-in
   * Adds text to an element on the page.
   * Options parameter will need a start, end, target and text.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Text is the text that you want to appear in the target
   * Target is the id of the document element that the text needs to be
   * attached to, this target element must exist on the DOM
   *
   * @param {Object} options
   *
   * Example:
   *  var p = Popcorn('#video')
   *    .footnote({
   *      start: 5, // seconds
   *      end: 15, // seconds
   *      text: 'This video made exclusively for drumbeat.org',
   *      target: 'footnotediv'
   *    });
   **/

  Popcorn.plugin( "footnote", {

    manifest: {
      about: {
        name: "Popcorn Footnote Plugin",
        version: "0.2",
        author: "@annasob, @rwaldron",
        website: "annasob.wordpress.com"
      },
      options: {
        start: {
          elem: "input",
          type: "number",
          label: "Start"
        },
        end: {
          elem: "input",
          type: "number",
          label: "End"
        },
        text: {
          elem: "input",
          type: "text",
          label: "Text"
        },
        target: "footnote-container"
      }
    },

    _setup: function( options ) {

      var target = Popcorn.dom.find( options.target );

      options._container = document.createElement( "div" );
      options._container.style.display = "none";
      options._container.innerHTML  = options.text;

      target.appendChild( options._container );
    },

    /**
     * @member footnote
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ){
      options._container.style.display = "inline";
    },

    /**
     * @member footnote
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ){
      options._container.style.display = "none";
    },

    _teardown: function( options ) {
      var target = Popcorn.dom.find( options.target );
      if ( target ) {
        target.removeChild( options._container );
      }
    }

  });
})( Popcorn );
/**
 * The Popcorn._MediaElementProto object is meant to be used as a base
 * prototype for HTML*VideoElement and HTML*AudioElement wrappers.
 * MediaElementProto requires that users provide:
 *   - parentNode: the element owning the media div/iframe
 *   - _eventNamespace: the unique namespace for all events
 */
(function( Popcorn, document ) {

  /*********************************************************************************
   * parseUri 1.2.2
   * http://blog.stevenlevithan.com/archives/parseuri
   * (c) Steven Levithan <stevenlevithan.com>
   * MIT License
   */
  function parseUri (str) {
    var	o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });

    return uri;
  }

  parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
      name:   "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
  /*********************************************************************************/

  // Fake a TimeRanges object
  var _fakeTimeRanges = {
    length: 0,
    start: Popcorn.nop,
    end: Popcorn.nop
  };

  // Make sure the browser has MediaError
  window.MediaError = window.MediaError || (function() {
    function MediaError(code, msg) {
      this.code = code || null;
      this.message = msg || "";
    }
    MediaError.MEDIA_ERR_NONE_ACTIVE    = 0;
    MediaError.MEDIA_ERR_ABORTED        = 1;
    MediaError.MEDIA_ERR_NETWORK        = 2;
    MediaError.MEDIA_ERR_DECODE         = 3;
    MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;

    return MediaError;
  }());


  function MediaElementProto() {
    var protoElement = {},
        events = {},
        parentNode;
    if ( !Object.prototype.__defineGetter__ ) {
      protoElement = document.createElement( "div" );
    }
    protoElement._util = {
      // Each wrapper stamps a type.
      type: "HTML5",

      // How often to trigger timeupdate events
      TIMEUPDATE_MS: 250,

      // Standard width and height
      MIN_WIDTH: 300,
      MIN_HEIGHT: 150,

      // Check for attribute being set or value being set in JS.  The following are true:
      //   autoplay
      //   autoplay="true"
      //   v.autoplay=true;
      isAttributeSet: function( value ) {
        return ( typeof value === "string" || value === true );
      },

      parseUri: parseUri
    };
    // Mimic DOM events with custom, namespaced events on the document.
    // Each media element using this prototype needs to provide a unique
    // namespace for all its events via _eventNamespace.
    protoElement.addEventListener = function( type, listener, useCapture ) {
      document.addEventListener( this._eventNamespace + type, listener, useCapture );
    };

    protoElement.removeEventListener = function( type, listener, useCapture ) {
      document.removeEventListener( this._eventNamespace + type, listener, useCapture );
    };

    protoElement.dispatchEvent = function( name ) {
      var customEvent = document.createEvent( "CustomEvent" ),
        detail = {
          type: name,
          target: this.parentNode,
          data: null
        };

      customEvent.initCustomEvent( this._eventNamespace + name, false, false, detail );
      document.dispatchEvent( customEvent );
    };

    protoElement.load = Popcorn.nop;

    protoElement.canPlayType = function( url ) {
      return "";
    };

    // Popcorn expects getBoundingClientRect to exist, forward to parent node.
    protoElement.getBoundingClientRect = function() {
      return parentNode.getBoundingClientRect();
    };

    protoElement.NETWORK_EMPTY = 0;
    protoElement.NETWORK_IDLE = 1;
    protoElement.NETWORK_LOADING = 2;
    protoElement.NETWORK_NO_SOURCE = 3;

    protoElement.HAVE_NOTHING = 0;
    protoElement.HAVE_METADATA = 1;
    protoElement.HAVE_CURRENT_DATA = 2;
    protoElement.HAVE_FUTURE_DATA = 3;
    protoElement.HAVE_ENOUGH_DATA = 4;
    Object.defineProperties( protoElement, {

      currentSrc: {
        get: function() {
          return this.src !== undefined ? this.src : "";
        },
        configurable: true
      },

      parentNode: {
        get: function() {
          return parentNode;
        },
        set: function( val ) {
          parentNode = val;
        },
        configurable: true
      },
      
      // We really can't do much more than "auto" with most of these.
      preload: {
        get: function() {
          return "auto";
        },
        set: Popcorn.nop,
        configurable: true
      },

      controls: {
        get: function() {
          return true;
        },
        set: Popcorn.nop,
        configurable: true
      },

      // TODO: it would be good to overlay an <img> using this URL
      poster: {
        get: function() {
          return "";
        },
        set: Popcorn.nop,
        configurable: true
      },

      crossorigin: {
        get: function() {
          return "";
        },
        configurable: true
      },

      played: {
        get: function() {
          return _fakeTimeRanges;
        },
        configurable: true
      },

      seekable: {
        get: function() {
          return _fakeTimeRanges;
        },
        configurable: true
      },

      buffered: {
        get: function() {
          return _fakeTimeRanges;
        },
        configurable: true
      },

      defaultMuted: {
        get: function() {
          return false;
        },
        configurable: true
      },

      defaultPlaybackRate: {
        get: function() {
          return 1.0;
        },
        configurable: true
      },

      style: {
        get: function() {
          return this.parentNode.style;
        },
        configurable: true
      },

      id: {
        get: function() {
          return this.parentNode.id;
        },
        configurable: true
      }

      // TODO:
      //   initialTime
      //   playbackRate
      //   startOffsetTime

     });
    return protoElement;
  }

  Popcorn._MediaElementProto = MediaElementProto;

}( Popcorn, window.document ));
(function( Popcorn, window, document ) {

  var

  CURRENT_TIME_MONITOR_MS = 10,
  EMPTY_STRING = "",

  // Example: http://www.youtube.com/watch?v=12345678901
  regexYouTube = /^.*(?:\/|v=)(.{11})/,

  ABS = Math.abs,

  // Setup for YouTube API
  ytReady = false,
  ytLoading = false,
  ytCallbacks = [];

  function onYouTubeIframeAPIReady() {
    var callback;
    if ( YT.loaded ) {
      ytReady = true;
      while( ytCallbacks.length ) {
        callback = ytCallbacks.shift();
        callback();
      }
    } else {
      setTimeout( onYouTubeIframeAPIReady, 250 );
    }
  }

  function isYouTubeReady() {
    var script;
    // If we area already waiting, do nothing.
    if( !ytLoading ) {
      // If script is already there, check if it is loaded.
      if ( window.YT ) {
        onYouTubeIframeAPIReady();
      } else {
        script = document.createElement( "script" );
        script.addEventListener( "load", onYouTubeIframeAPIReady, false);
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild( script );
      }
      ytLoading = true;
    }
    return ytReady;
  }

  function addYouTubeCallback( callback ) {
    ytCallbacks.push( callback );
  }

  function HTMLYouTubeVideoElement( id ) {

    // YouTube iframe API requires postMessage
    if( !window.postMessage ) {
      throw "ERROR: HTMLYouTubeVideoElement requires window.postMessage";
    }

    var self = new Popcorn._MediaElementProto(),
      parent = typeof id === "string" ? document.querySelector( id ) : id,
      elem = document.createElement( "div" ),
      impl = {
        src: EMPTY_STRING,
        networkState: self.NETWORK_EMPTY,
        readyState: self.HAVE_NOTHING,
        seeking: false,
        autoplay: EMPTY_STRING,
        preload: EMPTY_STRING,
        controls: false,
        loop: false,
        poster: EMPTY_STRING,
        volume: 1,
        muted: false,
        currentTime: 0,
        duration: NaN,
        ended: false,
        paused: true,
        error: null
      },
      playerReady = false,
      mediaReady = false,
      loopedPlay = false,
      player,
      playerPaused = true,
      mediaReadyCallbacks = [],
      playerState = -1,
      bufferedInterval,
      lastLoadedFraction = 0,
      currentTimeInterval,
      timeUpdateInterval;

    // Namespace all events we'll produce
    self._eventNamespace = Popcorn.guid( "HTMLYouTubeVideoElement::" );

    self.parentNode = parent;

    // Mark this as YouTube
    self._util.type = "YouTube";

    function addMediaReadyCallback( callback ) {
      mediaReadyCallbacks.push( callback );
    }

    function catchRoguePlayEvent() {
      player.pauseVideo();
      removeYouTubeEvent( "play", catchRoguePlayEvent );
      addYouTubeEvent( "play", onPlay );
    }

    function catchRoguePauseEvent() {
      addYouTubeEvent( "pause", onPause );
      removeYouTubeEvent( "pause", catchRoguePauseEvent );
    }

    function onPlayerReady( event ) {

      var onMuted = function() {
        if ( player.isMuted() ) {
          // force an initial play on the video, to remove autostart on initial seekTo.
          addYouTubeEvent( "play", onFirstPlay );
          player.playVideo();
        } else {
          setTimeout( onMuted, 0 );
        }
      };
      playerReady = true;
      // XXX: this should really live in cued below, but doesn't work.

      // Browsers using flash will have the pause() call take too long and cause some
      // sound to leak out. Muting before to prevent this.
      player.mute();

      // ensure we are muted.
      onMuted();
    }

    function onPlayerError(event) {
      // There's no perfect mapping to HTML5 errors from YouTube errors.
      var err = { name: "MediaError" };

      switch( event.data ) {

        // invalid parameter
        case 2:
          err.message = "Invalid video parameter.";
          err.code = MediaError.MEDIA_ERR_ABORTED;
          break;

        // HTML5 Error
        case 5:
          err.message = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
          err.code = MediaError.MEDIA_ERR_DECODE;

        // requested video not found
        case 100:
          err.message = "Video not found.";
          err.code = MediaError.MEDIA_ERR_NETWORK;
          break;

        // video can't be embedded by request of owner
        case 101:
        case 150:
          err.message = "Video not usable.";
          err.code = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;
          break;

        default:
          err.message = "Unknown error.";
          err.code = 5;
      }

      impl.error = err;
      self.dispatchEvent( "error" );
    }

    function onReady() {

      addYouTubeEvent( "play", onPlay );
      addYouTubeEvent( "pause", onPause );
      // Set initial paused state
      if( impl.autoplay || !impl.paused ) {
        removeYouTubeEvent( "play", onReady );
        impl.paused = false;
        addMediaReadyCallback(function() {
          if ( !impl.paused ) {
            onPlay();
          }
        });
      }

      // Ensure video will now be unmuted when playing due to the mute on initial load.
      if( !impl.muted ) {
        player.unMute();
      }

      impl.readyState = self.HAVE_METADATA;
      self.dispatchEvent( "loadedmetadata" );
      currentTimeInterval = setInterval( monitorCurrentTime,
                                         CURRENT_TIME_MONITOR_MS );

      self.dispatchEvent( "loadeddata" );

      impl.readyState = self.HAVE_FUTURE_DATA;
      self.dispatchEvent( "canplay" );

      mediaReady = true;
      bufferedInterval = setInterval( monitorBuffered, 50 );

      while( mediaReadyCallbacks.length ) {
        mediaReadyCallbacks[ 0 ]();
        mediaReadyCallbacks.shift();
      }

      // We can't easily determine canplaythrough, but will send anyway.
      impl.readyState = self.HAVE_ENOUGH_DATA;
      self.dispatchEvent( "canplaythrough" );
    }

    function onFirstPause() {
      removeYouTubeEvent( "pause", onFirstPause );
      if ( player.getCurrentTime() > 0 ) {
        setTimeout( onFirstPause, 0 );
        return;
      }

      if( impl.autoplay || !impl.paused ) {
        addYouTubeEvent( "play", onReady );
        player.playVideo();
      } else {
        onReady();
      }
    }

    // This function needs duration and first play to be ready.
    function onFirstPlay() {
      removeYouTubeEvent( "play", onFirstPlay );
      if ( player.getCurrentTime() === 0 ) {
        setTimeout( onFirstPlay, 0 );
        return;
      }
      addYouTubeEvent( "pause", onFirstPause );
      player.seekTo( 0 );
      player.pauseVideo();
    }

    function addYouTubeEvent( event, listener ) {
      self.addEventListener( "youtube-" + event, listener, false );
    }
    function removeYouTubeEvent( event, listener ) {
      self.removeEventListener( "youtube-" + event, listener, false );
    }
    function dispatchYouTubeEvent( event ) {
      self.dispatchEvent( "youtube-" + event );
    }

    function onBuffering() {
      impl.networkState = self.NETWORK_LOADING;
      var newDuration = player.getDuration();
      if (impl.duration !== newDuration) {
        impl.duration = newDuration;
        self.dispatchEvent( "durationchange" );
      }
      self.dispatchEvent( "waiting" );
    }

    addYouTubeEvent( "buffering", onBuffering );
    addYouTubeEvent( "ended", onEnded );

    function onPlayerStateChange( event ) {

      switch( event.data ) {

        // ended
        case YT.PlayerState.ENDED:
          dispatchYouTubeEvent( "ended" );
          break;

        // playing
        case YT.PlayerState.PLAYING:
          dispatchYouTubeEvent( "play" );
          break;

        // paused
        case YT.PlayerState.PAUSED:
          // Youtube fires a paused event before an ended event.
          // We have no need for this.
          if ( player.getDuration() !== player.getCurrentTime() ) {
            dispatchYouTubeEvent( "pause" );
          }
          break;

        // buffering
        case YT.PlayerState.BUFFERING:
          dispatchYouTubeEvent( "buffering" );
          break;

        // video cued
        case YT.PlayerState.CUED:
          // XXX: cued doesn't seem to fire reliably, bug in youtube api?
          break;
      }

      if ( event.data !== YT.PlayerState.BUFFERING &&
           playerState === YT.PlayerState.BUFFERING ) {
        onProgress();
      }

      playerState = event.data;
    }

    function destroyPlayer() {
      if( !( playerReady && player ) ) {
        return;
      }

      removeYouTubeEvent( "buffering", onBuffering );
      removeYouTubeEvent( "ended", onEnded );
      removeYouTubeEvent( "play", onPlay );
      removeYouTubeEvent( "pause", onPause );
      onPause();
      mediaReady = false;
      loopedPlay = false;
      impl.currentTime = 0;
      mediaReadyCallbacks = [];
      clearInterval( currentTimeInterval );
      clearInterval( bufferedInterval );
      player.stopVideo();
      player.clearVideo();
      player.destroy();
      elem = document.createElement( "div" );
    }

    function changeSrc( aSrc ) {
      if( !self._canPlaySrc( aSrc ) ) {
        impl.error = {
          name: "MediaError",
          message: "Media Source Not Supported",
          code: MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
        };
        self.dispatchEvent( "error" );
        return;
      }

      impl.src = aSrc;

      // Make sure YouTube is ready, and if not, register a callback
      if( !isYouTubeReady() ) {
        addYouTubeCallback( function() { changeSrc( aSrc ); } );
        return;
      }

      if( playerReady ) {
        if( mediaReady ) {
          destroyPlayer();
        } else {
          addMediaReadyCallback( function() {
            changeSrc( aSrc );
          });
          return;
        }
      }

      parent.appendChild( elem );

      // Use any player vars passed on the URL
      var playerVars = self._util.parseUri( aSrc ).queryKey;

      // Remove the video id, since we don't want to pass it
      delete playerVars.v;

      // Sync autoplay, but manage internally
      impl.autoplay = playerVars.autoplay === "1" || impl.autoplay;
      delete playerVars.autoplay;

      // Sync loop, but manage internally
      impl.loop = playerVars.loop === "1" || impl.loop;
      delete playerVars.loop;

      // Don't show related videos when ending
      playerVars.rel = playerVars.rel || 0;

      // Don't show YouTube's branding
      playerVars.modestbranding = playerVars.modestbranding || 1;

      // Don't show annotations by default
      playerVars.iv_load_policy = playerVars.iv_load_policy || 3;

      // Disable keyboard controls by default
      playerVars.disablekb = playerVars.disablekb || 1;

      // Don't show video info before playing
      playerVars.showinfo = playerVars.showinfo || 0;

      // Specify our domain as origin for iframe security
      var domain = window.location.protocol === "file:" ? "*" :
      window.location.protocol + "//" + window.location.host;
      playerVars.origin = playerVars.origin || domain;

      // Show/hide controls. Sync with impl.controls and prefer URL value.
      // @rauldiazpoblete Force controls value to 0 
      // from http://stackoverflow.com/questions/23362923/controls-in-url-0-htmlyoutubevideoelement-popcorn-js-1-5-6
      playerVars.controls = playerVars.controls || 0;
      //playerVars.controls = playerVars.controls || impl.controls ? 2 : 0;
      impl.controls = playerVars.controls;

      // Set wmode to transparent to show video overlays
      playerVars.wmode = playerVars.wmode || "opaque";

      if ( playerVars.html5 !== 0 ) {
        playerVars.html5 = 1;
      }

      // Get video ID out of youtube url
      aSrc = regexYouTube.exec( aSrc )[ 1 ];

      player = new YT.Player( elem, {
        width: "100%",
        height: "100%",
        wmode: playerVars.wmode,
        videoId: aSrc,
        playerVars: playerVars,
        events: {
          'onReady': onPlayerReady,
          'onError': onPlayerError,
          'onStateChange': onPlayerStateChange
        }
      });

      impl.networkState = self.NETWORK_LOADING;
      self.dispatchEvent( "loadstart" );
      self.dispatchEvent( "progress" );
    }

    function monitorCurrentTime() {
      var playerTime = player.getCurrentTime();
      if ( !impl.seeking ) {
        if ( ABS( impl.currentTime - playerTime ) > CURRENT_TIME_MONITOR_MS ) {
          onSeeking();
          onSeeked();
        }
        impl.currentTime = playerTime;
      } else if ( ABS( playerTime - impl.currentTime ) < 1 ) {
        onSeeked();
      }
    }

    function monitorBuffered() {
      var fraction = player.getVideoLoadedFraction();

      if ( fraction && lastLoadedFraction !== fraction ) {
        lastLoadedFraction = fraction;
        onProgress();
      }
    }

    function changeCurrentTime( aTime ) {
      if ( aTime === impl.currentTime ) {
        return;
      }
      impl.currentTime = aTime;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {

          onSeeking();
          player.seekTo( aTime );
        });
        return;
      }

      onSeeking();
      player.seekTo( aTime );
    }

    function onTimeUpdate() {
      self.dispatchEvent( "timeupdate" );
    }

    function onSeeking() {
      // a seek in youtube fires a paused event.
      // we don't want to listen for this, so this state catches the event.
      addYouTubeEvent( "pause", catchRoguePauseEvent );
      removeYouTubeEvent( "pause", onPause );
      impl.seeking = true;
      self.dispatchEvent( "seeking" );
    }

    function onSeeked() {
      impl.ended = false;
      impl.seeking = false;
      self.dispatchEvent( "timeupdate" );
      self.dispatchEvent( "seeked" );
      self.dispatchEvent( "canplay" );
      self.dispatchEvent( "canplaythrough" );
    }

    function onPlay() {
      if( impl.ended ) {
        changeCurrentTime( 0 );
        impl.ended = false;
      }
      timeUpdateInterval = setInterval( onTimeUpdate,
                                        self._util.TIMEUPDATE_MS );
      impl.paused = false;
      if( playerPaused ) {
        playerPaused = false;

        // Only 1 play when video.loop=true
        if ( ( impl.loop && !loopedPlay ) || !impl.loop ) {
          loopedPlay = true;
          self.dispatchEvent( "play" );
        }
        self.dispatchEvent( "playing" );
      }
    }

    function onProgress() {
      self.dispatchEvent( "progress" );
    }

    self.play = function() {
      impl.paused = false;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {
          self.play();
        });
        return;
      }
      player.playVideo();
    };

    function onPause() {
      impl.paused = true;
      if ( !playerPaused ) {
        playerPaused = true;
        clearInterval( timeUpdateInterval );
        self.dispatchEvent( "pause" );
      }
    }

    self.pause = function() {
      impl.paused = true;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {
          self.pause();
        });
        return;
      }
      // if a pause happens while seeking, ensure we catch it.
      // in youtube seeks fire pause events, and we don't want to listen to that.
      // except for the case of an actual pause.
      catchRoguePauseEvent();
      player.pauseVideo();
    };

    function onEnded() {
      if( impl.loop ) {
        changeCurrentTime( 0 );
        self.play();
      } else {
        impl.ended = true;
        onPause();
        // YouTube will fire a Playing State change after the video has ended, causing it to loop.
        addYouTubeEvent( "play", catchRoguePlayEvent );
        removeYouTubeEvent( "play", onPlay );
        self.dispatchEvent( "timeupdate" );
        self.dispatchEvent( "ended" );
      }
    }

    function setMuted( aValue ) {
      impl.muted = aValue;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {
          setMuted( impl.muted );
        });
        return;
      }
      player[ aValue ? "mute" : "unMute" ]();
      self.dispatchEvent( "volumechange" );
    }

    function getMuted() {
      // YouTube has isMuted(), but for sync access we use impl.muted
      return impl.muted;
    }

    Object.defineProperties( self, {

      src: {
        get: function() {
          return impl.src;
        },
        set: function( aSrc ) {
          if( aSrc && aSrc !== impl.src ) {
            changeSrc( aSrc );
          }
        }
      },

      autoplay: {
        get: function() {
          return impl.autoplay;
        },
        set: function( aValue ) {
          impl.autoplay = self._util.isAttributeSet( aValue );
        }
      },

      loop: {
        get: function() {
          return impl.loop;
        },
        set: function( aValue ) {
          impl.loop = self._util.isAttributeSet( aValue );
        }
      },

      width: {
        get: function() {
          return self.parentNode.offsetWidth;
        }
      },

      height: {
        get: function() {
          return self.parentNode.offsetHeight;
        }
      },

      currentTime: {
        get: function() {
          return impl.currentTime;
        },
        set: function( aValue ) {
          changeCurrentTime( aValue );
        }
      },

      duration: {
        get: function() {
          return impl.duration;
        }
      },

      ended: {
        get: function() {
          return impl.ended;
        }
      },

      paused: {
        get: function() {
          return impl.paused;
        }
      },

      seeking: {
        get: function() {
          return impl.seeking;
        }
      },

      readyState: {
        get: function() {
          return impl.readyState;
        }
      },

      networkState: {
        get: function() {
          return impl.networkState;
        }
      },

      volume: {
        get: function() {
          return impl.volume;
        },
        set: function( aValue ) {
          if( aValue < 0 || aValue > 1 ) {
            throw "Volume value must be between 0.0 and 1.0";
          }
          impl.volume = aValue;
          if( !mediaReady ) {
            addMediaReadyCallback( function() {
              self.volume = aValue;
            });
            return;
          }
          player.setVolume( impl.volume * 100 );
          self.dispatchEvent( "volumechange" );
        }
      },

      muted: {
        get: function() {
          return getMuted();
        },
        set: function( aValue ) {
          setMuted( self._util.isAttributeSet( aValue ) );
        }
      },

      error: {
        get: function() {
          return impl.error;
        }
      },

      buffered: {
        get: function () {
          var timeRanges = {
            start: function( index ) {
              if ( index === 0 ) {
                return 0;
              }

              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            },
            end: function( index ) {
              if ( index === 0 ) {
                if ( !impl.duration ) {
                  return 0;
                }

                return impl.duration * lastLoadedFraction;
              }

              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            },
            length: 1
          };

          return timeRanges;
        },
        configurable: true
      }
    });

    self._canPlaySrc = Popcorn.HTMLYouTubeVideoElement._canPlaySrc;
    self.canPlayType = Popcorn.HTMLYouTubeVideoElement.canPlayType;

    return self;
  }

  Popcorn.HTMLYouTubeVideoElement = function( id ) {
    return new HTMLYouTubeVideoElement( id );
  };

  // Helper for identifying URLs we know how to play.
  Popcorn.HTMLYouTubeVideoElement._canPlaySrc = function( url ) {
    return (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu).*(?:\/|v=)(.{11})/).test( url ) ?
      "probably" :
      EMPTY_STRING;
  };

  // We'll attempt to support a mime type of video/x-youtube
  Popcorn.HTMLYouTubeVideoElement.canPlayType = function( type ) {
    return type === "video/x-youtube" ? "probably" : EMPTY_STRING;
  };

}( Popcorn, window, document ));


var BarGraph = function( _id, _source ) {

  var $ = jQuery.noConflict();

  var that = this;

  that.id      = _id;
  that.source  = _source;

  that.margin = {top: 0, right: 0, bottom: 20, left: 0};
  that.aspectRatio = 0.5625;
  that.markerValue = null;

  // Public Methods

  that.init = function() {

    console.log('Bar Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    that.x = d3.scaleBand()
      .range([0, that.width])
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)
    .append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');

    // Load CSV
    d3.csv( that.source, function(error, data) {

      data.forEach(function(d) {
        d.value = +d.value;
      });

      that.x.domain(data.map(function(d) { return d.label; }));
      that.y.domain([0, d3.max(data, function(d) { return d.value; })]);

      that.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + that.height + ')')
        .call(d3.axisBottom(that.x));

      if (that.markerValue) {

        that.svg.append('line')
          .attr('class', 'marker')
          .attr("x1", 0)
          .attr("y1", function(d) { return that.y(that.markerValue); })
          .attr("x2", that.width)
          .attr("y2", function(d) { return that.y(that.markerValue); });

        that.svg.append('g')
          .attr('class', 'marker-label')
          .append('text')
          .attr('x', that.width )
          .attr('y', function(d) { return that.y(that.markerValue); })
          .attr('dy', '1em' )
          .style('text-anchor', 'end')
          .text( that.txt[that.lang] );
      }

      that.svg.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('id', function(d) { return d.label; })
        .attr('x', function(d) { return that.x(d.label); })
        .attr('y', function(d) { return that.y(d.value); } )
        .attr('height', function(d) { return that.height - that.y(d.value); })
        .attr('width', that.x.bandwidth());

      that.svg.selectAll('.bar-label')
        .data(data)
      .enter().append('text')
        .attr('class', 'bar-label')
        .attr('id', function(d) { return d.label; })
        .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
        .attr('y', function(d) { return that.y(d.value); })
        .attr('dy', '1.5em')
        .text( function(d){ return parseInt(d.value); });

       // d3.selectAll('.bar')
       //  .transition().duration(800).delay( function(d,i){ return 100*i; })
       //  .attr('id', function(d) { return d.label; })
       //  .attr('y', function(d) { return that.y(d.value); })
       //  .attr('height', function(d) { return height - that.y(d.value); });

      // d3.select('.marker')
      //   .transition().duration(600).delay(1500)
      //   .attr('x2', width );
    });

    return that;
  };

  that.onResize = function() {

    that.getDimensions();
    that.updateData();

    return that;
  };

  that.updateData = function(){

    that.svg
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);

    that.x.range([0, that.width]);
    that.y.range([that.height, 0]);

    that.svg.select('g.x.axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(d3.axisBottom(that.x));

    that.svg.selectAll('.bar')
      .attr('x', function(d) { return that.x(d.label); })
      .attr('y', function(d) { return that.y(d.value); })
      .attr('width', that.x.bandwidth())
      .attr('height', function(d) { return that.height - that.y(d.value); });

    that.svg.selectAll('.bar-label')
      .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
      .attr('y', function(d) { return that.y(d.value); });

    if (that.markerValue) {

      that.svg.select('.marker-label text')
        .attr('x', that.width )
        .attr('y', function(d) { return that.y(that.markerValue); });

      that.svg.select('.marker')
        .attr("y1", function(d) { return that.y(that.markerValue); })
        .attr("y2", function(d) { return that.y(that.markerValue); })
        .attr('x2', that.width );
    }
  };

  that.getDimensions = function(){

    that.widthCont = that.$el.width();
    that.heightCont = that.widthCont * that.aspectRatio;

    that.width = that.widthCont - that.margin.left - that.margin.right;
    that.height = that.heightCont - that.margin.top - that.margin.bottom;
  };

  // that.updateBar = function(selection){
  //   selection
  //     .attr('x', function(d) { return that.x(d.label); })
  //     .attr('y', function(d) { return that.y(d.value); })
  //     .attr('width', that.x.bandwidth())
  //     .attr('height', function(d) { return height - that.y(d.value); });

  //   return that;
  // };

  return that;
};
var LineGraph = function( _id, _source ) {

  var $ = jQuery.noConflict();

  var that = this,
      data, currentData;

  that.id      = _id;
  that.source  = _source;

  that.margin = {top: 0, right: 15, bottom: 20, left: 15};
  that.aspectRatio = 0.5625;
  that.markerValue = null;
  that.activeLines = [];

  // Public Methods

  that.init = function() {

    console.log('Line Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    // Setup scales
    that.x = d3.scaleLinear()
      .range([0, that.width]);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    // Setup axis
    that.xAxis = d3.axisBottom(that.x);

    that.yAxis = d3.axisLeft(that.y)
      .tickSize(that.width)
      .tickValues([0, 25, 50, 75, 100]);

    // Setup line
    that.line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(function(d){ return that.x(+d.key); })
      .y(function(d){ return that.y(d.value); });

    // Create svg
    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)
    .append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');

    // Load CSV
    d3.csv(that.source, that.onDataReady);

    return that;
  };

  that.update = function() {
    that.setData();
    that.updateGraph();

    return that;
  };

  that.onDataReady = function(error, _data) {

    that.years = that.getYears(_data);

    data = that.dataParser(_data);

    that.setData();
    that.setGraph();

    return that;
  };

  that.setData = function() {

    // Filter data (that.dataFilter function must be defined outside)
    currentData = (that.dataFilter) ? data.filter(that.dataFilter) : data;

    // Sort data (that.dataSort function must be defined outside)
    if (that.dataSort) {
      currentData = currentData.sort(that.dataSort);
    }
  };

  that.getYears = function(_data) {
    var years = [];
    d3.keys(_data[0]).forEach(function(d){
      if (+d) {
        years.push(+d);
      }
    });
    return years.sort();
  };

  that.dataParser = function(_data) {
    _data.forEach(function(d){
      d.values = {};
      that.years.forEach(function(year){
        if (d[year]) {
          d.values[year] = +d[year];
        } else {
          console.log('No hay datos de para', d.name, 'en ', year);
        }
        delete d[year];
      });
    });
    return _data;
  };

  that.setGraph = function() {
    // Set scales domain
    that.x.domain([that.years[0], that.years[that.years.length-1]]);
    that.y.domain([0, 100]);  // TODO!!! Make this dynamic

    // Draw axis
    that.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(that.xAxis);

    that.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + that.width + ', 0)')
      .call(that.yAxis);

    // Draw lines
    setLines();

    that.svg.append('text')
      .attr('class', 'country-label')
      .attr('x', that.width-10)
      .attr('y', that.height-10)
      .attr('text-anchor', 'end');

    return that;
  };

  that.updateGraph = function() {
    that.svg.select('.lines').remove();
    setLines();

    return that;
  };

  that.onResize = function() {

    that.getDimensions();
    that.updateData();

    return that;
  };

  that.updateData = function(){

    /*
    that.svg
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);

    that.x.range([0, that.width]);
    that.y.range([that.height, 0]);

    that.svg.select('g.x.axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(d3.axisBottom(that.x));

    that.svg.selectAll('.bar')
      .attr('x', function(d) { return that.x(d.label); })
      .attr('y', function(d) { return that.y(d.value); })
      .attr('width', that.x.bandwidth())
      .attr('height', function(d) { return that.height - that.y(d.value); });

    that.svg.selectAll('.bar-label')
      .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
      .attr('y', function(d) { return that.y(d.value); });
    */
  };

  that.getDimensions = function(){

    that.widthCont = that.$el.width();
    that.heightCont = that.widthCont * that.aspectRatio;

    that.width = that.widthCont - that.margin.left - that.margin.right;
    that.height = that.heightCont - that.margin.top - that.margin.bottom;
  };

  /*
  that.addMarker = function() {

    that.svg.append('line')
      .attr('class', 'marker')
      .attr("x1", 0)
      .attr("y1", function(d) { return that.y(that.markerValue); })
      .attr("x2", that.width)
      .attr("y2", function(d) { return that.y(that.markerValue); });

    that.svg.append('g')
      .attr('class', 'marker-label')
      .append('text')
      .attr('x', that.width )
      .attr('y', function(d) { return that.y(that.markerValue); })
      .attr('dy', '1em' )
      .style('text-anchor', 'end')
      .text( that.txt[that.lang] );
  }
  */

  var setLines = function() {
    // Draw lines
    that.svg.append('g')
      .attr('class', 'lines')
    .selectAll('.line')
      .data(currentData)
    .enter().append('g')
      .attr('class', function(d){ return (that.activeLines.indexOf(d.code) === -1) ? 'line' : 'line active'; })
      .attr('id', function(d){ return 'line-'+d.code; })
      .on('mouseover', onLineOver)
      .on('mouseout', onLineOut)
    .append('path')
      .datum(function(d){ return d3.entries(d.values); })
      .attr('d', that.line);
  };

  var onLineOver = function(d){
    d3.select(this).classed('active', true);
    that.svg.select('.country-label').text( d3.select(this).datum().name );
  };

  var onLineOut = function(d){
    d3.select(this).classed('active', function(d){ return (that.activeLines.indexOf(d.code) !== -1); });
    that.svg.select('.country-label').text('');
  };

  return that;
};
function patents_graph( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var $el = $(id);
  var lang = $el.data('lang');
  var txt = {
    'es': 'Se aprueba la licencia obligatoria',
    'en': 'Compulsory license is approved'
  };
  var markerValue = 2007;

  var margin = {top: 20, right: 0, bottom: 20, left: 0},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  var svg,
      x, y,
      xAxis,
      line;


  // Public Methods

  that.init = function() {

    //console.log('init patents graph');

    widthCont = $el.width();
    heightCont = widthCont*0.5625;

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    x = d3.scaleBand()
      .range([0, width])
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    y = d3.scaleLinear()
      .range([height, 0]);

    xAxis = d3.axisBottom()
      .scale(x);

    line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.patents); });

    svg = d3.select(id).append('svg')
      .attr('id', 'patents-graph-svg')
      .attr('width', widthCont)
      .attr('height', heightCont)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Load CSV
    d3.csv( $('body').data('baseurl')+'/assets/data/patents.csv', function(error, data) {

      data.forEach(function(d) {
        d.patents = +d.patents;
      });

      x.domain(data.map(function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.patents; })]);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      svg.append('line')
        .attr('class', 'marker')
        .attr("x1", function(d) { return x(markerValue); })
        .attr("y1", height)
        .attr("x2", function(d) { return x(markerValue); })
        .attr("y2", height);

      svg.append('g')
        .attr('class', 'marker-label')
        .append('text')
        .attr('x', function(d) { return x(markerValue); })
        .text( txt[lang] );

      svg.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date); })
        .attr('y', height )
        .attr('height', 0)
        .attr('width', x.bandwidth());

      svg.selectAll('.bar-label')
        .data(data)
      .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', function(d) { return x(d.date)+(x.bandwidth()*0.5); })
        .attr('y', function(d) { return y(d.patents); })
        .attr('dy', '1.5em')
        .text( function(d){ return d.patents; });

       d3.selectAll('.bar')
        .transition().duration(800).delay( function(d,i){ return 100*i; })
        .attr('y', function(d) { return y(d.patents); })
        .attr('height', function(d) { return height - y(d.patents); });

       d3.select('.marker')
        .transition().duration(600).delay(1500)
        .attr('y1', 0 );
    });

    return that;
  };

  that.onResize = function() {

    widthCont = $el.width();
    heightCont = widthCont*0.5625;

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    updateData();

    return that;
  };

  var updateData = function(){

    d3.select('#patents-graph-svg')
      .attr('width', widthCont)
      .attr('height', heightCont);

    x.range([0, width]);
    y.range([height, 0]);

    d3.select('g.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    d3.select('.marker-label text').attr('x', function(d) { return x(markerValue); });

    d3.selectAll('.bar')
      .attr('x', function(d) { return x(d.date); })
      .attr('y', function(d) { return y(d.patents); })
      .attr('width', x.bandwidth())
      .attr('height', function(d) { return height - y(d.patents); });

    d3.selectAll('.bar-label')
      .attr('x', function(d) { return x(d.date)+(x.bandwidth()*0.5); })
      .attr('y', function(d) { return y(d.patents); });

    d3.select('.marker')
      .attr("x1", function(d) { return x(markerValue); })
      .attr("x2", function(d) { return x(markerValue); })
      .attr('y2', height );
  };

  return that;
}

var VaccineDiseaseGraph = function( _id ) {

  var $ = jQuery.noConflict();

  var Y_AXIS_WIDTH = 100; // Must be the ame value than #vaccine-disease-graph $padding-left scss variable

  var that = this,
      id = _id,
      disease,
      sort,
      lang,
      data,
      dataPopulation,
      currentData,
      cellData,
      countries,
      years,
      cellSize,
      container,
      x, y,
      width, height,
      $el,
      $tooltip;


  // Public Methods

  that.init = function( _disease, _sort ) {

    disease = _disease;
    sort = _sort;

    //console.log('Vaccine Graph init', id, disease, sort);

    $el      = $('#'+id);
    $tooltip = $el.find('.tooltip');
    lang     = $el.data('lang');

    x = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    y = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    color = d3.scaleSequential(d3.interpolateOrRd);

    if (data) {
      clear();
      setupData();
      setupGraph();
    } else {
      // Load CSVs
      d3.queue()
        .defer(d3.csv, $('body').data('baseurl')+'/assets/data/diseases-cases.csv')
        .defer(d3.csv, $('body').data('baseurl')+'/assets/data/population.csv')
        .await( onDataReady );
    }

    return that;
  };

  that.onResize = function() {
    getDimensions();
    if (data) updateGraph();
    return that;
  };

  var onDataReady = function(error, data_csv, population_csv) {

    data = data_csv;
    dataPopulation = population_csv;

    // we don't need the columns attribute
    delete data.columns;

    // We can define a filter function to show only some selected countries
    if (that.filter) {
      data = data.filter(that.filter);
    }

    data.forEach(function(d){
      d.disease = d.disease.toLowerCase();
      if (d.year_introduction) {
        d.year_introduction = +d.year_introduction.replace('prior to', '');
      }
     
      d.cases = {};
      d.values = {};

      // set value es cases /1000 habitants
      var populationItem = population_csv.filter(function(country){ return country.code === d.code; });
      if (populationItem.length > 0) {
        for(var year=1980; year<2016; year++){
          if (d[year]) {
            var population = +populationItem[0][year];
            if (population !== 0) {
              //d[year] = 1000 * (+d[year] / population);
              d.cases[year] = +d[year];
              d.values[year] = 1000 * (+d[year] / population);
            } else {
              //d[year] = null;
              //console.log('No hay datos de población para', d.name, 'en ', year, d[year]);
            }
          } else{
            //d[year] = null;
            //console.log('No hay datos de casos de ' + d.disease + ' para', d.name, 'en ', year, ':', d[year], typeof d[year]);
          }
          delete d[year];
        }
      } else {
        console.log('No hay datos de población para', d.name);
      }

      // Get total cases by country & disease
      d.total = d3.values(d.values).reduce(function(a,b){return a + b;}, 0);
    });

    setupData();
    setupGraph();
  };

  var setupData = function() {

    // Filter data based on selected disease
    currentData = data.filter(function(d){ return d.disease === disease && d3.values(d.values).length > 0; });

    // Sort data
    if (sort === 'year'){
      currentData.sort(function(a,b){ return (isNaN(a.year_introduction)) ? 1 : (isNaN(b.year_introduction)) ? -1 : b.year_introduction-a.year_introduction; });
    } else if (sort === 'cases'){
      currentData.sort(function(a,b){ return b.total-a.total; });
    }

    // Get array of country names
    countries = currentData.map(function(d){ return d.code; });

    // Get array of years
    var minYear = d3.min(currentData, function(d){ return d3.min(d3.keys(d.values)); });
    var maxYear = d3.max(currentData, function(d){ return d3.max(d3.keys(d.values)); });
    years = d3.range(minYear, maxYear, 1);
    years.push(+maxYear);

    //console.log(minYear, maxYear, years);
    //console.log(countries);

    // Get array of data values
    cellsData = [];
    currentData.forEach(function(d){
      for (var value in d.values){
        cellsData.push({
          country: d.code,
          name: d.name,
          year: value,
          cases: d.cases[value],
          value: d.values[value]
        });
      }
    });

    /*
    currentData.forEach(function(d){
      var counter = 0;
      years.forEach(function(year){
        if (d[year])
          counter++;
      });
      if(counter <= 20) // years.length/2)
        console.log(d.name + ' has only values for ' + counter + ' years');
    });
    */
  };

  var setupGraph = function() {

    // Get dimensions (height is based on countries length)
    getDimensions();

    x.domain(years).range([0, width]);

    y.domain(countries).range([0, height]);

    //color.domain([d3.max(cellsData, function(d){ return d.value; }), 0]);
    color.domain([0, 4]);

    //console.log('Maximum cases value: '+ d3.max(cellsData, function(d){ return d.value; }));

    // Add svg
    container = d3.select('#'+id+' .graph-container')
      .style('height', height+'px');

    // Draw cells
    container.append('div')
      .attr('class', 'cell-container')
      .style('height', height+'px')
      .selectAll('.cell')
      .data(cellsData)
    .enter().append('div')
      .attr('class', 'cell')
      .style('background', function(d){ return color(d.value); })
      .call(setCellDimensions)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    // Draw years x axis
    container.append('div')
      .attr('class', 'x-axis axis')
      .selectAll('.axis-item')
      .data(years.filter(function(d){ return d%5===0; }))
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('left', function(d){ return x(d)+'px'; })
      .html(function(d){ return d; });

    // Draw countries y axis
    container.append('div')
      .attr('class', 'y-axis axis')
      .selectAll('.axis-item')
      .data(countries)
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('top', function(d){ return y(d)+'px'; })
      .html(function(d){ return getCountryName(d); });

    // Draw year introduction mark
    container.select('.cell-container')
      .selectAll('.marker')
      .data(currentData
        .map(function(d){ return {code: d.code, year: d.year_introduction}; })
        .filter(function(d){ return !isNaN(d.year); }))
    .enter().append('div')
      .attr('class', 'marker')
      .call(setMarkerDimensions);
  };

  var updateGraph = function() {
    // Update scales
    x.range([0, width]);
    y.range([0, height]);

    container.style('height', height+'px');

    container.select('.cell-container')
      .style('height', height+'px');
      
    container.selectAll('.cell')
      .call(setCellDimensions);

    container.select('.x-axis').selectAll('.axis-item')
      .style('left', function(d){ return x(d)+'px'; });
    container.select('.y-axis').selectAll('.axis-item')
      .style('top', function(d){ return y(d)+'px'; });

    container.select('.cell-container').selectAll('.marker')
      .call(setMarkerDimensions);
  };

  var clear = function() {
    container.select('.cell-container').remove();
    container.selectAll('.axis').remove();
  };

  var setCellDimensions = function(selection) {
    selection
      .style('left', function(d){ return x(d.year)+'px'; })
      .style('top', function(d){ return y(d.country)+'px'; } )
      .style('width', x.bandwidth()+'px')
      .style('height', y.bandwidth()+'px');
  };

  var setMarkerDimensions = function(selection) {
    selection
      .style('top', function(d){ return y(d.code)+'px'; })
      .style('left', function(d){
        return (d.year < years[0]) ? (x(years[0])-1)+'px' : (d.year < years[years.length-1]) ? (x(d.year)-1)+'px' : (x.bandwidth()+x(years[years.length-1]))+'px';
      })
      .style('height', y.bandwidth()+'px');
  };

  var onMouseOver = function(d){
    // Set tooltip content
    var cases_str = (lang === 'es') ? 'casos' : 'cases';
    var cases_single_str = (lang === 'es') ? 'caso' : 'case';
    $tooltip.find('.tooltip-inner .country').html(d.name);
    $tooltip.find('.tooltip-inner .year').html(d.year);
    $tooltip.find('.tooltip-inner .value').html( formatDecimal(d.value, lang) );
    $tooltip.find('.tooltip-inner .cases').html( (d.cases !== 1) ? d.cases.toLocaleString(lang)+' '+cases_str : d.cases.toLocaleString(lang)+' '+cases_single_str );
    // Set tooltip position
    $tooltip.css({
      'left': $(this).offset().left + x.bandwidth()*0.5 - $tooltip.width()*0.5,
      'top': $(this).offset().top - y.bandwidth()*0.5 - $tooltip.height(),
      'opacity': '1'
    });
  };

  var onMouseOut = function(d){
    $tooltip.css('opacity', '0');
  };

  var getCountryName = function(code) {
    var country = currentData.filter(function(d){ return d.code === code; });
    return (country[0]) ? country[0].name : '';
  };

  var getDimensions = function(){
    width    = $el.width() - Y_AXIS_WIDTH;
    cellSize = Math.floor(width / years.length);
    height   = (cellSize < 20) ? cellSize*countries.length : 20*countries.length; // clip cellsize height to 20px
    return that;
  };

  var formatDecimal = function(number, lang){
    return (number < 0.001) ? 0 : (number >= 0.1) ? number.toFixed(1).toLocaleString(lang) : (number >= 0.01) ? number.toFixed(2).toLocaleString(lang) : number.toFixed(3).toLocaleString(lang);
  };

  return that;
};
var Infographic = function( _id, _type ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var type = _type;

  var vis,
      scrollTop,
      endPosition,
      currentItem = -1,
      $navItems,
      $el, $fixedEl, $contentList;


  // Private Methods

  var setIframeBtns = function(){
    $contentList.each(function(i){
      $(this).append('<div class="btn-next"><a href="#'+(i+2)+'" class="btn btn-default btn-sm">Siguiente <i class="glyphicon glyphicon-chevron-right"></i></a></div>');
    });
    $contentList.find('.btn-next a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
    $('html, body').animate({ scrollTop: $('.infographic-frame li.frame-1').offset().top + 2}, '200');
  };

  // Get url params
  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  };

  // Public Methods

  that.init = function(){

    //console.log('infographic', id, type);

    $el = $( id );
    $contentList = $el.find('.infographic-content li');
    $navItems = $el.find('.infographic-nav li');

    // Setup for prices infographic
    if( type === 'prices'){
      // Add extra frame items for Prices Infographic
      $el.find('.infographic-frame')
        .append('<li class="frame-'+($navItems.length+1)+'"><div class="scroller"></div></li>')
        .append('<li class="frame-'+($navItems.length+2)+'"><div class="scroller"></div></li>');
      // Add extra nav item for Prices Infographic in iframe mode
      if( $el.hasClass('iframe') ){
        $el.find('.infographic-nav').append('<li><a href="#'+($navItems.length+1)+'"></a></li>');
      }
    }

    $fixedEl = $el.find('.infographic-content, .infographic-nav, .infographic-graph');

    // Setup Infographic by Type
    if( type === 'antimalaricos'){
      vis = new Antimalaricos_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'fakes'){
      vis = new Fakes_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'patentes'){
      vis = new Patents_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'prices'){
      vis = new Prices_Infographic( id+' .infographic-graph' );
    }

    that.onResize();

    if( type === 'prices'){
      vis.init( urlParam('skip') === 'true' );  // Setup skip value to prices Infographic
      if( $el.hasClass('iframe') ){
        if( vis.skip ){
          $('#prices-infographic .infographic-frame').hide();
          $('#prices-infographic-menu').addClass('active');
          $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }
        else{
          setIframeBtns();
        }
      }
    }
    
    $contentList.first().addClass('active');    // Setup firs content item as active

    // Nav Buttons Click Interaction
    $navItems.find('a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $el.find('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
  };


  that.onScroll = function(e) {

    scrollTop = $(window).scrollTop();

    if ( scrollTop >= $el.offset().top && scrollTop < endPosition ) {
      $fixedEl.addClass('fixed');
      if( type === 'prices'){ $('#prices-infographic-tooltip').addClass('fixed'); }
    } else {
      $fixedEl.removeClass('fixed');
      if( type === 'prices'){ $('#prices-infographic-tooltip').removeClass('fixed'); }
    }

    if ( scrollTop >= endPosition ) {
      $fixedEl.addClass('bottom');
    }
    else {
      $fixedEl.removeClass('bottom');
    }

    var lastItem = currentItem,
        temp = Math.floor((scrollTop-$el.offset().top) / $(window).height());

    if (currentItem !== temp) {

      currentItem = temp;

      if (currentItem >= 0) {

        //console.log('state', type, currentItem, $contentList.length );

        // Show/hide prices Infographic Menu
        if (type === 'prices') {
          if (currentItem !== $contentList.length) {
            $('#prices-infographic-menu').removeClass('active');
            $el.find('.infographic-nav, .infographic-content').removeClass('invisible');
          }
          else {
            $('#prices-infographic-menu').addClass('active');
            $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          }
        }

        vis.setState( currentItem );

        if( lastItem < currentItem ){
          $contentList.not('.active').css('top', '40px');
          $contentList.filter('.active').css('top', '-40px').removeClass('active');
        }
        else{
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }

        $contentList.eq(currentItem).css('top', '0px').addClass('active');

        $navItems.removeClass('active');
        $navItems.eq(currentItem).addClass('active');
      }
    }
  };

  that.onResize = function() {

    $el.find('.infographic-content, .infographic-nav, .infographic-frame li').height( $(window).height() );
    $el.find('.infographic-graph').height( $(window).height() - $('.infographic-graph').position().top - 30 );

    endPosition = $el.offset().top + $el.height() - $(window).height();

    //if ($(window).width() <= 992) {
    if ($(window).width() < 860) {
      $el.find('.infographic-content').css('height','auto');
    }

    if (type === 'prices' && vis.isInitialized()) {
      vis.resize();
    }
  };

  // Init
  that.init();
};
var Antimalaricos_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;


  // Public Methods

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/antimalaricos.svg' ).mimeType('image/svg+xml').get( function(xml) {

      $(id).append( xml.documentElement );  // Append external SVG to Container

      svg = d3.select(id).select('svg');    // Get SVG Element

      // Initial Setup: all grups hidden
      svg.selectAll('#Bubble1, #Bubble2, #Bubble3, #Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia, #Ginebra').style('opacity', 0);
      svg.select('#Markers').selectAll('image').style('opacity', 0);
      svg.select('#MarkersIndia').selectAll('image').style('opacity', 0);
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      bubbleOut('#Bubble2');

      svg.selectAll('#Brasil')
        .transition().duration(1000)
        .style('opacity', 1);

      bubbleIn('#Bubble1');
    }
    else if( stateID === 1 ){

      bubbleOut('#Bubble1');
      markersOut('#Markers');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela')
        .transition().duration(300)
        .style('opacity', 0);

      bubbleIn('#Bubble2');
    }
    else if( stateID === 2 ){

      bubbleOut('#Bubble2');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);

      markersIn('#Markers', 200, 300);
    }
    else if( stateID === 3 ){

      bubbleOut('#Bubble3');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela, #Ginebra')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#World')
        .transition().duration(1000)
        .style('opacity', 1);

      svg.select('#India')
        .transition().duration(500).delay(2000)
        .style('opacity', 1);

      markersIn('#MarkersIndia', 600, 900);

      svg.select('#PathIndia')
        .style('opacity', 1);

      svg.select('#PathIndia').select('#SVGID_antimalaricos_1_')
        .attr('transform', 'scale(0 1)')
        .transition().duration(1500).delay(800)
        .attr('transform', 'scale(1 1)');
    }
    else if( stateID === 4 ){

      markersOut('#MarkersIndia');

      svg.selectAll('#India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Ginebra')
        .transition().duration(400)
        .style('opacity', 1);

      bubbleIn('#Bubble3');
    }

    return that;
  };


  // Private Methods

  var bubbleIn = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(400).delay(300)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var bubbleOut = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(400)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  var markersIn = function( id, offset, delay ){

    svg.select(id).selectAll('image')
      //.attr('transform', 'translate(0 -10)')
      .transition().duration(500).delay( function(d,i){ return offset+(delay*i); })
      //.attr('transform', 'translate(0 0)')
      .style('opacity', 1);
  };

  var markersOut = function( id ){
  
    svg.select(id).selectAll('image')
      .transition().duration(300)
      //.attr('transform', 'translate(0 -10)')
      .style('opacity', 0);
  };


  return that;
};

var Fakes_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;
  var lastState = -1;


  // Public Methods

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/fakes.svg' ).mimeType('image/svg+xml').get( function(xml) {

      $(id).append( xml.documentElement );  // Append external SVG to Container

      svg = d3.select(id).select('svg');    // Get SVG Element

      // Initial Setup: all grups hidden
      svg.selectAll('#Continents, #Path, #LomeLabel, #LomeMarker, #MumbaiLabel, #MumbaiMarker, #IndiaMarker, #IndiaLabel').style('opacity', 0);
      svg.select('#AfricanCountries').selectAll('path').style('opacity', 0);
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      svg.selectAll('#Path, #MumbaiMarker, #MumbaiLabel, #LomeMarker, #LomeLabel')
        .transition().duration(200)
        .style('opacity', 0);

      if( lastState === 1 ){
        fadeOutPath('#Continents', 400);
        fadeInPath('#India', 600);
      }

      svg.selectAll('#IndiaMarker, #IndiaLabel')
        .transition().duration(300).delay(function(d,i){ return 400+(300*i); })
        .style('opacity', 1);
    }
    else if( stateID === 1 ){

      svg.selectAll('#IndiaMarker, #IndiaLabel')
        .transition().duration(200)
        .style('opacity', 0);

      svg.select('#AfricanCountries').selectAll('path')
        .transition().duration(200)
        .style('opacity', 0);

      fadeOutPath('#India', 400);

      if( lastState === 0 ){
        fadeInPath('#Continents', 600);
      }

      svg.selectAll('#MumbaiMarker, #MumbaiLabel')
        .transition().duration(300).delay(function(d,i){ return 500+(300*i); })
        .style('opacity', 1);

      svg.selectAll('#LomeMarker, #LomeLabel')
        .transition().duration(300).delay(function(d,i){ return 1800+(300*i); })
        .style('opacity', 1);

      svg.select('#Path')
        .style('opacity', 1);

      var w = svg.select('#Path').select('#SVGID_1_').attr('width');

      svg.select('#Path').select('#SVGID_1_')
        .attr('transform', 'translate('+w+' 0)')
        .transition().duration(1500).delay(600)
        .attr('transform', 'translate(0 0)');
    }
    else if( stateID === 2 ){

      svg.selectAll('#Path, #MumbaiMarker, #MumbaiLabel, #LomeMarker, #LomeLabel')
        .transition().duration(200)
        .style('opacity', 0);

      svg.select('#AfricanCountries').selectAll('path')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }

    lastState = stateID;

    return that;
  };


  // Private Methods
  var fadeInPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(duration)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var fadeOutPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(duration)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };


  return that;
};

var Patents_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;
  var lastState = -1;
  var c = 41; // Counter for countries;
  var countries = ['Albania', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Barbados', 'Belgium', 'Belize', 'Benin', 'Bolivia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',  'D.R. Congo', 'Denmark', 'Djibouti', 'Dominica',  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kenya', 'Korea', 'Kuwait', 'Kyrgyz Republic', 'Lao P.D.R', 'Latvia', 'Lesotho', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts & Nevis', 'Saint Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovak Republic', 'Slovenia', 'Solomon Islands', 'South Africa', 'Spain', 'Sri Lanka', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Chinese Taipei', 'Tajikistan', 'Tanzania', 'Thailand', 'Macedonia', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Vanuatu', 'Venezuela', 'Viet Nam', 'Yemen', 'Zambia', 'Zimbabwe'];

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/patentes.svg' ).mimeType('image/svg+xml').get( function(xml) {
    
        $(id).append( xml.documentElement );  // Append external SVG to Container

        svg = d3.select(id).select('svg');    // Get SVG Element

        // Initial Setup: all grups hidden
        svg.selectAll('#World, #Doc1, #Doc2').style('opacity', 0);
        svg.selectAll('#Chemistry, #Time').selectAll('g').style('opacity', 0);
        svg.selectAll('#Sign').selectAll('g').style('opacity', function(d,i){ return (i<4) ? 0 : 1; });

        countries = d3.shuffle(countries);

        svg.select('#World').selectAll('text')
          .style('text-anchor', function(d,i){ return (i<21) ? 'end' : 'start'; })
          .text(function(d,i){ return countries[i]; })
          .style('opacity', 0)
          .transition()
            .delay(function(d,i) { return i * 100; })
            .on('start', function repeat() {
              if (c >= countries.length) { c=0; }
              d3.active(this)
                .style('opacity', 0)
                .text(countries[c++])
                .transition().duration(1800)
                .style('opacity', 1)
                .transition().duration(900)
                .style('opacity', 0)
                .transition().on('start', repeat);
            });

        /*
        svg.select('#World').selectAll('.text')
          .data(countries)
        .enter().append('text')
          .attr('class', 'country-label')
          .style('text-anchor', 'middle')
          .text(function(d){ return d3.values(d)[0]; });
        */
      });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      fadeOutAll();
      fadeOutPath('#Doc1', 300);

      /*
      svg.select('#Doc1')
        .transition().duration(300)
        .style('opacity', 0);
      */
      
      svg.select('#Sign').selectAll('g')
        .transition().duration(400).delay( function(d,i){ return 300*(4-i); })
        .style('opacity', 1);
    }
    else if( stateID === 1 ){

      /*
      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Sign').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      fadeOutAll();
      
      fadeInPath('#Doc1', 800);
    }
    else if( stateID === 2 ){

      fadeOutAll();
      fadeOutPath('#Doc1', 300);
      fadeOutPath('#Doc2', 300);

      /*
      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */
   
      svg.select('#Chemistry').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 3 ){

      fadeOutAll();
      fadeOutPath('#Time', 300);

      /*
      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
        */

      fadeInPath('#Doc2', 800);

      svg.select('#Doc2').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 4 ){

      fadeOutAll();
      fadeOutPath('#Doc2', 300);

      /*
      svg.selectAll('#World')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      fadeInPath('#Time', 800);

      svg.select('#Time').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 5 ){

      fadeOutAll();
       fadeOutPath('#Time', 300);

      /*
      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      svg.select('#World')
        .transition().duration(800)
        .style('opacity', 1);

      /*
      var w = svg.select('#Map').node().getBBox().width;

      svg.select('#Map')
        .transition().duration(1500)
        .attr('transform', 'translate('+w+' 0)');
      */
    }

    lastState = stateID;

    return that;
  };

  // Private Methods
  var fadeOutAll = function(){

    svg.selectAll('#World, #Doc1, #Doc2')
      .transition().duration(300)
      .style('opacity', 0);

    svg.selectAll('#Chemistry, #Time, #Sign').selectAll('g')
      .transition().duration(300)
      .style('opacity', 0);
  };

  var fadeInPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(duration)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var fadeOutPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(duration)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  return that;
};

function Prices_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this,
      initialized = false,
      DOT_OPACITY = 0.7,
      DOT_RADIUS = 7,
      DOT_GRAY = '#d6d6d6',
      current = {
        data: 'affordability',
        type: 'private',
        order: 'area',
        label: 'Private sector - number of days'
      },
      txt = {
        'es': {
          'gratis': 'gratis',
          'dias': 'Días',
          'horas': 'horas',
          'menoshora': 'menos de una hora',
          'Africa': 'África',
          'America': 'América',
          'Asia': 'Asia',
          'Europe': 'Europa',
          'Oceania': 'Oceanía',
          'Low income': 'Ingreso bajo',
          'Lower middle income': 'Ingreso medio bajo',
          'Upper middle income': 'Ingreso medio alto',
          'High income': 'Ingreso alto',
        },
        'en': {
          'gratis': 'free',
          'dias': 'Days',
          'horas': 'hours',
          'menoshora': 'less than an hour',
          'Africa': 'Africa',
          'America': 'America',
          'Asia': 'Asia',
          'Europe': 'Europe',
          'Oceania': 'Oceania',
          'Low income': 'Low income',
          'Lower middle income': 'Lower middle income',
          'Upper middle income': 'Upper middle income',
          'High income': 'High income',
        }
      },
      overlayCode = null,
      dotClicked = null;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var id = _id,
      $el = $(id),
      $menu = $('#prices-infographic-menu'),
      $tooltip = $('#prices-infographic-tooltip'),
      $regionDropdownInputs = $('#region-dropdown-menu .checkbox input'),
      $drugDropdownInputs = $('#drug-dropdown-menu .checkbox input');

  var lang = $el.parent().data('lang');

  var color = d3.scaleOrdinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      timeout, tooltipItem, drugsFiltered, drugsFilteredAll,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries, dataCountriesAll;

  var $svg, $dots, $lines, $countryMarker, $countryLabel, $overlay, $mprLine, $yAxis, $xAxis, $yLabel, $xArea;

  var tickFormatPrices = function(d){
        if (d === 0) {
          return txt[lang].gratis;
        }
        return d+'x';
      };

  var tickFormatAffordability = function(d){
        if (d === 0) {
          return txt[lang].gratis;
        }
        return d;
      };

  // Setup Visualization

  that.init = function( _skip ) {

    initialized = true;

    // Use /?skip=true to skip infographic tour
    that.skip = _skip;

    setDimensions();

    x = d3.scalePoint()
      .range([0, width]);

    y = d3.scalePow().exponent(0.5)
      .range([height, 0]);

    xAxis = d3.axisBottom(x)
      .tickSize(-height)
      .tickPadding(12);

    yAxis = d3.axisLeft(y)
      .tickSize(-width)
      .tickPadding(8)
      .tickFormat(tickFormatAffordability);

    svg = d3.select(id).append('svg')
        .attr('id', 'prices-infographic-svg')
        .attr('width', widthCont)
        .attr('height', heightCont)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Set drug filtered
    drugsFilteredAll = '';
    $drugDropdownInputs.each(function(){
      drugsFilteredAll += $(this).attr('name')+' ';
    });
    drugsFiltered = drugsFilteredAll;

    // Load CSVs
    d3.queue()
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/prices.csv')
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/affordability.csv')
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/countries.csv')
      .await( onDataReady );

    return that;
  };

  that.setState = function(stateID) {

    //console.log( stateID );

    if( stateID === 0 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      // Show only Salbutamol dots
      $dots.transition(1000)
        .style('fill', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return (a.Drug === 'Salbutamol') ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-salbutamol.country-kyrgyzstan');

    } else if( stateID === 1 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      // Show all dots
      setDotsColor()

      setTooltipOnTour('.dot.drug-captopril.country-ghana');

    } else if( stateID === 2 ){

      drugsFiltered = 'Simvastatin Omeprazole';
      updateData( 'affordability', 'private' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return (drugsFiltered.indexOf(a.Drug) > -1) ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-simvastatin.country-são-tomé-and-príncipe');

    } else if( stateID === 3 ){

      drugsFiltered = drugsFilteredAll;
      var countries = 'São Tomé and Príncipe Kuwait Italy Spain Germany';
      updateData( 'affordability', 'private' );

      $dots.transition(1000)
        .style('fill', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_OPACITY : 1; });

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-são-tomé-and-príncipe');

    } else if( stateID === 4 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-morocco');
     
    } else if( stateID === 5 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      $dots.transition(1000)
        .style('fill', DOT_GRAY)
        .style('opacity',DOT_OPACITY);

      svg.selectAll('.dot.country-kuwait')
        .transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', 1);

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-kuwait');
      
    } else if( stateID === 6 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'public' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-diclofenac.country-sudan');
     
    } else if( stateID === 7 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'public' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-amoxicillin.country-brazil--rio-grande-do-sul-state');

    } else if( stateID === 8 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return ('Ciprofloxacin' === a.Drug) ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-ethiopia');

    } else if( stateID === 9 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      $tooltip.css('opacity', '0');
      tooltipItem = null;

      setDotsColor();
    }

    return that;
  };

  that.resize = function() {

    setDimensions();  // Update width/height

    //if( widthCont < 992 ){ return that; }   // Skip for mobile sizes
    if( widthCont < 860 || height < 0 ){ return that; }   // Skip for mobile sizes

    $svg.attr('width', widthCont).attr('height', heightCont);   // Update SVG size

    //Update Axis
    x.range([0, width]);
    y.range([height, 0]);

    xAxis.tickSize(-height);
    yAxis.tickSize(-width);

    $xAxis
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    $yAxis.call(yAxis);

    // Country Marker
    $countryMarker.attr('y1', height);
    $countryLabel.attr('y', height+36);

    // MPR Line
    $mprLine.attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.selectAll('line').attr('x2', width);

    // Mouse events overlay
    $overlay
      .attr('width', width)
      .attr('height', height);

    // Set Tooltip position in Tour
    if (tooltipItem) {
      if ($tooltip.hasClass('left') ) {
        $tooltip.css('right', (widthCont-Math.round(tooltipItem.attr('cx'))-margin.left)+'px');
      } else{
        $tooltip.css('left', (Math.round(tooltipItem.attr('cx'))+margin.left)+'px');
      }
      var top = Math.round(tooltipItem.attr('cy'));
      if (top > 60){
        $tooltip.css('top', (top+margin.top-8-($tooltip.height()*0.5))+'px');
      } else {
        $tooltip.css('top', (top+margin.top-18)+'px');
      }
    }

    // Update Dots & Lines
    $lines.selectAll('line')
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY);

    $dots
      .attr('cx', setValueX)
      .attr('cy', setValueY);

    if (widthCont < 960 && DOT_RADIUS === 7) {
      DOT_RADIUS = 6;
      $dots.attr('r', DOT_RADIUS);
    } else if (widthCont >= 960 && DOT_RADIUS === 6) {
      DOT_RADIUS = 7;
      $dots.attr('r', DOT_RADIUS);
    }

    return that;
  };

  that.isInitialized = function(){
    return initialized;
  };


  // Private Methods

  var onDataReady = function( error, prices, affordability, countries ){

    if (error) throw error;

    prices = prices.filter(function(d){ return d['Unit/MPR'] === 'MPR'; });
    prices.forEach(function(d) {
      d.Price = (d.Price === 'NO DATA') ? null : ((d.Price !== 'free') ? +d.Price : 0);
    });
    
    affordability.forEach(function(d) {
      var affordabilityPublic =  d['Public sector - number of days'];
      var affordabilityPrivate =  d['Private sector - number of days'];
      d['Public sector - number of days']  = (affordabilityPublic !== 'NO DATA' && affordabilityPublic !== '') ? +affordabilityPublic : null;
      d['Private sector - number of days'] = (affordabilityPrivate !== 'NO DATA' && affordabilityPrivate !== '') ? +affordabilityPrivate : null;
    });

    dataCountries = dataCountriesAll = countries;
    dataPricesPublic  = prices.filter(function(d){ return d['Public/Private'] === 'Public'; });
    dataPricesPrivate = prices.filter(function(d){ return d['Public/Private'] === 'Private'; });
    dataAffordability = affordability;

    reorderCountriesByArea();

    /*
    console.dir(dataCountries);
    console.dir(dataPricesPublic);
    console.dir(dataAffordability);
    */

    prices = affordability = countries = null;  // reset temp variables for garbage collector

    setData();
    setupMenuBtns();

    if (that.skip) {
      // if skip setup set last state
      that.setState( 9 );
    }
  };

  var setData = function(){

    var currentData = getCurrentData();

    $svg = d3.select('#prices-infographic-svg');

    // Set title
    $menu.find('.'+current.data+'-'+current.type).show();

    x.domain( dataCountries.map(function(d){ return d.Code; }) );
    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();
    color.domain( d3.extent(currentData, function(d) { return d.Drug; }) );

    xAxis.ticks( dataCountries.length );

    // Setup X Axis
    $xAxis = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Setup Y Axis
    $yAxis = svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    $yLabel = $yAxis.append('text')
        .attr('class', 'y-label')
        .attr('y', -15)
        .style('text-anchor', 'end')
        .text( txt[lang].dias );

    // Country Marker
    $countryMarker = svg.append('line')
      .attr('class', 'country-marker')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    $countryLabel = svg.append('text')
      .attr('class', 'country-label')
      .attr('y', height+36)
      .style('opacity', 0);

    // MPR Line
    $mprLine = svg.append('g')
      .attr('class', 'mpr-line')
      .style('opacity', 0)
      .attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0);
    $mprLine.append('text')
      .attr('x', -8)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .text('MPR');

    // Mouse events overlay
    $overlay = svg.append('rect')
      .attr('class', 'overlay')
      .style('opacity', 0)
      .attr('width', width)
      .attr('height', height);

    // Setup Circles
    svg.append('g')
      .attr('class', 'dots')
    .selectAll('.dot')
      .data( currentData )
    .enter().append('circle')
      .attr('id', setId)
      .attr('class', function(d) { return 'dot'+setClass(d); })
      .attr('r', DOT_RADIUS)
      .attr('cx', setValueX)
      .attr('cy', setValueY)
      .style('visibility', setVisibility)
      .style('opacity', DOT_OPACITY)
      .style('fill', setColor);

    $dots = d3.selectAll('.dot');

    // Setup Lines
    $lines = svg.append('g')
      .attr('class', 'dot-lines');

    // Add X Axis Areas
    setXAxisArea( true );

    // Add Events
    $overlay
      .on('mouseout', onOverlayOut)
      .on('mousemove', onOverlayMove)
      .on('click', resetDotClicked);

    // Add dot events
    $dots
      .on('mouseover', onDotOver )
      .on('mouseout', onDotOut );
  };

  var updateData = function( _data, _type ){

    _data = typeof _data !== 'undefined' ? _data : false;
    _type = typeof _type !== 'undefined' ? _type : false;

    // Setup current data
    if( _data && _type ){
      if (current.data === _data && current.type === _type) {
        return that;
      } else {
        current.data = _data;
        current.type = _type;
      }
    }
    else{
      current.data = $('#mpr-btn').hasClass('active') ? 'prices' : 'affordability';
      current.type = $('#public-btn').hasClass('active') ? 'public' : 'private';
    }

    if( !initialized ){ return that; }

    current.label = (current.data === 'prices') ? 'Price' : ((current.type === 'public') ? 'Public sector - number of days' : 'Private sector - number of days');

    resetDotClicked();

    // Set title
    if( !_data || !_type ){
      $menu.find('h4').hide();
      $menu.find('.'+current.data+'-'+current.type).show();
    }

    var item,
        currentData = getCurrentData();

    if (current.data === 'prices') {
      yAxis.tickFormat(tickFormatPrices);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 0);
    } else {
      yAxis.tickFormat(tickFormatAffordability);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 1);
    }

    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();

    $yAxis.transition().duration(1000).ease(d3.easeSinInOut).call(yAxis);

    if (current.data === 'prices') {
      $mprLine
        .transition().duration(1000)
        .attr('transform', 'translate(0 ' + y(1) + ')')
        .style('opacity', 1);
    } else {
      $mprLine
        .transition().duration(1000)
        .style('opacity', 0);
    }

    // Reset visibility for all dots & lines
    $dots.style('visibility', 'hidden');

    currentData.forEach(function(d){

      item = svg.select('.dot'+getClass(d));

      // Update item
      if (!item.empty()) {

        item.datum(d)
          .style('visibility', setVisibility)
          .transition().duration(1000)
          .attr('cx', setValueX)
          .attr('cy', setValueY);
      }
      // Create item
      else{

        // Setup Circles
        d3.select('.dots')
          .append('circle')
          .datum(d)
          .attr('id', setId)
          .attr('class', function(d) { return 'dot'+setClass(d); })
          .attr('r', DOT_RADIUS)
          .attr('cx', setValueX)
          .attr('cy', setValueY)
          .style('visibility', setVisibility)
          .style('opacity', DOT_OPACITY)
          .style('fill', setColor)
          .on('mouseover', onDotOver )
          .on('mouseout', onDotOut );
      }
    });

    $dots = d3.selectAll('.dot');

    return that;
  };

  var setupMenuBtns = function(){

    // MPR/Affordability Btns
    $('#mpr-btn, #affordability-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#mpr-btn, #affordability-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Public/Private Btns
    $('#public-btn, #private-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#public-btn, #private-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Order Btns
    $('#area-btn, #pib-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#area-btn, #pib-btn').removeClass('active');
      $(this).addClass('active');
      reorderData();
    });

    $regionDropdownInputs.change(function(e){ filterByRegion(); });

    $drugDropdownInputs.change( filterByDrug );
  };

  var reorderData = function(){

    current.order = $('#area-btn').hasClass('active') ? 'area' : 'pib';

    // Order Countries
    if (current.order === 'area') {
      reorderCountriesByArea();
    } else {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    resetDotClicked();

    // Update X Axis
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    $xArea.fadeOut();
    setTimeout( setXAxisArea, 1200 );

    var transition = svg.transition().duration(1000);
    
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');

    return that;
  };

  var reorderCountriesByArea = function(){
    dataCountries.sort(function(x, y){
      if (x.Area === y.Area){
        return d3.ascending(x['Country_'+lang], y['Country_'+lang]);
      }
      return d3.ascending(x.Area, y.Area);
    });
  };
  
  var filterByRegion = function( _regions ){

    var regions = '';

    if( _regions){

      regions = _regions;

    } else{

      $regionDropdownInputs.each(function(){
        if( $(this).is(':checked') ){
          regions += $(this).attr('name')+' ';
        }
      });

      // Select all regions if there's no one
      if (regions === '') {
        $regionDropdownInputs.each(function(){
          $(this).attr('checked',true);
          regions += $(this).attr('name')+' ';
        });
      }
    }

    // Filter Countries
    dataCountries = dataCountriesAll.filter(function(d){
      return regions.indexOf( d.Area ) > -1;
    });

    // Reorder Countries if order is PIB
    if (current.order === 'pib') {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    // Update X Axis
    $xArea.fadeOut();
    setTimeout( setXAxisArea, 1200 );
    
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    $dots.style('visibility', setVisibility);
   
    resetDotClicked();

    var transition = svg.transition().duration(1000);
  
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');
  };

  var filterByDrug = function(){

    drugsFiltered = '';

    // Check All
    if ($(this).attr('name') === 'All') {
      if ($(this).attr('checked')) {
        $drugDropdownInputs.each(function(){
          $(this).attr('checked',true);
        });
      } else {
        $drugDropdownInputs.each(function(){
          $(this).attr('checked',false);
        });
        $drugDropdownInputs.filter('[name="Amitriptyline"]').attr('checked',true);
      }
    } else {
      // Set All Checkbox 
      if ($(this).attr('checked') && $drugDropdownInputs.filter(':checked').length === $drugDropdownInputs.length-1) {
        $drugDropdownInputs.filter('[name="All"]').attr('checked', true);
      } else {
        $drugDropdownInputs.filter('[name="All"]').attr('checked', false);
      }
    }

    $drugDropdownInputs.each(function(){
      if( $(this).is(':checked') ){
        drugsFiltered += $(this).attr('name')+' ';
      }
    });

    // Select all regions if there's no one
    if (drugsFiltered === '') {
      drugsFiltered = drugsFilteredAll;
      $drugDropdownInputs.each(function(){ $(this).attr('checked',true); });
    }

    resetDotClicked();

    $dots.style('visibility', setVisibility);
  };

  var onDotOver = function(){

    var item = d3.select(this);

    $dots.on('click', onDotClick );

    // Update dots
    $dots
      .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
      .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });

    svg.selectAll('.dot.drug-'+item.attr('id'))
      .style('fill', function(d) { return color(d.Drug); }).style('opacity', 1);

    var drugData = getCurrentData();
    drugData = drugData.filter(function(e){ return niceName(e.Drug) === item.attr('id'); });

    // Setup lines
    if (dotClicked === null) {
      $lines.selectAll('.line')
        .data( drugData )
      .enter().append('line')
        .attr('id', setId)
        .attr('class', function(d) { return 'line'+setClass(d); })
        .attr('x1', setValueX)
        .attr('y1', height)
        .attr('x2', setValueX)
        .attr('y2', setValueY)
        .style('visibility', setVisibility)
        .style('stroke', setColor);
    }
    
    // Set current tick active
    var xPos = d3.mouse(this)[0],
        w = width / (x.domain().length-1);
    var j = Math.round( xPos/w );
    $xAxis.selectAll('.tick:nth-child('+(j+2)+') text').attr('class', 'active');

    // Show country marker labels
    $countryLabel.style('opacity', 1);

    // Set selected dots on top
    $dots.sort(function (a, b) {
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    setTooltip( item );
  };

  var setTooltip = function( item ){

    item = ( tooltipItem ) ? tooltipItem : item;

    if( !item ) return;

    var data = +item.data()[0][ current.label ];
    var dataIcon = (current.data !== 'prices') ? 'glyphicon-time' : ( (data < 1) ? 'glyphicon-arrow-down' : 'glyphicon-arrow-up' );

    $tooltip.find('.country').html( getCountryData( item.data()[0].Country )[0]['Region_'+lang] );
    $tooltip.find('.year').html( '('+item.data()[0].Year+')' );
    $tooltip.find('.drug, .green .glyphicon, .green .txt').hide();
    $tooltip.find('.drug-'+item.data()[0].Drug.toLowerCase()).show();
    $tooltip.find('.green .'+dataIcon).show();

    if( data !== 0 ){
      $tooltip.find('.price').html( niceData(data) );
      $tooltip.find('.green .'+current.data+'-txt').show();
    } else {
      $tooltip.find('.price').html( 'gratis' );
    }

    if (current.data !== 'prices' && data < 1 && data !== 0) {
      var h = Math.round(data*8);
      if (h > 0) {
        $tooltip.find('.affordability-txt-hour').html( '  ('+h+' '+txt[lang].horas+')' ).show();
      } else {
        $tooltip.find('.affordability-txt-hour').html( '  ('+txt[lang].menoshora+')' ).show();
      }
    }

    var left = item.attr('cx') > width*0.5;
    var top = Math.round(item.attr('cy'));

    if( left ){
      $tooltip.addClass('left').css({'right': (widthCont-Math.round(item.attr('cx'))-margin.left)+'px', 'left': 'auto'});
    } else{
      $tooltip.removeClass('left').css({'right': 'auto', 'left': (Math.round(item.attr('cx'))+margin.left)+'px'});
    }

    if (top > 60){
      $tooltip.removeClass('top').css({'top': (top+margin.top-8-($tooltip.height()*0.5))+'px', 'opacity': '1'});
    } else {
      $tooltip.addClass('top').css({'top': (top+margin.top-18)+'px', 'opacity': '1'});
    }
  };

  var setTooltipOnTour = function(selection) {
    $tooltip.css('opacity', '0');
    tooltipItem = d3.select(selection);
    clearTimeout(timeout);
    timeout = setTimeout(setTooltip, 1200);
  };

  var onDotOut = function(){

    $dots.on('click', null );

    if (dotClicked === null) {
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

      $lines.selectAll('*').remove();
    }
    else {
      $dots
        .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });
    }
  
    $tooltip.css({'opacity': '0', 'right': 'auto', 'left': '-1000px'});
  };

  var onDotClick = function(){

    var id = d3.select(this).attr('id');
    dotClicked = ( id !== dotClicked ) ? id : null;
  };

  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        w = width / (x.domain().length-1);

    var j = Math.round( xPos/w );

    if( overlayCode === j ){ return that; }

    overlayCode = x.domain()[j];

    $countryMarker
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(overlayCode) +' 0)');

    var countryData = dataCountries.filter(function(d){ return d.Code === overlayCode; });

    $xAxis.selectAll('.tick text').attr('class', '');
    $xAxis.selectAll('.tick:nth-child('+(j+2)+') text').attr('class', 'active');

    $countryLabel
      .attr('x', x(overlayCode))  //-6)
      .style('opacity', 1)
      .text( countryData[0]['Country_'+lang] );
  };

  var onOverlayOut = function(){

    overlayCode = null;
    $countryMarker.style('opacity', 0);
    $countryLabel.style('opacity', 0);
    $xAxis.selectAll('.tick text').attr('class', '');
  };

  var resetDotClicked = function(){
    if (dotClicked !== null) {
      dotClicked = null;
      $lines.selectAll('*').remove();
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }
  };

  var niceName = function( drug ) {
    return drug.toLowerCase().replace(/[ +,\/]/g,'-');
  };

  var niceData = function( data ) {
    return (lang !== 'es') ? data.toFixed(2) : data.toFixed(2).toString().replace(/\./g,',');
  };

  var setId = function(d) {
    return niceName(d.Drug);
  };

  var getClass = function(d) {
   return '.country-' + niceName(d.Country) + '.drug-' + niceName(d.Drug);
  };

  var setClass = function(d) {
   return ' country-' + niceName(d.Country) + ' drug-' + niceName(d.Drug);
  };

  var setValueX = function(d) {
    var countryData = getCountryData(d.Country);
    return ( countryData.length > 0 ) ? x(countryData[0].Code) : 0;
  };

  var setValueY = function(d) {
    return (d[ current.label ] !== null) ? y(d[ current.label ]) : height;
  };

  var setVisibility = function(d) {
    return (d[ current.label ] !== null && drugsFiltered.indexOf( d.Drug ) > -1 && dataCountries.some(function(e){ return e.Region_en === d.Country; }) ) ? 'visible' : 'hidden';
  };

  var setColor = function(d) {
    return color(d.Drug);
  };

  var getCurrentData = function() {
    return (current.data === 'affordability') ? dataAffordability : ((current.type === 'public') ? dataPricesPublic : dataPricesPrivate);
  };

  var getCountryData = function( region ) {
    return dataCountries.filter(function(e){ return e.Region_en === region; });
  };

  var getCountryDataByCode = function( code ) {
    return dataCountries.filter(function(e){ return e.Code === code; });
  };

  var setXAxisArea = function( init ){
    
    var temp = null, c = null, xpos = 0, label, $item;

    if( init ){
      $xArea = $('<ul class="x-area"></ul>');
      $el.append( $xArea );
    } else {
      $xArea.find('li').remove();
      $xArea.fadeIn();
    }
    
    label = (current.order === 'area') ? 'Area' : 'PIB_Area';
    
    d3.selectAll('.x.axis .tick text').each(function(d){
      c = getCountryDataByCode( d );
      if (c[0] && temp !== c[0][label]) {
        temp = c[0][label];
        $xArea.find('li').last().css('width', (100*(x(c[0].Code)-xpos)/width)+'%' );
        xpos = x(c[0].Code);
        $item = $('<li>'+txt[lang][temp]+'</li>');
        $xArea.append( $item );
      }
    });
    
    $xArea.find('li').last().css('width', (100*(x(c[0].Code)-xpos)/width)+'%' );
  };

  var setDimensions = function() {
    widthCont = $el.width();
    heightCont = $el.height();
    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;
  };

  var setDotsColor = function() {
    if ($dots) {
      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }
  };

  return that;
}
