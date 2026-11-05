import strings from "@/data/i18n.json";
import { interpolate, type Locale, type PageKey } from "./locale";

// Server-side entry point. Client components must import `@/lib/locale` instead: importing this
// module bundles the whole string table (both locales) into the client JS. Enforced by a unit test.
export * from "./locale";

export type StringKey = keyof (typeof strings)["en"];

/** Look up a UI string, falling back to English, with `{name}` interpolation. */
export function t(locale: Locale, key: StringKey, vars?: Record<string, string | number>): string {
  const table = strings[locale] as Partial<Record<StringKey, string>>;
  const s = table[key] ?? strings.en[key] ?? key;
  return vars ? interpolate(s, vars) : s;
}

export const navLabel: Record<PageKey, StringKey> = {
  home: "nav.home",
  research: "nav.research",
  professional: "nav.work",
  hobbies: "nav.outdoors",
  blog: "nav.blog",
};
