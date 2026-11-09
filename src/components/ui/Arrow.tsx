import { cx } from "./cx";
import s from "./Arrow.module.css";

/**
 * The decorative "→" after a link's text. aria-hidden, so it never joins the link's name; it nudges
 * 3px right when its link is hovered or keyboard-focused. Put it inside the <a>.
 */
export function Arrow({ className }: { className?: string }) {
  return (
    <span className={cx(s.arrow, className)} aria-hidden="true">
      →
    </span>
  );
}
