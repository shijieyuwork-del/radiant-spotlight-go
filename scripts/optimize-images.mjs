#!/usr/bin/env node
/**
 * Re-encode oversized photographic assets in src/assets to WebP.
 * Usage: node scripts/optimize-images.mjs [--delete-source]
 *
 * Settings: max width 900px (no upscaling), quality 78.
 *
 * NOTE: `sharp` is intentionally NOT a project dependency (it is a heavy
 * native module that would slow down / bloat every production CI build).
 * This is a one-off maintenance script — install sharp ad hoc before use:
 *   npx --yes -p sharp node scripts/optimize-images.mjs
 * or:
 *   npm i -D sharp && node scripts/optimize-images.mjs && npm un sharp
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(
    [
      "This script needs `sharp`, which is intentionally not a project dependency.",
      "It is a one-off maintenance tool. Run one of:",
      "  npx --yes -p sharp node scripts/optimize-images.mjs",
      "  npm i -D sharp   (then re-run this script)",
    ].join("\n"),
  );
  process.exit(1);
}

const ASSETS_DIR = path.resolve("src/assets");
const MAX_WIDTH = 900;
const QUALITY = 78;
const DELETE_SOURCE = process.argv.includes("--delete-source");

// Any photographic asset in src/assets above this size gets re-encoded.
const SIZE_THRESHOLD = 150 * 1024;

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(path.relative(ASSETS_DIR, full));
  }
  return out;
};
const allFiles = await walk(ASSETS_DIR);
const TARGETS = [];
for (const name of allFiles) {
  if (!/\.(png|jpe?g)$/i.test(name)) continue;
  const { size } = await stat(path.join(ASSETS_DIR, name));
  if (size >= SIZE_THRESHOLD) TARGETS.push(name);
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

const existing = new Set(allFiles);

for (const name of TARGETS) {
  if (!existing.has(name)) {
    console.log(`skip (missing): ${name}`);
    continue;
  }
  const src = path.join(ASSETS_DIR, name);
  const out = path.join(ASSETS_DIR, `${name.replace(/\.(png|jpe?g)$/i, "")}.webp`);
  const before = (await stat(src)).size;
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const after = (await stat(out)).size;
  console.log(`${name}: ${kb(before)} -> ${path.basename(out)} ${kb(after)}`);
  if (DELETE_SOURCE) await unlink(src);
}
