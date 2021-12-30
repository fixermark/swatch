/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 63:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Expose `Emitter`.
 */

exports.Q = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

// alias used for reserved events (protected method)
Emitter.prototype.emitReserved = Emitter.prototype.emit;

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ 10:
/***/ ((module) => {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),

/***/ 58:
/***/ ((module) => {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),

/***/ 146:
/***/ ((module) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;


/***/ }),

/***/ 418:
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ 830:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),

/***/ 187:
/***/ ((module) => {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);

    return uri;
};

function pathNames(obj, path) {
    var regx = /\/{2,9}/g,
        names = path.replace(regx, "/").split("/");

    if (path.substr(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.substr(path.length - 1, 1) == '/') {
        names.splice(names.length - 1, 1);
    }

    return names;
}

function queryKey(uri, query) {
    var data = {};

    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });

    return data;
}


/***/ }),

/***/ 703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(414);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(703)();
}


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 768:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_unused_export__ = load;
__webpack_unused_export__ = loadAll;
__webpack_unused_export__ = select;
__webpack_unused_export__ = save;
__webpack_unused_export__ = remove;
__webpack_unused_export__ = setRawCookie;
__webpack_unused_export__ = plugToRequest;

var _cookie = __webpack_require__(567);

var _cookie2 = _interopRequireDefault(_cookie);

var _objectAssign = __webpack_require__(418);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IS_NODE = typeof document === 'undefined' || typeof process !== 'undefined' && process.env && "production" === 'test';
var _rawCookie = {};
var _res = void 0;

function _isResWritable() {
  return _res && !_res.headersSent;
}

function load(name, doNotParse) {
  var cookies = IS_NODE ? _rawCookie : _cookie2.default.parse(document.cookie);
  var cookieVal = cookies && cookies[name];

  if (typeof doNotParse === 'undefined') {
    doNotParse = !cookieVal || cookieVal[0] !== '{' && cookieVal[0] !== '[';
  }

  if (!doNotParse) {
    try {
      cookieVal = JSON.parse(cookieVal);
    } catch (err) {
      // Not serialized object
    }
  }

  return cookieVal;
}

function loadAll(doNotParse) {
  var cookies = IS_NODE ? _rawCookie : _cookie2.default.parse(document.cookie);
  var cookieVal = cookies;

  if (typeof doNotParse === 'undefined') {
    doNotParse = !cookieVal || cookieVal[0] !== '{' && cookieVal[0] !== '[';
  }

  if (!doNotParse) {
    try {
      cookieVal = JSON.parse(cookieVal);
    } catch (err) {
      // Not serialized object
    }
  }

  return cookieVal;
}

function select(regex) {
  var cookies = IS_NODE ? _rawCookie : _cookie2.default.parse(document.cookie);

  if (!cookies) {
    return {};
  }

  if (!regex) {
    return cookies;
  }

  return Object.keys(cookies).reduce(function (accumulator, name) {
    if (!regex.test(name)) {
      return accumulator;
    }

    var newCookie = {};
    newCookie[name] = cookies[name];
    return (0, _objectAssign2.default)({}, accumulator, newCookie);
  }, {});
}

function save(name, val, opt) {
  _rawCookie[name] = val;

  // Allow you to work with cookies as objects.
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    _rawCookie[name] = JSON.stringify(val);
  }

  // Cookies only work in the browser
  if (!IS_NODE) {
    document.cookie = _cookie2.default.serialize(name, _rawCookie[name], opt);
  }

  if (_isResWritable() && _res.cookie) {
    _res.cookie(name, val, opt);
  }
}

function remove(name, opt) {
  delete _rawCookie[name];

  if (typeof opt === 'undefined') {
    opt = {};
  } else if (typeof opt === 'string') {
    // Will be deprecated in future versions
    opt = { path: opt };
  } else {
    // Prevent mutation of opt below
    opt = (0, _objectAssign2.default)({}, opt);
  }

  if (typeof document !== 'undefined') {
    opt.expires = new Date(1970, 1, 1, 0, 0, 1);
    opt.maxAge = 0;
    document.cookie = _cookie2.default.serialize(name, '', opt);
  }

  if (_isResWritable() && _res.clearCookie) {
    _res.clearCookie(name, opt);
  }
}

function setRawCookie(rawCookie) {
  if (rawCookie) {
    _rawCookie = _cookie2.default.parse(rawCookie);
  } else {
    _rawCookie = {};
  }
}

function plugToRequest(req, res) {
  if (req.cookie) {
    _rawCookie = req.cookie;
  } else if (req.cookies) {
    _rawCookie = req.cookies;
  } else if (req.headers && req.headers.cookie) {
    setRawCookie(req.headers.cookie);
  } else {
    _rawCookie = {};
  }

  _res = res;

  return function unplug() {
    _res = null;
    _rawCookie = {};
  };
}

exports.ZP = {
  setRawCookie: setRawCookie,
  load: load,
  loadAll: loadAll,
  select: select,
  save: save,
  remove: remove,
  plugToRequest: plugToRequest
};

/***/ }),

/***/ 567:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ 448:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(294),m=__webpack_require__(418),r=__webpack_require__(840);function y(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!aa)throw Error(y(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b)}
function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a])}
var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
ja={},ka={};function la(a){if(ia.call(ka,a))return!0;if(ia.call(ja,a))return!1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return!1}function ma(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function B(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var D={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new B(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new B(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new B(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new B(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new B(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){D[a]=new B(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){D[a]=new B(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){D[a]=new B(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){D[a]=new B(a,5,!1,a.toLowerCase(),null,!1,!1)});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
pa);D[b]=new B(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!1,!1)});
D.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!0,!0)});
function qa(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
var ra=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;sa=E("react.element");ta=E("react.portal");ua=E("react.fragment");wa=E("react.strict_mode");xa=E("react.profiler");ya=E("react.provider");za=E("react.context");Aa=E("react.forward_ref");Ba=E("react.suspense");Ca=E("react.suspense_list");Da=E("react.memo");Ea=E("react.lazy");Fa=E("react.block");E("react.scope");Ga=E("react.opaque.id");Ha=E("react.debug_trace_mode");Ia=E("react.offscreen");Ja=E("react.legacy_hidden")}
var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return"function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||""}return"\n"+Ma+a}var Oa=!1;
function Pa(a,b){if(!a||Oa)return"";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(k){var d=k}Reflect.construct(a,[],b)}else{try{b.call()}catch(k){d=k}a.call(b.prototype)}else{try{throw Error();}catch(k){d=k}a()}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return"\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Na(a):""}
function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return""}}
function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return"Fragment";case ta:return"Portal";case xa:return"Profiler";case wa:return"StrictMode";case Ba:return"Suspense";case Ca:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return(a.displayName||"Context")+".Consumer";case ya:return(a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return m({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1)}
function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}function db(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}function eb(a,b){a=m({children:void 0},b);if(b=db(b.children))a.children=b;return a}
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y(91));return m({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function lb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var nb,ob=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else{nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a]})});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var ub=m({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y(62));}}
function wb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb()}
function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb()}}
function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(y(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb)}catch(a){Pb=!1}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(n){this.onError(n)}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments)}
function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null}else throw Error(y(198));Ub||(Ub=!0,Vb=l)}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y(188));}
function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling}throw Error(y(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(y(189));}}if(c.alternate!==d)throw Error(y(190));}if(3!==c.tag)throw Error(y(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return!0;b=b.return}return!1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function rc(a,b,c,d,e){return{blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId)}}
function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return!1}
function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){r.unstable_runWithPriority(a.priority,function(){gc(c)})});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift()}return!0}function zc(a,b,c){xc(a)&&c.delete(b)}
function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift()}null===a.blockedOn&&jc.shift()}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc)}
function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,Ac)))}
function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift()}
function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
"lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d])}}var Qc=r.unstable_now;Qc();var F=8;
function Rc(a){if(0!==(1&a))return F=15,1;if(0!==(2&a))return F=14,2;if(0!==(4&a))return F=13,4;var b=24&a;if(0!==b)return F=12,b;if(0!==(a&32))return F=11,32;b=192&a;if(0!==b)return F=10,b;if(0!==(a&256))return F=9,256;b=3584&a;if(0!==b)return F=8,b;if(0!==(a&4096))return F=7,4096;b=4186112&a;if(0!==b)return F=6,b;b=62914560&a;if(0!==b)return F=5,b;if(a&67108864)return F=4,67108864;if(0!==(a&134217728))return F=3,134217728;b=805306368&a;if(0!==b)return F=2,b;if(0!==(1073741824&a))return F=1,1073741824;
F=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y(358,a));}}
function Uc(a,b){var c=a.pendingLanes;if(0===c)return F=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F):(h&=f,0!==h&&(d=Rc(h),e=F))}else f=c&~g,0!==f?(d=Rc(f),e=F):0!==h&&(d=Rc(h),e=F);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F)return b;F=e}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=r.unstable_UserBlockingPriority,ed=r.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d)}finally{(Kb=f)||Mb()}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d))}
function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else{var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else{if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d)}jd(a,b,d,null,c)}}}}
function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else{var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null}else f!==e&&(e=null)}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}m(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=m({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=m({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=m({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=m({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=m({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=m({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=m({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=m({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=m({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=m({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=m({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=m({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=fa&&"CompositionEvent"in window,be=null;fa&&"documentMode"in document&&(be=document.documentMode);var ce=fa&&"TextEvent"in window&&!be,de=fa&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(fa){var xe;if(fa){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));a=re;if(Kb)a(b);else{Kb=!0;try{Gb(a,b)}finally{Kb=!1,Mb()}}}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge,Ie=Object.prototype.hasOwnProperty;
function Je(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He(a[c[d]],b[c[d]]))return!1;return!0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Ke(c)}}function Me(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Ne(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Je(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve.length;We++)Nc.set(Ve[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
function G(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d))}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye.has(b)||df(b,!1,a,null);df(b,!0,a,null)}))}
function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye.has(a)){if("scroll"!==a)return;e|=2;f=d}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h))}
function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Nb(function(){var d=f,e=xb(c),g=[];
a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue(k);q=null==x?h:ue(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u)}w=null}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve;else if(me(h))if(we)J=Fe;else{J=De;var K=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee);if(J&&(J=J(a,d))){ne(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
K.controlled&&"number"===h.type&&bb(h,"number",h.value)}K=d?ue(d):window;switch(a){case "focusin":if(me(K)||"true"===K.contentEditable)Qe=K,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var Q;if(ae)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
case "compositionupdate":L="onCompositionUpdate";break b}L=void 0}else ie?ge(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),K=oe(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he(c),null!==Q&&(L.data=Q))));if(Q=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
"beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q)}se(g,b)})}function ef(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function nf(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""))}
function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var tf=0;function uf(a){return{$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[wf]||a[ff];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y(33));}function Db(a){return a[xf]||null}
function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return{current:a}}function H(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--)}function I(a,b){Af++;zf[Af]=a.current;a.current=b}var Cf={},M=Bf(Cf),N=Bf(!1),Df=Cf;
function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H(N);H(M)}function Hf(a,b,c){if(M.current!==Cf)throw Error(y(168));I(M,b);I(N,c)}
function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y(108,Ra(b)||"Unknown",e));return m({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M.current;I(M,a);I(N,N.current);return!0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H(N),H(M),I(M,a)):H(N);I(N,c)}
var Lf=null,Mf=null,Nf=r.unstable_runWithPriority,Of=r.unstable_scheduleCallback,Pf=r.unstable_cancelCallback,Qf=r.unstable_shouldYield,Rf=r.unstable_requestPaint,Sf=r.unstable_now,Tf=r.unstable_getCurrentPriorityLevel,Uf=r.unstable_ImmediatePriority,Vf=r.unstable_UserBlockingPriority,Wf=r.unstable_NormalPriority,Xf=r.unstable_LowPriority,Yf=r.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a)}jg()}
function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=m({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null}
function rg(a){var b=mg.current;H(mg);a.type._context._currentValue=b}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null)}
function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null}}else og=og.next=b}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}
function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function zg(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}}
function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k)}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=m({},A,h);break a;case 2:wg=!0}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f))}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y(191,e));e.call(d)}}}var Fg=(new aa.Component).refs;
function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:m({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Kg={isMounted:function(a){return(a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
b);Ag(a,e);Jg(a,d,c)}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null)}
function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4)}var Pg=Array.isArray;
function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y(309));var d=c.stateNode}if(!d)throw Error(y(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y(284));if(!c._owner)throw Error(y(290,a));}return a}
function Rg(a,b){if("textarea"!==a.type)throw Error(y(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
a.mode,c,null),b.return=a,b;Rg(a,b)}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c)}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d)}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y(150));h=l.call(h);if(null==
h)throw Error(y(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h)}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=
Wg(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
function dh(a){if(a===$g)throw Error(y(174));return a}function eh(a,b){I(ch,b);I(bh,a);I(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a)}H(ah);I(ah,b)}function fh(){H(ah);H(bh);H(ch)}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I(bh,a),I(ah,c))}function hh(a){bh.current===a&&(H(ah),H(bh))}var P=Bf(0);
function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var jh=null,kh=null,lh=!1;
function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}
function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c)}jh=a;kh=rf(b.firstChild)}else a.flags=a.flags&-1025|2,lh=!1,jh=a}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a}
function rh(a){if(a!==jh)return!1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}kh=null}}else kh=jh?rf(a.stateNode.nextSibling):null;return!0}
function sh(){kh=jh=null;lh=!1}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S=null,T=null,yh=!1,zh=!1;function Ah(){throw Error(y(321));}function Bh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y(301));f+=1;T=S=null;b.updateQueue=null;vh.current=Fh;a=c(d,e)}while(zh)}vh.current=Gh;b=null!==S&&null!==S.next;xh=0;T=S=R=null;yh=!1;if(b)throw Error(y(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T?R.memoizedState=T=a:T=T.next=a;return T}
function Ih(){if(null===S){var a=R.alternate;a=null!==a?a.memoizedState:null}else a=S.next;var b=null===T?R.memoizedState:T.next;if(null!==b)T=b,S=a;else{if(null===a)throw Error(y(310));S=a;a={memoizedState:S.memoizedState,baseState:S.baseState,baseQueue:S.baseQueue,queue:S.queue,next:null};null===T?R.memoizedState=T=a:T=T.next=a}return T}function Jh(a,b){return"function"===typeof b?b(a):b}
function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=S,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else{var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l}k=k.next}while(null!==k&&k!==e);null===h?f=d:h.next=g;He(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d}return[b.memoizedState,c.dispatch]}
function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}
function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y(350));}
function Nh(a,b,c,d){var e=U;if(null===e)throw Error(y(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He(g,a)){a=c(b._source);He(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes}catch(q){c(function(){throw q;})}})},[b,d]);He(C,c)&&He(x,b)&&He(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return[b.memoizedState,a]}
function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d)}
function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S){var g=S.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d)}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}
function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0)});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b()}finally{wh.transition=c}})}
function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else{if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He(k,h))return}catch(l){}finally{}Jg(a,e,d)}}
var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return[d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return[a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36))},
void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d)}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128}function li(a,b,c,d,e){var f=Ff(c)?Df:M.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b)}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1)}else{g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1)}return qi(a,b,c,d,f,e)}
function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo)}
var si={dehydrated:null,retryLane:0};
function ti(a,b,c){var d=b.pendingProps,e=P.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I(P,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b)}
function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f)}
function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else{if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}I(P,d);if(0===(b.mode&2))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null}return b.child}
function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}return null}var Bi,Ci,Di,Ei;
Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Ci=function(){};
Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=m({},e,{value:void 0});d=m({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf)}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",
c);var l=f;if(b.updateQueue=l)b.flags|=4}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4)};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H(N);H(M);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else{if(!d){if(null===
b.stateNode)throw Error(y(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G("cancel",d);G("close",d);break;case "iframe":case "object":case "embed":G("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G(Xe[a],d);break;case "source":G("error",d);break;case "img":case "image":case "link":G("error",d);G("load",d);break;case "details":G("toggle",d);break;case "input":Za(d,f);G("invalid",d);break;case "select":d._wrapperState=
{wasMultiple:!!f.multiple};G("invalid",d);break;case "textarea":hb(d,f),G("invalid",d)}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
jf)}d=a;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G("cancel",a);G("close",a);
e=d;break;case "iframe":case "object":case "embed":G("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G(Xe[e],a);e=d;break;case "source":G("error",a);e=d;break;case "img":case "image":case "link":G("error",a);G("load",a);e=d;break;case "details":G("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=m({},d,{value:void 0});G("invalid",a);break;case "textarea":hb(a,d);e=
gb(a,d);G("invalid",a);break;default:e=d}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G("scroll",a):null!=k&&qa(a,f,k,g))}switch(c){case "input":Va(a);cb(a,d,!1);
break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf)}mf(c,d)&&(b.flags|=4)}null!==b.ref&&(b.flags|=128)}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(y(166));
c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d)}return null;case 13:H(P);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P.current&1))0===V&&(V=3);else{if(0===V||3===V)V=
4;null===U||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U,W)}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H(P);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else{if(0!==V||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I(P,P.current&1|2);return b.child}a=a.sibling}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432)}else{if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g)}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P.current,I(P,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y(156,b.tag));}
function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H(N);H(M);uh();b=a.flags;if(0!==(b&64))throw Error(y(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H(P),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H(P),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b)};return c}
function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Wi(a,c)}else b.current=null}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y(163));}
function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d()}a=a.next}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode}Eg(c,b,a)}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y(163));}
function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else{d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e)}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}
function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b)}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else{d=b;try{e()}catch(f){Wi(d,f)}}c=c.next}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount()}catch(f){Wi(b,
f)}break;case 5:Vi(b);break;case 4:cj(a,b)}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return}throw Error(y(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b)}
function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling}
function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling}
function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return}d=!0}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else{if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return}k.sibling.return=k.return;k=k.sibling}f?(g=e,h=c.stateNode,
8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode)}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1)}c.sibling.return=c.return;c=c.sibling}}
function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b)}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1))}}}return;case 6:if(null===b.stateNode)throw Error(y(162));b.stateNode.nodeValue=
b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X=0,U=null,Y=null,W=0,qj=0,rj=Bf(0),V=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500}var Z=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X&48)?O():-1!==Fj?Fj:Fj=O()}
function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U&&(Hi|=b,4===V&&Ii(a,W));var d=eg();1===b?0!==(X&8)&&0===(X&48)?Lj(a):(Mj(a,c),0===X&&(wj(),ig())):(0===(X&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F;f[h]=10<=n?l+250:6<=n?l+5E3:-1}}else l<=b&&(a.expiredLanes|=k);g&=~k}d=Uc(a,a===U?W:0);b=F;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else{if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c)}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c}}
function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X&48))throw Error(y(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U?W:0);if(0===c)return null;var d=c;var e=X;X|=16;var f=Pj();if(U!==a||W!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h)}while(1);qg();oj.current=f;X=e;null!==Y?d=0:(U=null,W=0,d=V);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d}}
function Lj(a){if(0!==(X&48))throw Error(y(327));Oj();if(a===U&&0!==(a.expiredLanes&W)){var b=W;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b))}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O())})}ig()}function Wj(a,b){var c=X;X|=1;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function Xj(a,b){var c=X;X&=-2;X|=8;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function ni(a,b){I(rj,qj);qj|=b;tj|=b}function Ki(){qj=rj.current;H(rj)}
function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H(N);H(M);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H(P);break;case 19:H(P);break;case 10:rg(d);break;case 23:case 24:Ki()}c=c.return}U=a;Y=Tg(a.current,null);W=qj=tj=b;V=0;sj=null;uj=Hi=Dg=0}
function Sj(a,b){do{var c=Y;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}yh=!1}xh=0;T=S=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V=1;sj=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
(h.updateQueue=null,h.memoizedState=null)}var A=0!==(P.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else{var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else{var t=zg(-1,1);t.tag=2;Ag(h,t)}h.lanes|=1;break a}k=
void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v)}p.flags|=4096;p.lanes=b;break a}p=p.return}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.")}5!==V&&(V=2);k=Mi(k,h);p=
g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return}while(null!==p)}Zj(c)}catch(va){b=va;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}
function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X;X|=16;var d=Pj();U===a&&W===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e)}while(1);qg();X=c;oj.current=d;if(null!==Y)throw Error(y(261));U=null;W=0;return V}function ak(){for(;null!==Y;)bk(Y)}function Rj(){for(;null!==Y&&!Qf();)bk(Y)}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y=b;pj.current=null}
function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b))}else{c=Li(b);if(null!==c){c.flags&=2047;Y=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048)}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===V&&(V=5)}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
function dk(a,b){do Oj();while(null!==yj);if(0!==(X&48))throw Error(y(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l}null!==
Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U&&(Y=U=null,W=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X;X|=32;pj.current=null;kf=fd;g=Ne();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType}catch(va){h=null;
break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode}w=u}h=-1===A||-1===p?null:{start:A,end:p}}else h=null;h=h||{start:0,end:0}}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z=d;do try{ek()}catch(va){if(null===
Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Ij=null;Z=d;do try{for(g=a;null!==Z;){var t=Z.flags;t&16&&pb(Z.stateNode,"");if(t&128){var q=Z.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null)}}switch(t&1038){case 2:fj(Z);Z.flags&=-3;break;case 6:fj(Z);Z.flags&=-3;ij(Z.alternate,Z);break;case 1024:Z.flags&=-1025;break;case 1028:Z.flags&=-1025;ij(Z.alternate,Z);break;case 4:ij(Z.alternate,Z);break;case 8:h=Z;cj(g,h);var J=h.alternate;dj(h);null!==
J&&dj(J)}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);v=lf;q=Ne();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top}fd=!!kf;lf=kf=null;a.current=c;Z=d;do try{for(t=a;null!==Z;){var K=Z.flags;K&36&&Yi(t,Z.alternate,Z);if(K&128){q=void 0;var Q=Z.ref;if(null!==Q){var L=Z.stateNode;switch(Z.tag){case 5:q=L;break;default:q=L}"function"===typeof Q?Q(q):Q.current=q}}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Z=null;$f();X=e}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z=d;null!==Z;)b=
Z.nextEffect,Z.nextEffect=null,Z.flags&8&&(K=Z,K.sibling=null,K.stateNode=null),Z=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64))}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X&8))return null;ig();return null}
function ek(){for(;null!==Z;){var a=Z.alternate;Jj||null===Ij||(0!==(Z.flags&8)?dc(Z,Ij)&&(Jj=!0):13===Z.tag&&mj(a,Z)&&dc(Z,Ij)&&(Jj=!0));var b=Z.flags;0!==(b&256)&&Xi(a,Z);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z=Z.nextEffect}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return!1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}
function fk(){if(null===yj)return!1;var a=yj;yj=null;if(0!==(X&48))throw Error(y(331));var b=X;X|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
null,h.stateNode=null),h=a;X=b;ig();return!0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b))}
function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a)}catch(f){}break}}c=c.return}}
function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U===a&&(W&c)===c&&(4===V||3===V&&(W&62914560)===W&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b)}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c))}var ck;
ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else{ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I(P,P.current&1);b=hi(a,b,c);return null!==
b?b.sibling:null}I(P,P.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I(P,P.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c)}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y(282));
d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else{e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling}else fi(a,b,d,c),sh();b=b.child}return b;case 5:return gh(b),null===a&&
ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=g}fi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y(156,b.tag));
};function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null}
function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return}while(null!==h);throw Error(y(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b)}function pk(){return null}
function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e)}this._internalRoot=c}
qk.prototype.render=function(a){lk(a,this._internalRoot,null,null)};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null})};function rk(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a)}}lk(b,g,a,e)}else{f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a)}}Xj(function(){lk(b,g,a,e)})}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4)}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864)}};
gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c)}};hc=function(a,b){return b()};
yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y(90));Wa(d);ab(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Wj;
Hb=function(a,b,c,d,e){var f=X;X|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X=f,0===X&&(wj(),ig())}};Ib=function(){0===(X&49)&&(Vj(),Oj())};Jb=function(a,b){var c=X;X|=2;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"};
var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk}catch(a){}}__webpack_unused_export__=vk;__webpack_unused_export__=uk;
__webpack_unused_export__=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y(188));throw Error(y(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};__webpack_unused_export__=function(a,b){var c=X;if(0!==(c&48))return a(b);X|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X=c,ig()}};__webpack_unused_export__=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!0,c)};
exports.render=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!1,c)};__webpack_unused_export__=function(a){if(!rk(a))throw Error(y(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null})}),!0):!1};__webpack_unused_export__=Wj;__webpack_unused_export__=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
__webpack_unused_export__=function(a,b,c,d){if(!rk(c))throw Error(y(200));if(null==a||void 0===a._reactInternals)throw Error(y(38));return tk(a,b,c,!1,d)};__webpack_unused_export__="17.0.2";


/***/ }),

/***/ 935:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(448);
} else {}


/***/ }),

/***/ 251:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
__webpack_require__(418);var f=__webpack_require__(294),g=60103;__webpack_unused_export__=60107;if("function"===typeof Symbol&&Symbol.for){var h=Symbol.for;g=h("react.element");__webpack_unused_export__=h("react.fragment")}var m=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n=Object.prototype.hasOwnProperty,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:g,type:c,key:e,ref:l,props:d,_owner:m.current}}exports.jsx=q;exports.jsxs=q;


/***/ }),

/***/ 408:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=__webpack_require__(418),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;
exports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";


/***/ }),

/***/ 294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(408);
} else {}


/***/ }),

/***/ 893:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(251);
} else {}


/***/ }),

/***/ 276:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.diffAny = exports.diffObjects = exports.diffArrays = exports.intersection = exports.subtract = exports.isDestructive = void 0;
var pointer_1 = __webpack_require__(424); // we only need this for type inference
var util_1 = __webpack_require__(599);
function isDestructive(_a) {
    var op = _a.op;
    return op === 'remove' || op === 'replace' || op === 'copy' || op === 'move';
}
exports.isDestructive = isDestructive;
/**
List the keys in `minuend` that are not in `subtrahend`.

A key is only considered if it is both 1) an own-property (o.hasOwnProperty(k))
of the object, and 2) has a value that is not undefined. This is to match JSON
semantics, where JSON object serialization drops keys with undefined values.

@param minuend Object of interest
@param subtrahend Object of comparison
@returns Array of keys that are in `minuend` but not in `subtrahend`.
*/
function subtract(minuend, subtrahend) {
    // initialize empty object; we only care about the keys, the values can be anything
    var obj = {};
    // build up obj with all the properties of minuend
    for (var add_key in minuend) {
        if (util_1.hasOwnProperty.call(minuend, add_key) && minuend[add_key] !== undefined) {
            obj[add_key] = 1;
        }
    }
    // now delete all the properties of subtrahend from obj
    // (deleting a missing key has no effect)
    for (var del_key in subtrahend) {
        if (util_1.hasOwnProperty.call(subtrahend, del_key) && subtrahend[del_key] !== undefined) {
            delete obj[del_key];
        }
    }
    // finally, extract whatever keys remain in obj
    return Object.keys(obj);
}
exports.subtract = subtract;
/**
List the keys that shared by all `objects`.

The semantics of what constitutes a "key" is described in {@link subtract}.

@param objects Array of objects to compare
@returns Array of keys that are in ("own-properties" of) every object in `objects`.
*/
function intersection(objects) {
    var length = objects.length;
    // prepare empty counter to keep track of how many objects each key occurred in
    var counter = {};
    // go through each object and increment the counter for each key in that object
    for (var i = 0; i < length; i++) {
        var object = objects[i];
        for (var key in object) {
            if (util_1.hasOwnProperty.call(object, key) && object[key] !== undefined) {
                counter[key] = (counter[key] || 0) + 1;
            }
        }
    }
    // now delete all keys from the counter that were not seen in every object
    for (var key in counter) {
        if (counter[key] < length) {
            delete counter[key];
        }
    }
    // finally, extract whatever keys remain in the counter
    return Object.keys(counter);
}
exports.intersection = intersection;
function isArrayAdd(array_operation) {
    return array_operation.op === 'add';
}
function isArrayRemove(array_operation) {
    return array_operation.op === 'remove';
}
function appendArrayOperation(base, operation) {
    return {
        // the new operation must be pushed on the end
        operations: base.operations.concat(operation),
        cost: base.cost + 1,
    };
}
/**
Calculate the shortest sequence of operations to get from `input` to `output`,
using a dynamic programming implementation of the Levenshtein distance algorithm.

To get from the input ABC to the output AZ we could just delete all the input
and say "insert A, insert Z" and be done with it. That's what we do if the
input is empty. But we can be smarter.

          output
               A   Z
               -   -
          [0]  1   2
input A |  1  [0]  1
      B |  2  [1]  1
      C |  3   2  [2]

1) start at 0,0 (+0)
2) keep A (+0)
3) remove B (+1)
4) replace C with Z (+1)

If the `input` (source) is empty, they'll all be in the top row, resulting in an
array of 'add' operations.
If the `output` (target) is empty, everything will be in the left column,
resulting in an array of 'remove' operations.

@returns A list of add/remove/replace operations.
*/
function diffArrays(input, output, ptr, diff) {
    if (diff === void 0) { diff = diffAny; }
    // set up cost matrix (very simple initialization: just a map)
    var memo = {
        '0,0': { operations: [], cost: 0 },
    };
    /**
    Calculate the cheapest sequence of operations required to get from
    input.slice(0, i) to output.slice(0, j).
    There may be other valid sequences with the same cost, but none cheaper.
  
    @param i The row in the layout above
    @param j The column in the layout above
    @returns An object containing a list of operations, along with the total cost
             of applying them (+1 for each add/remove/replace operation)
    */
    function dist(i, j) {
        // memoized
        var memo_key = i + "," + j;
        var memoized = memo[memo_key];
        if (memoized === undefined) {
            // TODO: this !diff(...).length usage could/should be lazy
            if (i > 0 && j > 0 && !diff(input[i - 1], output[j - 1], new pointer_1.Pointer()).length) {
                // equal (no operations => no cost)
                memoized = dist(i - 1, j - 1);
            }
            else {
                var alternatives = [];
                if (i > 0) {
                    // NOT topmost row
                    var remove_base = dist(i - 1, j);
                    var remove_operation = {
                        op: 'remove',
                        index: i - 1,
                    };
                    alternatives.push(appendArrayOperation(remove_base, remove_operation));
                }
                if (j > 0) {
                    // NOT leftmost column
                    var add_base = dist(i, j - 1);
                    var add_operation = {
                        op: 'add',
                        index: i - 1,
                        value: output[j - 1],
                    };
                    alternatives.push(appendArrayOperation(add_base, add_operation));
                }
                if (i > 0 && j > 0) {
                    // TABLE MIDDLE
                    // supposing we replaced it, compute the rest of the costs:
                    var replace_base = dist(i - 1, j - 1);
                    // okay, the general plan is to replace it, but we can be smarter,
                    // recursing into the structure and replacing only part of it if
                    // possible, but to do so we'll need the original value
                    var replace_operation = {
                        op: 'replace',
                        index: i - 1,
                        original: input[i - 1],
                        value: output[j - 1],
                    };
                    alternatives.push(appendArrayOperation(replace_base, replace_operation));
                }
                // the only other case, i === 0 && j === 0, has already been memoized
                // the meat of the algorithm:
                // sort by cost to find the lowest one (might be several ties for lowest)
                // [4, 6, 7, 1, 2].sort((a, b) => a - b) -> [ 1, 2, 4, 6, 7 ]
                var best = alternatives.sort(function (a, b) { return a.cost - b.cost; })[0];
                memoized = best;
            }
            memo[memo_key] = memoized;
        }
        return memoized;
    }
    // handle weird objects masquerading as Arrays that don't have proper length
    // properties by using 0 for everything but positive numbers
    var input_length = (isNaN(input.length) || input.length <= 0) ? 0 : input.length;
    var output_length = (isNaN(output.length) || output.length <= 0) ? 0 : output.length;
    var array_operations = dist(input_length, output_length).operations;
    var padded_operations = array_operations.reduce(function (_a, array_operation) {
        var operations = _a[0], padding = _a[1];
        if (isArrayAdd(array_operation)) {
            var padded_index = array_operation.index + 1 + padding;
            var index_token = padded_index < (input_length + padding) ? String(padded_index) : '-';
            var operation = {
                op: array_operation.op,
                path: ptr.add(index_token).toString(),
                value: array_operation.value,
            };
            // padding++ // maybe only if array_operation.index > -1 ?
            return [operations.concat(operation), padding + 1];
        }
        else if (isArrayRemove(array_operation)) {
            var operation = {
                op: array_operation.op,
                path: ptr.add(String(array_operation.index + padding)).toString(),
            };
            // padding--
            return [operations.concat(operation), padding - 1];
        }
        else { // replace
            var replace_ptr = ptr.add(String(array_operation.index + padding));
            var replace_operations = diff(array_operation.original, array_operation.value, replace_ptr);
            return [operations.concat.apply(operations, replace_operations), padding];
        }
    }, [[], 0])[0];
    return padded_operations;
}
exports.diffArrays = diffArrays;
function diffObjects(input, output, ptr, diff) {
    if (diff === void 0) { diff = diffAny; }
    // if a key is in input but not output -> remove it
    var operations = [];
    subtract(input, output).forEach(function (key) {
        operations.push({ op: 'remove', path: ptr.add(key).toString() });
    });
    // if a key is in output but not input -> add it
    subtract(output, input).forEach(function (key) {
        operations.push({ op: 'add', path: ptr.add(key).toString(), value: output[key] });
    });
    // if a key is in both, diff it recursively
    intersection([input, output]).forEach(function (key) {
        operations.push.apply(operations, diff(input[key], output[key], ptr.add(key)));
    });
    return operations;
}
exports.diffObjects = diffObjects;
/**
`diffAny()` returns an empty array if `input` and `output` are materially equal
(i.e., would produce equivalent JSON); otherwise it produces an array of patches
that would transform `input` into `output`.

> Here, "equal" means that the value at the target location and the
> value conveyed by "value" are of the same JSON type, and that they
> are considered equal by the following rules for that type:
> o  strings: are considered equal if they contain the same number of
>    Unicode characters and their code points are byte-by-byte equal.
> o  numbers: are considered equal if their values are numerically
>    equal.
> o  arrays: are considered equal if they contain the same number of
>    values, and if each value can be considered equal to the value at
>    the corresponding position in the other array, using this list of
>    type-specific rules.
> o  objects: are considered equal if they contain the same number of
>    members, and if each member can be considered equal to a member in
>    the other object, by comparing their keys (as strings) and their
>    values (using this list of type-specific rules).
> o  literals (false, true, and null): are considered equal if they are
>    the same.
*/
function diffAny(input, output, ptr, diff) {
    if (diff === void 0) { diff = diffAny; }
    // strict equality handles literals, numbers, and strings (a sufficient but not necessary cause)
    if (input === output) {
        return [];
    }
    var input_type = util_1.objectType(input);
    var output_type = util_1.objectType(output);
    if (input_type == 'array' && output_type == 'array') {
        return diffArrays(input, output, ptr, diff);
    }
    if (input_type == 'object' && output_type == 'object') {
        return diffObjects(input, output, ptr, diff);
    }
    // at this point we know that input and output are materially different;
    // could be array -> object, object -> array, boolean -> undefined,
    // number -> string, or some other combination, but nothing that can be split
    // up into multiple patches: so `output` must replace `input` wholesale.
    return [{ op: 'replace', path: ptr.toString(), value: output }];
}
exports.diffAny = diffAny;


/***/ }),

/***/ 431:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = exports.rh = exports.af = void 0;
var pointer_1 = __webpack_require__(424);
var patch_1 = __webpack_require__(972);
var diff_1 = __webpack_require__(276);
/**
Apply a 'application/json-patch+json'-type patch to an object.

`patch` *must* be an array of operations.

> Operation objects MUST have exactly one "op" member, whose value
> indicates the operation to perform.  Its value MUST be one of "add",
> "remove", "replace", "move", "copy", or "test"; other values are
> errors.

This method mutates the target object in-place.

@returns list of results, one for each operation: `null` indicated success,
         otherwise, the result will be an instance of one of the Error classes:
         MissingError, InvalidOperationError, or TestError.
*/
function applyPatch(object, patch) {
    return patch.map(function (operation) { return patch_1.apply(object, operation); });
}
exports.af = applyPatch;
function wrapVoidableDiff(diff) {
    function wrappedDiff(input, output, ptr) {
        var custom_patch = diff(input, output, ptr);
        // ensure an array is always returned
        return Array.isArray(custom_patch) ? custom_patch : diff_1.diffAny(input, output, ptr, wrappedDiff);
    }
    return wrappedDiff;
}
/**
Produce a 'application/json-patch+json'-type patch to get from one object to
another.

This does not alter `input` or `output` unless they have a property getter with
side-effects (which is not a good idea anyway).

`diff` is called on each pair of comparable non-primitive nodes in the
`input`/`output` object trees, producing nested patches. Return `undefined`
to fall back to default behaviour.

Returns list of operations to perform on `input` to produce `output`.
*/
function createPatch(input, output, diff) {
    var ptr = new pointer_1.Pointer();
    // a new Pointer gets a default path of [''] if not specified
    return (diff ? wrapVoidableDiff(diff) : diff_1.diffAny)(input, output, ptr);
}
exports.rh = createPatch;
/**
Create a test operation based on `input`'s current evaluation of the JSON
Pointer `path`; if such a pointer cannot be resolved, returns undefined.
*/
function createTest(input, path) {
    var endpoint = pointer_1.Pointer.fromJSON(path).evaluate(input);
    if (endpoint !== undefined) {
        return { op: 'test', path: path, value: endpoint.value };
    }
}
/**
Produce an 'application/json-patch+json'-type list of tests, to verify that
existing values in an object are identical to the those captured at some
checkpoint (whenever this function is called).

This does not alter `input` or `output` unless they have a property getter with
side-effects (which is not a good idea anyway).

Returns list of test operations.
*/
function createTests(input, patch) {
    var tests = new Array();
    patch.filter(diff_1.isDestructive).forEach(function (operation) {
        var pathTest = createTest(input, operation.path);
        if (pathTest)
            tests.push(pathTest);
        if ('from' in operation) {
            var fromTest = createTest(input, operation.from);
            if (fromTest)
                tests.push(fromTest);
        }
    });
    return tests;
}
__webpack_unused_export__ = createTests;


/***/ }),

/***/ 972:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.apply = exports.InvalidOperationError = exports.test = exports.copy = exports.move = exports.replace = exports.remove = exports.add = exports.TestError = exports.MissingError = void 0;
var pointer_1 = __webpack_require__(424);
var util_1 = __webpack_require__(599);
var diff_1 = __webpack_require__(276);
var MissingError = /** @class */ (function (_super) {
    __extends(MissingError, _super);
    function MissingError(path) {
        var _this = _super.call(this, "Value required at path: " + path) || this;
        _this.path = path;
        _this.name = 'MissingError';
        return _this;
    }
    return MissingError;
}(Error));
exports.MissingError = MissingError;
var TestError = /** @class */ (function (_super) {
    __extends(TestError, _super);
    function TestError(actual, expected) {
        var _this = _super.call(this, "Test failed: " + actual + " != " + expected) || this;
        _this.actual = actual;
        _this.expected = expected;
        _this.name = 'TestError';
        return _this;
    }
    return TestError;
}(Error));
exports.TestError = TestError;
function _add(object, key, value) {
    if (Array.isArray(object)) {
        // `key` must be an index
        if (key == '-') {
            object.push(value);
        }
        else {
            var index = parseInt(key, 10);
            object.splice(index, 0, value);
        }
    }
    else {
        object[key] = value;
    }
}
function _remove(object, key) {
    if (Array.isArray(object)) {
        // '-' syntax doesn't make sense when removing
        var index = parseInt(key, 10);
        object.splice(index, 1);
    }
    else {
        // not sure what the proper behavior is when path = ''
        delete object[key];
    }
}
/**
>  o  If the target location specifies an array index, a new value is
>     inserted into the array at the specified index.
>  o  If the target location specifies an object member that does not
>     already exist, a new member is added to the object.
>  o  If the target location specifies an object member that does exist,
>     that member's value is replaced.
*/
function add(object, operation) {
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    // it's not exactly a "MissingError" in the same way that `remove` is -- more like a MissingParent, or something
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _add(endpoint.parent, endpoint.key, util_1.clone(operation.value));
    return null;
}
exports.add = add;
/**
> The "remove" operation removes the value at the target location.
> The target location MUST exist for the operation to be successful.
*/
function remove(object, operation) {
    // endpoint has parent, key, and value properties
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.value === undefined) {
        return new MissingError(operation.path);
    }
    // not sure what the proper behavior is when path = ''
    _remove(endpoint.parent, endpoint.key);
    return null;
}
exports.remove = remove;
/**
> The "replace" operation replaces the value at the target location
> with a new value.  The operation object MUST contain a "value" member
> whose content specifies the replacement value.
> The target location MUST exist for the operation to be successful.

> This operation is functionally identical to a "remove" operation for
> a value, followed immediately by an "add" operation at the same
> location with the replacement value.

Even more simply, it's like the add operation with an existence check.
*/
function replace(object, operation) {
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === null) {
        return new MissingError(operation.path);
    }
    // this existence check treats arrays as a special case
    if (Array.isArray(endpoint.parent)) {
        if (parseInt(endpoint.key, 10) >= endpoint.parent.length) {
            return new MissingError(operation.path);
        }
    }
    else if (endpoint.value === undefined) {
        return new MissingError(operation.path);
    }
    endpoint.parent[endpoint.key] = operation.value;
    return null;
}
exports.replace = replace;
/**
> The "move" operation removes the value at a specified location and
> adds it to the target location.
> The operation object MUST contain a "from" member, which is a string
> containing a JSON Pointer value that references the location in the
> target document to move the value from.
> This operation is functionally identical to a "remove" operation on
> the "from" location, followed immediately by an "add" operation at
> the target location with the value that was just removed.

> The "from" location MUST NOT be a proper prefix of the "path"
> location; i.e., a location cannot be moved into one of its children.

TODO: throw if the check described in the previous paragraph fails.
*/
function move(object, operation) {
    var from_endpoint = pointer_1.Pointer.fromJSON(operation.from).evaluate(object);
    if (from_endpoint.value === undefined) {
        return new MissingError(operation.from);
    }
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _remove(from_endpoint.parent, from_endpoint.key);
    _add(endpoint.parent, endpoint.key, from_endpoint.value);
    return null;
}
exports.move = move;
/**
> The "copy" operation copies the value at a specified location to the
> target location.
> The operation object MUST contain a "from" member, which is a string
> containing a JSON Pointer value that references the location in the
> target document to copy the value from.
> The "from" location MUST exist for the operation to be successful.

> This operation is functionally identical to an "add" operation at the
> target location using the value specified in the "from" member.

Alternatively, it's like 'move' without the 'remove'.
*/
function copy(object, operation) {
    var from_endpoint = pointer_1.Pointer.fromJSON(operation.from).evaluate(object);
    if (from_endpoint.value === undefined) {
        return new MissingError(operation.from);
    }
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _add(endpoint.parent, endpoint.key, util_1.clone(from_endpoint.value));
    return null;
}
exports.copy = copy;
/**
> The "test" operation tests that a value at the target location is
> equal to a specified value.
> The operation object MUST contain a "value" member that conveys the
> value to be compared to the target location's value.
> The target location MUST be equal to the "value" value for the
> operation to be considered successful.
*/
function test(object, operation) {
    var endpoint = pointer_1.Pointer.fromJSON(operation.path).evaluate(object);
    // TODO: this diffAny(...).length usage could/should be lazy
    if (diff_1.diffAny(endpoint.value, operation.value, new pointer_1.Pointer()).length) {
        return new TestError(endpoint.value, operation.value);
    }
    return null;
}
exports.test = test;
var InvalidOperationError = /** @class */ (function (_super) {
    __extends(InvalidOperationError, _super);
    function InvalidOperationError(operation) {
        var _this = _super.call(this, "Invalid operation: " + operation.op) || this;
        _this.operation = operation;
        _this.name = 'InvalidOperationError';
        return _this;
    }
    return InvalidOperationError;
}(Error));
exports.InvalidOperationError = InvalidOperationError;
/**
Switch on `operation.op`, applying the corresponding patch function for each
case to `object`.
*/
function apply(object, operation) {
    // not sure why TypeScript can't infer typesafety of:
    //   {add, remove, replace, move, copy, test}[operation.op](object, operation)
    // (seems like a bug)
    switch (operation.op) {
        case 'add': return add(object, operation);
        case 'remove': return remove(object, operation);
        case 'replace': return replace(object, operation);
        case 'move': return move(object, operation);
        case 'copy': return copy(object, operation);
        case 'test': return test(object, operation);
    }
    return new InvalidOperationError(operation);
}
exports.apply = apply;


/***/ }),

/***/ 424:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pointer = void 0;
/**
Unescape token part of a JSON Pointer string

`token` should *not* contain any '/' characters.

> Evaluation of each reference token begins by decoding any escaped
> character sequence.  This is performed by first transforming any
> occurrence of the sequence '~1' to '/', and then transforming any
> occurrence of the sequence '~0' to '~'.  By performing the
> substitutions in this order, an implementation avoids the error of
> turning '~01' first into '~1' and then into '/', which would be
> incorrect (the string '~01' correctly becomes '~1' after
> transformation).

Here's my take:

~1 is unescaped with higher priority than ~0 because it is a lower-order escape character.
I say "lower order" because '/' needs escaping due to the JSON Pointer serialization technique.
Whereas, '~' is escaped because escaping '/' uses the '~' character.
*/
function unescape(token) {
    return token.replace(/~1/g, '/').replace(/~0/g, '~');
}
/** Escape token part of a JSON Pointer string

> '~' needs to be encoded as '~0' and '/'
> needs to be encoded as '~1' when these characters appear in a
> reference token.

This is the exact inverse of `unescape()`, so the reverse replacements must take place in reverse order.
*/
function escape(token) {
    return token.replace(/~/g, '~0').replace(/\//g, '~1');
}
/**
JSON Pointer representation
*/
var Pointer = /** @class */ (function () {
    function Pointer(tokens) {
        if (tokens === void 0) { tokens = ['']; }
        this.tokens = tokens;
    }
    /**
    `path` *must* be a properly escaped string.
    */
    Pointer.fromJSON = function (path) {
        var tokens = path.split('/').map(unescape);
        if (tokens[0] !== '')
            throw new Error("Invalid JSON Pointer: " + path);
        return new Pointer(tokens);
    };
    Pointer.prototype.toString = function () {
        return this.tokens.map(escape).join('/');
    };
    /**
    Returns an object with 'parent', 'key', and 'value' properties.
    In the special case that this Pointer's path == "",
    this object will be {parent: null, key: '', value: object}.
    Otherwise, parent and key will have the property such that parent[key] == value.
    */
    Pointer.prototype.evaluate = function (object) {
        var parent = null;
        var key = '';
        var value = object;
        for (var i = 1, l = this.tokens.length; i < l; i++) {
            parent = value;
            key = this.tokens[i];
            // not sure if this the best way to handle non-existant paths...
            value = (parent || {})[key];
        }
        return { parent: parent, key: key, value: value };
    };
    Pointer.prototype.get = function (object) {
        return this.evaluate(object).value;
    };
    Pointer.prototype.set = function (object, value) {
        var cursor = object;
        for (var i = 1, l = this.tokens.length - 1, token = this.tokens[i]; i < l; i++) {
            // not sure if this the best way to handle non-existant paths...
            cursor = (cursor || {})[token];
        }
        if (cursor) {
            cursor[this.tokens[this.tokens.length - 1]] = value;
        }
    };
    Pointer.prototype.push = function (token) {
        // mutable
        this.tokens.push(token);
    };
    /**
    `token` should be a String. It'll be coerced to one anyway.
  
    immutable (shallowly)
    */
    Pointer.prototype.add = function (token) {
        var tokens = this.tokens.concat(String(token));
        return new Pointer(tokens);
    };
    return Pointer;
}());
exports.Pointer = Pointer;


/***/ }),

/***/ 599:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clone = exports.objectType = exports.hasOwnProperty = void 0;
exports.hasOwnProperty = Object.prototype.hasOwnProperty;
function objectType(object) {
    if (object === undefined) {
        return 'undefined';
    }
    if (object === null) {
        return 'null';
    }
    if (Array.isArray(object)) {
        return 'array';
    }
    return typeof object;
}
exports.objectType = objectType;
function isNonPrimitive(value) {
    // loose-equality checking for null is faster than strict checking for each of null/undefined/true/false
    // checking null first, then calling typeof, is faster than vice-versa
    return value != null && typeof value == 'object';
}
/**
Recursively copy a value.

@param source - should be a JavaScript primitive, Array, Date, or (plain old) Object.
@returns copy of source where every Array and Object have been recursively
         reconstructed from their constituent elements
*/
function clone(source) {
    if (!isNonPrimitive(source)) {
        // short-circuiting is faster than a single return
        return source;
    }
    // x.constructor == Array is the fastest way to check if x is an Array
    if (source.constructor == Array) {
        // construction via imperative for-loop is faster than source.map(arrayVsObject)
        var length_1 = source.length;
        // setting the Array length during construction is faster than just `[]` or `new Array()`
        var arrayTarget = new Array(length_1);
        for (var i = 0; i < length_1; i++) {
            arrayTarget[i] = clone(source[i]);
        }
        return arrayTarget;
    }
    // Date
    if (source.constructor == Date) {
        var dateTarget = new Date(+source);
        return dateTarget;
    }
    // Object
    var objectTarget = {};
    // declaring the variable (with const) inside the loop is faster
    for (var key in source) {
        // hasOwnProperty costs a bit of performance, but it's semantically necessary
        // using a global helper is MUCH faster than calling source.hasOwnProperty(key)
        if (exports.hasOwnProperty.call(source, key)) {
            objectTarget[key] = clone(source[key]);
        }
    }
    return objectTarget;
}
exports.clone = clone;


/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}
if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0))};g=function(a,b){u=setTimeout(a,b)};h=function(){clearTimeout(u)};exports.unstable_shouldYield=function(){return!1};k=exports.unstable_forceFrameRate=function(){}}else{var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null)}catch(b){throw G.postMessage(null),b;}}else A=!1};f=function(a){B=a;A||(A=!0,G.postMessage(null))};g=function(a,b){C=
x(function(){a(exports.unstable_now())},b)};h=function(){y(C);C=-1}}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M)}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else{var b=J(M);null!==b&&g(U,b.startTime-a)}}
function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b)}else K(L);O=J(L)}if(null!==O)var m=!0;else{var n=J(M);null!==n&&g(U,n.startTime-b);m=!1}return m}finally{O=null,P=c,Q=!1}}var W=k;exports.unstable_IdlePriority=5;
exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V))};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P}var c=P;P=b;try{return a()}finally{P=c}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=P;P=a;try{return b()}finally{P=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c}}};


/***/ }),

/***/ 840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(53);
} else {}


/***/ }),

/***/ 889:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self));


/***/ }),

/***/ 281:
/***/ ((module) => {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),

/***/ 22:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 526:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// NAMESPACE OBJECT: ./node_modules/socket.io-client/node_modules/socket.io-parser/build/esm/index.js
var socket_io_parser_build_esm_namespaceObject = {};
__webpack_require__.r(socket_io_parser_build_esm_namespaceObject);
__webpack_require__.d(socket_io_parser_build_esm_namespaceObject, {
  "Decoder": () => (Decoder),
  "Encoder": () => (Encoder),
  "PacketType": () => (PacketType),
  "protocol": () => (build_esm_protocol)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(893);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(935);
// EXTERNAL MODULE: ./node_modules/lodash.isplainobject/index.js
var lodash_isplainobject = __webpack_require__(146);
// EXTERNAL MODULE: ./node_modules/rfc6902/index.js
var rfc6902 = __webpack_require__(431);
;// CONCATENATED MODULE: ./node_modules/nanoid/non-secure/index.js
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, size) => {
  return () => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}


;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js


function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
;// CONCATENATED MODULE: ./node_modules/redux/es/redux.js


/**
 * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
 *
 * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
 * during build.
 * @param {number} code
 */
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
}

// Inlined version of the `symbol-observable` polyfill
var $$observable = (function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
})();

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function redux_isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

// Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
function miniKindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;

  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'function':
      {
        return type;
      }
  }

  if (Array.isArray(val)) return 'array';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  var constructorName = ctorName(val);

  switch (constructorName) {
    case 'Symbol':
    case 'Promise':
    case 'WeakMap':
    case 'WeakSet':
    case 'Map':
    case 'Set':
      return constructorName;
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function kindOf(val) {
  var typeOfVal = typeof val;

  if (false) {}

  return typeOfVal;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error( true ? formatProdErrorMessage(0) : 0);
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(1) : 0);
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error( true ? formatProdErrorMessage(2) : 0);
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(3) : 0);
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error( true ? formatProdErrorMessage(4) : 0);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(5) : 0);
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error( true ? formatProdErrorMessage(6) : 0);
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!redux_isPlainObject(action)) {
      throw new Error( true ? formatProdErrorMessage(7) : 0);
    }

    if (typeof action.type === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(8) : 0);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(9) : 0);
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(10) : 0);
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new Error( true ? formatProdErrorMessage(11) : 0);
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!redux_isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + kindOf(inputState) + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(12) : 0);
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(13) : 0);
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {}

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (false) {}

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) { var warningMessage; }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var actionType = action && action.type;
        throw new Error( true ? formatProdErrorMessage(14) : 0);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error( true ? formatProdErrorMessage(16) : 0);
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error( true ? formatProdErrorMessage(15) : 0);
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2(_objectSpread2({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (false) {}



;// CONCATENATED MODULE: ./node_modules/immer/dist/immer.esm.js
function n(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];if(false){ var i, o; }throw Error("[Immer] minified error nr: "+n+(r.length?" "+r.map((function(n){return"'"+n+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function t(n){return!!n&&!!n[Q]}function r(n){return!!n&&(function(n){if(!n||"object"!=typeof n)return!1;var t=Object.getPrototypeOf(n);if(null===t)return!0;var r=Object.hasOwnProperty.call(t,"constructor")&&t.constructor;return r===Object||"function"==typeof r&&Function.toString.call(r)===Z}(n)||Array.isArray(n)||!!n[L]||!!n.constructor[L]||s(n)||v(n))}function e(r){return t(r)||n(23,r),r[Q].t}function i(n,t,r){void 0===r&&(r=!1),0===o(n)?(r?Object.keys:nn)(n).forEach((function(e){r&&"symbol"==typeof e||t(e,n[e],n)})):n.forEach((function(r,e){return t(e,r,n)}))}function o(n){var t=n[Q];return t?t.i>3?t.i-4:t.i:Array.isArray(n)?1:s(n)?2:v(n)?3:0}function u(n,t){return 2===o(n)?n.has(t):Object.prototype.hasOwnProperty.call(n,t)}function a(n,t){return 2===o(n)?n.get(t):n[t]}function f(n,t,r){var e=o(n);2===e?n.set(t,r):3===e?(n.delete(t),n.add(r)):n[t]=r}function c(n,t){return n===t?0!==n||1/n==1/t:n!=n&&t!=t}function s(n){return X&&n instanceof Map}function v(n){return q&&n instanceof Set}function p(n){return n.o||n.t}function l(n){if(Array.isArray(n))return Array.prototype.slice.call(n);var t=tn(n);delete t[Q];for(var r=nn(t),e=0;e<r.length;e++){var i=r[e],o=t[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(t[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:n[i]})}return Object.create(Object.getPrototypeOf(n),t)}function d(n,e){return void 0===e&&(e=!1),y(n)||t(n)||!r(n)?n:(o(n)>1&&(n.set=n.add=n.clear=n.delete=h),Object.freeze(n),e&&i(n,(function(n,t){return d(t,!0)}),!0),n)}function h(){n(2)}function y(n){return null==n||"object"!=typeof n||Object.isFrozen(n)}function b(t){var r=rn[t];return r||n(18,t),r}function m(n,t){rn[n]||(rn[n]=t)}function _(){return true||0,U}function j(n,t){t&&(b("Patches"),n.u=[],n.s=[],n.v=t)}function O(n){g(n),n.p.forEach(S),n.p=null}function g(n){n===U&&(U=n.l)}function w(n){return U={p:[],l:U,h:n,m:!0,_:0}}function S(n){var t=n[Q];0===t.i||1===t.i?t.j():t.O=!0}function P(t,e){e._=e.p.length;var i=e.p[0],o=void 0!==t&&t!==i;return e.h.g||b("ES5").S(e,t,o),o?(i[Q].P&&(O(e),n(4)),r(t)&&(t=M(e,t),e.l||x(e,t)),e.u&&b("Patches").M(i[Q],t,e.u,e.s)):t=M(e,i,[]),O(e),e.u&&e.v(e.u,e.s),t!==H?t:void 0}function M(n,t,r){if(y(t))return t;var e=t[Q];if(!e)return i(t,(function(i,o){return A(n,e,t,i,o,r)}),!0),t;if(e.A!==n)return t;if(!e.P)return x(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i(3===e.i?new Set(o):o,(function(t,i){return A(n,e,o,t,i,r)})),x(n,o,!1),r&&n.u&&b("Patches").R(e,r,n.u,n.s)}return e.o}function A(e,i,o,a,c,s){if( false&&0,t(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!t(v))return;e.m=!1}if(r(c)&&!y(c)){if(!e.h.F&&e._<1)return;M(e,c),i&&i.A.l||x(e,c)}}function x(n,t,r){void 0===r&&(r=!1),n.h.F&&n.m&&d(t,r)}function z(n,t){var r=n[Q];return(r?p(r):n)[t]}function I(n,t){if(t in n)for(var r=Object.getPrototypeOf(n);r;){var e=Object.getOwnPropertyDescriptor(r,t);if(e)return e;r=Object.getPrototypeOf(r)}}function k(n){n.P||(n.P=!0,n.l&&k(n.l))}function E(n){n.o||(n.o=l(n.t))}function R(n,t,r){var e=s(t)?b("MapSet").N(t,r):v(t)?b("MapSet").T(t,r):n.g?function(n,t){var r=Array.isArray(n),e={i:r?1:0,A:t?t.A:_(),P:!1,I:!1,D:{},l:t,t:n,k:null,o:null,j:null,C:!1},i=e,o=en;r&&(i=[e],o=on);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(t,r):b("ES5").J(t,r);return(r?r.A:_()).p.push(e),e}function D(e){return t(e)||n(22,e),function n(t){if(!r(t))return t;var e,u=t[Q],c=o(t);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=F(t,c),u.I=!1}else e=F(t,c);return i(e,(function(t,r){u&&a(u.t,t)===r||f(e,t,n(r))})),3===c?new Set(e):e}(e)}function F(n,t){switch(t){case 2:return new Map(n);case 3:return Array.from(n)}return l(n)}function N(){function r(n,t){var r=s[n];return r?r.enumerable=t:s[n]=r={configurable:!0,enumerable:t,get:function(){var t=this[Q];return false&&0,en.get(t,n)},set:function(t){var r=this[Q]; false&&0,en.set(r,n,t)}},r}function e(n){for(var t=n.length-1;t>=0;t--){var r=n[t][Q];if(!r.P)switch(r.i){case 5:a(r)&&k(r);break;case 4:o(r)&&k(r)}}}function o(n){for(var t=n.t,r=n.k,e=nn(r),i=e.length-1;i>=0;i--){var o=e[i];if(o!==Q){var a=t[o];if(void 0===a&&!u(t,o))return!0;var f=r[o],s=f&&f[Q];if(s?s.t!==a:!c(f,a))return!0}}var v=!!t[Q];return e.length!==nn(t).length+(v?0:1)}function a(n){var t=n.k;if(t.length!==n.t.length)return!0;var r=Object.getOwnPropertyDescriptor(t,t.length-1);return!(!r||r.get)}function f(t){t.O&&n(3,JSON.stringify(p(t)))}var s={};m("ES5",{J:function(n,t){var e=Array.isArray(n),i=function(n,t){if(n){for(var e=Array(t.length),i=0;i<t.length;i++)Object.defineProperty(e,""+i,r(i,!0));return e}var o=tn(t);delete o[Q];for(var u=nn(o),a=0;a<u.length;a++){var f=u[a];o[f]=r(f,n||!!o[f].enumerable)}return Object.create(Object.getPrototypeOf(t),o)}(e,n),o={i:e?5:4,A:t?t.A:_(),P:!1,I:!1,D:{},l:t,t:n,k:i,o:null,O:!1,C:!1};return Object.defineProperty(i,Q,{value:o,writable:!0}),i},S:function(n,r,o){o?t(r)&&r[Q].A===n&&e(n.p):(n.u&&function n(t){if(t&&"object"==typeof t){var r=t[Q];if(r){var e=r.t,o=r.k,f=r.D,c=r.i;if(4===c)i(o,(function(t){t!==Q&&(void 0!==e[t]||u(e,t)?f[t]||n(o[t]):(f[t]=!0,k(r)))})),i(e,(function(n){void 0!==o[n]||u(o,n)||(f[n]=!1,k(r))}));else if(5===c){if(a(r)&&(k(r),f.length=!0),o.length<e.length)for(var s=o.length;s<e.length;s++)f[s]=!1;else for(var v=e.length;v<o.length;v++)f[v]=!0;for(var p=Math.min(o.length,e.length),l=0;l<p;l++)void 0===f[l]&&n(o[l])}}}}(n.p[0]),e(n.p))},K:function(n){return 4===n.i?o(n):a(n)}})}function T(){function e(n){if(!r(n))return n;if(Array.isArray(n))return n.map(e);if(s(n))return new Map(Array.from(n.entries()).map((function(n){return[n[0],e(n[1])]})));if(v(n))return new Set(Array.from(n).map(e));var t=Object.create(Object.getPrototypeOf(n));for(var i in n)t[i]=e(n[i]);return u(n,L)&&(t[L]=n[L]),t}function f(n){return t(n)?e(n):n}var c="add";m("Patches",{$:function(t,r){return r.forEach((function(r){for(var i=r.path,u=r.op,f=t,s=0;s<i.length-1;s++){var v=o(f),p=""+i[s];0!==v&&1!==v||"__proto__"!==p&&"constructor"!==p||n(24),"function"==typeof f&&"prototype"===p&&n(24),"object"!=typeof(f=a(f,p))&&n(15,i.join("/"))}var l=o(f),d=e(r.value),h=i[i.length-1];switch(u){case"replace":switch(l){case 2:return f.set(h,d);case 3:n(16);default:return f[h]=d}case c:switch(l){case 1:return f.splice(h,0,d);case 2:return f.set(h,d);case 3:return f.add(d);default:return f[h]=d}case"remove":switch(l){case 1:return f.splice(h,1);case 2:return f.delete(h);case 3:return f.delete(r.value);default:return delete f[h]}default:n(17,u)}})),t},R:function(n,t,r,e){switch(n.i){case 0:case 4:case 2:return function(n,t,r,e){var o=n.t,s=n.o;i(n.D,(function(n,i){var v=a(o,n),p=a(s,n),l=i?u(o,n)?"replace":c:"remove";if(v!==p||"replace"!==l){var d=t.concat(n);r.push("remove"===l?{op:l,path:d}:{op:l,path:d,value:p}),e.push(l===c?{op:"remove",path:d}:"remove"===l?{op:c,path:d,value:f(v)}:{op:"replace",path:d,value:f(v)})}}))}(n,t,r,e);case 5:case 1:return function(n,t,r,e){var i=n.t,o=n.D,u=n.o;if(u.length<i.length){var a=[u,i];i=a[0],u=a[1];var s=[e,r];r=s[0],e=s[1]}for(var v=0;v<i.length;v++)if(o[v]&&u[v]!==i[v]){var p=t.concat([v]);r.push({op:"replace",path:p,value:f(u[v])}),e.push({op:"replace",path:p,value:f(i[v])})}for(var l=i.length;l<u.length;l++){var d=t.concat([l]);r.push({op:c,path:d,value:f(u[l])})}i.length<u.length&&e.push({op:"replace",path:t.concat(["length"]),value:i.length})}(n,t,r,e);case 3:return function(n,t,r,e){var i=n.t,o=n.o,u=0;i.forEach((function(n){if(!o.has(n)){var i=t.concat([u]);r.push({op:"remove",path:i,value:n}),e.unshift({op:c,path:i,value:n})}u++})),u=0,o.forEach((function(n){if(!i.has(n)){var o=t.concat([u]);r.push({op:c,path:o,value:n}),e.unshift({op:"remove",path:o,value:n})}u++}))}(n,t,r,e)}},M:function(n,t,r,e){r.push({op:"replace",path:[],value:t===H?void 0:t}),e.push({op:"replace",path:[],value:n.t})}})}function C(){function t(n,t){function r(){this.constructor=n}a(n,t),n.prototype=(r.prototype=t.prototype,new r)}function e(n){n.o||(n.D=new Map,n.o=new Map(n.t))}function o(n){n.o||(n.o=new Set,n.t.forEach((function(t){if(r(t)){var e=R(n.A.h,t,n);n.p.set(t,e),n.o.add(e)}else n.o.add(t)})))}function u(t){t.O&&n(3,JSON.stringify(p(t)))}var a=function(n,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var r in t)t.hasOwnProperty(r)&&(n[r]=t[r])})(n,t)},f=function(){function n(n,t){return this[Q]={i:2,l:t,A:t?t.A:_(),P:!1,I:!1,o:void 0,D:void 0,t:n,k:this,C:!1,O:!1},this}t(n,Map);var o=n.prototype;return Object.defineProperty(o,"size",{get:function(){return p(this[Q]).size}}),o.has=function(n){return p(this[Q]).has(n)},o.set=function(n,t){var r=this[Q];return u(r),p(r).has(n)&&p(r).get(n)===t||(e(r),k(r),r.D.set(n,!0),r.o.set(n,t),r.D.set(n,!0)),this},o.delete=function(n){if(!this.has(n))return!1;var t=this[Q];return u(t),e(t),k(t),t.D.set(n,!1),t.o.delete(n),!0},o.clear=function(){var n=this[Q];u(n),p(n).size&&(e(n),k(n),n.D=new Map,i(n.t,(function(t){n.D.set(t,!1)})),n.o.clear())},o.forEach=function(n,t){var r=this;p(this[Q]).forEach((function(e,i){n.call(t,r.get(i),i,r)}))},o.get=function(n){var t=this[Q];u(t);var i=p(t).get(n);if(t.I||!r(i))return i;if(i!==t.t.get(n))return i;var o=R(t.A.h,i,t);return e(t),t.o.set(n,o),o},o.keys=function(){return p(this[Q]).keys()},o.values=function(){var n,t=this,r=this.keys();return(n={})[V]=function(){return t.values()},n.next=function(){var n=r.next();return n.done?n:{done:!1,value:t.get(n.value)}},n},o.entries=function(){var n,t=this,r=this.keys();return(n={})[V]=function(){return t.entries()},n.next=function(){var n=r.next();if(n.done)return n;var e=t.get(n.value);return{done:!1,value:[n.value,e]}},n},o[V]=function(){return this.entries()},n}(),c=function(){function n(n,t){return this[Q]={i:3,l:t,A:t?t.A:_(),P:!1,I:!1,o:void 0,t:n,k:this,p:new Map,O:!1,C:!1},this}t(n,Set);var r=n.prototype;return Object.defineProperty(r,"size",{get:function(){return p(this[Q]).size}}),r.has=function(n){var t=this[Q];return u(t),t.o?!!t.o.has(n)||!(!t.p.has(n)||!t.o.has(t.p.get(n))):t.t.has(n)},r.add=function(n){var t=this[Q];return u(t),this.has(n)||(o(t),k(t),t.o.add(n)),this},r.delete=function(n){if(!this.has(n))return!1;var t=this[Q];return u(t),o(t),k(t),t.o.delete(n)||!!t.p.has(n)&&t.o.delete(t.p.get(n))},r.clear=function(){var n=this[Q];u(n),p(n).size&&(o(n),k(n),n.o.clear())},r.values=function(){var n=this[Q];return u(n),o(n),n.o.values()},r.entries=function(){var n=this[Q];return u(n),o(n),n.o.entries()},r.keys=function(){return this.values()},r[V]=function(){return this.values()},r.forEach=function(n,t){for(var r=this.values(),e=r.next();!e.done;)n.call(t,e.value,e.value,this),e=r.next()},n}();m("MapSet",{N:function(n,t){return new f(n,t)},T:function(n,t){return new c(n,t)}})}function J(){N(),C(),T()}function K(n){return n}function $(n){return n}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",V="undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return"Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return"Unsupported patch operation: "+n},18:function(n){return"The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(n){return"produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+n+"'"},22:function(n){return"'current' expects a draft, got: "+n},23:function(n){return"'original' expects a draft, got: "+n},24:"Patching reserved attributes like __proto__, prototype and constructor is not allowed"},Z=""+Object.prototype.constructor,nn="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,tn=Object.getOwnPropertyDescriptors||function(n){var t={};return nn(n).forEach((function(r){t[r]=Object.getOwnPropertyDescriptor(n,r)})),t},rn={},en={get:function(n,t){if(t===Q)return n;var e=p(n);if(!u(e,t))return function(n,t,r){var e,i=I(t,r);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(n.k):void 0}(n,e,t);var i=e[t];return n.I||!r(i)?i:i===z(n.t,t)?(E(n),n.o[t]=R(n.A.h,i,n)):i},has:function(n,t){return t in p(n)},ownKeys:function(n){return Reflect.ownKeys(p(n))},set:function(n,t,r){var e=I(p(n),t);if(null==e?void 0:e.set)return e.set.call(n.k,r),!0;if(!n.P){var i=z(p(n),t),o=null==i?void 0:i[Q];if(o&&o.t===r)return n.o[t]=r,n.D[t]=!1,!0;if(c(r,i)&&(void 0!==r||u(n.t,t)))return!0;E(n),k(n)}return n.o[t]===r&&"number"!=typeof r&&(void 0!==r||t in n.o)||(n.o[t]=r,n.D[t]=!0,!0)},deleteProperty:function(n,t){return void 0!==z(n.t,t)||t in n.t?(n.D[t]=!1,E(n),k(n)):delete n.D[t],n.o&&delete n.o[t],!0},getOwnPropertyDescriptor:function(n,t){var r=p(n),e=Reflect.getOwnPropertyDescriptor(r,t);return e?{writable:!0,configurable:1!==n.i||"length"!==t,enumerable:e.enumerable,value:r[t]}:e},defineProperty:function(){n(11)},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12)}},on={};i(en,(function(n,t){on[n]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}})),on.deleteProperty=function(t,r){return false&&0,en.deleteProperty.call(this,t[0],r)},on.set=function(t,r,e){return false&&0,en.set.call(this,t[0],r,e,t[0])};var un=function(){function e(t){var e=this;this.g=B,this.F=!0,this.produce=function(t,i,o){if("function"==typeof t&&"function"!=typeof i){var u=i;i=t;var a=e;return function(n){var t=this;void 0===n&&(n=u);for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return a.produce(n,(function(n){var r;return(r=i).call.apply(r,[t,n].concat(e))}))}}var f;if("function"!=typeof i&&n(6),void 0!==o&&"function"!=typeof o&&n(7),r(t)){var c=w(e),s=R(e,t,void 0),v=!0;try{f=i(s),v=!1}finally{v?O(c):g(c)}return"undefined"!=typeof Promise&&f instanceof Promise?f.then((function(n){return j(c,o),P(n,c)}),(function(n){throw O(c),n})):(j(c,o),P(f,c))}if(!t||"object"!=typeof t){if((f=i(t))===H)return;return void 0===f&&(f=t),e.F&&d(f,!0),f}n(21,t)},this.produceWithPatches=function(n,t){return"function"==typeof n?function(t){for(var r=arguments.length,i=Array(r>1?r-1:0),o=1;o<r;o++)i[o-1]=arguments[o];return e.produceWithPatches(t,(function(t){return n.apply(void 0,[t].concat(i))}))}:[e.produce(n,t,(function(n,t){r=n,i=t})),r,i];var r,i},"boolean"==typeof(null==t?void 0:t.useProxies)&&this.setUseProxies(t.useProxies),"boolean"==typeof(null==t?void 0:t.autoFreeze)&&this.setAutoFreeze(t.autoFreeze)}var i=e.prototype;return i.createDraft=function(e){r(e)||n(8),t(e)&&(e=D(e));var i=w(this),o=R(this,e,void 0);return o[Q].C=!0,g(i),o},i.finishDraft=function(t,r){var e=t&&t[Q]; false&&(0);var i=e.A;return j(i,r),P(void 0,i)},i.setAutoFreeze=function(n){this.F=n},i.setUseProxies=function(t){t&&!B&&n(20),this.g=t},i.applyPatches=function(n,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=b("Patches").$;return t(n)?o(n,r):this.produce(n,(function(n){return o(n,r.slice(e+1))}))},e}(),an=new un,fn=an.produce,cn=an.produceWithPatches.bind(an),sn=an.setAutoFreeze.bind(an),vn=an.setUseProxies.bind(an),pn=an.applyPatches.bind(an),ln=an.createDraft.bind(an),dn=an.finishDraft.bind(an);/* harmony default export */ const immer_esm = (fn);
//# sourceMappingURL=immer.esm.js.map

;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/turn-order-406c4349.js



/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
const MAKE_MOVE = 'MAKE_MOVE';
const GAME_EVENT = 'GAME_EVENT';
const REDO = 'REDO';
const RESET = 'RESET';
const SYNC = 'SYNC';
const UNDO = 'UNDO';
const UPDATE = 'UPDATE';
const PATCH = 'PATCH';
const PLUGIN = 'PLUGIN';
const STRIP_TRANSIENTS = 'STRIP_TRANSIENTS';

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Generate a move to be dispatched to the game move reducer.
 *
 * @param {string} type - The move type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
const makeMove = (type, args, playerID, credentials) => ({
    type: MAKE_MOVE,
    payload: { type, args, playerID, credentials },
});
/**
 * Generate a game event to be dispatched to the flow reducer.
 *
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
const gameEvent = (type, args, playerID, credentials) => ({
    type: GAME_EVENT,
    payload: { type, args, playerID, credentials },
});
/**
 * Generate an automatic game event that is a side-effect of a move.
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
const automaticGameEvent = (type, args, playerID, credentials) => ({
    type: GAME_EVENT,
    payload: { type, args, playerID, credentials },
    automatic: true,
});
const sync = (info) => ({
    type: SYNC,
    state: info.state,
    log: info.log,
    initialState: info.initialState,
    clientOnly: true,
});
/**
 * Used to update the Redux store's state with patch in response to
 * an action coming from another player.
 * @param prevStateID previous stateID
 * @param stateID stateID after this patch
 * @param {Operation[]} patch - The patch to apply.
 * @param {LogEntry[]} deltalog - A log delta.
 */
const patch = (prevStateID, stateID, patch, deltalog) => ({
    type: PATCH,
    prevStateID,
    stateID,
    patch,
    deltalog,
    clientOnly: true,
});
/**
 * Used to update the Redux store's state in response to
 * an action coming from another player.
 * @param {object} state - The state to restore.
 * @param {Array} deltalog - A log delta.
 */
const update = (state, deltalog) => ({
    type: UPDATE,
    state,
    deltalog,
    clientOnly: true,
});
/**
 * Used to reset the game state.
 * @param {object} state - The initial state.
 */
const turn_order_406c4349_reset = (state) => ({
    type: RESET,
    state,
    clientOnly: true,
});
/**
 * Used to undo the last move.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
const undo = (playerID, credentials) => ({
    type: UNDO,
    payload: { type: null, args: null, playerID, credentials },
});
/**
 * Used to redo the last undone move.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
const redo = (playerID, credentials) => ({
    type: REDO,
    payload: { type: null, args: null, playerID, credentials },
});
/**
 * Allows plugins to define their own actions and intercept them.
 */
const turn_order_406c4349_plugin = (type, args, playerID, credentials) => ({
    type: PLUGIN,
    payload: { type, args, playerID, credentials },
});
/**
 * Private action used to strip transient metadata (e.g. errors) from the game
 * state.
 */
const stripTransients = () => ({
    type: STRIP_TRANSIENTS,
});

var ActionCreators = /*#__PURE__*/Object.freeze({
  __proto__: null,
  makeMove: makeMove,
  gameEvent: gameEvent,
  automaticGameEvent: automaticGameEvent,
  sync: sync,
  patch: patch,
  update: update,
  reset: turn_order_406c4349_reset,
  undo: undo,
  redo: redo,
  plugin: turn_order_406c4349_plugin,
  stripTransients: stripTransients
});

/**
 * Moves can return this when they want to indicate
 * that the combination of arguments is illegal and
 * the move ought to be discarded.
 */
const INVALID_MOVE = 'INVALID_MOVE';

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Plugin that allows using Immer to make immutable changes
 * to G by just mutating it.
 */
const ImmerPlugin = {
    name: 'plugin-immer',
    fnWrap: (move) => (G, ctx, ...args) => {
        let isInvalid = false;
        const newG = immer_esm(G, (G) => {
            const result = move(G, ctx, ...args);
            if (result === INVALID_MOVE) {
                isInvalid = true;
                return;
            }
            return result;
        });
        if (isInvalid)
            return INVALID_MOVE;
        return newG;
    },
};

// Inlined version of Alea from https://github.com/davidbau/seedrandom.
// Converted to Typescript October 2020.
class Alea {
    constructor(seed) {
        const mash = Mash();
        // Apply the seeding algorithm from Baagoe.
        this.c = 1;
        this.s0 = mash(' ');
        this.s1 = mash(' ');
        this.s2 = mash(' ');
        this.s0 -= mash(seed);
        if (this.s0 < 0) {
            this.s0 += 1;
        }
        this.s1 -= mash(seed);
        if (this.s1 < 0) {
            this.s1 += 1;
        }
        this.s2 -= mash(seed);
        if (this.s2 < 0) {
            this.s2 += 1;
        }
    }
    next() {
        const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
        this.s0 = this.s1;
        this.s1 = this.s2;
        return (this.s2 = t - (this.c = Math.trunc(t)));
    }
}
function Mash() {
    let n = 0xefc8249d;
    const mash = function (data) {
        const str = data.toString();
        for (let i = 0; i < str.length; i++) {
            n += str.charCodeAt(i);
            let h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
    return mash;
}
function copy(f, t) {
    t.c = f.c;
    t.s0 = f.s0;
    t.s1 = f.s1;
    t.s2 = f.s2;
    return t;
}
function alea(seed, state) {
    const xg = new Alea(seed);
    const prng = xg.next.bind(xg);
    if (state)
        copy(state, xg);
    prng.state = () => copy(xg, {});
    return prng;
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Random
 *
 * Calls that require a pseudorandom number generator.
 * Uses a seed from ctx, and also persists the PRNG
 * state in ctx so that moves can stay pure.
 */
class Random {
    /**
     * constructor
     * @param {object} ctx - The ctx object to initialize from.
     */
    constructor(state) {
        // If we are on the client, the seed is not present.
        // Just use a temporary seed to execute the move without
        // crashing it. The move state itself is discarded,
        // so the actual value doesn't matter.
        this.state = state || { seed: '0' };
        this.used = false;
    }
    /**
     * Generates a new seed from the current date / time.
     */
    static seed() {
        return Date.now().toString(36).slice(-10);
    }
    isUsed() {
        return this.used;
    }
    getState() {
        return this.state;
    }
    /**
     * Generate a random number.
     */
    _random() {
        this.used = true;
        const R = this.state;
        const seed = R.prngstate ? '' : R.seed;
        const rand = alea(seed, R.prngstate);
        const number = rand();
        this.state = {
            ...R,
            prngstate: rand.state(),
        };
        return number;
    }
    api() {
        const random = this._random.bind(this);
        const SpotValue = {
            D4: 4,
            D6: 6,
            D8: 8,
            D10: 10,
            D12: 12,
            D20: 20,
        };
        // Generate functions for predefined dice values D4 - D20.
        const predefined = {};
        for (const key in SpotValue) {
            const spotvalue = SpotValue[key];
            predefined[key] = (diceCount) => {
                return diceCount === undefined
                    ? Math.floor(random() * spotvalue) + 1
                    : Array.from({ length: diceCount }).map(() => Math.floor(random() * spotvalue) + 1);
            };
        }
        function Die(spotvalue = 6, diceCount) {
            return diceCount === undefined
                ? Math.floor(random() * spotvalue) + 1
                : Array.from({ length: diceCount }).map(() => Math.floor(random() * spotvalue) + 1);
        }
        return {
            /**
             * Similar to Die below, but with fixed spot values.
             * Supports passing a diceCount
             *    if not defined, defaults to 1 and returns the value directly.
             *    if defined, returns an array containing the random dice values.
             *
             * D4: (diceCount) => value
             * D6: (diceCount) => value
             * D8: (diceCount) => value
             * D10: (diceCount) => value
             * D12: (diceCount) => value
             * D20: (diceCount) => value
             */
            ...predefined,
            /**
             * Roll a die of specified spot value.
             *
             * @param {number} spotvalue - The die dimension (default: 6).
             * @param {number} diceCount - number of dice to throw.
             *                             if not defined, defaults to 1 and returns the value directly.
             *                             if defined, returns an array containing the random dice values.
             */
            Die,
            /**
             * Generate a random number between 0 and 1.
             */
            Number: () => {
                return random();
            },
            /**
             * Shuffle an array.
             *
             * @param {Array} deck - The array to shuffle. Does not mutate
             *                       the input, but returns the shuffled array.
             */
            Shuffle: (deck) => {
                const clone = [...deck];
                let sourceIndex = deck.length;
                let destinationIndex = 0;
                const shuffled = Array.from({ length: sourceIndex });
                while (sourceIndex) {
                    const randomIndex = Math.trunc(sourceIndex * random());
                    shuffled[destinationIndex++] = clone[randomIndex];
                    clone[randomIndex] = clone[--sourceIndex];
                }
                return shuffled;
            },
            _private: this,
        };
    }
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
const RandomPlugin = {
    name: 'random',
    noClient: ({ api }) => {
        return api._private.isUsed();
    },
    flush: ({ api }) => {
        return api._private.getState();
    },
    api: ({ data }) => {
        const random = new Random(data);
        return random.api();
    },
    setup: ({ game }) => {
        let { seed } = game;
        if (seed === undefined) {
            seed = Random.seed();
        }
        return { seed };
    },
    playerView: () => undefined,
};

var GameMethod;
(function (GameMethod) {
    GameMethod["MOVE"] = "MOVE";
    GameMethod["GAME_ON_END"] = "GAME_ON_END";
    GameMethod["PHASE_ON_BEGIN"] = "PHASE_ON_BEGIN";
    GameMethod["PHASE_ON_END"] = "PHASE_ON_END";
    GameMethod["TURN_ON_BEGIN"] = "TURN_ON_BEGIN";
    GameMethod["TURN_ON_MOVE"] = "TURN_ON_MOVE";
    GameMethod["TURN_ON_END"] = "TURN_ON_END";
})(GameMethod || (GameMethod = {}));

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
var Errors;
(function (Errors) {
    Errors["CalledOutsideHook"] = "Events must be called from moves or the `onBegin`, `onEnd`, and `onMove` hooks.\nThis error probably means you called an event from other game code, like an `endIf` trigger or one of the `turn.order` methods.";
    Errors["EndTurnInOnEnd"] = "`endTurn` is disallowed in `onEnd` hooks \u2014 the turn is already ending.";
    Errors["MaxTurnEndings"] = "Maximum number of turn endings exceeded for this update.\nThis likely means game code is triggering an infinite loop.";
    Errors["PhaseEventInOnEnd"] = "`setPhase` & `endPhase` are disallowed in a phase\u2019s `onEnd` hook \u2014 the phase is already ending.\nIf you\u2019re trying to dynamically choose the next phase when a phase ends, use the phase\u2019s `next` trigger.";
    Errors["StageEventInOnEnd"] = "`setStage`, `endStage` & `setActivePlayers` are disallowed in `onEnd` hooks.";
    Errors["StageEventInPhaseBegin"] = "`setStage`, `endStage` & `setActivePlayers` are disallowed in a phase\u2019s `onBegin` hook.\nUse `setActivePlayers` in a `turn.onBegin` hook or declare stages with `turn.activePlayers` instead.";
    Errors["StageEventInTurnBegin"] = "`setStage` & `endStage` are disallowed in `turn.onBegin`.\nUse `setActivePlayers` or declare stages with `turn.activePlayers` instead.";
})(Errors || (Errors = {}));
/**
 * Events
 */
class Events {
    constructor(flow, ctx, playerID) {
        this.flow = flow;
        this.playerID = playerID;
        this.dispatch = [];
        this.initialTurn = ctx.turn;
        this.updateTurnContext(ctx, undefined);
        // This is an arbitrarily large upper threshold, which could be made
        // configurable via a game option if the need arises.
        this.maxEndedTurnsPerAction = ctx.numPlayers * 100;
    }
    api() {
        const events = {
            _private: this,
        };
        for (const type of this.flow.eventNames) {
            events[type] = (...args) => {
                this.dispatch.push({
                    type,
                    args,
                    phase: this.currentPhase,
                    turn: this.currentTurn,
                    calledFrom: this.currentMethod,
                    // Used to capture a stack trace in case it is needed later.
                    error: new Error('Events Plugin Error'),
                });
            };
        }
        return events;
    }
    isUsed() {
        return this.dispatch.length > 0;
    }
    updateTurnContext(ctx, methodType) {
        this.currentPhase = ctx.phase;
        this.currentTurn = ctx.turn;
        this.currentMethod = methodType;
    }
    unsetCurrentMethod() {
        this.currentMethod = undefined;
    }
    /**
     * Updates ctx with the triggered events.
     * @param {object} state - The state object { G, ctx }.
     */
    update(state) {
        const initialState = state;
        const stateWithError = ({ stack }, message) => ({
            ...initialState,
            plugins: {
                ...initialState.plugins,
                events: {
                    ...initialState.plugins.events,
                    data: { error: message + '\n' + stack },
                },
            },
        });
        EventQueue: for (let i = 0; i < this.dispatch.length; i++) {
            const event = this.dispatch[i];
            const turnHasEnded = event.turn !== state.ctx.turn;
            // This protects against potential infinite loops if specific events are called on hooks.
            // The moment we exceed the defined threshold, we just bail out of all phases.
            const endedTurns = this.currentTurn - this.initialTurn;
            if (endedTurns >= this.maxEndedTurnsPerAction) {
                return stateWithError(event.error, Errors.MaxTurnEndings);
            }
            if (event.calledFrom === undefined) {
                return stateWithError(event.error, Errors.CalledOutsideHook);
            }
            // Stop processing events once the game has finished.
            if (state.ctx.gameover)
                break EventQueue;
            switch (event.type) {
                case 'endStage':
                case 'setStage':
                case 'setActivePlayers': {
                    switch (event.calledFrom) {
                        // Disallow all stage events in onEnd and phase.onBegin hooks.
                        case GameMethod.TURN_ON_END:
                        case GameMethod.PHASE_ON_END:
                            return stateWithError(event.error, Errors.StageEventInOnEnd);
                        case GameMethod.PHASE_ON_BEGIN:
                            return stateWithError(event.error, Errors.StageEventInPhaseBegin);
                        // Disallow setStage & endStage in turn.onBegin hooks.
                        case GameMethod.TURN_ON_BEGIN:
                            if (event.type === 'setActivePlayers')
                                break;
                            return stateWithError(event.error, Errors.StageEventInTurnBegin);
                    }
                    // If the turn already ended, don't try to process stage events.
                    if (turnHasEnded)
                        continue EventQueue;
                    break;
                }
                case 'endTurn': {
                    if (event.calledFrom === GameMethod.TURN_ON_END ||
                        event.calledFrom === GameMethod.PHASE_ON_END) {
                        return stateWithError(event.error, Errors.EndTurnInOnEnd);
                    }
                    // If the turn already ended some other way,
                    // don't try to end the turn again.
                    if (turnHasEnded)
                        continue EventQueue;
                    break;
                }
                case 'endPhase':
                case 'setPhase': {
                    if (event.calledFrom === GameMethod.PHASE_ON_END) {
                        return stateWithError(event.error, Errors.PhaseEventInOnEnd);
                    }
                    // If the phase already ended some other way,
                    // don't try to end the phase again.
                    if (event.phase !== state.ctx.phase)
                        continue EventQueue;
                    break;
                }
            }
            const action = automaticGameEvent(event.type, event.args, this.playerID);
            state = this.flow.processEvent(state, action);
        }
        return state;
    }
}

/*
 * Copyright 2020 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
const EventsPlugin = {
    name: 'events',
    noClient: ({ api }) => api._private.isUsed(),
    isInvalid: ({ data }) => data.error || false,
    // Update the events plugin’s internal turn context each time a move
    // or hook is called. This allows events called after turn or phase
    // endings to dispatch the current turn and phase correctly.
    fnWrap: (method, methodType) => (G, ctx, ...args) => {
        const api = ctx.events;
        if (api)
            api._private.updateTurnContext(ctx, methodType);
        G = method(G, ctx, ...args);
        if (api)
            api._private.unsetCurrentMethod();
        return G;
    },
    dangerouslyFlushRawState: ({ state, api }) => api._private.update(state),
    api: ({ game, ctx, playerID }) => new Events(game.flow, ctx, playerID).api(),
};

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Plugin that makes it possible to add metadata to log entries.
 * During a move, you can set metadata using ctx.log.setMetadata and it will be
 * available on the log entry for that move.
 */
const LogPlugin = {
    name: 'log',
    flush: () => ({}),
    api: ({ data }) => {
        return {
            setMetadata: (metadata) => {
                data.metadata = metadata;
            },
        };
    },
    setup: () => ({}),
};

/**
 * Check if a value can be serialized (e.g. using `JSON.stringify`).
 * Adapted from: https://stackoverflow.com/a/30712764/3829557
 */
function isSerializable(value) {
    // Primitives are OK.
    if (value === undefined ||
        value === null ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string') {
        return true;
    }
    // A non-primitive value that is neither a POJO or an array cannot be serialized.
    if (!isPlainObject(value) && !Array.isArray(value)) {
        return false;
    }
    // Recurse entries if the value is an object or array.
    for (const key in value) {
        if (!isSerializable(value[key]))
            return false;
    }
    return true;
}
/**
 * Plugin that checks whether state is serializable, in order to avoid
 * network serialization bugs.
 */
const SerializablePlugin = {
    name: 'plugin-serializable',
    fnWrap: (move) => (G, ctx, ...args) => {
        const result = move(G, ctx, ...args);
        // Check state in non-production environments.
        if (false) {}
        return result;
    },
};

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
const production = "production" === 'production';
const logfn = production ? () => { } : (...msg) => console.log(...msg);
const errorfn = (...msg) => console.error(...msg);
function info(msg) {
    logfn(`INFO: ${msg}`);
}
function error(error) {
    errorfn('ERROR:', error);
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * List of plugins that are always added.
 */
const CORE_PLUGINS = [ImmerPlugin, RandomPlugin, LogPlugin, SerializablePlugin];
const DEFAULT_PLUGINS = [...CORE_PLUGINS, EventsPlugin];
/**
 * Allow plugins to intercept actions and process them.
 */
const ProcessAction = (state, action, opts) => {
    // TODO(#723): Extend error handling to plugins.
    opts.game.plugins
        .filter((plugin) => plugin.action !== undefined)
        .filter((plugin) => plugin.name === action.payload.type)
        .forEach((plugin) => {
        const name = plugin.name;
        const pluginState = state.plugins[name] || { data: {} };
        const data = plugin.action(pluginState.data, action.payload);
        state = {
            ...state,
            plugins: {
                ...state.plugins,
                [name]: { ...pluginState, data },
            },
        };
    });
    return state;
};
/**
 * The API's created by various plugins are stored in the plugins
 * section of the state object:
 *
 * {
 *   G: {},
 *   ctx: {},
 *   plugins: {
 *     plugin-a: {
 *       data: {},  // this is generated by the plugin at Setup / Flush.
 *       api: {},   // this is ephemeral and generated by Enhance.
 *     }
 *   }
 * }
 *
 * This function takes these API's and stuffs them back into
 * ctx for consumption inside a move function or hook.
 */
const EnhanceCtx = (state) => {
    const ctx = { ...state.ctx };
    const plugins = state.plugins || {};
    Object.entries(plugins).forEach(([name, { api }]) => {
        ctx[name] = api;
    });
    return ctx;
};
/**
 * Applies the provided plugins to the given move / flow function.
 *
 * @param methodToWrap - The move function or hook to apply the plugins to.
 * @param methodType - The type of the move or hook being wrapped.
 * @param plugins - The list of plugins.
 */
const FnWrap = (methodToWrap, methodType, plugins) => {
    return [...CORE_PLUGINS, ...plugins, EventsPlugin]
        .filter((plugin) => plugin.fnWrap !== undefined)
        .reduce((method, { fnWrap }) => fnWrap(method, methodType), methodToWrap);
};
/**
 * Allows the plugin to generate its initial state.
 */
const Setup = (state, opts) => {
    [...DEFAULT_PLUGINS, ...opts.game.plugins]
        .filter((plugin) => plugin.setup !== undefined)
        .forEach((plugin) => {
        const name = plugin.name;
        const data = plugin.setup({
            G: state.G,
            ctx: state.ctx,
            game: opts.game,
        });
        state = {
            ...state,
            plugins: {
                ...state.plugins,
                [name]: { data },
            },
        };
    });
    return state;
};
/**
 * Invokes the plugin before a move or event.
 * The API that the plugin generates is stored inside
 * the `plugins` section of the state (which is subsequently
 * merged into ctx).
 */
const Enhance = (state, opts) => {
    [...DEFAULT_PLUGINS, ...opts.game.plugins]
        .filter((plugin) => plugin.api !== undefined)
        .forEach((plugin) => {
        const name = plugin.name;
        const pluginState = state.plugins[name] || { data: {} };
        const api = plugin.api({
            G: state.G,
            ctx: state.ctx,
            data: pluginState.data,
            game: opts.game,
            playerID: opts.playerID,
        });
        state = {
            ...state,
            plugins: {
                ...state.plugins,
                [name]: { ...pluginState, api },
            },
        };
    });
    return state;
};
/**
 * Allows plugins to update their state after a move / event.
 */
const Flush = (state, opts) => {
    // We flush the events plugin first, then custom plugins and the core plugins.
    // This means custom plugins cannot use the events API but will be available in event hooks.
    // Note that plugins are flushed in reverse, to allow custom plugins calling each other.
    [...CORE_PLUGINS, ...opts.game.plugins, EventsPlugin]
        .reverse()
        .forEach((plugin) => {
        const name = plugin.name;
        const pluginState = state.plugins[name] || { data: {} };
        if (plugin.flush) {
            const newData = plugin.flush({
                G: state.G,
                ctx: state.ctx,
                game: opts.game,
                api: pluginState.api,
                data: pluginState.data,
            });
            state = {
                ...state,
                plugins: {
                    ...state.plugins,
                    [plugin.name]: { data: newData },
                },
            };
        }
        else if (plugin.dangerouslyFlushRawState) {
            state = plugin.dangerouslyFlushRawState({
                state,
                game: opts.game,
                api: pluginState.api,
                data: pluginState.data,
            });
            // Remove everything other than data.
            const data = state.plugins[name].data;
            state = {
                ...state,
                plugins: {
                    ...state.plugins,
                    [plugin.name]: { data },
                },
            };
        }
    });
    return state;
};
/**
 * Allows plugins to indicate if they should not be materialized on the client.
 * This will cause the client to discard the state update and wait for the
 * master instead.
 */
const NoClient = (state, opts) => {
    return [...DEFAULT_PLUGINS, ...opts.game.plugins]
        .filter((plugin) => plugin.noClient !== undefined)
        .map((plugin) => {
        const name = plugin.name;
        const pluginState = state.plugins[name];
        if (pluginState) {
            return plugin.noClient({
                G: state.G,
                ctx: state.ctx,
                game: opts.game,
                api: pluginState.api,
                data: pluginState.data,
            });
        }
        return false;
    })
        .includes(true);
};
/**
 * Allows plugins to indicate if the entire action should be thrown out
 * as invalid. This will cancel the entire state update.
 */
const IsInvalid = (state, opts) => {
    const firstInvalidReturn = [...DEFAULT_PLUGINS, ...opts.game.plugins]
        .filter((plugin) => plugin.isInvalid !== undefined)
        .map((plugin) => {
        const { name } = plugin;
        const pluginState = state.plugins[name];
        const message = plugin.isInvalid({
            G: state.G,
            ctx: state.ctx,
            game: opts.game,
            data: pluginState && pluginState.data,
        });
        return message ? { plugin: name, message } : false;
    })
        .find((value) => value);
    return firstInvalidReturn || false;
};
/**
 * Update plugin state after move/event & check if plugins consider the update to be valid.
 * @returns Tuple of `[updatedState]` or `[originalState, invalidError]`.
 */
const FlushAndValidate = (state, opts) => {
    const updatedState = Flush(state, opts);
    const isInvalid = IsInvalid(updatedState, opts);
    if (!isInvalid)
        return [updatedState];
    const { plugin, message } = isInvalid;
    error(`${plugin} plugin declared action invalid:\n${message}`);
    return [state, isInvalid];
};
/**
 * Allows plugins to customize their data for specific players.
 * For example, a plugin may want to share no data with the client, or
 * want to keep some player data secret from opponents.
 */
const PlayerView = ({ G, ctx, plugins = {} }, { game, playerID }) => {
    [...DEFAULT_PLUGINS, ...game.plugins].forEach(({ name, playerView }) => {
        if (!playerView)
            return;
        const { data } = plugins[name] || { data: {} };
        const newData = playerView({ G, ctx, game, data, playerID });
        plugins = {
            ...plugins,
            [name]: { data: newData },
        };
    });
    return plugins;
};

/**
 * Adjust the given options to use the new minMoves/maxMoves if a legacy moveLimit was given
 * @param options The options object to apply backwards compatibility to
 * @param enforceMinMoves Use moveLimit to set both minMoves and maxMoves
 */
function supportDeprecatedMoveLimit(options, enforceMinMoves = false) {
    if (options.moveLimit) {
        if (enforceMinMoves) {
            options.minMoves = options.moveLimit;
        }
        options.maxMoves = options.moveLimit;
        delete options.moveLimit;
    }
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
function SetActivePlayers(ctx, arg) {
    let activePlayers = {};
    let _prevActivePlayers = [];
    let _nextActivePlayers = null;
    let _activePlayersMinMoves = {};
    let _activePlayersMaxMoves = {};
    if (Array.isArray(arg)) {
        // support a simple array of player IDs as active players
        const value = {};
        arg.forEach((v) => (value[v] = Stage.NULL));
        activePlayers = value;
    }
    else {
        // process active players argument object
        // stages previously did not enforce minMoves, this behaviour is kept intentionally
        supportDeprecatedMoveLimit(arg);
        if (arg.next) {
            _nextActivePlayers = arg.next;
        }
        if (arg.revert) {
            _prevActivePlayers = [
                ...ctx._prevActivePlayers,
                {
                    activePlayers: ctx.activePlayers,
                    _activePlayersMinMoves: ctx._activePlayersMinMoves,
                    _activePlayersMaxMoves: ctx._activePlayersMaxMoves,
                    _activePlayersNumMoves: ctx._activePlayersNumMoves,
                },
            ];
        }
        if (arg.currentPlayer !== undefined) {
            ApplyActivePlayerArgument(activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, ctx.currentPlayer, arg.currentPlayer);
        }
        if (arg.others !== undefined) {
            for (let i = 0; i < ctx.playOrder.length; i++) {
                const id = ctx.playOrder[i];
                if (id !== ctx.currentPlayer) {
                    ApplyActivePlayerArgument(activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, id, arg.others);
                }
            }
        }
        if (arg.all !== undefined) {
            for (let i = 0; i < ctx.playOrder.length; i++) {
                const id = ctx.playOrder[i];
                ApplyActivePlayerArgument(activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, id, arg.all);
            }
        }
        if (arg.value) {
            for (const id in arg.value) {
                ApplyActivePlayerArgument(activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, id, arg.value[id]);
            }
        }
        if (arg.minMoves) {
            for (const id in activePlayers) {
                if (_activePlayersMinMoves[id] === undefined) {
                    _activePlayersMinMoves[id] = arg.minMoves;
                }
            }
        }
        if (arg.maxMoves) {
            for (const id in activePlayers) {
                if (_activePlayersMaxMoves[id] === undefined) {
                    _activePlayersMaxMoves[id] = arg.maxMoves;
                }
            }
        }
    }
    if (Object.keys(activePlayers).length === 0) {
        activePlayers = null;
    }
    if (Object.keys(_activePlayersMinMoves).length === 0) {
        _activePlayersMinMoves = null;
    }
    if (Object.keys(_activePlayersMaxMoves).length === 0) {
        _activePlayersMaxMoves = null;
    }
    const _activePlayersNumMoves = {};
    for (const id in activePlayers) {
        _activePlayersNumMoves[id] = 0;
    }
    return {
        ...ctx,
        activePlayers,
        _activePlayersMinMoves,
        _activePlayersMaxMoves,
        _activePlayersNumMoves,
        _prevActivePlayers,
        _nextActivePlayers,
    };
}
/**
 * Update activePlayers, setting it to previous, next or null values
 * when it becomes empty.
 * @param ctx
 */
function UpdateActivePlayersOnceEmpty(ctx) {
    let { activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, _activePlayersNumMoves, _prevActivePlayers, _nextActivePlayers, } = ctx;
    if (activePlayers && Object.keys(activePlayers).length === 0) {
        if (_nextActivePlayers) {
            ctx = SetActivePlayers(ctx, _nextActivePlayers);
            ({
                activePlayers,
                _activePlayersMinMoves,
                _activePlayersMaxMoves,
                _activePlayersNumMoves,
                _prevActivePlayers,
            } = ctx);
        }
        else if (_prevActivePlayers.length > 0) {
            const lastIndex = _prevActivePlayers.length - 1;
            ({
                activePlayers,
                _activePlayersMinMoves,
                _activePlayersMaxMoves,
                _activePlayersNumMoves,
            } = _prevActivePlayers[lastIndex]);
            _prevActivePlayers = _prevActivePlayers.slice(0, lastIndex);
        }
        else {
            activePlayers = null;
            _activePlayersMinMoves = null;
            _activePlayersMaxMoves = null;
        }
    }
    return {
        ...ctx,
        activePlayers,
        _activePlayersMinMoves,
        _activePlayersMaxMoves,
        _activePlayersNumMoves,
        _prevActivePlayers,
    };
}
/**
 * Apply an active player argument to the given player ID
 * @param {Object} activePlayers
 * @param {Object} _activePlayersMinMoves
 * @param {Object} _activePlayersMaxMoves
 * @param {String} playerID The player to apply the parameter to
 * @param {(String|Object)} arg An active player argument
 */
function ApplyActivePlayerArgument(activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, playerID, arg) {
    if (typeof arg !== 'object' || arg === Stage.NULL) {
        arg = { stage: arg };
    }
    if (arg.stage !== undefined) {
        // stages previously did not enforce minMoves, this behaviour is kept intentionally
        supportDeprecatedMoveLimit(arg);
        activePlayers[playerID] = arg.stage;
        if (arg.minMoves)
            _activePlayersMinMoves[playerID] = arg.minMoves;
        if (arg.maxMoves)
            _activePlayersMaxMoves[playerID] = arg.maxMoves;
    }
}
/**
 * Converts a playOrderPos index into its value in playOrder.
 * @param {Array} playOrder - An array of player ID's.
 * @param {number} playOrderPos - An index into the above.
 */
function getCurrentPlayer(playOrder, playOrderPos) {
    // convert to string in case playOrder is set to number[]
    return playOrder[playOrderPos] + '';
}
/**
 * Called at the start of a turn to initialize turn order state.
 *
 * TODO: This is called inside StartTurn, which is called from
 * both UpdateTurn and StartPhase (so it's called at the beginning
 * of a new phase as well as between turns). We should probably
 * split it into two.
 */
function InitTurnOrderState(state, turn) {
    let { G, ctx } = state;
    const { numPlayers } = ctx;
    const ctxWithAPI = EnhanceCtx(state);
    const order = turn.order;
    let playOrder = [...Array.from({ length: numPlayers })].map((_, i) => i + '');
    if (order.playOrder !== undefined) {
        playOrder = order.playOrder(G, ctxWithAPI);
    }
    const playOrderPos = order.first(G, ctxWithAPI);
    const posType = typeof playOrderPos;
    if (posType !== 'number') {
        error(`invalid value returned by turn.order.first — expected number got ${posType} “${playOrderPos}”.`);
    }
    const currentPlayer = getCurrentPlayer(playOrder, playOrderPos);
    ctx = { ...ctx, currentPlayer, playOrderPos, playOrder };
    ctx = SetActivePlayers(ctx, turn.activePlayers || {});
    return ctx;
}
/**
 * Called at the end of each turn to update the turn order state.
 * @param {object} G - The game object G.
 * @param {object} ctx - The game object ctx.
 * @param {object} turn - A turn object for this phase.
 * @param {string} endTurnArg - An optional argument to endTurn that
                                may specify the next player.
 */
function UpdateTurnOrderState(state, currentPlayer, turn, endTurnArg) {
    const order = turn.order;
    let { G, ctx } = state;
    let playOrderPos = ctx.playOrderPos;
    let endPhase = false;
    if (endTurnArg && endTurnArg !== true) {
        if (typeof endTurnArg !== 'object') {
            error(`invalid argument to endTurn: ${endTurnArg}`);
        }
        Object.keys(endTurnArg).forEach((arg) => {
            switch (arg) {
                case 'remove':
                    currentPlayer = getCurrentPlayer(ctx.playOrder, playOrderPos);
                    break;
                case 'next':
                    playOrderPos = ctx.playOrder.indexOf(endTurnArg.next);
                    currentPlayer = endTurnArg.next;
                    break;
                default:
                    error(`invalid argument to endTurn: ${arg}`);
            }
        });
    }
    else {
        const ctxWithAPI = EnhanceCtx(state);
        const t = order.next(G, ctxWithAPI);
        const type = typeof t;
        if (t !== undefined && type !== 'number') {
            error(`invalid value returned by turn.order.next — expected number or undefined got ${type} “${t}”.`);
        }
        if (t === undefined) {
            endPhase = true;
        }
        else {
            playOrderPos = t;
            currentPlayer = getCurrentPlayer(ctx.playOrder, playOrderPos);
        }
    }
    ctx = {
        ...ctx,
        playOrderPos,
        currentPlayer,
    };
    return { endPhase, ctx };
}
/**
 * Set of different turn orders possible in a phase.
 * These are meant to be passed to the `turn` setting
 * in the flow objects.
 *
 * Each object defines the first player when the phase / game
 * begins, and also a function `next` to determine who the
 * next player is when the turn ends.
 *
 * The phase ends if next() returns undefined.
 */
const TurnOrder = {
    /**
     * DEFAULT
     *
     * The default round-robin turn order.
     */
    DEFAULT: {
        first: (G, ctx) => ctx.turn === 0
            ? ctx.playOrderPos
            : (ctx.playOrderPos + 1) % ctx.playOrder.length,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
    },
    /**
     * RESET
     *
     * Similar to DEFAULT, but starts from 0 each time.
     */
    RESET: {
        first: () => 0,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
    },
    /**
     * CONTINUE
     *
     * Similar to DEFAULT, but starts with the player who ended the last phase.
     */
    CONTINUE: {
        first: (G, ctx) => ctx.playOrderPos,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
    },
    /**
     * ONCE
     *
     * Another round-robin turn order, but goes around just once.
     * The phase ends after all players have played.
     */
    ONCE: {
        first: () => 0,
        next: (G, ctx) => {
            if (ctx.playOrderPos < ctx.playOrder.length - 1) {
                return ctx.playOrderPos + 1;
            }
        },
    },
    /**
     * CUSTOM
     *
     * Identical to DEFAULT, but also sets playOrder at the
     * beginning of the phase.
     *
     * @param {Array} playOrder - The play order.
     */
    CUSTOM: (playOrder) => ({
        playOrder: () => playOrder,
        first: () => 0,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
    }),
    /**
     * CUSTOM_FROM
     *
     * Identical to DEFAULT, but also sets playOrder at the
     * beginning of the phase to a value specified by a field
     * in G.
     *
     * @param {string} playOrderField - Field in G.
     */
    CUSTOM_FROM: (playOrderField) => ({
        playOrder: (G) => G[playOrderField],
        first: () => 0,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
    }),
};
const Stage = {
    NULL: null,
};
const ActivePlayers = {
    /**
     * ALL
     *
     * The turn stays with one player, but any player can play (in any order)
     * until the phase ends.
     */
    ALL: { all: Stage.NULL },
    /**
     * ALL_ONCE
     *
     * The turn stays with one player, but any player can play (once, and in any order).
     * This is typically used in a phase where you want to elicit a response
     * from every player in the game.
     */
    ALL_ONCE: { all: Stage.NULL, minMoves: 1, maxMoves: 1 },
    /**
     * OTHERS
     *
     * The turn stays with one player, and every *other* player can play (in any order)
     * until the phase ends.
     */
    OTHERS: { others: Stage.NULL },
    /**
     * OTHERS_ONCE
     *
     * The turn stays with one player, and every *other* player can play (once, and in any order).
     * This is typically used in a phase where you want to elicit a response
     * from every *other* player in the game.
     */
    OTHERS_ONCE: { others: Stage.NULL, minMoves: 1, maxMoves: 1 },
};



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/reducer-95b86815.js



/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Flow
 *
 * Creates a reducer that updates ctx (analogous to how moves update G).
 */
function Flow({ moves, phases, endIf, onEnd, turn, events, plugins, }) {
    // Attach defaults.
    if (moves === undefined) {
        moves = {};
    }
    if (events === undefined) {
        events = {};
    }
    if (plugins === undefined) {
        plugins = [];
    }
    if (phases === undefined) {
        phases = {};
    }
    if (!endIf)
        endIf = () => undefined;
    if (!onEnd)
        onEnd = (G) => G;
    if (!turn)
        turn = {};
    const phaseMap = { ...phases };
    if ('' in phaseMap) {
        error('cannot specify phase with empty name');
    }
    phaseMap[''] = {};
    const moveMap = {};
    const moveNames = new Set();
    let startingPhase = null;
    Object.keys(moves).forEach((name) => moveNames.add(name));
    const HookWrapper = (hook, hookType) => {
        const withPlugins = FnWrap(hook, hookType, plugins);
        return (state) => {
            const ctxWithAPI = EnhanceCtx(state);
            return withPlugins(state.G, ctxWithAPI);
        };
    };
    const TriggerWrapper = (trigger) => {
        return (state) => {
            const ctxWithAPI = EnhanceCtx(state);
            return trigger(state.G, ctxWithAPI);
        };
    };
    const wrapped = {
        onEnd: HookWrapper(onEnd, GameMethod.GAME_ON_END),
        endIf: TriggerWrapper(endIf),
    };
    for (const phase in phaseMap) {
        const phaseConfig = phaseMap[phase];
        if (phaseConfig.start === true) {
            startingPhase = phase;
        }
        if (phaseConfig.moves !== undefined) {
            for (const move of Object.keys(phaseConfig.moves)) {
                moveMap[phase + '.' + move] = phaseConfig.moves[move];
                moveNames.add(move);
            }
        }
        if (phaseConfig.endIf === undefined) {
            phaseConfig.endIf = () => undefined;
        }
        if (phaseConfig.onBegin === undefined) {
            phaseConfig.onBegin = (G) => G;
        }
        if (phaseConfig.onEnd === undefined) {
            phaseConfig.onEnd = (G) => G;
        }
        if (phaseConfig.turn === undefined) {
            phaseConfig.turn = turn;
        }
        if (phaseConfig.turn.order === undefined) {
            phaseConfig.turn.order = TurnOrder.DEFAULT;
        }
        if (phaseConfig.turn.onBegin === undefined) {
            phaseConfig.turn.onBegin = (G) => G;
        }
        if (phaseConfig.turn.onEnd === undefined) {
            phaseConfig.turn.onEnd = (G) => G;
        }
        if (phaseConfig.turn.endIf === undefined) {
            phaseConfig.turn.endIf = () => false;
        }
        if (phaseConfig.turn.onMove === undefined) {
            phaseConfig.turn.onMove = (G) => G;
        }
        if (phaseConfig.turn.stages === undefined) {
            phaseConfig.turn.stages = {};
        }
        // turns previously treated moveLimit as both minMoves and maxMoves, this behaviour is kept intentionally
        supportDeprecatedMoveLimit(phaseConfig.turn, true);
        for (const stage in phaseConfig.turn.stages) {
            const stageConfig = phaseConfig.turn.stages[stage];
            const moves = stageConfig.moves || {};
            for (const move of Object.keys(moves)) {
                const key = phase + '.' + stage + '.' + move;
                moveMap[key] = moves[move];
                moveNames.add(move);
            }
        }
        phaseConfig.wrapped = {
            onBegin: HookWrapper(phaseConfig.onBegin, GameMethod.PHASE_ON_BEGIN),
            onEnd: HookWrapper(phaseConfig.onEnd, GameMethod.PHASE_ON_END),
            endIf: TriggerWrapper(phaseConfig.endIf),
        };
        phaseConfig.turn.wrapped = {
            onMove: HookWrapper(phaseConfig.turn.onMove, GameMethod.TURN_ON_MOVE),
            onBegin: HookWrapper(phaseConfig.turn.onBegin, GameMethod.TURN_ON_BEGIN),
            onEnd: HookWrapper(phaseConfig.turn.onEnd, GameMethod.TURN_ON_END),
            endIf: TriggerWrapper(phaseConfig.turn.endIf),
        };
        if (typeof phaseConfig.next !== 'function') {
            const { next } = phaseConfig;
            phaseConfig.next = () => next || null;
        }
        phaseConfig.wrapped.next = TriggerWrapper(phaseConfig.next);
    }
    function GetPhase(ctx) {
        return ctx.phase ? phaseMap[ctx.phase] : phaseMap[''];
    }
    function OnMove(s) {
        return s;
    }
    function Process(state, events) {
        const phasesEnded = new Set();
        const turnsEnded = new Set();
        for (let i = 0; i < events.length; i++) {
            const { fn, arg, ...rest } = events[i];
            // Detect a loop of EndPhase calls.
            // This could potentially even be an infinite loop
            // if the endIf condition of each phase blindly
            // returns true. The moment we detect a single
            // loop, we just bail out of all phases.
            if (fn === EndPhase) {
                turnsEnded.clear();
                const phase = state.ctx.phase;
                if (phasesEnded.has(phase)) {
                    const ctx = { ...state.ctx, phase: null };
                    return { ...state, ctx };
                }
                phasesEnded.add(phase);
            }
            // Process event.
            const next = [];
            state = fn(state, {
                ...rest,
                arg,
                next,
            });
            if (fn === EndGame) {
                break;
            }
            // Check if we should end the game.
            const shouldEndGame = ShouldEndGame(state);
            if (shouldEndGame) {
                events.push({
                    fn: EndGame,
                    arg: shouldEndGame,
                    turn: state.ctx.turn,
                    phase: state.ctx.phase,
                    automatic: true,
                });
                continue;
            }
            // Check if we should end the phase.
            const shouldEndPhase = ShouldEndPhase(state);
            if (shouldEndPhase) {
                events.push({
                    fn: EndPhase,
                    arg: shouldEndPhase,
                    turn: state.ctx.turn,
                    phase: state.ctx.phase,
                    automatic: true,
                });
                continue;
            }
            // Check if we should end the turn.
            if ([OnMove, UpdateStage, UpdateActivePlayers].includes(fn)) {
                const shouldEndTurn = ShouldEndTurn(state);
                if (shouldEndTurn) {
                    events.push({
                        fn: EndTurn,
                        arg: shouldEndTurn,
                        turn: state.ctx.turn,
                        phase: state.ctx.phase,
                        automatic: true,
                    });
                    continue;
                }
            }
            events.push(...next);
        }
        return state;
    }
    ///////////
    // Start //
    ///////////
    function StartGame(state, { next }) {
        next.push({ fn: StartPhase });
        return state;
    }
    function StartPhase(state, { next }) {
        let { G, ctx } = state;
        const phaseConfig = GetPhase(ctx);
        // Run any phase setup code provided by the user.
        G = phaseConfig.wrapped.onBegin(state);
        next.push({ fn: StartTurn });
        return { ...state, G, ctx };
    }
    function StartTurn(state, { currentPlayer }) {
        let { ctx } = state;
        const phaseConfig = GetPhase(ctx);
        // Initialize the turn order state.
        if (currentPlayer) {
            ctx = { ...ctx, currentPlayer };
            if (phaseConfig.turn.activePlayers) {
                ctx = SetActivePlayers(ctx, phaseConfig.turn.activePlayers);
            }
        }
        else {
            // This is only called at the beginning of the phase
            // when there is no currentPlayer yet.
            ctx = InitTurnOrderState(state, phaseConfig.turn);
        }
        const turn = ctx.turn + 1;
        ctx = { ...ctx, turn, numMoves: 0, _prevActivePlayers: [] };
        const G = phaseConfig.turn.wrapped.onBegin({ ...state, ctx });
        return { ...state, G, ctx, _undo: [], _redo: [] };
    }
    ////////////
    // Update //
    ////////////
    function UpdatePhase(state, { arg, next, phase }) {
        const phaseConfig = GetPhase({ phase });
        let { ctx } = state;
        if (arg && arg.next) {
            if (arg.next in phaseMap) {
                ctx = { ...ctx, phase: arg.next };
            }
            else {
                error('invalid phase: ' + arg.next);
                return state;
            }
        }
        else {
            ctx = { ...ctx, phase: phaseConfig.wrapped.next(state) || null };
        }
        state = { ...state, ctx };
        // Start the new phase.
        next.push({ fn: StartPhase });
        return state;
    }
    function UpdateTurn(state, { arg, currentPlayer, next }) {
        let { G, ctx } = state;
        const phaseConfig = GetPhase(ctx);
        // Update turn order state.
        const { endPhase, ctx: newCtx } = UpdateTurnOrderState(state, currentPlayer, phaseConfig.turn, arg);
        ctx = newCtx;
        state = { ...state, G, ctx };
        if (endPhase) {
            next.push({ fn: EndPhase, turn: ctx.turn, phase: ctx.phase });
        }
        else {
            next.push({ fn: StartTurn, currentPlayer: ctx.currentPlayer });
        }
        return state;
    }
    function UpdateStage(state, { arg, playerID }) {
        if (typeof arg === 'string' || arg === Stage.NULL) {
            arg = { stage: arg };
        }
        if (typeof arg !== 'object')
            return state;
        // `arg` should be of type `StageArg`, loose typing as `any` here for historic reasons
        // stages previously did not enforce minMoves, this behaviour is kept intentionally
        supportDeprecatedMoveLimit(arg);
        let { ctx } = state;
        let { activePlayers, _activePlayersMinMoves, _activePlayersMaxMoves, _activePlayersNumMoves, } = ctx;
        // Checking if stage is valid, even Stage.NULL
        if (arg.stage !== undefined) {
            if (activePlayers === null) {
                activePlayers = {};
            }
            activePlayers[playerID] = arg.stage;
            _activePlayersNumMoves[playerID] = 0;
            if (arg.minMoves) {
                if (_activePlayersMinMoves === null) {
                    _activePlayersMinMoves = {};
                }
                _activePlayersMinMoves[playerID] = arg.minMoves;
            }
            if (arg.maxMoves) {
                if (_activePlayersMaxMoves === null) {
                    _activePlayersMaxMoves = {};
                }
                _activePlayersMaxMoves[playerID] = arg.maxMoves;
            }
        }
        ctx = {
            ...ctx,
            activePlayers,
            _activePlayersMinMoves,
            _activePlayersMaxMoves,
            _activePlayersNumMoves,
        };
        return { ...state, ctx };
    }
    function UpdateActivePlayers(state, { arg }) {
        return { ...state, ctx: SetActivePlayers(state.ctx, arg) };
    }
    ///////////////
    // ShouldEnd //
    ///////////////
    function ShouldEndGame(state) {
        return wrapped.endIf(state);
    }
    function ShouldEndPhase(state) {
        const phaseConfig = GetPhase(state.ctx);
        return phaseConfig.wrapped.endIf(state);
    }
    function ShouldEndTurn(state) {
        const phaseConfig = GetPhase(state.ctx);
        // End the turn if the required number of moves has been made.
        const currentPlayerMoves = state.ctx.numMoves || 0;
        if (phaseConfig.turn.maxMoves &&
            currentPlayerMoves >= phaseConfig.turn.maxMoves) {
            return true;
        }
        return phaseConfig.turn.wrapped.endIf(state);
    }
    /////////
    // End //
    /////////
    function EndGame(state, { arg, phase }) {
        state = EndPhase(state, { phase });
        if (arg === undefined) {
            arg = true;
        }
        state = { ...state, ctx: { ...state.ctx, gameover: arg } };
        // Run game end hook.
        const G = wrapped.onEnd(state);
        return { ...state, G };
    }
    function EndPhase(state, { arg, next, turn: initialTurn, automatic }) {
        // End the turn first.
        state = EndTurn(state, { turn: initialTurn, force: true, automatic: true });
        const { phase, turn } = state.ctx;
        if (next) {
            next.push({ fn: UpdatePhase, arg, phase });
        }
        // If we aren't in a phase, there is nothing else to do.
        if (phase === null) {
            return state;
        }
        // Run any cleanup code for the phase that is about to end.
        const phaseConfig = GetPhase(state.ctx);
        const G = phaseConfig.wrapped.onEnd(state);
        // Reset the phase.
        const ctx = { ...state.ctx, phase: null };
        // Add log entry.
        const action = gameEvent('endPhase', arg);
        const { _stateID } = state;
        const logEntry = { action, _stateID, turn, phase };
        if (automatic)
            logEntry.automatic = true;
        const deltalog = [...(state.deltalog || []), logEntry];
        return { ...state, G, ctx, deltalog };
    }
    function EndTurn(state, { arg, next, turn: initialTurn, force, automatic, playerID }) {
        // This is not the turn that EndTurn was originally
        // called for. The turn was probably ended some other way.
        if (initialTurn !== state.ctx.turn) {
            return state;
        }
        const { currentPlayer, numMoves, phase, turn } = state.ctx;
        const phaseConfig = GetPhase(state.ctx);
        // Prevent ending the turn if minMoves haven't been reached.
        const currentPlayerMoves = numMoves || 0;
        if (!force &&
            phaseConfig.turn.minMoves &&
            currentPlayerMoves < phaseConfig.turn.minMoves) {
            info(`cannot end turn before making ${phaseConfig.turn.minMoves} moves`);
            return state;
        }
        // Run turn-end triggers.
        const G = phaseConfig.turn.wrapped.onEnd(state);
        if (next) {
            next.push({ fn: UpdateTurn, arg, currentPlayer });
        }
        // Reset activePlayers.
        let ctx = { ...state.ctx, activePlayers: null };
        // Remove player from playerOrder
        if (arg && arg.remove) {
            playerID = playerID || currentPlayer;
            const playOrder = ctx.playOrder.filter((i) => i != playerID);
            const playOrderPos = ctx.playOrderPos > playOrder.length - 1 ? 0 : ctx.playOrderPos;
            ctx = { ...ctx, playOrder, playOrderPos };
            if (playOrder.length === 0) {
                next.push({ fn: EndPhase, turn, phase });
                return state;
            }
        }
        // Create log entry.
        const action = gameEvent('endTurn', arg);
        const { _stateID } = state;
        const logEntry = { action, _stateID, turn, phase };
        if (automatic)
            logEntry.automatic = true;
        const deltalog = [...(state.deltalog || []), logEntry];
        return { ...state, G, ctx, deltalog, _undo: [], _redo: [] };
    }
    function EndStage(state, { arg, next, automatic, playerID }) {
        playerID = playerID || state.ctx.currentPlayer;
        let { ctx, _stateID } = state;
        let { activePlayers, _activePlayersNumMoves, _activePlayersMinMoves, _activePlayersMaxMoves, phase, turn, } = ctx;
        const playerInStage = activePlayers !== null && playerID in activePlayers;
        const phaseConfig = GetPhase(ctx);
        if (!arg && playerInStage) {
            const stage = phaseConfig.turn.stages[activePlayers[playerID]];
            if (stage && stage.next) {
                arg = stage.next;
            }
        }
        // Checking if arg is a valid stage, even Stage.NULL
        if (next) {
            next.push({ fn: UpdateStage, arg, playerID });
        }
        // If player isn’t in a stage, there is nothing else to do.
        if (!playerInStage)
            return state;
        // Prevent ending the stage if minMoves haven't been reached.
        const currentPlayerMoves = _activePlayersNumMoves[playerID] || 0;
        if (_activePlayersMinMoves &&
            _activePlayersMinMoves[playerID] &&
            currentPlayerMoves < _activePlayersMinMoves[playerID]) {
            info(`cannot end stage before making ${_activePlayersMinMoves[playerID]} moves`);
            return state;
        }
        // Remove player from activePlayers.
        activePlayers = { ...activePlayers };
        delete activePlayers[playerID];
        if (_activePlayersMinMoves) {
            // Remove player from _activePlayersMinMoves.
            _activePlayersMinMoves = { ..._activePlayersMinMoves };
            delete _activePlayersMinMoves[playerID];
        }
        if (_activePlayersMaxMoves) {
            // Remove player from _activePlayersMaxMoves.
            _activePlayersMaxMoves = { ..._activePlayersMaxMoves };
            delete _activePlayersMaxMoves[playerID];
        }
        ctx = UpdateActivePlayersOnceEmpty({
            ...ctx,
            activePlayers,
            _activePlayersMinMoves,
            _activePlayersMaxMoves,
        });
        // Create log entry.
        const action = gameEvent('endStage', arg);
        const logEntry = { action, _stateID, turn, phase };
        if (automatic)
            logEntry.automatic = true;
        const deltalog = [...(state.deltalog || []), logEntry];
        return { ...state, ctx, deltalog };
    }
    /**
     * Retrieves the relevant move that can be played by playerID.
     *
     * If ctx.activePlayers is set (i.e. one or more players are in some stage),
     * then it attempts to find the move inside the stages config for
     * that turn. If the stage for a player is '', then the player is
     * allowed to make a move (as determined by the phase config), but
     * isn't restricted to a particular set as defined in the stage config.
     *
     * If not, it then looks for the move inside the phase.
     *
     * If it doesn't find the move there, it looks at the global move definition.
     *
     * @param {object} ctx
     * @param {string} name
     * @param {string} playerID
     */
    function GetMove(ctx, name, playerID) {
        const phaseConfig = GetPhase(ctx);
        const stages = phaseConfig.turn.stages;
        const { activePlayers } = ctx;
        if (activePlayers &&
            activePlayers[playerID] !== undefined &&
            activePlayers[playerID] !== Stage.NULL &&
            stages[activePlayers[playerID]] !== undefined &&
            stages[activePlayers[playerID]].moves !== undefined) {
            // Check if moves are defined for the player's stage.
            const stage = stages[activePlayers[playerID]];
            const moves = stage.moves;
            if (name in moves) {
                return moves[name];
            }
        }
        else if (phaseConfig.moves) {
            // Check if moves are defined for the current phase.
            if (name in phaseConfig.moves) {
                return phaseConfig.moves[name];
            }
        }
        else if (name in moves) {
            // Check for the move globally.
            return moves[name];
        }
        return null;
    }
    function ProcessMove(state, action) {
        const { playerID, type } = action;
        const { currentPlayer, activePlayers, _activePlayersMaxMoves } = state.ctx;
        const move = GetMove(state.ctx, type, playerID);
        const shouldCount = !move || typeof move === 'function' || move.noLimit !== true;
        let { numMoves, _activePlayersNumMoves } = state.ctx;
        if (shouldCount) {
            if (playerID === currentPlayer)
                numMoves++;
            if (activePlayers)
                _activePlayersNumMoves[playerID]++;
        }
        state = {
            ...state,
            ctx: {
                ...state.ctx,
                numMoves,
                _activePlayersNumMoves,
            },
        };
        if (_activePlayersMaxMoves &&
            _activePlayersNumMoves[playerID] >= _activePlayersMaxMoves[playerID]) {
            state = EndStage(state, { playerID, automatic: true });
        }
        const phaseConfig = GetPhase(state.ctx);
        const G = phaseConfig.turn.wrapped.onMove({
            ...state,
            ctx: { ...state.ctx, playerID },
        });
        state = { ...state, G };
        const events = [{ fn: OnMove }];
        return Process(state, events);
    }
    function SetStageEvent(state, playerID, arg) {
        return Process(state, [{ fn: EndStage, arg, playerID }]);
    }
    function EndStageEvent(state, playerID) {
        return Process(state, [{ fn: EndStage, playerID }]);
    }
    function SetActivePlayersEvent(state, _playerID, arg) {
        return Process(state, [{ fn: UpdateActivePlayers, arg }]);
    }
    function SetPhaseEvent(state, _playerID, newPhase) {
        return Process(state, [
            {
                fn: EndPhase,
                phase: state.ctx.phase,
                turn: state.ctx.turn,
                arg: { next: newPhase },
            },
        ]);
    }
    function EndPhaseEvent(state) {
        return Process(state, [
            { fn: EndPhase, phase: state.ctx.phase, turn: state.ctx.turn },
        ]);
    }
    function EndTurnEvent(state, _playerID, arg) {
        return Process(state, [
            { fn: EndTurn, turn: state.ctx.turn, phase: state.ctx.phase, arg },
        ]);
    }
    function PassEvent(state, _playerID, arg) {
        return Process(state, [
            {
                fn: EndTurn,
                turn: state.ctx.turn,
                phase: state.ctx.phase,
                force: true,
                arg,
            },
        ]);
    }
    function EndGameEvent(state, _playerID, arg) {
        return Process(state, [
            { fn: EndGame, turn: state.ctx.turn, phase: state.ctx.phase, arg },
        ]);
    }
    const eventHandlers = {
        endStage: EndStageEvent,
        setStage: SetStageEvent,
        endTurn: EndTurnEvent,
        pass: PassEvent,
        endPhase: EndPhaseEvent,
        setPhase: SetPhaseEvent,
        endGame: EndGameEvent,
        setActivePlayers: SetActivePlayersEvent,
    };
    const enabledEventNames = [];
    if (events.endTurn !== false) {
        enabledEventNames.push('endTurn');
    }
    if (events.pass !== false) {
        enabledEventNames.push('pass');
    }
    if (events.endPhase !== false) {
        enabledEventNames.push('endPhase');
    }
    if (events.setPhase !== false) {
        enabledEventNames.push('setPhase');
    }
    if (events.endGame !== false) {
        enabledEventNames.push('endGame');
    }
    if (events.setActivePlayers !== false) {
        enabledEventNames.push('setActivePlayers');
    }
    if (events.endStage !== false) {
        enabledEventNames.push('endStage');
    }
    if (events.setStage !== false) {
        enabledEventNames.push('setStage');
    }
    function ProcessEvent(state, action) {
        const { type, playerID, args } = action.payload;
        if (typeof eventHandlers[type] !== 'function')
            return state;
        return eventHandlers[type](state, playerID, ...(Array.isArray(args) ? args : [args]));
    }
    function IsPlayerActive(_G, ctx, playerID) {
        if (ctx.activePlayers) {
            return playerID in ctx.activePlayers;
        }
        return ctx.currentPlayer === playerID;
    }
    return {
        ctx: (numPlayers) => ({
            numPlayers,
            turn: 0,
            currentPlayer: '0',
            playOrder: [...Array.from({ length: numPlayers })].map((_, i) => i + ''),
            playOrderPos: 0,
            phase: startingPhase,
            activePlayers: null,
        }),
        init: (state) => {
            return Process(state, [{ fn: StartGame }]);
        },
        isPlayerActive: IsPlayerActive,
        eventHandlers,
        eventNames: Object.keys(eventHandlers),
        enabledEventNames,
        moveMap,
        moveNames: [...moveNames.values()],
        processMove: ProcessMove,
        processEvent: ProcessEvent,
        getMove: GetMove,
    };
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
function IsProcessed(game) {
    return game.processMove !== undefined;
}
/**
 * Helper to generate the game move reducer. The returned
 * reducer has the following signature:
 *
 * (G, action, ctx) => {}
 *
 * You can roll your own if you like, or use any Redux
 * addon to generate such a reducer.
 *
 * The convention used in this framework is to
 * have action.type contain the name of the move, and
 * action.args contain any additional arguments as an
 * Array.
 */
function ProcessGameConfig(game) {
    // The Game() function has already been called on this
    // config object, so just pass it through.
    if (IsProcessed(game)) {
        return game;
    }
    if (game.name === undefined)
        game.name = 'default';
    if (game.deltaState === undefined)
        game.deltaState = false;
    if (game.disableUndo === undefined)
        game.disableUndo = false;
    if (game.setup === undefined)
        game.setup = () => ({});
    if (game.moves === undefined)
        game.moves = {};
    if (game.playerView === undefined)
        game.playerView = (G) => G;
    if (game.plugins === undefined)
        game.plugins = [];
    game.plugins.forEach((plugin) => {
        if (plugin.name === undefined) {
            throw new Error('Plugin missing name attribute');
        }
        if (plugin.name.includes(' ')) {
            throw new Error(plugin.name + ': Plugin name must not include spaces');
        }
    });
    if (game.name.includes(' ')) {
        throw new Error(game.name + ': Game name must not include spaces');
    }
    const flow = Flow(game);
    return {
        ...game,
        flow,
        moveNames: flow.moveNames,
        pluginNames: game.plugins.map((p) => p.name),
        processMove: (state, action) => {
            let moveFn = flow.getMove(state.ctx, action.type, action.playerID);
            if (IsLongFormMove(moveFn)) {
                moveFn = moveFn.move;
            }
            if (moveFn instanceof Function) {
                const fn = FnWrap(moveFn, GameMethod.MOVE, game.plugins);
                const ctxWithAPI = {
                    ...EnhanceCtx(state),
                    playerID: action.playerID,
                };
                let args = [];
                if (action.args !== undefined) {
                    args = Array.isArray(action.args) ? action.args : [action.args];
                }
                return fn(state.G, ctxWithAPI, ...args);
            }
            error(`invalid move object: ${action.type}`);
            return state.G;
        },
    };
}
function IsLongFormMove(move) {
    return move instanceof Object && move.move !== undefined;
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
var UpdateErrorType;
(function (UpdateErrorType) {
    // The action’s credentials were missing or invalid
    UpdateErrorType["UnauthorizedAction"] = "update/unauthorized_action";
    // The action’s matchID was not found
    UpdateErrorType["MatchNotFound"] = "update/match_not_found";
    // Could not apply Patch operation (rfc6902).
    UpdateErrorType["PatchFailed"] = "update/patch_failed";
})(UpdateErrorType || (UpdateErrorType = {}));
var ActionErrorType;
(function (ActionErrorType) {
    // The action contained a stale state ID
    ActionErrorType["StaleStateId"] = "action/stale_state_id";
    // The requested move is unknown or not currently available
    ActionErrorType["UnavailableMove"] = "action/unavailable_move";
    // The move declared it was invalid (INVALID_MOVE constant)
    ActionErrorType["InvalidMove"] = "action/invalid_move";
    // The player making the action is not currently active
    ActionErrorType["InactivePlayer"] = "action/inactive_player";
    // The game has finished
    ActionErrorType["GameOver"] = "action/gameover";
    // The requested action is disabled (e.g. undo/redo, events)
    ActionErrorType["ActionDisabled"] = "action/action_disabled";
    // The requested action is not currently possible
    ActionErrorType["ActionInvalid"] = "action/action_invalid";
    // The requested action was declared invalid by a plugin
    ActionErrorType["PluginActionInvalid"] = "action/plugin_invalid";
})(ActionErrorType || (ActionErrorType = {}));

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Check if the payload for the passed action contains a playerID.
 */
const actionHasPlayerID = (action) => action.payload.playerID !== null && action.payload.playerID !== undefined;
/**
 * Returns true if a move can be undone.
 */
const CanUndoMove = (G, ctx, move) => {
    function HasUndoable(move) {
        return move.undoable !== undefined;
    }
    function IsFunction(undoable) {
        return undoable instanceof Function;
    }
    if (!HasUndoable(move)) {
        return true;
    }
    if (IsFunction(move.undoable)) {
        return move.undoable(G, ctx);
    }
    return move.undoable;
};
/**
 * Update the undo and redo stacks for a move or event.
 */
function updateUndoRedoState(state, opts) {
    if (opts.game.disableUndo)
        return state;
    const undoEntry = {
        G: state.G,
        ctx: state.ctx,
        plugins: state.plugins,
        playerID: opts.action.payload.playerID || state.ctx.currentPlayer,
    };
    if (opts.action.type === 'MAKE_MOVE') {
        undoEntry.moveType = opts.action.payload.type;
    }
    return {
        ...state,
        _undo: [...state._undo, undoEntry],
        // Always reset redo stack when making a move or event
        _redo: [],
    };
}
/**
 * Process state, adding the initial deltalog for this action.
 */
function initializeDeltalog(state, action, move) {
    // Create a log entry for this action.
    const logEntry = {
        action,
        _stateID: state._stateID,
        turn: state.ctx.turn,
        phase: state.ctx.phase,
    };
    const pluginLogMetadata = state.plugins.log.data.metadata;
    if (pluginLogMetadata !== undefined) {
        logEntry.metadata = pluginLogMetadata;
    }
    if (typeof move === 'object' && move.redact === true) {
        logEntry.redact = true;
    }
    return {
        ...state,
        deltalog: [logEntry],
    };
}
/**
 * Update plugin state after move/event & check if plugins consider the action to be valid.
 * @param state Current version of state in the reducer.
 * @param oldState State to revert to in case of error.
 * @param pluginOpts Plugin configuration options.
 * @returns Tuple of the new state updated after flushing plugins and the old
 * state augmented with an error if a plugin declared the action invalid.
 */
function flushAndValidatePlugins(state, oldState, pluginOpts) {
    const [newState, isInvalid] = FlushAndValidate(state, pluginOpts);
    if (!isInvalid)
        return [newState];
    return [
        newState,
        WithError(oldState, ActionErrorType.PluginActionInvalid, isInvalid),
    ];
}
/**
 * ExtractTransientsFromState
 *
 * Split out transients from the a TransientState
 */
function ExtractTransients(transientState) {
    if (!transientState) {
        // We preserve null for the state for legacy callers, but the transient
        // field should be undefined if not present to be consistent with the
        // code path below.
        return [null, undefined];
    }
    const { transients, ...state } = transientState;
    return [state, transients];
}
/**
 * WithError
 *
 * Augment a State instance with transient error information.
 */
function WithError(state, errorType, payload) {
    const error = {
        type: errorType,
        payload,
    };
    return {
        ...state,
        transients: {
            error,
        },
    };
}
/**
 * Middleware for processing TransientState associated with the reducer
 * returned by CreateGameReducer.
 * This should pretty much be used everywhere you want realistic state
 * transitions and error handling.
 */
const TransientHandlingMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    switch (action.type) {
        case STRIP_TRANSIENTS: {
            return result;
        }
        default: {
            const [, transients] = ExtractTransients(store.getState());
            if (typeof transients !== 'undefined') {
                store.dispatch(stripTransients());
                // Dev Note: If parent middleware needs to correlate the spawned
                // StripTransients action to the triggering action, instrument here.
                //
                // This is a bit tricky; for more details, see:
                //   https://github.com/boardgameio/boardgame.io/pull/940#discussion_r636200648
                return {
                    ...result,
                    transients,
                };
            }
            return result;
        }
    }
};
/**
 * CreateGameReducer
 *
 * Creates the main game state reducer.
 */
function reducer_95b86815_CreateGameReducer({ game, isClient, }) {
    game = ProcessGameConfig(game);
    /**
     * GameReducer
     *
     * Redux reducer that maintains the overall game state.
     * @param {object} state - The state before the action.
     * @param {object} action - A Redux action.
     */
    return (stateWithTransients = null, action) => {
        let [state /*, transients */] = ExtractTransients(stateWithTransients);
        switch (action.type) {
            case STRIP_TRANSIENTS: {
                // This action indicates that transient metadata in the state has been
                // consumed and should now be stripped from the state..
                return state;
            }
            case GAME_EVENT: {
                state = { ...state, deltalog: [] };
                // Process game events only on the server.
                // These events like `endTurn` typically
                // contain code that may rely on secret state
                // and cannot be computed on the client.
                if (isClient) {
                    return state;
                }
                // Disallow events once the game is over.
                if (state.ctx.gameover !== undefined) {
                    error(`cannot call event after game end`);
                    return WithError(state, ActionErrorType.GameOver);
                }
                // Ignore the event if the player isn't active.
                if (actionHasPlayerID(action) &&
                    !game.flow.isPlayerActive(state.G, state.ctx, action.payload.playerID)) {
                    error(`disallowed event: ${action.payload.type}`);
                    return WithError(state, ActionErrorType.InactivePlayer);
                }
                // Execute plugins.
                state = Enhance(state, {
                    game,
                    isClient: false,
                    playerID: action.payload.playerID,
                });
                // Process event.
                let newState = game.flow.processEvent(state, action);
                // Execute plugins.
                let stateWithError;
                [newState, stateWithError] = flushAndValidatePlugins(newState, state, {
                    game,
                    isClient: false,
                });
                if (stateWithError)
                    return stateWithError;
                // Update undo / redo state.
                newState = updateUndoRedoState(newState, { game, action });
                return { ...newState, _stateID: state._stateID + 1 };
            }
            case MAKE_MOVE: {
                const oldState = (state = { ...state, deltalog: [] });
                // Check whether the move is allowed at this time.
                const move = game.flow.getMove(state.ctx, action.payload.type, action.payload.playerID || state.ctx.currentPlayer);
                if (move === null) {
                    error(`disallowed move: ${action.payload.type}`);
                    return WithError(state, ActionErrorType.UnavailableMove);
                }
                // Don't run move on client if move says so.
                if (isClient && move.client === false) {
                    return state;
                }
                // Disallow moves once the game is over.
                if (state.ctx.gameover !== undefined) {
                    error(`cannot make move after game end`);
                    return WithError(state, ActionErrorType.GameOver);
                }
                // Ignore the move if the player isn't active.
                if (actionHasPlayerID(action) &&
                    !game.flow.isPlayerActive(state.G, state.ctx, action.payload.playerID)) {
                    error(`disallowed move: ${action.payload.type}`);
                    return WithError(state, ActionErrorType.InactivePlayer);
                }
                // Execute plugins.
                state = Enhance(state, {
                    game,
                    isClient,
                    playerID: action.payload.playerID,
                });
                // Process the move.
                const G = game.processMove(state, action.payload);
                // The game declared the move as invalid.
                if (G === INVALID_MOVE) {
                    error(`invalid move: ${action.payload.type} args: ${action.payload.args}`);
                    // TODO(#723): Marshal a nice error payload with the processed move.
                    return WithError(state, ActionErrorType.InvalidMove);
                }
                const newState = { ...state, G };
                // Some plugin indicated that it is not suitable to be
                // materialized on the client (and must wait for the server
                // response instead).
                if (isClient && NoClient(newState, { game })) {
                    return state;
                }
                state = newState;
                // If we're on the client, just process the move
                // and no triggers in multiplayer mode.
                // These will be processed on the server, which
                // will send back a state update.
                if (isClient) {
                    let stateWithError;
                    [state, stateWithError] = flushAndValidatePlugins(state, oldState, {
                        game,
                        isClient: true,
                    });
                    if (stateWithError)
                        return stateWithError;
                    return {
                        ...state,
                        _stateID: state._stateID + 1,
                    };
                }
                // On the server, construct the deltalog.
                state = initializeDeltalog(state, action, move);
                // Allow the flow reducer to process any triggers that happen after moves.
                state = game.flow.processMove(state, action.payload);
                let stateWithError;
                [state, stateWithError] = flushAndValidatePlugins(state, oldState, {
                    game,
                });
                if (stateWithError)
                    return stateWithError;
                // Update undo / redo state.
                state = updateUndoRedoState(state, { game, action });
                return {
                    ...state,
                    _stateID: state._stateID + 1,
                };
            }
            case RESET:
            case UPDATE:
            case SYNC: {
                return action.state;
            }
            case UNDO: {
                state = { ...state, deltalog: [] };
                if (game.disableUndo) {
                    error('Undo is not enabled');
                    return WithError(state, ActionErrorType.ActionDisabled);
                }
                const { G, ctx, _undo, _redo, _stateID } = state;
                if (_undo.length < 2) {
                    error(`No moves to undo`);
                    return WithError(state, ActionErrorType.ActionInvalid);
                }
                const last = _undo[_undo.length - 1];
                const restore = _undo[_undo.length - 2];
                // Only allow players to undo their own moves.
                if (actionHasPlayerID(action) &&
                    action.payload.playerID !== last.playerID) {
                    error(`Cannot undo other players' moves`);
                    return WithError(state, ActionErrorType.ActionInvalid);
                }
                // If undoing a move, check it is undoable.
                if (last.moveType) {
                    const lastMove = game.flow.getMove(restore.ctx, last.moveType, last.playerID);
                    if (!CanUndoMove(G, ctx, lastMove)) {
                        error(`Move cannot be undone`);
                        return WithError(state, ActionErrorType.ActionInvalid);
                    }
                }
                state = initializeDeltalog(state, action);
                return {
                    ...state,
                    G: restore.G,
                    ctx: restore.ctx,
                    plugins: restore.plugins,
                    _stateID: _stateID + 1,
                    _undo: _undo.slice(0, -1),
                    _redo: [last, ..._redo],
                };
            }
            case REDO: {
                state = { ...state, deltalog: [] };
                if (game.disableUndo) {
                    error('Redo is not enabled');
                    return WithError(state, ActionErrorType.ActionDisabled);
                }
                const { _undo, _redo, _stateID } = state;
                if (_redo.length === 0) {
                    error(`No moves to redo`);
                    return WithError(state, ActionErrorType.ActionInvalid);
                }
                const first = _redo[0];
                // Only allow players to redo their own undos.
                if (actionHasPlayerID(action) &&
                    action.payload.playerID !== first.playerID) {
                    error(`Cannot redo other players' moves`);
                    return WithError(state, ActionErrorType.ActionInvalid);
                }
                state = initializeDeltalog(state, action);
                return {
                    ...state,
                    G: first.G,
                    ctx: first.ctx,
                    plugins: first.plugins,
                    _stateID: _stateID + 1,
                    _undo: [..._undo, first],
                    _redo: _redo.slice(1),
                };
            }
            case PLUGIN: {
                // TODO(#723): Expose error semantics to plugin processing.
                return ProcessAction(state, action, { game });
            }
            case PATCH: {
                const oldState = state;
                const newState = JSON.parse(JSON.stringify(oldState));
                const patchError = (0,rfc6902/* applyPatch */.af)(newState, action.patch);
                const hasError = patchError.some((entry) => entry !== null);
                if (hasError) {
                    error(`Patch ${JSON.stringify(action.patch)} apply failed`);
                    return WithError(oldState, UpdateErrorType.PatchFailed, patchError);
                }
                else {
                    return newState;
                }
            }
            default: {
                return state;
            }
        }
    };
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/initialize-6ecd151b.js



/*
 * Copyright 2020 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Creates the initial game state.
 */
function InitializeGame({ game, numPlayers, setupData, }) {
    game = ProcessGameConfig(game);
    if (!numPlayers) {
        numPlayers = 2;
    }
    const ctx = game.flow.ctx(numPlayers);
    let state = {
        // User managed state.
        G: {},
        // Framework managed state.
        ctx,
        // Plugin related state.
        plugins: {},
    };
    // Run plugins over initial state.
    state = Setup(state, { game });
    state = Enhance(state, { game, playerID: undefined });
    const enhancedCtx = EnhanceCtx(state);
    state.G = game.setup(enhancedCtx, setupData);
    let initial = {
        ...state,
        // List of {G, ctx} pairs that can be undone.
        _undo: [],
        // List of {G, ctx} pairs that can be redone.
        _redo: [],
        // A monotonically non-decreasing ID to ensure that
        // state updates are only allowed from clients that
        // are at the same version that the server.
        _stateID: 0,
    };
    initial = game.flow.init(initial);
    [initial] = FlushAndValidate(initial, { game });
    // Initialize undo stack.
    if (!game.disableUndo) {
        initial._undo = [
            {
                G: initial.G,
                ctx: initial.ctx,
                plugins: initial.plugins,
            },
        ];
    }
    return initial;
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/transport-ce07b771.js
/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
class Transport {
    constructor({ transportDataCallback, gameName, playerID, matchID, credentials, numPlayers, }) {
        /** Callback to let the client know when the connection status has changed. */
        this.connectionStatusCallback = () => { };
        this.isConnected = false;
        this.transportDataCallback = transportDataCallback;
        this.gameName = gameName || 'default';
        this.playerID = playerID || null;
        this.matchID = matchID || 'default';
        this.credentials = credentials;
        this.numPlayers = numPlayers || 2;
    }
    /** Subscribe to connection state changes. */
    subscribeToConnectionStatus(fn) {
        this.connectionStatusCallback = fn;
    }
    /** Transport implementations should call this when they connect/disconnect. */
    setConnectionStatus(isConnected) {
        this.isConnected = isConnected;
        this.connectionStatusCallback();
    }
    /** Transport implementations should call this when they receive data from a master. */
    notifyClient(data) {
        this.transportDataCallback(data);
    }
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/client-b9540450.js








/**
 * This class doesn’t do anything, but simplifies the client class by providing
 * dummy functions to call, so we don’t need to mock them in the client.
 */
class DummyImpl extends Transport {
    connect() { }
    disconnect() { }
    sendAction() { }
    sendChatMessage() { }
    requestSync() { }
    updateCredentials() { }
    updateMatchID() { }
    updatePlayerID() { }
}
const DummyTransport = (opts) => new DummyImpl(opts);

/**
 * Class to manage boardgame.io clients and limit debug panel rendering.
 */
class ClientManager {
    constructor() {
        this.debugPanel = null;
        this.currentClient = null;
        this.clients = new Map();
        this.subscribers = new Map();
    }
    /**
     * Register a client with the client manager.
     */
    register(client) {
        // Add client to clients map.
        this.clients.set(client, client);
        // Mount debug for this client (no-op if another debug is already mounted).
        this.mountDebug(client);
        this.notifySubscribers();
    }
    /**
     * Unregister a client from the client manager.
     */
    unregister(client) {
        // Remove client from clients map.
        this.clients.delete(client);
        if (this.currentClient === client) {
            // If the removed client owned the debug panel, unmount it.
            this.unmountDebug();
            // Mount debug panel for next available client.
            for (const [client] of this.clients) {
                if (this.debugPanel)
                    break;
                this.mountDebug(client);
            }
        }
        this.notifySubscribers();
    }
    /**
     * Subscribe to the client manager state.
     * Calls the passed callback each time the current client changes or a client
     * registers/unregisters.
     * Returns a function to unsubscribe from the state updates.
     */
    subscribe(callback) {
        const id = Symbol();
        this.subscribers.set(id, callback);
        callback(this.getState());
        return () => {
            this.subscribers.delete(id);
        };
    }
    /**
     * Switch to a client with a matching playerID.
     */
    switchPlayerID(playerID) {
        // For multiplayer clients, try switching control to a different client
        // that is using the same transport layer.
        if (this.currentClient.multiplayer) {
            for (const [client] of this.clients) {
                if (client.playerID === playerID &&
                    client.debugOpt !== false &&
                    client.multiplayer === this.currentClient.multiplayer) {
                    this.switchToClient(client);
                    return;
                }
            }
        }
        // If no client matches, update the playerID for the current client.
        this.currentClient.updatePlayerID(playerID);
        this.notifySubscribers();
    }
    /**
     * Set the passed client as the active client for debugging.
     */
    switchToClient(client) {
        if (client === this.currentClient)
            return;
        this.unmountDebug();
        this.mountDebug(client);
        this.notifySubscribers();
    }
    /**
     * Notify all subscribers of changes to the client manager state.
     */
    notifySubscribers() {
        const arg = this.getState();
        this.subscribers.forEach((cb) => {
            cb(arg);
        });
    }
    /**
     * Get the client manager state.
     */
    getState() {
        return {
            client: this.currentClient,
            debuggableClients: this.getDebuggableClients(),
        };
    }
    /**
     * Get an array of the registered clients that haven’t disabled the debug panel.
     */
    getDebuggableClients() {
        return [...this.clients.values()].filter((client) => client.debugOpt !== false);
    }
    /**
     * Mount the debug panel using the passed client.
     */
    mountDebug(client) {
        if (client.debugOpt === false ||
            this.debugPanel !== null ||
            typeof document === 'undefined') {
            return;
        }
        let DebugImpl;
        let target = document.body;
        if (false) {}
        if (client.debugOpt && client.debugOpt !== true) {
            DebugImpl = client.debugOpt.impl || DebugImpl;
            target = client.debugOpt.target || target;
        }
        if (DebugImpl) {
            this.currentClient = client;
            this.debugPanel = new DebugImpl({
                target,
                props: { clientManager: this },
            });
        }
    }
    /**
     * Unmount the debug panel.
     */
    unmountDebug() {
        this.debugPanel.$destroy();
        this.debugPanel = null;
        this.currentClient = null;
    }
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Global client manager instance that all clients register with.
 */
const GlobalClientManager = new ClientManager();
/**
 * Standardise the passed playerID, using currentPlayer if appropriate.
 */
function assumedPlayerID(playerID, store, multiplayer) {
    // In singleplayer mode, if the client does not have a playerID
    // associated with it, we attach the currentPlayer as playerID.
    if (!multiplayer && (playerID === null || playerID === undefined)) {
        const state = store.getState();
        playerID = state.ctx.currentPlayer;
    }
    return playerID;
}
/**
 * createDispatchers
 *
 * Create action dispatcher wrappers with bound playerID and credentials
 */
function createDispatchers(storeActionType, innerActionNames, store, playerID, credentials, multiplayer) {
    const dispatchers = {};
    for (const name of innerActionNames) {
        dispatchers[name] = (...args) => {
            const action = ActionCreators[storeActionType](name, args, assumedPlayerID(playerID, store, multiplayer), credentials);
            store.dispatch(action);
        };
    }
    return dispatchers;
}
// Creates a set of dispatchers to make moves.
const createMoveDispatchers = createDispatchers.bind(null, 'makeMove');
// Creates a set of dispatchers to dispatch game flow events.
const createEventDispatchers = createDispatchers.bind(null, 'gameEvent');
// Creates a set of dispatchers to dispatch actions to plugins.
const createPluginDispatchers = createDispatchers.bind(null, 'plugin');
/**
 * Implementation of Client (see below).
 */
class _ClientImpl {
    constructor({ game, debug, numPlayers, multiplayer, matchID: matchID, playerID, credentials, enhancer, }) {
        this.game = ProcessGameConfig(game);
        this.playerID = playerID;
        this.matchID = matchID || 'default';
        this.credentials = credentials;
        this.multiplayer = multiplayer;
        this.debugOpt = debug;
        this.manager = GlobalClientManager;
        this.gameStateOverride = null;
        this.subscribers = {};
        this._running = false;
        this.reducer = reducer_95b86815_CreateGameReducer({
            game: this.game,
            isClient: multiplayer !== undefined,
        });
        this.initialState = null;
        if (!multiplayer) {
            this.initialState = InitializeGame({ game: this.game, numPlayers });
        }
        this.reset = () => {
            this.store.dispatch(turn_order_406c4349_reset(this.initialState));
        };
        this.undo = () => {
            const undo$1 = undo(assumedPlayerID(this.playerID, this.store, this.multiplayer), this.credentials);
            this.store.dispatch(undo$1);
        };
        this.redo = () => {
            const redo$1 = redo(assumedPlayerID(this.playerID, this.store, this.multiplayer), this.credentials);
            this.store.dispatch(redo$1);
        };
        this.log = [];
        /**
         * Middleware that manages the log object.
         * Reducers generate deltalogs, which are log events
         * that are the result of application of a single action.
         * The master may also send back a deltalog or the entire
         * log depending on the type of request.
         * The middleware below takes care of all these cases while
         * managing the log object.
         */
        const LogMiddleware = (store) => (next) => (action) => {
            const result = next(action);
            const state = store.getState();
            switch (action.type) {
                case MAKE_MOVE:
                case GAME_EVENT:
                case UNDO:
                case REDO: {
                    const deltalog = state.deltalog;
                    this.log = [...this.log, ...deltalog];
                    break;
                }
                case RESET: {
                    this.log = [];
                    break;
                }
                case PATCH:
                case UPDATE: {
                    let id = -1;
                    if (this.log.length > 0) {
                        id = this.log[this.log.length - 1]._stateID;
                    }
                    let deltalog = action.deltalog || [];
                    // Filter out actions that are already present
                    // in the current log. This may occur when the
                    // client adds an entry to the log followed by
                    // the update from the master here.
                    deltalog = deltalog.filter((l) => l._stateID > id);
                    this.log = [...this.log, ...deltalog];
                    break;
                }
                case SYNC: {
                    this.initialState = action.initialState;
                    this.log = action.log || [];
                    break;
                }
            }
            return result;
        };
        /**
         * Middleware that intercepts actions and sends them to the master,
         * which keeps the authoritative version of the state.
         */
        const TransportMiddleware = (store) => (next) => (action) => {
            const baseState = store.getState();
            const result = next(action);
            if (!('clientOnly' in action) &&
                action.type !== STRIP_TRANSIENTS) {
                this.transport.sendAction(baseState, action);
            }
            return result;
        };
        /**
         * Middleware that intercepts actions and invokes the subscription callback.
         */
        const SubscriptionMiddleware = () => (next) => (action) => {
            const result = next(action);
            this.notifySubscribers();
            return result;
        };
        const middleware = applyMiddleware(TransientHandlingMiddleware, SubscriptionMiddleware, TransportMiddleware, LogMiddleware);
        enhancer =
            enhancer !== undefined ? compose(middleware, enhancer) : middleware;
        this.store = createStore(this.reducer, this.initialState, enhancer);
        if (!multiplayer)
            multiplayer = DummyTransport;
        this.transport = multiplayer({
            transportDataCallback: (data) => this.receiveTransportData(data),
            gameKey: game,
            game: this.game,
            matchID,
            playerID,
            credentials,
            gameName: this.game.name,
            numPlayers,
        });
        this.createDispatchers();
        this.chatMessages = [];
        this.sendChatMessage = (payload) => {
            this.transport.sendChatMessage(this.matchID, {
                id: nanoid(7),
                sender: this.playerID,
                payload: payload,
            });
        };
    }
    /** Handle incoming match data from a multiplayer transport. */
    receiveMatchData(matchData) {
        this.matchData = matchData;
        this.notifySubscribers();
    }
    /** Handle an incoming chat message from a multiplayer transport. */
    receiveChatMessage(message) {
        this.chatMessages = [...this.chatMessages, message];
        this.notifySubscribers();
    }
    /** Handle all incoming updates from a multiplayer transport. */
    receiveTransportData(data) {
        const [matchID] = data.args;
        if (matchID !== this.matchID)
            return;
        switch (data.type) {
            case 'sync': {
                const [, syncInfo] = data.args;
                const action = sync(syncInfo);
                this.receiveMatchData(syncInfo.filteredMetadata);
                this.store.dispatch(action);
                break;
            }
            case 'update': {
                const [, state, deltalog] = data.args;
                const currentState = this.store.getState();
                if (state._stateID >= currentState._stateID) {
                    const action = update(state, deltalog);
                    this.store.dispatch(action);
                }
                break;
            }
            case 'patch': {
                const [, prevStateID, stateID, patch$1, deltalog] = data.args;
                const currentStateID = this.store.getState()._stateID;
                if (prevStateID !== currentStateID)
                    break;
                const action = patch(prevStateID, stateID, patch$1, deltalog);
                this.store.dispatch(action);
                // Emit sync if patch apply failed.
                if (this.store.getState()._stateID === currentStateID) {
                    this.transport.requestSync();
                }
                break;
            }
            case 'matchData': {
                const [, matchData] = data.args;
                this.receiveMatchData(matchData);
                break;
            }
            case 'chat': {
                const [, chatMessage] = data.args;
                this.receiveChatMessage(chatMessage);
                break;
            }
        }
    }
    notifySubscribers() {
        Object.values(this.subscribers).forEach((fn) => fn(this.getState()));
    }
    overrideGameState(state) {
        this.gameStateOverride = state;
        this.notifySubscribers();
    }
    start() {
        this.transport.connect();
        this._running = true;
        this.manager.register(this);
    }
    stop() {
        this.transport.disconnect();
        this._running = false;
        this.manager.unregister(this);
    }
    subscribe(fn) {
        const id = Object.keys(this.subscribers).length;
        this.subscribers[id] = fn;
        this.transport.subscribeToConnectionStatus(() => this.notifySubscribers());
        if (this._running || !this.multiplayer) {
            fn(this.getState());
        }
        // Return a handle that allows the caller to unsubscribe.
        return () => {
            delete this.subscribers[id];
        };
    }
    getInitialState() {
        return this.initialState;
    }
    getState() {
        let state = this.store.getState();
        if (this.gameStateOverride !== null) {
            state = this.gameStateOverride;
        }
        // This is the state before a sync with the game master.
        if (state === null) {
            return state;
        }
        // isActive.
        let isActive = true;
        const isPlayerActive = this.game.flow.isPlayerActive(state.G, state.ctx, this.playerID);
        if (this.multiplayer && !isPlayerActive) {
            isActive = false;
        }
        if (!this.multiplayer &&
            this.playerID !== null &&
            this.playerID !== undefined &&
            !isPlayerActive) {
            isActive = false;
        }
        if (state.ctx.gameover !== undefined) {
            isActive = false;
        }
        // Secrets are normally stripped on the server,
        // but we also strip them here so that game developers
        // can see their effects while prototyping.
        // Do not strip again if this is a multiplayer game
        // since the server has already stripped secret info. (issue #818)
        if (!this.multiplayer) {
            state = {
                ...state,
                G: this.game.playerView(state.G, state.ctx, this.playerID),
                plugins: PlayerView(state, this),
            };
        }
        // Combine into return value.
        return {
            ...state,
            log: this.log,
            isActive,
            isConnected: this.transport.isConnected,
        };
    }
    createDispatchers() {
        this.moves = createMoveDispatchers(this.game.moveNames, this.store, this.playerID, this.credentials, this.multiplayer);
        this.events = createEventDispatchers(this.game.flow.enabledEventNames, this.store, this.playerID, this.credentials, this.multiplayer);
        this.plugins = createPluginDispatchers(this.game.pluginNames, this.store, this.playerID, this.credentials, this.multiplayer);
    }
    updatePlayerID(playerID) {
        this.playerID = playerID;
        this.createDispatchers();
        this.transport.updatePlayerID(playerID);
        this.notifySubscribers();
    }
    updateMatchID(matchID) {
        this.matchID = matchID;
        this.createDispatchers();
        this.transport.updateMatchID(matchID);
        this.notifySubscribers();
    }
    updateCredentials(credentials) {
        this.credentials = credentials;
        this.createDispatchers();
        this.transport.updateCredentials(credentials);
        this.notifySubscribers();
    }
}
/**
 * Client
 *
 * boardgame.io JS client.
 *
 * @param {...object} game - The return value of `Game`.
 * @param {...object} numPlayers - The number of players.
 * @param {...object} multiplayer - Set to a falsy value or a transportFactory, e.g., SocketIO()
 * @param {...object} matchID - The matchID that you want to connect to.
 * @param {...object} playerID - The playerID associated with this client.
 * @param {...string} credentials - The authentication credentials associated with this client.
 *
 * Returns:
 *   A JS object that provides an API to interact with the
 *   game by dispatching moves and events.
 */
function Client(opts) {
    return new _ClientImpl(opts);
}



;// CONCATENATED MODULE: ./node_modules/flatted/esm/index.js
/*! (c) 2020 Andrea Giammarchi */

const {parse: $parse, stringify: $stringify} = JSON;
const {keys} = Object;

const Primitive = String;   // it could be Number
const primitive = 'string'; // it could be 'number'

const ignore = {};
const object = 'object';

const noop = (_, value) => value;

const primitives = value => (
  value instanceof Primitive ? Primitive(value) : value
);

const Primitives = (_, value) => (
  typeof value === primitive ? new Primitive(value) : value
);

const revive = (input, parsed, output, $) => {
  const lazy = [];
  for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
    const k = ke[y];
    const value = output[k];
    if (value instanceof Primitive) {
      const tmp = input[value];
      if (typeof tmp === object && !parsed.has(tmp)) {
        parsed.add(tmp);
        output[k] = ignore;
        lazy.push({k, a: [input, parsed, tmp, $]});
      }
      else
        output[k] = $.call(output, k, tmp);
    }
    else if (output[k] !== ignore)
      output[k] = $.call(output, k, value);
  }
  for (let {length} = lazy, i = 0; i < length; i++) {
    const {k, a} = lazy[i];
    output[k] = $.call(output, k, revive.apply(null, a));
  }
  return output;
};

const set = (known, input, value) => {
  const index = Primitive(input.push(value) - 1);
  known.set(value, index);
  return index;
};

const parse = (text, reviver) => {
  const input = $parse(text, Primitives).map(primitives);
  const value = input[0];
  const $ = reviver || noop;
  const tmp = typeof value === object && value ?
              revive(input, new Set, value, $) :
              value;
  return $.call({'': tmp}, '', tmp);
};

const stringify = (value, replacer, space) => {
  const $ = replacer && typeof replacer === object ?
            (k, v) => (k === '' || -1 < replacer.indexOf(k) ? v : void 0) :
            (replacer || noop);
  const known = new Map;
  const input = [];
  const output = [];
  let i = +set(known, input, $.call({'': value}, '', value));
  let firstRun = !i;
  while (i < input.length) {
    firstRun = true;
    output[i] = $stringify(input[i++], replace, space);
  }
  return '[' + output.join(',') + ']';
  function replace(key, value) {
    if (firstRun) {
      firstRun = !firstRun;
      return value;
    }
    const after = $.call(this, key, value);
    switch (typeof after) {
      case object:
        if (after === null) return after;
      case primitive:
        return known.get(after) || set(known, input, after);
    }
    return after;
  }
};

const toJSON = any => $parse(stringify(any));
const fromJSON = any => parse($stringify(any));

// EXTERNAL MODULE: ./node_modules/setimmediate/setImmediate.js
var setimmediate_setImmediate = __webpack_require__(889);
;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/ai-763ecd6c.js




/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Base class that bots can extend.
 */
class Bot {
    constructor({ enumerate, seed, }) {
        this.enumerateFn = enumerate;
        this.seed = seed;
        this.iterationCounter = 0;
        this._opts = {};
    }
    addOpt({ key, range, initial, }) {
        this._opts[key] = {
            range,
            value: initial,
        };
    }
    getOpt(key) {
        return this._opts[key].value;
    }
    setOpt(key, value) {
        if (key in this._opts) {
            this._opts[key].value = value;
        }
    }
    opts() {
        return this._opts;
    }
    enumerate(G, ctx, playerID) {
        const actions = this.enumerateFn(G, ctx, playerID);
        return actions.map((a) => {
            if ('payload' in a) {
                return a;
            }
            if ('move' in a) {
                return makeMove(a.move, a.args, playerID);
            }
            if ('event' in a) {
                return gameEvent(a.event, a.args, playerID);
            }
        });
    }
    random(arg) {
        let number;
        if (this.seed !== undefined) {
            const seed = this.prngstate ? '' : this.seed;
            const rand = alea(seed, this.prngstate);
            number = rand();
            this.prngstate = rand.state();
        }
        else {
            number = Math.random();
        }
        if (arg) {
            if (Array.isArray(arg)) {
                const id = Math.floor(number * arg.length);
                return arg[id];
            }
            else {
                return Math.floor(number * arg);
            }
        }
        return number;
    }
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * The number of iterations to run before yielding to
 * the JS event loop (in async mode).
 */
const CHUNK_SIZE = 25;
/**
 * Bot that uses Monte-Carlo Tree Search to find promising moves.
 */
class MCTSBot extends Bot {
    constructor({ enumerate, seed, objectives, game, iterations, playoutDepth, iterationCallback, }) {
        super({ enumerate, seed });
        if (objectives === undefined) {
            objectives = () => ({});
        }
        this.objectives = objectives;
        this.iterationCallback = iterationCallback || (() => { });
        this.reducer = reducer_95b86815_CreateGameReducer({ game });
        this.iterations = iterations;
        this.playoutDepth = playoutDepth;
        this.addOpt({
            key: 'async',
            initial: false,
        });
        this.addOpt({
            key: 'iterations',
            initial: typeof iterations === 'number' ? iterations : 1000,
            range: { min: 1, max: 2000 },
        });
        this.addOpt({
            key: 'playoutDepth',
            initial: typeof playoutDepth === 'number' ? playoutDepth : 50,
            range: { min: 1, max: 100 },
        });
    }
    createNode({ state, parentAction, parent, playerID, }) {
        const { G, ctx } = state;
        let actions = [];
        let objectives = [];
        if (playerID !== undefined) {
            actions = this.enumerate(G, ctx, playerID);
            objectives = this.objectives(G, ctx, playerID);
        }
        else if (ctx.activePlayers) {
            for (const playerID in ctx.activePlayers) {
                actions.push(...this.enumerate(G, ctx, playerID));
                objectives.push(this.objectives(G, ctx, playerID));
            }
        }
        else {
            actions = this.enumerate(G, ctx, ctx.currentPlayer);
            objectives = this.objectives(G, ctx, ctx.currentPlayer);
        }
        return {
            state,
            parent,
            parentAction,
            actions,
            objectives,
            children: [],
            visits: 0,
            value: 0,
        };
    }
    select(node) {
        // This node has unvisited children.
        if (node.actions.length > 0) {
            return node;
        }
        // This is a terminal node.
        if (node.children.length === 0) {
            return node;
        }
        let selectedChild = null;
        let best = 0;
        for (const child of node.children) {
            const childVisits = child.visits + Number.EPSILON;
            const uct = child.value / childVisits +
                Math.sqrt((2 * Math.log(node.visits)) / childVisits);
            if (selectedChild == null || uct > best) {
                best = uct;
                selectedChild = child;
            }
        }
        return this.select(selectedChild);
    }
    expand(node) {
        const actions = node.actions;
        if (actions.length === 0 || node.state.ctx.gameover !== undefined) {
            return node;
        }
        const id = this.random(actions.length);
        const action = actions[id];
        node.actions.splice(id, 1);
        const childState = this.reducer(node.state, action);
        const childNode = this.createNode({
            state: childState,
            parentAction: action,
            parent: node,
        });
        node.children.push(childNode);
        return childNode;
    }
    playout({ state }) {
        let playoutDepth = this.getOpt('playoutDepth');
        if (typeof this.playoutDepth === 'function') {
            playoutDepth = this.playoutDepth(state.G, state.ctx);
        }
        for (let i = 0; i < playoutDepth && state.ctx.gameover === undefined; i++) {
            const { G, ctx } = state;
            let playerID = ctx.currentPlayer;
            if (ctx.activePlayers) {
                playerID = Object.keys(ctx.activePlayers)[0];
            }
            const moves = this.enumerate(G, ctx, playerID);
            // Check if any objectives are met.
            const objectives = this.objectives(G, ctx, playerID);
            const score = Object.keys(objectives).reduce((score, key) => {
                const objective = objectives[key];
                if (objective.checker(G, ctx)) {
                    return score + objective.weight;
                }
                return score;
            }, 0);
            // If so, stop and return the score.
            if (score > 0) {
                return { score };
            }
            if (!moves || moves.length === 0) {
                return undefined;
            }
            const id = this.random(moves.length);
            const childState = this.reducer(state, moves[id]);
            state = childState;
        }
        return state.ctx.gameover;
    }
    backpropagate(node, result = {}) {
        node.visits++;
        if (result.score !== undefined) {
            node.value += result.score;
        }
        if (result.draw === true) {
            node.value += 0.5;
        }
        if (node.parentAction &&
            result.winner === node.parentAction.payload.playerID) {
            node.value++;
        }
        if (node.parent) {
            this.backpropagate(node.parent, result);
        }
    }
    play(state, playerID) {
        const root = this.createNode({ state, playerID });
        let numIterations = this.getOpt('iterations');
        if (typeof this.iterations === 'function') {
            numIterations = this.iterations(state.G, state.ctx);
        }
        const getResult = () => {
            let selectedChild = null;
            for (const child of root.children) {
                if (selectedChild == null || child.visits > selectedChild.visits) {
                    selectedChild = child;
                }
            }
            const action = selectedChild && selectedChild.parentAction;
            const metadata = root;
            return { action, metadata };
        };
        return new Promise((resolve) => {
            const iteration = () => {
                for (let i = 0; i < CHUNK_SIZE && this.iterationCounter < numIterations; i++) {
                    const leaf = this.select(root);
                    const child = this.expand(leaf);
                    const result = this.playout(child);
                    this.backpropagate(child, result);
                    this.iterationCounter++;
                }
                this.iterationCallback({
                    iterationCounter: this.iterationCounter,
                    numIterations,
                    metadata: root,
                });
            };
            this.iterationCounter = 0;
            if (this.getOpt('async')) {
                const asyncIteration = () => {
                    if (this.iterationCounter < numIterations) {
                        iteration();
                        setImmediate(asyncIteration);
                    }
                    else {
                        resolve(getResult());
                    }
                };
                asyncIteration();
            }
            else {
                while (this.iterationCounter < numIterations) {
                    iteration();
                }
                resolve(getResult());
            }
        });
    }
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Bot that picks a move at random.
 */
class RandomBot extends (/* unused pure expression or super */ null && (Bot)) {
    play({ G, ctx }, playerID) {
        const moves = this.enumerate(G, ctx, playerID);
        return Promise.resolve({ action: this.random(moves) });
    }
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Make a single move on the client with a bot.
 *
 * @param {...object} client - The game client.
 * @param {...object} bot - The bot.
 */
async function Step(client, bot) {
    const state = client.store.getState();
    let playerID = state.ctx.currentPlayer;
    if (state.ctx.activePlayers) {
        playerID = Object.keys(state.ctx.activePlayers)[0];
    }
    const { action, metadata } = await bot.play(state, playerID);
    if (action) {
        const a = {
            ...action,
            payload: {
                ...action.payload,
                metadata,
            },
        };
        client.store.dispatch(a);
        return a;
    }
}
/**
 * Simulates the game till the end or a max depth.
 *
 * @param {...object} game - The game object.
 * @param {...object} bots - An array of bots.
 * @param {...object} state - The game state to start from.
 */
async function Simulate({ game, bots, state, depth, }) {
    if (depth === undefined)
        depth = 10000;
    const reducer = CreateGameReducer({ game });
    let metadata = null;
    let iter = 0;
    while (state.ctx.gameover === undefined && iter < depth) {
        let playerID = state.ctx.currentPlayer;
        if (state.ctx.activePlayers) {
            playerID = Object.keys(state.ctx.activePlayers)[0];
        }
        const bot = bots instanceof Bot ? bots : bots[playerID];
        const t = await bot.play(state, playerID);
        if (!t.action) {
            break;
        }
        metadata = t.metadata;
        state = reducer(state, t.action);
        iter++;
    }
    return { state, metadata };
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/client-5f57c3f2.js
const assertString = (str, label) => {
    if (!str || typeof str !== 'string') {
        throw new Error(`Expected ${label} string, got "${str}".`);
    }
};
const assertGameName = (name) => assertString(name, 'game name');
const assertMatchID = (id) => assertString(id, 'match ID');
const validateBody = (body, schema) => {
    if (!body)
        throw new Error(`Expected body, got “${body}”.`);
    for (const key in schema) {
        const propSchema = schema[key];
        const types = Array.isArray(propSchema) ? propSchema : [propSchema];
        const received = body[key];
        if (!types.includes(typeof received)) {
            const union = types.join('|');
            throw new TypeError(`Expected body.${key} to be of type ${union}, got “${received}”.`);
        }
    }
};
class LobbyClientError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
    }
}
/**
 * Create a boardgame.io Lobby API client.
 * @param server The API’s base URL, e.g. `http://localhost:8000`.
 */
class LobbyClient {
    constructor({ server = '' } = {}) {
        // strip trailing slash if passed
        this.server = server.replace(/\/$/, '');
    }
    async request(route, init) {
        const response = await fetch(this.server + route, init);
        if (!response.ok) {
            let details;
            try {
                details = await response.clone().json();
            }
            catch {
                try {
                    details = await response.text();
                }
                catch (error) {
                    details = error.message;
                }
            }
            throw new LobbyClientError(`HTTP status ${response.status}`, details);
        }
        return response.json();
    }
    async post(route, opts) {
        let init = {
            method: 'post',
            body: JSON.stringify(opts.body),
            headers: { 'Content-Type': 'application/json' },
        };
        if (opts.init)
            init = {
                ...init,
                ...opts.init,
                headers: { ...init.headers, ...opts.init.headers },
            };
        return this.request(route, init);
    }
    /**
     * Get a list of the game names available on this server.
     * @param  init Optional RequestInit interface to override defaults.
     * @return Array of game names.
     *
     * @example
     * lobbyClient.listGames()
     *   .then(console.log); // => ['chess', 'tic-tac-toe']
     */
    async listGames(init) {
        return this.request('/games', init);
    }
    /**
     * Get a list of the matches for a specific game type on the server.
     * @param  gameName The game to list for, e.g. 'tic-tac-toe'.
     * @param  where    Options to filter matches by update time or gameover state
     * @param  init     Optional RequestInit interface to override defaults.
     * @return Array of match metadata objects.
     *
     * @example
     * lobbyClient.listMatches('tic-tac-toe', where: { isGameover: false })
     *   .then(data => console.log(data.matches));
     * // => [
     * //   {
     * //     matchID: 'xyz',
     * //     gameName: 'tic-tac-toe',
     * //     players: [{ id: 0, name: 'Alice' }, { id: 1 }]
     * //   },
     * //   ...
     * // ]
     */
    async listMatches(gameName, where, init) {
        assertGameName(gameName);
        let query = '';
        if (where) {
            const queries = [];
            const { isGameover, updatedBefore, updatedAfter } = where;
            if (isGameover !== undefined)
                queries.push(`isGameover=${isGameover}`);
            if (updatedBefore)
                queries.push(`updatedBefore=${updatedBefore}`);
            if (updatedAfter)
                queries.push(`updatedAfter=${updatedAfter}`);
            if (queries.length > 0)
                query = '?' + queries.join('&');
        }
        return this.request(`/games/${gameName}${query}`, init);
    }
    /**
     * Get metadata for a specific match.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to fetch.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return A match metadata object.
     *
     * @example
     * lobbyClient.getMatch('tic-tac-toe', 'xyz').then(console.log);
     * // => {
     * //   matchID: 'xyz',
     * //   gameName: 'tic-tac-toe',
     * //   players: [{ id: 0, name: 'Alice' }, { id: 1 }]
     * // }
     */
    async getMatch(gameName, matchID, init) {
        assertGameName(gameName);
        assertMatchID(matchID);
        return this.request(`/games/${gameName}/${matchID}`, init);
    }
    /**
     * Create a new match for a specific game type.
     * @param  gameName The game to create a match for, e.g. 'tic-tac-toe'.
     * @param  body     Options required to configure match creation.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return An object containing the created `matchID`.
     *
     * @example
     * lobbyClient.createMatch('tic-tac-toe', { numPlayers: 2 })
     *   .then(console.log);
     * // => { matchID: 'xyz' }
     */
    async createMatch(gameName, body, init) {
        assertGameName(gameName);
        validateBody(body, { numPlayers: 'number' });
        return this.post(`/games/${gameName}/create`, { body, init });
    }
    /**
     * Join a match using its matchID.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to join.
     * @param  body     Options required to join match.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return Object containing `playerCredentials` for the player who joined.
     *
     * @example
     * lobbyClient.joinMatch('tic-tac-toe', 'xyz', {
     *   playerID: '1',
     *   playerName: 'Bob',
     * }).then(console.log);
     * // => { playerID: '1', playerCredentials: 'random-string' }
     */
    async joinMatch(gameName, matchID, body, init) {
        assertGameName(gameName);
        assertMatchID(matchID);
        validateBody(body, {
            playerID: ['string', 'undefined'],
            playerName: 'string',
        });
        return this.post(`/games/${gameName}/${matchID}/join`, { body, init });
    }
    /**
     * Leave a previously joined match.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to leave.
     * @param  body     Options required to leave match.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return Promise resolves if successful.
     *
     * @example
     * lobbyClient.leaveMatch('tic-tac-toe', 'xyz', {
     *   playerID: '1',
     *   credentials: 'credentials-returned-when-joining',
     * })
     *   .then(() => console.log('Left match.'))
     *   .catch(error => console.error('Error leaving match', error));
     */
    async leaveMatch(gameName, matchID, body, init) {
        assertGameName(gameName);
        assertMatchID(matchID);
        validateBody(body, { playerID: 'string', credentials: 'string' });
        await this.post(`/games/${gameName}/${matchID}/leave`, { body, init });
    }
    /**
     * Update a player’s name or custom metadata.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to update.
     * @param  body     Options required to update player.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return Promise resolves if successful.
     *
     * @example
     * lobbyClient.updatePlayer('tic-tac-toe', 'xyz', {
     *   playerID: '0',
     *   credentials: 'credentials-returned-when-joining',
     *   newName: 'Al',
     * })
     *   .then(() => console.log('Updated player data.'))
     *   .catch(error => console.error('Error updating data', error));
     */
    async updatePlayer(gameName, matchID, body, init) {
        assertGameName(gameName);
        assertMatchID(matchID);
        validateBody(body, { playerID: 'string', credentials: 'string' });
        await this.post(`/games/${gameName}/${matchID}/update`, { body, init });
    }
    /**
     * Create a new match based on the configuration of the current match.
     * @param  gameName The match’s game type, e.g. 'tic-tac-toe'.
     * @param  matchID  Match ID for the match to play again.
     * @param  body     Options required to configure match.
     * @param  init     Optional RequestInit interface to override defaults.
     * @return Object containing `nextMatchID`.
     *
     * @example
     * lobbyClient.playAgain('tic-tac-toe', 'xyz', {
     *   playerID: '0',
     *   credentials: 'credentials-returned-when-joining',
     * })
     *   .then(({ nextMatchID }) => {
     *     return lobbyClient.joinMatch('tic-tac-toe', nextMatchID, {
     *       playerID: '0',
     *       playerName: 'Al',
     *     })
     *   })
     *   .then({ playerCredentials } => {
     *     console.log(playerCredentials);
     *   })
     *   .catch(console.error);
     */
    async playAgain(gameName, matchID, body, init) {
        assertGameName(gameName);
        assertMatchID(matchID);
        validateBody(body, { playerID: 'string', credentials: 'string' });
        return this.post(`/games/${gameName}/${matchID}/playAgain`, { body, init });
    }
}



// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(294);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(697);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/react-cookies/build/cookie.js
var build_cookie = __webpack_require__(768);
;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/util-93cda368.js


var Type;
(function (Type) {
    Type[Type["SYNC"] = 0] = "SYNC";
    Type[Type["ASYNC"] = 1] = "ASYNC";
})(Type || (Type = {}));
/**
 * Type guard that checks if a storage implementation is synchronous.
 */
function isSynchronous(storageAPI) {
    return storageAPI.type() === Type.SYNC;
}
class Async {
    /* istanbul ignore next */
    type() {
        /* istanbul ignore next */
        return Type.ASYNC;
    }
    /**
     * Create a new match.
     *
     * This might just need to call setState and setMetadata in
     * most implementations.
     *
     * However, it exists as a separate call so that the
     * implementation can provision things differently when
     * a match is created.  For example, it might stow away the
     * initial match state in a separate field for easier retrieval.
     */
    /* istanbul ignore next */
    async createMatch(matchID, opts) {
        if (this.createGame) {
            console.warn('The database connector does not implement a createMatch method.', '\nUsing the deprecated createGame method instead.');
            return this.createGame(matchID, opts);
        }
        else {
            console.error('The database connector does not implement a createMatch method.');
        }
    }
    /**
     * Return all matches.
     */
    /* istanbul ignore next */
    async listMatches(opts) {
        if (this.listGames) {
            console.warn('The database connector does not implement a listMatches method.', '\nUsing the deprecated listGames method instead.');
            return this.listGames(opts);
        }
        else {
            console.error('The database connector does not implement a listMatches method.');
        }
    }
}
class Sync {
    type() {
        return Type.SYNC;
    }
    /**
     * Connect.
     */
    connect() {
        return;
    }
    /**
     * Create a new match.
     *
     * This might just need to call setState and setMetadata in
     * most implementations.
     *
     * However, it exists as a separate call so that the
     * implementation can provision things differently when
     * a match is created.  For example, it might stow away the
     * initial match state in a separate field for easier retrieval.
     */
    /* istanbul ignore next */
    createMatch(matchID, opts) {
        if (this.createGame) {
            console.warn('The database connector does not implement a createMatch method.', '\nUsing the deprecated createGame method instead.');
            return this.createGame(matchID, opts);
        }
        else {
            console.error('The database connector does not implement a createMatch method.');
        }
    }
    /**
     * Return all matches.
     */
    /* istanbul ignore next */
    listMatches(opts) {
        if (this.listGames) {
            console.warn('The database connector does not implement a listMatches method.', '\nUsing the deprecated listGames method instead.');
            return this.listGames(opts);
        }
        else {
            console.error('The database connector does not implement a listMatches method.');
        }
    }
}

/**
 * Creates a new match metadata object.
 */
const createMetadata = ({ game, unlisted, setupData, numPlayers, }) => {
    const metadata = {
        gameName: game.name,
        unlisted: !!unlisted,
        players: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    if (setupData !== undefined)
        metadata.setupData = setupData;
    for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
        metadata.players[playerIndex] = { id: playerIndex };
    }
    return metadata;
};
/**
 * Creates initial state and metadata for a new match.
 * If the provided `setupData` doesn’t pass the game’s validation,
 * an error object is returned instead.
 */
const createMatch = ({ game, numPlayers, setupData, unlisted, }) => {
    if (!numPlayers || typeof numPlayers !== 'number')
        numPlayers = 2;
    const setupDataError = game.validateSetupData && game.validateSetupData(setupData, numPlayers);
    if (setupDataError !== undefined)
        return { setupDataError };
    const metadata = createMetadata({ game, numPlayers, setupData, unlisted });
    const initialState = InitializeGame({ game, numPlayers, setupData });
    return { metadata, initialState };
};



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/master-3e35d48c.js





/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Filter match data to get a player metadata object with credentials stripped.
 */
const filterMatchData = (matchData) => Object.values(matchData.players).map((player) => {
    const { credentials, ...filteredData } = player;
    return filteredData;
});
/**
 * Remove player credentials from action payload
 */
const stripCredentialsFromAction = (action) => {
    const { credentials, ...payload } = action.payload;
    return { ...action, payload };
};
/**
 * Master
 *
 * Class that runs the game and maintains the authoritative state.
 * It uses the transportAPI to communicate with clients and the
 * storageAPI to communicate with the database.
 */
class Master {
    constructor(game, storageAPI, transportAPI, auth) {
        this.game = ProcessGameConfig(game);
        this.storageAPI = storageAPI;
        this.transportAPI = transportAPI;
        this.subscribeCallback = () => { };
        this.auth = auth;
    }
    subscribe(fn) {
        this.subscribeCallback = fn;
    }
    /**
     * Called on each move / event made by the client.
     * Computes the new value of the game state and returns it
     * along with a deltalog.
     */
    async onUpdate(credAction, stateID, matchID, playerID) {
        if (!credAction || !credAction.payload) {
            return { error: 'missing action or action payload' };
        }
        let metadata;
        if (isSynchronous(this.storageAPI)) {
            ({ metadata } = this.storageAPI.fetch(matchID, { metadata: true }));
        }
        else {
            ({ metadata } = await this.storageAPI.fetch(matchID, { metadata: true }));
        }
        if (this.auth) {
            const isAuthentic = await this.auth.authenticateCredentials({
                playerID,
                credentials: credAction.payload.credentials,
                metadata,
            });
            if (!isAuthentic) {
                return { error: 'unauthorized action' };
            }
        }
        const action = stripCredentialsFromAction(credAction);
        const key = matchID;
        let state;
        if (isSynchronous(this.storageAPI)) {
            ({ state } = this.storageAPI.fetch(key, { state: true }));
        }
        else {
            ({ state } = await this.storageAPI.fetch(key, { state: true }));
        }
        if (state === undefined) {
            error(`game not found, matchID=[${key}]`);
            return { error: 'game not found' };
        }
        if (state.ctx.gameover !== undefined) {
            error(`game over - matchID=[${key}] - playerID=[${playerID}]` +
                ` - action[${action.payload.type}]`);
            return;
        }
        const reducer = reducer_95b86815_CreateGameReducer({
            game: this.game,
        });
        const middleware = applyMiddleware(TransientHandlingMiddleware);
        const store = createStore(reducer, state, middleware);
        // Only allow UNDO / REDO if there is exactly one player
        // that can make moves right now and the person doing the
        // action is that player.
        if (action.type == UNDO || action.type == REDO) {
            const hasActivePlayers = state.ctx.activePlayers !== null;
            const isCurrentPlayer = state.ctx.currentPlayer === playerID;
            if (
            // If activePlayers is empty, non-current players can’t undo.
            (!hasActivePlayers && !isCurrentPlayer) ||
                // If player is not active or multiple players are active, can’t undo.
                (hasActivePlayers &&
                    (state.ctx.activePlayers[playerID] === undefined ||
                        Object.keys(state.ctx.activePlayers).length > 1))) {
                error(`playerID=[${playerID}] cannot undo / redo right now`);
                return;
            }
        }
        // Check whether the player is active.
        if (!this.game.flow.isPlayerActive(state.G, state.ctx, playerID)) {
            error(`player not active - playerID=[${playerID}]` +
                ` - action[${action.payload.type}]`);
            return;
        }
        // Get move for further checks
        const move = action.type == MAKE_MOVE
            ? this.game.flow.getMove(state.ctx, action.payload.type, playerID)
            : null;
        // Check whether the player is allowed to make the move.
        if (action.type == MAKE_MOVE && !move) {
            error(`move not processed - canPlayerMakeMove=false - playerID=[${playerID}]` +
                ` - action[${action.payload.type}]`);
            return;
        }
        // Check if action's stateID is different than store's stateID
        // and if move does not have ignoreStaleStateID truthy.
        if (state._stateID !== stateID &&
            !(move && IsLongFormMove(move) && move.ignoreStaleStateID)) {
            error(`invalid stateID, was=[${stateID}], expected=[${state._stateID}]` +
                ` - playerID=[${playerID}] - action[${action.payload.type}]`);
            return;
        }
        const prevState = store.getState();
        // Update server's version of the store.
        store.dispatch(action);
        state = store.getState();
        this.subscribeCallback({
            state,
            action,
            matchID,
        });
        if (this.game.deltaState) {
            this.transportAPI.sendAll({
                type: 'patch',
                args: [matchID, stateID, prevState, state],
            });
        }
        else {
            this.transportAPI.sendAll({
                type: 'update',
                args: [matchID, state],
            });
        }
        const { deltalog, ...stateWithoutDeltalog } = state;
        let newMetadata;
        if (metadata &&
            (metadata.gameover === undefined || metadata.gameover === null)) {
            newMetadata = {
                ...metadata,
                updatedAt: Date.now(),
            };
            if (state.ctx.gameover !== undefined) {
                newMetadata.gameover = state.ctx.gameover;
            }
        }
        if (isSynchronous(this.storageAPI)) {
            this.storageAPI.setState(key, stateWithoutDeltalog, deltalog);
            if (newMetadata)
                this.storageAPI.setMetadata(key, newMetadata);
        }
        else {
            const writes = [
                this.storageAPI.setState(key, stateWithoutDeltalog, deltalog),
            ];
            if (newMetadata) {
                writes.push(this.storageAPI.setMetadata(key, newMetadata));
            }
            await Promise.all(writes);
        }
    }
    /**
     * Called when the client connects / reconnects.
     * Returns the latest game state and the entire log.
     */
    async onSync(matchID, playerID, credentials, numPlayers = 2) {
        const key = matchID;
        const fetchOpts = {
            state: true,
            metadata: true,
            log: true,
            initialState: true,
        };
        const fetchResult = isSynchronous(this.storageAPI)
            ? this.storageAPI.fetch(key, fetchOpts)
            : await this.storageAPI.fetch(key, fetchOpts);
        let { state, initialState, log, metadata } = fetchResult;
        if (this.auth && playerID !== undefined && playerID !== null) {
            const isAuthentic = await this.auth.authenticateCredentials({
                playerID,
                credentials,
                metadata,
            });
            if (!isAuthentic) {
                return { error: 'unauthorized' };
            }
        }
        // If the game doesn't exist, then create one on demand.
        // TODO: Move this out of the sync call.
        if (state === undefined) {
            const match = createMatch({
                game: this.game,
                unlisted: true,
                numPlayers,
                setupData: undefined,
            });
            if ('setupDataError' in match) {
                return { error: 'game requires setupData' };
            }
            initialState = state = match.initialState;
            metadata = match.metadata;
            this.subscribeCallback({ state, matchID });
            if (isSynchronous(this.storageAPI)) {
                this.storageAPI.createMatch(key, { initialState, metadata });
            }
            else {
                await this.storageAPI.createMatch(key, { initialState, metadata });
            }
        }
        const filteredMetadata = metadata ? filterMatchData(metadata) : undefined;
        const syncInfo = {
            state,
            log,
            filteredMetadata,
            initialState,
        };
        this.transportAPI.send({
            playerID,
            type: 'sync',
            args: [matchID, syncInfo],
        });
        return;
    }
    /**
     * Called when a client connects or disconnects.
     * Updates and sends out metadata to reflect the player’s connection status.
     */
    async onConnectionChange(matchID, playerID, credentials, connected) {
        const key = matchID;
        // Ignore changes for clients without a playerID, e.g. spectators.
        if (playerID === undefined || playerID === null) {
            return;
        }
        let metadata;
        if (isSynchronous(this.storageAPI)) {
            ({ metadata } = this.storageAPI.fetch(key, { metadata: true }));
        }
        else {
            ({ metadata } = await this.storageAPI.fetch(key, { metadata: true }));
        }
        if (metadata === undefined) {
            error(`metadata not found for matchID=[${key}]`);
            return { error: 'metadata not found' };
        }
        if (metadata.players[playerID] === undefined) {
            error(`Player not in the match, matchID=[${key}] playerID=[${playerID}]`);
            return { error: 'player not in the match' };
        }
        if (this.auth) {
            const isAuthentic = await this.auth.authenticateCredentials({
                playerID,
                credentials,
                metadata,
            });
            if (!isAuthentic) {
                return { error: 'unauthorized' };
            }
        }
        metadata.players[playerID].isConnected = connected;
        const filteredMetadata = filterMatchData(metadata);
        this.transportAPI.sendAll({
            type: 'matchData',
            args: [matchID, filteredMetadata],
        });
        if (isSynchronous(this.storageAPI)) {
            this.storageAPI.setMetadata(key, metadata);
        }
        else {
            await this.storageAPI.setMetadata(key, metadata);
        }
    }
    async onChatMessage(matchID, chatMessage, credentials) {
        const key = matchID;
        if (this.auth) {
            const { metadata } = await this.storageAPI.fetch(key, {
                metadata: true,
            });
            if (!(chatMessage && typeof chatMessage.sender === 'string')) {
                return { error: 'unauthorized' };
            }
            const isAuthentic = await this.auth.authenticateCredentials({
                playerID: chatMessage.sender,
                credentials,
                metadata,
            });
            if (!isAuthentic) {
                return { error: 'unauthorized' };
            }
        }
        this.transportAPI.sendAll({
            type: 'chat',
            args: [matchID, chatMessage],
        });
    }
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/filter-player-view-7cb2b79d.js



const applyPlayerView = (game, playerID, state) => ({
    ...state,
    G: game.playerView(state.G, state.ctx, playerID),
    plugins: PlayerView(state, { playerID, game }),
    deltalog: undefined,
    _undo: [],
    _redo: [],
});
/** Gets a function that filters the TransportData for a given player and game. */
const getFilterPlayerView = (game) => (playerID, payload) => {
    switch (payload.type) {
        case 'patch': {
            const [matchID, stateID, prevState, state] = payload.args;
            const log = redactLog(state.deltalog, playerID);
            const filteredState = applyPlayerView(game, playerID, state);
            const newStateID = state._stateID;
            const prevFilteredState = applyPlayerView(game, playerID, prevState);
            const patch = (0,rfc6902/* createPatch */.rh)(prevFilteredState, filteredState);
            return {
                type: 'patch',
                args: [matchID, stateID, newStateID, patch, log],
            };
        }
        case 'update': {
            const [matchID, state] = payload.args;
            const log = redactLog(state.deltalog, playerID);
            const filteredState = applyPlayerView(game, playerID, state);
            return {
                type: 'update',
                args: [matchID, filteredState, log],
            };
        }
        case 'sync': {
            const [matchID, syncInfo] = payload.args;
            const filteredState = applyPlayerView(game, playerID, syncInfo.state);
            const log = redactLog(syncInfo.log, playerID);
            const newSyncInfo = {
                ...syncInfo,
                state: filteredState,
                log,
            };
            return {
                type: 'sync',
                args: [matchID, newSyncInfo],
            };
        }
        default: {
            return payload;
        }
    }
};
/**
 * Redact the log.
 *
 * @param {Array} log - The game log (or deltalog).
 * @param {String} playerID - The playerID that this log is
 *                            to be sent to.
 */
function redactLog(log, playerID) {
    if (log === undefined) {
        return log;
    }
    return log.map((logEvent) => {
        // filter for all other players and spectators.
        if (playerID !== null && +playerID === +logEvent.action.payload.playerID) {
            return logEvent;
        }
        if (logEvent.redact !== true) {
            return logEvent;
        }
        const payload = {
            ...logEvent.action.payload,
            args: null,
        };
        const filteredEvent = {
            ...logEvent,
            action: { ...logEvent.action, payload },
        };
        const { redact, ...remaining } = filteredEvent;
        return remaining;
    });
}



// EXTERNAL MODULE: ./node_modules/parseuri/index.js
var parseuri = __webpack_require__(187);
;// CONCATENATED MODULE: ./node_modules/socket.io-client/build/esm/url.js

/**
 * URL parser.
 *
 * @param uri - url
 * @param path - the request path of the connection
 * @param loc - An object meant to mimic window.location.
 *        Defaults to window.location.
 * @public
 */
function url(uri, path = "", loc) {
    let obj = uri;
    // default to window.location
    loc = loc || (typeof location !== "undefined" && location);
    if (null == uri)
        uri = loc.protocol + "//" + loc.host;
    // relative path support
    if (typeof uri === "string") {
        if ("/" === uri.charAt(0)) {
            if ("/" === uri.charAt(1)) {
                uri = loc.protocol + uri;
            }
            else {
                uri = loc.host + uri;
            }
        }
        if (!/^(https?|wss?):\/\//.test(uri)) {
            if ("undefined" !== typeof loc) {
                uri = loc.protocol + "//" + uri;
            }
            else {
                uri = "https://" + uri;
            }
        }
        // parse
        obj = parseuri(uri);
    }
    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
            obj.port = "80";
        }
        else if (/^(http|ws)s$/.test(obj.protocol)) {
            obj.port = "443";
        }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    // define unique id
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    // define href
    obj.href =
        obj.protocol +
            "://" +
            host +
            (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
}

// EXTERNAL MODULE: ./node_modules/has-cors/index.js
var has_cors = __webpack_require__(58);
;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/globalThis.browser.js
/* harmony default export */ const globalThis_browser = ((() => {
    if (typeof self !== "undefined") {
        return self;
    }
    else if (typeof window !== "undefined") {
        return window;
    }
    else {
        return Function("return this")();
    }
})());

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/xmlhttprequest.browser.js
// browser shim for xmlhttprequest module


/* harmony default export */ function xmlhttprequest_browser(opts) {
    const xdomain = opts.xdomain;
    // XMLHttpRequest can be disabled on IE
    try {
        if ("undefined" !== typeof XMLHttpRequest && (!xdomain || has_cors)) {
            return new XMLHttpRequest();
        }
    }
    catch (e) { }
    if (!xdomain) {
        try {
            return new globalThis_browser[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
        }
        catch (e) { }
    }
}

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/util.js

function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
        if (obj.hasOwnProperty(k)) {
            acc[k] = obj[k];
        }
        return acc;
    }, {});
}
// Keep a reference to the real timeout functions so they can be used when overridden
const NATIVE_SET_TIMEOUT = setTimeout;
const NATIVE_CLEAR_TIMEOUT = clearTimeout;
function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
        obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis_browser);
        obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis_browser);
    }
    else {
        obj.setTimeoutFn = setTimeout.bind(globalThis_browser);
        obj.clearTimeoutFn = clearTimeout.bind(globalThis_browser);
    }
}

// EXTERNAL MODULE: ./node_modules/@socket.io/component-emitter/index.js
var component_emitter = __webpack_require__(63);
;// CONCATENATED MODULE: ./node_modules/engine.io-client/node_modules/engine.io-parser/build/esm/commons.js
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };


;// CONCATENATED MODULE: ./node_modules/engine.io-client/node_modules/engine.io-parser/build/esm/encodePacket.browser.js

const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
// ArrayBuffer.isView method is not defined in IE10
const isView = obj => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj && obj.buffer instanceof ArrayBuffer;
};
const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (withNativeBlob && data instanceof Blob) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(data, callback);
        }
    }
    else if (withNativeArrayBuffer &&
        (data instanceof ArrayBuffer || isView(data))) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(new Blob([data]), callback);
        }
    }
    // plain string
    return callback(PACKET_TYPES[type] + (data || ""));
};
const encodeBlobAsBase64 = (data, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const content = fileReader.result.split(",")[1];
        callback("b" + content);
    };
    return fileReader.readAsDataURL(data);
};
/* harmony default export */ const encodePacket_browser = (encodePacket);

;// CONCATENATED MODULE: ./node_modules/engine.io-client/node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js
/*
 * base64-arraybuffer 1.0.1 <https://github.com/niklasvh/base64-arraybuffer>
 * Copyright (c) 2021 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (var base64_arraybuffer_es5_i = 0; base64_arraybuffer_es5_i < chars.length; base64_arraybuffer_es5_i++) {
    lookup[chars.charCodeAt(base64_arraybuffer_es5_i)] = base64_arraybuffer_es5_i;
}
var encode = function (arraybuffer) {
    var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
};
var decode = function (base64) {
    var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};


//# sourceMappingURL=base64-arraybuffer.es5.js.map

;// CONCATENATED MODULE: ./node_modules/engine.io-client/node_modules/engine.io-parser/build/esm/decodePacket.browser.js


const decodePacket_browser_withNativeArrayBuffer = typeof ArrayBuffer === "function";
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
        };
    }
    const packetType = PACKET_TYPES_REVERSE[type];
    if (!packetType) {
        return ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: PACKET_TYPES_REVERSE[type]
        };
};
const decodeBase64Packet = (data, binaryType) => {
    if (decodePacket_browser_withNativeArrayBuffer) {
        const decoded = decode(data);
        return mapBinary(decoded, binaryType);
    }
    else {
        return { base64: true, data }; // fallback for old browsers
    }
};
const mapBinary = (data, binaryType) => {
    switch (binaryType) {
        case "blob":
            return data instanceof ArrayBuffer ? new Blob([data]) : data;
        case "arraybuffer":
        default:
            return data; // assuming the data is already an ArrayBuffer
    }
};
/* harmony default export */ const decodePacket_browser = (decodePacket);

;// CONCATENATED MODULE: ./node_modules/engine.io-client/node_modules/engine.io-parser/build/esm/index.js


const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        encodePacket_browser(packet, false, encodedPacket => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
            }
        });
    });
};
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = decodePacket_browser(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
const protocol = 4;


;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transport.js



class transport_Transport extends component_emitter/* Emitter */.Q {
    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */
    constructor(opts) {
        super();
        this.writable = false;
        installTimerFunctions(this, opts);
        this.opts = opts;
        this.query = opts.query;
        this.readyState = "";
        this.socket = opts.socket;
    }
    /**
     * Emits an error.
     *
     * @param {String} str
     * @return {Transport} for chaining
     * @api protected
     */
    onError(msg, desc) {
        const err = new Error(msg);
        // @ts-ignore
        err.type = "TransportError";
        // @ts-ignore
        err.description = desc;
        super.emit("error", err);
        return this;
    }
    /**
     * Opens the transport.
     *
     * @api public
     */
    open() {
        if ("closed" === this.readyState || "" === this.readyState) {
            this.readyState = "opening";
            this.doOpen();
        }
        return this;
    }
    /**
     * Closes the transport.
     *
     * @api public
     */
    close() {
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.doClose();
            this.onClose();
        }
        return this;
    }
    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api public
     */
    send(packets) {
        if ("open" === this.readyState) {
            this.write(packets);
        }
        else {
            // this might happen if the transport was silently closed in the beforeunload event handler
        }
    }
    /**
     * Called upon open
     *
     * @api protected
     */
    onOpen() {
        this.readyState = "open";
        this.writable = true;
        super.emit("open");
    }
    /**
     * Called with data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        const packet = decodePacket_browser(data, this.socket.binaryType);
        this.onPacket(packet);
    }
    /**
     * Called with a decoded packet.
     *
     * @api protected
     */
    onPacket(packet) {
        super.emit("packet", packet);
    }
    /**
     * Called upon close.
     *
     * @api protected
     */
    onClose() {
        this.readyState = "closed";
        super.emit("close");
    }
}

// EXTERNAL MODULE: ./node_modules/yeast/index.js
var yeast = __webpack_require__(281);
// EXTERNAL MODULE: ./node_modules/parseqs/index.js
var parseqs = __webpack_require__(830);
;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/polling.js




class Polling extends transport_Transport {
    constructor() {
        super(...arguments);
        this.polling = false;
    }
    /**
     * Transport name.
     */
    get name() {
        return "polling";
    }
    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */
    doOpen() {
        this.poll();
    }
    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */
    pause(onPause) {
        this.readyState = "pausing";
        const pause = () => {
            this.readyState = "paused";
            onPause();
        };
        if (this.polling || !this.writable) {
            let total = 0;
            if (this.polling) {
                total++;
                this.once("pollComplete", function () {
                    --total || pause();
                });
            }
            if (!this.writable) {
                total++;
                this.once("drain", function () {
                    --total || pause();
                });
            }
        }
        else {
            pause();
        }
    }
    /**
     * Starts polling cycle.
     *
     * @api public
     */
    poll() {
        this.polling = true;
        this.doPoll();
        this.emit("poll");
    }
    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */
    onData(data) {
        const callback = packet => {
            // if its the first message we consider the transport open
            if ("opening" === this.readyState && packet.type === "open") {
                this.onOpen();
            }
            // if its a close packet, we close the ongoing requests
            if ("close" === packet.type) {
                this.onClose();
                return false;
            }
            // otherwise bypass onData and handle the message
            this.onPacket(packet);
        };
        // decode payload
        decodePayload(data, this.socket.binaryType).forEach(callback);
        // if an event did not trigger closing
        if ("closed" !== this.readyState) {
            // if we got data we're not polling
            this.polling = false;
            this.emit("pollComplete");
            if ("open" === this.readyState) {
                this.poll();
            }
            else {
            }
        }
    }
    /**
     * For polling, send a close packet.
     *
     * @api private
     */
    doClose() {
        const close = () => {
            this.write([{ type: "close" }]);
        };
        if ("open" === this.readyState) {
            close();
        }
        else {
            // in case we're trying to close while
            // handshaking is in progress (GH-164)
            this.once("open", close);
        }
    }
    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */
    write(packets) {
        this.writable = false;
        encodePayload(packets, data => {
            this.doWrite(data, () => {
                this.writable = true;
                this.emit("drain");
            });
        });
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "https" : "http";
        let port = "";
        // cache busting is forced
        if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = yeast();
        }
        if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
        }
        // avoid port if default for schema
        if (this.opts.port &&
            (("https" === schema && Number(this.opts.port) !== 443) ||
                ("http" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        const encodedQuery = parseqs.encode(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
}

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/polling-xhr.js
/* global attachEvent */





/**
 * Empty function
 */
function empty() { }
const hasXHR2 = (function () {
    const xhr = new xmlhttprequest_browser({
        xdomain: false
    });
    return null != xhr.responseType;
})();
class XHR extends Polling {
    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */
    constructor(opts) {
        super(opts);
        if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            // some user agents have empty `location.port`
            if (!port) {
                port = isSSL ? "443" : "80";
            }
            this.xd =
                (typeof location !== "undefined" &&
                    opts.hostname !== location.hostname) ||
                    port !== opts.port;
            this.xs = opts.secure !== isSSL;
        }
        /**
         * XHR supports binary
         */
        const forceBase64 = opts && opts.forceBase64;
        this.supportsBinary = hasXHR2 && !forceBase64;
    }
    /**
     * Creates a request.
     *
     * @param {String} method
     * @api private
     */
    request(opts = {}) {
        Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
        return new Request(this.uri(), opts);
    }
    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @api private
     */
    doWrite(data, fn) {
        const req = this.request({
            method: "POST",
            data: data
        });
        req.on("success", fn);
        req.on("error", err => {
            this.onError("xhr post error", err);
        });
    }
    /**
     * Starts a poll cycle.
     *
     * @api private
     */
    doPoll() {
        const req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", err => {
            this.onError("xhr poll error", err);
        });
        this.pollXhr = req;
    }
}
class Request extends component_emitter/* Emitter */.Q {
    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */
    constructor(uri, opts) {
        super();
        installTimerFunctions(this, opts);
        this.opts = opts;
        this.method = opts.method || "GET";
        this.uri = uri;
        this.async = false !== opts.async;
        this.data = undefined !== opts.data ? opts.data : null;
        this.create();
    }
    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */
    create() {
        const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this.opts.xd;
        opts.xscheme = !!this.opts.xs;
        const xhr = (this.xhr = new xmlhttprequest_browser(opts));
        try {
            xhr.open(this.method, this.uri, this.async);
            try {
                if (this.opts.extraHeaders) {
                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                    for (let i in this.opts.extraHeaders) {
                        if (this.opts.extraHeaders.hasOwnProperty(i)) {
                            xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                        }
                    }
                }
            }
            catch (e) { }
            if ("POST" === this.method) {
                try {
                    xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                }
                catch (e) { }
            }
            try {
                xhr.setRequestHeader("Accept", "*/*");
            }
            catch (e) { }
            // ie6 check
            if ("withCredentials" in xhr) {
                xhr.withCredentials = this.opts.withCredentials;
            }
            if (this.opts.requestTimeout) {
                xhr.timeout = this.opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
                if (4 !== xhr.readyState)
                    return;
                if (200 === xhr.status || 1223 === xhr.status) {
                    this.onLoad();
                }
                else {
                    // make sure the `error` event handler that's user-set
                    // does not throw in the same tick and gets caught here
                    this.setTimeoutFn(() => {
                        this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                    }, 0);
                }
            };
            xhr.send(this.data);
        }
        catch (e) {
            // Need to defer since .create() is called directly from the constructor
            // and thus the 'error' event can only be only bound *after* this exception
            // occurs.  Therefore, also, we cannot throw here at all.
            this.setTimeoutFn(() => {
                this.onError(e);
            }, 0);
            return;
        }
        if (typeof document !== "undefined") {
            this.index = Request.requestsCount++;
            Request.requests[this.index] = this;
        }
    }
    /**
     * Called upon successful response.
     *
     * @api private
     */
    onSuccess() {
        this.emit("success");
        this.cleanup();
    }
    /**
     * Called if we have data.
     *
     * @api private
     */
    onData(data) {
        this.emit("data", data);
        this.onSuccess();
    }
    /**
     * Called upon error.
     *
     * @api private
     */
    onError(err) {
        this.emit("error", err);
        this.cleanup(true);
    }
    /**
     * Cleans up house.
     *
     * @api private
     */
    cleanup(fromError) {
        if ("undefined" === typeof this.xhr || null === this.xhr) {
            return;
        }
        this.xhr.onreadystatechange = empty;
        if (fromError) {
            try {
                this.xhr.abort();
            }
            catch (e) { }
        }
        if (typeof document !== "undefined") {
            delete Request.requests[this.index];
        }
        this.xhr = null;
    }
    /**
     * Called upon load.
     *
     * @api private
     */
    onLoad() {
        const data = this.xhr.responseText;
        if (data !== null) {
            this.onData(data);
        }
    }
    /**
     * Aborts the request.
     *
     * @api public
     */
    abort() {
        this.cleanup();
    }
}
Request.requestsCount = 0;
Request.requests = {};
/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */
if (typeof document !== "undefined") {
    // @ts-ignore
    if (typeof attachEvent === "function") {
        // @ts-ignore
        attachEvent("onunload", unloadHandler);
    }
    else if (typeof addEventListener === "function") {
        const terminationEvent = "onpagehide" in globalThis_browser ? "pagehide" : "unload";
        addEventListener(terminationEvent, unloadHandler, false);
    }
}
function unloadHandler() {
    for (let i in Request.requests) {
        if (Request.requests.hasOwnProperty(i)) {
            Request.requests[i].abort();
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/websocket-constructor.browser.js

const nextTick = (() => {
    const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
    if (isPromiseAvailable) {
        return cb => Promise.resolve().then(cb);
    }
    else {
        return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
    }
})();
const WebSocket = globalThis_browser.WebSocket || globalThis_browser.MozWebSocket;
const usingBrowserWebSocket = true;
const defaultBinaryType = "arraybuffer";

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/websocket.js






// detect ReactNative environment
const isReactNative = typeof navigator !== "undefined" &&
    typeof navigator.product === "string" &&
    navigator.product.toLowerCase() === "reactnative";
class WS extends transport_Transport {
    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */
    constructor(opts) {
        super(opts);
        this.supportsBinary = !opts.forceBase64;
    }
    /**
     * Transport name.
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Opens socket.
     *
     * @api private
     */
    doOpen() {
        if (!this.check()) {
            // let probe timeout
            return;
        }
        const uri = this.uri();
        const protocols = this.opts.protocols;
        // React Native only supports the 'headers' option, and will print a warning if anything else is passed
        const opts = isReactNative
            ? {}
            : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
        }
        try {
            this.ws =
                usingBrowserWebSocket && !isReactNative
                    ? protocols
                        ? new WebSocket(uri, protocols)
                        : new WebSocket(uri)
                    : new WebSocket(uri, protocols, opts);
        }
        catch (err) {
            return this.emit("error", err);
        }
        this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
        this.addEventListeners();
    }
    /**
     * Adds event listeners to the socket
     *
     * @api private
     */
    addEventListeners() {
        this.ws.onopen = () => {
            if (this.opts.autoUnref) {
                this.ws._socket.unref();
            }
            this.onOpen();
        };
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = ev => this.onData(ev.data);
        this.ws.onerror = e => this.onError("websocket error", e);
    }
    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */
    write(packets) {
        this.writable = false;
        // encodePacket efficient as it uses WS framing
        // no need for encodePayload
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            encodePacket_browser(packet, this.supportsBinary, data => {
                // always create a new object (GH-437)
                const opts = {};
                if (!usingBrowserWebSocket) {
                    if (packet.options) {
                        opts.compress = packet.options.compress;
                    }
                    if (this.opts.perMessageDeflate) {
                        const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
                        if (len < this.opts.perMessageDeflate.threshold) {
                            opts.compress = false;
                        }
                    }
                }
                // Sometimes the websocket has already been closed but the browser didn't
                // have a chance of informing us about it yet, in that case send will
                // throw an error
                try {
                    if (usingBrowserWebSocket) {
                        // TypeError is thrown when passing the second argument on Safari
                        this.ws.send(data);
                    }
                    else {
                        this.ws.send(data, opts);
                    }
                }
                catch (e) {
                }
                if (lastPacket) {
                    // fake drain
                    // defer to next tick to allow Socket to clear writeBuffer
                    nextTick(() => {
                        this.writable = true;
                        this.emit("drain");
                    }, this.setTimeoutFn);
                }
            });
        }
    }
    /**
     * Closes socket.
     *
     * @api private
     */
    doClose() {
        if (typeof this.ws !== "undefined") {
            this.ws.close();
            this.ws = null;
        }
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "wss" : "ws";
        let port = "";
        // avoid port if default for schema
        if (this.opts.port &&
            (("wss" === schema && Number(this.opts.port) !== 443) ||
                ("ws" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        // append timestamp to URI
        if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = yeast();
        }
        // communicate binary support capabilities
        if (!this.supportsBinary) {
            query.b64 = 1;
        }
        const encodedQuery = parseqs.encode(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */
    check() {
        return (!!WebSocket &&
            !("__initialize" in WebSocket && this.name === WS.prototype.name));
    }
}

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/transports/index.js


const transports = {
    websocket: WS,
    polling: XHR
};

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/socket.js






class Socket extends component_emitter/* Emitter */.Q {
    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} opts - options
     * @api public
     */
    constructor(uri, opts = {}) {
        super();
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
        }
        if (uri) {
            uri = parseuri(uri);
            opts.hostname = uri.host;
            opts.secure = uri.protocol === "https" || uri.protocol === "wss";
            opts.port = uri.port;
            if (uri.query)
                opts.query = uri.query;
        }
        else if (opts.host) {
            opts.hostname = parseuri(opts.host).host;
        }
        installTimerFunctions(this, opts);
        this.secure =
            null != opts.secure
                ? opts.secure
                : typeof location !== "undefined" && "https:" === location.protocol;
        if (opts.hostname && !opts.port) {
            // if no port is specified manually, use the protocol default
            opts.port = this.secure ? "443" : "80";
        }
        this.hostname =
            opts.hostname ||
                (typeof location !== "undefined" ? location.hostname : "localhost");
        this.port =
            opts.port ||
                (typeof location !== "undefined" && location.port
                    ? location.port
                    : this.secure
                        ? "443"
                        : "80");
        this.transports = opts.transports || ["polling", "websocket"];
        this.readyState = "";
        this.writeBuffer = [];
        this.prevBufferLen = 0;
        this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            rejectUnauthorized: true,
            perMessageDeflate: {
                threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: true
        }, opts);
        this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
        if (typeof this.opts.query === "string") {
            this.opts.query = parseqs.decode(this.opts.query);
        }
        // set on handshake
        this.id = null;
        this.upgrades = null;
        this.pingInterval = null;
        this.pingTimeout = null;
        // set on heartbeat
        this.pingTimeoutTimer = null;
        if (typeof addEventListener === "function") {
            if (this.opts.closeOnBeforeunload) {
                // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                // closed/reloaded)
                addEventListener("beforeunload", () => {
                    if (this.transport) {
                        // silently close the transport
                        this.transport.removeAllListeners();
                        this.transport.close();
                    }
                }, false);
            }
            if (this.hostname !== "localhost") {
                this.offlineEventListener = () => {
                    this.onClose("transport close");
                };
                addEventListener("offline", this.offlineEventListener, false);
            }
        }
        this.open();
    }
    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */
    createTransport(name) {
        const query = clone(this.opts.query);
        // append engine.io protocol identifier
        query.EIO = protocol;
        // transport name
        query.transport = name;
        // session id if we already have one
        if (this.id)
            query.sid = this.id;
        const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
        });
        return new transports[name](opts);
    }
    /**
     * Initializes transport to use and starts probe.
     *
     * @api private
     */
    open() {
        let transport;
        if (this.opts.rememberUpgrade &&
            Socket.priorWebsocketSuccess &&
            this.transports.indexOf("websocket") !== -1) {
            transport = "websocket";
        }
        else if (0 === this.transports.length) {
            // Emit error on next tick so it can be listened to
            this.setTimeoutFn(() => {
                this.emitReserved("error", "No transports available");
            }, 0);
            return;
        }
        else {
            transport = this.transports[0];
        }
        this.readyState = "opening";
        // Retry with the next transport if the transport is disabled (jsonp: false)
        try {
            transport = this.createTransport(transport);
        }
        catch (e) {
            this.transports.shift();
            this.open();
            return;
        }
        transport.open();
        this.setTransport(transport);
    }
    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @api private
     */
    setTransport(transport) {
        if (this.transport) {
            this.transport.removeAllListeners();
        }
        // set up transport
        this.transport = transport;
        // set up transport listeners
        transport
            .on("drain", this.onDrain.bind(this))
            .on("packet", this.onPacket.bind(this))
            .on("error", this.onError.bind(this))
            .on("close", () => {
            this.onClose("transport close");
        });
    }
    /**
     * Probes a transport.
     *
     * @param {String} transport name
     * @api private
     */
    probe(name) {
        let transport = this.createTransport(name);
        let failed = false;
        Socket.priorWebsocketSuccess = false;
        const onTransportOpen = () => {
            if (failed)
                return;
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", msg => {
                if (failed)
                    return;
                if ("pong" === msg.type && "probe" === msg.data) {
                    this.upgrading = true;
                    this.emitReserved("upgrading", transport);
                    if (!transport)
                        return;
                    Socket.priorWebsocketSuccess = "websocket" === transport.name;
                    this.transport.pause(() => {
                        if (failed)
                            return;
                        if ("closed" === this.readyState)
                            return;
                        cleanup();
                        this.setTransport(transport);
                        transport.send([{ type: "upgrade" }]);
                        this.emitReserved("upgrade", transport);
                        transport = null;
                        this.upgrading = false;
                        this.flush();
                    });
                }
                else {
                    const err = new Error("probe error");
                    // @ts-ignore
                    err.transport = transport.name;
                    this.emitReserved("upgradeError", err);
                }
            });
        };
        function freezeTransport() {
            if (failed)
                return;
            // Any callback called by transport should be ignored since now
            failed = true;
            cleanup();
            transport.close();
            transport = null;
        }
        // Handle any error that happens while probing
        const onerror = err => {
            const error = new Error("probe error: " + err);
            // @ts-ignore
            error.transport = transport.name;
            freezeTransport();
            this.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
            onerror("transport closed");
        }
        // When the socket is closed while we're probing
        function onclose() {
            onerror("socket closed");
        }
        // When the socket is upgraded while we're probing
        function onupgrade(to) {
            if (transport && to.name !== transport.name) {
                freezeTransport();
            }
        }
        // Remove all listeners on the transport and on self
        const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        transport.open();
    }
    /**
     * Called when connection is deemed open.
     *
     * @api private
     */
    onOpen() {
        this.readyState = "open";
        Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush();
        // we check for `readyState` in case an `open`
        // listener already closed the socket
        if ("open" === this.readyState &&
            this.opts.upgrade &&
            this.transport.pause) {
            let i = 0;
            const l = this.upgrades.length;
            for (; i < l; i++) {
                this.probe(this.upgrades[i]);
            }
        }
    }
    /**
     * Handles a packet.
     *
     * @api private
     */
    onPacket(packet) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            this.emitReserved("packet", packet);
            // Socket is live - any packet counts
            this.emitReserved("heartbeat");
            switch (packet.type) {
                case "open":
                    this.onHandshake(JSON.parse(packet.data));
                    break;
                case "ping":
                    this.resetPingTimeout();
                    this.sendPacket("pong");
                    this.emitReserved("ping");
                    this.emitReserved("pong");
                    break;
                case "error":
                    const err = new Error("server error");
                    // @ts-ignore
                    err.code = packet.data;
                    this.onError(err);
                    break;
                case "message":
                    this.emitReserved("data", packet.data);
                    this.emitReserved("message", packet.data);
                    break;
            }
        }
        else {
        }
    }
    /**
     * Called upon handshake completion.
     *
     * @param {Object} data - handshake obj
     * @api private
     */
    onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this.upgrades = this.filterUpgrades(data.upgrades);
        this.pingInterval = data.pingInterval;
        this.pingTimeout = data.pingTimeout;
        this.onOpen();
        // In case open handler closes socket
        if ("closed" === this.readyState)
            return;
        this.resetPingTimeout();
    }
    /**
     * Sets and resets ping timeout timer based on server pings.
     *
     * @api private
     */
    resetPingTimeout() {
        this.clearTimeoutFn(this.pingTimeoutTimer);
        this.pingTimeoutTimer = this.setTimeoutFn(() => {
            this.onClose("ping timeout");
        }, this.pingInterval + this.pingTimeout);
        if (this.opts.autoUnref) {
            this.pingTimeoutTimer.unref();
        }
    }
    /**
     * Called on `drain` event
     *
     * @api private
     */
    onDrain() {
        this.writeBuffer.splice(0, this.prevBufferLen);
        // setting prevBufferLen = 0 is very important
        // for example, when upgrading, upgrade packet is sent over,
        // and a nonzero prevBufferLen could cause problems on `drain`
        this.prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
        }
        else {
            this.flush();
        }
    }
    /**
     * Flush write buffers.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            !this.upgrading &&
            this.writeBuffer.length) {
            this.transport.send(this.writeBuffer);
            // keep track of current length of writeBuffer
            // splice writeBuffer and callbackBuffer on `drain`
            this.prevBufferLen = this.writeBuffer.length;
            this.emitReserved("flush");
        }
    }
    /**
     * Sends a message.
     *
     * @param {String} message.
     * @param {Function} callback function.
     * @param {Object} options.
     * @return {Socket} for chaining.
     * @api public
     */
    write(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    send(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} callback function.
     * @api private
     */
    sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
            fn = data;
            data = undefined;
        }
        if ("function" === typeof options) {
            fn = options;
            options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        const packet = {
            type: type,
            data: data,
            options: options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn)
            this.once("flush", fn);
        this.flush();
    }
    /**
     * Closes the connection.
     *
     * @api public
     */
    close() {
        const close = () => {
            this.onClose("forced close");
            this.transport.close();
        };
        const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
        };
        const waitForUpgrade = () => {
            // wait for upgrade to finish since we can't send packets while pausing a transport
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
                this.once("drain", () => {
                    if (this.upgrading) {
                        waitForUpgrade();
                    }
                    else {
                        close();
                    }
                });
            }
            else if (this.upgrading) {
                waitForUpgrade();
            }
            else {
                close();
            }
        }
        return this;
    }
    /**
     * Called upon transport error
     *
     * @api private
     */
    onError(err) {
        Socket.priorWebsocketSuccess = false;
        this.emitReserved("error", err);
        this.onClose("transport error", err);
    }
    /**
     * Called upon transport close.
     *
     * @api private
     */
    onClose(reason, desc) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            // clear timers
            this.clearTimeoutFn(this.pingTimeoutTimer);
            // stop event from firing again for transport
            this.transport.removeAllListeners("close");
            // ensure transport won't stay open
            this.transport.close();
            // ignore further transport communication
            this.transport.removeAllListeners();
            if (typeof removeEventListener === "function") {
                removeEventListener("offline", this.offlineEventListener, false);
            }
            // set ready state
            this.readyState = "closed";
            // clear session id
            this.id = null;
            // emit close event
            this.emitReserved("close", reason, desc);
            // clean buffers after, so users can still
            // grab the buffers on `close` event
            this.writeBuffer = [];
            this.prevBufferLen = 0;
        }
    }
    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} server upgrades
     * @api private
     *
     */
    filterUpgrades(upgrades) {
        const filteredUpgrades = [];
        let i = 0;
        const j = upgrades.length;
        for (; i < j; i++) {
            if (~this.transports.indexOf(upgrades[i]))
                filteredUpgrades.push(upgrades[i]);
        }
        return filteredUpgrades;
    }
}
Socket.protocol = protocol;
function clone(obj) {
    const o = {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = obj[i];
        }
    }
    return o;
}

;// CONCATENATED MODULE: ./node_modules/engine.io-client/build/esm/index.js


const esm_protocol = Socket.protocol;




;// CONCATENATED MODULE: ./node_modules/socket.io-client/node_modules/socket.io-parser/build/esm/is-binary.js
const is_binary_withNativeArrayBuffer = typeof ArrayBuffer === "function";
const is_binary_isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const is_binary_toString = Object.prototype.toString;
const is_binary_withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        is_binary_toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        is_binary_toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((is_binary_withNativeArrayBuffer && (obj instanceof ArrayBuffer || is_binary_isView(obj))) ||
        (is_binary_withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}

;// CONCATENATED MODULE: ./node_modules/socket.io-client/node_modules/socket.io-parser/build/esm/binary.js

/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}

;// CONCATENATED MODULE: ./node_modules/socket.io-client/node_modules/socket.io-parser/build/esm/index.js



/**
 * Protocol version.
 *
 * @public
 */
const build_esm_protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data);
        }
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends component_emitter/* Emitter */.Q {
    constructor() {
        super();
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emitReserved("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emitReserved("decoded", packet);
            }
        }
        else if (isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emitReserved("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        return p;
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
function tryParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return false;
    }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}

;// CONCATENATED MODULE: ./node_modules/socket.io-client/build/esm/on.js
function on_on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
        obj.off(ev, fn);
    };
}

;// CONCATENATED MODULE: ./node_modules/socket.io-client/build/esm/socket.js



/**
 * Internal events.
 * These events can't be emitted by the user.
 */
const RESERVED_EVENTS = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1,
});
class socket_Socket extends component_emitter/* Emitter */.Q {
    /**
     * `Socket` constructor.
     *
     * @public
     */
    constructor(io, nsp, opts) {
        super();
        this.connected = false;
        this.disconnected = true;
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this.ids = 0;
        this.acks = {};
        this.flags = {};
        this.io = io;
        this.nsp = nsp;
        if (opts && opts.auth) {
            this.auth = opts.auth;
        }
        if (this.io._autoConnect)
            this.open();
    }
    /**
     * Subscribe to open, close and packet events
     *
     * @private
     */
    subEvents() {
        if (this.subs)
            return;
        const io = this.io;
        this.subs = [
            on_on(io, "open", this.onopen.bind(this)),
            on_on(io, "packet", this.onpacket.bind(this)),
            on_on(io, "error", this.onerror.bind(this)),
            on_on(io, "close", this.onclose.bind(this)),
        ];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects
     */
    get active() {
        return !!this.subs;
    }
    /**
     * "Opens" the socket.
     *
     * @public
     */
    connect() {
        if (this.connected)
            return this;
        this.subEvents();
        if (!this.io["_reconnecting"])
            this.io.open(); // ensure open
        if ("open" === this.io._readyState)
            this.onopen();
        return this;
    }
    /**
     * Alias for connect()
     */
    open() {
        return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    send(...args) {
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @return self
     * @public
     */
    emit(ev, ...args) {
        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
            throw new Error('"' + ev + '" is a reserved event name');
        }
        args.unshift(ev);
        const packet = {
            type: PacketType.EVENT,
            data: args,
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false;
        // event ack callback
        if ("function" === typeof args[args.length - 1]) {
            this.acks[this.ids] = args.pop();
            packet.id = this.ids++;
        }
        const isTransportWritable = this.io.engine &&
            this.io.engine.transport &&
            this.io.engine.transport.writable;
        const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
        if (discardPacket) {
        }
        else if (this.connected) {
            this.packet(packet);
        }
        else {
            this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */
    packet(packet) {
        packet.nsp = this.nsp;
        this.io._packet(packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */
    onopen() {
        if (typeof this.auth == "function") {
            this.auth((data) => {
                this.packet({ type: PacketType.CONNECT, data });
            });
        }
        else {
            this.packet({ type: PacketType.CONNECT, data: this.auth });
        }
    }
    /**
     * Called upon engine or manager `error`.
     *
     * @param err
     * @private
     */
    onerror(err) {
        if (!this.connected) {
            this.emitReserved("connect_error", err);
        }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @private
     */
    onclose(reason) {
        this.connected = false;
        this.disconnected = true;
        delete this.id;
        this.emitReserved("disconnect", reason);
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */
    onpacket(packet) {
        const sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace)
            return;
        switch (packet.type) {
            case PacketType.CONNECT:
                if (packet.data && packet.data.sid) {
                    const id = packet.data.sid;
                    this.onconnect(id);
                }
                else {
                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                }
                break;
            case PacketType.EVENT:
                this.onevent(packet);
                break;
            case PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case PacketType.ACK:
                this.onack(packet);
                break;
            case PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case PacketType.CONNECT_ERROR:
                const err = new Error(packet.data.message);
                // @ts-ignore
                err.data = packet.data.data;
                this.emitReserved("connect_error", err);
                break;
        }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        if (null != packet.id) {
            args.push(this.ack(packet.id));
        }
        if (this.connected) {
            this.emitEvent(args);
        }
        else {
            this.receiveBuffer.push(Object.freeze(args));
        }
    }
    emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        super.emit.apply(this, args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function (...args) {
            // prevent double callbacks
            if (sent)
                return;
            sent = true;
            self.packet({
                type: PacketType.ACK,
                id: id,
                data: args,
            });
        };
    }
    /**
     * Called upon a server acknowlegement.
     *
     * @param packet
     * @private
     */
    onack(packet) {
        const ack = this.acks[packet.id];
        if ("function" === typeof ack) {
            ack.apply(this, packet.data);
            delete this.acks[packet.id];
        }
        else {
        }
    }
    /**
     * Called upon server connect.
     *
     * @private
     */
    onconnect(id) {
        this.id = id;
        this.connected = true;
        this.disconnected = false;
        this.emitBuffered();
        this.emitReserved("connect");
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */
    emitBuffered() {
        this.receiveBuffer.forEach((args) => this.emitEvent(args));
        this.receiveBuffer = [];
        this.sendBuffer.forEach((packet) => this.packet(packet));
        this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */
    ondisconnect() {
        this.destroy();
        this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */
    destroy() {
        if (this.subs) {
            // clean subscriptions to avoid reconnections
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = undefined;
        }
        this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually.
     *
     * @return self
     * @public
     */
    disconnect() {
        if (this.connected) {
            this.packet({ type: PacketType.DISCONNECT });
        }
        // remove socket from pool
        this.destroy();
        if (this.connected) {
            // fire events
            this.onclose("io client disconnect");
        }
        return this;
    }
    /**
     * Alias for disconnect()
     *
     * @return self
     * @public
     */
    close() {
        return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @returns self
     * @public
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAny() {
        return this._anyListeners || [];
    }
}

// EXTERNAL MODULE: ./node_modules/backo2/index.js
var backo2 = __webpack_require__(10);
;// CONCATENATED MODULE: ./node_modules/socket.io-client/build/esm/manager.js






class Manager extends component_emitter/* Emitter */.Q {
    constructor(uri, opts) {
        var _a;
        super();
        this.nsps = {};
        this.subs = [];
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        opts.path = opts.path || "/socket.io";
        this.opts = opts;
        installTimerFunctions(this, opts);
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1000);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
        this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
        this.backoff = new backo2({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor(),
        });
        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
        this._readyState = "closed";
        this.uri = uri;
        const _parser = opts.parser || socket_io_parser_build_esm_namespaceObject;
        this.encoder = new _parser.Encoder();
        this.decoder = new _parser.Decoder();
        this._autoConnect = opts.autoConnect !== false;
        if (this._autoConnect)
            this.open();
    }
    reconnection(v) {
        if (!arguments.length)
            return this._reconnection;
        this._reconnection = !!v;
        return this;
    }
    reconnectionAttempts(v) {
        if (v === undefined)
            return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
    }
    reconnectionDelay(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
    }
    randomizationFactor(v) {
        var _a;
        if (v === undefined)
            return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
    }
    reconnectionDelayMax(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
    }
    timeout(v) {
        if (!arguments.length)
            return this._timeout;
        this._timeout = v;
        return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */
    maybeReconnectOnOpen() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this._reconnecting &&
            this._reconnection &&
            this.backoff.attempts === 0) {
            // keeps reconnection from firing twice for the same reconnection loop
            this.reconnect();
        }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */
    open(fn) {
        if (~this._readyState.indexOf("open"))
            return this;
        this.engine = new Socket(this.uri, this.opts);
        const socket = this.engine;
        const self = this;
        this._readyState = "opening";
        this.skipReconnect = false;
        // emit `open`
        const openSubDestroy = on_on(socket, "open", function () {
            self.onopen();
            fn && fn();
        });
        // emit `error`
        const errorSub = on_on(socket, "error", (err) => {
            self.cleanup();
            self._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
                fn(err);
            }
            else {
                // Only do this if there is no fn to handle the error
                self.maybeReconnectOnOpen();
            }
        });
        if (false !== this._timeout) {
            const timeout = this._timeout;
            if (timeout === 0) {
                openSubDestroy(); // prevents a race condition with the 'open' event
            }
            // set timer
            const timer = this.setTimeoutFn(() => {
                openSubDestroy();
                socket.close();
                // @ts-ignore
                socket.emit("error", new Error("timeout"));
            }, timeout);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
    }
    /**
     * Alias for open()
     *
     * @return self
     * @public
     */
    connect(fn) {
        return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */
    onopen() {
        // clear old subs
        this.cleanup();
        // mark as open
        this._readyState = "open";
        this.emitReserved("open");
        // add new subs
        const socket = this.engine;
        this.subs.push(on_on(socket, "ping", this.onping.bind(this)), on_on(socket, "data", this.ondata.bind(this)), on_on(socket, "error", this.onerror.bind(this)), on_on(socket, "close", this.onclose.bind(this)), on_on(this.decoder, "decoded", this.ondecoded.bind(this)));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */
    onping() {
        this.emitReserved("ping");
    }
    /**
     * Called with data.
     *
     * @private
     */
    ondata(data) {
        this.decoder.add(data);
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        this.emitReserved("packet", packet);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */
    onerror(err) {
        this.emitReserved("error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */
    socket(nsp, opts) {
        let socket = this.nsps[nsp];
        if (!socket) {
            socket = new socket_Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
        }
        return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */
    _destroy(socket) {
        const nsps = Object.keys(this.nsps);
        for (const nsp of nsps) {
            const socket = this.nsps[nsp];
            if (socket.active) {
                return;
            }
        }
        this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */
    _packet(packet) {
        const encodedPackets = this.encoder.encode(packet);
        for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
        }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */
    cleanup() {
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs.length = 0;
        this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */
    _close() {
        this.skipReconnect = true;
        this._reconnecting = false;
        if ("opening" === this._readyState) {
            // `onclose` will not fire because
            // an open event never happened
            this.cleanup();
        }
        this.backoff.reset();
        this._readyState = "closed";
        if (this.engine)
            this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */
    disconnect() {
        return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */
    onclose(reason) {
        this.cleanup();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason);
        if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
        }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */
    reconnect() {
        if (this._reconnecting || this.skipReconnect)
            return this;
        const self = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
        }
        else {
            const delay = this.backoff.duration();
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
                if (self.skipReconnect)
                    return;
                this.emitReserved("reconnect_attempt", self.backoff.attempts);
                // check again for the case socket closed in above events
                if (self.skipReconnect)
                    return;
                self.open((err) => {
                    if (err) {
                        self._reconnecting = false;
                        self.reconnect();
                        this.emitReserved("reconnect_error", err);
                    }
                    else {
                        self.onreconnect();
                    }
                });
            }, delay);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */
    onreconnect() {
        const attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
    }
}

;// CONCATENATED MODULE: ./node_modules/socket.io-client/build/esm/index.js



/**
 * Managers cache.
 */
const cache = {};
function esm_lookup(uri, opts) {
    if (typeof uri === "object") {
        opts = uri;
        uri = undefined;
    }
    opts = opts || {};
    const parsed = url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew ||
        opts["force new connection"] ||
        false === opts.multiplex ||
        sameNamespace;
    let io;
    if (newConnection) {
        io = new Manager(source, opts);
    }
    else {
        if (!cache[id]) {
            cache[id] = new Manager(source, opts);
        }
        io = cache[id];
    }
    if (parsed.query && !opts.query) {
        opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
}
// so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
// namespace (e.g. `io.connect(...)`), for backward compatibility
Object.assign(esm_lookup, {
    Manager: Manager,
    Socket: socket_Socket,
    io: esm_lookup,
    connect: esm_lookup,
});
/**
 * Protocol version.
 *
 * @public
 */

/**
 * Expose constructors for standalone build.
 *
 * @public
 */


;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/socketio-195158e7.js






/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * InMemory data storage.
 */
class InMemory extends Sync {
    /**
     * Creates a new InMemory storage.
     */
    constructor() {
        super();
        this.state = new Map();
        this.initial = new Map();
        this.metadata = new Map();
        this.log = new Map();
    }
    /**
     * Create a new match.
     *
     * @override
     */
    createMatch(matchID, opts) {
        this.initial.set(matchID, opts.initialState);
        this.setState(matchID, opts.initialState);
        this.setMetadata(matchID, opts.metadata);
    }
    /**
     * Write the match metadata to the in-memory object.
     */
    setMetadata(matchID, metadata) {
        this.metadata.set(matchID, metadata);
    }
    /**
     * Write the match state to the in-memory object.
     */
    setState(matchID, state, deltalog) {
        if (deltalog && deltalog.length > 0) {
            const log = this.log.get(matchID) || [];
            this.log.set(matchID, [...log, ...deltalog]);
        }
        this.state.set(matchID, state);
    }
    /**
     * Fetches state for a particular matchID.
     */
    fetch(matchID, opts) {
        const result = {};
        if (opts.state) {
            result.state = this.state.get(matchID);
        }
        if (opts.metadata) {
            result.metadata = this.metadata.get(matchID);
        }
        if (opts.log) {
            result.log = this.log.get(matchID) || [];
        }
        if (opts.initialState) {
            result.initialState = this.initial.get(matchID);
        }
        return result;
    }
    /**
     * Remove the match state from the in-memory object.
     */
    wipe(matchID) {
        this.state.delete(matchID);
        this.metadata.delete(matchID);
    }
    /**
     * Return all keys.
     *
     * @override
     */
    listMatches(opts) {
        return [...this.metadata.entries()]
            .filter(([, metadata]) => {
            if (!opts) {
                return true;
            }
            if (opts.gameName !== undefined &&
                metadata.gameName !== opts.gameName) {
                return false;
            }
            if (opts.where !== undefined) {
                if (opts.where.isGameover !== undefined) {
                    const isGameover = metadata.gameover !== undefined;
                    if (isGameover !== opts.where.isGameover) {
                        return false;
                    }
                }
                if (opts.where.updatedBefore !== undefined &&
                    metadata.updatedAt >= opts.where.updatedBefore) {
                    return false;
                }
                if (opts.where.updatedAfter !== undefined &&
                    metadata.updatedAt <= opts.where.updatedAfter) {
                    return false;
                }
            }
            return true;
        })
            .map(([key]) => key);
    }
}

class WithLocalStorageMap extends Map {
    constructor(key) {
        super();
        this.key = key;
        const cache = JSON.parse(localStorage.getItem(this.key)) || [];
        cache.forEach((entry) => this.set(...entry));
    }
    sync() {
        const entries = [...this.entries()];
        localStorage.setItem(this.key, JSON.stringify(entries));
    }
    set(key, value) {
        super.set(key, value);
        this.sync();
        return this;
    }
    delete(key) {
        const result = super.delete(key);
        this.sync();
        return result;
    }
}
/**
 * locaStorage data storage.
 */
class LocalStorage extends InMemory {
    constructor(storagePrefix = 'bgio') {
        super();
        const StorageMap = (stateKey) => new WithLocalStorageMap(`${storagePrefix}_${stateKey}`);
        this.state = StorageMap('state');
        this.initial = StorageMap('initial');
        this.metadata = StorageMap('metadata');
        this.log = StorageMap('log');
    }
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Returns null if it is not a bot's turn.
 * Otherwise, returns a playerID of a bot that may play now.
 */
function GetBotPlayer(state, bots) {
    if (state.ctx.gameover !== undefined) {
        return null;
    }
    if (state.ctx.activePlayers) {
        for (const key of Object.keys(bots)) {
            if (key in state.ctx.activePlayers) {
                return key;
            }
        }
    }
    else if (state.ctx.currentPlayer in bots) {
        return state.ctx.currentPlayer;
    }
    return null;
}
/**
 * Creates a local version of the master that the client
 * can interact with.
 */
class LocalMaster extends Master {
    constructor({ game, bots, storageKey, persist }) {
        const clientCallbacks = {};
        const initializedBots = {};
        if (game && game.ai && bots) {
            for (const playerID in bots) {
                const bot = bots[playerID];
                initializedBots[playerID] = new bot({
                    game,
                    enumerate: game.ai.enumerate,
                    seed: game.seed,
                });
            }
        }
        const send = ({ playerID, ...data }) => {
            const callback = clientCallbacks[playerID];
            if (callback !== undefined) {
                callback(filterPlayerView(playerID, data));
            }
        };
        const filterPlayerView = getFilterPlayerView(game);
        const transportAPI = {
            send,
            sendAll: (payload) => {
                for (const playerID in clientCallbacks) {
                    send({ playerID, ...payload });
                }
            },
        };
        const storage = persist ? new LocalStorage(storageKey) : new InMemory();
        super(game, storage, transportAPI);
        this.connect = (playerID, callback) => {
            clientCallbacks[playerID] = callback;
        };
        this.subscribe(({ state, matchID }) => {
            if (!bots) {
                return;
            }
            const botPlayer = GetBotPlayer(state, initializedBots);
            if (botPlayer !== null) {
                setTimeout(async () => {
                    const botAction = await initializedBots[botPlayer].play(state, botPlayer);
                    await this.onUpdate(botAction.action, state._stateID, matchID, botAction.action.payload.playerID);
                }, 100);
            }
        });
    }
}
/**
 * Local
 *
 * Transport interface that embeds a GameMaster within it
 * that you can connect multiple clients to.
 */
class LocalTransport extends Transport {
    /**
     * Creates a new Mutiplayer instance.
     * @param {string} matchID - The game ID to connect to.
     * @param {string} playerID - The player ID associated with this client.
     * @param {string} gameName - The game type (the `name` field in `Game`).
     * @param {string} numPlayers - The number of players.
     */
    constructor({ master, ...opts }) {
        super(opts);
        this.master = master;
    }
    sendChatMessage(matchID, chatMessage) {
        const args = [
            matchID,
            chatMessage,
            this.credentials,
        ];
        this.master.onChatMessage(...args);
    }
    sendAction(state, action) {
        this.master.onUpdate(action, state._stateID, this.matchID, this.playerID);
    }
    requestSync() {
        this.master.onSync(this.matchID, this.playerID, this.credentials, this.numPlayers);
    }
    connect() {
        this.setConnectionStatus(true);
        this.master.connect(this.playerID, (data) => this.notifyClient(data));
        this.requestSync();
    }
    disconnect() {
        this.setConnectionStatus(false);
    }
    updateMatchID(id) {
        this.matchID = id;
        this.connect();
    }
    updatePlayerID(id) {
        this.playerID = id;
        this.connect();
    }
    updateCredentials(credentials) {
        this.credentials = credentials;
        this.connect();
    }
}
/**
 * Global map storing local master instances.
 */
const localMasters = new Map();
/**
 * Create a local transport.
 */
function Local({ bots, persist, storageKey } = {}) {
    return (transportOpts) => {
        const { gameKey, game } = transportOpts;
        let master;
        const instance = localMasters.get(gameKey);
        if (instance &&
            instance.bots === bots &&
            instance.storageKey === storageKey &&
            instance.persist === persist) {
            master = instance.master;
        }
        if (!master) {
            master = new LocalMaster({ game, bots, persist, storageKey });
            localMasters.set(gameKey, { master, bots, persist, storageKey });
        }
        return new LocalTransport({ master, ...transportOpts });
    };
}

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
const io = esm_lookup;
/**
 * SocketIO
 *
 * Transport interface that interacts with the Master via socket.io.
 */
class SocketIOTransport extends Transport {
    /**
     * Creates a new Multiplayer instance.
     * @param {object} socket - Override for unit tests.
     * @param {object} socketOpts - Options to pass to socket.io.
     * @param {object} store - Redux store
     * @param {string} matchID - The game ID to connect to.
     * @param {string} playerID - The player ID associated with this client.
     * @param {string} credentials - Authentication credentials
     * @param {string} gameName - The game type (the `name` field in `Game`).
     * @param {string} numPlayers - The number of players.
     * @param {string} server - The game server in the form of 'hostname:port'. Defaults to the server serving the client if not provided.
     */
    constructor({ socket, socketOpts, server, ...opts }) {
        super(opts);
        this.server = server;
        this.socket = socket;
        this.socketOpts = socketOpts;
    }
    sendAction(state, action) {
        const args = [
            action,
            state._stateID,
            this.matchID,
            this.playerID,
        ];
        this.socket.emit('update', ...args);
    }
    sendChatMessage(matchID, chatMessage) {
        const args = [
            matchID,
            chatMessage,
            this.credentials,
        ];
        this.socket.emit('chat', ...args);
    }
    connect() {
        if (!this.socket) {
            if (this.server) {
                let server = this.server;
                if (server.search(/^https?:\/\//) == -1) {
                    server = 'http://' + this.server;
                }
                if (server.slice(-1) != '/') {
                    // add trailing slash if not already present
                    server = server + '/';
                }
                this.socket = io(server + this.gameName, this.socketOpts);
            }
            else {
                this.socket = io('/' + this.gameName, this.socketOpts);
            }
        }
        // Called when another player makes a move and the
        // master broadcasts the update as a patch to other clients (including
        // this one).
        this.socket.on('patch', (matchID, prevStateID, stateID, patch, deltalog) => {
            this.notifyClient({
                type: 'patch',
                args: [matchID, prevStateID, stateID, patch, deltalog],
            });
        });
        // Called when another player makes a move and the
        // master broadcasts the update to other clients (including
        // this one).
        this.socket.on('update', (matchID, state, deltalog) => {
            this.notifyClient({
                type: 'update',
                args: [matchID, state, deltalog],
            });
        });
        // Called when the client first connects to the master
        // and requests the current game state.
        this.socket.on('sync', (matchID, syncInfo) => {
            this.notifyClient({ type: 'sync', args: [matchID, syncInfo] });
        });
        // Called when new player joins the match or changes
        // it's connection status
        this.socket.on('matchData', (matchID, matchData) => {
            this.notifyClient({ type: 'matchData', args: [matchID, matchData] });
        });
        this.socket.on('chat', (matchID, chatMessage) => {
            this.notifyClient({ type: 'chat', args: [matchID, chatMessage] });
        });
        // Keep track of connection status.
        this.socket.on('connect', () => {
            // Initial sync to get game state.
            this.requestSync();
            this.setConnectionStatus(true);
        });
        this.socket.on('disconnect', () => {
            this.setConnectionStatus(false);
        });
    }
    disconnect() {
        this.socket.close();
        this.socket = null;
        this.setConnectionStatus(false);
    }
    requestSync() {
        if (this.socket) {
            const args = [
                this.matchID,
                this.playerID,
                this.credentials,
                this.numPlayers,
            ];
            this.socket.emit('sync', ...args);
        }
    }
    updateMatchID(id) {
        this.matchID = id;
        this.requestSync();
    }
    updatePlayerID(id) {
        this.playerID = id;
        this.requestSync();
    }
    updateCredentials(credentials) {
        this.credentials = credentials;
        this.requestSync();
    }
}
function SocketIO({ server, socketOpts } = {}) {
    return (transportOpts) => new SocketIOTransport({
        server,
        socketOpts,
        ...transportOpts,
    });
}



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/react.js
























/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * Client
 *
 * boardgame.io React client.
 *
 * @param {...object} game - The return value of `Game`.
 * @param {...object} numPlayers - The number of players.
 * @param {...object} board - The React component for the game.
 * @param {...object} loading - (optional) The React component for the loading state.
 * @param {...object} multiplayer - Set to a falsy value or a transportFactory, e.g., SocketIO()
 * @param {...object} debug - Enables the Debug UI.
 * @param {...object} enhancer - Optional enhancer to send to the Redux store
 *
 * Returns:
 *   A React component that wraps board and provides an
 *   API through props for it to interact with the framework
 *   and dispatch actions such as MAKE_MOVE, GAME_EVENT, RESET,
 *   UNDO and REDO.
 */
function react_Client(opts) {
    var _a;
    const { game, numPlayers, board, multiplayer, enhancer } = opts;
    let { loading, debug } = opts;
    // Component that is displayed before the client has synced
    // with the game master.
    if (loading === undefined) {
        const Loading = () => react.createElement("div", { className: "bgio-loading" }, "connecting...");
        loading = Loading;
    }
    /*
     * WrappedBoard
     *
     * The main React component that wraps the passed in
     * board component and adds the API to its props.
     */
    return _a = class WrappedBoard extends react.Component {
            constructor(props) {
                super(props);
                if (debug === undefined) {
                    debug = props.debug;
                }
                this.client = Client({
                    game,
                    debug,
                    numPlayers,
                    multiplayer,
                    matchID: props.matchID,
                    playerID: props.playerID,
                    credentials: props.credentials,
                    enhancer,
                });
            }
            componentDidMount() {
                this.unsubscribe = this.client.subscribe(() => this.forceUpdate());
                this.client.start();
            }
            componentWillUnmount() {
                this.client.stop();
                this.unsubscribe();
            }
            componentDidUpdate(prevProps) {
                if (this.props.matchID != prevProps.matchID) {
                    this.client.updateMatchID(this.props.matchID);
                }
                if (this.props.playerID != prevProps.playerID) {
                    this.client.updatePlayerID(this.props.playerID);
                }
                if (this.props.credentials != prevProps.credentials) {
                    this.client.updateCredentials(this.props.credentials);
                }
            }
            render() {
                const state = this.client.getState();
                if (state === null) {
                    return react.createElement(loading);
                }
                let _board = null;
                if (board) {
                    _board = react.createElement(board, {
                        ...state,
                        ...this.props,
                        isMultiplayer: !!multiplayer,
                        moves: this.client.moves,
                        events: this.client.events,
                        matchID: this.client.matchID,
                        playerID: this.client.playerID,
                        reset: this.client.reset,
                        undo: this.client.undo,
                        redo: this.client.redo,
                        log: this.client.log,
                        matchData: this.client.matchData,
                        sendChatMessage: this.client.sendChatMessage,
                        chatMessages: this.client.chatMessages,
                    });
                }
                return react.createElement("div", { className: "bgio-client" }, _board);
            }
        },
        _a.propTypes = {
            // The ID of a game to connect to.
            // Only relevant in multiplayer.
            matchID: (prop_types_default()).string,
            // The ID of the player associated with this client.
            // Only relevant in multiplayer.
            playerID: (prop_types_default()).string,
            // This client's authentication credentials.
            // Only relevant in multiplayer.
            credentials: (prop_types_default()).string,
            // Enable / disable the Debug UI.
            debug: (prop_types_default()).any,
        },
        _a.defaultProps = {
            matchID: 'default',
            playerID: null,
            credentials: null,
            debug: true,
        },
        _a;
}

/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
class _LobbyConnectionImpl {
    constructor({ server, gameComponents, playerName, playerCredentials, }) {
        this.client = new LobbyClient({ server });
        this.gameComponents = gameComponents;
        this.playerName = playerName || 'Visitor';
        this.playerCredentials = playerCredentials;
        this.matches = [];
    }
    async refresh() {
        try {
            this.matches = [];
            const games = await this.client.listGames();
            for (const game of games) {
                if (!this._getGameComponents(game))
                    continue;
                const { matches } = await this.client.listMatches(game);
                this.matches.push(...matches);
            }
        }
        catch (error) {
            throw new Error('failed to retrieve list of matches (' + error + ')');
        }
    }
    _getMatchInstance(matchID) {
        for (const inst of this.matches) {
            if (inst['matchID'] === matchID)
                return inst;
        }
    }
    _getGameComponents(gameName) {
        for (const comp of this.gameComponents) {
            if (comp.game.name === gameName)
                return comp;
        }
    }
    _findPlayer(playerName) {
        for (const inst of this.matches) {
            if (inst.players.some((player) => player.name === playerName))
                return inst;
        }
    }
    async join(gameName, matchID, playerID) {
        try {
            let inst = this._findPlayer(this.playerName);
            if (inst) {
                throw new Error('player has already joined ' + inst.matchID);
            }
            inst = this._getMatchInstance(matchID);
            if (!inst) {
                throw new Error('game instance ' + matchID + ' not found');
            }
            const json = await this.client.joinMatch(gameName, matchID, {
                playerID,
                playerName: this.playerName,
            });
            inst.players[Number.parseInt(playerID)].name = this.playerName;
            this.playerCredentials = json.playerCredentials;
        }
        catch (error) {
            throw new Error('failed to join match ' + matchID + ' (' + error + ')');
        }
    }
    async leave(gameName, matchID) {
        try {
            const inst = this._getMatchInstance(matchID);
            if (!inst)
                throw new Error('match instance not found');
            for (const player of inst.players) {
                if (player.name === this.playerName) {
                    await this.client.leaveMatch(gameName, matchID, {
                        playerID: player.id.toString(),
                        credentials: this.playerCredentials,
                    });
                    delete player.name;
                    delete this.playerCredentials;
                    return;
                }
            }
            throw new Error('player not found in match');
        }
        catch (error) {
            throw new Error('failed to leave match ' + matchID + ' (' + error + ')');
        }
    }
    async disconnect() {
        const inst = this._findPlayer(this.playerName);
        if (inst) {
            await this.leave(inst.gameName, inst.matchID);
        }
        this.matches = [];
        this.playerName = 'Visitor';
    }
    async create(gameName, numPlayers) {
        try {
            const comp = this._getGameComponents(gameName);
            if (!comp)
                throw new Error('game not found');
            if (numPlayers < comp.game.minPlayers ||
                numPlayers > comp.game.maxPlayers)
                throw new Error('invalid number of players ' + numPlayers);
            await this.client.createMatch(gameName, { numPlayers });
        }
        catch (error) {
            throw new Error('failed to create match for ' + gameName + ' (' + error + ')');
        }
    }
}
/**
 * LobbyConnection
 *
 * Lobby model.
 *
 * @param {string}   server - '<host>:<port>' of the server.
 * @param {Array}    gameComponents - A map of Board and Game objects for the supported games.
 * @param {string}   playerName - The name of the player.
 * @param {string}   playerCredentials - The credentials currently used by the player, if any.
 *
 * Returns:
 *   A JS object that synchronizes the list of running game instances with the server and provides an API to create/join/start instances.
 */
function LobbyConnection(opts) {
    return new _LobbyConnectionImpl(opts);
}

/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
class LobbyLoginForm extends react.Component {
    constructor() {
        super(...arguments);
        this.state = {
            playerName: this.props.playerName,
            nameErrorMsg: '',
        };
        this.onClickEnter = () => {
            if (this.state.playerName === '')
                return;
            this.props.onEnter(this.state.playerName);
        };
        this.onKeyPress = (event) => {
            if (event.key === 'Enter') {
                this.onClickEnter();
            }
        };
        this.onChangePlayerName = (event) => {
            const name = event.target.value.trim();
            this.setState({
                playerName: name,
                nameErrorMsg: name.length > 0 ? '' : 'empty player name',
            });
        };
    }
    render() {
        return (react.createElement("div", null,
            react.createElement("p", { className: "phase-title" }, "Choose a player name:"),
            react.createElement("input", { type: "text", value: this.state.playerName, onChange: this.onChangePlayerName, onKeyPress: this.onKeyPress }),
            react.createElement("span", { className: "buttons" },
                react.createElement("button", { className: "buttons", onClick: this.onClickEnter }, "Enter")),
            react.createElement("br", null),
            react.createElement("span", { className: "error-msg" },
                this.state.nameErrorMsg,
                react.createElement("br", null))));
    }
}
LobbyLoginForm.defaultProps = {
    playerName: '',
};

/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
class LobbyMatchInstance extends react.Component {
    constructor() {
        super(...arguments);
        this._createSeat = (player) => {
            return player.name || '[free]';
        };
        this._createButtonJoin = (inst, seatId) => (react.createElement("button", { key: 'button-join-' + inst.matchID, onClick: () => this.props.onClickJoin(inst.gameName, inst.matchID, '' + seatId) }, "Join"));
        this._createButtonLeave = (inst) => (react.createElement("button", { key: 'button-leave-' + inst.matchID, onClick: () => this.props.onClickLeave(inst.gameName, inst.matchID) }, "Leave"));
        this._createButtonPlay = (inst, seatId) => (react.createElement("button", { key: 'button-play-' + inst.matchID, onClick: () => this.props.onClickPlay(inst.gameName, {
                matchID: inst.matchID,
                playerID: '' + seatId,
                numPlayers: inst.players.length,
            }) }, "Play"));
        this._createButtonSpectate = (inst) => (react.createElement("button", { key: 'button-spectate-' + inst.matchID, onClick: () => this.props.onClickPlay(inst.gameName, {
                matchID: inst.matchID,
                numPlayers: inst.players.length,
            }) }, "Spectate"));
        this._createInstanceButtons = (inst) => {
            const playerSeat = inst.players.find((player) => player.name === this.props.playerName);
            const freeSeat = inst.players.find((player) => !player.name);
            if (playerSeat && freeSeat) {
                // already seated: waiting for match to start
                return this._createButtonLeave(inst);
            }
            if (freeSeat) {
                // at least 1 seat is available
                return this._createButtonJoin(inst, freeSeat.id);
            }
            // match is full
            if (playerSeat) {
                return (react.createElement("div", null, [
                    this._createButtonPlay(inst, playerSeat.id),
                    this._createButtonLeave(inst),
                ]));
            }
            // allow spectating
            return this._createButtonSpectate(inst);
        };
    }
    render() {
        const match = this.props.match;
        let status = 'OPEN';
        if (!match.players.some((player) => !player.name)) {
            status = 'RUNNING';
        }
        return (react.createElement("tr", { key: 'line-' + match.matchID },
            react.createElement("td", { key: 'cell-name-' + match.matchID }, match.gameName),
            react.createElement("td", { key: 'cell-status-' + match.matchID }, status),
            react.createElement("td", { key: 'cell-seats-' + match.matchID }, match.players.map((player) => this._createSeat(player)).join(', ')),
            react.createElement("td", { key: 'cell-buttons-' + match.matchID }, this._createInstanceButtons(match))));
    }
}

/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
class LobbyCreateMatchForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGame: 0,
            numPlayers: 2,
        };
        this._createGameNameOption = (game, idx) => {
            return (react.createElement("option", { key: 'name-option-' + idx, value: idx }, game.game.name));
        };
        this._createNumPlayersOption = (idx) => {
            return (react.createElement("option", { key: 'num-option-' + idx, value: idx }, idx));
        };
        this._createNumPlayersRange = (game) => {
            return Array.from({ length: game.maxPlayers + 1 })
                .map((_, i) => i)
                .slice(game.minPlayers);
        };
        this.onChangeNumPlayers = (event) => {
            this.setState({
                numPlayers: Number.parseInt(event.target.value),
            });
        };
        this.onChangeSelectedGame = (event) => {
            const idx = Number.parseInt(event.target.value);
            this.setState({
                selectedGame: idx,
                numPlayers: this.props.games[idx].game.minPlayers,
            });
        };
        this.onClickCreate = () => {
            this.props.createMatch(this.props.games[this.state.selectedGame].game.name, this.state.numPlayers);
        };
        /* fix min and max number of players */
        for (const game of props.games) {
            const matchDetails = game.game;
            if (!matchDetails.minPlayers) {
                matchDetails.minPlayers = 1;
            }
            if (!matchDetails.maxPlayers) {
                matchDetails.maxPlayers = 4;
            }
            console.assert(matchDetails.maxPlayers >= matchDetails.minPlayers);
        }
        this.state = {
            selectedGame: 0,
            numPlayers: props.games[0].game.minPlayers,
        };
    }
    render() {
        return (react.createElement("div", null,
            react.createElement("select", { value: this.state.selectedGame, onChange: (evt) => this.onChangeSelectedGame(evt) }, this.props.games.map((game, index) => this._createGameNameOption(game, index))),
            react.createElement("span", null, "Players:"),
            react.createElement("select", { value: this.state.numPlayers, onChange: this.onChangeNumPlayers }, this._createNumPlayersRange(this.props.games[this.state.selectedGame].game).map((number) => this._createNumPlayersOption(number))),
            react.createElement("span", { className: "buttons" },
                react.createElement("button", { onClick: this.onClickCreate }, "Create"))));
    }
}

/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
var LobbyPhases;
(function (LobbyPhases) {
    LobbyPhases["ENTER"] = "enter";
    LobbyPhases["PLAY"] = "play";
    LobbyPhases["LIST"] = "list";
})(LobbyPhases || (LobbyPhases = {}));
/**
 * Lobby
 *
 * React lobby component.
 *
 * @param {Array}  gameComponents - An array of Board and Game objects for the supported games.
 * @param {string} lobbyServer - Address of the lobby server (for example 'localhost:8000').
 *                               If not set, defaults to the server that served the page.
 * @param {string} gameServer - Address of the game server (for example 'localhost:8001').
 *                              If not set, defaults to the server that served the page.
 * @param {function} clientFactory - Function that is used to create the game clients.
 * @param {number} refreshInterval - Interval between server updates (default: 2000ms).
 * @param {bool}   debug - Enable debug information (default: false).
 *
 * Returns:
 *   A React component that provides a UI to create, list, join, leave, play or
 *   spectate matches (game instances).
 */
class Lobby extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            phase: LobbyPhases.ENTER,
            playerName: 'Visitor',
            runningMatch: null,
            errorMsg: '',
            credentialStore: {},
        };
        this._createConnection = (props) => {
            const name = this.state.playerName;
            this.connection = LobbyConnection({
                server: props.lobbyServer,
                gameComponents: props.gameComponents,
                playerName: name,
                playerCredentials: this.state.credentialStore[name],
            });
        };
        this._updateCredentials = (playerName, credentials) => {
            this.setState((prevState) => {
                // clone store or componentDidUpdate will not be triggered
                const store = Object.assign({}, prevState.credentialStore);
                store[playerName] = credentials;
                return { credentialStore: store };
            });
        };
        this._updateConnection = async () => {
            await this.connection.refresh();
            this.forceUpdate();
        };
        this._enterLobby = (playerName) => {
            this.setState({ playerName, phase: LobbyPhases.LIST });
        };
        this._exitLobby = async () => {
            await this.connection.disconnect();
            this.setState({ phase: LobbyPhases.ENTER, errorMsg: '' });
        };
        this._createMatch = async (gameName, numPlayers) => {
            try {
                await this.connection.create(gameName, numPlayers);
                await this.connection.refresh();
                // rerender
                this.setState({});
            }
            catch (error) {
                this.setState({ errorMsg: error.message });
            }
        };
        this._joinMatch = async (gameName, matchID, playerID) => {
            try {
                await this.connection.join(gameName, matchID, playerID);
                await this.connection.refresh();
                this._updateCredentials(this.connection.playerName, this.connection.playerCredentials);
            }
            catch (error) {
                this.setState({ errorMsg: error.message });
            }
        };
        this._leaveMatch = async (gameName, matchID) => {
            try {
                await this.connection.leave(gameName, matchID);
                await this.connection.refresh();
                this._updateCredentials(this.connection.playerName, this.connection.playerCredentials);
            }
            catch (error) {
                this.setState({ errorMsg: error.message });
            }
        };
        this._startMatch = (gameName, matchOpts) => {
            const gameCode = this.connection._getGameComponents(gameName);
            if (!gameCode) {
                this.setState({
                    errorMsg: 'game ' + gameName + ' not supported',
                });
                return;
            }
            let multiplayer = undefined;
            if (matchOpts.numPlayers > 1) {
                multiplayer = this.props.gameServer
                    ? SocketIO({ server: this.props.gameServer })
                    : SocketIO();
            }
            if (matchOpts.numPlayers == 1) {
                const maxPlayers = gameCode.game.maxPlayers;
                const bots = {};
                for (let i = 1; i < maxPlayers; i++) {
                    bots[i + ''] = MCTSBot;
                }
                multiplayer = Local({ bots });
            }
            const app = this.props.clientFactory({
                game: gameCode.game,
                board: gameCode.board,
                debug: this.props.debug,
                multiplayer,
            });
            const match = {
                app: app,
                matchID: matchOpts.matchID,
                playerID: matchOpts.numPlayers > 1 ? matchOpts.playerID : '0',
                credentials: this.connection.playerCredentials,
            };
            this.setState({ phase: LobbyPhases.PLAY, runningMatch: match });
        };
        this._exitMatch = () => {
            this.setState({ phase: LobbyPhases.LIST, runningMatch: null });
        };
        this._getPhaseVisibility = (phase) => {
            return this.state.phase !== phase ? 'hidden' : 'phase';
        };
        this.renderMatches = (matches, playerName) => {
            return matches.map((match) => {
                const { matchID, gameName, players } = match;
                return (react.createElement(LobbyMatchInstance, { key: 'instance-' + matchID, match: { matchID, gameName, players: Object.values(players) }, playerName: playerName, onClickJoin: this._joinMatch, onClickLeave: this._leaveMatch, onClickPlay: this._startMatch }));
            });
        };
        this._createConnection(this.props);
    }
    componentDidMount() {
        const cookie = build_cookie/* default.load */.ZP.load('lobbyState') || {};
        if (cookie.phase && cookie.phase === LobbyPhases.PLAY) {
            cookie.phase = LobbyPhases.LIST;
        }
        this.setState({
            phase: cookie.phase || LobbyPhases.ENTER,
            playerName: cookie.playerName || 'Visitor',
            credentialStore: cookie.credentialStore || {},
        });
        this._startRefreshInterval();
    }
    componentDidUpdate(prevProps, prevState) {
        const name = this.state.playerName;
        const creds = this.state.credentialStore[name];
        if (prevState.phase !== this.state.phase ||
            prevState.credentialStore[name] !== creds ||
            prevState.playerName !== name) {
            this._createConnection(this.props);
            this._updateConnection();
            const cookie = {
                phase: this.state.phase,
                playerName: name,
                credentialStore: this.state.credentialStore,
            };
            build_cookie/* default.save */.ZP.save('lobbyState', cookie, { path: '/' });
        }
        if (prevProps.refreshInterval !== this.props.refreshInterval) {
            this._startRefreshInterval();
        }
    }
    componentWillUnmount() {
        this._clearRefreshInterval();
    }
    _startRefreshInterval() {
        this._clearRefreshInterval();
        this._currentInterval = setInterval(this._updateConnection, this.props.refreshInterval);
    }
    _clearRefreshInterval() {
        clearInterval(this._currentInterval);
    }
    render() {
        const { gameComponents, renderer } = this.props;
        const { errorMsg, playerName, phase, runningMatch } = this.state;
        if (renderer) {
            return renderer({
                errorMsg,
                gameComponents,
                matches: this.connection.matches,
                phase,
                playerName,
                runningMatch,
                handleEnterLobby: this._enterLobby,
                handleExitLobby: this._exitLobby,
                handleCreateMatch: this._createMatch,
                handleJoinMatch: this._joinMatch,
                handleLeaveMatch: this._leaveMatch,
                handleExitMatch: this._exitMatch,
                handleRefreshMatches: this._updateConnection,
                handleStartMatch: this._startMatch,
            });
        }
        return (react.createElement("div", { id: "lobby-view", style: { padding: 50 } },
            react.createElement("div", { className: this._getPhaseVisibility(LobbyPhases.ENTER) },
                react.createElement(LobbyLoginForm, { key: playerName, playerName: playerName, onEnter: this._enterLobby })),
            react.createElement("div", { className: this._getPhaseVisibility(LobbyPhases.LIST) },
                react.createElement("p", null,
                    "Welcome, ",
                    playerName),
                react.createElement("div", { className: "phase-title", id: "match-creation" },
                    react.createElement("span", null, "Create a match:"),
                    react.createElement(LobbyCreateMatchForm, { games: gameComponents, createMatch: this._createMatch })),
                react.createElement("p", { className: "phase-title" }, "Join a match:"),
                react.createElement("div", { id: "instances" },
                    react.createElement("table", null,
                        react.createElement("tbody", null, this.renderMatches(this.connection.matches, playerName))),
                    react.createElement("span", { className: "error-msg" },
                        errorMsg,
                        react.createElement("br", null))),
                react.createElement("p", { className: "phase-title" }, "Matches that become empty are automatically deleted.")),
            react.createElement("div", { className: this._getPhaseVisibility(LobbyPhases.PLAY) },
                runningMatch && (react.createElement(runningMatch.app, { matchID: runningMatch.matchID, playerID: runningMatch.playerID, credentials: runningMatch.credentials })),
                react.createElement("div", { className: "buttons", id: "match-exit" },
                    react.createElement("button", { onClick: this._exitMatch }, "Exit match"))),
            react.createElement("div", { className: "buttons", id: "lobby-exit" },
                react.createElement("button", { onClick: this._exitLobby }, "Exit lobby"))));
    }
}
Lobby.propTypes = {
    gameComponents: (prop_types_default()).array.isRequired,
    lobbyServer: (prop_types_default()).string,
    gameServer: (prop_types_default()).string,
    debug: (prop_types_default()).bool,
    clientFactory: (prop_types_default()).func,
    refreshInterval: (prop_types_default()).number,
};
Lobby.defaultProps = {
    debug: false,
    clientFactory: react_Client,
    refreshInterval: 2000,
};



;// CONCATENATED MODULE: ./node_modules/boardgame.io/dist/esm/core.js




/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * PlayerView reducers.
 */
const core_PlayerView = {
    /**
     * STRIP_SECRETS
     *
     * Reducer which removes a key named `secret` and
     * removes all the keys in `players`, except for the one
     * corresponding to the current playerID.
     */
    STRIP_SECRETS: (G, ctx, playerID) => {
        const r = { ...G };
        if (r.secret !== undefined) {
            delete r.secret;
        }
        if (r.players) {
            r.players = playerID
                ? {
                    [playerID]: r.players[playerID],
                }
                : {};
        }
        return r;
    },
};



;// CONCATENATED MODULE: ./src/game/Color.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */
/**
 * Converts a hex code to a numeric value
 *
 * @param hexcode Code ranging from 00 to FF
 * @return Value between 0 and 255, or undefined if hexcode could not be converted
 */
function hexToValue(hexcode) {
    var value = parseInt(hexcode, 16);
    return value < 0 || value > 255 || isNaN(value) ? undefined : value;
}
function noUndefinedValues(array) {
    return !array.some(function (x) { return x === undefined; });
}
/**
 * Function to convert a ColorCode to the corresponding color
 *
 * @param color Color to convert
 * @return Converted color, or undefined if the ColorCode could not convert to a valid color
 */
function codeToColor(color) {
    if (color.length !== 6) {
        console.log("bailing, could not encode " + color);
        return undefined;
    }
    var colorParts = [color.slice(0, 2), color.slice(2, 4), color.slice(4)];
    var colorValues = colorParts.map(function (hexcode) { return hexToValue(hexcode); });
    if (!noUndefinedValues(colorValues)) {
        return undefined;
    }
    return {
        r: colorValues[0],
        g: colorValues[1],
        b: colorValues[2],
    };
}
/**
 * Convert a color to a hex string representing the color
 *
 * @param color Color to convert
 * @return Hex string representing the color
 */
function colorToCode(color) {
    var colorValues = [color.r, color.g, color.b];
    var colorParts = colorValues.map(function (value) { return value.toString(16); })
        .map(function (stringPiece) { return stringPiece.length < 2 ? "0" + stringPiece : stringPiece; });
    return colorParts.join('');
}
/**
 * Computes a distance metric between two colors, where higher values are more different.
 * @param first first color
 * @param second second color
 */
function distance(first, second) {
    return Math.abs(first.r - second.r) + Math.abs(first.g - second.g) + Math.abs(first.b - second.b);
}

;// CONCATENATED MODULE: ./src/game/ColorSelector.ts
var ColorSelector_dirname = "/";
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

// have to set up the colors; call this during module load
var ALL_COLORS = initColors();
/**
 * Locate the color file, which may be in one of two places depending
 * on whether we're running locally or on server
 * @param fs Dynamically-loaded fs module
 * @param path Dyanically-loaded path module
 * @return Path to colors.json. Throws error if file cannot be found
 */
function findColorFile(fs, path) {
    var possibleLocations = [
        path.resolve(ColorSelector_dirname, '../../private/colors.json'),
        path.resolve(ColorSelector_dirname, '../private/colors.json'),
    ];
    for (var _i = 0, possibleLocations_1 = possibleLocations; _i < possibleLocations_1.length; _i++) {
        var location_1 = possibleLocations_1[_i];
        if (fs.existsSync(location_1)) {
            return location_1;
        }
    }
    throw new Error("color file not found in " + possibleLocations);
}
/**
 * If we are the server, load colors from the file in private. Else, return undefined
 */
function initColors() {
    var fs = __webpack_require__(22);
    var path = __webpack_require__(526);
    if (!fs.readFileSync) {
        // we are not a NodeJS server
        return undefined;
    }
    var filePath = findColorFile(fs, path);
    var data = fs.readFileSync(filePath);
    return JSON.parse(data);
}
function selectColor(rand) {
    if (!ALL_COLORS) {
        return undefined;
    }
    var colorIdx = Math.floor(rand.Number() * ALL_COLORS.length);
    var selectedColor = ALL_COLORS[colorIdx];
    var color = codeToColor(selectedColor.color.slice(1));
    if (!color) {
        throw new Error("could not decode " + selectedColor.color.slice(1));
    }
    return {
        name: selectedColor.name,
        color: color,
        nearby: selectedColor.nearby.map(function (idx) { return ALL_COLORS[idx].name; }),
    };
}

;// CONCATENATED MODULE: ./src/game/rounds/Round.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */
function secretGetter(roundName) {
    return function (G) {
        if (G.roundName !== roundName) {
            throw new Error("attempting to get secret for " + roundName + ", but in round " + G.roundName);
        }
        return G.secret;
    };
}
function privateStateGetter(roundName) {
    return function (G) {
        if (G.roundName !== roundName) {
            throw new Error("attempting to get player info for " + roundName + ", but in round " + G.roundName);
        }
        return G.players;
    };
}
function publicStateGetter(roundName) {
    return function (G) {
        if (G.roundName !== roundName) {
            throw new Error("attempting to get public state for " + roundName + ", but in round " + G.roundName);
        }
        return G.public;
    };
}
function lastRoundStateGetter(roundName) {
    return function (G) {
        if (!G.previousRound) {
            throw new Error('Attempted to get previous round state, but was not available');
        }
        if (G.previousRound.name !== roundName) {
            throw new Error("attempting to get previous round for " + roundName + ", but previous round was " + G.previousRound.name);
        }
        return G.previousRound.data;
    };
}

;// CONCATENATED MODULE: ./src/game/rounds/GuessShadeRound.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */



var GUESS_SHADE_ROUND_NAME = 'guessShade';
var getSecretState = secretGetter(GUESS_SHADE_ROUND_NAME);
var getPrivatePlayerState = privateStateGetter(GUESS_SHADE_ROUND_NAME);
var getPublicState = publicStateGetter(GUESS_SHADE_ROUND_NAME);
var GuessShadeRound = {
    name: GUESS_SHADE_ROUND_NAME,
    initState: function (G, ctx) {
        G.secret = {
            targetColor: {
                r: 0,
                g: 0,
                b: 0,
            },
        };
        for (var _i = 0, _a = ctx.playOrder; _i < _a.length; _i++) {
            var playerId = _a[_i];
            G.players[playerId] = {
                selectedColor: undefined,
            };
        }
    },
    onBegin: function (G, ctx) {
        if (!G.secret || !ctx.random) {
            return;
        }
        var selectedColor = selectColor(ctx.random);
        var secret = getSecretState(G);
        var publicState = getPublicState(G);
        if (selectedColor) {
            secret.targetColor = selectedColor.color;
            publicState.targetColorName = selectedColor.name;
        }
    },
    scoreRound: function (G) {
        if (G.secret === undefined) {
            return;
        }
        var secret = getSecretState(G);
        var players = getPrivatePlayerState(G);
        // note: safe to use selectedColor!; as an invariant, everyone must have guessed
        // if we're scoring the round.
        var playerDistances = Object.keys(G.players).map(function (id) { return ({
            id: id,
            distance: distance(secret.targetColor, players[id].selectedColor),
        }); });
        playerDistances.sort(function (a, b) { return a.distance - b.distance; });
        var places = playerDistances.slice(1).reduce(function (collection, current) {
            var match = collection[collection.length - 1][0].distance;
            if (current.distance === match) {
                collection[collection.length - 1].push(current);
            }
            else {
                collection.push([current]);
            }
            return collection;
        }, [[playerDistances[0]]]);
        for (var _i = 0, _a = places[0]; _i < _a.length; _i++) {
            var firsts = _a[_i];
            G.scores[firsts.id] += 2;
        }
        G.previousFirsts = places[0].map(function (place) { return place.id; });
        G.previousSeconds = [];
        if (places.length > 1) {
            for (var _b = 0, _c = places[1]; _b < _c.length; _b++) {
                var seconds = _c[_b];
                G.scores[seconds.id] += 1;
            }
            G.previousSeconds = places[1].map(function (place) { return place.id; });
        }
    },
    buildPreviousRound: function (G) {
        // Only need to do this on server
        if (!G.secret) {
            return;
        }
        var secret = getSecretState(G);
        var players = getPrivatePlayerState(G);
        var publicState = getPublicState(G);
        var previousPlayerGuesses = {};
        for (var _i = 0, _a = Object.keys(players); _i < _a.length; _i++) {
            var id = _a[_i];
            // Safe to use ! here; since we're building previous round, all players
            // have guessed
            previousPlayerGuesses[id] = {
                guess: players[id].selectedColor,
            };
        }
        var previousRound = {
            name: GUESS_SHADE_ROUND_NAME,
            data: {
                colorName: publicState.targetColorName,
                colorValue: secret.targetColor,
                guesses: previousPlayerGuesses,
            },
        };
        G.previousRound = previousRound;
    },
    moves: {
        chooseColor: function (G, ctx, color) {
            if (!ctx.playerID) {
                console.error('no player ID?');
                return;
            }
            var players = getPrivatePlayerState(G);
            players[ctx.playerID].selectedColor = color;
            if (!ctx.events) {
                throw new Error('no events API available');
            }
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.endTurn();
            }
            else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: getPrivatePlayerState,
    getPublicState: getPublicState,
    getLastRoundState: lastRoundStateGetter(GUESS_SHADE_ROUND_NAME),
};

;// CONCATENATED MODULE: ./src/game/rounds/GuessMadeUpNameRound.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

var GUESS_MADE_UP_NAME_ROUND_NAME = 'guessMadeUpNmae';
var GuessMadeUpNameRound_getSecretState = secretGetter(GUESS_MADE_UP_NAME_ROUND_NAME);
var GuessMadeUpNameRound_getPrivatePlayerState = privateStateGetter(GUESS_MADE_UP_NAME_ROUND_NAME);
var GuessMadeUpNameRound_getPublicState = publicStateGetter(GUESS_MADE_UP_NAME_ROUND_NAME);
/**
 * Return ID of player who provided the specified name
 * @param players List of private player data
 * @param name Color name guessed
 *
 * @return ID of specified name
 */
function idOfPlayerWhoProvided(players, name) {
    for (var _i = 0, _a = Object.keys(players); _i < _a.length; _i++) {
        var id = _a[_i];
        if (name === players[id].providedName) {
            return id;
        }
    }
    return undefined;
}
var GuessMadeUpNameRound = {
    name: GUESS_MADE_UP_NAME_ROUND_NAME,
    initState: function (G, ctx) {
        if (!ctx.random) {
            return;
        }
        // We can assume we're comingfrom MakeUpNameRound. Synthesize initial state from there
        var oldPlayers = G.players;
        var newPlayers = {};
        for (var _i = 0, _a = ctx.playOrder; _i < _a.length; _i++) {
            var playerId = _a[_i];
            newPlayers[playerId] = {
                selectedName: undefined,
                // safe non-empty assert; all madeUpNames set by the time previous round ends
                providedName: oldPlayers[playerId].madeUpName,
            };
        }
        G.players = newPlayers;
        var candidateNames = Object.keys(newPlayers).map(function (key) { return newPlayers[key].providedName; });
        candidateNames.push(G.secret.actualName);
        candidateNames = ctx.random.Shuffle(candidateNames);
        G.public.candidateNames = candidateNames;
    },
    onBegin: function () {
        // setup completed in initState; no further setup needed here
    },
    scoreRound: function (G) {
        var secret = GuessMadeUpNameRound_getSecretState(G);
        var players = GuessMadeUpNameRound_getPrivatePlayerState(G);
        var playerIds = Object.keys(players);
        G.previousFirsts = [];
        G.previousSeconds = [];
        for (var _i = 0, playerIds_1 = playerIds; _i < playerIds_1.length; _i++) {
            var id = playerIds_1[_i];
            var curPlayer = players[id];
            if (curPlayer.selectedName === secret.actualName) {
                G.scores[id] += playerIds.length + 1;
                G.previousFirsts.push(id);
            }
            // Safe non-empty assert; selectedName is defined by the time we are in the scoring round
            var providedById = idOfPlayerWhoProvided(players, curPlayer.selectedName);
            if (providedById !== undefined) {
                G.scores[providedById] += 1;
            }
        }
    },
    buildPreviousRound: function (G) {
        if (!G.secret) {
            return;
        }
        var guessedCorrectly = [];
        var madeUpNames = {};
        var guessedBy = {};
        var players = GuessMadeUpNameRound_getPrivatePlayerState(G);
        var secret = GuessMadeUpNameRound_getSecretState(G);
        var publicState = GuessMadeUpNameRound_getPublicState(G);
        for (var _i = 0, _a = Object.keys(players); _i < _a.length; _i++) {
            var id = _a[_i];
            guessedBy[id] = [];
        }
        for (var _b = 0, _c = Object.keys(players); _b < _c.length; _b++) {
            var id = _c[_b];
            madeUpNames[id] = players[id].providedName;
            if (players[id].selectedName === secret.actualName) {
                guessedCorrectly.push(id);
            }
            else {
                var playerGuess = players[id].selectedName;
                for (var _d = 0, _e = Object.keys(players); _d < _e.length; _d++) {
                    var secondId = _e[_d];
                    if (players[secondId].providedName === playerGuess) {
                        guessedBy[secondId].push(id);
                        break;
                    }
                }
            }
        }
        G.previousRound = {
            name: GUESS_MADE_UP_NAME_ROUND_NAME,
            data: {
                colorName: secret.actualName,
                colorValue: publicState.targetColorShade,
                guessedCorrectly: guessedCorrectly,
                madeUpNames: madeUpNames,
                guessedBy: guessedBy,
            },
        };
    },
    moves: {
        guessName: function (G, ctx, name) {
            if (!ctx.playerID || !ctx.events) {
                return;
            }
            var players = GuessMadeUpNameRound_getPrivatePlayerState(G);
            players[ctx.playerID].selectedName = name;
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.endTurn();
            }
            else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: GuessMadeUpNameRound_getPrivatePlayerState,
    getPublicState: GuessMadeUpNameRound_getPublicState,
    getLastRoundState: lastRoundStateGetter(GUESS_MADE_UP_NAME_ROUND_NAME),
};

;// CONCATENATED MODULE: ./src/game/rounds/GuessNameRound.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


var GUESS_NAME_ROUND_NAME = 'guessColorName';
var GuessNameRound_getSecretState = secretGetter(GUESS_NAME_ROUND_NAME);
var GuessNameRound_getPrivatePlayerState = privateStateGetter(GUESS_NAME_ROUND_NAME);
var GuessNameRound_getPublicState = publicStateGetter(GUESS_NAME_ROUND_NAME);
var GuessNameRound = {
    name: GUESS_NAME_ROUND_NAME,
    initState: function (G, ctx) {
        G.secret = {
            targetName: '',
        };
        for (var _i = 0, _a = ctx.playOrder; _i < _a.length; _i++) {
            var playerId = _a[_i];
            G.players[playerId] = {
                selectedName: undefined,
            };
        }
    },
    onBegin: function (G, ctx) {
        if (!G.secret || !ctx.random) {
            return;
        }
        var selectedColor = selectColor(ctx.random);
        var secret = GuessNameRound_getSecretState(G);
        var publicState = GuessNameRound_getPublicState(G);
        if (selectedColor) {
            var wrongAnswers = ctx.random.Shuffle(selectedColor.nearby).slice(0, 3);
            secret.targetName = selectedColor.name;
            publicState.targetColorShade = selectedColor.color;
            publicState.candidateNames = ctx.random.Shuffle(__spreadArray([selectedColor.name], wrongAnswers, true));
        }
    },
    scoreRound: function (G) {
        if (G.secret === undefined) {
            return;
        }
        var secret = GuessNameRound_getSecretState(G);
        var players = GuessNameRound_getPrivatePlayerState(G);
        var rightGuessingPlayers = Object.keys(players).filter(function (id) { return players[id].selectedName === secret.targetName; });
        for (var _i = 0, rightGuessingPlayers_1 = rightGuessingPlayers; _i < rightGuessingPlayers_1.length; _i++) {
            var playerId = rightGuessingPlayers_1[_i];
            G.scores[playerId] += 1;
        }
        G.previousFirsts = rightGuessingPlayers;
        G.previousSeconds = [];
    },
    buildPreviousRound: function (G) {
        // Only need to do this on server
        if (!G.secret) {
            return;
        }
        var guesses = {};
        var players = GuessNameRound_getPrivatePlayerState(G);
        var secret = GuessNameRound_getSecretState(G);
        var publicState = GuessNameRound_getPublicState(G);
        for (var _i = 0, _a = Object.keys(players); _i < _a.length; _i++) {
            var id = _a[_i];
            // Safe to use ! here since all players have guessed by end of round
            guesses[id] = {
                guess: players[id].selectedName,
            };
        }
        var data = {
            colorName: secret.targetName,
            colorValue: publicState.targetColorShade,
            guesses: guesses,
        };
        G.previousRound = {
            name: GUESS_NAME_ROUND_NAME,
            data: data,
        };
    },
    moves: {
        guessName: function (G, ctx, name) {
            if (!ctx.playerID) {
                console.error('no player ID?');
                return;
            }
            var players = GuessNameRound_getPrivatePlayerState(G);
            players[ctx.playerID].selectedName = name;
            if (!ctx.events) {
                throw new Error('no events API available');
            }
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.endTurn();
            }
            else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: GuessNameRound_getPrivatePlayerState,
    getPublicState: GuessNameRound_getPublicState,
    getLastRoundState: lastRoundStateGetter(GUESS_NAME_ROUND_NAME),
};

;// CONCATENATED MODULE: ./src/game/rounds/MakeUpNameRound.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */




var MAKE_UP_NAME_ROUND_NAME = 'makeUpColorName';
// This round has no previous state; it's intermediate
var MakeUpNameRound_getSecretState = secretGetter(MAKE_UP_NAME_ROUND_NAME);
var MakeUpNameRound_getPrivatePlayerState = privateStateGetter(MAKE_UP_NAME_ROUND_NAME);
var MakeUpNameRound_getPublicState = publicStateGetter(MAKE_UP_NAME_ROUND_NAME);
var MakeUpNameRound = {
    name: MAKE_UP_NAME_ROUND_NAME,
    initState: function (G, ctx) {
        G.secret = {
            actualName: '',
        };
        for (var _i = 0, _a = ctx.playOrder; _i < _a.length; _i++) {
            var playerId = _a[_i];
            G.players[playerId] = {
                madeUpName: undefined,
            };
        }
    },
    onBegin: function (G, ctx) {
        if (!G.secret || !ctx.random) {
            return;
        }
        var selectedColor = selectColor(ctx.random);
        var secret = MakeUpNameRound_getSecretState(G);
        var publicState = MakeUpNameRound_getPublicState(G);
        if (selectedColor) {
            secret.actualName = selectedColor.name;
            publicState.targetColorShade = selectedColor.color;
        }
    },
    scoreRound: function (G) {
        // No score updates happen here; instead, this round transitions to GuessMadeUpNameRound
    },
    buildPreviousRound: function (G) {
        // No previous state to build; this is an intermediate phase before the GuessMadeUpNameRound
    },
    moves: {
        makeUpName: function (G, ctx, name) {
            if (!ctx.playerID) {
                return;
            }
            var secret = MakeUpNameRound_getSecretState(G);
            if (!secret) {
                return;
            }
            if (name === secret.actualName) {
                return INVALID_MOVE;
            }
            var players = MakeUpNameRound_getPrivatePlayerState(G);
            players[ctx.playerID].madeUpName = name;
            if (!ctx.events) {
                return;
            }
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.setActivePlayers({
                    all: GUESS_MADE_UP_NAME_ROUND_NAME,
                    minMoves: 1,
                    maxMoves: 1,
                });
                G.roundName = GUESS_MADE_UP_NAME_ROUND_NAME;
                GuessMadeUpNameRound.initState(G, ctx);
            }
            else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: MakeUpNameRound_getPrivatePlayerState,
    getPublicState: MakeUpNameRound_getPublicState,
    getLastRoundState: function () {
        throw new Error('We should never need to get last round state for MakeUpNameRound');
    },
};

;// CONCATENATED MODULE: ./src/game/rounds/Rounds.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */
var _a;




;
var ROUNDS = (_a = {},
    _a[GuessShadeRound.name] = GuessShadeRound,
    _a[GuessNameRound.name] = GuessNameRound,
    _a[MakeUpNameRound.name] = MakeUpNameRound,
    _a[GuessMadeUpNameRound.name] = GuessMadeUpNameRound,
    _a);
var NEXT_ROUND_OPTIONS = [
    GuessShadeRound.name, GuessNameRound.name, MakeUpNameRound.name
];
Object.freeze(ROUNDS);

;// CONCATENATED MODULE: ./src/game/Game.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */



/** Score to meet or exceed to win the game */
var WINNING_SCORE = 15;
/**
 * Compute final game situation
 *
 * @param state Game state. Invariant: at least one player score is over winning score
 */
function computeGameOver(state) {
    var passingScores = Object.keys(state.scores).map(function (key) { return ({ score: state.scores[key], key: key }); })
        .sort(function (a, b) { return b.score - a.score; })
        .filter(function (playerScore) { return playerScore.score >= WINNING_SCORE; });
    var winningScores = passingScores.filter(function (playerScore) { return playerScore.score === passingScores[0].score; });
    return {
        winners: winningScores.map(function (s) { return s.key; }),
        scores: state.scores,
    };
}
/**
 * Set of stages, built off the ROUNDS table
 */
var STAGES = {};
for (var _i = 0, Game_a = Object.keys(ROUNDS); _i < Game_a.length; _i++) {
    var key = Game_a[_i];
    STAGES[key] = {
        moves: ROUNDS[key].moves,
    };
}
console.log("STAGES is " + JSON.stringify(STAGES));
var Swatch = {
    name: 'swatch',
    minPlayers: 2,
    maxPlayers: 8,
    // automatically limit player state by stripping 'secret' and all 'player.id' but the current player
    playerView: core_PlayerView.STRIP_SECRETS,
    setup: function (ctx) {
        var result = {
            roundName: GUESS_SHADE_ROUND_NAME,
            players: {},
            scores: {},
            secret: {
                targetColor: { r: 0, g: 0, b: 0 },
            },
            public: {
                targetColorName: 'Selecting color...',
            },
            previousFirsts: [],
            previousSeconds: [],
        };
        for (var _i = 0, _a = ctx.playOrder; _i < _a.length; _i++) {
            var playerId = _a[_i];
            result.players[playerId] = {
                selectedColor: undefined,
            };
            result.scores[playerId] = 0;
        }
        if (!ctx.random) {
            throw new Error('Context did not have a random number generator!');
        }
        return result;
    },
    turn: {
        onBegin: function (G, ctx) {
            if (!G.secret || !ctx.random || !ctx.events) {
                return;
            }
            // choose next round
            var nextRound = ctx.random.Shuffle(NEXT_ROUND_OPTIONS)[0];
            //const nextRound = MAKE_UP_NAME_ROUND_NAME;
            G.roundName = nextRound;
            ROUNDS[G.roundName].initState(G, ctx);
            ROUNDS[G.roundName].onBegin(G, ctx);
            ctx.events.setActivePlayers({ all: nextRound,
                minMoves: 1,
                maxMoves: 1,
            });
        },
        onEnd: function (G, ctx) {
            var round = ROUNDS[G.roundName];
            round.scoreRound(G);
            round.buildPreviousRound(G);
        },
        stages: STAGES,
    },
    endIf: function (G, ctx) {
        if (!ctx.events) {
            return;
        }
        if (Object.keys(G.scores).some(function (playerId) { return G.scores[playerId] >= WINNING_SCORE; })) {
            var gameOver = computeGameOver(G);
            return computeGameOver(G);
        }
        return undefined;
    },
};

;// CONCATENATED MODULE: ./src/game/Player.ts
/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */
var ANONYMOUS_PLAYER = '<anonymous player>';
function nameForPlayerId(id, matchData) {
    var metadata = matchData.find(function (data) { return data.id === parseInt(id, 10); });
    if (!metadata) {
        return ANONYMOUS_PLAYER;
    }
    return metadata.name ? metadata.name : ANONYMOUS_PLAYER;
}
function scoreForPlayer(id, gameState) {
    return gameState.scores[id];
}

;// CONCATENATED MODULE: ./src/client/views/Scores.tsx
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var Scores = function (_a) {
    var state = _a.state, matchData = _a.matchData, thisPlayerId = _a.thisPlayerId;
    return (0,jsx_runtime.jsxs)("div", __assign({ className: "playerScoresSection" }, { children: [(0,jsx_runtime.jsx)("div", { children: "Scores:" }, void 0), (0,jsx_runtime.jsx)("div", __assign({ className: "playerScores" }, { children: matchData && matchData.map(function (_a) {
                    var id = _a.id;
                    return (0,jsx_runtime.jsx)("div", { children: (0,jsx_runtime.jsxs)("span", __assign({ className: thisPlayerId && id === parseInt(thisPlayerId, 10) ? 'thisPlayer' : '' }, { children: [nameForPlayerId(id.toString(), matchData), ": ", scoreForPlayer(id.toString(), state)] }), void 0) }, id);
                }) }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/GameOver.tsx
var GameOver_assign = (undefined && undefined.__assign) || function () {
    GameOver_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GameOver_assign.apply(this, arguments);
};



var GameOver = function (_a) {
    var state = _a.state, matchData = _a.matchData, thisPlayerId = _a.thisPlayerId, gameOver = _a.gameOver;
    var winDescription;
    var winnerNames = gameOver.winners.map(function (id) { return nameForPlayerId(id, matchData); });
    if (winnerNames.length > 1) {
        var winnerNameList = void 0;
        if (winnerNames.length === 2) {
            winnerNameList = winnerNames.join(' and ');
        }
        else {
            winnerNameList = "" + winnerNames.slice(0, winnerNames.length - 1).join(', ') +
                (", and " + winnerNames[winnerNames.length - 1]);
        }
        winDescription = winnerNameList + " win!";
    }
    else {
        winDescription = winnerNames[0] + " wins!";
    }
    return (0,jsx_runtime.jsxs)("div", GameOver_assign({ className: "gameOver" }, { children: [(0,jsx_runtime.jsx)("div", GameOver_assign({ className: "victor" }, { children: winDescription }), void 0), (0,jsx_runtime.jsx)(Scores, { state: state, matchData: matchData, thisPlayerId: thisPlayerId }, void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/controls/ColorChooser.tsx
var ColorChooser_assign = (undefined && undefined.__assign) || function () {
    ColorChooser_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return ColorChooser_assign.apply(this, arguments);
};



var ColorChooser = function (_a) {
    var state = _a.state, context = _a.context, moves = _a.moves, playerId = _a.playerId;
    var _b = react.useState('#000000'), selectedColor = _b[0], setSelectedColor = _b[1];
    var colorValue = codeToColor(selectedColor.slice(1));
    var colorSelected = context.activePlayers ? context.activePlayers[playerId] !== "guessShade" : true;
    return (0,jsx_runtime.jsxs)("div", ColorChooser_assign({ className: "colorChooser" }, { children: [(0,jsx_runtime.jsxs)("div", ColorChooser_assign({ className: "colorChooserControlRow" }, { children: [(0,jsx_runtime.jsx)("div", ColorChooser_assign({ className: "colorChooserBox" }, { children: (0,jsx_runtime.jsx)("input", { className: "guesscolor", type: "color", value: selectedColor, onChange: function (e) { return setSelectedColor(e.target.value); } }, void 0) }), void 0), colorValue &&
                        (0,jsx_runtime.jsxs)("div", ColorChooser_assign({ className: "chooseColorSliders" }, { children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("input", { type: "range", min: "0", max: "255", value: colorValue.r, onChange: function (e) { return updateColor(setSelectedColor, colorValue, 'r', e.target.value); } }, void 0), "red"] }, void 0), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("input", { type: "range", min: "0", max: "255", value: colorValue.g, onChange: function (e) { return updateColor(setSelectedColor, colorValue, 'g', e.target.value); } }, void 0), "green"] }, void 0), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("input", { type: "range", min: "0", max: "255", value: colorValue.b, onChange: function (e) { return updateColor(setSelectedColor, colorValue, 'b', e.target.value); } }, void 0), "blue"] }, void 0)] }), void 0)] }), void 0), (0,jsx_runtime.jsxs)("div", ColorChooser_assign({ className: "colorChooserSubmit" }, { children: [colorSelected && (0,jsx_runtime.jsx)("div", { children: "Color selected!" }, void 0), (0,jsx_runtime.jsx)("div", { children: (0,jsx_runtime.jsx)("button", ColorChooser_assign({ className: "guessbutton", disabled: colorSelected, onClick: function () { return moves.chooseColor(codeToColor(selectedColor.slice(1))); } }, { children: "Submit choice" }), void 0) }, void 0)] }), void 0)] }), void 0);
};
/**
 * Update color with a new value
 * @param setSelectedColor Accessor to update color
 * @param currentColor current RGB color value
 * @param component Which piece of color to change
 * @param value new value to assign to component of currentColor
 */
function updateColor(setSelectedColor, currentColor, component, value) {
    var _a;
    var colorNumber = parseInt(value, 10);
    var newColor = ColorChooser_assign(ColorChooser_assign({}, currentColor), (_a = {}, _a[component] = colorNumber, _a));
    setSelectedColor("#" + colorToCode(newColor));
}

;// CONCATENATED MODULE: ./src/client/views/rounds/GuessShade.tsx
var GuessShade_assign = (undefined && undefined.__assign) || function () {
    GuessShade_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessShade_assign.apply(this, arguments);
};



var GuessShade = function (_a) {
    var state = _a.state, context = _a.context, moves = _a.moves, playerId = _a.playerId;
    var publicState = GuessShadeRound.getPublicState(state);
    return (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("div", GuessShade_assign({ className: "direction" }, { children: "Guess the color for" }), void 0), (0,jsx_runtime.jsx)("div", GuessShade_assign({ className: "colorname" }, { children: publicState.targetColorName }), void 0), (0,jsx_runtime.jsx)(ColorChooser, { state: state, context: context, moves: moves, playerId: playerId }, void 0)] }, void 0);
};

;// CONCATENATED MODULE: ./src/client/views/rounds/GuessName.tsx
var GuessName_assign = (undefined && undefined.__assign) || function () {
    GuessName_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessName_assign.apply(this, arguments);
};

/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */


var GuessName = function (_a) {
    var state = _a.state, moves = _a.moves, playerId = _a.playerId;
    var publicState = GuessNameRound.getPublicState(state);
    var playerState = GuessNameRound.getPlayerState(state);
    var guessedName = playerState[playerId].selectedName;
    return (0,jsx_runtime.jsxs)("div", GuessName_assign({ className: "roundPanel" }, { children: [(0,jsx_runtime.jsx)("div", GuessName_assign({ className: "direction" }, { children: "Guess the name for" }), void 0), (0,jsx_runtime.jsx)("div", GuessName_assign({ className: "roundrow" }, { children: (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(publicState.targetColorShade) } }, void 0) }), void 0), guessedName && (0,jsx_runtime.jsxs)("div", { children: ["You guessed ", guessedName] }, void 0), (0,jsx_runtime.jsx)("ul", GuessName_assign({ className: "colorNames" }, { children: publicState.candidateNames.map(function (name) {
                    return (0,jsx_runtime.jsx)("li", { children: (0,jsx_runtime.jsx)("button", GuessName_assign({ className: "guessbutton", disabled: guessedName !== undefined, onClick: function () { return moves.guessName(name); } }, { children: name }), void 0) }, name);
                }) }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/lastrounds/GuessMadeUpNameLastRound.tsx
var GuessMadeUpNameLastRound_assign = (undefined && undefined.__assign) || function () {
    GuessMadeUpNameLastRound_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessMadeUpNameLastRound_assign.apply(this, arguments);
};




/**
 * Rendering the last round of play
 */
var GuessMadeUpNameLastRound = function (_a) {
    var gameState = _a.gameState, context = _a.context, matchData = _a.matchData;
    if (!gameState.previousRound) {
        return null;
    }
    var previousRound = GuessMadeUpNameRound.getLastRoundState(gameState);
    var guessedByNames = {};
    for (var _i = 0, _b = Object.keys(previousRound.guessedBy); _i < _b.length; _i++) {
        var id = _b[_i];
        var nameList = previousRound.guessedBy[id].map(function (guessId) { return nameForPlayerId(guessId, matchData); });
        guessedByNames[id] = nameList.length === 0 ? '<nobody>' : nameList.join(', ');
    }
    var guessedCorrectlyNames = previousRound.guessedCorrectly.map(function (id) { return nameForPlayerId(id, matchData); });
    var guessedCorrectlyReport = guessedCorrectlyNames.length === 0 ? '<nobody>' : guessedCorrectlyNames.join(', ');
    return (0,jsx_runtime.jsxs)("div", GuessMadeUpNameLastRound_assign({ className: "lastroundblock" }, { children: [(0,jsx_runtime.jsx)("h2", { children: "Last Round Results" }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Color Name" }, void 0), (0,jsx_runtime.jsx)("p", GuessMadeUpNameLastRound_assign({ className: "lastroundcolorname" }, { children: previousRound.colorName }), void 0), (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(previousRound.colorValue) } }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Guesses" }, void 0), (0,jsx_runtime.jsx)("table", GuessMadeUpNameLastRound_assign({ className: "guessMadeUpNameTable" }, { children: Object.keys(previousRound.madeUpNames).map(function (id) { return ((0,jsx_runtime.jsxs)("tr", { children: [(0,jsx_runtime.jsxs)("td", GuessMadeUpNameLastRound_assign({ className: "playerNameColumn" }, { children: [nameForPlayerId(id, matchData), ":"] }), void 0), (0,jsx_runtime.jsx)("td", GuessMadeUpNameLastRound_assign({ className: "colorNameColumn" }, { children: previousRound.madeUpNames[id] }), void 0), (0,jsx_runtime.jsxs)("td", GuessMadeUpNameLastRound_assign({ className: "guesses" }, { children: ["Guessed by: ", guessedByNames[id]] }), void 0)] }, id)); }) }), void 0), (0,jsx_runtime.jsxs)("div", GuessMadeUpNameLastRound_assign({ className: "lastroundrow" }, { children: [(0,jsx_runtime.jsx)("span", GuessMadeUpNameLastRound_assign({ className: "correctGuesses" }, { children: "Correct guesses:" }), void 0), " ", guessedCorrectlyReport] }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/lastrounds/GuessNameLastRound.tsx
var GuessNameLastRound_assign = (undefined && undefined.__assign) || function () {
    GuessNameLastRound_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessNameLastRound_assign.apply(this, arguments);
};




/**
 * Rendering the last round of play
 */
var GuessNameLastRound = function (_a) {
    var gameState = _a.gameState, context = _a.context, matchData = _a.matchData;
    if (!gameState.previousRound) {
        return null;
    }
    var previousRound = GuessNameRound.getLastRoundState(gameState);
    return (0,jsx_runtime.jsxs)("div", GuessNameLastRound_assign({ className: "lastroundblock" }, { children: [(0,jsx_runtime.jsx)("h2", { children: "Last Round Results" }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Color Name" }, void 0), (0,jsx_runtime.jsx)("p", GuessNameLastRound_assign({ className: "lastroundcolorname" }, { children: previousRound.colorName }), void 0), (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(previousRound.colorValue) } }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Guesses" }, void 0), (0,jsx_runtime.jsx)("div", GuessNameLastRound_assign({ className: "lastroundrow" }, { children: Object.keys(previousRound.guesses).map(function (id) {
                    var addedClass = '';
                    if (gameState.previousFirsts.includes(id)) {
                        addedClass = 'firstplace';
                    }
                    else if (gameState.previousSeconds.includes(id)) {
                        addedClass = 'secondplace';
                    }
                    return (0,jsx_runtime.jsxs)("div", GuessNameLastRound_assign({ className: "playerGuess " + addedClass }, { children: [(0,jsx_runtime.jsx)("div", GuessNameLastRound_assign({ className: "playerName" }, { children: nameForPlayerId(id, matchData) }), void 0), (0,jsx_runtime.jsx)("div", { children: previousRound.guesses[id].guess }, void 0)] }), void 0);
                }) }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/lastrounds/GuessShadeLastRound.tsx
var GuessShadeLastRound_assign = (undefined && undefined.__assign) || function () {
    GuessShadeLastRound_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessShadeLastRound_assign.apply(this, arguments);
};




/**
 * Rendering the last round of play
 */
var GuessShadeLastRound = function (_a) {
    var gameState = _a.gameState, context = _a.context, matchData = _a.matchData;
    if (!gameState.previousRound) {
        return null;
    }
    var previousRound = GuessShadeRound.getLastRoundState(gameState);
    return (0,jsx_runtime.jsxs)("div", GuessShadeLastRound_assign({ className: "lastroundblock" }, { children: [(0,jsx_runtime.jsx)("h2", { children: "Last Round Results" }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Color" }, void 0), (0,jsx_runtime.jsx)("p", GuessShadeLastRound_assign({ className: "lastroundcolorname" }, { children: previousRound.colorName }), void 0), (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(previousRound.colorValue) } }, void 0), (0,jsx_runtime.jsx)("h3", { children: "Guesses" }, void 0), (0,jsx_runtime.jsx)("div", GuessShadeLastRound_assign({ className: "lastroundrow" }, { children: Object.keys(previousRound.guesses).map(function (id) {
                    var addedClass = '';
                    if (gameState.previousFirsts.includes(id)) {
                        addedClass = 'firstplace';
                    }
                    else if (gameState.previousSeconds.includes(id)) {
                        addedClass = 'secondplace';
                    }
                    return (0,jsx_runtime.jsxs)("div", GuessShadeLastRound_assign({ className: "playerGuess " + addedClass }, { children: [(0,jsx_runtime.jsx)("div", GuessShadeLastRound_assign({ className: "playerName" }, { children: nameForPlayerId(id, matchData) }), void 0), (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(previousRound.guesses[id].guess) } }, void 0)] }), void 0);
                }) }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/LastRound.tsx







var LastRound = function (_a) {
    var gameState = _a.gameState, context = _a.context, matchData = _a.matchData;
    if (!gameState.previousRound) {
        return null;
    }
    if (gameState.previousRound.name === GUESS_SHADE_ROUND_NAME) {
        return (0,jsx_runtime.jsx)(GuessShadeLastRound, { gameState: gameState, context: context, matchData: matchData }, void 0);
    }
    if (gameState.previousRound.name === GUESS_NAME_ROUND_NAME) {
        return (0,jsx_runtime.jsx)(GuessNameLastRound, { gameState: gameState, context: context, matchData: matchData }, void 0);
    }
    if (gameState.previousRound.name === GUESS_MADE_UP_NAME_ROUND_NAME) {
        return (0,jsx_runtime.jsx)(GuessMadeUpNameLastRound, { gameState: gameState, context: context, matchData: matchData }, void 0);
    }
    // unknown last round type
    return null;
};

;// CONCATENATED MODULE: ./src/client/views/rounds/MakeUpName.tsx
var MakeUpName_assign = (undefined && undefined.__assign) || function () {
    MakeUpName_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return MakeUpName_assign.apply(this, arguments);
};




var MakeUpName = function (_a) {
    var state = _a.state, moves = _a.moves, playerId = _a.playerId;
    var publicState = MakeUpNameRound.getPublicState(state);
    var playerState = MakeUpNameRound.getPlayerState(state);
    var _b = (0,react.useState)(''), colorName = _b[0], setColorName = _b[1];
    var nameChosen = playerState[playerId].madeUpName !== undefined;
    var onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();
        moves.makeUpName(colorName);
    };
    return (0,jsx_runtime.jsxs)("div", MakeUpName_assign({ className: "roundPanel" }, { children: [(0,jsx_runtime.jsx)("div", MakeUpName_assign({ className: "direction" }, { children: "Make up a name for this color:" }), void 0), (0,jsx_runtime.jsx)("div", MakeUpName_assign({ className: "roundrow" }, { children: (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(publicState.targetColorShade) } }, void 0) }), void 0), (0,jsx_runtime.jsxs)("form", MakeUpName_assign({ onSubmit: onSubmit }, { children: [(0,jsx_runtime.jsx)("div", MakeUpName_assign({ className: "roundrow" }, { children: (0,jsx_runtime.jsx)("input", { disabled: nameChosen, type: "text", value: colorName, onChange: function (e) { return setColorName(e.target.value); } }, void 0) }), void 0), (0,jsx_runtime.jsx)("div", MakeUpName_assign({ className: "roundrow" }, { children: (0,jsx_runtime.jsx)("button", MakeUpName_assign({ disabled: nameChosen, type: "submit" }, { children: "Submit name" }), void 0) }), void 0)] }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/views/rounds/GuessMadeUpName.tsx
var GuessMadeUpName_assign = (undefined && undefined.__assign) || function () {
    GuessMadeUpName_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return GuessMadeUpName_assign.apply(this, arguments);
};

/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */


var GuessMadeUpName = function (_a) {
    var state = _a.state, moves = _a.moves, playerId = _a.playerId;
    var publicState = GuessMadeUpNameRound.getPublicState(state);
    var playerState = GuessMadeUpNameRound.getPlayerState(state);
    var guessedName = playerState[playerId].selectedName;
    return (0,jsx_runtime.jsxs)("div", GuessMadeUpName_assign({ className: "roundPanel" }, { children: [(0,jsx_runtime.jsx)("div", GuessMadeUpName_assign({ className: "direction" }, { children: "Guess the name for" }), void 0), (0,jsx_runtime.jsx)("div", GuessMadeUpName_assign({ className: "roundrow" }, { children: (0,jsx_runtime.jsx)("div", { className: "colorbox", style: { backgroundColor: "#" + colorToCode(publicState.targetColorShade) } }, void 0) }), void 0), guessedName && (0,jsx_runtime.jsxs)("div", { children: ["You guessed ", guessedName] }, void 0), (0,jsx_runtime.jsx)("ul", GuessMadeUpName_assign({ className: "colorNames" }, { children: publicState.candidateNames.map(function (name) {
                    return (0,jsx_runtime.jsx)("li", { children: (0,jsx_runtime.jsx)("button", GuessMadeUpName_assign({ className: "guessbutton", disabled: guessedName !== undefined, onClick: function () { return moves.guessName(name); } }, { children: name }), void 0) }, name);
                }) }), void 0)] }), void 0);
};

;// CONCATENATED MODULE: ./src/client/Board.tsx
var Board_assign = (undefined && undefined.__assign) || function () {
    Board_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return Board_assign.apply(this, arguments);
};

/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */












var Board = function (_a) {
    var G = _a.G, ctx = _a.ctx, moves = _a.moves, events = _a.events, playerID = _a.playerID, matchData = _a.matchData;
    return ((0,jsx_runtime.jsxs)("main", Board_assign({ className: "gameview" }, { children: [(0,jsx_runtime.jsx)("h1", { children: "Sw\u0103tch" }, void 0), playerID !== null &&
                matchData &&
                !ctx.gameover &&
                (0,jsx_runtime.jsxs)(react.Fragment, { children: [(0,jsx_runtime.jsx)(Scores, { state: G, matchData: matchData, thisPlayerId: playerID }, void 0), (0,jsx_runtime.jsxs)("div", { children: [G.roundName === GUESS_SHADE_ROUND_NAME &&
                                    (0,jsx_runtime.jsx)(GuessShade, { state: G, context: ctx, moves: moves, playerId: playerID }, void 0), G.roundName === GUESS_NAME_ROUND_NAME &&
                                    (0,jsx_runtime.jsx)(GuessName, { state: G, moves: moves, playerId: playerID }, void 0), G.roundName === MAKE_UP_NAME_ROUND_NAME &&
                                    (0,jsx_runtime.jsx)(MakeUpName, { state: G, moves: moves, playerId: playerID }, void 0), G.roundName === GUESS_MADE_UP_NAME_ROUND_NAME &&
                                    (0,jsx_runtime.jsx)(GuessMadeUpName, { state: G, moves: moves, playerId: playerID }, void 0)] }, void 0)] }, void 0), ctx.gameover && matchData && playerID !== null && (0,jsx_runtime.jsx)(GameOver, { matchData: matchData, gameOver: ctx.gameover, state: G, thisPlayerId: playerID }, void 0), matchData && (0,jsx_runtime.jsx)(LastRound, { gameState: G, context: ctx, matchData: matchData }, void 0)] }), void 0));
};

;// CONCATENATED MODULE: ./src/client/App.tsx

/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */





console.log(window.location.hostname);
var HOST = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.hostname;
var SERVER_URI = window.location.hostname === 'localhost' ? 'http://localhost:8000' : "http://" + window.location.hostname + ":" + window.location.port;
var App = function () {
    var _a = (0,react.useState)(null), playerId = _a[0], setPlayerId = _a[1];
    // NOTE: to re-enabled debugging, add `debug={{impl: Debug}}` property
    // TODO: we may want to check state here and if we already know our player ID etc. just hop in the game?
    return (0,jsx_runtime.jsx)(Lobby, { gameServer: SERVER_URI, lobbyServer: SERVER_URI, gameComponents: [
            { game: Swatch, board: Board }
        ] }, void 0);
};

;// CONCATENATED MODULE: ./src/client/index.tsx



var rootElement = document.getElementById('root');
(0,react_dom.render)((0,jsx_runtime.jsx)(App, {}, void 0), rootElement);

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map