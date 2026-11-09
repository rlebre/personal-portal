import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Container";
import s from "./About.module.css";

export type Fact = { term: string; value: ReactNode };

/**
 * "About me": the story in two first-person paragraphs, and a "Field notes" card beside it (a
 * dashed-rule definition list with a faint contour-ring motif in the corner). One column below 860px.
 */
export function About({ eyebrow, title, paragraphs, factsTitle, facts }: { eyebrow: string; title: string; paragraphs: string[]; factsTitle: string; facts: Fact[] }) {
  return (
    <Section className={s.about} aria-labelledby="about-h">
      <div className={s.story}>
        <Label as="p">{eyebrow}</Label>
        <h2 id="about-h">{title}</h2>
        {paragraphs.map((p) => (
          <p key={p} className={s.p}>
            {p}
          </p>
        ))}
      </div>
      <aside className={s.facts} aria-labelledby="facts-h">
        <Label as="p" id="facts-h">
          {factsTitle}
        </Label>
        <dl>
          {facts.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </Section>
  );
}
