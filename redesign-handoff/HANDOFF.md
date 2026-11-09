# Rui Lebre — Personal Portal: Implementation Handoff

You are implementing Rui Lebre's personal website in a **new, empty repository**. The design is final and approved. A clickable mock is the visual source of truth; this document is the spec.

- **Mock (source of truth):** `mock/rui-portal.html` — open it in a browser. Routes are hash-based in the mock (`#home`, `#research`, `#professional`, `#hobbies`, `#blog`, `#post-vale-glaciar`, anything else → 404). Toggle theme, EN/PT, filters and the lightbox to see every state.
- **Content data:** `data/*.json` (extracted from the mock; real data except blog posts).
- **Assets:** `assets/` plus original images in Rui's `personal-website-ai` repo (paths below).

When the mock and this doc disagree, ask Rui. Don't redesign; port.

---

## 1. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript**, React Server Components by default | Rui works with Next.js daily (Plex). Build as a **fully static site**: `output: 'export'` in `next.config.ts`, `generateStaticParams` for every locale/page/post. No middleware, rewrites or server-only features (they don't work with static export). |
| i18n | EN at the root (`app/(en)/…`) and PT under `app/pt/…` with **real localized folders** (`pt/investigacao`, `pt/profissional`, `pt/passatempos`, `pt/blog`), both rendering shared page components with a `locale` prop. Strings from `data/i18n.json` via a tiny typed `t(locale, key)` helper (next-intl acceptable if used without middleware). Root `/` serves EN directly; no redirect. | `generateMetadata` sets per-locale title, description and `alternates.languages` (hreflang). |
| Styling | Plain CSS with custom properties (port the mock's tokens to `app/globals.css`) + CSS Modules per component; Tailwind 4 optional if it reads the same tokens | Keep the token system as-is. |
| Theme | `next-themes` (`attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`) — gives the no-flash script; keep the toggle as `aria-pressed` button | Respect the three-state rule in §3. |
| Content | Blog as MDX files in `content/blog/*.mdx`, parsed with `gray-matter` + `next-mdx-remote/rsc` (or `@next/mdx`); frontmatter validated with `zod`. Publications, trails, routes, projects as typed JSON imports from `data/`. | |
| Interactivity | Small client components (`"use client"`) only where needed: theme toggle, language toggle, mobile menu, filters (publications/trails/blog), lightbox, hero canvas, scroll-drawn trail, reading progress. Everything else server-rendered. | No animation library required; Motion (framer) acceptable for page transitions. |
| Images | `next/image` with static imports (width/height known), `placeholder="blur"`, lazy below the fold. Static export has no image optimizer: set `images.unoptimized: true` and pre-encode AVIF/WebP at build (a `sharp` script), or use a custom loader for Cloudflare Images. | Re-encode the gallery JPEGs (wrong `.png` extension today). |
| Fonts | `next/font/google`: Archivo (wdth 112–125, wght 300/800), Bricolage Grotesque, Atkinson Hyperlegible, IBM Plex Mono — exposed as CSS variables | |
| SEO | `app/sitemap.ts`, `app/robots.ts`, RSS route handler `app/feed.xml/route.ts` with `export const dynamic = 'force-static'` (EN + PT feeds), OG images with `next/og` generated at build | All emitted as static files. |
| Hosting | **Cloudflare** — Workers static assets (or Pages) serving the `out/` folder; deploy with `wrangler deploy` / Pages Git integration, preview deployments per branch. Custom domain ruilebre.com on Cloudflare DNS; 301 from ruilebre.vercel.app once live. Use `_headers` for caching/security headers and `_redirects` for old URLs (e.g. `/academic`). | If server features are ever needed, switch to `@opennextjs/cloudflare`. |
| Tests | Vitest for helpers, Playwright + `@axe-core/playwright` for pages | See §9. |
| Package manager | pnpm | |

Suggested structure:

```
app/
  (en)/                   # EN at root: /, /research, /professional, /hobbies, /blog, /blog/[slug]
    layout.tsx            # html lang="en", header, footer, theme provider
    page.tsx  research/page.tsx  professional/page.tsx  hobbies/page.tsx  blog/page.tsx  blog/[slug]/page.tsx
  pt/                     # PT: /pt, /pt/investigacao, /pt/profissional, /pt/passatempos, /pt/blog, /pt/blog/[slug]
    layout.tsx            # html lang="pt-PT"
    page.tsx  investigacao/page.tsx  profissional/page.tsx  passatempos/page.tsx  blog/page.tsx  blog/[slug]/page.tsx
  global-not-found.tsx    # "Off the map" → exported 404.html (two root layouts: no app/layout.tsx;
                          #  enable experimental.globalNotFound, Next ≥15.4)
views/                    # shared page components: HomePage, ResearchPage, … taking { locale }
  globals.css             # tokens + base
  sitemap.ts  robots.ts  feed.xml/route.ts
components/               # Header, Footer, ThemeToggle, LangToggle, TopoHero (canvas), SectionCards,
                          # NowStrip, PostCard, AscentProfile, PublicationList, CvTimeline, ProjectCard,
                          # SideProjectCard, TrailCard (RouteMap + ElevationProfile), Gallery + Lightbox
content/blog/*.mdx
data/*.json               # from this handoff
lib/i18n.ts  lib/content.ts  lib/schemas.ts
public/images/…
```

## 2. Information architecture & routes

| Page | EN path | PT path | Nav label EN / PT |
|---|---|---|---|
| Home | `/` | `/pt/` | Home / Início |
| Research | `/research` | `/pt/investigacao` | Research / Investigação |
| Professional | `/professional` | `/pt/profissional` | Professional / Profissional |
| Hobbies | `/hobbies` | `/pt/passatempos` | Hobbies / Passatempos |
| Blog index | `/blog` | `/pt/blog` | Blog |
| Blog post | `/blog/[slug]` | `/pt/blog/[slug]` | — |
| 404 | "Off the map" / "Fora do mapa" | | |

- EN is default (no prefix). The footer language switch links to the equivalent page in the other locale. Use `<html lang="en">` / `lang="pt-PT"`, plus `hreflang` alternates.
- Route segments are localized in PT (e.g. `/pt/investigacao`) via real folders (see §1); keep a slug map in `lib/i18n.ts` so the EN/PT toggle and hreflang can find the counterpart page.
- All UI strings are in `data/i18n.json` (`en` / `pt` objects, same keys as the mock's `data-i18n` attributes). Publication titles stay English (mark with `lang="en"` on PT pages).
- Remove from old sites: Twitter/X link (Rui doesn't use it), the `ruilebre@ua.pt` email (use **ruiclebre@gmail.com**).

## 3. Design system

Concept: **a survey map sheet**. Plain backgrounds (no page pattern), procedural contour lines only in the home hero, career/research drawn as trails with diamond waypoints, map legend + scale bar + coordinates as details.

### Color tokens (copy exactly; all text pairs verified ≥ WCAG AA)

| Token | Light | Dark (slate gray-blue) | Use |
|---|---|---|---|
| `--paper` | `#FAFBF9` | `#1C232D` | page background |
| `--surface` | `#FFFFFF` | `#232C38` | cards |
| `--surface-2` | `#EDF0EC` | `#2C3644` | chips, panels, map bg |
| `--ink` | `#1D271F` | `#E8ECF1` | text |
| `--ink-2` | `#4E5A50` | `#AEB8C4` | muted text |
| `--line` | `#D9DDD5` | `#38434F` | borders |
| `--contour` / `--contour-index` | `#D8DDD4` / `#B5BEB0` | `#303B48` / `#465565` | hero contours, decorative |
| `--trail` (accent, dark green) | `#14503A` | `#4CAF80` | links, buttons, routes, waypoints |
| `--on-trail` | `#FFFFFF` | `#1C232D` | text on accent buttons |
| `--mark` | `#D9A400` | `#E8C14A` | summit marker only (decorative) |
| `--forest` (secondary, slate blue) | `#3F5F7A` | `#9DB8D3` | elevation profiles, journal badge |
| `--focus` | `#0B1F33` | `#F2C46D` | focus ring |

Theme: tokens on `:root`; dark under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and again under `:root[data-theme="dark"]`. Inline no-flash script in `<head>` reads `localStorage` (try/catch). Toggle button: fixed `aria-label="Dark mode"`, flips `aria-pressed`. Theme switch uses a View Transition circle reveal from the button (skip under reduced motion).

### Typography (Google Fonts, loaded with `next/font/google`)

- **Name / wordmark:** Archivo, `font-stretch:125%` (expanded), weights 300 ("Rui") + 800 ("Lebre"), `letter-spacing:.05em`. Hero size `clamp(2.6rem, 1.4rem + 5.4vw, 5.8rem)`. Header wordmark same face, 1.1rem.
- **Display / headings:** Bricolage Grotesque 500/700/800.
- **Body:** Atkinson Hyperlegible 400/700.
- **Mono (coordinates, km, dates, labels):** IBM Plex Mono 400/500, `tabular-nums`. Uppercase labels: `.74rem`, `letter-spacing:.12em`.
- Scale tokens `--s--1 … --s-3` as in the mock.

### Layout & components

- Max width 1180px, side gutter `max(16px, env(safe-area-inset-*))` (32px ≥720px). Sticky translucent header (64px).
- Radius 6px on cards only; pills fully rounded. Card hover: lift 2–3px, border → `--trail`, soft shadow.
- Monogram: "R" inside two thin contour rings with one accent arc (inline SVG; also the favicon).

## 4. Pages (match the mock section-for-section)

**Header:** monogram + "Rui **Lebre**" wordmark · nav (aria-current on active, dashed animated underline) · theme button · mobile menu button (<860px, disclosure pattern). No language control in the header.

**Home**
1. Hero: coordinates label `40°38′N 8°39′W · Aveiro, Portugal`; name; role line "Senior Software Engineer at Plex · PhD in ICT"; intro paragraph; CTAs "See my work" (primary) / "Read the blog". Background `<canvas>` of animated contour lines (marching squares over Perlin noise + gaussian hills, 16 levels, every 4th thicker, ~11 fps redraw), a dashed accent trail to a ▲ summit labelled "1527 m". Map legend box (Research 2015–2022 / Professional 2016–now / Hobbies 101 trails, scale bar). **Pause animation** button (WCAG 2.2.2), remembered in localStorage; animation pauses offscreen/hidden tab and is static under reduced motion.
2. Three section cards (no visible section title — keep an sr-only `<h2>`): symbol (△ ◆ ▲), stat pill, title, one line, "Follow the path →" etc. A single thin contour line along each card bottom; dashed connector between cards on desktop.
3. "Now" strip, 3 columns: Working · Moving · Weekends (no "Learning").
4. Latest posts: 3 columns, generous column gap `clamp(32px,4vw,56px)`.

**Research**
1. Header + stats line (20 publications · 5 journal · 14 conference · 1 thesis).
2. "The ascent": SVG elevation-style profile, x = years 2011–2022, waypoints BSc, MSc, IEETA, Dicoogle, PhD (summit, `--mark`). Below it a 5-column milestone list (real `<ol>`; the SVG is decorative). Dates: BSc 2011–2015 · MSc 2015–2017 · Junior Researcher IEETA 2016–2017 · **Researcher IEETA 2017–2022** (alongside the PhD from 2018) · PhD 2018–2022 Universidade da Coruña.
3. Thesis card (dark ink panel): "Profile-based sharing of medical imaging data", PhD in ICT, Universidade da Coruña, 2022. Button "Read the thesis" → **needs URL from Rui**.
4. Themes chips. 5. Publications from `data/publications.json`: filter chips by type (`aria-pressed`) + year select, live result count (`role="status"`), grouped by year (`<h3>` year, `<ol>`), Rui's name bold, type badge, venue `<cite>`. **Add DOI links** (not in the data yet — fetch from ORCID 0000-0002-3230-0732 or ask Rui).

**Professional**
1. Header, "Download CV (PDF)" (**needs the PDF**) + LinkedIn.
2. Experience timeline: vertical dashed trail line that draws with scroll progress; diamond waypoints (filled = current). Entries:
   - **Plex — Senior Software Engineer**, Jun 2022 – now, Remote. Step pills "Jun 2022 · Software Engineer", "Aug 2025 · Senior". Six bullets with bold leads (Website, Smart TV & consoles, Mobile & TV, BFF, Shipping, Team) — text in `i18n.json` keys `cv.plex.1h…6`.
   - IEETA, Universidade de Aveiro — Researcher, **Sep 2017 – May 2022** (Dicoogle; alongside PhD from 2018).
   - BMD Software — **Intern / Student**, Oct 2016 – Jul 2017.
   - IEETA · UA.PT Bioinformatics — Junior Researcher, Mar 2016 – Sep 2017.
   - Universidade de Aveiro — Collaborator, Oct 2015 – Aug 2017.
3. Projects (2 columns): Dicoogle (lens icon), dicoogle-ipfs-storage, WSI DICOM viewer, Dicoogle website — `data/projects.json`; line-icon glyphs in the mock (`GLYPH`).
4. **Side projects** (2×2, `data/sideProjects.json`): card = left column (tinted `--surface-2`) with **title on top and a landscape 16:10 screenshot** framed like a browser window below it; right column with stack label, badge, description, link. Order: +Pinhal, Lost Heritage, LightLex, TicTacToe. Stacks on mobile: title → image → text.
5. Skills: Domains / Technologies / Languages chips (values in the mock).

**Hobbies**
1. Header + stats (101 trails on Wikiloc · recording since 2017).
2. Most-viewed trails (3 columns): each card has a **route map** on top — real GPS route path (`data/routes.json`, pre-projected into a 300×188 viewBox) on a light grid, start dot, end square for one-way routes, scale bar (`k` = km per 100 px), "N ↑", rank badge; route stroke draws on page enter. Then activity · type, views, title, region, Distance/Gain/High point, **real elevation profile** (`routes.json` `prof`, 61 samples in metres) with peak marker, difficulty badge (text + 1–3 peak icons, never colour alone), date, "View on Wikiloc". Activity filter (All / Hiking / Cycling). Wikiloc profile: https://www.wikiloc.com/wikiloc/user.do?id=3581003
3. "Through the lens" gallery: CSS-columns masonry of Rui's 12 photos, buttons opening a `<dialog>` lightbox (prev/next, arrow keys, Esc, counter, caption = alt text from `data/photoAlt.json`, focus returns to thumbnail).

**Blog**
- Index: topic chips + language chips (EN/PT), count, list rows (date, read time, title, excerpt, lang badge, tags).
- Post: breadcrumb, title, meta, 680px prose column, sticky TOC (desktop), dashed reading-progress bar under the header, author card (avatar = cartoon `personal-website-ai/public/avatar.png`).
- **The 3 posts in `posts.json` are samples** — replace with real MDX. Frontmatter: `title, date, updated?, lang ('en'|'pt'), tags[], summary, cover?, draft`. Compute reading time. Add RSS (route handler) and sitemap.

**Footer:** "Say hello" + email `ruiclebre@gmail.com` as selectable text with Copy button (mailto as convenience) · Elsewhere: GitHub (rlebre), LinkedIn (rui-lebre-435279101), Wikiloc, Instagram (ruilebre) · Academic: ORCID, Google Scholar (WtJeCMMAAAAJ) · base line with coordinates and "Coffee-free coding", and the **language switch**: a labelled group "Language / Língua" with two links styled as chips, "English" and "Português" (each with its own `lang`, current one `aria-current="true"`), linking to the counterpart page in the other locale.

## 5. Assets

| Asset | Source |
|---|---|
| 12 gallery photos | `personal-website-ai/public/images/hobbies/1.png … 12.png` — actually JPEGs (wrong extension); re-encode to AVIF/WebP. Order matches `photoAlt.json`. |
| Side-project screenshots | `personal-website-ai/public/images/portfolio/lost-heritage.png`, `lightningjs-tictactoe.png`; `assets/maispinhal-screenshot.webp` (re-capture at 2× for production). LightLex: keep the drawn TV-grid placeholder until a face-free screenshot exists (current one shows real actors). |
| Avatar | `personal-website-ai/public/avatar.png` |
| Logo / favicon | Recreate the "R" contour monogram as SVG (see mock header). |

## 6. Motion (all disabled under `prefers-reduced-motion: reduce`)

1. Hero contour drift (canvas, pausable). 2. Page enter: children rise 14px + fade, 60ms stagger. 3. Route paths and elevation lines draw on enter (`pathLength=1` + dashoffset). 4. Research ascent line draws on enter. 5. Experience trail draws with scroll (min 35% visible). 6. Card hover lift / contour line nudge. 7. Nav dashed underline grows. 8. Theme circle reveal (View Transitions). 9. Cross-page transitions: React `<ViewTransition>` / `experimental.viewTransition` in Next 15, or a small Motion fade keyed on pathname; after navigation move focus to the page `<h1>` and announce the page title in a polite live region.
Content must be fully visible without JS and before any animation (never leave things at opacity 0 waiting on an observer).

## 7. Accessibility checklist

Skip link · one `<h1>` per page, logical headings · `aria-current="page"` · focus moves to `<h1>` after client-side navigation + polite announcement · visible `:focus-visible` ring (3px `--focus`) · targets ≥ 24px (44px for header controls) · decorative SVG/canvas `aria-hidden` · charts/maps `role="img"` with `<title>` · filter chips `aria-pressed` + live counts · lightbox native `<dialog>` · mobile menu `aria-expanded`/Escape · real alt text everywhere · `lang` on mixed-language content · contrast AA in both themes · no horizontal scroll at 320px · works at 200% zoom.

## 8. Open items for Rui

1. Thesis PDF / repository URL. 2. CV PDF. 3. DOIs for publications (and whether the 2022 *Expert Systems with Applications* paper got published). 4. Real blog posts. 5. LightLex face-free screenshot. 6. Real photos for trails? (currently route maps — fine as is). 7. Canonical domain — confirm ruilebre.com on Cloudflare (DNS access) and redirect from ruilebre.vercel.app.

## 9. Acceptance checks

- Visual parity with `mock/rui-portal.html` at 1280px and 390px, light and dark.
- `npx playwright test`: axe (wcag2a/aa, 21aa, 22aa) zero violations on every page × both themes × both locales; route change focuses `<h1>`; lightbox keyboard + focus return; filters update counts; EN↔PT toggle keeps the same page; no horizontal overflow at 320px.
- `pnpm build` produces a static `out/` with no server routes; deploys to Cloudflare and all routes (incl. `/pt/*`, `/feed.xml`, `/404`) resolve.
- Lighthouse ≥ 95 performance / 100 accessibility / 100 best practices / 100 SEO on Home.
- Per-page `<title>` ("Research · Rui Lebre"), meta description, OG image, `hreflang`, sitemap, RSS.
