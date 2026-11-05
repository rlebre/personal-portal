import { t } from "@/lib/i18n";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = t("en", "title.hobbies");

export default function Image() {
  return ogImage({ eyebrow: t("en", "out.eyebrow"), title: t("en", "title.hobbies") });
}
