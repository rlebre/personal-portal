import type { ElementType } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Container.module.css";

/** Centered column (max `--wrap`) with the safe-area-aware side gutter: 16px, 32px from 720px. */
export function Container<E extends ElementType = "div">({ as, className, ...rest }: PolymorphicProps<E>) {
  const C: ElementType = as ?? "div";
  return <C className={cx(s.container, className)} {...rest} />;
}

/** A page section: a Container with vertical rhythm. `flush="top"` drops the top padding. */
export function Section<E extends ElementType = "div">({ as, flush, className, ...rest }: PolymorphicProps<E, { flush?: "top" }>) {
  const C: ElementType = as ?? "div";
  return <C className={cx(s.container, s.section, flush === "top" && s.flushTop, className)} {...rest} />;
}
