import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/Toast";
import { blogVisible } from "@/lib/content";
import { fontVars } from "@/lib/fonts";
import { htmlLang, navLabel, navOrder, t, type Locale, type PageKey } from "@/lib/i18n";
import { langScrollScript } from "@/lib/langScroll";
import { Footer } from "./Footer";
import { Header, type HeaderLabels } from "./Header";
import { RouteFocus } from "./RouteFocus";
import { SkipLink } from "./SkipLink";
import "@/styles/globals.css";

function headerLabels(locale: Locale): HeaderLabels {
  return {
    homeSuffix: t(locale, "a11y.homeSuffix"),
    nav: t(locale, "a11y.nav"),
    pages: Object.fromEntries(navOrder.map((p) => [p, t(locale, navLabel[p])])) as Record<PageKey, string>,
    menu: t(locale, "menu"),
    theme: t(locale, "themeLabel"),
  };
}

/** Nav items: the blog only once it has a published post (see isBlogVisible). */
function navPages(): PageKey[] {
  const blog = blogVisible();
  return navOrder.filter((p) => p !== "blog" || blog);
}

/** The <html> document shared by both root layouts (EN at /, PT under /pt) and the global 404. */
export function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={fontVars} data-scroll-behavior="smooth" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout owns <head> */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScrollScript }} />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="rl-theme" disableTransitionOnChange>
          <SkipLink label={t(locale, "skip")} />
          <RouteFocus />
          <Header locale={locale} labels={headerLabels(locale)} pages={navPages()} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
