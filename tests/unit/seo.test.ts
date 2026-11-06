import { describe, expect, it } from "vitest";
import { NO_POSTS_SLUG, getAllPosts, isBlogVisible, postStaticParams, visiblePosts } from "@/lib/content";
import { rssXml } from "@/lib/feed";
import { indexablePages, pageAlternates, postAlternates, sitemapEntries } from "@/lib/meta";
import { site } from "@/lib/site";

type Fixture = { slug: string; lang: "en" | "pt"; title: string; summary: string; date: string; updated?: string; tags: string[]; draft: boolean };

const enPost: Fixture = { slug: "first-light", lang: "en", title: "First light", summary: "S & more", date: "2026-11-01", tags: ["Outdoors"], draft: false };
const ptPost: Fixture = { slug: "primeira-luz", lang: "pt", title: "Primeira luz", summary: "Resumo", date: "2026-11-03", tags: ["Research"], draft: false };
const draft: Fixture = { slug: "wip", lang: "en", title: "WIP", summary: "x", date: "2026-11-04", tags: [], draft: true };

describe("blog visibility", () => {
  it("production builds drop drafts; dev keeps them; newest first", () => {
    expect(visiblePosts([enPost, draft, ptPost], false).map((p) => p.slug)).toEqual(["primeira-luz", "first-light"]);
    expect(visiblePosts([enPost, draft, ptPost], true).map((p) => p.slug)).toEqual(["wip", "primeira-luz", "first-light"]);
  });

  it("is hidden while every post is a draft and comes back with the first published post", () => {
    expect(isBlogVisible(visiblePosts([draft], false))).toBe(false);
    expect(isBlogVisible(visiblePosts([draft, enPost], false))).toBe(true);
    // Drafts are still listed (and so reachable) in `next dev`.
    expect(isBlogVisible(visiblePosts([draft], true))).toBe(true);
  });

  it("the sample posts in content/blog are drafts, so the production blog is hidden today", () => {
    const all = getAllPosts();
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((p) => p.draft)).toBe(true);
    expect(isBlogVisible(visiblePosts(all, false))).toBe(false);
  });

  it("post routes always have at least one static param (output: export requires it)", () => {
    expect(postStaticParams([])).toEqual([{ slug: NO_POSTS_SLUG }]);
    expect(postStaticParams([enPost, ptPost])).toEqual([{ slug: "first-light" }, { slug: "primeira-luz" }]);
  });

  it("the blog page is indexable only when visible", () => {
    expect(indexablePages(false)).not.toContain("blog");
    expect(indexablePages(true)).toContain("blog");
  });
});

describe("post alternates", () => {
  it("canonical is the post's own-language URL and the only hreflang target, plus x-default", () => {
    expect(postAlternates(enPost)).toEqual({ canonical: "/blog/first-light", languages: { en: "/blog/first-light", "x-default": "/blog/first-light" } });
    expect(postAlternates(ptPost)).toEqual({ canonical: "/pt/blog/primeira-luz", languages: { "pt-PT": "/pt/blog/primeira-luz", "x-default": "/pt/blog/primeira-luz" } });
  });

  it("canonical is always one of the hreflang targets", () => {
    for (const p of [enPost, ptPost]) {
      const a = postAlternates(p);
      expect(Object.values(a.languages)).toContain(a.canonical);
    }
  });

  it("pages declare both locales and x-default", () => {
    expect(pageAlternates("research")).toEqual({ en: "/research", "pt-PT": "/pt/investigacao", "x-default": "/research" });
  });
});

describe("sitemap", () => {
  it("lists only canonical URLs: posts once, in their own language", () => {
    const urls = sitemapEntries([enPost, ptPost]).map((e) => e.url.replace(site.url, ""));
    expect(urls).toContain("/blog/first-light");
    expect(urls).toContain("/pt/blog/primeira-luz");
    expect(urls).not.toContain("/pt/blog/first-light");
    expect(urls).not.toContain("/blog/primeira-luz");
    expect(urls).toContain("/blog");
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("leaves the blog out while there are no posts", () => {
    const urls = sitemapEntries([]).map((e) => e.url.replace(site.url, ""));
    expect(urls).toEqual(["/", "/pt", "/professional", "/pt/profissional", "/research", "/pt/investigacao", "/hobbies", "/pt/passatempos"]);
  });

  it("page entries carry absolute hreflang alternates including x-default", () => {
    const home = sitemapEntries([]).find((e) => e.url === site.url + "/")!;
    expect(home.alternates?.languages).toEqual({ en: site.url + "/", "pt-PT": site.url + "/pt", "x-default": site.url + "/" });
  });
});

describe("RSS", () => {
  it("is a valid empty channel when there are no posts", () => {
    const xml = rssXml("en", []);
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
    expect(xml).toMatch(/<\/channel>\n<\/rss>\n$/);
  });

  it("uses the same GUID (the canonical URL) for a post in both feeds, and links it under each locale", () => {
    const guid = (xml: string) => [...xml.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/g)].map((m) => m[1]);
    const en = rssXml("en", [enPost, ptPost]);
    const pt = rssXml("pt", [enPost, ptPost]);
    expect(guid(en)).toEqual(guid(pt));
    expect(guid(en)).toEqual([`${site.url}/blog/first-light`, `${site.url}/pt/blog/primeira-luz`]);
    expect(pt).toContain(`<link>${site.url}/pt/blog/first-light</link>`);
    expect(en).toContain("<description>S &amp; more</description>");
    expect(pt).toContain("<language>pt-PT</language>");
  });
});
