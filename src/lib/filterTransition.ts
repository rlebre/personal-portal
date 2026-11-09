import { flushSync } from "react-dom";

let active: ViewTransition | null = null;

/**
 * Runs a filter's state update inside a same-document view transition, so the items marked with
 * `vtItem` slide to their new place, new ones fade in and removed ones fade out (base.css).
 * `<html data-vt="filter">` scopes the names to this transition only. Falls back to a plain update
 * under reduced motion or without View Transitions. Client-only (call it from an event handler).
 */
export function filterTransition(update: () => void) {
  const root = document.documentElement;
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return update();
  active?.skipTransition();
  root.dataset.vt = "filter";
  const vt = document.startViewTransition(() => flushSync(update));
  active = vt;
  vt.finished.finally(() => {
    if (active !== vt) return;
    active = null;
    delete root.dataset.vt;
  });
}
