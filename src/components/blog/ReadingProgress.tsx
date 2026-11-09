"use client";

import { useEffect, useRef } from "react";
import s from "./ReadingProgress.module.css";

/**
 * Dashed progress bar under the header, tracking the article's scroll position. Where scroll-driven
 * animations exist (and motion is allowed) CSS drives it from the page's scroll timeline
 * (ReadingProgress.module.css) and this effect does nothing; otherwise a scroll listener sets --p.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const art = document.getElementById(targetId);
    if (!art || !bar.current) return;
    const el = bar.current;
    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    const css = CSS.supports("animation-timeline: scroll()");
    const update = () => {
      if (css && motion.matches) return;
      const r = art.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.3 - r.top) / (r.height - innerHeight * 0.5)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    motion.addEventListener("change", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      motion.removeEventListener("change", update);
    };
  }, [targetId]);
  return (
    <div className={s.progress} ref={bar} aria-hidden="true">
      <i />
    </div>
  );
}
