/**
 * Locale primitives, the route map and formatters. Deliberately free of the string table
 * (data/i18n.json) so client components can import it without shipping every UI string.
 * Server code imports `@/lib/i18n`, which re-exports everything here plus `t()`.
 */

export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-PT" };
export const dateLocale: Record<Locale, string> = { en: "en-GB", pt: "pt-PT" };
/** Each language's own name (endonym), for the language switch. */
export const languageName: Record<Locale, string> = { en: "English", pt: "Português" };

export type PageKey = "home" | "research" | "professional" | "hobbies" | "trails" | "blog";

/** Localized path segments: the EN/PT toggle and hreflang use this map to find the counterpart page. */
export const routes: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", pt: "/pt" },
  research: { en: "/research", pt: "/pt/investigacao" },
  professional: { en: "/professional", pt: "/pt/profissional" },
  hobbies: { en: "/hobbies", pt: "/pt/passatempos" },
  trails: { en: "/hobbies/trails", pt: "/pt/passatempos/trilhos" },
  blog: { en: "/blog", pt: "/pt/blog" },
};

// Same order as the home page trailhead cards (Professional → Research → Hobbies).
export const navOrder: PageKey[] = ["home", "professional", "research", "hobbies", "blog"];
/** Every page, in nav order, with sub-pages after their parent (sitemap, language switch). */
export const pageOrder: PageKey[] = ["home", "professional", "research", "hobbies", "trails", "blog"];
/** Sub-pages and the nav item they sit under. */
export const navParent: Partial<Record<PageKey, PageKey>> = { trails: "hobbies" };

export function href(page: PageKey, locale: Locale): string {
  return routes[page][locale];
}

export function postHref(slug: string, locale: Locale): string {
  return `${routes.blog[locale]}/${slug}`;
}

export function otherLocale(l: Locale): Locale {
  return l === "en" ? "pt" : "en";
}

/** Find the equivalent path in the other locale (pages and blog posts). */
export function counterpart(pathname: string, locale: Locale): string {
  const clean = pathname.replace(/\/$/, "") || "/";
  const target = otherLocale(locale);
  for (const page of pageOrder) {
    if (routes[page][locale] === clean) return routes[page][target];
  }
  const blogPrefix = routes.blog[locale] + "/";
  if (clean.startsWith(blogPrefix)) return routes.blog[target] + "/" + clean.slice(blogPrefix.length);
  return routes.home[target];
}

/** `{name}` interpolation, shared by `t()` and by client components that receive raw templates. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  let s = template;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function formatNumber(n: number, locale: Locale): string {
  return n.toLocaleString(dateLocale[locale]);
}

/** Decimal with the locale's separator (26.5 → "26,5" in PT). */
export function formatDecimal(n: number, locale: Locale): string {
  return locale === "pt" ? String(n).replace(".", ",") : String(n);
}

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
};

/** "2017-09" → "Sep 2017" / "set 2017". */
export function formatMonth(ym: string, locale: Locale): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[locale][m - 1]} ${y}`;
}

/** "2026-09-12" → "12 Sep 2026" / "12 set 2026" (same month names as formatMonth; en-GB's Intl says "Sept"). */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[locale][m - 1]} ${y}`;
}
