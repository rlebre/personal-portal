import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Chip.module.css";

/**
 * Static, rounded keyword (skills, research themes). Renders a <span> by default; use `as="li"`
 * inside a ChipList. For a selectable chip use ChipGroup, which renders aria-pressed buttons.
 */
export function Chip<E extends ElementType = "span">({ as, className, ...rest }: PolymorphicProps<E>) {
  const C: ElementType = as ?? "span";
  return <C className={cx(s.chip, className)} {...rest} />;
}

/** A wrapping <ul> of chips without list styling. Children are `<Chip as="li">`. */
export function ChipList({ className, ...rest }: ComponentPropsWithoutRef<"ul">) {
  return <ul className={cx(s.chips, s.list, className)} {...rest} />;
}
