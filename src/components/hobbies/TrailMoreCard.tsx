import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "@/components/ui/icons";
import { Label } from "@/components/ui/Label";
import s from "./TrailMoreCard.module.css";

let grid = "";
for (let x = 30; x < 300; x += 30) grid += `M${x} 0V188`;
for (let y = 30; y < 188; y += 30) grid += `M0 ${y}H300`;

/**
 * Last cell of the most-viewed trails: one link to the full trail log, drawn as a blank map sheet
 * (faint grid, a dashed sample route) with a "+N" badge for the trails not shown as cards.
 */
export function TrailMoreCard({ href, more, kicker, title, text, cta }: { href: string; more: number; kicker: string; title: string; text: string; cta: string }) {
  return (
    <Card as={Link} interactive href={href} className={s.more}>
      <div className={s.map} aria-hidden="true">
        <svg viewBox="0 0 300 188">
          <path className={s.grid} d={grid} />
          <path className={s.path} d="M20 160 C 60 120, 70 150, 110 110 S 160 40, 200 70 S 250 120, 280 30" pathLength={1} />
          <circle className={s.start} cx="20" cy="160" r="5" />
          <rect className={s.end} x="276" y="26" width="8" height="8" />
        </svg>
        <span className={s.badge}>+{more}</span>
      </div>
      <Label as="p">{kicker}</Label>
      <h3>{title}</h3>
      <p className={s.text}>{text}</p>
      <span className={s.go}>
        {cta}
        <ArrowRight />
      </span>
    </Card>
  );
}
