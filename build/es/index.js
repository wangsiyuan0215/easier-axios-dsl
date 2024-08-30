function Ht(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Gt(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var a = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, a.get ? a : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var cr = { exports: {} }, dt = function(e, t) {
  return function() {
    for (var a = new Array(arguments.length), o = 0; o < a.length; o++)
      a[o] = arguments[o];
    return e.apply(t, a);
  };
}, zt = dt, Q = Object.prototype.toString;
function pr(r) {
  return Q.call(r) === "[object Array]";
}
function tr(r) {
  return typeof r > "u";
}
function Jt(r) {
  return r !== null && !tr(r) && r.constructor !== null && !tr(r.constructor) && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}
function Vt(r) {
  return Q.call(r) === "[object ArrayBuffer]";
}
function Qt(r) {
  return typeof FormData < "u" && r instanceof FormData;
}
function Xt(r) {
  var e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(r) : e = r && r.buffer && r.buffer instanceof ArrayBuffer, e;
}
function Yt(r) {
  return typeof r == "string";
}
function Kt(r) {
  return typeof r == "number";
}
function ht(r) {
  return r !== null && typeof r == "object";
}
function me(r) {
  if (Q.call(r) !== "[object Object]")
    return !1;
  var e = Object.getPrototypeOf(r);
  return e === null || e === Object.prototype;
}
function Zt(r) {
  return Q.call(r) === "[object Date]";
}
function en(r) {
  return Q.call(r) === "[object File]";
}
function rn(r) {
  return Q.call(r) === "[object Blob]";
}
function vt(r) {
  return Q.call(r) === "[object Function]";
}
function tn(r) {
  return ht(r) && vt(r.pipe);
}
function nn(r) {
  return typeof URLSearchParams < "u" && r instanceof URLSearchParams;
}
function an(r) {
  return r.trim ? r.trim() : r.replace(/^\s+|\s+$/g, "");
}
function on() {
  return typeof navigator < "u" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS") ? !1 : typeof window < "u" && typeof document < "u";
}
function yr(r, e) {
  if (!(r === null || typeof r > "u"))
    if (typeof r != "object" && (r = [r]), pr(r))
      for (var t = 0, n = r.length; t < n; t++)
        e.call(null, r[t], t, r);
    else
      for (var a in r)
        Object.prototype.hasOwnProperty.call(r, a) && e.call(null, r[a], a, r);
}
function nr() {
  var r = {};
  function e(a, o) {
    me(r[o]) && me(a) ? r[o] = nr(r[o], a) : me(a) ? r[o] = nr({}, a) : pr(a) ? r[o] = a.slice() : r[o] = a;
  }
  for (var t = 0, n = arguments.length; t < n; t++)
    yr(arguments[t], e);
  return r;
}
function un(r, e, t) {
  return yr(e, function(a, o) {
    t && typeof a == "function" ? r[o] = zt(a, t) : r[o] = a;
  }), r;
}
function sn(r) {
  return r.charCodeAt(0) === 65279 && (r = r.slice(1)), r;
}
var C = {
  isArray: pr,
  isArrayBuffer: Vt,
  isBuffer: Jt,
  isFormData: Qt,
  isArrayBufferView: Xt,
  isString: Yt,
  isNumber: Kt,
  isObject: ht,
  isPlainObject: me,
  isUndefined: tr,
  isDate: Zt,
  isFile: en,
  isBlob: rn,
  isFunction: vt,
  isStream: tn,
  isURLSearchParams: nn,
  isStandardBrowserEnv: on,
  forEach: yr,
  merge: nr,
  extend: un,
  trim: an,
  stripBOM: sn
}, X = C;
function Pr(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var mt = function(e, t, n) {
  if (!t)
    return e;
  var a;
  if (n)
    a = n(t);
  else if (X.isURLSearchParams(t))
    a = t.toString();
  else {
    var o = [];
    X.forEach(t, function(f, s) {
      f === null || typeof f > "u" || (X.isArray(f) ? s = s + "[]" : f = [f], X.forEach(f, function(l) {
        X.isDate(l) ? l = l.toISOString() : X.isObject(l) && (l = JSON.stringify(l)), o.push(Pr(s) + "=" + Pr(l));
      }));
    }), a = o.join("&");
  }
  if (a) {
    var u = e.indexOf("#");
    u !== -1 && (e = e.slice(0, u)), e += (e.indexOf("?") === -1 ? "?" : "&") + a;
  }
  return e;
}, fn = C;
function Ae() {
  this.handlers = [];
}
Ae.prototype.use = function(e, t, n) {
  return this.handlers.push({
    fulfilled: e,
    rejected: t,
    synchronous: n ? n.synchronous : !1,
    runWhen: n ? n.runWhen : null
  }), this.handlers.length - 1;
};
Ae.prototype.eject = function(e) {
  this.handlers[e] && (this.handlers[e] = null);
};
Ae.prototype.forEach = function(e) {
  fn.forEach(this.handlers, function(n) {
    n !== null && e(n);
  });
};
var ln = Ae, cn = C, pn = function(e, t) {
  cn.forEach(e, function(a, o) {
    o !== t && o.toUpperCase() === t.toUpperCase() && (e[t] = a, delete e[o]);
  });
}, gt = function(e, t, n, a, o) {
  return e.config = t, n && (e.code = n), e.request = a, e.response = o, e.isAxiosError = !0, e.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }, e;
}, Te, Rr;
function St() {
  if (Rr)
    return Te;
  Rr = 1;
  var r = gt;
  return Te = function(t, n, a, o, u) {
    var i = new Error(t);
    return r(i, n, a, o, u);
  }, Te;
}
var $e, xr;
function yn() {
  if (xr)
    return $e;
  xr = 1;
  var r = St();
  return $e = function(t, n, a) {
    var o = a.config.validateStatus;
    !a.status || !o || o(a.status) ? t(a) : n(r(
      "Request failed with status code " + a.status,
      a.config,
      null,
      a.request,
      a
    ));
  }, $e;
}
var Ce, Tr;
function dn() {
  if (Tr)
    return Ce;
  Tr = 1;
  var r = C;
  return Ce = r.isStandardBrowserEnv() ? (
    // Standard browser envs support document.cookie
    function() {
      return {
        write: function(n, a, o, u, i, f) {
          var s = [];
          s.push(n + "=" + encodeURIComponent(a)), r.isNumber(o) && s.push("expires=" + new Date(o).toGMTString()), r.isString(u) && s.push("path=" + u), r.isString(i) && s.push("domain=" + i), f === !0 && s.push("secure"), document.cookie = s.join("; ");
        },
        read: function(n) {
          var a = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
          return a ? decodeURIComponent(a[3]) : null;
        },
        remove: function(n) {
          this.write(n, "", Date.now() - 864e5);
        }
      };
    }()
  ) : (
    // Non standard browser env (web workers, react-native) lack needed support.
    function() {
      return {
        write: function() {
        },
        read: function() {
          return null;
        },
        remove: function() {
        }
      };
    }()
  ), Ce;
}
var Ne, $r;
function hn() {
  return $r || ($r = 1, Ne = function(e) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
  }), Ne;
}
var Ie, Cr;
function vn() {
  return Cr || (Cr = 1, Ie = function(e, t) {
    return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
  }), Ie;
}
var Fe, Nr;
function mn() {
  if (Nr)
    return Fe;
  Nr = 1;
  var r = hn(), e = vn();
  return Fe = function(n, a) {
    return n && !r(a) ? e(n, a) : a;
  }, Fe;
}
var _e, Ir;
function gn() {
  if (Ir)
    return _e;
  Ir = 1;
  var r = C, e = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  return _e = function(n) {
    var a = {}, o, u, i;
    return n && r.forEach(n.split(`
`), function(s) {
      if (i = s.indexOf(":"), o = r.trim(s.substr(0, i)).toLowerCase(), u = r.trim(s.substr(i + 1)), o) {
        if (a[o] && e.indexOf(o) >= 0)
          return;
        o === "set-cookie" ? a[o] = (a[o] ? a[o] : []).concat([u]) : a[o] = a[o] ? a[o] + ", " + u : u;
      }
    }), a;
  }, _e;
}
var De, Fr;
function Sn() {
  if (Fr)
    return De;
  Fr = 1;
  var r = C;
  return De = r.isStandardBrowserEnv() ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function() {
      var t = /(msie|trident)/i.test(navigator.userAgent), n = document.createElement("a"), a;
      function o(u) {
        var i = u;
        return t && (n.setAttribute("href", i), i = n.href), n.setAttribute("href", i), {
          href: n.href,
          protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
          host: n.host,
          search: n.search ? n.search.replace(/^\?/, "") : "",
          hash: n.hash ? n.hash.replace(/^#/, "") : "",
          hostname: n.hostname,
          port: n.port,
          pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname
        };
      }
      return a = o(window.location.href), function(i) {
        var f = r.isString(i) ? o(i) : i;
        return f.protocol === a.protocol && f.host === a.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    function() {
      return function() {
        return !0;
      };
    }()
  ), De;
}
var Ue, _r;
function we() {
  if (_r)
    return Ue;
  _r = 1;
  function r(e) {
    this.message = e;
  }
  return r.prototype.toString = function() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  }, r.prototype.__CANCEL__ = !0, Ue = r, Ue;
}
var Be, Dr;
function Ur() {
  if (Dr)
    return Be;
  Dr = 1;
  var r = C, e = yn(), t = dn(), n = mt, a = mn(), o = gn(), u = Sn(), i = St(), f = Pe(), s = we();
  return Be = function(l) {
    return new Promise(function(h, d) {
      var g = l.data, A = l.headers, v = l.responseType, S;
      function R() {
        l.cancelToken && l.cancelToken.unsubscribe(S), l.signal && l.signal.removeEventListener("abort", S);
      }
      r.isFormData(g) && delete A["Content-Type"];
      var y = new XMLHttpRequest();
      if (l.auth) {
        var M = l.auth.username || "", G = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
        A.Authorization = "Basic " + btoa(M + ":" + G);
      }
      var _ = a(l.baseURL, l.url);
      y.open(l.method.toUpperCase(), n(_, l.params, l.paramsSerializer), !0), y.timeout = l.timeout;
      function j() {
        if (y) {
          var b = "getAllResponseHeaders" in y ? o(y.getAllResponseHeaders()) : null, x = !v || v === "text" || v === "json" ? y.responseText : y.response, T = {
            data: x,
            status: y.status,
            statusText: y.statusText,
            headers: b,
            config: l,
            request: y
          };
          e(function(I) {
            h(I), R();
          }, function(I) {
            d(I), R();
          }, T), y = null;
        }
      }
      if ("onloadend" in y ? y.onloadend = j : y.onreadystatechange = function() {
        !y || y.readyState !== 4 || y.status === 0 && !(y.responseURL && y.responseURL.indexOf("file:") === 0) || setTimeout(j);
      }, y.onabort = function() {
        y && (d(i("Request aborted", l, "ECONNABORTED", y)), y = null);
      }, y.onerror = function() {
        d(i("Network Error", l, null, y)), y = null;
      }, y.ontimeout = function() {
        var x = l.timeout ? "timeout of " + l.timeout + "ms exceeded" : "timeout exceeded", T = l.transitional || f.transitional;
        l.timeoutErrorMessage && (x = l.timeoutErrorMessage), d(i(
          x,
          l,
          T.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
          y
        )), y = null;
      }, r.isStandardBrowserEnv()) {
        var F = (l.withCredentials || u(_)) && l.xsrfCookieName ? t.read(l.xsrfCookieName) : void 0;
        F && (A[l.xsrfHeaderName] = F);
      }
      "setRequestHeader" in y && r.forEach(A, function(x, T) {
        typeof g > "u" && T.toLowerCase() === "content-type" ? delete A[T] : y.setRequestHeader(T, x);
      }), r.isUndefined(l.withCredentials) || (y.withCredentials = !!l.withCredentials), v && v !== "json" && (y.responseType = l.responseType), typeof l.onDownloadProgress == "function" && y.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && y.upload && y.upload.addEventListener("progress", l.onUploadProgress), (l.cancelToken || l.signal) && (S = function(b) {
        y && (d(!b || b && b.type ? new s("canceled") : b), y.abort(), y = null);
      }, l.cancelToken && l.cancelToken.subscribe(S), l.signal && (l.signal.aborted ? S() : l.signal.addEventListener("abort", S))), g || (g = null), y.send(g);
    });
  }, Be;
}
var Me, Br;
function Pe() {
  if (Br)
    return Me;
  Br = 1;
  var r = C, e = pn, t = gt, n = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function a(f, s) {
    !r.isUndefined(f) && r.isUndefined(f["Content-Type"]) && (f["Content-Type"] = s);
  }
  function o() {
    var f;
    return (typeof XMLHttpRequest < "u" || typeof process < "u" && Object.prototype.toString.call(process) === "[object process]") && (f = Ur()), f;
  }
  function u(f, s, c) {
    if (r.isString(f))
      try {
        return (s || JSON.parse)(f), r.trim(f);
      } catch (l) {
        if (l.name !== "SyntaxError")
          throw l;
      }
    return (c || JSON.stringify)(f);
  }
  var i = {
    transitional: {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1
    },
    adapter: o(),
    transformRequest: [function(s, c) {
      return e(c, "Accept"), e(c, "Content-Type"), r.isFormData(s) || r.isArrayBuffer(s) || r.isBuffer(s) || r.isStream(s) || r.isFile(s) || r.isBlob(s) ? s : r.isArrayBufferView(s) ? s.buffer : r.isURLSearchParams(s) ? (a(c, "application/x-www-form-urlencoded;charset=utf-8"), s.toString()) : r.isObject(s) || c && c["Content-Type"] === "application/json" ? (a(c, "application/json"), u(s)) : s;
    }],
    transformResponse: [function(s) {
      var c = this.transitional || i.transitional, l = c && c.silentJSONParsing, p = c && c.forcedJSONParsing, h = !l && this.responseType === "json";
      if (h || p && r.isString(s) && s.length)
        try {
          return JSON.parse(s);
        } catch (d) {
          if (h)
            throw d.name === "SyntaxError" ? t(d, this, "E_JSON_PARSE") : d;
        }
      return s;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function(s) {
      return s >= 200 && s < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*"
      }
    }
  };
  return r.forEach(["delete", "get", "head"], function(s) {
    i.headers[s] = {};
  }), r.forEach(["post", "put", "patch"], function(s) {
    i.headers[s] = r.merge(n);
  }), Me = i, Me;
}
var bn = C, On = Pe(), En = function(e, t, n) {
  var a = this || On;
  return bn.forEach(n, function(u) {
    e = u.call(a, e, t);
  }), e;
}, Le, Mr;
function bt() {
  return Mr || (Mr = 1, Le = function(e) {
    return !!(e && e.__CANCEL__);
  }), Le;
}
var Lr = C, qe = En, An = bt(), wn = Pe(), Pn = we();
function je(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new Pn("canceled");
}
var Rn = function(e) {
  je(e), e.headers = e.headers || {}, e.data = qe.call(
    e,
    e.data,
    e.headers,
    e.transformRequest
  ), e.headers = Lr.merge(
    e.headers.common || {},
    e.headers[e.method] || {},
    e.headers
  ), Lr.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function(a) {
      delete e.headers[a];
    }
  );
  var t = e.adapter || wn.adapter;
  return t(e).then(function(a) {
    return je(e), a.data = qe.call(
      e,
      a.data,
      a.headers,
      e.transformResponse
    ), a;
  }, function(a) {
    return An(a) || (je(e), a && a.response && (a.response.data = qe.call(
      e,
      a.response.data,
      a.response.headers,
      e.transformResponse
    ))), Promise.reject(a);
  });
}, $ = C, Ot = function(e, t) {
  t = t || {};
  var n = {};
  function a(c, l) {
    return $.isPlainObject(c) && $.isPlainObject(l) ? $.merge(c, l) : $.isPlainObject(l) ? $.merge({}, l) : $.isArray(l) ? l.slice() : l;
  }
  function o(c) {
    if ($.isUndefined(t[c])) {
      if (!$.isUndefined(e[c]))
        return a(void 0, e[c]);
    } else
      return a(e[c], t[c]);
  }
  function u(c) {
    if (!$.isUndefined(t[c]))
      return a(void 0, t[c]);
  }
  function i(c) {
    if ($.isUndefined(t[c])) {
      if (!$.isUndefined(e[c]))
        return a(void 0, e[c]);
    } else
      return a(void 0, t[c]);
  }
  function f(c) {
    if (c in t)
      return a(e[c], t[c]);
    if (c in e)
      return a(void 0, e[c]);
  }
  var s = {
    url: u,
    method: u,
    data: u,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: f
  };
  return $.forEach(Object.keys(e).concat(Object.keys(t)), function(l) {
    var p = s[l] || o, h = p(l);
    $.isUndefined(h) && p !== f || (n[l] = h);
  }), n;
}, We, qr;
function Et() {
  return qr || (qr = 1, We = {
    version: "0.24.0"
  }), We;
}
var xn = Et().version, dr = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(r, e) {
  dr[r] = function(n) {
    return typeof n === r || "a" + (e < 1 ? "n " : " ") + r;
  };
});
var jr = {};
dr.transitional = function(e, t, n) {
  function a(o, u) {
    return "[Axios v" + xn + "] Transitional option '" + o + "'" + u + (n ? ". " + n : "");
  }
  return function(o, u, i) {
    if (e === !1)
      throw new Error(a(u, " has been removed" + (t ? " in " + t : "")));
    return t && !jr[u] && (jr[u] = !0, console.warn(
      a(
        u,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(o, u, i) : !0;
  };
};
function Tn(r, e, t) {
  if (typeof r != "object")
    throw new TypeError("options must be an object");
  for (var n = Object.keys(r), a = n.length; a-- > 0; ) {
    var o = n[a], u = e[o];
    if (u) {
      var i = r[o], f = i === void 0 || u(i, o, r);
      if (f !== !0)
        throw new TypeError("option " + o + " must be " + f);
      continue;
    }
    if (t !== !0)
      throw Error("Unknown option " + o);
  }
}
var $n = {
  assertOptions: Tn,
  validators: dr
}, At = C, Cn = mt, Wr = ln, kr = Rn, Re = Ot, wt = $n, Y = wt.validators;
function ce(r) {
  this.defaults = r, this.interceptors = {
    request: new Wr(),
    response: new Wr()
  };
}
ce.prototype.request = function(e) {
  typeof e == "string" ? (e = arguments[1] || {}, e.url = arguments[0]) : e = e || {}, e = Re(this.defaults, e), e.method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";
  var t = e.transitional;
  t !== void 0 && wt.assertOptions(t, {
    silentJSONParsing: Y.transitional(Y.boolean),
    forcedJSONParsing: Y.transitional(Y.boolean),
    clarifyTimeoutError: Y.transitional(Y.boolean)
  }, !1);
  var n = [], a = !0;
  this.interceptors.request.forEach(function(p) {
    typeof p.runWhen == "function" && p.runWhen(e) === !1 || (a = a && p.synchronous, n.unshift(p.fulfilled, p.rejected));
  });
  var o = [];
  this.interceptors.response.forEach(function(p) {
    o.push(p.fulfilled, p.rejected);
  });
  var u;
  if (!a) {
    var i = [kr, void 0];
    for (Array.prototype.unshift.apply(i, n), i = i.concat(o), u = Promise.resolve(e); i.length; )
      u = u.then(i.shift(), i.shift());
    return u;
  }
  for (var f = e; n.length; ) {
    var s = n.shift(), c = n.shift();
    try {
      f = s(f);
    } catch (l) {
      c(l);
      break;
    }
  }
  try {
    u = kr(f);
  } catch (l) {
    return Promise.reject(l);
  }
  for (; o.length; )
    u = u.then(o.shift(), o.shift());
  return u;
};
ce.prototype.getUri = function(e) {
  return e = Re(this.defaults, e), Cn(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");
};
At.forEach(["delete", "get", "head", "options"], function(e) {
  ce.prototype[e] = function(t, n) {
    return this.request(Re(n || {}, {
      method: e,
      url: t,
      data: (n || {}).data
    }));
  };
});
At.forEach(["post", "put", "patch"], function(e) {
  ce.prototype[e] = function(t, n, a) {
    return this.request(Re(a || {}, {
      method: e,
      url: t,
      data: n
    }));
  };
});
var Nn = ce, ke, Hr;
function In() {
  if (Hr)
    return ke;
  Hr = 1;
  var r = we();
  function e(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    var n;
    this.promise = new Promise(function(u) {
      n = u;
    });
    var a = this;
    this.promise.then(function(o) {
      if (a._listeners) {
        var u, i = a._listeners.length;
        for (u = 0; u < i; u++)
          a._listeners[u](o);
        a._listeners = null;
      }
    }), this.promise.then = function(o) {
      var u, i = new Promise(function(f) {
        a.subscribe(f), u = f;
      }).then(o);
      return i.cancel = function() {
        a.unsubscribe(u);
      }, i;
    }, t(function(u) {
      a.reason || (a.reason = new r(u), n(a.reason));
    });
  }
  return e.prototype.throwIfRequested = function() {
    if (this.reason)
      throw this.reason;
  }, e.prototype.subscribe = function(n) {
    if (this.reason) {
      n(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(n) : this._listeners = [n];
  }, e.prototype.unsubscribe = function(n) {
    if (this._listeners) {
      var a = this._listeners.indexOf(n);
      a !== -1 && this._listeners.splice(a, 1);
    }
  }, e.source = function() {
    var n, a = new e(function(u) {
      n = u;
    });
    return {
      token: a,
      cancel: n
    };
  }, ke = e, ke;
}
var He, Gr;
function Fn() {
  return Gr || (Gr = 1, He = function(e) {
    return function(n) {
      return e.apply(null, n);
    };
  }), He;
}
var Ge, zr;
function _n() {
  return zr || (zr = 1, Ge = function(e) {
    return typeof e == "object" && e.isAxiosError === !0;
  }), Ge;
}
var Jr = C, Dn = dt, ge = Nn, Un = Ot, Bn = Pe();
function Pt(r) {
  var e = new ge(r), t = Dn(ge.prototype.request, e);
  return Jr.extend(t, ge.prototype, e), Jr.extend(t, e), t.create = function(a) {
    return Pt(Un(r, a));
  }, t;
}
var B = Pt(Bn);
B.Axios = ge;
B.Cancel = we();
B.CancelToken = In();
B.isCancel = bt();
B.VERSION = Et().version;
B.all = function(e) {
  return Promise.all(e);
};
B.spread = Fn();
B.isAxiosError = _n();
cr.exports = B;
cr.exports.default = B;
var Mn = cr.exports, Ln = Mn;
const qn = /* @__PURE__ */ Ht(Ln), jn = 6e4, Vr = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data"
}, ye = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
}, Yo = ({
  // 请求拦截器
  requestInterceptors: r,
  // 响应拦截器
  responseInterceptors: e,
  // Axios 静态全局配置
  ...t
}) => {
  const n = qn.create({
    timeout: jn,
    ...t
  });
  return r.length && n.interceptors.request.use(...r), e.length && n.interceptors.response.use(...e), async function({
    url: o,
    method: u,
    params: i,
    ...f
  }, s = !1) {
    const { headers: c = {}, ...l } = f || {};
    try {
      const { data: p } = await n({
        url: o,
        method: u,
        headers: {
          "Content-Type": s ? Vr.FORM_DATA : Vr.JSON,
          ...c
        },
        ...u === ye.POST || u === ye.PUT ? {
          data: s ? Object.keys(i).reduce(
            (h, d) => (h.append(d, i[d]), h),
            new FormData()
          ) : i
        } : {},
        ...u === ye.GET || u === ye.DELETE ? { params: i } : {},
        ...l
      });
      return p;
    } catch (p) {
      throw p;
    }
  };
};
var Wn = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, t = Symbol("test"), n = Object(t);
  if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
    return !1;
  var a = 42;
  e[t] = a;
  for (t in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var o = Object.getOwnPropertySymbols(e);
  if (o.length !== 1 || o[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var u = Object.getOwnPropertyDescriptor(e, t);
    if (u.value !== a || u.enumerable !== !0)
      return !1;
  }
  return !0;
}, Qr = typeof Symbol < "u" && Symbol, kn = Wn, Hn = function() {
  return typeof Qr != "function" || typeof Symbol != "function" || typeof Qr("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : kn();
}, Xr = {
  foo: {}
}, Gn = Object, zn = function() {
  return { __proto__: Xr }.foo === Xr.foo && !({ __proto__: null } instanceof Gn);
}, Jn = "Function.prototype.bind called on incompatible ", ze = Array.prototype.slice, Vn = Object.prototype.toString, Qn = "[object Function]", Xn = function(e) {
  var t = this;
  if (typeof t != "function" || Vn.call(t) !== Qn)
    throw new TypeError(Jn + t);
  for (var n = ze.call(arguments, 1), a, o = function() {
    if (this instanceof a) {
      var c = t.apply(
        this,
        n.concat(ze.call(arguments))
      );
      return Object(c) === c ? c : this;
    } else
      return t.apply(
        e,
        n.concat(ze.call(arguments))
      );
  }, u = Math.max(0, t.length - n.length), i = [], f = 0; f < u; f++)
    i.push("$" + f);
  if (a = Function("binder", "return function (" + i.join(",") + "){ return binder.apply(this,arguments); }")(o), t.prototype) {
    var s = function() {
    };
    s.prototype = t.prototype, a.prototype = new s(), s.prototype = null;
  }
  return a;
}, Yn = Xn, hr = Function.prototype.bind || Yn, Kn = hr, Zn = Kn.call(Function.call, Object.prototype.hasOwnProperty), m, re = SyntaxError, Rt = Function, ee = TypeError, Je = function(r) {
  try {
    return Rt('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, J = Object.getOwnPropertyDescriptor;
if (J)
  try {
    J({}, "");
  } catch {
    J = null;
  }
var Ve = function() {
  throw new ee();
}, ea = J ? function() {
  try {
    return arguments.callee, Ve;
  } catch {
    try {
      return J(arguments, "callee").get;
    } catch {
      return Ve;
    }
  }
}() : Ve, K = Hn(), ra = zn(), E = Object.getPrototypeOf || (ra ? function(r) {
  return r.__proto__;
} : null), Z = {}, ta = typeof Uint8Array > "u" || !E ? m : E(Uint8Array), V = {
  "%AggregateError%": typeof AggregateError > "u" ? m : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? m : ArrayBuffer,
  "%ArrayIteratorPrototype%": K && E ? E([][Symbol.iterator]()) : m,
  "%AsyncFromSyncIteratorPrototype%": m,
  "%AsyncFunction%": Z,
  "%AsyncGenerator%": Z,
  "%AsyncGeneratorFunction%": Z,
  "%AsyncIteratorPrototype%": Z,
  "%Atomics%": typeof Atomics > "u" ? m : Atomics,
  "%BigInt%": typeof BigInt > "u" ? m : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? m : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? m : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? m : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? m : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? m : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? m : FinalizationRegistry,
  "%Function%": Rt,
  "%GeneratorFunction%": Z,
  "%Int8Array%": typeof Int8Array > "u" ? m : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? m : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? m : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": K && E ? E(E([][Symbol.iterator]())) : m,
  "%JSON%": typeof JSON == "object" ? JSON : m,
  "%Map%": typeof Map > "u" ? m : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !K || !E ? m : E((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? m : Promise,
  "%Proxy%": typeof Proxy > "u" ? m : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? m : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? m : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !K || !E ? m : E((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? m : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": K && E ? E(""[Symbol.iterator]()) : m,
  "%Symbol%": K ? Symbol : m,
  "%SyntaxError%": re,
  "%ThrowTypeError%": ea,
  "%TypedArray%": ta,
  "%TypeError%": ee,
  "%Uint8Array%": typeof Uint8Array > "u" ? m : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? m : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? m : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? m : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? m : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? m : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? m : WeakSet
};
if (E)
  try {
    null.error;
  } catch (r) {
    var na = E(E(r));
    V["%Error.prototype%"] = na;
  }
var aa = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = Je("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = Je("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = Je("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = r("%AsyncGeneratorFunction%");
    n && (t = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var a = r("%AsyncGenerator%");
    a && E && (t = E(a.prototype));
  }
  return V[e] = t, t;
}, Yr = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, pe = hr, Se = Zn, oa = pe.call(Function.call, Array.prototype.concat), ia = pe.call(Function.apply, Array.prototype.splice), Kr = pe.call(Function.call, String.prototype.replace), be = pe.call(Function.call, String.prototype.slice), ua = pe.call(Function.call, RegExp.prototype.exec), sa = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, fa = /\\(\\)?/g, la = function(e) {
  var t = be(e, 0, 1), n = be(e, -1);
  if (t === "%" && n !== "%")
    throw new re("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new re("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return Kr(e, sa, function(o, u, i, f) {
    a[a.length] = i ? Kr(f, fa, "$1") : u || o;
  }), a;
}, ca = function(e, t) {
  var n = e, a;
  if (Se(Yr, n) && (a = Yr[n], n = "%" + a[0] + "%"), Se(V, n)) {
    var o = V[n];
    if (o === Z && (o = aa(n)), typeof o > "u" && !t)
      throw new ee("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new re("intrinsic " + e + " does not exist!");
}, vr = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new ee("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new ee('"allowMissing" argument must be a boolean');
  if (ua(/^%?[^%]*%?$/, e) === null)
    throw new re("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = la(e), a = n.length > 0 ? n[0] : "", o = ca("%" + a + "%", t), u = o.name, i = o.value, f = !1, s = o.alias;
  s && (a = s[0], ia(n, oa([0, 1], s)));
  for (var c = 1, l = !0; c < n.length; c += 1) {
    var p = n[c], h = be(p, 0, 1), d = be(p, -1);
    if ((h === '"' || h === "'" || h === "`" || d === '"' || d === "'" || d === "`") && h !== d)
      throw new re("property names with quotes must have matching quotes");
    if ((p === "constructor" || !l) && (f = !0), a += "." + p, u = "%" + a + "%", Se(V, u))
      i = V[u];
    else if (i != null) {
      if (!(p in i)) {
        if (!t)
          throw new ee("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (J && c + 1 >= n.length) {
        var g = J(i, p);
        l = !!g, l && "get" in g && !("originalValue" in g.get) ? i = g.get : i = i[p];
      } else
        l = Se(i, p), i = i[p];
      l && !f && (V[u] = i);
    }
  }
  return i;
}, xt = { exports: {} };
(function(r) {
  var e = hr, t = vr, n = t("%Function.prototype.apply%"), a = t("%Function.prototype.call%"), o = t("%Reflect.apply%", !0) || e.call(a, n), u = t("%Object.getOwnPropertyDescriptor%", !0), i = t("%Object.defineProperty%", !0), f = t("%Math.max%");
  if (i)
    try {
      i({}, "a", { value: 1 });
    } catch {
      i = null;
    }
  r.exports = function(l) {
    var p = o(e, a, arguments);
    if (u && i) {
      var h = u(p, "length");
      h.configurable && i(
        p,
        "length",
        { value: 1 + f(0, l.length - (arguments.length - 1)) }
      );
    }
    return p;
  };
  var s = function() {
    return o(e, n, arguments);
  };
  i ? i(r.exports, "apply", { value: s }) : r.exports.apply = s;
})(xt);
var pa = xt.exports, Tt = vr, $t = pa, ya = $t(Tt("String.prototype.indexOf")), da = function(e, t) {
  var n = Tt(e, !!t);
  return typeof n == "function" && ya(e, ".prototype.") > -1 ? $t(n) : n;
};
const ha = {}, va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ha
}, Symbol.toStringTag, { value: "Module" })), ma = /* @__PURE__ */ Gt(va);
var mr = typeof Map == "function" && Map.prototype, Qe = Object.getOwnPropertyDescriptor && mr ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Oe = mr && Qe && typeof Qe.get == "function" ? Qe.get : null, Zr = mr && Map.prototype.forEach, gr = typeof Set == "function" && Set.prototype, Xe = Object.getOwnPropertyDescriptor && gr ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Ee = gr && Xe && typeof Xe.get == "function" ? Xe.get : null, et = gr && Set.prototype.forEach, ga = typeof WeakMap == "function" && WeakMap.prototype, ue = ga ? WeakMap.prototype.has : null, Sa = typeof WeakSet == "function" && WeakSet.prototype, se = Sa ? WeakSet.prototype.has : null, ba = typeof WeakRef == "function" && WeakRef.prototype, rt = ba ? WeakRef.prototype.deref : null, Oa = Boolean.prototype.valueOf, Ea = Object.prototype.toString, Aa = Function.prototype.toString, wa = String.prototype.match, Sr = String.prototype.slice, k = String.prototype.replace, Pa = String.prototype.toUpperCase, tt = String.prototype.toLowerCase, Ct = RegExp.prototype.test, nt = Array.prototype.concat, U = Array.prototype.join, Ra = Array.prototype.slice, at = Math.floor, ar = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Ye = Object.getOwnPropertySymbols, or = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, te = typeof Symbol == "function" && typeof Symbol.iterator == "object", P = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === te || "symbol") ? Symbol.toStringTag : null, Nt = Object.prototype.propertyIsEnumerable, ot = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function it(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || Ct.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -at(-r) : at(r);
    if (n !== r) {
      var a = String(n), o = Sr.call(e, a.length + 1);
      return k.call(a, t, "$&_") + "." + k.call(k.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return k.call(e, t, "$&_");
}
var ir = ma, ut = ir.custom, st = Ft(ut) ? ut : null, xa = function r(e, t, n, a) {
  var o = t || {};
  if (W(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (W(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var u = W(o, "customInspect") ? o.customInspect : !0;
  if (typeof u != "boolean" && u !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (W(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (W(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var i = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Dt(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var f = String(e);
    return i ? it(e, f) : f;
  }
  if (typeof e == "bigint") {
    var s = String(e) + "n";
    return i ? it(e, s) : s;
  }
  var c = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof n > "u" && (n = 0), n >= c && c > 0 && typeof e == "object")
    return ur(e) ? "[Array]" : "[Object]";
  var l = Ga(o, n);
  if (typeof a > "u")
    a = [];
  else if (_t(a, e) >= 0)
    return "[Circular]";
  function p(N, I, L) {
    if (I && (a = Ra.call(a), a.push(I)), L) {
      var oe = {
        depth: o.depth
      };
      return W(o, "quoteStyle") && (oe.quoteStyle = o.quoteStyle), r(N, oe, n + 1, a);
    }
    return r(N, o, n + 1, a);
  }
  if (typeof e == "function" && !ft(e)) {
    var h = Ua(e), d = de(e, p);
    return "[Function" + (h ? ": " + h : " (anonymous)") + "]" + (d.length > 0 ? " { " + U.call(d, ", ") + " }" : "");
  }
  if (Ft(e)) {
    var g = te ? k.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : or.call(e);
    return typeof e == "object" && !te ? ie(g) : g;
  }
  if (Wa(e)) {
    for (var A = "<" + tt.call(String(e.nodeName)), v = e.attributes || [], S = 0; S < v.length; S++)
      A += " " + v[S].name + "=" + It(Ta(v[S].value), "double", o);
    return A += ">", e.childNodes && e.childNodes.length && (A += "..."), A += "</" + tt.call(String(e.nodeName)) + ">", A;
  }
  if (ur(e)) {
    if (e.length === 0)
      return "[]";
    var R = de(e, p);
    return l && !Ha(R) ? "[" + sr(R, l) + "]" : "[ " + U.call(R, ", ") + " ]";
  }
  if (Ca(e)) {
    var y = de(e, p);
    return !("cause" in Error.prototype) && "cause" in e && !Nt.call(e, "cause") ? "{ [" + String(e) + "] " + U.call(nt.call("[cause]: " + p(e.cause), y), ", ") + " }" : y.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + U.call(y, ", ") + " }";
  }
  if (typeof e == "object" && u) {
    if (st && typeof e[st] == "function" && ir)
      return ir(e, { depth: c - n });
    if (u !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Ba(e)) {
    var M = [];
    return Zr && Zr.call(e, function(N, I) {
      M.push(p(I, e, !0) + " => " + p(N, e));
    }), lt("Map", Oe.call(e), M, l);
  }
  if (qa(e)) {
    var G = [];
    return et && et.call(e, function(N) {
      G.push(p(N, e));
    }), lt("Set", Ee.call(e), G, l);
  }
  if (Ma(e))
    return Ke("WeakMap");
  if (ja(e))
    return Ke("WeakSet");
  if (La(e))
    return Ke("WeakRef");
  if (Ia(e))
    return ie(p(Number(e)));
  if (_a(e))
    return ie(p(ar.call(e)));
  if (Fa(e))
    return ie(Oa.call(e));
  if (Na(e))
    return ie(p(String(e)));
  if (!$a(e) && !ft(e)) {
    var _ = de(e, p), j = ot ? ot(e) === Object.prototype : e instanceof Object || e.constructor === Object, F = e instanceof Object ? "" : "null prototype", b = !j && P && Object(e) === e && P in e ? Sr.call(H(e), 8, -1) : F ? "Object" : "", x = j || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", T = x + (b || F ? "[" + U.call(nt.call([], b || [], F || []), ": ") + "] " : "");
    return _.length === 0 ? T + "{}" : l ? T + "{" + sr(_, l) + "}" : T + "{ " + U.call(_, ", ") + " }";
  }
  return String(e);
};
function It(r, e, t) {
  var n = (t.quoteStyle || e) === "double" ? '"' : "'";
  return n + r + n;
}
function Ta(r) {
  return k.call(String(r), /"/g, "&quot;");
}
function ur(r) {
  return H(r) === "[object Array]" && (!P || !(typeof r == "object" && P in r));
}
function $a(r) {
  return H(r) === "[object Date]" && (!P || !(typeof r == "object" && P in r));
}
function ft(r) {
  return H(r) === "[object RegExp]" && (!P || !(typeof r == "object" && P in r));
}
function Ca(r) {
  return H(r) === "[object Error]" && (!P || !(typeof r == "object" && P in r));
}
function Na(r) {
  return H(r) === "[object String]" && (!P || !(typeof r == "object" && P in r));
}
function Ia(r) {
  return H(r) === "[object Number]" && (!P || !(typeof r == "object" && P in r));
}
function Fa(r) {
  return H(r) === "[object Boolean]" && (!P || !(typeof r == "object" && P in r));
}
function Ft(r) {
  if (te)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !or)
    return !1;
  try {
    return or.call(r), !0;
  } catch {
  }
  return !1;
}
function _a(r) {
  if (!r || typeof r != "object" || !ar)
    return !1;
  try {
    return ar.call(r), !0;
  } catch {
  }
  return !1;
}
var Da = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function W(r, e) {
  return Da.call(r, e);
}
function H(r) {
  return Ea.call(r);
}
function Ua(r) {
  if (r.name)
    return r.name;
  var e = wa.call(Aa.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function _t(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, n = r.length; t < n; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function Ba(r) {
  if (!Oe || !r || typeof r != "object")
    return !1;
  try {
    Oe.call(r);
    try {
      Ee.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function Ma(r) {
  if (!ue || !r || typeof r != "object")
    return !1;
  try {
    ue.call(r, ue);
    try {
      se.call(r, se);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function La(r) {
  if (!rt || !r || typeof r != "object")
    return !1;
  try {
    return rt.call(r), !0;
  } catch {
  }
  return !1;
}
function qa(r) {
  if (!Ee || !r || typeof r != "object")
    return !1;
  try {
    Ee.call(r);
    try {
      Oe.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function ja(r) {
  if (!se || !r || typeof r != "object")
    return !1;
  try {
    se.call(r, se);
    try {
      ue.call(r, ue);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function Wa(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function Dt(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, n = "... " + t + " more character" + (t > 1 ? "s" : "");
    return Dt(Sr.call(r, 0, e.maxStringLength), e) + n;
  }
  var a = k.call(k.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, ka);
  return It(a, "single", e);
}
function ka(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + Pa.call(e.toString(16));
}
function ie(r) {
  return "Object(" + r + ")";
}
function Ke(r) {
  return r + " { ? }";
}
function lt(r, e, t, n) {
  var a = n ? sr(t, n) : U.call(t, ", ");
  return r + " (" + e + ") {" + a + "}";
}
function Ha(r) {
  for (var e = 0; e < r.length; e++)
    if (_t(r[e], `
`) >= 0)
      return !1;
  return !0;
}
function Ga(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = U.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: U.call(Array(e + 1), t)
  };
}
function sr(r, e) {
  if (r.length === 0)
    return "";
  var t = `
` + e.prev + e.base;
  return t + U.call(r, "," + t) + `
` + e.prev;
}
function de(r, e) {
  var t = ur(r), n = [];
  if (t) {
    n.length = r.length;
    for (var a = 0; a < r.length; a++)
      n[a] = W(r, a) ? e(r[a], r) : "";
  }
  var o = typeof Ye == "function" ? Ye(r) : [], u;
  if (te) {
    u = {};
    for (var i = 0; i < o.length; i++)
      u["$" + o[i]] = o[i];
  }
  for (var f in r)
    W(r, f) && (t && String(Number(f)) === f && f < r.length || te && u["$" + f] instanceof Symbol || (Ct.call(/[^\w$]/, f) ? n.push(e(f, r) + ": " + e(r[f], r)) : n.push(f + ": " + e(r[f], r))));
  if (typeof Ye == "function")
    for (var s = 0; s < o.length; s++)
      Nt.call(r, o[s]) && n.push("[" + e(o[s]) + "]: " + e(r[o[s]], r));
  return n;
}
var br = vr, ae = da, za = xa, Ja = br("%TypeError%"), he = br("%WeakMap%", !0), ve = br("%Map%", !0), Va = ae("WeakMap.prototype.get", !0), Qa = ae("WeakMap.prototype.set", !0), Xa = ae("WeakMap.prototype.has", !0), Ya = ae("Map.prototype.get", !0), Ka = ae("Map.prototype.set", !0), Za = ae("Map.prototype.has", !0), Or = function(r, e) {
  for (var t = r, n; (n = t.next) !== null; t = n)
    if (n.key === e)
      return t.next = n.next, n.next = r.next, r.next = n, n;
}, eo = function(r, e) {
  var t = Or(r, e);
  return t && t.value;
}, ro = function(r, e, t) {
  var n = Or(r, e);
  n ? n.value = t : r.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: r.next,
    value: t
  };
}, to = function(r, e) {
  return !!Or(r, e);
}, no = function() {
  var e, t, n, a = {
    assert: function(o) {
      if (!a.has(o))
        throw new Ja("Side channel does not contain " + za(o));
    },
    get: function(o) {
      if (he && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Va(e, o);
      } else if (ve) {
        if (t)
          return Ya(t, o);
      } else if (n)
        return eo(n, o);
    },
    has: function(o) {
      if (he && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Xa(e, o);
      } else if (ve) {
        if (t)
          return Za(t, o);
      } else if (n)
        return to(n, o);
      return !1;
    },
    set: function(o, u) {
      he && o && (typeof o == "object" || typeof o == "function") ? (e || (e = new he()), Qa(e, o, u)) : ve ? (t || (t = new ve()), Ka(t, o, u)) : (n || (n = { key: {}, next: null }), ro(n, o, u));
    }
  };
  return a;
}, ao = String.prototype.replace, oo = /%20/g, Ze = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, Er = {
  default: Ze.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return ao.call(r, oo, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: Ze.RFC1738,
  RFC3986: Ze.RFC3986
}, io = Er, er = Object.prototype.hasOwnProperty, z = Array.isArray, D = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), uo = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), n = t.obj[t.prop];
    if (z(n)) {
      for (var a = [], o = 0; o < n.length; ++o)
        typeof n[o] < "u" && a.push(n[o]);
      t.obj[t.prop] = a;
    }
  }
}, Ut = function(e, t) {
  for (var n = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = 0; a < e.length; ++a)
    typeof e[a] < "u" && (n[a] = e[a]);
  return n;
}, so = function r(e, t, n) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (z(e))
      e.push(t);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !er.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var a = e;
  return z(e) && !z(t) && (a = Ut(e, n)), z(e) && z(t) ? (t.forEach(function(o, u) {
    if (er.call(e, u)) {
      var i = e[u];
      i && typeof i == "object" && o && typeof o == "object" ? e[u] = r(i, o, n) : e.push(o);
    } else
      e[u] = o;
  }), e) : Object.keys(t).reduce(function(o, u) {
    var i = t[u];
    return er.call(o, u) ? o[u] = r(o[u], i, n) : o[u] = i, o;
  }, a);
}, fo = function(e, t) {
  return Object.keys(t).reduce(function(n, a) {
    return n[a] = t[a], n;
  }, e);
}, lo = function(r, e, t) {
  var n = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, co = function(e, t, n, a, o) {
  if (e.length === 0)
    return e;
  var u = e;
  if (typeof e == "symbol" ? u = Symbol.prototype.toString.call(e) : typeof e != "string" && (u = String(e)), n === "iso-8859-1")
    return escape(u).replace(/%u[0-9a-f]{4}/gi, function(c) {
      return "%26%23" + parseInt(c.slice(2), 16) + "%3B";
    });
  for (var i = "", f = 0; f < u.length; ++f) {
    var s = u.charCodeAt(f);
    if (s === 45 || s === 46 || s === 95 || s === 126 || s >= 48 && s <= 57 || s >= 65 && s <= 90 || s >= 97 && s <= 122 || o === io.RFC1738 && (s === 40 || s === 41)) {
      i += u.charAt(f);
      continue;
    }
    if (s < 128) {
      i = i + D[s];
      continue;
    }
    if (s < 2048) {
      i = i + (D[192 | s >> 6] + D[128 | s & 63]);
      continue;
    }
    if (s < 55296 || s >= 57344) {
      i = i + (D[224 | s >> 12] + D[128 | s >> 6 & 63] + D[128 | s & 63]);
      continue;
    }
    f += 1, s = 65536 + ((s & 1023) << 10 | u.charCodeAt(f) & 1023), i += D[240 | s >> 18] + D[128 | s >> 12 & 63] + D[128 | s >> 6 & 63] + D[128 | s & 63];
  }
  return i;
}, po = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], n = [], a = 0; a < t.length; ++a)
    for (var o = t[a], u = o.obj[o.prop], i = Object.keys(u), f = 0; f < i.length; ++f) {
      var s = i[f], c = u[s];
      typeof c == "object" && c !== null && n.indexOf(c) === -1 && (t.push({ obj: u, prop: s }), n.push(c));
    }
  return uo(t), e;
}, yo = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, ho = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, vo = function(e, t) {
  return [].concat(e, t);
}, mo = function(e, t) {
  if (z(e)) {
    for (var n = [], a = 0; a < e.length; a += 1)
      n.push(t(e[a]));
    return n;
  }
  return t(e);
}, Bt = {
  arrayToObject: Ut,
  assign: fo,
  combine: vo,
  compact: po,
  decode: lo,
  encode: co,
  isBuffer: ho,
  isRegExp: yo,
  maybeMap: mo,
  merge: so
}, Mt = no, fr = Bt, fe = Er, go = Object.prototype.hasOwnProperty, ct = {
  brackets: function(e) {
    return e + "[]";
  },
  comma: "comma",
  indices: function(e, t) {
    return e + "[" + t + "]";
  },
  repeat: function(e) {
    return e;
  }
}, q = Array.isArray, So = String.prototype.split, bo = Array.prototype.push, Lt = function(r, e) {
  bo.apply(r, q(e) ? e : [e]);
}, Oo = Date.prototype.toISOString, pt = fe.default, w = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: fr.encode,
  encodeValuesOnly: !1,
  format: pt,
  formatter: fe.formatters[pt],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return Oo.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Eo = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, rr = {}, Ao = function r(e, t, n, a, o, u, i, f, s, c, l, p, h, d, g, A) {
  for (var v = e, S = A, R = 0, y = !1; (S = S.get(rr)) !== void 0 && !y; ) {
    var M = S.get(e);
    if (R += 1, typeof M < "u") {
      if (M === R)
        throw new RangeError("Cyclic object value");
      y = !0;
    }
    typeof S.get(rr) > "u" && (R = 0);
  }
  if (typeof f == "function" ? v = f(t, v) : v instanceof Date ? v = l(v) : n === "comma" && q(v) && (v = fr.maybeMap(v, function(xe) {
    return xe instanceof Date ? l(xe) : xe;
  })), v === null) {
    if (o)
      return i && !d ? i(t, w.encoder, g, "key", p) : t;
    v = "";
  }
  if (Eo(v) || fr.isBuffer(v)) {
    if (i) {
      var G = d ? t : i(t, w.encoder, g, "key", p);
      if (n === "comma" && d) {
        for (var _ = So.call(String(v), ","), j = "", F = 0; F < _.length; ++F)
          j += (F === 0 ? "" : ",") + h(i(_[F], w.encoder, g, "value", p));
        return [h(G) + (a && q(v) && _.length === 1 ? "[]" : "") + "=" + j];
      }
      return [h(G) + "=" + h(i(v, w.encoder, g, "value", p))];
    }
    return [h(t) + "=" + h(String(v))];
  }
  var b = [];
  if (typeof v > "u")
    return b;
  var x;
  if (n === "comma" && q(v))
    x = [{ value: v.length > 0 ? v.join(",") || null : void 0 }];
  else if (q(f))
    x = f;
  else {
    var T = Object.keys(v);
    x = s ? T.sort(s) : T;
  }
  for (var N = a && q(v) && v.length === 1 ? t + "[]" : t, I = 0; I < x.length; ++I) {
    var L = x[I], oe = typeof L == "object" && typeof L.value < "u" ? L.value : v[L];
    if (!(u && oe === null)) {
      var kt = q(v) ? typeof n == "function" ? n(N, L) : N : N + (c ? "." + L : "[" + L + "]");
      A.set(e, R);
      var wr = Mt();
      wr.set(rr, A), Lt(b, r(
        oe,
        kt,
        n,
        a,
        o,
        u,
        i,
        f,
        s,
        c,
        l,
        p,
        h,
        d,
        g,
        wr
      ));
    }
  }
  return b;
}, wo = function(e) {
  if (!e)
    return w;
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || w.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = fe.default;
  if (typeof e.format < "u") {
    if (!go.call(fe.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var a = fe.formatters[n], o = w.filter;
  return (typeof e.filter == "function" || q(e.filter)) && (o = e.filter), {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : w.addQueryPrefix,
    allowDots: typeof e.allowDots > "u" ? w.allowDots : !!e.allowDots,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : w.charsetSentinel,
    delimiter: typeof e.delimiter > "u" ? w.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : w.encode,
    encoder: typeof e.encoder == "function" ? e.encoder : w.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : w.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: a,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : w.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : w.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : w.strictNullHandling
  };
}, Po = function(r, e) {
  var t = r, n = wo(e), a, o;
  typeof n.filter == "function" ? (o = n.filter, t = o("", t)) : q(n.filter) && (o = n.filter, a = o);
  var u = [];
  if (typeof t != "object" || t === null)
    return "";
  var i;
  e && e.arrayFormat in ct ? i = e.arrayFormat : e && "indices" in e ? i = e.indices ? "indices" : "repeat" : i = "indices";
  var f = ct[i];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var s = f === "comma" && e && e.commaRoundTrip;
  a || (a = Object.keys(t)), n.sort && a.sort(n.sort);
  for (var c = Mt(), l = 0; l < a.length; ++l) {
    var p = a[l];
    n.skipNulls && t[p] === null || Lt(u, Ao(
      t[p],
      p,
      f,
      s,
      n.strictNullHandling,
      n.skipNulls,
      n.encode ? n.encoder : null,
      n.filter,
      n.sort,
      n.allowDots,
      n.serializeDate,
      n.format,
      n.formatter,
      n.encodeValuesOnly,
      n.charset,
      c
    ));
  }
  var h = u.join(n.delimiter), d = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? d += "utf8=%26%2310003%3B&" : d += "utf8=%E2%9C%93&"), h.length > 0 ? d + h : "";
}, ne = Bt, lr = Object.prototype.hasOwnProperty, Ro = Array.isArray, O = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: ne.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, xo = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, qt = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, To = "utf8=%26%2310003%3B", $o = "utf8=%E2%9C%93", Co = function(e, t) {
  var n = {}, a = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, o = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, u = a.split(t.delimiter, o), i = -1, f, s = t.charset;
  if (t.charsetSentinel)
    for (f = 0; f < u.length; ++f)
      u[f].indexOf("utf8=") === 0 && (u[f] === $o ? s = "utf-8" : u[f] === To && (s = "iso-8859-1"), i = f, f = u.length);
  for (f = 0; f < u.length; ++f)
    if (f !== i) {
      var c = u[f], l = c.indexOf("]="), p = l === -1 ? c.indexOf("=") : l + 1, h, d;
      p === -1 ? (h = t.decoder(c, O.decoder, s, "key"), d = t.strictNullHandling ? null : "") : (h = t.decoder(c.slice(0, p), O.decoder, s, "key"), d = ne.maybeMap(
        qt(c.slice(p + 1), t),
        function(g) {
          return t.decoder(g, O.decoder, s, "value");
        }
      )), d && t.interpretNumericEntities && s === "iso-8859-1" && (d = xo(d)), c.indexOf("[]=") > -1 && (d = Ro(d) ? [d] : d), lr.call(n, h) ? n[h] = ne.combine(n[h], d) : n[h] = d;
    }
  return n;
}, No = function(r, e, t, n) {
  for (var a = n ? e : qt(e, t), o = r.length - 1; o >= 0; --o) {
    var u, i = r[o];
    if (i === "[]" && t.parseArrays)
      u = [].concat(a);
    else {
      u = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var f = i.charAt(0) === "[" && i.charAt(i.length - 1) === "]" ? i.slice(1, -1) : i, s = parseInt(f, 10);
      !t.parseArrays && f === "" ? u = { 0: a } : !isNaN(s) && i !== f && String(s) === f && s >= 0 && t.parseArrays && s <= t.arrayLimit ? (u = [], u[s] = a) : f !== "__proto__" && (u[f] = a);
    }
    a = u;
  }
  return a;
}, Io = function(e, t, n, a) {
  if (e) {
    var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, u = /(\[[^[\]]*])/, i = /(\[[^[\]]*])/g, f = n.depth > 0 && u.exec(o), s = f ? o.slice(0, f.index) : o, c = [];
    if (s) {
      if (!n.plainObjects && lr.call(Object.prototype, s) && !n.allowPrototypes)
        return;
      c.push(s);
    }
    for (var l = 0; n.depth > 0 && (f = i.exec(o)) !== null && l < n.depth; ) {
      if (l += 1, !n.plainObjects && lr.call(Object.prototype, f[1].slice(1, -1)) && !n.allowPrototypes)
        return;
      c.push(f[1]);
    }
    return f && c.push("[" + o.slice(f.index) + "]"), No(c, t, n, a);
  }
}, Fo = function(e) {
  if (!e)
    return O;
  if (e.decoder !== null && e.decoder !== void 0 && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = typeof e.charset > "u" ? O.charset : e.charset;
  return {
    allowDots: typeof e.allowDots > "u" ? O.allowDots : !!e.allowDots,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : O.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : O.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : O.arrayLimit,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : O.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : O.comma,
    decoder: typeof e.decoder == "function" ? e.decoder : O.decoder,
    delimiter: typeof e.delimiter == "string" || ne.isRegExp(e.delimiter) ? e.delimiter : O.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : O.depth,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : O.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : O.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : O.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : O.strictNullHandling
  };
}, _o = function(r, e) {
  var t = Fo(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof r == "string" ? Co(r, t) : r, a = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(n), u = 0; u < o.length; ++u) {
    var i = o[u], f = Io(i, n[i], t, typeof r == "string");
    a = ne.merge(a, f, t);
  }
  return t.allowSparse === !0 ? a : ne.compact(a);
}, Do = Po, Uo = _o, Bo = Er, Mo = {
  formats: Bo,
  parse: Uo,
  stringify: Do
};
const Ar = (r) => Object.prototype.toString.call(r) === "[object Array]";
function yt(r) {
  return r == null ? !0 : typeof r == "boolean" ? !1 : typeof r == "number" ? isNaN(r) || r === 0 : typeof r == "string" ? r.trim().length === 0 : Ar(r) ? r.length === 0 : jt(r) ? Object.keys(r).length === 0 : r instanceof Map || r instanceof Set ? r.size === 0 : !1;
}
const jt = (r) => r !== null && (typeof r == "object" || typeof r == "function") && !Ar(r) && !(r instanceof Date) && !(r instanceof Map), Wt = (r, e) => {
  const t = { ...r };
  return e.forEach((n) => {
    delete t[n];
  }), t;
}, Lo = (r, e) => r.replace(/{([^{]*)}/g, (t, n) => e[n]), qo = /\s{1,}/, jo = "*", Wo = /\s\[d|(data)]\s?/, ko = /\s(d|(data))\.(f|formData):/, Ho = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/, Go = /\s+path:(\S*)(\s|$)/, zo = /\s+(q|query):(\S*)(\s|$)/, le = (r, e) => !r || !(e != null && e.length) ? {} : e.reduce(
  (t, n) => ({ ...t, [n]: r[n] }),
  {}
), Jo = (r) => {
  const [e] = r.split("?");
  return e;
}, Vo = (r, e, t, n) => [
  r,
  le(e, t),
  le(e, n)
], Qo = (r, e, t, n, a, o) => {
  const u = Wt(r, [
    ...o || [],
    ...a || []
  ]);
  return [
    // data
    e || t ? u : le(
      u,
      (n == null ? void 0 : n.split(",")) || []
    ),
    // path
    le(r, a),
    // queries
    le(r, o)
  ];
}, Xo = (r, e) => {
  const [t, n] = e.split(qo), a = Wo.test(e), [, o] = e.match(Go) || [], [, , u] = e.match(zo) || [], [, , , , i] = e.match(Ho) || [], f = !!o, s = (o == null ? void 0 : o.split(",")) || [], c = (u == null ? void 0 : u.split(",")) || [], l = a ? !1 : ko.test(e), p = i === jo;
  return (...h) => {
    const [d, g = {}, A = {}] = h, [v, S, R] = a ? Vo(
      d,
      g,
      s,
      c
    ) : Qo(
      d,
      p,
      l,
      i,
      s,
      c
    ), y = f ? Lo(n, S) : n, M = yt(R) ? "" : `?${Mo.stringify(R)}`;
    return r(
      {
        url: `${Jo(y)}${M}`,
        method: t.toLocaleUpperCase(),
        ...jt(v) && !Ar(v) && yt(v) ? {} : { params: v },
        ...Wt(A, ["url", "data", "method", "params"])
      },
      l
    );
  };
}, Ko = (r, e) => Object.keys(e).reduce(
  (t, n) => ({
    ...t,
    [n]: Xo(r, e[n])
  }),
  {}
);
export {
  Ko as G,
  Yo as requestCreator
};
