import type { Metadata } from "next";
import { t } from "@/lib/i18n";
import { NotFoundPage } from "@/views/NotFoundPage";

export const metadata: Metadata = { title: `${t("pt", "title.lost")} · Rui Lebre`, robots: { index: false } };

/**
 * Exported as out/pt/404.html. Cloudflare's `not_found_handling: "404-page"` serves the nearest
 * 404.html, so unknown URLs under /pt get this Portuguese page (with a 404 status) instead of the
 * English global one.
 */
export default function Page() {
  return <NotFoundPage locale="pt" />;
}
