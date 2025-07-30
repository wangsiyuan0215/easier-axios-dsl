import C from "axios";
import { stringify as I } from "qs";
const S = 6e4, l = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data"
}, h = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
}, B = ({
  // 请求拦截器
  requestInterceptors: t,
  // 响应拦截器
  responseInterceptors: n,
  // Axios 静态全局配置
  ...r
}) => {
  const o = C.create({
    timeout: S,
    ...r
  });
  return t.length && o.interceptors.request.use(...t), n.length && o.interceptors.response.use(...n), async function({
    url: e,
    method: s,
    params: c,
    ..._
  }, f = !1) {
    const { headers: i = {}, ...u } = _ || {};
    try {
      const { data: T } = await o({
        url: e,
        method: s,
        headers: {
          ...i,
          "Content-Type": f ? l.FORM_DATA : i && i["Content-Type"] || l.JSON
        },
        ...s === h.POST || s === h.PUT ? {
          data: f ? Object.keys(c).reduce(
            (E, A) => (E.append(A, c[A]), E),
            new FormData()
          ) : c
        } : {},
        ...s === h.GET || s === h.DELETE ? { params: c } : {},
        ...u
      });
      return T;
    } catch (T) {
      throw T;
    }
  };
}, D = (t) => Object.prototype.toString.call(t) === "[object Array]";
function m(t) {
  return t == null ? !0 : typeof t == "boolean" ? !1 : typeof t == "number" ? isNaN(t) || t === 0 : typeof t == "string" ? t.trim().length === 0 : D(t) ? t.length === 0 : P(t) ? Object.keys(t).length === 0 : t instanceof Map || t instanceof Set ? t.size === 0 : !1;
}
const P = (t) => t !== null && (typeof t == "object" || typeof t == "function") && !D(t) && !(t instanceof Date) && !(t instanceof Map), R = (t, n) => {
  const r = { ...t };
  return n.forEach((o) => {
    delete r[o];
  }), r;
}, y = (t, n) => t.replace(/{([^{]*)}/g, (r, o) => n[o]), F = /\s{1,}/, G = "*", $ = /\s\[d|(data)]\s?/, g = /\s(d|(data))\.(f|formData):/, w = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/, H = /\s+path:(\S*)(\s|$)/, L = /\s+(q|query):(\S*)(\s|$)/, p = (t, n) => !t || !(n != null && n.length) ? {} : n.reduce(
  (r, o) => ({ ...r, [o]: t[o] }),
  {}
), Q = (t) => {
  const [n] = t.split("?");
  return n;
}, x = (t, n, r, o) => [
  t,
  p(n, r),
  p(n, o)
], Y = (t, n, r, o, a, e) => {
  const s = R(t, [
    ...e || [],
    ...a || []
  ]);
  return [
    // data
    n || r ? s : p(
      s,
      (o == null ? void 0 : o.split(",")) || []
    ),
    // path
    p(t, a),
    // queries
    p(t, e)
  ];
}, J = (t, n) => {
  const [r, o] = n.split(F), a = $.test(n), [, e] = n.match(H) || [], [, , s] = n.match(L) || [], [, , , , c] = n.match(w) || [], _ = !!e, f = (e == null ? void 0 : e.split(",")) || [], i = (s == null ? void 0 : s.split(",")) || [], u = a ? !1 : g.test(n), T = c === G;
  return (...E) => {
    const [A, b = {}, M = {}] = E, [O, N, d] = a ? x(
      A,
      b,
      f,
      i
    ) : Y(
      A,
      T,
      u,
      c,
      f,
      i
    ), U = _ ? y(o, N) : o, j = m(d) ? "" : `?${I(d)}`;
    return t(
      {
        url: `${Q(U)}${j}`,
        method: r.toLocaleUpperCase(),
        ...P(O) && !D(O) && m(O) ? {} : { params: O },
        ...R(M, ["url", "data", "method", "params"])
      },
      u
    );
  };
}, W = (t, n) => Object.keys(n).reduce(
  (r, o) => ({
    ...r,
    [o]: J(t, n[o])
  }),
  {}
);
export {
  W as G,
  B as requestCreator
};
