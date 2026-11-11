import { expect, test, type Page } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

/* ---------------- navigation & announcements ---------------- */

test("client-side navigation focuses the h1 and is announced once (by Next's route announcer)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.getByRole("link", { name: "Research" }).first()).toHaveAttribute("aria-current", "page");
  // Next's announcer (shadow DOM) reads the new title (or the h1 when the title lands later);
  // no custom live region repeats it.
  await expect(page.locator("#__next-route-announcer__")).toHaveText(/^Research( · Rui Lebre)?$/);
  const statusTexts = await page.locator("[role=status]").allTextContents();
  expect(statusTexts.filter((s) => /Research/.test(s))).toEqual([]);
});

test("'Get in touch' opens a menu to email or copy the address", async ({ page, context, browserName }) => {
  if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Get in touch" });
  const mail = page.getByRole("link", { name: "Send an email" });
  const copy = page.getByRole("button", { name: "Copy email address" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(mail).toBeHidden();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(mail).toHaveAttribute("href", "mailto:ruiclebre@gmail.com");
  // Focus moves to the first item; ↓/↑ move between items (wrapping).
  await expect(mail).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(copy).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(mail).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(copy).toBeFocused();
  // Anchored to the button (below it, or above when there's no room), never covering it.
  const [t, m] = [(await trigger.boundingBox())!, (await page.locator("[popover]").boundingBox())!];
  expect(m.y >= t.y + t.height || m.y + m.height <= t.y).toBe(true);
  expect(Math.abs(m.x - t.x)).toBeLessThan(1);
  // Escape closes it and focus goes back to the button.
  await page.keyboard.press("Escape");
  await expect(mail).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  // Focus leaving the panel closes it.
  await page.keyboard.press("Enter");
  await expect(mail).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(mail).toBeHidden();
  // Copy: toast, closes.
  await trigger.click();
  await copy.click();
  await expect(page.locator("[data-toast-status]")).toHaveText("Email copied");
  await expect(mail).toBeHidden();
  if (browserName === "chromium") expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("ruiclebre@gmail.com");
});

/* ---------------- CV viewer ---------------- */

test("'View CV' opens the viewer; Back, Escape and the browser's back all close it", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() } }));
  const images: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "image") images.push(new URL(r.url()).pathname);
  });
  await page.goto("/professional");
  const view = page.getByRole("link", { name: "View CV" });
  await expect(view).toHaveAttribute("href", "/rui-lebre-cv.pdf");
  await expect(view).toHaveAttribute("aria-haspopup", "dialog");
  // Closed: the page image isn't fetched.
  expect(images.some((p) => /\/cv\.[\w-]+\.webp$/.test(p))).toBe(false);

  await view.click();
  const dialog = page.getByRole("dialog", { name: "Rui Lebre · CV" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/professional$/);
  await expect(dialog.getByRole("button", { name: "Back" })).toBeFocused();
  const img = dialog.getByRole("img", { name: /^Rui Lebre's CV, one page/ });
  await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBe(1752);
  await expect(dialog.getByRole("link", { name: "Download" })).toHaveAttribute("download", "");
  await expect(dialog.getByRole("link", { name: "Download" })).toHaveAttribute("href", "/rui-lebre-cv.pdf");
  await expect(dialog.getByRole("link", { name: "Open the PDF" })).toHaveAttribute("target", "_blank");

  // Copy link: the result is shown and announced inside the dialog (the page toast is inert behind it).
  await dialog.getByRole("button", { name: "Copy link" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Link copied");
  await expect(dialog.getByRole("button", { name: "Link copied" })).toBeVisible();

  await dialog.getByRole("button", { name: "Back" }).click();
  await expect(dialog).toBeHidden();
  await expect(view).toBeFocused();

  await view.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(view).toBeFocused();

  // The browser's back closes it and stays on the page.
  await view.click();
  await expect(dialog).toBeVisible();
  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/professional$/);
  await expect(page.locator("h1")).toHaveText("Professional");
});

test("CV viewer: a refused clipboard shows the link instead; Share appears only where supported", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } }));
  await page.goto("/");
  await page.getByRole("link", { name: "View CV" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Share" })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Copy link" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Couldn't copy. The link is https://ruilebre.com/rui-lebre-cv.pdf");
  await expect(dialog.getByRole("button", { name: "Link copied" })).toHaveCount(0);
});

