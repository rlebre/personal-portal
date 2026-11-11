import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { trailDate } from "@/components/hobbies/TrailCard";
import trails from "@/data/trails.json";

const ROOT = path.join(import.meta.dirname, "../..");

describe("trail dates", () => {
  it("are localised through formatMonth", () => {
    expect(trailDate("Aug 2020", "en")).toBe("Aug 2020");
    expect(trailDate("Aug 2020", "pt")).toBe("ago 2020");
    expect(trailDate("Oct 2022", "pt")).toBe("out 2022");
  });

  it("parse every date in trails.json (no English left on PT pages)", () => {
    for (const { date } of trails) expect(trailDate(date, "pt"), date).not.toBe(date);
  });

  it("leave anything unparseable alone", () => {
    expect(trailDate("summer 2020", "pt")).toBe("summer 2020");
  });
});

describe("static perf config", () => {
  it("serves extension-less OG images as PNG at every depth, one splat per rule", () => {
    const headers = readFileSync(path.join(ROOT, "public/_headers"), "utf8");
    for (const rule of ["/opengraph-image-:h", "/:a/opengraph-image-:h", "/:a/:b/opengraph-image-:h", "/:a/:b/:c/opengraph-image-:h"]) {
      expect(headers).toMatch(new RegExp(`^${rule.replaceAll("/", "\\/")}\\n\\s+Content-Type: image/png$`, "m"));
    }
    for (const line of headers.split("\n").filter((l) => l.startsWith("/"))) expect(line.split("*").length - 1, line).toBeLessThanOrEqual(1);
  });

  it("ships the wordmark font as a tiny subset", () => {
    expect(statSync(path.join(ROOT, "src/fonts/archivo-name.woff2")).size).toBeLessThan(4096);
  });
});

describe("CV viewer image", () => {
  it("was rendered from the current PDF (run `pnpm cv` after replacing it)", () => {
    const pdf = createHash("sha256").update(readFileSync(path.join(ROOT, "public/rui-lebre-cv.pdf"))).digest("hex");
    expect(readFileSync(path.join(ROOT, "assets/cv/source.sha256"), "utf8").split(/\s+/)[0]).toBe(pdf);
  });
});
