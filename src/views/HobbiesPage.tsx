import { Gallery } from "@/components/hobbies/Gallery";
import { TrailCard } from "@/components/hobbies/TrailCard";
import { TrailList } from "@/components/hobbies/TrailList";
import { Arrow } from "@/components/ui/Arrow";
import { Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatList } from "@/components/ui/Stat";
import { photoAlt, routeFor, trails } from "@/lib/data";
import { photos } from "@/lib/images";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function HobbiesPage({ locale }: { locale: Locale }) {
  return (
    <div className="view">
      <PageHeader eyebrow={<Eyebrow symbol="▲">{t(locale, "out.eyebrow")}</Eyebrow>} title={t(locale, "nav.outdoors")} lede={t(locale, "out.lede")}>
        <StatList
          items={[
            { value: 101, label: t(locale, "stat.trails") },
            { value: 2017, label: t(locale, "stat.since") },
          ]}
        />
      </PageHeader>

      <Section flush="top">
        <SectionHeader title={t(locale, "out.trails")}>
          <a href={site.links.wikiloc}>
            {t(locale, "out.wikiloc")} <Arrow />
          </a>
        </SectionHeader>
        <TrailList
          items={trails.map((trail, i) => ({
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
