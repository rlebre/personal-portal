import type { ComponentType } from "react";
import { Container } from "@/components/ui/Container";
import { GitHub, Instagram, LinkedIn, Orcid, Scholar, Wikiloc, type IconProps } from "@/components/ui/icons";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { CopyEmail } from "./CopyEmail";
import { LangSwitch } from "./LangSwitch";
import s from "./Footer.module.css";

type FooterLink = { href: string; label: string; Icon: ComponentType<IconProps> };

/** The contact section: link here with `#contact`. */
export const CONTACT_ID = "contact";

const elsewhere: FooterLink[] = [
  { href: site.links.github, label: "GitHub", Icon: GitHub },
  { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedIn },
  { href: site.links.wikiloc, label: "Wikiloc", Icon: Wikiloc },
  { href: site.links.instagram, label: "Instagram", Icon: Instagram },
];
const academic: FooterLink[] = [
  { href: site.links.orcid, label: "ORCID", Icon: Orcid },
  { href: site.links.scholar, label: "Google Scholar", Icon: Scholar },
];

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a href={href}>
            <Icon />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className={s.foot}>
      <Container className={s.grid}>
        <div>
          {/* tabIndex -1: a #contact link moves focus here, not just the scroll position. */}
          <h2 id={CONTACT_ID} tabIndex={-1}>
            {t(locale, "foot.h")}
          </h2>
          <p className={s.intro}>{t(locale, "foot.p")}</p>
          <CopyEmail email={site.email} label={t(locale, "foot.copy")} copied={t(locale, "foot.copied")} failed={t(locale, "foot.copyfail")} />
        </div>
        <div>
          <h2>{t(locale, "foot.elsewhere")}</h2>
          <LinkList links={elsewhere} />
        </div>
        <div>
          <h2>{t(locale, "foot.academic")}</h2>
          <LinkList links={academic} />
        </div>
      </Container>
      <Container>
        <div className={s.base}>
          <span className="mono">
            {site.coords} · Aveiro
          </span>
          <LangSwitch locale={locale} label={t(locale, "foot.lang")} currentLabel={t(locale, "foot.current")} />
          <span>{t(locale, "foot.made")}</span>
        </div>
      </Container>
    </footer>
  );
}
