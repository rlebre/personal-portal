import type { Metadata } from "next";
import { t } from "@/lib/i18n";
import { NotFoundPage } from "@/views/NotFoundPage";

export const metadata: Metadata = { title: `${t("en", "title.lost")} · Rui Lebre`, robots: { index: false } };

/** notFound() inside the EN tree (e.g. the placeholder post route while there are no posts). */
export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
