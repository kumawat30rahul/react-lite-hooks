import { useState as y, useRef as d, useCallback as g, useEffect as F } from "react";
function I(t, c) {
  return t === c;
}
function q(t, c) {
  const a = typeof c == "number" ? { delay: c } : c, {
    delay: l,
    maxWait: f,
    leading: e = !1,
    trailing: n = !0,
    equalityFn: w = I
  } = a, [V, b] = y(t), [p, m] = y(!1), T = d(t), r = d(null), u = d(null), i = d(null), o = g(() => {
    r.current && (clearTimeout(r.current), r.current = null), u.current && (clearTimeout(u.current), u.current = null);
  }, []), s = g(() => {
    b(T.current), m(!1), i.current = null;
  }, []), x = g(() => {
    (r.current || u.current) && (s(), o());
  }, [s, o]), h = g(() => {
    (r.current || u.current) && (m(!1), o());
  }, [o]);
  return F(() => {
    if (w(T.current, t))
      return;
    T.current = t, m(!0);
    const S = Date.now();
    if ((i.current === null || e && !r.current) && (i.current = S, e)) {
      b(t), m(!1), n && (r.current = setTimeout(() => {
        s();
      }, l));
      return;
    }
    if (i.current = S, r.current && clearTimeout(r.current), n && (r.current = setTimeout(() => {
      s();
    }, l)), f !== void 0 && !u.current) {
      const D = S - (i.current || 0), C = Math.max(0, f - D);
      u.current = setTimeout(() => {
        (n || e && r.current) && s(), u.current = null;
      }, C);
    }
    return () => {
      o();
    };
  }, [
    t,
    l,
    f,
    e,
    n,
    w,
    s,
    o
  ]), {
    debouncedValue: V,
    flush: x,
    cancel: h,
    isPending: p
  };
}
function E(t, c) {
  const [a, l] = y(() => {
    try {
      const e = window.localStorage.getItem(t);
      return e ? JSON.parse(e) : c;
    } catch {
      return c;
    }
  });
  return [a, (e) => {
    try {
      const n = e instanceof Function ? e(a) : e;
      l(n), window.localStorage.setItem(t, JSON.stringify(n));
    } catch (n) {
      console.warn(n);
    }
  }];
}
export {
  q as useDebounce,
  E as useLocalStorage
};
