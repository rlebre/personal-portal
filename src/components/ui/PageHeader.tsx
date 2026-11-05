import type { ReactNode } from "react";
import { Container } from "./Container";
import { cx } from "./cx";
import s from "./PageHeader.module.css";

/**
 * Top of a page: eyebrow, the page's only <h1>, an optional lede, then `children`
 * (stats, buttons, meta). `spacing="tight"` shortens the bottom padding (articles);
 * `fill` makes it at least half the viewport tall and centres it (404).
 */
export function PageHeader({
  eyebrow,
  title,
  titleLang,
  lede,
  spacing = "default",
  fill,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** `lang` of the title when it differs from the page (post titles). */
  titleLang?: string;
  lede?: ReactNode;
  spacing?: "default" | "tight";
  fill?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Container className={cx(s.head, spacing === "tight" && s.tight, fill && s.fill, className)}>
      {eyebrow}
      <h1 lang={titleLang}>{title}</h1>
      {lede && <p className={s.lede}>{lede}</p>}
      {children}
    </Container>
  );
}
