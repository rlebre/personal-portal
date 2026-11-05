import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";
import s from "./Badge.module.css";

export type BadgeVariant = "outline" | "dashed" | "label";
export type BadgeTone = "neutral" | "forest" | "trail";

/**
 * Small inline marker.
 * - `outline`: bordered code such as a language ("EN"); inherits font and colour.
 * - `dashed`: status such as "Sample".
 * - `label`: uppercase category ("Journal"), coloured by `tone`.
 */
export function Badge({ variant, tone = "neutral", className, ...rest }: { variant: BadgeVariant; tone?: BadgeTone } & ComponentPropsWithoutRef<"span">) {
  return <span className={cx(s[variant], variant === "label" && tone !== "neutral" && s[tone], className)} {...rest} />;
}
