import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Button.module.css";

export type ButtonVariant = "default" | "primary" | "inverse";
export type ButtonSize = "md" | "sm";
type ButtonOwnProps = {
  /** default: ink outline · primary: filled --trail · inverse: --paper outline for dark panels. */
  variant?: ButtonVariant;
  /** md: 44px tall (default) · sm: 36px. */
  size?: ButtonSize;
};

/** Class names for the button look, for elements that can't use Button/ButtonLink directly. */
export function buttonClass({ variant = "default", size = "md" }: ButtonOwnProps = {}, className?: string) {
  return cx(s.btn, variant !== "default" && s[variant], size === "sm" && s.sm, className);
}

/** Pill-shaped <button type="button">. Put an icon before or after the text; it is sized to 18px. */
export function Button({ variant, size, className, type = "button", ...rest }: ButtonOwnProps & ComponentPropsWithoutRef<"button">) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...rest} />;
}

/**
 * A link that looks like a Button. Renders <a> unless `as` is given, e.g. `as={Link}` for
 * client-side navigation (keeps this primitive free of Next.js imports).
 */
export function ButtonLink<E extends ElementType = "a">({ as, variant, size, className, ...rest }: PolymorphicProps<E, ButtonOwnProps>) {
  const C: ElementType = as ?? "a";
  return <C className={buttonClass({ variant, size }, className)} {...rest} />;
}

/** A wrapping row of buttons with a 10px gap. */
export function ButtonGroup({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cx(s.group, className)} {...rest} />;
}
