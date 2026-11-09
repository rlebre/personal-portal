import type { ReactNode } from "react";
import { cx } from "@/components/ui/cx";
import s from "./CvTimeline.module.css";

/** One role on the CvTrail: dates on the left, title and organisation on the right, then `children`. */
export function CvItem({ when, title, org, orgNote, current, children }: { when: ReactNode; title: string; org: string; orgNote?: string; current?: boolean; children?: ReactNode }) {
  return (
    <div className={cx(s.item, current && s.current)} data-waypoint>
      <div className={s.when}>{when}</div>
      <div>
        <h3>{title}</h3>
        <p className={s.org}>
          {/* "Plex " as one text node, as the original markup had it (splitting it shifts glyphs by a subpixel). */}
          {orgNote ? `${org} ` : org}
          {orgNote && <span className={s.muted}>· {orgNote}</span>}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Promotion steps inside a CvItem: children are Pills ("Jun 2022 · Software Engineer"). */
export function CvSteps({ children }: { children: ReactNode }) {
  return <div className={s.steps}>{children}</div>;
}

/** Highlights with a bold lead-in and a diamond bullet. */
export function CvBullets({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className={s.bullets}>
      {items.map((b) => (
        <li key={b.title}>
          <b>{b.title}</b> <span>{b.text}</span>
        </li>
      ))}
    </ul>
  );
}
