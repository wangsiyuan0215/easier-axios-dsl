import I from "axios";
import { stringify as C } from "qs";
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
  const o = I.create({
    timeout: S,
    ...r
  });
  return t.length && o.interceptors.request.use(...t), n.length && o.interceptors.response.use(...n), async function({
    url: e,
    method: s,
    params: c,
    ..._
  }, i = !1) {
    const { headers: p = {}, ...u } = _ || {};
    try {
      const { data: f } = await o({
        url: e,
        method: s,
        headers: {
          "Content-Type": i ? l.FORM_DATA : l.JSON,
          ...p
        },
        ...s === h.POST || s === h.PUT ? {
          data: i ? Object.keys(c).reduce(
            (E, T) => (E.append(T, c[T]), E),
            new FormData()
          ) : c
        } : {},
        ...s === h.GET || s === h.DELETE ? { params: c } : {},
        ...u
      });
      return f;
    } catch (f) {
      throw f;
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
}, F = (t, n) => t.replace(/{([^{]*)}/g, (r, o) => n[o]), y = /\s{1,}/, G = "*", $ = /\s\[d|(data)]\s?/, g = /\s(d|(data))\.(f|formData):/, w = /\s+(d|data)(\.(f|formData))?:(\S*)(\s|$)/, H = /\s+path:(\S*)(\s|$)/, L = /\s+(q|query):(\S*)(\s|$)/, A = (t, n) => !t || !(n != null && n.length) ? {} : n.reduce(
  (r, o) => ({ ...r, [o]: t[o] }),
  {}
), Q = (t) => {
  const [n] = t.split("?");
  return n;
}, x = (t, n, r, o) => [
  t,
  A(n, r),
  A(n, o)
], Y = (t, n, r, o, a, e) => {
  const s = R(t, [
    ...e || [],
    ...a || []
  ]);
  return [
    // data
    n || r ? s : A(
      s,
      (o == null ? void 0 : o.split(",")) || []
    ),
    // path
    A(t, a),
    // queries
    A(t, e)
  ];
}, J = (t, n) => {
  const [r, o] = n.split(y), a = $.test(n), [, e] = n.match(H) || [], [, , s] = n.match(L) || [], [, , , , c] = n.match(w) || [], _ = !!e, i = (e == null ? void 0 : e.split(",")) || [], p = (s == null ? void 0 : s.split(",")) || [], u = a ? !1 : g.test(n), f = c === G;
  return (...E) => {
    const [T, b = {}, M = {}] = E, [O, N, d] = a ? x(
      T,
      b,
      i,
      p
    ) : Y(
      T,
      f,
      u,
      c,
      i,
      p
    ), U = _ ? F(o, N) : o, j = m(d) ? "" : `?${C(d)}`;
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
