// Renders the CV PDF's page to assets/cv/cv.png for the in-page viewer (encode-images.mjs turns it
// into WebP) and records the PDF's SHA-256 next to it; a unit test fails when the PDF changes
// without a re-render. Run `pnpm cv` after replacing public/rui-lebre-cv.pdf. Uses Quick Look
// (`qlmanage`), so it runs on macOS; the CV is a single page.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const PDF = "public/rui-lebre-cv.pdf";
const OUT = "assets/cv";

const tmp = mkdtempSync(path.join(tmpdir(), "cv-"));
try {
  execFileSync("qlmanage", ["-t", "-s", "2480", "-o", tmp, PDF], { stdio: "ignore" });
  // Quick Look leaves the paper transparent: flatten it onto white.
  await sharp(path.join(tmp, `${path.basename(PDF)}.png`)).flatten({ background: "#ffffff" }).png().toFile(path.join(OUT, "cv.png"));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
const hash = createHash("sha256").update(readFileSync(PDF)).digest("hex");
writeFileSync(path.join(OUT, "source.sha256"), `${hash}  ${PDF}\n`);
console.log(`cv: rendered ${PDF}`);
