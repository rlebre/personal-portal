import type { ElementType } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Meta.module.css";

/** Muted mono line of small facts (date · reading time · badges). `direction="column"` stacks them. */
export function Meta<E extends ElementType = "div">({ as, direction = "row", className, ...rest }: PolymorphicProps<E, { direction?: "row" | "column" }>) {
  const C: ElementType = as ?? "div";
  return <C className={cx(s.meta, direction === "column" && s.column, className)} {...rest} />;
}
