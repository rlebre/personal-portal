import { CvBullets, CvItem, CvSteps } from "@/components/professional/CvItem";
import { CvTrail } from "@/components/professional/CvTrail";
import { ProjectCard, ProjectGrid, SideProjectCard, SideProjectGrid } from "@/components/professional/ProjectCard";
import { SkillGroups } from "@/components/professional/SkillGroups";
import { ButtonGroup, ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Container";
import { Download } from "@/components/ui/icons";
import { Eyebrow, Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToastButton } from "@/components/ui/Toast";
import { projects, sideProjects } from "@/lib/data";
import { formatMonth, t, type Locale, type StringKey } from "@/lib/i18n";
import type { SideProject } from "@/lib/schemas";
import { site } from "@/lib/site";

const plexBullets = [1, 2, 3, 4, 5, 6].map((n) => [`cv.plex.${n}h`, `cv.plex.${n}`] as [StringKey, StringKey]);

const pastRoles: { from: string; to: string; role: StringKey; org: string; d: StringKey }[] = [
  { from: "2017-09", to: "2022-05", role: "cv.res", org: "IEETA, Universidade de Aveiro", d: "cv.res.d" },
  { from: "2016-10", to: "2017-07", role: "cv.intern", org: "BMD Software", d: "cv.intern.d" },
  { from: "2016-03", to: "2017-09", role: "cv.jr", org: "IEETA · UA.PT Bioinformatics", d: "cv.jr.d" },
  { from: "2015-10", to: "2017-08", role: "cv.ua", org: "Universidade de Aveiro", d: "cv.ua.d" },
];

const skills = {
  domains: ["Medical imaging", "DICOM", "PACS", "Social features", "Server-driven UI", "Access control"],
  tech: ["TypeScript", "React", "Next.js", "React Native", "LightningJS", "GraphQL", "Cloudflare Workers", "Node.js", "Vitest", "Statsig", "Java", "Python", "SQL"],
  lang: ["lang.pt", "lang.en", "lang.de"] as StringKey[],
};

const BADGE: Record<NonNullable<SideProject["badge"]>, StringKey> = { Live: "live", "In the media": "media" };

export function ProfessionalPage({ locale }: { locale: Locale }) {
  const cvLabel = (
    <>
      <Download />
      <span>{t(locale, "work.cv")}</span>
    </>
  );
  return (
    <div className="view">
      <PageHeader eyebrow={<Eyebrow symbol="◆">{t(locale, "work.eyebrow")}</Eyebrow>} title={t(locale, "nav.work")} lede={t(locale, "work.lede")}>
        <ButtonGroup>
          {site.cvUrl ? (
            <ButtonLink variant="primary" href={site.cvUrl} download>
              {cvLabel}
            </ButtonLink>
          ) : (
            <ToastButton variant="primary" message={t(locale, "toast.cv")}>
              {cvLabel}
            </ToastButton>
          )}
          <ButtonLink href={site.links.linkedin}>LinkedIn</ButtonLink>
        </ButtonGroup>
      </PageHeader>

      <Section flush="top">
        <SectionHeader title={t(locale, "work.exp")}>
          <Label as="p">{t(locale, "work.exp.sub")}</Label>
        </SectionHeader>
        <CvTrail>
          <CvItem current when={<>{formatMonth("2022-06", locale)} – {t(locale, "now")}</>} title={t(locale, "cv.plex")} org="Plex" orgNote={t(locale, "remote")}>
            <CvSteps>
              <Pill>
                {formatMonth("2022-06", locale)} · <span lang="en">Software Engineer</span>
              </Pill>
              <Pill>
                {formatMonth("2025-08", locale)} · <span lang="en">Senior</span>
              </Pill>
            </CvSteps>
            <CvBullets items={plexBullets.map(([h, d]) => ({ title: t(locale, h), text: t(locale, d) }))} />
          </CvItem>
          {pastRoles.map((r) => (
            <CvItem key={r.role} when={<>{formatMonth(r.from, locale)} – {formatMonth(r.to, locale)}</>} title={t(locale, r.role)} org={r.org}>
              <p>{t(locale, r.d)}</p>
            </CvItem>
          ))}
        </CvTrail>
      </Section>

      <Section>
        <SectionHeader title={t(locale, "work.projects")}>
          <a href={site.links.github}>github.com/rlebre</a>
        </SectionHeader>
        <ProjectGrid>
          {projects.map((p) => (
            <ProjectCard key={p.n} project={p} />
          ))}
        </ProjectGrid>
      </Section>

      <Section>
        <SectionHeader title={t(locale, "out.side")} />
        <SideProjectGrid>
          {sideProjects.map((p) => (
            <SideProjectCard
              key={p.n}
              project={p}
              description={locale === "pt" ? p.d_pt : p.d}
              shotAlt={locale === "pt" ? p.shotAlt_pt : p.shotAlt}
              badge={p.badge && t(locale, BADGE[p.badge])}
            />
          ))}
        </SideProjectGrid>
      </Section>

      <Section>
        <SectionHeader title={t(locale, "work.skills")} />
        <SkillGroups
          groups={[
            { title: t(locale, "sk.domains"), items: skills.domains, lang: "en" },
            { title: t(locale, "sk.tech"), items: skills.tech, lang: "en" },
            { title: t(locale, "sk.lang"), items: skills.lang.map((k) => t(locale, k)) },
          ]}
        />
      </Section>
    </div>
  );
}
