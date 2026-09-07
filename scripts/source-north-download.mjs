import { existsSync, readFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const rows = JSON.parse(readFileSync("src/data/real-photos-north.json", "utf8"));
const scratch = mkdtempSync(join(tmpdir(), "celadon-north-photos-"));
mkdirSync("src/assets/real-photos/north", { recursive: true });
for (const [i, row] of rows.entries()) {
  if (existsSync(row.imgPath)) { console.log("Already present: " + row.hospitalZh); continue; }
  const input = join(scratch, String(i) + ".jpg");
  // A failed request halts the batch. Respect Retry-After before another run.
  execFileSync("curl", ["--silent", "--show-error", "--fail", "--max-time", "45", "--user-agent", "CeladonChinaPhotoResearch/1.0 (https://celadonchina.com; photo attribution)", "-L", row.downloadUrl, "-o", input]);
  const dimensions = execFileSync("sips", ["-g", "pixelWidth", input], {encoding:"utf8"});
  const width = Math.min(1200, Number(dimensions.match(/pixelWidth: (\d+)/)?.[1] || 1200));
  execFileSync("cwebp", ["-quiet", "-q", "83", "-resize", String(width), "0", input, "-o", row.imgPath]);
  console.log(JSON.stringify({hospital:row.hospitalZh, path:row.imgPath, status:"ok"}));
  await new Promise(resolve => setTimeout(resolve, 10000));
}
