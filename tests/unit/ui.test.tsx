import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { cx } from "@/components/ui/cx";
import { ResultCount } from "@/components/ui/FilterBar";
import { Eyebrow } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatList } from "@/components/ui/Stat";
import { Toaster } from "@/components/ui/Toast";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("ui primitives", () => {
  it("cx skips falsy parts", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("Button defaults to type=button; ButtonLink renders a link or the `as` component", () => {
    expect(html(<Button>Go</Button>)).toMatch(/^<button type="button"/);
    expect(html(<ButtonLink href="/x">Go</ButtonLink>)).toMatch(/^<a [^>]*href="\/x"/);
    const Custom = (p: { href: string; className?: string; children: React.ReactNode }) => <a data-custom="" {...p} />;
    expect(html(<ButtonLink as={Custom} href="/y">Go</ButtonLink>)).toContain("data-custom");
  });

  it("ChipGroup is a labelled group of aria-pressed toggles", () => {
    const out = html(<ChipGroup label="Type" value="b" onChange={() => {}} options={[{ value: "a", label: "A" }, { value: "b", label: "B", lang: "pt-PT" }]} />);
    const labelId = out.match(/aria-labelledby="([^"]+)"/)![1];
    expect(out).toContain(`role="group"`);
    expect(out).toContain(`id="${labelId}"`);
    expect(out.match(/<button[^>]*>/g)).toEqual([
      expect.stringContaining(`aria-pressed="false"`),
      expect.stringMatching(/aria-pressed="true".*lang="pt-PT"|lang="pt-PT".*aria-pressed="true"/),
    ]);
  });

  it("ResultCount is a polite live region", () => {
    expect(html(<ResultCount>3 of 4</ResultCount>)).toMatch(/role="status" aria-live="polite"/);
  });

  it("Toaster renders its status region from the first render, and hides the visual pill from AT", () => {
    const out = html(<Toaster />);
    expect(out).toMatch(/<div class="sr-only" role="status" aria-atomic="true"[^>]*><\/div>/);
    expect(out).toMatch(/aria-hidden="true" hidden=""/);
  });

  it("PageHeader renders one h1 with the eyebrow and lede around it", () => {
    const out = html(<PageHeader eyebrow={<Eyebrow symbol="▲">Outdoors</Eyebrow>} title="Hobbies" titleLang="en" lede="Lede" />);
    expect(out.match(/<h1/g)).toHaveLength(1);
    expect(out).toMatch(/<p[^>]*>▲ <span>Outdoors<\/span><\/p><h1 lang="en">Hobbies<\/h1><p[^>]*>Lede<\/p>/);
  });

  it("StatList keeps a space between number and caption (no run-together text), and Badge renders", () => {
    expect(html(<StatList items={[{ value: 20, label: "papers" }]} />)).toContain("<span><b>20</b> <span>papers</span></span>");
    expect(html(<Badge variant="label" tone="forest" lang="en">Journal</Badge>)).toMatch(/<span class="[^"]*" lang="en">Journal<\/span>/);
  });
});
