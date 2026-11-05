export const LANG_SCROLL_KEY = "rl-lang-scroll";
/** id of the footer language group: focus lands there after a switch. */
export const LANG_SWITCH_ID = "lang-switch";

/** What the language switch stores before the full page load: target path, scroll, focus flag. */
export type LangScrollState = { p: string; y: number; f?: 1 };

/**
 * Inline <head> script. Marks <html data-js> (CSS collapses the mobile nav only when JS runs), and
 * after an EN↔PT switch (a full page load) restores the scroll position before the first paint,
 * so the cross-document view transition doesn't jump to the top, then moves focus to the
 * language switch so keyboard and screen reader users continue where they were.
 */
export const langScrollScript = `(function(){
  document.documentElement.setAttribute("data-js", "");
  try {
    var n = function (p) { return p.replace(/\\/$/, "") || "/"; };
    var v = JSON.parse(sessionStorage.getItem(${JSON.stringify(LANG_SCROLL_KEY)}) || "null");
    if (!v || n(v.p) !== n(location.pathname)) return;
    sessionStorage.removeItem(${JSON.stringify(LANG_SCROLL_KEY)});
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var done = false;
    var go = function () {
      if (done) return;
      done = true;
      scrollTo({ top: v.y, behavior: "instant" });
      var g = v.f && document.getElementById(${JSON.stringify(LANG_SWITCH_ID)});
      if (!g) return;
      g.focus({ preventScroll: true });
      var r = g.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) g.scrollIntoView({ block: "nearest", behavior: "instant" });
    };
    addEventListener("pagereveal", function () { if (document.readyState !== "loading") go(); }, { once: true });
    addEventListener("DOMContentLoaded", go, { once: true });
  } catch (e) {}
})();`;
