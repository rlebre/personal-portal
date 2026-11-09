import Link from "next/link";
import type { ReactNode } from "react";
import { Meta } from "@/components/ui/Meta";
import type { Post } from "@/lib/content";
import { htmlLang, postHref, type Locale } from "@/lib/i18n";
import { PostMeta } from "./PostMeta";
import s from "./PostCard.module.css";

/** Latest-post teaser: a ruled card linking to the post (home page). */
export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const lang = htmlLang[post.lang];
  return (
    <Link className={s.card} href={postHref(post.slug, locale)}>
      <Meta>
        <PostMeta post={post} locale={locale} />
      </Meta>
      <h3 lang={lang}>{post.title}</h3>
      <p lang={lang}>{post.summary}</p>
    </Link>
  );
}

/** Three-up grid of PostCards (one column below 860px). */
export function PostCardGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}
