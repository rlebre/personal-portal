"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx";
import { Label } from "./Label";
import s from "./Chip.module.css";

export type ChipOption<V extends string> = {
  value: V;
  label: ReactNode;
  /** Language of the label when it differs from the page (e.g. "EN" on the PT site). */
  lang?: string;
};

/**
 * Single-select filter: a labelled role="group" of toggle buttons with aria-pressed (the pressed
 * one shows a check). Pair it with a ResultCount so the result is announced.
 */
export function ChipGroup<V extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: ReactNode;
  options: ChipOption<V>[];
  value: V;
  onChange: (value: V) => void;
  className?: string;
}) {
  const labelId = useId();
  return (
    <div className={cx(s.chips, className)} role="group" aria-labelledby={labelId}>
      <Label id={labelId} className={s.groupLabel}>
        {label}
      </Label>
      {options.map((o) => (
        <button key={o.value} className={s.chip} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} lang={o.lang}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
