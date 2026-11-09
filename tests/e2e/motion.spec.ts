import { expect, test, type Page } from "@playwright/test";

/** Every running/filling animation, as "target class: animation name" for readable failures. */
const animations = (page: Page) =>
  page.evaluate(() =>
    document.getAnimations().map((a) => {
      const t = (a.effect as KeyframeEffect | null)?.target;
      return `${t?.getAttribute("class") ?? t?.nodeName}: ${(a as CSSAnimation).animationName ?? a.constructor.name}`;
    }),
  );

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no animations after hovering a trail card and filtering trails", async ({ page }) => {
    await page.goto("/hobbies");
    const card = page.locator("main article").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.locator("main article a").first().focus();
    await expect.poll(() => animations(page)).toEqual([]);
    await page.getByRole("button", { name: "Cycling" }).click();
    await expect(page.locator("main article")).toHaveCount(1);
    await expect.poll(() => animations(page)).toEqual([]);
    // No view transition either: names are never applied.
    expect(await page.evaluate(() => document.documentElement.dataset.vt)).toBeUndefined();
  });

  test("no animations after filtering publications", async ({ page }) => {
    await page.goto("/research");
    await page.getByRole("button", { name: "Journal" }).click();
    await page.getByLabel("Year").selectOption("2020");
    await expect(page.locator("main").getByRole("status")).toHaveText("Showing 1 of 20 publications");
    await expect.poll(() => animations(page)).toEqual([]);
  });
});

test.describe("motion allowed", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero name paints without animation", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const onName = await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      return document.getAnimations().filter((a) => {
        const t = (a.effect as KeyframeEffect | null)?.target;
        return t instanceof Element && (t === h1 || t.contains(h1));
      }).length;
    });
    expect(onName).toBe(0);
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  });

  test("hovering a trail card replays its GPS track once", async ({ page }) => {
    await page.goto("/hobbies");
    const card = page.locator("main article").first();
    await card.scrollIntoViewIfNeeded();
    const traces = () =>
      page.evaluate(
        () =>
          document.getAnimations().filter((a) => {
            const t = (a.effect as KeyframeEffect | null)?.target;
            return t instanceof SVGElement && (t.getAttribute("class") ?? "").includes("routeTrace");
          }).length,
      );
    expect(await traces()).toBe(0);
    await card.hover();
    await expect.poll(traces).toBe(1);
    const iterations = await page.evaluate(() => {
      const a = document.getAnimations().find((x) => ((x.effect as KeyframeEffect).target?.getAttribute("class") ?? "").includes("routeTrace"))!;
      return a.effect!.getComputedTiming().iterations;
    });
    expect(iterations).toBe(1);
  });

  test("filter view-transition names exist only during the transition, and are unique", async ({ page }) => {
    await page.goto("/hobbies");
    const names = () =>
      page.evaluate(() => [...document.querySelectorAll("[data-vt-item]")].map((el) => getComputedStyle(el).viewTransitionName));
    // At rest: no card is named (theme and language transitions see one page image).
    expect(new Set(await names())).toEqual(new Set(["none"]));
    // Record the names at the moment the transition captures the old state.
    await page.evaluate(() => {
      const w = window as unknown as { vt: { during: string[]; attr?: string } | null };
      w.vt = null;
      const start = document.startViewTransition.bind(document);
      document.startViewTransition = ((cb: ViewTransitionUpdateCallback) => {
        w.vt = {
          attr: document.documentElement.dataset.vt,
          during: [...document.querySelectorAll("[data-vt-item]")].map((el) => getComputedStyle(el).viewTransitionName),
        };
        return start(cb);
      }) as typeof document.startViewTransition;
    });
    await page.getByRole("button", { name: "Cycling" }).click();
    const vt = await page.evaluate(() => (window as unknown as { vt: { during: string[]; attr?: string } }).vt);
    expect(vt.attr).toBe("filter");
    expect(vt.during).toHaveLength(6);
    expect(vt.during.every((n) => n.startsWith("vt-trail-"))).toBe(true);
    expect(new Set(vt.during).size).toBe(vt.during.length);
    await expect(page.locator("main article")).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.vt ?? null)).toBeNull();
    expect(new Set(await names())).toEqual(new Set(["none"]));
  });

  test("lightbox opens and closes with motion; focus returns to the thumbnail", async ({ page }) => {
    await page.goto("/hobbies");
    const thumbs = page.locator("main").getByRole("button").filter({ has: page.locator("img") });
    await thumbs.nth(2).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("opacity", "1");
    await expect(dialog).toHaveAccessibleName("Photo 3 of 12");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toHaveAccessibleName("Photo 4 of 12");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(thumbs.nth(3)).toBeFocused();
  });
});
