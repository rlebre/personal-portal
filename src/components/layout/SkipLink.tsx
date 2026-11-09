"use client";

import s from "./SkipLink.module.css";

/** First focusable element: jumps to the page <h1> (or <main>) and moves focus there. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      className={s.skip}
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        const h1 = document.querySelector<HTMLElement>("main h1");
        const target = h1 ?? document.getElementById("main");
        if (!target) return;
        if (h1) h1.setAttribute("tabindex", "-1");
        target.focus();
        target.scrollIntoView();
      }}
    >
      {label}
    </a>
  );
}
