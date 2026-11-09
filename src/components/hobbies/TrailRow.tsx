import Image from "next/image";
import { cx } from "@/components/ui/cx";
import { formatDecimal, formatMonth, formatNumber, t, type Locale } from "@/lib/i18n";
import type { LoggedTrail } from "@/lib/schemas";
import { Difficulty, type DifficultyLevel } from "./TrailCard";
import s from "./TrailLog.module.css";

const LEVEL: Record<LoggedTrail["difficulty"], DifficultyLevel> = { easy: 1, moderate: 2, difficult: 3, "very-difficult": 4 };
const DIFF_KEY = { easy: "diff.Easy", moderate: "diff.Moderate", difficult: "diff.Difficult", "very-difficult": "diff.Very difficult" } as const;

/**
 * The cells of one trail log row (the <li> is TrailLog's): map thumbnail, name and place,
 * elevation sparkline, distance, gain, difficulty, month recorded and views. Thumbnails are
 * pre-rendered light-theme rasters in public/trails, darkened in dark mode by the raster tokens.
 */
export function TrailRow({ trail, countryName, locale }: { trail: LoggedTrail; countryName: string; locale: Locale }) {
  return (
    <>
      <Image className={s.thumb} src={`/trails/${trail.id}-map.webp`} width={156} height={104} alt="" />
      <div className={s.main}>
        <h2>
          <a href={trail.url}>
            {trail.name}
            <span className="sr-only"> ({t(locale, "trail.open")})</span>
          </a>
        </h2>
        <p className={s.where}>
          {trail.place} · {countryName}
        </p>
        <p className={s.act}>{t(locale, `act.${trail.activity}`)}</p>
      </div>
      <Image
        className={s.prof}
        src={`/trails/${trail.id}-profile.webp`}
        width={156}
        height={38}
        alt={`${t(locale, "trail.profile")}: ${formatNumber(trail.maxElevationM, locale)} m ${t(locale, "trail.max").toLowerCase()}`}
      />
      <span className={s.num}>
        <span className="sr-only">{t(locale, "trail.dist")}: </span>
        {formatDecimal(trail.distanceKm, locale)} km
      </span>
      <span className={s.num}>
        <span className="sr-only">{t(locale, "trail.gain")}: </span>+{formatNumber(trail.gainM, locale)} m
      </span>
      <Difficulty level={LEVEL[trail.difficulty]} label={t(locale, DIFF_KEY[trail.difficulty])} />
      <span className={cx(s.num, s.muted)}>
        <time dateTime={trail.recorded}>{formatMonth(trail.recorded, locale)}</time>
      </span>
      <span className={cx(s.num, s.muted, s.views)}>
        {formatNumber(trail.views, locale)} <span className="sr-only">{t(locale, "trail.views")}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
    </>
  );
}
