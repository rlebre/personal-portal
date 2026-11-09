import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { href, t, type Locale } from "@/lib/i18n";

export function NotFoundPage({ locale }: { locale: Locale }) {
  return (
    <div className="view">
      <PageHeader fill eyebrow={<Eyebrow tabular>404 · 0°00′N 0°00′E</Eyebrow>} title={t(locale, "lost.h")} lede={t(locale, "lost.p")}>
        <p>
          <ButtonLink as={Link} variant="primary" href={href("home", locale)}>
            {t(locale, "lost.btn")}
          </ButtonLink>
        </p>
      </PageHeader>
    </div>
  );
}
