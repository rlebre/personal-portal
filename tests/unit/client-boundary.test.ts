import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Client components must not (even transitively) import server-only modules: the string table
// would ship both locales to the browser, and fs/data loaders don't belong in client bundles.
const SRC = path.join(import.meta.dirname, "../../src");
const FORBIDDEN = ["data/i18n.json", "lib/i18n.ts", "lib/data.ts", "lib/content.ts"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}

function resolve(from: string, spec: string): string | null {
  const base = spec.startsWith("@/") ? path.join(SRC, spec.slice(2)) : spec.startsWith(".") ? path.resolve(path.dirname(from), spec) : null;
  if (!base) return null; // package import
  for (const p of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) if (existsSync(p) && statSync(p).isFile()) return p;
  return null;
}

function imports(file: string): string[] {
  const src = readFileSync(file, "utf8");
  // `import type` is erased at compile time, so it can't pull anything into the bundle.
  return [...src.matchAll(/^import\s+(?!type\s)[^;]*?from\s+"([^"]+)"/gms)].map((m) => resolve(file, m[1])).filter((p): p is string => !!p);
}

describe("client components", () => {
  const clientFiles = files(SRC).filter((f) => /^\s*["']use client["']/.test(readFileSync(f, "utf8")));

  it("exist", () => expect(clientFiles.length).toBeGreaterThan(5));

  for (const entry of clientFiles) {
    it(`${path.relative(SRC, entry)} stays off server-only modules`, () => {
      const seen = new Set<string>();
      const stack: string[][] = [[entry]];
      while (stack.length) {
        const chain = stack.pop()!;
        const file = chain[chain.length - 1];
        if (seen.has(file)) continue;
        seen.add(file);
        const rel = path.relative(SRC, file);
        expect(FORBIDDEN.includes(rel), `imports ${rel} via ${chain.map((c) => path.relative(SRC, c)).join(" → ")}`).toBe(false);
        if (/\.tsx?$/.test(file)) for (const next of imports(file)) stack.push([...chain, next]);
      }
    });
  }
});
