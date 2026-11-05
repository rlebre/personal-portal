"use client";

import { useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { FilterBar, ResultCount } from "@/components/ui/FilterBar";
import { filterTransition } from "@/lib/filterTransition";
import { interpolate } from "@/lib/locale";
import type { Trail } from "@/lib/schemas";
import { vtItem } from "@/lib/vt";
import s from "./TrailList.module.css";

type Activity = Trail["act"];

/** A trail's filter key plus its server-rendered <TrailCard>. */
export type TrailListItem = { key: string; act: Activity; card: ReactNode };

export type TrailListLabels = {
  activity: string;
  all: string;
  hike: string;
  bike: string;
  /** "Showing {n} of {t} trails" */
  count: string;
};

/** Activity chips over the trail cards (three-up grid). Cards are rendered on the server; filtering re-flows them with a view transition. */
export function TrailList({ items, labels }: { items: TrailListItem[]; labels: TrailListLabels }) {
  const [filter, setFilter] = useState<"all" | Activity>("all");
  const list = items.filter((x) => filter === "all" || x.act === filter);
  const onChange = (v: typeof filter) => filterTransition(() => setFilter(v));
  const options = (["all", "hike", "bike"] as const).map((v) => ({ value: v, label: labels[v] }));
  return (
    <>
      <FilterBar>
        <ChipGroup label={labels.activity} value={filter} onChange={onChange} options={options} />
      </FilterBar>
      <ResultCount>{interpolate(labels.count, { n: list.length, t: items.length })}</ResultCount>
      <div className={s.grid}>
        {list.map((x) => (
          // A cell per card: it carries the filter transition's name (see lib/vt) and stretches the card.
          <div key={x.key} className={s.cell} {...vtItem("trail", items.indexOf(x))}>
            {x.card}
          </div>
        ))}
      </div>
    </>
  );
}
