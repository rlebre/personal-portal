import { expect, test } from "@playwright/test";
import { axe } from "./helpers";

const pages = [
  "/", "/research", "/professional", "/hobbies", "/blog",
  "/pt", "/pt/investigacao", "/pt/profissional", "/pt/passatempos", "/pt/blog",
  "/this-page-does-not-exist", "/pt/esta-pagina-nao-existe",
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme, reducedMotion: "reduce" });
    for (const path of pages) {
      test(`axe: ${path}`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(await axe(page)).toEqual([]);
        await expect(page.locator("h1")).toHaveCount(1);
      });
    }
  });
}
