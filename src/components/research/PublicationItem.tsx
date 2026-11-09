import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { Publication } from "@/lib/schemas";
import s from "./Publications.module.css";

const ME = "Lebre R";
const TONE: Record<Publication["type"], BadgeTone> = { journal: "forest", conference: "neutral", chapter: "trail" };

/** One publication: title (linked to the DOI when known), authors with Rui in bold, type badge and venue. */
export function PublicationItem({ pub, typeLabel, labelLang }: { pub: Publication; typeLabel: string; labelLang: string }) {
  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : undefined;
  return (
    <article className={s.pub} lang="en">
      <h4>{doiUrl ? <a href={doiUrl}>{pub.ti}</a> : pub.ti}</h4>
      <p className={s.authors}>
        {pub.a.map((a, i) => (
          <span key={a}>
            {i > 0 && ", "}
            {a === ME ? <strong>{a}</strong> : a}
          </span>
        ))}
      </p>
      <p className={s.venue}>
        <Badge variant="label" tone={TONE[pub.type]} lang={labelLang}>
          {typeLabel}
        </Badge>
        <cite>{pub.v}</cite>
        <time dateTime={String(pub.y)} className="mono">
          {pub.y}
        </time>
        {doiUrl && (
          <a className={s.doi} href={doiUrl}>
            doi:{pub.doi}
          </a>
        )}
      </p>
    </article>
  );
}
