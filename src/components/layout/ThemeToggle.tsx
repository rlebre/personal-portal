"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { IconButton } from "@/components/ui/IconButton";
import { Moon, Sun } from "@/components/ui/icons";

const subscribe = () => () => {};
/** True after hydration; the theme is unknown on the server. */
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = dark ? "light" : "dark";
    const apply = () => {
      // Set the attribute directly too, so the view transition snapshot sees the new theme.
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      flushSync(() => setTheme(next));
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.startViewTransition) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const html = document.documentElement;
    // The circle reveals the whole page as one image: no filter-transition names (base.css).
    delete html.dataset.vt;
    html.classList.add("vt-theme");
    const vt = document.startViewTransition(apply);
    vt.finished.finally(() => html.classList.remove("vt-theme"));
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
          // --ease-out: fast at first, settling as it reaches the far corner.
          { duration: 480, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return (
    <IconButton aria-pressed={dark} aria-label={label} onClick={toggle}>
      {dark ? <Sun /> : <Moon />}
    </IconButton>
  );
}
