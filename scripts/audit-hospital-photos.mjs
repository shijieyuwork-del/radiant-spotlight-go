import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const normalize = (name) => name.normalize("NFKC").replace(/[\s·•]/g, "").toLocaleLowerCase();
const fields = (node) => new Map(node.properties.filter(ts.isPropertyAssignment).map((p) => [p.name.getText().replace(/["']/g, ""), p.initializer]));
const value = (node) => node && ts.isStringLiteralLike(node) ? node.text : undefined;
const facilities = [];
const citiesText = fs.readFileSync(path.join(root, "src/data/cities.ts"), "utf8");
const citiesSource = ts.createSourceFile("cities.ts", citiesText, ts.ScriptTarget.Latest, true);
let activeCities = [];
const collectOrder = (node) => {
  if (ts.isVariableDeclaration(node) && node.name.getText() === "ASIA_CITY_ORDER" && ts.isArrayLiteralExpression(node.initializer)) activeCities = node.initializer.elements.map(value);
  ts.forEachChild(node, collectOrder);
};
collectOrder(citiesSource);

for (const file of ["cities.ts", "additionalClinics.ts"]) {
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, "src/data", file), "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const p = fields(node);
      if (["zh", "en", "areaZh", "areaEn"].every((name) => p.has(name))) {
        let city;
        let ancestor = node.parent;
        while (ancestor && !city) {
          if (file === "cities.ts" && ts.isObjectLiteralExpression(ancestor)) city = value(fields(ancestor).get("slug"));
          if (file === "additionalClinics.ts" && ts.isPropertyAssignment(ancestor)) city = ancestor.name.getText().replace(/["']/g, "");
          ancestor = ancestor.parent;
        }
        if (activeCities.includes(city)) facilities.push({ city, zh: value(p.get("zh")), en: value(p.get("en")) });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const records = fs.readdirSync(path.join(root, "src/data"))
  .filter((name) => /^real-photos-.*\.json$/.test(name))
  .flatMap((name) => JSON.parse(fs.readFileSync(path.join(root, "src/data", name), "utf8")));
const byName = new Map();
const errors = [];
let totalBytes = 0;
for (const record of records) {
  for (const field of ["hospitalZh", "imgPath", "author", "license", "licenseUrl", "sourceUrl", "description", "modifications"]) {
    if (typeof record[field] !== "string" || !record[field].trim()) errors.push(`${record.hospitalZh}: missing ${field}`);
  }
  if (!record.imgPath.startsWith("src/assets/real-photos/") || !record.imgPath.endsWith(".webp")) errors.push(`Invalid asset path: ${record.imgPath}`);
  for (const field of ["licenseUrl", "sourceUrl"]) {
    if (!/^https:\/\//.test(record[field])) errors.push(`Invalid ${field}: ${record.hospitalZh}`);
  }
  const asset = path.resolve(root, record.imgPath);
  if (!fs.existsSync(asset)) errors.push(`Missing image: ${record.imgPath}`);
  else {
    const buffer = fs.readFileSync(asset);
    if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") errors.push(`Not a WebP image: ${asset}`);
    totalBytes += buffer.length;
  }
  for (const name of [record.hospitalZh, ...(record.aliases ?? [])]) {
    const key = normalize(name);
    if (byName.has(key) && byName.get(key).sourceUrl !== record.sourceUrl) errors.push(`Conflicting photo: ${name}`);
    byName.set(key, record);
  }
}
const matched = facilities.filter((f) => byName.has(normalize(f.zh)) || byName.has(normalize(f.en)));
const unmatched = facilities.filter((f) => !byName.has(normalize(f.zh)) && !byName.has(normalize(f.en)));
console.log(JSON.stringify({
  staticFacilities: facilities.length,
  sourceRecords: records.length,
  matchedCards: matched.length,
  unmatchedCards: unmatched.length,
  byCity: Object.fromEntries(activeCities.map((city) => [city, { total: facilities.filter((f) => f.city === city).length, matched: matched.filter((f) => f.city === city).length }])),
  imageMegabytes: Number((totalBytes / 1024 / 1024).toFixed(2)),
  errors,
  ...(process.argv.includes("--summary") ? {} : { unmatched }),
}, null, 2));
if (errors.length) process.exitCode = 1;
