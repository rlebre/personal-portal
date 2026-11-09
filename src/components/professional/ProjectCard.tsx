import Image from "next/image";
import type { ReactNode } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Card } from "@/components/ui/Card";
import { cx } from "@/components/ui/cx";
import { Label } from "@/components/ui/Label";
import { Pill } from "@/components/ui/Pill";
import { shots } from "@/lib/images";
import type { Project, SideProject } from "@/lib/schemas";
import s from "./ProjectCard.module.css";

const GLYPH: Record<Project["g"], ReactNode> = {
  lens: (<><circle cx="17" cy="17" r="11" /><circle cx="17" cy="17" r="6" strokeDasharray="2 3" /><path d="M25 25l10 10" strokeWidth="2.4" strokeLinecap="round" /><path d="M11.5 13a7 7 0 0 1 4-3.5" /></>),
  peak: <path d="M4 32l11-18 7 10 5-7 9 15z" />,
  nodes: (<><circle cx="10" cy="12" r="4" /><circle cx="30" cy="10" r="4" /><circle cx="20" cy="30" r="4" /><path d="M13 14l5 12M27 13l-5 13M14 12h12" /></>),
  grid: (<><rect x="6" y="6" width="28" height="28" rx="2" /><path d="M6 15h28M6 25h28M15 6v28M25 6v28" /></>),
  globe: (<><circle cx="20" cy="20" r="14" /><path d="M6 20h28M20 6c-6 8-6 20 0 28M20 6c6 8 6 20 0 28" /></>),
  house: (<><path d="M6 34V17l14-11 14 11v17z" /><path d="M16 34v-9h8v9" /><path d="M10 10l20 22" strokeDasharray="3 3" /></>),
  tv: (<><rect x="5" y="9" width="30" height="20" rx="2" /><path d="M14 34h12M17 4l3 5 3-5" /></>),
};

/** Open-source project: line glyph, name, description, tech tags and a GitHub link. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card as="article" interactive className={s.project}>
      <div className={s.ptop}>
        <svg className={s.glyph} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          {GLYPH[project.g]}
        </svg>
      </div>
      <h3>{project.n}</h3>
      <p lang="en">{project.d}</p>
      <div>
        <div className={s.tags}>
          {project.tags.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <a className={cx(s.more, s.spaced)} href={project.u}>
          GitHub<span className="sr-only">: {project.n}</span> <Arrow />
        </a>
      </div>
    </Card>
  );
}

export function ProjectGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

function linkLabel(u: string) {
  try {
    const host = new URL(u).hostname.replace(/^www\./, "");
    return host === "github.com" ? "GitHub" : host;
  } catch {
    return u;
  }
}

/**
 * Side project with a screenshot (or the drawn TV-grid placeholder), stack, optional badge,
 * description and a link labelled by its host. `badge` and `shotAlt` are already localized.
 */
export function SideProjectCard({ project, description, shotAlt, badge }: { project: SideProject; description: string; shotAlt?: string; badge?: string }) {
  return (
    <Card as="article" interactive className={cx(s.project, s.sp)}>
      <h3 className={s.title}>{project.n}</h3>
      {project.shot ? (
        <div className={s.shot}>
          <Image src={shots[project.shot]} alt={shotAlt ?? project.shotAlt ?? ""} placeholder="blur" sizes="(max-width: 620px) 100vw, 280px" />
        </div>
      ) : (
        // No face-free screenshot yet: a drawn TV grid stands in.
        <div className={s.shot} aria-hidden="true">
          <div className={s.tv}>
            <span className={s.tvHero} />
            <span className={s.tvRow}>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span>
            <span className={s.tvRow}>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span>
          </div>
        </div>
      )}
      <div className={s.body}>
        <div className={s.ptop}>
          <Label>{project.stack.join(" · ")}</Label>
          {badge && <Pill>{badge}</Pill>}
        </div>
        <p>{description}</p>
        <a className={s.more} href={project.u}>
          {linkLabel(project.u)}
          <span className="sr-only">: {project.n}</span> <Arrow />
        </a>
      </div>
    </Card>
  );
}

export function SideProjectGrid({ children }: { children: ReactNode }) {
  return <div className={s.sideGrid}>{children}</div>;
}
