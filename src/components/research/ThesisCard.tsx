import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import s from "./ThesisCard.module.css";

/** Dark (--ink) feature panel for the PhD thesis, with contour rings and a seal. `action` takes an inverse button. */
export function ThesisCard({ eyebrow, title, titleLang, description, action }: { eyebrow: string; title: string; titleLang?: string; description: string; action: ReactNode }) {
  return (
    <div className={s.thesis}>
      <svg className={s.bg} viewBox="0 0 600 200" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <g fill="none" stroke="currentColor">
          <path d="M380 100c0-40 60-70 110-60s90 50 70 90-90 50-130 40-50-40-50-70z" />
          <path d="M350 100c0-60 80-100 150-86s120 70 96 120-120 74-176 58-70-52-70-92z" />
          <path d="M320 100c0-80 100-130 190-112s150 90 120 150-150 96-220 74-90-62-90-112z" />
          <path d="M290 100c0-100 120-160 230-138s180 110 144 180-180 118-264 90-110-72-110-132z" />
        </g>
      </svg>
      <svg className={s.seal} viewBox="0 0 72 72" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="36" cy="36" r="34" />
          <circle cx="36" cy="36" r="27" strokeDasharray="3 3" />
          <path d="M20 46l10-16 6 8 6-12 10 20z" fill="currentColor" fillOpacity=".2" />
        </g>
      </svg>
      <div>
        <Label as="p" className={s.eyebrow}>
          {eyebrow}
        </Label>
        <h2 lang={titleLang}>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
