import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Meta } from "@/components/ui/Meta";
import type { Post } from "@/lib/content";
import { formatDate, htmlLang, postHref, t, type Locale } from "@/lib/i18n";
import { vtItem } from "@/lib/vt";
import s from "./PostRow.module.css";

/** One post in the blog index: date + reading time on the left, title, summary and tags on the right. */
export function PostRow({ post, locale }: { post: Post; locale: Locale }) {
  return (
    <li className={s.row} {...vtItem("post", post.slug)}>
      <Meta direction="column">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <span>
          {post.minutes} {t(locale, "read")}
        </span>
      </Meta>
      <div lang={htmlLang[post.lang]}>
        <h2>
          <Link href={postHref(post.slug, locale)}>{post.title}</Link>
        </h2>
        <p>{post.summary}</p>
        <div className={s.tags}>
          <Badge variant="outline">{post.lang.toUpperCase()}</Badge>
          {post.tags.map((x) => (
            <span key={x} lang="en">
              #{x.toLowerCase()}
            </span>
          ))}
          {post.sample && (
            <Badge variant="dashed" lang={htmlLang[locale]}>
              {t(locale, "sample")}
            </Badge>
          )}
        </div>
      </div>
    </li>
  );
}
