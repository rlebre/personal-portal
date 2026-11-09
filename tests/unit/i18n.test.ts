import { describe, expect, it } from "vitest";
import strings from "@/data/i18n.json";
import { counterpart, formatDate, formatDecimal, formatMonth, routes, t } from "@/lib/i18n";

describe("t", () => {
  it("interpolates variables", () => {
    expect(t("en", "count.pubs", { n: 3, t: 20 })).toBe("Showing 3 of 20 publications");
    expect(t("pt", "lb.of", { i: 1, n: 12 })).toBe("Foto 1 de 12");
  });
  it("has the same keys in both locales", () => {
    expect(Object.keys(strings.pt).sort()).toEqual(Object.keys(strings.en).sort());
  });
});

describe("counterpart", () => {
  it("maps every page to its other-locale path", () => {
    for (const r of Object.values(routes)) {
      expect(counterpart(r.en, "en")).toBe(r.pt);
      expect(counterpart(r.pt, "pt")).toBe(r.en);
    }
  });
  it("maps blog posts and tolerates trailing slashes", () => {
    expect(counterpart("/blog/vale-glaciar", "en")).toBe("/pt/blog/vale-glaciar");
    expect(counterpart("/pt/blog/vale-glaciar/", "pt")).toBe("/blog/vale-glaciar");
  });
  it("falls back to the other home", () => {
    expect(counterpart("/unknown", "en")).toBe("/pt");
  });
});

describe("formatting", () => {
  it("uses the locale decimal separator", () => {
    expect(formatDecimal(50.1, "pt")).toBe("50,1");
    expect(formatDecimal(50.1, "en")).toBe("50.1");
  });
  it("formats months and dates", () => {
    expect(formatMonth("2017-09", "en")).toBe("Sep 2017");
    expect(formatMonth("2017-09", "pt")).toBe("set 2017");
    expect(formatDate("2026-10-20", "en")).toBe("20 Oct 2026");
    // Same month names as formatMonth: en-GB Intl would say "Sept".
    expect(formatDate("2026-09-02", "en")).toBe("2 Sep 2026");
    expect(formatDate("2026-09-02", "pt")).toBe("2 set 2026");
  });
});
