import Link from "next/link";
import { TrailLog, type TrailLogRow } from "@/components/hobbies/TrailLog";
import { TrailRow } from "@/components/hobbies/TrailRow";
import { Arrow } from "@/components/ui/Arrow";
import { Container } from "@/components/ui/Container";
import { Crumbs } from "@/components/ui/Crumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import { allTrails } from "@/lib/data";
import { dateLocale, href, locales, t, type Locale } from "@/lib/i18n";
import { searchText } from "@/lib/search";
import { site } from "@/lib/site";
import { TrailStats } from "./HobbiesPage";

const regionNames = Object.fromEntries(locales.map((l) => [l, new Intl.DisplayNames([dateLocale[l]], { type: "region" })])) as Record<Locale, Intl.DisplayNames>;
const countryName = (code: string, locale: Locale) => regionNames[locale].of(code) ?? code;

export function AllTrailsPage({ locale }: { locale: Locale }) {
  const rows: TrailLogRow[] = allTrails.map((x) => ({
    id: x.id,
    act: x.activity === "hiking" ? "hike" : "bike",
    country: x.country,
    views: x.views,
    recorded: x.recorded,
    km: x.distanceKm,
    gain: x.gainM,
    // Name, place and the country in both languages; "Azores" also finds "Açores".
    text: searchText([x.name, x.place, ...locales.map((l) => countryName(x.country, l)), /Açores/.test(x.place) ? "Azores" : ""].join(" ")),
    row: <TrailRow trail={x} countryName={countryName(x.country, locale)} locale={locale} />,
  }));
  const countries = [...new Set(allTrails.map((x) => x.country))]
    .map((code) => ({ code, label: countryName(code, locale) }))
    .sort((a, b) => a.label.localeCompare(b.label, dateLocale[locale]));
  return (
    <div className="view">
      <PageHeader
        eyebrow={
          <Crumbs>
            <Link href={href("hobbies", locale)}>{t(locale, "nav.outdoors")}</Link> / {t(locale, "at.crumb")}
          </Crumbs>
        }
        title={t(locale, "at.h1")}
        lede={t(locale, "at.lede")}
      >
        <TrailStats locale={locale} />
      </PageHeader>
      <Container>
        <TrailLog
          rows={rows}
          countries={countries}
          labels={{
            activity: t(locale, "filter.activity"),
            all: t(locale, "filter.all"),
            hike: t(locale, "filter.hike"),
            bike: t(locale, "filter.bike"),
            country: t(locale, "at.country"),
            allCountries: t(locale, "at.allcountries"),
            sort: t(locale, "at.sort"),
            sorts: { views: t(locale, "at.s.views"), recent: t(locale, "at.s.recent"), long: t(locale, "at.s.long"), climb: t(locale, "at.s.climb") },
            search: t(locale, "at.search"),
            searchPlaceholder: t(locale, "at.search.ph"),
            count: t(locale, "count.trails"),
            none: t(locale, "count.none"),
            columns: ["", t(locale, "at.col.trail"), t(locale, "at.col.elev"), t(locale, "trail.dist"), t(locale, "trail.gain"), t(locale, "at.col.diff"), t(locale, "at.col.date"), t(locale, "trail.views")],
          }}
          note={
            <a href={site.links.wikiloc}>
              {t(locale, "at.wikiloc")} <Arrow />
            </a>
          }
        />
      </Container>
    </div>
  );
}
