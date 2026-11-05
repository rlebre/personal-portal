import type { Metadata, MetadataRoute } from "next";
import { blogVisible, isBlogVisible, type Post } from "./content";
import { htmlLang, locales, navOrder, postHref, routes, t, type Locale, type PageKey, type StringKey } from "./i18n";
import { site } from "./site";

const titleKey: Record<PageKey, StringKey> = {
  home: "title.homeFull",
  research: "title.research",
  professional: "title.professional",
  hobbies: "title.hobbies",
  blog: "title.blog",
};
const descKey: Record<PageKey, StringKey> = {
  home: "meta.home",
  research: "research.lede",
  professional: "work.lede",
  hobbies: "out.lede",
  blog: "blog.lede",
};

export const ogLocale: Record<Locale, string> = { en: "en_GB", pt: "pt_PT" };

export function pageTitle(page: PageKey, locale: Locale) {
  return page === "home" ? t(locale, "title.homeFull") : `${t(locale, titleKey[page])} · ${site.name}`;
}

/** Pages that are indexed and listed in the sitemap: the blog only once it has a post. */
export function indexablePages(blog: boolean): PageKey[] {
  return navOrder.filter((p) => p !== "blog" || blog);
}

/** hreflang map of a page: both locales plus x-default (English). */
export function pageAlternates(page: PageKey) {
  return { en: routes[page].en, "pt-PT": routes[page].pt, "x-default": routes[page].en };
}

export function pageMetadata(page: PageKey, locale: Locale, indexable = indexablePages(blogVisible()).includes(page)): Metadata {
  const title = pageTitle(page, locale);
  const description = t(locale, descKey[page]);
  return {
    title: { absolute: title },
    description,
    ...(indexable ? {} : { robots: { index: false } }),
    alternates: {
      canonical: routes[page][locale],
      languages: pageAlternates(page),
      types: { "application/rss+xml": locale === "pt" ? "/pt/feed.xml" : "/feed.xml" },
    },
    openGraph: { title, description, url: routes[page][locale], siteName: site.name, locale: ogLocale[locale], type: "website" },
  };
}

/**
 * Both locales render every post, but a post exists in one language only: its own-language URL
 * is canonical, and it is the only hreflang target (plus x-default). The other locale's copy
 * just points its canonical there and is never declared as an alternate.
 */
export function postAlternates(post: Pick<Post, "slug" | "lang">) {
  const canonical = postHref(post.slug, post.lang);
  return { canonical, languages: { [htmlLang[post.lang]]: canonical, "x-default": canonical } };
}

export function postMetadata(post: Post, locale: Locale): Metadata {
  const title = `${post.title} · ${site.name}`;
  return {
    title: { absolute: title },
    description: post.summary,
    alternates: postAlternates(post),
    openGraph: {
      title,
      description: post.summary,
      url: postHref(post.slug, locale),
      siteName: site.name,
      locale: ogLocale[post.lang],
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
  };
}

const abs = (path: string) => site.url + path;

/** Canonical URLs only: every indexable page in both locales, and each post once, in its own language. */
export function sitemapEntries(posts: Pick<Post, "slug" | "lang" | "date" | "updated">[]): MetadataRoute.Sitemap {
  const pages = indexablePages(isBlogVisible(posts)).flatMap((page) =>
    locales.map((locale) => ({
      url: abs(routes[page][locale]),
      alternates: { languages: Object.fromEntries(Object.entries(pageAlternates(page)).map(([k, v]) => [k, abs(v)])) },
    })),
  );
  const postEntries = posts.map((p) => ({ url: abs(postAlternates(p).canonical), lastModified: p.updated ?? p.date }));
  return [...pages, ...postEntries];
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
};
