import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { baseMetadata } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { NotFoundPage } from "@/views/NotFoundPage";

export const metadata: Metadata = {
  ...baseMetadata,
  title: `${t("en", "title.lost")} · Rui Lebre`,
  robots: { index: false },
};

// Static export emits this as 404.html. It is English: unknown URLs have no locale to go by.
export default function GlobalNotFound() {
  return (
    <Shell locale="en">
      <NotFoundPage locale="en" />
    </Shell>
  );
}
