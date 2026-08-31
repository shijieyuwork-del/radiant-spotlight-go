#!/usr/bin/env node
/**
 * Re-encode oversized photographic assets in src/assets to WebP.
 * Usage: node scripts/optimize-images.mjs [--delete-source]
 *
 * Settings: max width 900px (no upscaling), quality 78.
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSETS_DIR = path.resolve("src/assets");
const MAX_WIDTH = 900;
const QUALITY = 78;
const DELETE_SOURCE = process.argv.includes("--delete-source");

// Any photographic asset in src/assets above this size gets re-encoded.
const SIZE_THRESHOLD = 250 * 1024;

const allFiles = await readdir(ASSETS_DIR);
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