test("CV viewer: Share sends the PDF as a file when files can be shared", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { shared: unknown[] };
    w.shared = [];
    Object.assign(navigator, {
      share: (d: { files?: File[]; url?: string }) => (w.shared.push(d.files ? d.files.map((f) => `${f.name}:${f.type}:${f.size > 0}`) : d.url), Promise.resolve()),
      canShare: (d: { files?: File[] }) => !!d.files,
    });
  });
  await page.goto("/pt/profissional");
  await page.getByRole("link", { name: "Ver CV" }).click();
  const dialog = page.getByRole("dialog", { name: "Rui Lebre · CV" });
  await page.waitForResponse((r) => r.url().endsWith("/rui-lebre-cv.pdf"));
  await dialog.getByRole("button", { name: "Partilhar" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { shared: unknown[] }).shared)).toEqual([["rui-lebre-cv.pdf:application/pdf:true"]]);
});

/* ---------------- footer language switch ---------------- */

test("language links: chips with lang/hreflang, names contain the visible text, current one marked", async ({ page }) => {
  await page.goto("/hobbies");
  const group = page.getByRole("group", { name: "Language" });
  const pt = group.getByRole("link", { name: "Português" });
  await expect(pt).toHaveAttribute("href", "/pt/passatempos");
  await expect(pt).toHaveAttribute("hreflang", "pt-PT");
  await expect(pt).toHaveAttribute("lang", "pt-PT");
  // Label in name (2.5.3): accessible name contains the visible label.
  for (const el of [pt, group.locator('[aria-current="true"]')]) {
    const visible = await el.evaluate((e) => {
      const c = e.cloneNode(true) as HTMLElement;
      c.querySelectorAll(".sr-only").forEach((s) => s.remove());
      return c.textContent!.trim();
    });
    const name = await el.evaluate((e) => e.textContent!.trim());
    expect(name).toContain(visible);
  }
  await expect(group.locator('[aria-current="true"]')).toHaveText("English (current)");
  await expect(group.getByRole("link")).toHaveCount(1);
  await expect(page.locator("header").getByRole("link", { name: /português|PT/i })).toHaveCount(0);
});

test("language switch keeps the page and scroll position, then focuses the switch", async ({ page }) => {
  await page.goto("/research");
  const link = page.getByRole("group", { name: "Language" }).getByRole("link", { name: "Português" });
  await link.scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  const box = (await link.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/pt\/investigacao$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(Math.min(y, max));
  await expect(page.locator("#lang-switch")).toBeFocused();
  await expect(page.locator("#lang-switch")).toBeInViewport();
  // Keyboard: Tab from the group lands on the other language.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "English" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/research$/);
  await expect(page.locator("#lang-switch")).toBeFocused();
});

test("a modified click on the language link doesn't store scroll state", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Português" });
  await link.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await link.click({ modifiers: ["Meta"] });
  expect(await page.evaluate(() => sessionStorage.getItem("rl-lang-scroll"))).toBeNull();
});

/* ---------------- theme, filters, lightbox ---------------- */

