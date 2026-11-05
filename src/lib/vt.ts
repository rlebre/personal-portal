import type { CSSProperties } from "react";

/**
 * Props for an element that should slide (rather than jump) when a filter re-flows its list.
 * The element only gets a `view-transition-name` while <html data-vt="filter"> is set by
 * `filterTransition` (base.css), so at rest, and during the theme and language transitions, no
 * card is named. `scope` + `key` must be unique on the page; any character outside [A-Za-z0-9-]
 * is escaped so the result is always a valid, collision-free <custom-ident>.
 */
export function vtItem(scope: string, key: string | number) {
  const safe = `${scope}-${key}`.replace(/[^A-Za-z0-9-]/g, (c) => `_${c.charCodeAt(0).toString(36)}_`);
  return { "data-vt-item": "", style: { "--vt-name": `vt-${safe}` } as CSSProperties };
}
