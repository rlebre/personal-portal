import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";
import s from "./FilterBar.module.css";

/** Wrapping row that holds the ChipGroups / Selects above a filtered list. */
export function FilterBar({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cx(s.filters, className)} {...rest} />;
}

/** "Showing n of t": a polite live region, so filter changes are announced. */
export function ResultCount({ className, ...rest }: Omit<ComponentPropsWithoutRef<"p">, "role" | "aria-live">) {
  return <p className={cx(s.count, className)} role="status" aria-live="polite" {...rest} />;
}
