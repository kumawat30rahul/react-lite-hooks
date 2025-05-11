import { useState as u, useEffect as a } from "react";
function m(e, o) {
  const [r, c] = u(e);
  return a(() => {
    const s = setTimeout(() => c(e), o);
    return () => clearTimeout(s);
  }, [e, o]), r;
}
function S(e, o) {
  const [r, c] = u(() => {
    try {
      const t = window.localStorage.getItem(e);
      return t ? JSON.parse(t) : o;
    } catch {
      return o;
    }
  });
  return [r, (t) => {
    try {
      const n = t instanceof Function ? t(r) : t;
      c(n), window.localStorage.setItem(e, JSON.stringify(n));
    } catch (n) {
      console.warn(n);
    }
  }];
}
export {
  m as useDebounce,
  S as useLocalStorage
};
