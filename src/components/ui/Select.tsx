import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";
import s from "./Select.module.css";

/** Native <select> styled as a pill, matching ChipGroup. Give it a visible <Label as="label" htmlFor>. */
export function Select({ className, ...rest }: ComponentPropsWithoutRef<"select">) {
  return <select className={cx(s.select, className)} {...rest} />;
}
