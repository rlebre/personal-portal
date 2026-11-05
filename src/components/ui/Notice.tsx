import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";
import s from "./Notice.module.css";

/** Dashed, muted callout for page-level caveats ("these posts are samples"). */
export function Notice({ className, ...rest }: ComponentPropsWithoutRef<"p">) {
  return <p className={cx(s.notice, className)} {...rest} />;
}
