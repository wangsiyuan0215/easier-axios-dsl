import { stringify as M } from "qs";
import U from "axios";
const b = 3e3, S = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data"
}, O = {
  JSON: "json",
  TEXT: "text",
  BLOB: "blob",
  ARRAY_BUFFER: "arraybuffer",
  STREAM: "stream",
  DOCUMENT: "document"
}, a = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD"
}, C = ({
  // 请求拦截器
  requestInterceptors: t,
  // 响应拦截器
  responseInterceptors: e,
  // Axios 静态全局配置
  ...r
}) => {
  const n = U.create({
    timeout: b,
    ...r
  });
  return t.length && n.interceptors.request.use(...t), e.length && n.interceptors.response.use(...e), async function({
    url: o,
    method: s,
    data: E,
    params: i,
    returnResponse: P,
    __isFormData: u,
    ...d
  }) {
    const {
      headers: A = {},
      responseType: _,
      ...h
    } = d || {};
    try {
      const T = await n({
        url: o,
        method: s,
        headers: {
          ...A,
          "Content-Type": u ? S.FORM_DATA : A && A["Content-Type"] || S.JSON
        },
        ...[a.POST, a.PUT, a.PATCH].includes(
          s
        ) ? {
          data: u ? Object.keys(i).reduce(
            (p, f) => (p.append(f, i[f]), p),
            new FormData()
          ) : i
        } : {},
        ...[
          a.GET,
          a.DELETE,
          a.OPTIONS,
          a.HEAD
        ].includes(s) ? { params: i } : {},
        ...h
      });
      return [
        O.BLOB,
        O.STREAM,
        O.DOCUMENT,
        O.ARRAY_BUFFER
      ].includes(_) || P ? T : T.data;
    } catch (T) {
      throw T;
    }
  };
}, D = (t) => Object.prototype.toString.call(t) === "[object Array]";
function l(t) {
  return t == null ? !0 : typeof t == "boolean" ? !1 : typeof t == "number" ? isNaN(t) || t === 0 : typeof t == "string" ? t.trim().length === 0 : D(t) ? t.length === 0 : g(t) ? Object.keys(t).length === 0 : t instanceof Map || t instanceof Set ? t.size === 0 : !1;
}
const g = (t) => t !== null && (typeof t == "object" || typeof t == "function") && !D(t) && !(t instanceof Date) && !(t instanceof Map), m = (t, e) => {
  const r = { ...t };
  return e.forEach((n) => {
    delete r[n];
  }), r;
}, F = (t, e) => t.replace(/{([^{]*)}/g, (r, n) => e[n]), H = (t) => {
  const [e] = t.split("?");
  return e;
}, R = (t, e) => !t || !(e != null && e.length) ? {} : e.reduce(
  (r, n) => ({ ...r, [n]: t[n] }),
  {}
), y = (t, e, r, n) => [
  t,
  R(e, r),
  R(e, n)
], j = (t, e, r, n, c, o) => {
  const s = m(t, [
    ...o || [],
    ...c || []
  ]);
  return [
    // data
    e || r ? s : R(
      s,
      n || []
    ),
    // path
    R(t, c),
    // queries
    R(t, o)
  ];
}, x = /\s{1,}/, B = "*", L = /\s\[d|(data)]\s?/, Y = /\s(d|(data))\.(f|formData):/, G = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/, Q = /\s+path:(\S*)(\s|$)/, $ = /\s+(q|query):(\S*)(\s|$)/, w = (t) => {
  const [e, r] = t.split(x);
  return { method: e, url: r };
}, J = (t) => {
  const [, e] = t.match(Q) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, q = (t) => {
  const [, , e] = t.match($) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, z = (t) => {
  const [, , , , e] = t.match(G) || [];
  return (e == null ? void 0 : e.split(",")) || [];
}, W = (t) => L.test(t), X = (t) => Y.test(t), V = (t) => !!(t != null && t.length) && t[0] === B, Z = (t, e) => {
  const r = J(e), n = q(e), c = z(e), o = !!r.length, s = W(e), E = s ? !1 : X(e), i = V(c);
  return (...P) => {
    const [u, d = {}, A = {}] = P, [_, h, T] = s ? y(
      u,
      d,
      r,
      n
    ) : j(
      u,
      i,
      E,
      c,
      r,
      n
    ), { method: p, url: f } = w(e), I = o ? F(f, h) : f, N = l(T) ? "" : `?${M(T)}`;
    return t({
      url: `${H(I)}${N}`,
      method: p.toLocaleUpperCase(),
      ...g(_) && !D(_) && l(_) ? {} : { params: _ },
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
    generatorAPIS: (n) => Object.keys(n).reduce(
      (c, o) => ({
        ...c,
        [o]: Z(e, n[o])
      }),
      {}
    ),
    requestInstance: e
  };
};
export {
  v as init
};
