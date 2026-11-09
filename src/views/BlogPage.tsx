import { BlogList } from "@/components/blog/BlogList";
import { PostRow } from "@/components/blog/PostRow";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Label";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPosts, isBlogVisible } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";

export function BlogPage({ locale }: { locale: Locale }) {
  const posts = getPosts();
  const header = <PageHeader eyebrow={<Eyebrow symbol="✎">{t(locale, "blog.eyebrow")}</Eyebrow>} title={t(locale, "nav.blog")} lede={t(locale, "blog.lede")} />;
  // No published posts yet: the page still exists (old links, feeds) but only says they're coming.
  if (!isBlogVisible(posts))
    return (
      <div className="view">
        {header}
        <Container>
          <Notice>{t(locale, "blog.soon")}</Notice>
        </Container>
      </div>
    );
  return (
    <div className="view">
      {header}
      <Container>
        {posts.some((p) => p.sample) && (
          <Notice>
            <Badge variant="dashed">{t(locale, "sample")}</Badge>
            <span>{t(locale, "blog.notice")}</span>
          </Notice>
        )}
        <BlogList
          items={posts.map((p) => ({ slug: p.slug, lang: p.lang, tags: p.tags, row: <PostRow post={p} locale={locale} /> }))}
          labels={{
            topic: t(locale, "filter.topic"),
            language: t(locale, "filter.lang"),
            allTopics: t(locale, "filter.alltopics"),
            allLanguages: t(locale, "filter.alllangs"),
            count: t(locale, "count.posts"),
            none: t(locale, "count.none"),
          }}
        />
      </Container>
    </div>
  );
}
