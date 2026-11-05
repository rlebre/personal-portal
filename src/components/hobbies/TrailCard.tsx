import { Arrow } from "@/components/ui/Arrow";
import { Card } from "@/components/ui/Card";
import { cx } from "@/components/ui/cx";
import { formatDecimal, formatMonth, formatNumber, t, type Locale } from "@/lib/i18n";
import type { Route, Trail } from "@/lib/schemas";
import s from "./TrailCard.module.css";

const NICE_KM = [0.2, 0.5, 1, 2, 5, 10, 20];

/** trails.json dates are English ("Aug 2020"); show them in the page's locale ("ago 2020" in PT). */
export function trailDate(date: string, locale: Locale): string {
  const [mon, year] = date.split(" ");
  for (let m = 1; m <= 12; m++) {
    const ym = `${year}-${String(m).padStart(2, "0")}`;
    if (formatMonth(ym, "en") === `${mon} ${year}`) return formatMonth(ym, locale);
  }
  return date;
}

/** Real GPS route, pre-projected into a 300×188 viewBox. `k` = km per 100 px. */
export function RouteMap({ route, trail, rank, locale }: { route: Route; trail: Trail; rank: number; locale: Locale }) {
  const nice = NICE_KM.filter((v) => (v / route.k) * 100 <= 100).pop() ?? 0.2;
  const px = Number(((nice / route.k) * 100).toFixed(1));
  const loop = Math.hypot(route.s[0] - route.e[0], route.s[1] - route.e[1]) < 10;
  let grid = "";
  for (let x = 30; x < 300; x += 30) grid += `M${x} 0V188`;
  for (let y = 30; y < 188; y += 30) grid += `M0 ${y}H300`;
  const id = `mp${rank}`;
  return (
    <div className={s.map}>
      <svg viewBox="0 0 300 188" role="img" aria-labelledby={id}>
        <title id={id}>{`${t(locale, "trail.map")}: ${trail.n}`}</title>
        <path className={s.mapGrid} d={grid} />
        <path className={s.halo} d={route.d} />
        <path className={s.route} d={route.d} pathLength={1} />
        <path className={s.routeTrace} d={route.d} pathLength={1} aria-hidden="true" />
        {!loop && <rect className={s.end} x={route.e[0] - 4} y={route.e[1] - 4} width="8" height="8" />}
        <circle className={s.start} cx={route.s[0]} cy={route.s[1]} r="5" />
        <g className={s.scale}>
          <rect className={s.scaleChip} x="8" y="155" width={(px + 12).toFixed(1)} height="27" rx="4" />
          <path d={`M14 172v4h${px}v-4`} />
          <text x="14" y="166">{formatDecimal(nice, locale)} km</text>
        </g>
        <text className={s.north} x="288" y="20" textAnchor="end">N ↑</text>
      </svg>
      <span className={s.badge} aria-hidden="true">#{rank}</span>
    </div>
  );
}

/** Elevation profile from 61 samples (metres) with a marker at the high point. */
export function ElevationProfile({ route, trail, rank, locale }: { route: Route; trail: Trail; rank: number; locale: Locale }) {
  const W = 300, H = 84, pad = 4, top = 14, bot = 18;
  const raw = route.prof;
  const N = raw.length - 1;
  const lo = Math.min(...raw), hi = Math.max(...raw);
  const pts = raw.map((v) => (v - lo) / Math.max(1, hi - lo));
  const xs = (k: number) => pad + (k / N) * (W - 2 * pad);
  const ys = (v: number) => top + (1 - v) * (H - top - bot);
  const d = pts.map((v, k) => (k ? "L" : "M") + xs(k).toFixed(1) + " " + ys(v).toFixed(1)).join(" ");
  const mi = pts.indexOf(Math.max(...pts));
  const id = `ep${rank}`;
  const desc = `${t(locale, "trail.profile")}: ${formatDecimal(trail.km, locale)} km, ${trail.min}–${trail.max} m, +${trail.gain} m`;
  return (
    <figure>
      <svg className={s.ep} viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={id}>
        <title id={id}>{desc}</title>
        <path className={s.epArea} d={`${d} L${xs(N)} ${H - bot} L${xs(0)} ${H - bot}z`} />
        <path className={s.epLine} d={d} pathLength={1} />
        <line x1={pad} x2={W - pad} y1={H - bot} y2={H - bot} stroke="var(--line)" />
        <circle className={s.epPeak} cx={xs(mi)} cy={ys(pts[mi])} r="3.5" />
        <text className={s.epText} x={Math.min(Math.max(xs(mi), 30), W - 30)} y="10" textAnchor="middle">{formatNumber(trail.max, locale)} m</text>
        <text className={s.epText} x={pad} y={H - 4}>0</text>
        <text className={s.epText} x={W - pad} y={H - 4} textAnchor="end">{formatDecimal(trail.km, locale)} km</text>
      </svg>
    </figure>
  );
}

const DIFF = {
  Easy: { level: 1, tone: s.easy },
  Moderate: { level: 2, tone: s.moderate },
  Difficult: { level: 3, tone: s.hard },
} as const;

/** Difficulty as one to three filled peaks plus the localized word, coloured by level. */
export function Difficulty({ diff, label }: { diff: Trail["diff"]; label: string }) {
  const { level, tone } = DIFF[diff];
  return (
    <span className={cx(s.diff, tone)}>
      <svg viewBox="0 0 36 13" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${i * 12} 12 L${i * 12 + 5} 2 L${i * 12 + 10} 12z`} fill={i < level ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
        ))}
      </svg>
      {label}
    </span>
  );
}

/** A trail: route map, activity and views, name, distance/gain/max, elevation profile, difficulty and a Wikiloc link. */
export function TrailCard({ trail, route, rank, locale }: { trail: Trail; route?: Route; rank: number; locale: Locale }) {
  return (
    <Card as="article" interactive className={s.trail}>
      {route && <RouteMap route={route} trail={trail} rank={rank} locale={locale} />}
      <div className={s.rank}>
        <span>{t(locale, `act.${trail.act}`)} · {t(locale, `type.${trail.type}`)}</span>
        <span>{formatNumber(trail.views, locale)} {t(locale, "trail.views")}</span>
      </div>
      <div>
        <h3>{trail.n}</h3>
        <p className={s.where}>{trail.where}</p>
      </div>
      <dl>
        <div><dt>{t(locale, "trail.dist")}</dt><dd>{formatDecimal(trail.km, locale)} km</dd></div>
        <div><dt>{t(locale, "trail.gain")}</dt><dd>+{formatNumber(trail.gain, locale)} m</dd></div>
        <div><dt>{t(locale, "trail.max")}</dt><dd>{formatNumber(trail.max, locale)} m</dd></div>
      </dl>
      {route && <ElevationProfile route={route} trail={trail} rank={rank} locale={locale} />}
      <div className={s.foot}>
        <Difficulty diff={trail.diff} label={t(locale, `diff.${trail.diff}`)} />
        <span className={cx("mono", s.date)}>{trailDate(trail.date, locale)}</span>
        <a href={trail.u}>
          {t(locale, "trail.open")}
          <span className="sr-only">: {trail.n}</span> <Arrow />
        </a>
      </div>
    </Card>
  );
}
