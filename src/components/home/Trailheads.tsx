import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import s from "./Trailheads.module.css";

export type Trailhead = { href: string; sym: string; pill: string; title: string; body: string; points?: string[]; go: string; ripple: string };

/** Three linked cards into the main sections, joined by a dashed trail (hidden when stacked). `points` adds a short proof list. */
export function Trailheads({ items }: { items: Trailhead[] }) {
  return (
    <div className={s.grid}>
      <svg className={s.connector} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 30 C 160 0, 240 60, 500 30 S 840 0, 1000 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
      </svg>
      {items.map((c) => (
        <Card key={c.href} as={Link} interactive className={s.th} href={c.href}>
          <svg className={s.ripple} viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d={c.ripple} fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className={s.top}>
            <span className={s.sym} aria-hidden="true">
              {c.sym}
            </span>
            <Pill>{c.pill}</Pill>
          </div>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
          {c.points && (
            <ul className={s.points}>
              {c.points.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
          <span className={s.go}>
            <span>{c.go}</span>
            <ArrowRight />
          </span>
        </Card>
      ))}
    </div>
  );
}
