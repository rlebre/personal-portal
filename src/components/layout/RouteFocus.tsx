"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After client-side navigation, move focus to the page <h1> so keyboard and screen reader users
 * start at the new content. Next's own route announcer already announces the new page title, so
 * there is deliberately no live region here (it would announce twice). Skipped on first load so
 * focus stays where the browser put it.
 */
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (!h1) return;
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
