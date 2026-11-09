import type { ReactNode } from "react";
import { cx } from "./cx";
import s from "./SectionHeader.module.css";

/** A section's <h2> with an optional aside on the right (a link, a Label, a Meta row). */
export function SectionHeader({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cx(s.head, className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
