import type { ComponentProps } from "react";
import { cx } from "./cx";
import s from "./IconButton.module.css";

/**
 * Round 44×44 control holding a 20px icon (or a short mono label). It has no visible text, so
 * `aria-label` is required. For toggles pass `aria-pressed`, for disclosures `aria-expanded`.
 */
export function IconButton({ className, type = "button", ...rest }: ComponentProps<"button"> & { "aria-label": string }) {
  return <button type={type} className={cx(s.iconBtn, className)} {...rest} />;
}
