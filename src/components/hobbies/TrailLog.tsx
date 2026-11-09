"use client";

import { useId, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { FilterBar, ResultCount } from "@/components/ui/FilterBar";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { interpolate } from "@/lib/locale";
import { searchText } from "@/lib/search";
import s from "./TrailLog.module.css";

type Activity = "hike" | "bike";
export type TrailSort = "views" | "recent" | "long" | "climb";

/** A server-rendered row plus what the filters and sorts read. `text` is already normalized (see `searchText`). */
export type TrailLogRow = { id: string; act: Activity; country: string; views: number; recorded: string; km: number; gain: number; text: string; row: ReactNode };

export type TrailLogLabels = {
  activity: string;
  all: string;
  hike: string;
  bike: string;
  country: string;
  allCountries: string;
  sort: string;
  sorts: Record<TrailSort, string>;
  search: string;
  searchPlaceholder: string;
  /** "Showing {n} of {t} trails" */
  count: string;
  none: string;
  /** Column headings: thumbnail (empty), trail, elevation, distance, gain, difficulty, recorded, views. */
  columns: string[];
};

const SORTS: Record<TrailSort, (a: TrailLogRow, b: TrailLogRow) => number> = {
  views: (a, b) => b.views - a.views,
  recent: (a, b) => b.recorded.localeCompare(a.recorded),
  long: (a, b) => b.km - a.km,
  climb: (a, b) => b.gain - a.gain,
};

/**
 * The full trail log: activity chips, country and sort selects, a search box and a live count over
 * a table-like list. Rows are rendered on the server in "most viewed" order, so the page is
 * complete without JS; filtering and sorting only pick and reorder them.
 */
export function TrailLog({
  rows,
  countries,
  labels,
  note,
}: {
  rows: TrailLogRow[];
  countries: { code: string; label: string }[];
  labels: TrailLogLabels;
  /** A line under the list (the Wikiloc link). */
  note?: ReactNode;
}) {
  const [act, setAct] = useState<"all" | Activity>("all");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<TrailSort>("views");
  const [query, setQuery] = useState("");
  const countryId = useId();
  const sortId = useId();
  const q = searchText(query.trim());
  const list = rows
    .filter((r) => (act === "all" || r.act === act) && (country === "all" || r.country === country) && (!q || r.text.includes(q)))
    .sort(SORTS[sort]);
  return (
    <>
      <FilterBar className={s.filters}>
        <ChipGroup label={labels.activity} value={act} onChange={setAct} options={(["all", "hike", "bike"] as const).map((v) => ({ value: v, label: labels[v] }))} />
        <span className={s.field}>
          <Label as="label" htmlFor={countryId}>
            {labels.country}
          </Label>
          <Select id={countryId} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">{labels.allCountries}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {`${c.label} (${rows.filter((r) => r.country === c.code).length})`}
              </option>
            ))}
          </Select>
        </span>
        <span className={s.field}>
          <Label as="label" htmlFor={sortId}>
            {labels.sort}
          </Label>
          <Select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as TrailSort)}>
            {(Object.keys(SORTS) as TrailSort[]).map((k) => (
              <option key={k} value={k}>
                {labels.sorts[k]}
              </option>
            ))}
          </Select>
        </span>
        <label className={s.search}>
          <span className="sr-only">{labels.search}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input type="search" autoComplete="off" placeholder={labels.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </FilterBar>
      <ResultCount>{list.length ? interpolate(labels.count, { n: list.length, t: rows.length }) : labels.none}</ResultCount>
      {/* Visual column headings only: every cell in a row carries its own (sr-only) label. */}
      <div className={s.head} aria-hidden="true">
        {labels.columns.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <ol className={s.list}>
        {list.map((r) => (
          <li key={r.id} className={s.row}>
            {r.row}
          </li>
        ))}
      </ol>
      {note && <p className={s.note}>{note}</p>}
    </>
  );
}
