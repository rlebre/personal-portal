"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/IconButton";
import { Close, MenuIcon } from "@/components/ui/icons";
import { href, navParent, routes, type Locale, type PageKey } from "@/lib/locale";
import { Monogram } from "./Monogram";
import { ThemeToggle } from "./ThemeToggle";
import s from "./Header.module.css";

/** Every visible or accessible string the header needs, resolved on the server (see Shell). */
export type HeaderLabels = {
  /** Appended (visually hidden) to the wordmark: ", home". */
  homeSuffix: string;
  nav: string;
  pages: Record<PageKey, string>;
  menu: string;
  theme: string;
};

const MOBILE = "(max-width:860px)";

/** The nav item for this path: the page itself ("page"), or the parent of a sub-page or post ("true"). */
function activePage(pathname: string, locale: Locale, pages: PageKey[]): { page: PageKey; current: "page" | "true" } | null {
  const clean = pathname.replace(/\/$/, "") || "/";
  const own = pages.find((p) => routes[p][locale] === clean);
  if (own) return { page: own, current: "page" };
  if (clean.startsWith(routes.blog[locale] + "/")) return { page: "blog", current: "true" };
  for (const [sub, parent] of Object.entries(navParent) as [PageKey, PageKey][]) {
    if (routes[sub][locale] === clean && pages.includes(parent)) return { page: parent, current: "true" };
  }
  return null;
}

/**
 * Sticky header. Below 860px the nav collapses into a disclosure panel; the menu button comes
 * before the nav in the DOM (Tab goes from the button into the open panel) and sits on the right
 * through CSS `order`. Without JS (no html[data-js]) the nav stays visible as a wrapping row.
 */
export function Header({ locale, labels, pages }: { locale: Locale; labels: HeaderLabels; pages: PageKey[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const active = activePage(pathname, locale, pages);

  // Close the menu on navigation. Adjusting state while rendering avoids a stale open menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const scrim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // The scrim closes on click (not pointerdown), so the tap doesn't fall through to the page.
    const inside = (n: EventTarget | null) =>
      n instanceof Node && (navRef.current?.contains(n) || menuBtn.current?.contains(n) || n === scrim.current);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    // Focus moving anywhere outside the button and the panel (Tab past the last link, Shift+Tab
    // before the button) closes it, as does a click or tap outside.
    const onFocus = (e: FocusEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    // Leaving the mobile breakpoint with the menu open: the panel no longer exists.
    const mq = matchMedia(MOBILE);
    const onMq = () => !mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <>
      <header className={s.head}>
        <Container className={s.row}>
          <Link className={s.brand} href={href("home", locale)}>
            <Monogram className={s.monogram} />
            <span className={s.wordmark}>
              <span>Rui</span> <b>Lebre</b>
            </span>
            <span className="sr-only">{labels.homeSuffix}</span>
          </Link>
          <IconButton
            ref={menuBtn}
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="nav"
            aria-label={labels.menu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <MenuIcon />}
          </IconButton>
          <nav className={s.nav} id="nav" ref={navRef} data-open={String(open)} aria-label={labels.nav}>
            <ul>
              {pages.map((p) => (
                <li key={p}>
                  <Link href={href(p, locale)} aria-current={active?.page === p ? active.current : undefined}>
                    {labels.pages[p]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.tools}>
            <ThemeToggle label={labels.theme} />
          </div>
        </Container>
      </header>
      {open && <div ref={scrim} className={s.scrim} aria-hidden="true" onClick={() => setOpen(false)} />}
    </>
  );
}