test("theme toggle flips aria-pressed and persists", async ({ page }) => {
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Dark mode" });
  await expect(btn).toHaveAttribute("aria-pressed", "false");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("publication filters update the live count", async ({ page }) => {
  await page.goto("/research");
  const count = page.locator("main").getByRole("status");
  await expect(count).toHaveText("Showing 20 of 20 publications");
  await expect(page.getByRole("button", { name: "All types" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Journal" }).click();
  await expect(count).toHaveText("Showing 5 of 20 publications");
  // The pressed check mark is not part of the name.
  await expect(page.getByRole("button", { name: "Journal", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Year").selectOption("2020");
  await expect(count).toHaveText("Showing 1 of 20 publications");
  await page.getByRole("button", { name: "Book chapter" }).click();
  await expect(count).toHaveText("Nothing matches these filters.");
});

test("trail filter updates the count", async ({ page }) => {
  await page.goto("/hobbies");
  await page.getByRole("button", { name: "Cycling" }).click();
  await expect(page.locator("main").getByRole("status")).toHaveText("Showing 1 of 5 trails");
  await expect(page.locator("main article")).toHaveCount(1);
  // The "See all trails" card is never filtered out.
  await expect(page.getByRole("link", { name: /See all 101 trails/ })).toHaveAttribute("href", "/hobbies/trails");
});

test("all trails: stats, filters, accent-insensitive search, sort and the Hobbies nav item", async ({ page }) => {
  await page.goto("/hobbies/trails");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Hobbies" })).toHaveAttribute("aria-current", "true");
  await expect(page.locator("main")).toContainText("1,255 km recorded");
  const count = page.locator("main").getByRole("status");
  const rows = page.locator("main ol > li");
  await expect(count).toHaveText("Showing 101 of 101 trails");
  await expect(rows).toHaveCount(101);
  await page.getByRole("button", { name: "Cycling" }).click();
  await expect(count).toHaveText("Showing 13 of 101 trails");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByLabel("Country").selectOption("GR");
  await expect(rows).toHaveCount(1);
  await page.getByLabel("Country").selectOption("all");
  // "azores" finds Açores, "espanha" (PT name) finds Spain.
  await page.getByRole("searchbox", { name: "Search trails" }).fill("azores");
  const azores = await rows.count();
  expect(azores).toBeGreaterThan(0);
  await expect(rows.first()).toContainText("Açores");
  await page.getByRole("searchbox", { name: "Search trails" }).fill("espanha");
  await expect(count).toHaveText("Showing 10 of 101 trails");
  await page.getByRole("searchbox", { name: "Search trails" }).fill("zzzz");
  await expect(count).toHaveText("Nothing matches these filters.");
  await page.getByRole("searchbox", { name: "Search trails" }).fill("");
  // Longest first.
  await page.getByLabel("Sort").selectOption("long");
  await expect(rows.first()).toContainText("87.5 km");
});

test("lightbox: keyboard navigation and focus return", async ({ page }) => {
  await page.goto("/hobbies");
  const thumbs = page.locator("main").getByRole("button").filter({ has: page.locator("img") });
  await thumbs.nth(2).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Photo 3 of 18");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("Photo 4 of 18");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toHaveAccessibleName("Photo 2 of 18");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(thumbs.nth(1)).toBeFocused();
});

/* ---------------- mobile menu ---------------- */

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("Tab goes from the button into the open nav; Escape closes and returns focus", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Menu" });
    const nav = page.getByRole("navigation", { name: "Main" });
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toBeFocused();
    await expect(nav).toBeHidden();
  });

  test("closes when focus leaves forward past the last link", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Menu" });
    await btn.click();
    const links = page.getByRole("navigation", { name: "Main" }).getByRole("link");
    await links.last().focus();
    await page.keyboard.press("Tab");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("closes on a tap outside, without activating what's underneath", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Menu" });
    await btn.click();
    await page.mouse.click(200, 700);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/\/$/);
  });

  test("shows a close icon while open", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Menu" });
    const before = await btn.innerHTML();
    await btn.click();
    expect(await btn.innerHTML()).not.toBe(before);
  });
});

test("mobile menu panel scrolls at 320×256 (reflow)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const nav = page.getByRole("navigation", { name: "Main" });
  const { sh, ch, bottom } = await nav.evaluate((n) => ({ sh: n.scrollHeight, ch: n.clientHeight, bottom: n.getBoundingClientRect().bottom }));
  expect(sh).toBeGreaterThan(ch);
  expect(bottom).toBeLessThanOrEqual(256);
  const last = nav.getByRole("link").last();
  await last.focus();
  await expect(last).toBeInViewport();
});

test("without JavaScript the mobile nav is visible and reachable", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Research" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
  await ctx.close();
});

/* ---------------- toast & copy ---------------- */

test("toast: status region exists before the click and changes on every toast", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() } }));
  await page.goto("/");
  const status = page.locator("[data-toast-status]");
  await expect(status).toHaveAttribute("role", "status");
  await expect(status).toHaveAttribute("aria-atomic", "true");
  await expect(status).toBeEmpty();
  await status.evaluate((el) => {
    (window as unknown as { adds: number }).adds = 0;
    new MutationObserver((ms) => ms.forEach((m) => ((window as unknown as { adds: number }).adds += m.addedNodes.length))).observe(el, { childList: true, subtree: true });
  });
  const copy = page.getByRole("button", { name: "Copy" });
  await copy.click();
  await expect(status).toHaveText("Email copied");
  await copy.click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { adds: number }).adds)).toBeGreaterThanOrEqual(2);
  await expect(page.locator('[aria-hidden="true"]').filter({ hasText: "Email copied" })).toBeVisible();
});

