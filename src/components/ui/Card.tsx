import type { ElementType } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Card.module.css";

type CardOwnProps = {
  /**
   * Hover and focus feedback: 2px lift, --trail border and shadow. Use when the whole card is (or
   * contains) the main link; keyboard focus on that link lights the card the same way as hover.
   */
  interactive?: boolean;
};

/**
 * Surface with a hairline border and the card radius. It sets no padding or layout: the
 * consumer adds those through `className`. Renders a <div> by default (`as="article"`, `as={Link}`…).
 */
export function Card<E extends ElementType = "div">({ as, interactive, className, ...rest }: PolymorphicProps<E, CardOwnProps>) {
  const C: ElementType = as ?? "div";
  return <C className={cx(s.card, interactive && s.interactive, className)} {...rest} />;
}
