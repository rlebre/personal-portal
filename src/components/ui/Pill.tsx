import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";
import s from "./Pill.module.css";

/** Filled, rounded mono tag for short facts: "20 papers", "Jun 2022 · Senior", "Live". */
export function Pill({ className, ...rest }: ComponentPropsWithoutRef<"span">) {
  return <span className={cx(s.pill, className)} {...rest} />;
}
