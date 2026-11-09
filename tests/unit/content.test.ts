import { describe, expect, it } from "vitest";
import { extractHeadings, getPosts, readingTime, slugify } from "@/lib/content";
import { pubStats, publications, routeFor, trails } from "@/lib/data";

describe("content helpers", () => {
  it("slugifies accented headings", () => {
    expect(slugify("Notas para a próxima vez!")).toBe("notas-para-a-proxima-vez");
  });
  it("computes reading time at ~220 wpm, minimum 1", () => {
    expect(readingTime("word ".repeat(10))).toBe(1);
    expect(readingTime("word ".repeat(1000))).toBe(5);
  });
  it("extracts h2 headings for the TOC", () => {
    expect(extractHeadings("intro\n## The plan\ntext\n### skip\n## The climb")).toEqual([
      { id: "the-plan", text: "The plan" },
      { id: "the-climb", text: "The climb" },
    ]);
  });
  it("loads posts newest first with valid frontmatter", () => {
    const posts = getPosts();
    expect(posts.length).toBeGreaterThan(0);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("data", () => {
  it("matches the stats in the design", () => {
    expect(pubStats).toEqual({ total: 20, journal: 5, conference: 14 });
    expect(publications.filter((p) => p.type === "chapter")).toHaveLength(1);
  });
  it("has a GPS route with 61 profile samples for every trail", () => {
    for (const tr of trails) expect(routeFor(tr.u)?.prof).toHaveLength(61);
  });
});
