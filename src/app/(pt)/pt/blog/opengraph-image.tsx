import { t } from "@/lib/i18n";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = t("pt", "title.blog");

export default function Image() {
  return ogImage({ eyebrow: t("pt", "blog.eyebrow"), title: t("pt", "title.blog") });
}
