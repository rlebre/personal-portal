import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import s from "./AscentProfile.module.css";

/**
 * Academic path drawn like a trail profile, in a scrollable card. x = year, y = "elevation".
 * The chart is decorative (the Milestones list below carries the content); `label` names its
 * scroll container, which is focusable for keyboard scrolling. One progress value (--ascent,
 * AscentProfile.module.css) draws the line as the card scrolls into view and pops each waypoint
 * as the line reaches it; `--at` is where along the line that is.
 */
export function AscentProfile({ caption, label }: { caption: string; label: string }) {
  const W = 1000, H = 240, L = 40, R = 20, T = 34, B = 36;
  const x = (y: number) => L + ((y - 2010.5) / (2023 - 2010.5)) * (W - L - R);
  const yv = (v: number) => T + (1 - v) * (H - T - B);
  const pts: [number, number][] = [
    [2010.6, 0.04], [2011, 0.08], [2013, 0.16], [2015, 0.3], [2015.6, 0.36], [2016.2, 0.48], [2017, 0.55],
    [2017.6, 0.52], [2018.2, 0.66], [2019.5, 0.72], [2020.5, 0.8], [2021.5, 0.9], [2022.4, 1], [2022.9, 0.96],
  ];
  let d = "";
  pts.forEach((p, i) => {
    const X = x(p[0]), Y = yv(p[1]);
    if (!i) {
      d = `M${X} ${Y}`;
      return;
    }
    const q = pts[i - 1];
    const QX = x(q[0]), QY = yv(q[1]), mx = (QX + X) / 2;
    d += ` C${mx} ${QY}, ${mx} ${Y}, ${X} ${Y}`;
  });
  const wps: [number, number, string][] = [
    [2011, 0.08, "BSc"], [2015.6, 0.36, "MSc"], [2016.2, 0.48, "IEETA"], [2017.6, 0.52, "Dicoogle"], [2022.4, 1, "PhD"],
  ];
  const years = Array.from({ length: 12 }, (_, i) => 2011 + i);
  // Share of the progress over which the line draws; the rest lets the last waypoint settle.
  const LINE = 0.88;
  return (
    <Card as="figure" className={s.figure}>
      {/* Scrolls sideways on narrow screens: focusable so keyboard users can scroll it too. */}
      <div className={s.scroll} tabIndex={0} role="group" aria-label={label}>
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          {[1, 2, 3, 4, 5].map((k) => (
            <line key={k} x1={L} x2={W - R} y1={yv(k / 6)} y2={yv(k / 6)} stroke="var(--line)" strokeDasharray="2 6" />
          ))}
          <path className={s.area} d={`${d} L${x(2022.9)} ${H - B} L${x(2010.6)} ${H - B}z`} fill="color-mix(in srgb,var(--forest) 12%,transparent)" />
          <path className={s.line} d={d} fill="none" stroke="var(--forest)" strokeWidth="2.5" pathLength={1} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="var(--ink-2)" />
          {years.map((yr) => (
            <text key={yr} x={x(yr)} y={H - 12} textAnchor="middle" className={s.axis}>{yr}</text>
          ))}
          {wps.map(([yr, v, l]) => (
            <g key={l} className={l === "PhD" ? `${s.wp} ${s.summit}` : s.wp} style={{ "--at": (LINE * (x(yr) - x(2010.6)) / (x(2022.9) - x(2010.6))).toFixed(3) } as CSSProperties}>
              <rect x={x(yr) - 6} y={yv(v) - 6} width="12" height="12" fill={l === "PhD" ? "var(--mark)" : "var(--trail)"} stroke="var(--surface)" strokeWidth="2" />
              <text x={x(yr)} y={yv(v) - 14} textAnchor="middle" className={s.waypoint}>{l}</text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </Card>
  );
}
