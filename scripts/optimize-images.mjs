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

// Files to convert. Keep this list explicit so we never touch icons/logos.
const TARGETS = [
  "doctor-demo-zhou-premium-real-face-v8.png",
  "doctor-demo-zhou-candid-consultation-v9.png",
  "doctor-demo-gu-candid-texture-v8.png",
  "doctor-demo-chen-authoritative-v4.png",
  "doctor-demo-lin-natural-v4.png",
  "city-hainan.jpg",
  "city-beijing.jpg",
  "city-guangzhou.jpg",
  "journey-premium-natural-concierge-v5.jpg",
  "journey-premium-natural-consultation-v5.jpg",
  "journey-premium-natural-arrival-v5.jpg",
  "doctor-demo-xu-natural-v3.jpg",
];

const kb = (n) => `${Math.round(n / 1024)} KB`;

const existing = new Set(await readdir(ASSETS_DIR));

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
