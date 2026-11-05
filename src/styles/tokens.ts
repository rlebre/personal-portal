/**
 * Design tokens as a typed object: the same values as tokens.css, for places that cannot read
 * CSS custom properties (OG images, canvas defaults, a future token pipeline / design-system package).
 *
 * tokens.css stays the source the site renders from. tests/unit/tokens.test.ts parses it and fails
 * if this file drifts, so edit both together.
 */

const light = {
  paper: "#FAFBF9",
  surface: "#FFFFFF",
  "surface-2": "#EDF0EC",
  ink: "#1D271F",
  "ink-2": "#4E5A50",
  line: "#D9DDD5",
  contour: "#D8DDD4",
  "contour-index": "#B5BEB0",
  trail: "#14503A",
  "on-trail": "#FFFFFF",
  mark: "#D9A400",
  forest: "#3F5F7A",
  focus: "#0B1F33",
  shadow: "0 1px 0 rgba(29,39,31,.06),0 8px 24px -12px rgba(29,39,31,.25)",
  grid: "rgba(29,39,31,.05)",
} as const;

export type ColorToken = keyof typeof light;

const dark: Record<ColorToken, string> = {
  paper: "#1C232D",
  surface: "#232C38",
  "surface-2": "#2C3644",
  ink: "#E8ECF1",
  "ink-2": "#AEB8C4",
  line: "#38434F",
  contour: "#303B48",
  "contour-index": "#465565",
  trail: "#4CAF80",
  "on-trail": "#1C232D",
  mark: "#E8C14A",
  forest: "#9DB8D3",
  focus: "#F2C46D",
  shadow: "0 1px 0 rgba(0,0,0,.3),0 10px 28px -14px rgba(0,0,0,.7)",
  grid: "rgba(230,234,221,.035)",
};

export const tokens = {
  color: { light, dark },
  font: {
    display: 'var(--font-bricolage),"Avenir Next","Segoe UI",system-ui,sans-serif',
    body: 'var(--font-atkinson),"Segoe UI",system-ui,-apple-system,sans-serif',
    name: 'var(--font-archivo),"Helvetica Neue",Arial,sans-serif',
    mono: 'var(--font-plex-mono),ui-monospace,"SF Mono",Menlo,Consolas,monospace',
  },
  /** Fluid type scale: --s--1 … --s-3, plus the (currently unused) hero size. */
  size: {
    "-1": "clamp(.8rem,.77rem + .12vw,.86rem)",
    "0": "clamp(.94rem,.91rem + .15vw,1rem)",
    "1": "clamp(1.1rem,1.02rem + .4vw,1.3rem)",
    "2": "clamp(1.4rem,1.2rem + .9vw,1.85rem)",
    "3": "clamp(1.9rem,1.5rem + 2vw,2.9rem)",
    hero: "clamp(3rem,1.8rem + 6vw,6.6rem)",
  },
  ease: { out: "cubic-bezier(.22,1,.36,1)", io: "cubic-bezier(.65,0,.35,1)" },
  /** Motion durations: 1 = micro (press, colour), 2 = hover/state, 3 = entrances and panels. */
  duration: { "1": "120ms", "2": "200ms", "3": "320ms" },
  radius: "6px",
  wrap: "1180px",
} as const;

/** `var(--name)` for a color token, e.g. in inline SVG attributes. */
export const cssVar = (name: ColorToken) => `var(--${name})` as const;
