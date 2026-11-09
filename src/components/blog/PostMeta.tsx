import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/lib/content";
import { formatDate, t, type Locale } from "@/lib/i18n";

/** Date · language badge · reading time · sample marker. Children of a <Meta> row. */
export function PostMeta({ post, locale }: { post: Post; locale: Locale }) {
  return (
    <>
      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      <Badge variant="outline">{post.lang.toUpperCase()}</Badge>
      <span>
        {post.minutes} {t(locale, "read")}
      </span>
      {post.sample && <Badge variant="dashed">{t(locale, "sample")}</Badge>}
    </>
  );
}
