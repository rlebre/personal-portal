import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";
import type { PolymorphicProps } from "./polymorphic";
import s from "./Label.module.css";

type LabelOwnProps = {
  /** Tabular figures, for coordinates, years and other numbers that should line up. */
  tabular?: boolean;
};

/** Small uppercase mono text: field labels, section sub-labels, card kickers. Renders a <span> by default. */
export function Label<E extends ElementType = "span">({ as, tabular, className, ...rest }: PolymorphicProps<E, LabelOwnProps>) {
  const C: ElementType = as ?? "span";
  return <C className={cx(s.label, tabular && s.tabular, className)} {...rest} />;
}

/** The Label above a page title: an optional map symbol (▲ △ ◆ ✎) and the eyebrow text. */
export function Eyebrow({ symbol, tabular, className, children }: { symbol?: string; tabular?: boolean; className?: string; children: ReactNode }) {
  return (
    <Label as="p" tabular={tabular} className={className}>
      {symbol ? (
        <>
          {`${symbol} `}
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </Label>
  );
}
