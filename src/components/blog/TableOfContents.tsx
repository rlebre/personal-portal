import { Label } from "@/components/ui/Label";
import s from "./TableOfContents.module.css";

/** Sticky "On this page" list of the post's h2s. Hidden below 980px. */
export function TableOfContents({ title, headings, lang }: { title: string; headings: { id: string; text: string }[]; lang: string }) {
  return (
    <nav className={s.toc} aria-labelledby="toc-h">
      <Label as="p" id="toc-h">
        {title}
      </Label>
      <ol lang={lang}>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
