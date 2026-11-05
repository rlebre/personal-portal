import type { ReactNode } from "react";
import { cx } from "./cx";
import s from "./Stat.module.css";

export type Stat = { value: ReactNode; label: string };

/** A wrapping row of big numbers with mono captions ("20 publications · 5 journals"). */
export function StatList({ items, className }: { items: Stat[]; className?: string }) {
  return (
    <div className={cx(s.stats, className)}>
      {items.map((it) => (
        <span key={it.label}>
          <b>{it.value}</b>{" "}
          <span>{it.label}</span>
        </span>
      ))}
    </div>
  );
}
