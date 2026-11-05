import { Atkinson_Hyperlegible, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Archivo is only used for the "Rui Lebre" wordmark (header brand, home hero; `--f-name`), always
 * at `font-stretch:125%`. So instead of the whole latin variable font (~90 KB) we ship one instance
 * at wdth=125, wght 300–800, subset to the glyphs of the name (~2 KB). Regenerate it (pip install
 * fonttools brotli) from the Archivo variable font (Google Fonts, ofl/archivo/Archivo[wdth,wght].ttf):
 *
 *   fonttools varLib.instancer "Archivo[wdth,wght].ttf" wdth=125 wght=300:800 -o /tmp/archivo-125.ttf
 *   pyftsubset /tmp/archivo-125.ttf --text="RuiLebre " --layout-features=kern --flavor=woff2 \
 *     --output-file=src/fonts/archivo-name.woff2
 *
 * Any other text set in --f-name would fall back to Arial: add its letters to --text first.
 */
export const archivo = localFont({
  src: "../fonts/archivo-name.woff2",
  weight: "300 800",
  variable: "--font-archivo",
  display: "swap",
  adjustFontFallback: "Arial",
});
export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
/** Body text. Only the upright faces are preloaded: they are on every page. */
export const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-atkinson",
  display: "swap",
});
/**
 * Italics (publication venues, <em> in posts) are rare, so they are not preloaded: the browser
 * fetches them only on pages that render italic text. Turbopack names both calls' faces
 * "Atkinson Hyperlegible", so these faces join the body family (--f-body → --font-atkinson) and
 * <cite>/<em> get the true italic (tests/e2e/perf.spec.ts checks it). If the build ever moves to
 * webpack, which hashes family names per call, italic body text must use --font-atkinson-italic.
 */
export const atkinsonItalic = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"],
  variable: "--font-atkinson-italic",
  display: "swap",
  preload: false,
});
export const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const fontVars = [archivo.variable, bricolage.variable, atkinson.variable, atkinsonItalic.variable, plexMono.variable].join(" ");
