import { expect, test, type Page } from "@playwright/test";

/** Scrolls to the bottom in steps so every lazy image gets a chance to load. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(50);
  }
  await page.waitForLoadState("networkidle");
}

test.describe("hobbies images", () => {
  test("gallery grid uses the 760 px thumbnails", async ({ page }) => {
    await page.goto("/hobbies");
    await scrollThrough(page);
    const imgs = page.locator("main").getByRole("button").filter({ has: page.locator("img") }).locator("img");
    await expect(imgs).toHaveCount(18);
    const widths = await imgs.evaluateAll((els) => els.map((el) => (el as HTMLImageElement).naturalWidth));
    expect(widths).toEqual(Array(18).fill(760));
  });

  test("the closed lightbox loads nothing; opening it loads the full photo", async ({ page }) => {
    const images: string[] = [];
    page.on("request", (r) => {
      if (r.resourceType() === "image") images.push(new URL(r.url()).pathname);
    });
    await page.goto("/hobbies");
    const full = await page.locator("dialog img").getAttribute("src");
    expect(full).toBeTruthy();
    await scrollThrough(page);
    expect(images).not.toContain(full);
    // The only image preload is the first trail's map (the mobile LCP image), never a photo.
    const preloads = await page.locator('link[rel="preload"][as="image"]').evaluateAll((els) => els.map((el) => new URL((el as HTMLLinkElement).href).pathname));
    expect(preloads).not.toContain(full);
    expect(preloads.every((p) => p.includes("/media/55748813."))).toBe(true);

    const thumbs = page.locator("main").getByRole("button").filter({ has: page.locator("img") });
    const req = page.waitForRequest((r) => new URL(r.url()).pathname === full);
    await thumbs.first().click();
    await req;
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(`[id]`).first()).toHaveAttribute("aria-live", "polite");
    await expect(dialog.locator("figcaption")).toHaveAttribute("aria-hidden", "true");
  });

  test("image bytes stay under budget", async ({ page }) => {
    let bytes = 0;
    page.on("response", async (r) => {
      if (r.request().resourceType() !== "image") return;
      bytes += (await r.body().catch(() => Buffer.alloc(0))).length;
    });
    await page.goto("/hobbies");
    await scrollThrough(page);
    // All 18 thumbnails are ~1.2 MB; the full-size photos are ~4.4 MB.
    expect(bytes).toBeGreaterThan(0);
    expect(bytes).toBeLessThan(1_500_000);
  });
});

test("blog photo: srcset with the thumbnail, not lazy", async ({ page }) => {
  const res = await page.goto("/blog/vale-glaciar");
  // The blog is hidden while every post is a draft; this re-activates once the post is published.
  test.skip(res?.status() !== 200, "vale-glaciar is a draft, so it isn't in the static export");
  const img = page.locator("#article figure img").first();
  await expect(img).toHaveAttribute("srcset", /\/_next\/static\/media\/10\.[\w-]+\.webp 760w, \/_next\/static\/media\/10\.[\w-]+\.webp 1080w/);
  await expect(img).toHaveAttribute("sizes", /680px$/);
  await expect(img).toHaveAttribute("loading", "eager");
});

test("OG images are served as image/png", async ({ page, request }) => {
  for (const path of ["/", "/hobbies", "/research", "/pt/passatempos", "/blog/vale-glaciar", "/pt/blog/vale-glaciar"]) {
    const response = await page.goto(path);
    if (path.includes("/blog/") && response?.status() !== 200) continue; // draft posts aren't exported
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(og!).pathname);
    expect(res.status(), og!).toBe(200);
    expect(res.headers()["content-type"], og!).toBe("image/png");
  }
});

test.describe("hero canvas", () => {
  test.use({ reducedMotion: "no-preference" });

  test("pause button has no aria-pressed and its label flips", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Pause animation" });
    await expect(btn).not.toHaveAttribute("aria-pressed");
    await btn.click();
    await expect(page.getByRole("button", { name: "Play animation" })).not.toHaveAttribute("aria-pressed");
    await page.getByRole("button", { name: "Play animation" }).click();
    await expect(page.getByRole("button", { name: "Pause animation" })).toBeVisible();
  });

  test("draws after load and fades in", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("canvas");
    await expect(canvas).toHaveAttribute("data-ready", "");
    await expect.poll(() => canvas.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});

test("trail filter updates the count; PT dates are localised", async ({ page }) => {
  await page.goto("/pt/passatempos");
  const count = page.locator("main").getByRole("status");
  await expect(count).toHaveText("A mostrar 5 de 5 trilhos");
  await expect(page.locator("main article").first()).toContainText("ago 2020");
  await expect(page.locator("main article", { hasText: "Aug 2020" })).toHaveCount(0);
  await page.getByRole("button", { name: "Bicicleta" }).click();
  await expect(count).toHaveText("A mostrar 1 de 5 trilhos");
  await expect(page.getByRole("button", { name: "Bicicleta" })).toHaveAttribute("aria-pressed", "true");
});

test.describe("fonts", () => {
  const italicLoaded = (page: Page) =>
    page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some((f) => f.family.includes("Atkinson") && f.style === "italic" && f.status === "loaded");
    });

  test("Atkinson italic is not preloaded and loads only where italics are used", async ({ page }) => {
    await page.goto("/");
    expect(await italicLoaded(page)).toBe(false);
    await page.goto("/research");
    // <cite> must use the real italic face (same family as the body text), not a synthesised slant.
    expect(await italicLoaded(page)).toBe(true);
  });

  test("the wordmark uses the subset Archivo file", async ({ page }) => {
    await page.goto("/");
    const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(preloads.some((h) => /archivo_name/.test(h ?? ""))).toBe(true);
    // Archivo subset, Atkinson 400/700 upright, Bricolage, Plex Mono 400/500: no italics.
    expect(preloads.length).toBeLessThanOrEqual(6);
  });
});
