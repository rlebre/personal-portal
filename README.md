# ruilebre.com

Rui Lebre's personal site: research, professional work, hobbies and a blog, in English (`/`) and Portuguese (`/pt`).
Fully static Next.js export served by Cloudflare Workers static assets.

The approved design and spec live in [`redesign-handoff/`](redesign-handoff/HANDOFF.md) (open `mock/rui-portal.html` in a browser).
The previous implementation is preserved at the `legacy-v1` tag.

## Develop

Uses [mise](https://mise.jdx.dev) for tooling: `mise install` gives Node 26 (latest LTS) and pnpm 10.

```sh
pnpm install
pnpm dev          # encodes images, then next dev
pnpm build        # static export to out/
pnpm preview      # serve out/ with wrangler (same asset handling as production)
pnpm deploy       # build + wrangler deploy
```

Checks:

```sh
pnpm lint && pnpm typecheck
pnpm test         # vitest: i18n, content, data, tokens, client-bundle boundary, ui primitives
pnpm test:e2e     # playwright + axe against the built site (run pnpm build first)
```

TypeScript: `tsc` is TypeScript 7 (`@typescript/native` alias); `typescript` is the TS 6 compatibility
package, because typescript-eslint does not support TS 7 yet.

## Layout

```
src/app/(en)/…            EN routes at the root
src/app/(pt)/pt/…         PT routes with localized segments (investigacao, profissional, passatempos, passatempos/trilhos)
src/app/global-not-found  "Off the map" 404 (two root layouts, so experimental.globalNotFound)
src/app/(pt)/pt/404       PT 404, exported as pt/404.html: Cloudflare serves the nearest 404.html, so /pt/* misses get it
src/views/                page components shared by both locales, taking { locale }: they only compose
src/components/ui/        presentational primitives (Button, Card, ChipGroup, PageHeader, …), see its README
src/components/layout/    Shell (<html>), header + mobile menu, footer (contact, language switch), theme toggle, skip link, route focus
src/components/<area>/    feature components per page area: home, research, professional, hobbies, blog
src/styles/               tokens.css (+ typed tokens.ts mirror) and base.css (reset, utilities, transitions)
src/data/*.json           UI strings (i18n.json), publications, featured trails + GPS routes, the full Wikiloc
                          log (allTrails.json, drives /hobbies/trails and the trail stats), projects
src/lib/                  locale.ts (routes, formatters; client-safe), i18n.ts (t(), server only),
                          content loader, zod schemas, metadata, RSS
content/blog/*.mdx        blog posts
assets/                   source images (photos, side-project shots, OpenTopoMap route backgrounds);
                          scripts/encode-images.mjs writes WebP to src/assets (gitignored)
public/trails/            pre-rendered map thumbnails and elevation sparklines for all trails (light-theme
                          rasters; dark mode inverts them through the --thumb/--prof tokens)
public/_headers, _redirects  Cloudflare caching/security headers and old-URL redirects
```

Styling: each component has a colocated CSS Module; global CSS is only `src/styles/`. Client components
receive resolved strings (and server-rendered items) as props and import `@/lib/locale`, never
`@/lib/i18n`, so the string table stays out of the browser bundle (a unit test enforces this).

## Writing a post

Add `content/blog/<slug>.mdx`:

```mdx
---
title: "Post title"
date: "2026-11-05"
lang: en            # en | pt
tags: [Engineering]
summary: "One or two sentences for cards, RSS and meta description."
draft: false
---

## A heading (goes into the table of contents)

<Photo n="10" caption="Optional caption" />
```

Reading time, the TOC, RSS (`/feed.xml`, `/pt/feed.xml`), sitemap and OG images are generated at build.
The three current posts are samples (`sample: true`, `draft: true`): delete them once real posts exist.

### Blog visibility

Drafts are listed in `pnpm dev` and left out of production builds. While no published post exists, the
blog hides itself: no "Blog" nav item, no "Latest posts" on the home page, `/blog` and `/pt/blog` say the
first posts are coming (`noindex`, not in the sitemap), and both feeds are valid but empty. Static export
needs at least one param per dynamic route, so the post routes then emit a single `/blog/_` placeholder
that renders the 404 page (`noindex`). Publishing the first non-draft post brings everything back on the
next build (`isBlogVisible` in `src/lib/content.ts`, covered by `tests/unit/seo.test.ts`).

SEO: a post is canonical at its own-language URL, which is also its only hreflang target (plus
`x-default`); the other locale's copy only points its canonical there. The sitemap lists canonical URLs
only, and RSS GUIDs are the canonical URL in both feeds.

## Open items

Tracked in `src/lib/site.ts` and the handoff §8: thesis URL, CV PDF, publication DOIs (`doi` field in
`publications.json`), real blog posts, and a 301 from ruilebre.vercel.app.

The LightLex screenshot is the real app with its TMDB poster art swapped for abstract tiles while
capturing (the live posters show actors' faces). The trail thumbnails are rasters from the handoff; the
spec prefers SVG generated from each trail's GPS track, which needs the tracks exported from Wikiloc.
