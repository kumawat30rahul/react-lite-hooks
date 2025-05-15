import { useState as x, useRef as a, useCallback as f, useEffect as w } from "react";
function E(t, c) {
  return t === c;
}
function M(t, c) {
  const p = typeof c == "number" ? { delay: c } : c, {
    delay: m,
    maxWait: d,
    leading: l = !1,
    trailing: s = !0,
    equalityFn: g = E
  } = p, [D, y] = x(t), [C, o] = x(!1), T = a(t), e = a(null), r = a(null), i = a(null), n = f(() => {
    e.current && (clearTimeout(e.current), e.current = null), r.current && (clearTimeout(r.current), r.current = null);
  }, []), u = f(() => {
    y(T.current), o(!1), i.current = null;
  }, []), V = f(() => {
    (e.current || r.current) && (u(), n());
  }, [u, n]), W = f(() => {
    (e.current || r.current) && (o(!1), n());
  }, [n]);
  return w(() => {
    if (g(T.current, t))
      return;
    T.current = t, o(!0);
    const b = Date.now();
    if ((i.current === null || l && !e.current) && (i.current = b, l)) {
      y(t), o(!1), s && (e.current = setTimeout(() => {
        u();
      }, m));
      return;
    }
    if (i.current = b, e.current && clearTimeout(e.current), s && (e.current = setTimeout(() => {
      u();
    }, m)), d !== void 0 && !r.current) {
      const h = b - (i.current || 0), q = Math.max(0, d - h);
      r.current = setTimeout(() => {
        (s || l && e.current) && u(), r.current = null;
      }, q);
    }
    return () => {
      n();
    };
  }, [
    t,
    m,
    d,
    l,
    s,
    g,
    u,
    n
  ]), {
    debouncedValue: D,
    flush: V,
    cancel: W,
    isPending: C
  };
}
export {
  M as useDebounce
};
