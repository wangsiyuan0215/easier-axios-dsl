import { stringify as N } from "qs";
import M from "axios";
const c = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD"
}, U = 3e3, D = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data"
}, O = {
  JSON: "json",
  TEXT: "text",
  BLOB: "blob",
  ARRAY_BUFFER: "arraybuffer",
  STREAM: "stream",
  DOCUMENT: "document"
}, C = ({
  // 请求拦截器
  requestInterceptors: t,
  // 响应拦截器
  responseInterceptors: e,
  // Axios 静态全局配置
  ...n
}) => {
  const r = M.create({
    timeout: U,
    ...n
  });
  return t.length && r.interceptors.request.use(...t), e.length && r.interceptors.response.use(...e), async function({
    url: o,
    method: s,
    data: E,
    params: T,
    returnResponse: l,
    __isFormData: u,
    ...d
  }) {
    const {
      headers: A = {},
      responseType: _,
      ...h
    } = d || {};
    try {
      const i = await r({
        url: o,
        method: s,
        headers: {
          ...A,
          "Content-Type": u ? D.FORM_DATA : A && A["Content-Type"] || D.JSON
        },
        ...[c.POST, c.PUT, c.PATCH].includes(
          s
        ) ? {
          data: u ? Object.keys(T).reduce(
            (R, f) => (R.append(f, T[f]), R),
            new FormData()
          ) : T
        } : {},
        ...[
          c.GET,
          c.DELETE,
          c.OPTIONS,
          c.HEAD
        ].includes(s) ? { params: T } : {},
        ...h
      });
      return [
        O.BLOB,
        O.STREAM,
        O.DOCUMENT,
        O.ARRAY_BUFFER
      ].includes(_) || l ? i : i.data;
    } catch (i) {
      throw i;
    }
  };
}, P = (t) => Object.prototype.toString.call(t) === "[object Array]";
function I(t) {
  return t == null ? !0 : typeof t == "boolean" ? !1 : typeof t == "number" ? isNaN(t) || t === 0 : typeof t == "string" ? t.trim().length === 0 : P(t) ? t.length === 0 : S(t) ? Object.keys(t).length === 0 : t instanceof Map || t instanceof Set ? t.size === 0 : !1;
}
const S = (t) => t !== null && (typeof t == "object" || typeof t == "function") && !P(t) && !(t instanceof Date) && !(t instanceof Map), m = (t, e) => {
  const n = { ...t };
  return e.forEach((r) => {
    delete n[r];
  }), n;
}, F = (t, e) => t.replace(/{([^{]*)}/g, (n, r) => e[r]), j = (t) => {
  const [e] = t.split("?");
  return e;
}, p = (t, e) => !t || !(e != null && e.length) ? {} : e.reduce(
  (n, r) => ({ ...n, [r]: t[r] }),
  {}
), H = (t, e, n, r) => [
  t,
  p(e, n),
  p(e, r)
], $ = (t, e, n, r, a, o) => {
  const s = m(t, [
    ...o || [],
    ...a || []
  ]);
  return [
    // data
    e || n ? s : p(
      s,
      r || []
    ),
    // path
    p(t, a),
    // queries
    p(t, o)
  ];
}, w = /\s{1,}/, y = "*", x = /\s\[d|(data)]\s?/, B = /\s(d|(data))\.(f|formData):/, L = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/, Y = /\s+path:(\S*)(\s|$)/, G = /\s+(q|query):(\S*)(\s|$)/, Q = (t) => {
  const [e, n] = t.split(w);
  if (!e || !c[e == null ? void 0 : e.toUpperCase()])
    throw new Error(`[${t}]: Invalid method: ${e}, please use one of the following methods: ${Object.values(c).join(", ")}`);
  const r = /^\/?(\{[a-zA-Z_][\w]*\}|[a-zA-Z0-9_\-\.]+)(\/(\{[a-zA-Z_][\w]*\}|[a-zA-Z0-9_\-\.]+))*([?][^ ]*)?$/;
  if (!n || /^\s*$/.test(n) || !r.test(n == null ? void 0 : n.trim()))
    throw new Error(
      `[${t}]: Invalid url: ${n}, please input a valid url, e.g. /a/b/c, /a/b/{c}, {a}/b/c, a/b/c, a/{b}/c`
    );
  return { method: e, url: n };
}, z = (t) => {
  const [, e] = t.match(Y) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, Z = (t) => {
  const [, , e] = t.match(G) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, J = (t) => {
  const [, , , , e] = t.match(L) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, W = (t) => x.test(t), X = (t) => B.test(t), q = (t) => !!(t != null && t.length) && t[0] === y, V = (t, e) => {
  const n = z(e), r = Z(e), a = J(e), o = !!n.length, s = W(e), E = s ? !1 : X(e), T = q(a);
  return (...l) => {
    const [u, d = {}, A = {}] = l, [_, h, i] = s ? H(
      u,
      d,
      n,
      r
    ) : $(
      u,
      T,
      E,
      a,
      n,
      r
    ), { method: R, url: f } = Q(e), g = o ? F(f, h) : f, b = I(i) ? "" : `?${N(i)}`;
    return t({
      url: `${j(g)}${b}`,
      method: R.toLocaleUpperCase(),
      ...S(_) && !P(_) && I(_) ? {} : { params: _ },
      ...m(A, [
        "url",
        "data",
        "method",
        "params",
        "returnResponse"
      ]),
      ...E ? { __isFormData: E } : {},
      ...A.returnResponse ? { returnResponse: !0 } : {}
    });
  };
}, v = (t) => {
  const e = C(t);
  return {
    generatorAPIS: (r) => Object.keys(r).reduce(
      (a, o) => ({
        ...a,
        [o]: V(e, r[o])
      }),
      {}
    ),
    requestInstance: e
  };
};
export {
  v as init
};