test("copy email: a refused clipboard selects the text and never says 'copied'", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Copy" }).click();
  const status = page.locator("[data-toast-status]");
  await expect(status).toHaveText(/Press (Ctrl|Cmd)\+C to copy the email/);
  await expect(status).not.toHaveText(/copied/i);
  expect(await page.evaluate(() => getSelection()?.toString())).toBe("ruiclebre@gmail.com");
});

/* ---------------- blog visibility ---------------- */

test("blog is hidden while every post is a draft", async ({ page, request }) => {
  for (const path of ["/", "/pt"]) {
    await page.goto(path);
    await expect(page.getByRole("navigation", { name: /Main|Principal/ }).getByRole("link", { name: "Blog" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Latest posts|Últimos artigos/ })).toHaveCount(0);
    await expect(page.locator("main a[href*='/blog']")).toHaveCount(0);
  }
  await page.goto("/blog");
  await expect(page.getByText("The first posts are on the way.")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/blog");
  const feed = await request.get("/feed.xml");
  expect(feed.status()).toBe(200);
  const xml = await feed.text();
  expect(xml).toContain("<channel>");
  expect(xml).not.toContain("<item>");
  expect((await request.get("/blog/vale-glaciar")).status()).toBe(404);
});

/* ---------------- language of parts, 404 ---------------- */

test("English parts of /pt/profissional are marked lang=en", async ({ page }) => {
  await page.goto("/pt/profissional");
  // Chips are <li>s (project tags are spans, and stay outside this check).
  const langOf = (text: string) =>
    page.locator("main li, main span").getByText(text, { exact: true }).last().evaluate((el) => el.closest("[lang]")!.getAttribute("lang"));
  expect(await langOf("TypeScript")).toBe("en");
  expect(await langOf("Medical imaging")).toBe("en");
  expect(await langOf("Software Engineer")).toBe("en");
  expect(await langOf("Senior")).toBe("en");
  // Screenshots have Portuguese alt text on PT pages.
  await expect(page.locator("main img[alt^='Captura de ecrã']")).toHaveCount(4);
});

test("unknown URLs under /pt get the Portuguese 404", async ({ page }) => {
  const res = await page.goto("/pt/nao-existe");
  expect(res!.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
  await expect(page.locator("h1")).toHaveText("Fora do mapa");
  const en = await page.goto("/nope");
  expect(en!.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Off the map");
});

/* ---------------- layout: reflow, text spacing, target sizes ---------------- */

/** Elements that clip their content (overflow hidden/clip and content larger than the box). */
async function clipped(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main *, header *, footer *")]
      .filter((el) => {
        if (el.closest(".sr-only") || el.offsetWidth <= 1 || el.closest("svg")) return false;
        const cs = getComputedStyle(el);
        const hidden = (v: string) => v === "hidden" || v === "clip";
        if (!hidden(cs.overflowX) && !hidden(cs.overflowY)) return false;
        // Only text that sticks out counts: decorative overflow (ripples, canvases) is fine.
        const text = [...el.querySelectorAll<HTMLElement>("*")].concat(el).filter((c) => [...c.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()));
        const box = el.getBoundingClientRect();
        return text.some((c) => {
          const r = c.getBoundingClientRect();
          return r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1 || r.bottom > box.bottom + 1);
        });
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
  );
}

const TEXT_SPACING = "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}";

for (const path of ["/", "/research", "/professional", "/hobbies", "/pt", "/pt/profissional", "/pt/investigacao"]) {
  test(`no horizontal overflow at 320px: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });

  test(`no clipping with text-spacing overrides at 320px: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    await page.addStyleTag({ content: TEXT_SPACING });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    expect(await clipped(page)).toEqual([]);
  });
}

test("no clipping on /pt/profissional at 640px", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/pt/profissional");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(640);
  expect(await clipped(page)).toEqual([]);
});

test("header controls are ≥44px; other targets ≥24px", async ({ page }) => {
  const small = async (selector: string, min: number) =>
    page.locator(selector).evaluateAll(
      (els, min) =>
        els
          .filter((e) => (e as HTMLElement).offsetParent !== null && !e.closest(".sr-only"))
          .map((e) => ({ e, r: e.getBoundingClientRect() }))
          .filter(({ r }) => r.width < min || r.height < min)
          .map(({ e, r }) => `${e.textContent!.trim() || e.getAttribute("aria-label")} ${Math.round(r.width)}×${Math.round(r.height)}`),
      min,
    );
  for (const path of ["/", "/research", "/professional", "/hobbies", "/pt"]) {
    await page.goto(path);
    expect(await small("header a, header button", 44), path).toEqual([]);
    expect(await small("footer a, footer button, main button, main select, main h2 + a, main h2 + p a, main .ptop a", 24), path).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  expect(await small("header a, header button", 44)).toEqual([]);
});

test("thesis button focus ring contrasts ≥3:1 with the dark panel in both themes", async ({ page }) => {
  const lum = (rgb: string) => {
    const [r, g, b] = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/research");
    const btn = page.getByRole("button", { name: "Read the thesis" });
    await btn.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(btn).toBeFocused();
    const { outline, panel, width } = await btn.evaluate((b) => ({
      outline: getComputedStyle(b).outlineColor,
      width: parseFloat(getComputedStyle(b).outlineWidth),
      panel: getComputedStyle(b.parentElement!).backgroundColor,
    }));
    expect(width, theme).toBeGreaterThanOrEqual(2);
    expect(ratio(outline, panel), theme).toBeGreaterThanOrEqual(3);
  }
});

/* ---------------- motion, metadata, no-JS ---------------- */

for (const path of ["/", "/research", "/professional", "/hobbies", "/blog", "/pt"]) {
  test(`reduced motion: no running animations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
}

test("content is visible without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/research");
  await expect(page.locator("h1")).toHaveText("Research");
  await expect(page.locator("main article")).toHaveCount(20);
  await ctx.close();
});

test("per-page metadata: title, description, hreflang with x-default", async ({ page }) => {
  await page.goto("/research");
  await expect(page).toHaveTitle("Research · Rui Lebre");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /medical images/);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-PT"]')).toHaveAttribute("href", /\/pt\/investigacao$/);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", /\/research$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

test("forced colors: the current language and pressed chips stay distinguishable", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/research");
  const bg = (sel: string) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).backgroundColor);
  const group = '[role="group"]#lang-switch';
  expect(await bg(`${group} [aria-current="true"]`)).not.toBe(await bg(`${group} a`));
  expect(await bg('main button[aria-pressed="true"]')).not.toBe(await bg('main button[aria-pressed="false"]'));
});
