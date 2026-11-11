import { expect, test } from "@playwright/test";
import { axe } from "./helpers";

// axe in interactive states, not just on first paint: open menu, empty filter results, CV viewer, visible toast.
for (const width of [390, 1280]) {
  for (const theme of ["light", "dark"] as const) {
    test.describe(`${width}px ${theme}`, () => {
      test.use({ viewport: { width, height: 844 }, colorScheme: theme, reducedMotion: "reduce" });

      if (width < 860)
        test("axe: mobile menu open", async ({ page }) => {
          await page.goto("/");
          await page.getByRole("button", { name: "Menu" }).click();
          await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
          expect(await axe(page)).toEqual([]);
        });

      test("axe: empty publication filter results", async ({ page }) => {
        await page.goto("/research");
        await page.getByRole("button", { name: "Book chapter" }).click();
        await page.getByLabel("Year").selectOption("2020");
        await expect(page.locator("main").getByRole("status")).toHaveText("Nothing matches these filters.");
        expect(await axe(page)).toEqual([]);
      });

      test("axe: CV viewer open", async ({ page }) => {
        await page.goto("/professional");
        await page.getByRole("link", { name: "View CV" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        expect(await axe(page)).toEqual([]);
      });

      test("axe: toast visible", async ({ page }) => {
        await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() } }));
        await page.goto("/professional");
        await page.getByRole("button", { name: "Copy" }).click();
        await expect(page.locator("[data-toast-status]")).toHaveText("Email copied");
        expect(await axe(page)).toEqual([]);
      });
    });
  }
}
