import { t } from "@/lib/i18n";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = t("en", "title.home");

export default function Image() {
  return ogImage({ eyebrow: t("en", "hero.role1"), title: t("en", "title.home") });
}
