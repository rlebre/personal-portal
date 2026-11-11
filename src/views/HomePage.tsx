import Link from "next/link";
import { PostCard, PostCardGrid } from "@/components/blog/PostCard";
import { About } from "@/components/home/About";
import { Hero } from "@/components/home/Hero";
import { Sheet } from "@/components/home/Sheet";
import { NowStrip } from "@/components/home/NowStrip";
import { Trailheads } from "@/components/home/Trailheads";
import { Arrow } from "@/components/ui/Arrow";
import { Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPosts, isBlogVisible } from "@/lib/content";
import { pubStats, trails } from "@/lib/data";
import { href, t, type Locale, type StringKey } from "@/lib/i18n";

type Trailhead = { page: "research" | "professional" | "hobbies"; sym: string; title: StringKey; body: StringKey; points?: StringKey[]; go: StringKey; ripple: string };

/** Card order = legend order: what Rui does now first. */
const sections: Trailhead[] = [
  { page: "professional", sym: "◆", title: "nav.work", body: "th.work", points: ["th.work.1", "th.work.2", "th.work.3"], go: "th.go.work", ripple: "M0 24 C 40 40, 70 6, 110 20 S 170 36, 200 14" },
  { page: "research", sym: "△", title: "nav.research", body: "th.research", go: "th.go.research", ripple: "M0 30 C 30 10, 60 40, 90 22 S 150 8, 200 26" },
  { page: "hobbies", sym: "▲", title: "nav.outdoors", body: "th.outdoors", go: "th.go.outdoors", ripple: "M0 34 C 25 20, 55 30, 85 12 S 150 30, 200 8" },
];

export function HomePage({ locale }: { locale: Locale }) {
  const posts = getPosts();
  const legendValue = { research: "2015–2022", professional: <>2016–{t(locale, "now")}</>, hobbies: t(locale, "legend.trails") };
  const pill = {
    research: `${pubStats.total} ${t(locale, "pill.papers")}`,
    professional: t(locale, "pill.since"),
    hobbies: t(locale, "legend.trails"),
  };
  return (
    <div className="view">
      <Hero locale={locale} legend={sections.map((c) => ({ sym: c.sym, href: href(c.page, locale), label: t(locale, c.title), value: legendValue[c.page] }))} />

      <Sheet>
        <Section>
          <h2 className="sr-only">{t(locale, "home.trailheads")}</h2>
          <Trailheads
            items={sections.map((c) => ({
              href: href(c.page, locale),
              sym: c.sym,
              pill: pill[c.page],
              title: t(locale, c.title),
              body: t(locale, c.body),
              points: c.points?.map((k) => t(locale, k)),
              go: t(locale, c.go),
              ripple: c.ripple,
            }))}
          />
        </Section>

        <About
          eyebrow={t(locale, "about.eyebrow")}
          title={t(locale, "about.h")}
          paragraphs={[t(locale, "about.p1"), t(locale, "about.p2")]}
          factsTitle={t(locale, "about.facts")}
          facts={[
            { term: t(locale, "fact.base"), value: "Aveiro, Portugal" },
            { term: t(locale, "fact.top2"), value: t(locale, "fact.top2.v") },
            { term: t(locale, "fact.learn"), value: t(locale, "fact.learn.v") },
            { term: t(locale, "fact.shoot"), value: t(locale, "fact.shoot.v") },
            { term: t(locale, "fact.trails"), value: t(locale, "fact.trails.v") },
            { term: t(locale, "fact.top"), value: <Link href={href("hobbies", locale)}>{trails[0].n}</Link> },
          ]}
        />

        <Section flush="top">
          <h2 className="sr-only">{t(locale, "home.now")}</h2>
          <NowStrip
            items={(["work", "move", "weekend"] as const).map((k) => ({
              label: t(locale, `now.${k}`),
              value: t(locale, `now.${k}.v`),
              detail: t(locale, `now.${k}.d`),
            }))}
          />
        </Section>

        {isBlogVisible(posts) && (
          <Section>
            <SectionHeader title={t(locale, "home.latest")}>
              <Link href={href("blog", locale)}>
                {t(locale, "home.allposts")} <Arrow />
              </Link>
            </SectionHeader>
            <PostCardGrid>
              {posts.slice(0, 3).map((p) => (
                <PostCard key={p.slug} post={p} locale={locale} />
              ))}
            </PostCardGrid>
          </Section>
        )}
      </Sheet>
    </div>
  );
}
