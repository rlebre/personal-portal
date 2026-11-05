"use client";

import { useEffect, useRef } from "react";
import s from "./CvTimeline.module.css";

/** Scroll-driven reveal in CSS (CvTimeline.module.css) where supported; this file is the fallback. */
const cssDriven = () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");

/**
 * Wraps the CvItems and draws a dashed trail through each entry's waypoint (`[data-waypoint]`).
 * The trail reveals with scroll progress (never below 35%); fully drawn under reduced motion. The
 * reveal is a CSS view-timeline animation where supported; otherwise a rAF-throttled scroll
 * handler sets the clip, reading one rect per frame.
 */
export function CvTrail({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const cv = box.current!;
    const p = path.current!;
    const s = svg.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const js = !cssDriven();
    let frame = 0;

    const reveal = () => {
      frame = 0;
      if (reduce.matches) {
        s.style.clipPath = "";
        return;
      }
      const r = cv.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0.35, (innerHeight * 0.75 - r.top) / r.height));
      // Reveal as a mask over the dashes: the dashed pattern stays, the visible length grows.
      s.style.clipPath = `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(reveal);
    };

    const layout = () => {
      const items = [...cv.querySelectorAll<HTMLElement>("[data-waypoint]")];
      if (!items.length) return;
      const top = cv.getBoundingClientRect().top;
      let d = "";
      let py = 0;
      items.forEach((it, i) => {
        const y = it.getBoundingClientRect().top - top + 34;
        if (!i) d = `M 21 ${y}`;
        else {
          const m = (py + y) / 2;
          const o = i % 2 ? 12 : -10;
          d += ` C ${21 + o} ${py + (m - py) * 0.6}, ${21 - o} ${m + (y - m) * 0.4}, 21 ${y}`;
        }
        py = y;
      });
      d += ` L 21 ${items[items.length - 1].getBoundingClientRect().bottom - top}`;
      p.setAttribute("d", d);
      s.setAttribute("viewBox", `0 0 44 ${cv.offsetHeight}`);
      s.style.height = `${cv.offsetHeight}px`;
      if (js) reveal();
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(cv);
    if (js) {
      addEventListener("scroll", onScroll, { passive: true });
      reduce.addEventListener("change", reveal);
    }
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", reveal);
    };
  }, []);

  return (
    <div className={s.cv} ref={box}>
      <svg className={s.trailSvg} ref={svg} aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <path ref={path} fill="none" stroke="var(--trail)" strokeWidth="2" strokeDasharray="6 6" />
      </svg>
      {children}
    </div>
  );
}
