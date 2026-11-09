"use client";

import { useId, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { FilterBar, ResultCount } from "@/components/ui/FilterBar";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { filterTransition } from "@/lib/filterTransition";
import { interpolate } from "@/lib/locale";
import type { Publication } from "@/lib/schemas";
import { vtItem } from "@/lib/vt";
import s from "./Publications.module.css";

type PubType = Publication["type"];

/** A publication's filter keys plus its server-rendered <PublicationItem>. */
export type PublicationListItem = { key: string; year: number; type: PubType; node: ReactNode };

export type PublicationListLabels = {
  type: string;
  all: string;
  types: Record<PubType, string>;
  year: string;
  allYears: string;
  /** "Showing {n} of {t} publications" */
  count: string;
  none: string;
};

/** Type chips + year select over the publications, grouped by year (newest first, in data order). */
export function PublicationList({ items, labels }: { items: PublicationListItem[]; labels: PublicationListLabels }) {
  const [type, setType] = useState<"all" | PubType>("all");
  const [year, setYear] = useState("all");
  const yearId = useId();
  const years = [...new Set(items.map((p) => p.year))];
  const list = items.filter((p) => (type === "all" || p.type === type) && (year === "all" || String(p.year) === year));
  const typeOptions = (["all", "journal", "conference", "chapter"] as const).map((v) => ({ value: v, label: v === "all" ? labels.all : labels.types[v] }));

  return (
    <>
      <FilterBar>
        <ChipGroup label={labels.type} value={type} onChange={(v) => filterTransition(() => setType(v))} options={typeOptions} />
        <Label as="label" htmlFor={yearId}>
          {labels.year}
        </Label>
        <Select
          id={yearId}
          value={year}
          onChange={(e) => {
            const v = e.target.value;
            filterTransition(() => setYear(v));
          }}
        >
          <option value="all">{labels.allYears}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </FilterBar>
      <ResultCount>{list.length ? interpolate(labels.count, { n: list.length, t: items.length }) : labels.none}</ResultCount>
      <div>
        {years
          .filter((y) => list.some((p) => p.year === y))
          .map((y) => (
            <div key={y} className={s.year} {...vtItem("year", y)}>
              <h3>{y}</h3>
              <ol>
                {list
                  .filter((p) => p.year === y)
                  .map((p) => (
                    <li key={p.key} {...vtItem("pub", items.indexOf(p))}>
                      {p.node}
                    </li>
                  ))}
              </ol>
            </div>
          ))}
      </div>
    </>
  );
}
