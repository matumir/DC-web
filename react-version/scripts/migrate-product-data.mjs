// One-off migration: adds `export`, rewrites image extensions to .webp
// (matches the batch conversion done by optimize-images.mjs) and makes
// asset paths root-absolute so they resolve correctly under any route.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve(import.meta.dirname, "..", "src", "data", "productos");

for (const file of await readdir(DIR)) {
  if (!file.endsWith(".js")) continue;
  const full = path.join(DIR, file);
  let content = await readFile(full, "utf8");

  content = content.replace(/^const (\w+) = \[/m, "export const $1 = [");
  content = content.replace(/"(imagenes|fichas)\//g, '"/$1/');
  content = content.replace(/(\/imagenes\/[^"]*)\.(png|jpe?g)"/g, '$1.webp"');

  await writeFile(full, content, "utf8");
  console.log(`migrated ${file}`);
}
