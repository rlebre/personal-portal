import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { tokens } from "@/styles/tokens";

const css = readFileSync(path.join(import.meta.dirname, "../../src/styles/tokens.css"), "utf8");

/** Custom properties declared in the first block that starts with `selector{`. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  expect(start, `${selector} in tokens.css`).toBeGreaterThanOrEqual(0);
  const body = css.slice(css.indexOf("{", start + selector.length - 1) + 1);
  const decls = body.slice(0, body.indexOf("}"));
  return Object.fromEntries([...decls.matchAll(/--([\w-]+)\s*:\s*([^;]+?)\s*(?:;|$)/g)].map((m) => [m[1], m[2].trim()]));
}

describe("design tokens", () => {
  const light = block(":root{");
  const darkMedia = block(':root:not([data-theme="light"]){');
  const darkAttr = block(':root[data-theme="dark"]{');

  it("tokens.ts colors match tokens.css (light and dark)", () => {
    for (const [k, v] of Object.entries(tokens.color.light)) expect(light[k], `--${k}`).toBe(v);
    for (const [k, v] of Object.entries(tokens.color.dark)) expect(darkAttr[k], `--${k} (dark)`).toBe(v);
  });

  it("the prefers-color-scheme and [data-theme=dark] blocks are identical", () => {
    expect(darkMedia).toEqual(darkAttr);
  });

  it("tokens.ts fonts, scale, easing, durations and layout match tokens.css", () => {
    for (const [k, v] of Object.entries(tokens.font)) expect(light[`f-${k}`]).toBe(v);
    for (const [k, v] of Object.entries(tokens.size)) expect(light[`s-${k}`]).toBe(v);
    for (const [k, v] of Object.entries(tokens.ease)) expect(light[`ease-${k}`]).toBe(v);
    for (const [k, v] of Object.entries(tokens.duration)) expect(light[`d-${k}`]).toBe(v);
    expect(light.radius).toBe(tokens.radius);
    expect(light.wrap).toBe(tokens.wrap);
  });
});
