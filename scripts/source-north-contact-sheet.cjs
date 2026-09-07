const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[3] || 'sharp');

async function main() {
  const rows = JSON.parse(fs.readFileSync('src/data/real-photos-north.json', 'utf8'))
    .filter((row) => fs.existsSync(row.imgPath));
  if (!rows.length) throw new Error('No downloaded images to review');
  const columns = 5;
  const width = 300;
  const height = 224;
  const composites = [];
  for (const [i, row] of rows.entries()) {
    const input = await sharp(row.imgPath)
      .resize(width, 190, { fit: 'contain', background: '#f4f4f4' })
      .png().toBuffer();
    const label = path.basename(row.imgPath, '.webp');
    const title = Buffer.from(`<svg width="300" height="34"><rect width="300" height="34" fill="white"/><text x="8" y="22" font-family="Arial" font-size="13" fill="black">${i + 1}. ${label}</text></svg>`);
    composites.push({input, left: (i % columns) * width, top: Math.floor(i / columns) * height});
    composites.push({input: title, left: (i % columns) * width, top: Math.floor(i / columns) * height + 190});
  }
  await sharp({create: {width: columns * width, height: Math.ceil(rows.length / columns) * height, channels: 3, background: '#ddd'}})
    .composite(composites).jpeg({quality: 88}).toFile(process.argv[2]);
  console.log(`${rows.length} photographs: ${process.argv[2]}`);
}
main().catch((error) => { console.error(error); process.exit(1); });
