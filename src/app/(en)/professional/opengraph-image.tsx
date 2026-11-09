import { t } from "@/lib/i18n";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = t("en", "title.professional");

export default function Image() {
  return ogImage({ eyebrow: t("en", "work.eyebrow"), title: t("en", "title.professional") });
}
