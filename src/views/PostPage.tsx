import Link from "next/link";
import { Article, ArticleAuthor, ArticleCrumbs, ArticleLayout } from "@/components/blog/Article";
import { Mdx } from "@/components/blog/Mdx";
import { PostMeta } from "@/components/blog/PostMeta";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Meta } from "@/components/ui/Meta";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Post } from "@/lib/content";
import { avatar } from "@/lib/images";
import { href, htmlLang, t, type Locale } from "@/lib/i18n";

export function PostPage({ post, locale }: { post: Post; locale: Locale }) {
  const lang = htmlLang[post.lang];
  return (
    <div className="view">
      <ReadingProgress targetId="article" />
      <PageHeader
        spacing="tight"
        eyebrow={
          <ArticleCrumbs>
            <Link href={href("blog", locale)}>Blog</Link> / <span lang="en">{post.tags.join(", ")}</span>
          </ArticleCrumbs>
        }
        title={post.title}
        titleLang={lang}
      >
        <Meta>
          <PostMeta post={post} locale={locale} />
          {post.tags.length > 0 && <span lang="en">{post.tags.map((x) => `#${x.toLowerCase()}`).join(" ")}</span>}
        </Meta>
      </PageHeader>
      <ArticleLayout>
        <Article id="article" lang={lang}>
          <Mdx source={post.body} lang={post.lang} />
          <ArticleAuthor image={avatar} name="Rui Lebre" bio={t(locale, "author")} lang={htmlLang[locale]} />
        </Article>
        {post.headings.length > 0 && <TableOfContents title={t(locale, "toc")} headings={post.headings} lang={lang} />}
      </ArticleLayout>
    </div>
  );
}
