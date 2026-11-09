"use client";

import { Fragment, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { FilterBar, ResultCount } from "@/components/ui/FilterBar";
import { filterTransition } from "@/lib/filterTransition";
import { htmlLang, interpolate, type Locale } from "@/lib/locale";
// Only the stylesheet: PostRow itself is a server component (it uses the string table).
import s from "./PostRow.module.css";

/** A post's filter keys plus its server-rendered <PostRow> (which carries its own `vtItem` name). */
export type BlogListItem = { slug: string; lang: Locale; tags: string[]; row: ReactNode };

export type BlogListLabels = {
  topic: string;
  language: string;
  allTopics: string;
  allLanguages: string;
  /** "Showing {n} of {t} posts" */
  count: string;
  none: string;
};

/** Topic and language filters over the post rows. Rows are rendered on the server and only shown/hidden here. */
export function BlogList({ items, labels }: { items: BlogListItem[]; labels: BlogListLabels }) {
  const [tag, setTag] = useState("all");
  const [lang, setLang] = useState<"all" | Locale>("all");
  const tags = [...new Set(items.flatMap((p) => p.tags))].sort();
  const list = items.filter((p) => (tag === "all" || p.tags.includes(tag)) && (lang === "all" || p.lang === lang));

  return (
    <>
      <FilterBar>
        {/* Tags are English words: lang="en" so PT pages pronounce them right. */}
        <ChipGroup label={labels.topic} value={tag} onChange={(v) => filterTransition(() => setTag(v))} options={["all", ...tags].map((v) => (v === "all" ? { value: v, label: labels.allTopics } : { value: v, label: v, lang: "en" }))} />
        <ChipGroup
          label={labels.language}
          value={lang}
          onChange={(v) => filterTransition(() => setLang(v))}
          options={(["all", "en", "pt"] as const).map((v) => ({ value: v, label: v === "all" ? labels.allLanguages : v.toUpperCase(), lang: v === "all" ? undefined : htmlLang[v] }))}
        />
      </FilterBar>
      <ResultCount>{list.length ? interpolate(labels.count, { n: list.length, t: items.length }) : labels.none}</ResultCount>
      <ol className={s.list}>
        {list.map((p) => (
          <Fragment key={p.slug}>{p.row}</Fragment>
        ))}
      </ol>
    </>
  );
}
