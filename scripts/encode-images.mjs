// Re-encodes the source images in /assets into WebP under src/assets so pages can
// import them statically (width/height + blur placeholder). Skips up-to-date files; editing this
// script (e.g. a width or quality below) makes every output stale, so they are re-encoded.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SRC = "assets";
const OUT = "src/assets";
const SELF = fileURLToPath(import.meta.url);

/** source dir, output dir (defaults to the source dir), max width, quality */
const jobs = [
  // Full size: lightbox and the large variant of blog <Photo>s.
  { dir: "photos", width: 1600, quality: 78 },
  // Gallery grid / blog srcset thumbnails: grid cells are at most 380 CSS px wide, so 760 = 2x.
  { dir: "photos", out: "photos/thumb", width: 760, quality: 74 },
  { dir: "shots", width: 1280, quality: 80 },
  // OpenTopoMap backgrounds for the trail cards' route maps. 480 px, not the 600 px source: they
  // are drawn faded and desaturated, and the first one is the mobile LCP image (24 KB vs 60 KB).
  { dir: "maps", width: 480, quality: 70 },
  // The CV page for the in-page viewer (rendered from the PDF by render-cv.mjs). Full 1752 px (A4
  // at 150 dpi), so it stays sharp when pinch-zoomed; it only loads when the viewer opens.
  { dir: "cv", width: 1752, quality: 80 },
  // Post author avatar: rendered at 56 CSS px, 112 = 2x.
  { dir: ".", width: 112, quality: 85, only: ["avatar.png"] },
];

async function isFresh(src, out) {
  try {
    const [a, b, s] = await Promise.all([stat(src), stat(out), stat(SELF)]);
    return b.mtimeMs >= Math.max(a.mtimeMs, s.mtimeMs);
  } catch {
    return false;
  }
}

let count = 0;
for (const job of jobs) {
  const inDir = path.join(SRC, job.dir);
  const outDir = path.join(OUT, job.out ?? job.dir);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(inDir)).filter(
    (f) => /\.(jpe?g|png|webp)$/i.test(f) && (!job.only || job.only.includes(f)),
  );
  for (const f of files) {
    const src = path.join(inDir, f);
    const out = path.join(outDir, f.replace(/\.\w+$/, ".webp"));
    if (await isFresh(src, out)) continue;
    await sharp(src)
      .rotate()
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: job.quality })
      .toFile(out);
    count++;
  }
}
console.log(`images: ${count} encoded`);
