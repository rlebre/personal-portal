"use client";

import { usePathname } from "next/navigation";
import { useId } from "react";
import { Chip } from "@/components/ui/Chip";
import { Label } from "@/components/ui/Label";
import { LANG_SCROLL_KEY, LANG_SWITCH_ID, type LangScrollState } from "@/lib/langScroll";
import { counterpart, htmlLang, languageName, locales, type Locale } from "@/lib/locale";
import s from "./LangSwitch.module.css";

/**
 * Footer language switch: a labelled group of two chips, "English" and "Português". The current
 * language is plain text with aria-current; the other links to the counterpart page. Switching is
 * a full page load (EN and PT are separate root layouts, so each document has the right
 * <html lang>), smoothed by a cross-document view transition (base.css); the scroll position is
 * carried over and focus returns to this group (see langScrollScript).
 */
export function LangSwitch({ locale, label, currentLabel }: { locale: Locale; label: string; currentLabel: string }) {
  const pathname = usePathname();
  const target = counterpart(pathname, locale);
  const labelId = useId();
  return (
    <div id={LANG_SWITCH_ID} className={s.lang} role="group" aria-labelledby={labelId} tabIndex={-1}>
      <Label id={labelId}>{label}</Label>
      {locales.map((l) =>
        l === locale ? (
          <Chip key={l} aria-current="true" lang={htmlLang[l]}>
            {languageName[l]}
            <span className="sr-only" lang={htmlLang[locale]}>
              {` ${currentLabel}`}
            </span>
          </Chip>
        ) : (
          <Chip
            key={l}
            as="a"
            href={target}
            hrefLang={htmlLang[l]}
            lang={htmlLang[l]}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // new tab/window
              const state: LangScrollState = { p: target, y: scrollY, f: 1 };
              try {
                sessionStorage.setItem(LANG_SCROLL_KEY, JSON.stringify(state));
              } catch {}
            }}
          >
            {languageName[l]}
          </Chip>
        ),
      )}
    </div>
  );
}
