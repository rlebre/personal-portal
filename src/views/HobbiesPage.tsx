import { Gallery } from "@/components/hobbies/Gallery";
import { TrailCard } from "@/components/hobbies/TrailCard";
import { TrailList } from "@/components/hobbies/TrailList";
import { TrailMoreCard } from "@/components/hobbies/TrailMoreCard";
import { Arrow } from "@/components/ui/Arrow";
import { Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatList } from "@/components/ui/Stat";
import { FEATURED_TRAILS, photoAlt, routeFor, trailStats, trails } from "@/lib/data";
import { photos } from "@/lib/images";
import { formatNumber, href, t, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function HobbiesPage({ locale }: { locale: Locale }) {
  return (
    <div className="view">
      <PageHeader eyebrow={<Eyebrow symbol="▲">{t(locale, "out.eyebrow")}</Eyebrow>} title={t(locale, "nav.outdoors")} lede={t(locale, "out.lede")}>
        <TrailStats locale={locale} />
      </PageHeader>

      <Section flush="top">
        <SectionHeader title={t(locale, "out.trails")}>
          <a href={site.links.wikiloc}>
            {t(locale, "out.wikiloc")} <Arrow />
          </a>
        </SectionHeader>
        <TrailList
          items={trails.slice(0, FEATURED_TRAILS).map((trail, i) => ({
            key: trail.u,
            act: trail.act,
            card: <TrailCard trail={trail} route={routeFor(trail.u)} rank={i + 1} locale={locale} />,
          }))}
          labels={{
            activity: t(locale, "filter.activity"),
            all: t(locale, "filter.all"),
            hike: t(locale, "filter.hike"),
            bike: t(locale, "filter.bike"),
            count: t(locale, "count.trails"),
          }}
          after={
            <TrailMoreCard
              href={href("trails", locale)}
              more={trailStats.count - FEATURED_TRAILS}
              kicker={t(locale, "more.kicker")}
              title={t(locale, "more.title", { n: trailStats.count })}
              text={t(locale, "more.text", { km: formatNumber(trailStats.km, locale) })}
              cta={t(locale, "more.cta")}
            />
          }
        />
      </Section>

      <Section>
        <SectionHeader title={t(locale, "out.lens")}>
          <a href={site.links.instagram}>Instagram @ruilebre</a>
        </SectionHeader>
        <Gallery
          photos={photos}
          alts={photoAlt[locale]}
          labels={{ close: t(locale, "lb.close"), prev: t(locale, "lb.prev"), next: t(locale, "lb.next"), of: t(locale, "lb.of") }}
        />
      </Section>
    </div>
  );
}

/** 101 trails · 1,255 km recorded · 46,570 m climbed · 7 countries: totals over the whole Wikiloc log. */
export function TrailStats({ locale }: { locale: Locale }) {
  return (
    <StatList
      items={[
        { value: formatNumber(trailStats.count, locale), label: t(locale, "at.trails") },
        { value: formatNumber(trailStats.km, locale), label: t(locale, "at.km") },
        { value: formatNumber(trailStats.gain, locale), label: t(locale, "at.gain") },
        { value: trailStats.countries, label: t(locale, "at.countries") },
      ]}
    />
  );
}
