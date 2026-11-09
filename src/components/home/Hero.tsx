import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonGroup, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Download } from "@/components/ui/icons";
import { Label } from "@/components/ui/Label";
import { ToastButton } from "@/components/ui/Toast";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ContactMenu } from "./ContactMenu";
import { TopoCanvas } from "./TopoCanvas";
import s from "./Hero.module.css";

export type LegendItem = { sym: string; href: string; label: string; value: ReactNode };

/** Home hero over the animated contour map: name, role, intro, CTAs and the map legend. */
export function Hero({ locale, legend }: { locale: Locale; legend: LegendItem[] }) {
  const cv = (
    <>
      <Download />
      <span>{t(locale, "hero.cta1")}</span>
    </>
  );
  return (
    // Runs its own entrance (Hero.module.css) instead of the page-enter rise: the name paints at once.
    <div className={s.hero} data-enter="self">
      <TopoCanvas pauseLabel={t(locale, "hero.pause")} playLabel={t(locale, "hero.play")}>
        <Container className={s.grid}>
          <div>
            <Label as="p" tabular className={s.coords}>
              {site.coords} · Aveiro, Portugal
            </Label>
            <h1>
              <span className={s.first}>Rui</span>
              <span className={s.last}>Lebre</span>
            </h1>
            <div className={s.who}>
              <p className={s.role}>
                <span>{t(locale, "hero.role1")}</span>
                <span className={s.sep} aria-hidden="true">
                  ·
                </span>
                <span className="sr-only">, </span>
                <span>{t(locale, "hero.role2")}</span>
              </p>
            </div>
            <p className={s.intro}>{t(locale, "hero.intro")}</p>
            <ButtonGroup className={s.ctas}>
              {site.cvUrl ? (
                <ButtonLink variant="primary" href={site.cvUrl} download>
                  {cv}
                </ButtonLink>
              ) : (
                <ToastButton variant="primary" message={t(locale, "toast.cv")}>
                  {cv}
                </ToastButton>
              )}
              <ContactMenu
                email={site.email}
                label={t(locale, "hero.cta2")}
                mailLabel={t(locale, "hero.mail")}
                copyLabel={t(locale, "hero.copy")}
                copied={t(locale, "foot.copied")}
                failed={t(locale, "foot.copyfail")}
              />
            </ButtonGroup>
          </div>
          <aside className={s.legend} aria-labelledby="legend-h">
            <Label as="p" id="legend-h">
              {t(locale, "legend.h")}
            </Label>
            <ul>
              {legend.map((it) => (
                <li key={it.href}>
                  <span className={s.sym} aria-hidden="true">
                    {it.sym}
                  </span>
                  <Link href={it.href}>{it.label}</Link>
                  <span className={s.v}>{it.value}</span>
                </li>
              ))}
            </ul>
            <div className={s.scalebar} aria-hidden="true">
              <i />
              <span>0 — 1 km</span>
            </div>
          </aside>
        </Container>
      </TopoCanvas>
    </div>
  );
}
