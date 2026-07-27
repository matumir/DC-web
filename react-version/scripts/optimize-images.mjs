// One-off / re-runnable batch converter: png|jpg|jpeg -> webp under public/imagenes.
// Run with: node scripts/optimize-images.mjs
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "imagenes");
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);

let converted = 0;
let skipped = 0;
let bytesBefore = 0;
let bytesAfter = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!RASTER_EXT.has(ext)) {
      skipped++;
      continue;
    }
    const target = full.slice(0, -ext.length) + ".webp";
    const before = (await stat(full)).size;
    await sharp(full).webp({ quality: 82 }).toFile(target);
    const after = (await stat(target)).size;
    await unlink(full);
    bytesBefore += before;
    bytesAfter += after;
    converted++;
  }
}

await walk(ROOT);

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Converted: ${converted} files, skipped (already webp/avif/svg): ${skipped}`);
console.log(`Size: ${mb(bytesBefore)}MB -> ${mb(bytesAfter)}MB`);
