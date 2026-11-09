import { AscentProfile } from "@/components/research/AscentProfile";
import { Milestones } from "@/components/research/Milestones";
import { PublicationItem } from "@/components/research/PublicationItem";
import { PublicationList } from "@/components/research/PublicationList";
import { ThesisCard } from "@/components/research/ThesisCard";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, ChipList } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Container";
import { Label, Eyebrow } from "@/components/ui/Label";
import { Meta } from "@/components/ui/Meta";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatList } from "@/components/ui/Stat";
import { ToastButton } from "@/components/ui/Toast";
import { pubStats, publications } from "@/lib/data";
import { htmlLang, t, type Locale, type StringKey } from "@/lib/i18n";
import type { Publication } from "@/lib/schemas";
import { site } from "@/lib/site";

type Text = StringKey | { raw: string };
const milestones: { when: string; h: StringKey; d: Text; summit?: boolean }[] = [
  { when: "2011–2015", h: "ms.bsc", d: { raw: "Universidade de Aveiro" } },
  { when: "2015–2017", h: "ms.msc", d: "ms.msc.d" },
  { when: "2016–2017", h: "ms.jr", d: "ms.jr.d" },
  { when: "2017–2022", h: "ms.res", d: "ms.res.d" },
  { when: "2018–2022", h: "ms.phd", d: { raw: "Universidade da Coruña" }, summit: true },
];
const themes: Text[] = ["theme.1", { raw: "PACS" }, { raw: "DICOM" }, "theme.2", "theme.3", "theme.4", "theme.5", "theme.6"];
const text = (locale: Locale, s: Text) => (typeof s === "string" ? t(locale, s) : s.raw);

export function ResearchPage({ locale }: { locale: Locale }) {
  const typeLabel: Record<Publication["type"], string> = {
    journal: t(locale, "filter.journal"),
    conference: t(locale, "filter.conf"),
    chapter: t(locale, "filter.chapter"),
  };
  const thesisAction = site.thesisUrl ? (
    <ButtonLink variant="inverse" href={site.thesisUrl}>{t(locale, "thesis.btn")}</ButtonLink>
  ) : (
    <ToastButton variant="inverse" message={t(locale, "toast.thesis")}>{t(locale, "thesis.btn")}</ToastButton>
  );

  return (
    <div className="view">
      <PageHeader eyebrow={<Eyebrow symbol="△">{t(locale, "research.eyebrow")}</Eyebrow>} title={t(locale, "nav.research")} lede={t(locale, "research.lede")}>
        <StatList
          items={[
            { value: pubStats.total, label: t(locale, "stat.pubs") },
            { value: pubStats.journal, label: t(locale, "stat.journals") },
            { value: pubStats.conference, label: t(locale, "stat.conf") },
            { value: 1, label: t(locale, "stat.thesis") },
          ]}
        />
      </PageHeader>

      <Section flush="top">
        <SectionHeader title={t(locale, "research.path")}>
          <Label as="p">{t(locale, "research.path.sub")}</Label>
        </SectionHeader>
        <AscentProfile caption={t(locale, "research.path.cap")} label={t(locale, "research.path.chart")} />
        <Milestones items={milestones.map((m) => ({ when: m.when, title: t(locale, m.h), detail: text(locale, m.d), summit: m.summit }))} />
      </Section>

      <Section>
        <ThesisCard
          eyebrow={t(locale, "thesis.eyebrow")}
          title="Profile-based sharing of medical imaging data"
          titleLang="en"
          description={t(locale, "thesis.d")}
          action={thesisAction}
        />
      </Section>

      <Section>
        <SectionHeader title={t(locale, "research.themes")} />
        <ChipList>
          {themes.map((th) => (
            <Chip as="li" key={text("en", th)}>
              {text(locale, th)}
            </Chip>
          ))}
        </ChipList>
      </Section>

      <Section>
        <SectionHeader title={t(locale, "research.pubs")}>
          <Meta as="p">
            <a href={site.links.orcid}>ORCID</a>
            <a href={site.links.scholar}>Google Scholar</a>
          </Meta>
        </SectionHeader>
        <PublicationList
          items={publications.map((p) => ({
            key: p.ti,
            year: p.y,
            type: p.type,
            node: <PublicationItem pub={p} typeLabel={typeLabel[p.type]} labelLang={htmlLang[locale]} />,
          }))}
          labels={{
            type: t(locale, "filter.type"),
            all: t(locale, "filter.alltypes"),
            types: typeLabel,
            year: t(locale, "filter.year"),
            allYears: t(locale, "filter.allyears"),
            count: t(locale, "count.pubs"),
            none: t(locale, "count.none"),
          }}
        />
      </Section>
    </div>
  );
}
