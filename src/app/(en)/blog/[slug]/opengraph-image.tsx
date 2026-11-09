import { getPost, getPosts, postStaticParams } from "@/lib/content";
import { t } from "@/lib/i18n";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Rui Lebre · Blog";

export function generateStaticParams() {
  return postStaticParams(getPosts());
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({ eyebrow: t("en", "blog.eyebrow"), title: post?.title ?? "Blog" });
}
