import { getPosts, type Post } from "./content";
import { htmlLang, postHref, routes, t, type Locale } from "./i18n";
import { postAlternates } from "./meta";
import { site } from "./site";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

type FeedPost = Pick<Post, "slug" | "lang" | "title" | "summary" | "date" | "tags">;

/**
 * RSS 2.0. Every post appears in both feeds, linked under that locale's blog; the GUID is the
 * post's canonical URL, so it is the same in both feeds (readers subscribed to both dedupe it).
 * With no posts the feed is still valid: a channel without items.
 */
export function rssXml(locale: Locale, posts: FeedPost[]): string {
  const self = `${site.url}${locale === "pt" ? "/pt" : ""}/feed.xml`;
  const items = posts
    .map((p) => {
      const url = site.url + postHref(p.slug, locale);
      const guid = site.url + postAlternates(p).canonical;
      return [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${guid}</guid>`,
        `      <pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate>`,
        `      <description>${esc(p.summary)}</description>`,
        ...p.tags.map((tag) => `      <category>${esc(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .map((s) => s + "\n")
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${t(locale, "title.blog")} · ${site.name}`)}</title>
    <link>${site.url}${routes.blog[locale]}</link>
    <description>${esc(t(locale, "blog.lede"))}</description>
    <language>${htmlLang[locale]}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items}  </channel>
</rss>
`;
}

export function rss(locale: Locale): Response {
  return new Response(rssXml(locale, getPosts()), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
